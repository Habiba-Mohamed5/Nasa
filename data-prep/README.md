# ASTRA Phase 1

Run these commands from the repository root with Python 3.10+.

```sh
python -B -m unittest discover -s data-prep -v
python -B data-prep/pipeline.py --download --cache data-prep/local/raw --out data-prep/local/prepared --static data-prep/local/demo
npm ci
npm run dev
```

Visit `/#/workspace` and expand **Recorded telemetry** in the telemetry column. The checked-in Vite asset is `public/telemetry/bidmc-recorded.json`. To refresh it, copy `data-prep/local/demo/recorded.json` to that path. The pipeline also accepts `--input-dir` for existing CSV and Fix files or `--zip` for the official PhysioNet archive.

The pipeline keeps the signed source time and derives elapsed time from the first sample. Missing values become JSON null. It assigns patients to train, validation and test before exporting recordings. Patient identifiers from the metadata stay local. The two deterministic simulation scenarios replay a training recording and mask its signal between elapsed seconds 20 and 30, respectively. They are generated under `data-prep/local/prepared/simulated/`.

Only the single attributed training recording is served to the frontend. The panel loads it on demand from the deployment origin. Vercel can serve the normal Vite build without new functions, scheduled jobs or services.

The verified BIDMC v1.0.0 run produced 53 recordings from 46 source patients, with 25,493 samples. Train, validation and test contain 38, 8 and 7 recordings, respectively. See [the catalog](DATA-CATALOG.md) for provenance, units, and NASA references.
