# ASTRA Phase 1 Data Catalog

| Source | Population and scope | Phase 1 use | Access |
| --- | --- | --- | --- |
| [PhysioNet BIDMC v1.0.0](https://physionet.org/content/bidmc/1.0.0/) | 53 terrestrial hospital ICU recordings, about eight minutes each. This release contains 46 distinct MIMIC II matched waveform patient identifiers. | `RECORDED` numerics at nominal 1 Hz. `_Fix.txt` supplies patient grouping locally. Waveforms, breath annotations and demographics are outside the import scope. | Public under [ODC-BY 1.0](https://opendatacommons.org/licenses/by/1-0/). |
| [NASA Space Apps official challenge](https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/) | Astronaut health monitoring during long-duration missions. | Defines the software brief and the spaceflight context. | Public challenge description. |
| [NASA Open Science Data Repository](https://science.nasa.gov/biological-physical/data/osdr/) | Study-level spaceflight and analog research across humans and other organisms. | Research reference in this phase. Any future ingestion should document the accession, population, assay, timing, units and access policy. | [NASA OSDR access FAQ](https://science.nasa.gov/reference/osdr-faq/). |
| ASTRA replay and dropout | Input is one BIDMC training recording. | `SIMULATED` stream for playback and missing-signal testing. | Derived under the BIDMC attribution terms. |
| Live device | Future sensor interface. | `LIVE` is reserved in the schema. | Pending hardware integration. |

BIDMC attribution: Pimentel, M. A. F., Johnson, A. E. W., Charlton, P. H., and Clifton, D. A. (2018). BIDMC PPG and Respiration Dataset, version 1.0.0, PhysioNet. [Dataset DOI](https://doi.org/10.13026/C2208R). The packaged example converts the original numerics CSV to JSON and represents missing cells as null.

| Source column | Schema field | Unit |
| --- | --- | --- |
| Time [s] | source_offset_s | s, relative to the CSV reference |
| HR | heart_rate | beats/min, ECG-derived |
| PULSE | pulse_rate | beats/min, PPG-derived |
| RESP | respiratory_rate | breaths/min, monitor-derived |
| SpO2 | spo2 | %, as delivered |
