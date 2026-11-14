import json
import tempfile
import unittest
from pathlib import Path
from pipeline import IDS, build, parse_csv, patient_group, recording, simulations, split_manifest

# Parser fixtures only. These values are never exported as recorded data.
HEADER = b"Time [s], HR, PULSE, RESP, SpO2\n"
FIXTURE = HEADER + b"0,94,93,25,97\n20,95,NaN,25,\n30,92,94,25,0\n"


GROUPS = {subject: f"s{i:05}" for i, subject in enumerate(IDS)}


def fixture_file(name):
    subject = name[:8]
    if name.endswith("_Fix.txt"):
        return f"MIMIC II matched wdb ID: {GROUPS[subject]}\n".encode()
    return FIXTURE


class PipelineTests(unittest.TestCase):
    def test_units_time_and_missing(self):
        first, second, last = parse_csv(FIXTURE)
        self.assertEqual(first["values"]["heart_rate"], 94)
        self.assertEqual(first["values"]["pulse_rate"], 93)
        self.assertEqual(second["elapsed_s"], 20)
        self.assertIsNone(second["values"]["pulse_rate"])
        self.assertIsNone(second["values"]["spo2"])
        self.assertEqual(last["values"]["spo2"], 0)

    def test_invalid_source(self):
        for raw in (b"error", HEADER, HEADER + b"0,1,2,3,inf\n",
                    FIXTURE + b"30,1,2,3,4\n",
                    HEADER + b"0,1,2,3\n"):
            with self.subTest(raw=raw), self.assertRaises(ValueError):
                parse_csv(raw)

    def test_splits(self):
        splits = split_manifest(GROUPS)
        subjects = sum(splits.values(), [])
        self.assertEqual([len(group) for group in splits.values()], [37, 8, 8])
        self.assertEqual(sorted(subjects), IDS)
        self.assertEqual(splits, split_manifest(GROUPS))

    def test_relative_offset_and_patient_grouping(self):
        rows = parse_csv(HEADER + b"-1,1,2,3,4\n0,1,2,3,4\n")
        self.assertEqual([(r["source_offset_s"], r["elapsed_s"]) for r in rows],
                         [(-1, 0), (0, 1)])
        groups = {**GROUPS, IDS[1]: GROUPS[IDS[0]]}
        self.assertTrue(any(set(IDS[:2]) <= set(split) for split in split_manifest(groups).values()))
        with self.assertRaises(ValueError):
            patient_group(b"missing patient identifier")

    def test_simulation_preserves_source_and_repeats(self):
        source = recording(IDS[0], FIXTURE)
        replay, dropout = list(simulations(source))
        self.assertEqual([replay, dropout], list(simulations(source)))
        self.assertEqual(source["data_source"], "RECORDED")
        self.assertEqual(dropout["data_source"], "SIMULATED")
        self.assertEqual(dropout["provenance"]["parent_stream_id"], IDS[0])
        self.assertEqual(replay["samples"], source["samples"])
        self.assertTrue(all(v is None for v in dropout["samples"][1]["values"].values()))
        self.assertEqual(dropout["samples"][2], source["samples"][2])

    def test_build_outputs(self):
        with tempfile.TemporaryDirectory() as directory:
            out = Path(directory) / "prepared"
            public = Path(directory) / "public"
            build(fixture_file, out, public)
            demo = json.loads((public / "recorded.json").read_text())
            self.assertIn(demo["stream_id"], split_manifest(GROUPS)["train"])
            self.assertEqual(len(list((out / "test").glob("*.json"))), 8)
            audit = json.loads((out / "audit.json").read_text())
            self.assertEqual(audit[demo["stream_id"]]["gaps_over_one_second"], 2)
            self.assertEqual(audit[demo["stream_id"]]["missing"]["spo2"], 1)

    def test_missing_input_does_not_publish(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            def load(subject):
                if subject == f'{IDS[-1]}_Numerics.csv':
                    raise FileNotFoundError(subject)
                return fixture_file(subject)
            with self.assertRaises(FileNotFoundError):
                build(load, root / "out", root / "public")
            self.assertFalse((root / "public" / "recorded.json").exists())


if __name__ == "__main__":
    unittest.main()
