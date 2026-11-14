import argparse
import csv
import hashlib
import io
import json
import math
import re
import zipfile
from pathlib import Path
from urllib.request import urlopen

BASE = "https://physionet.org/files/bidmc/1.0.0/"
IDS = [f"bidmc_{i:02}" for i in range(1, 54)]
CHANNELS = {"HR": "heart_rate", "PULSE": "pulse_rate",
            "RESP": "respiratory_rate", "SpO2": "spo2"}
UNITS = {"heart_rate": "beats/min", "pulse_rate": "beats/min",
         "respiratory_rate": "breaths/min", "spo2": "%"}
MISSING = {"", "nan", "na", "n/a", "null"}


def patient_group(metadata):
    matches = re.findall(r"^MIMIC II matched wdb ID: (s[0-9]+)\s*$",
                         metadata.decode("utf-8-sig"), re.MULTILINE)
    if len(matches) != 1:
        raise ValueError("Expected exactly one source patient identifier")
    return matches[0]


def split_manifest(groups):
    patients = sorted(set(groups.values()), key=lambda patient: (
        hashlib.sha256(f"astra-bidmc-v1:{patient}".encode()).hexdigest(), patient))
    cut_train = round(len(patients) * 0.70)
    cut_validation = round(len(patients) * 0.85)
    partitions = {"train": patients[:cut_train],
                  "validation": patients[cut_train:cut_validation],
                  "test": patients[cut_validation:]}
    return {split: sorted(record for record, patient in groups.items() if patient in assigned)
            for split, assigned in partitions.items()}


def parse_csv(raw):
    reader = csv.reader(io.StringIO(raw.decode("utf-8-sig")))
    header = [field.strip() for field in next(reader, [])]
    expected = {"Time [s]", *CHANNELS}
    if len(header) != len(expected) or set(header) != expected:
        raise ValueError(f"Unexpected BIDMC columns: {header}")

    rows = []
    for fields in reader:
        if not fields:
            continue
        if len(fields) != len(header):
            raise ValueError(f"Wrong column count on line {reader.line_num}")
        original = dict(zip(header, map(str.strip, fields)))
        seconds = float(original["Time [s]"])
        if not math.isfinite(seconds) or (rows and seconds <= rows[-1]["source_offset_s"]):
            raise ValueError(f"Invalid or unordered timestamp on line {reader.line_num}")
        start = rows[0]["source_offset_s"] if rows else seconds
        values = {}
        for field, metric in CHANNELS.items():
            cell = original[field]
            value = None if cell.lower() in MISSING else float(cell)
            if value is not None and not math.isfinite(value):
                raise ValueError(f"Nonfinite {field} on line {reader.line_num}")
            values[metric] = value
        rows.append({"elapsed_s": seconds - start, "source_offset_s": seconds,
                     "values": values, "sensor_status": "UNKNOWN"})
    if not rows:
        raise ValueError("Empty BIDMC recording")
    return rows


def recording(subject, raw):
    return {"schema_version": "1.0.0", "data_source": "RECORDED", "stream_id": subject,
            "time_basis": "ELAPSED_SECONDS", "units": UNITS,
            "provenance": {"source_url": f"{BASE}bidmc_csv/{subject}_Numerics.csv",
                           "dataset_version": "1.0.0", "cohort": "terrestrial hospital ICU patients",
                           "sha256": hashlib.sha256(raw).hexdigest()},
            "samples": parse_csv(raw)}


def simulations(source):
    for scenario in ("RECORDED_REPLAY", "SIGNAL_DROPOUT_20_30S"):
        samples = []
        for row in source["samples"]:
            if scenario == "SIGNAL_DROPOUT_20_30S" and 20 <= row["elapsed_s"] < 30:
                samples.append({**row, "values": dict.fromkeys(UNITS),
                                "sensor_status": "SIMULATED_DROPOUT"})
            else:
                samples.append(row)
        yield {**source, "data_source": "SIMULATED", "stream_id": scenario,
               "provenance": {**source["provenance"], "parent_stream_id": source["stream_id"],
                              "scenario": scenario, "scenario_version": "1"},
               "samples": samples}


def download(name, cache):
    path = cache / name
    if path.exists():
        return path.read_bytes()
    with urlopen(f"{BASE}bidmc_csv/{path.name}", timeout=30) as response:
        raw = response.read()
    if name.endswith("_Numerics.csv"):
        parse_csv(raw)
    else:
        patient_group(raw)
    temporary = path.with_suffix(".tmp")
    temporary.write_bytes(raw)
    temporary.replace(path)
    return raw


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(".tmp")
    temporary.write_text(json.dumps(value, allow_nan=False, separators=(",", ":")) + "\n",
                         encoding="utf-8")
    temporary.replace(path)


def build(load, out, static):
    groups = {subject: patient_group(load(f"{subject}_Fix.txt")) for subject in IDS}
    splits = split_manifest(groups)
    by_subject = {subject: split for split, subjects in splits.items() for subject in subjects}
    records = {}
    audit = {}
    for subject in IDS:
        record = recording(subject, load(f"{subject}_Numerics.csv"))
        samples = record["samples"]
        records[subject] = record
        audit[subject] = {"rows": len(samples), "first_s": samples[0]["elapsed_s"],
                          "last_s": samples[-1]["elapsed_s"],
                          "gaps_over_one_second": sum(b["elapsed_s"] - a["elapsed_s"] > 1
                                                     for a, b in zip(samples, samples[1:])),
                          "missing": {metric: sum(row["values"][metric] is None for row in samples)
                                      for metric in UNITS},
                          "sha256": record["provenance"]["sha256"]}
    for subject, record in records.items():
        write_json(out / by_subject[subject] / f"{subject}.json", record)
    write_json(out / "splits.json", {"patient_count": len(set(groups.values())), "splits": splits})
    write_json(out / "audit.json", audit)
    demo = records[splits["train"][0]]
    write_json(static / "recorded.json", demo)
    for replay in simulations(demo):
        write_json(out / "simulated" / f'{replay["stream_id"]}.json', replay)


def main():
    parser = argparse.ArgumentParser(description="Prepare ASTRA Phase 1 from BIDMC Numerics")
    inputs = parser.add_mutually_exclusive_group(required=True)
    inputs.add_argument("--download", action="store_true")
    inputs.add_argument("--zip", type=Path, help="Official PhysioNet BIDMC ZIP")
    inputs.add_argument("--input-dir", type=Path, help="Directory with official Numerics and Fix files")
    parser.add_argument("--cache", type=Path, default=Path("local/raw"))
    parser.add_argument("--out", type=Path, default=Path("local/prepared"))
    parser.add_argument("--static", type=Path, default=Path("preview"))
    args = parser.parse_args()

    if args.download:
        args.cache.mkdir(parents=True, exist_ok=True)
        build(lambda name: download(name, args.cache), args.out, args.static)
    elif args.input_dir:
        build(lambda name: (args.input_dir / name).read_bytes(), args.out, args.static)
    else:
        with zipfile.ZipFile(args.zip) as archive:
            files = {}
            for name in archive.namelist():
                basename = Path(name).name
                if basename.endswith(("_Numerics.csv", "_Fix.txt")):
                    if basename in files:
                        raise ValueError(f"Duplicate archive member: {basename}")
                    files[basename] = name
            build(lambda name: archive.read(files[name]), args.out, args.static)
    print(f"Prepared {len(IDS)} recordings. See {args.out / 'audit.json'}.")


if __name__ == "__main__":
    main()
