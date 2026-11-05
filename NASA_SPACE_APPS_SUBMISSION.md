# AstroVitals: Autonomous Bio-Digital Twin & AI Flight Surgeon
### NASA Space Apps Challenge 2026 • Challenge #5: "Create Health Monitoring Software for Astronauts on Space Missions"
**Team:** 404 Ideas  
**Project Lead:** Team Owner / 404 Ideas  
**Live URL Route:** `/astrovitals` (or `/space`)  
**Repository:** CardioOS / AstroVitals Engine  

---

## 1. Executive Summary & The Pitch

> *"When Houston is 20 Minutes Away, Your AI Flight Surgeon is 0 Seconds Away."*

In deep-space exploration (Artemis lunar base and Mars transit missions), astronauts face extreme physiological deconditioning: cephalad fluid shifts, cardiac atrophy, accelerated bone mineral density (BMD) loss (~1.2%/month), circadian desynchrony, and neuro-cognitive fatigue. 

Traditional terrestrial telemedicine completely collapses because **light speed introduces up to a 22.4-minute one-way communication delay between Mars and Earth**. A 44-minute round trip is fatal during acute cardiovascular crises or rapid decompression sickness.

**AstroVitals** solves this critical gap by delivering an **autonomous, offline-first, bio-digital twin and AI flight surgeon** that operates entirely on local spacecraft hardware. Rather than relying on rigid terrestrial standards (which misdiagnose spaceflight adaptations), AstroVitals continuously benchmarks the astronaut against their **Individual Pre-Flight Baseline**, simulates physiological decay across a 500-day mission timeline, and prescribes closed-loop, deterministic countermeasures grounded in **NASA-STD-3001** and the **NASA Human Research Program (HRP)**.

---

## 2. Key Innovations & Differentiators

### A. Individual Baseline Drift Engine (Dual-Wave Telemetry)
* **The Problem:** In microgravity, hydrostatic pressure gradients vanish, redistributing ~2 liters of blood and interstitial fluids toward the head and chest. Terrestrial reference ranges (e.g., standard blood pressure or resting HRV) are scientifically invalid.
* **Our Solution:** AstroVitals establishes a multidimensional pre-flight baseline for each astronaut (Resting HR, RMSSD HRV, Systolic/Diastolic BP, Bone Density). The system tracks the real-time drift gap (%) across the mission trajectory and flags pathological divergence before clinical symptoms manifest.

### B. Mars Comm-Blackout Mode (Deterministic Autonomy)
* Interactive toggle simulating deep-space latency (0.0s in LEO up to 22.4 minutes on Mars).
* When communications are severed, AstroVitals engages **Autonomous Flight Surgeon Mode**, providing immediate, evidence-backed medical interventions without waiting for Houston Mission Control. Ground escalation telemetry packets are compressed and queued for scheduled burst transmission.

### C. Holographic Interactive SVG Bio-Twin
* Lightweight, zero-latency vector wireframe rendered in code with dynamic CSS pulsing calibrated directly to the calculated heart rate (`animation-duration: 60/BPM`).
* Clickable anatomical focus nodes ([All Systems], [Cardiovascular], [Skeletal Density], [Neural & SANS]) highlighting localized health risks, optic disc swelling / SANS, and lumbar trabecular decay.

### D. Closed-Loop NASA Countermeasure Prescription Engine
* Actionable, protocol-level prescriptions instead of generic text.
* Interventions dynamically adjust resistive loading on the **Advanced Resistive Exercise Device (ARED)**, aerobic intervals on the **Cycle Ergometer with Vibration Isolation System (CEVIS)**, oral isotonic rehydration, and solid-state habitat lighting spectrums (460nm blue morning vs 600nm amber evening).
* Interactive **[Execute Countermeasure Protocol]** button animates immediate physiological stabilization on live graphs.

---

## 3. NASA Data & Scientific Evidence Sources

AstroVitals is rigorously grounded in real NASA data archives:

| NASA Document / Code | Source Archive | System / Clinical Application |
|---|---|---|
| **NASA-STD-3001 Vol 1 Rev B** | NASA Technical Reports Server (NTRS) | Spaceflight Human-System Standard: Clinical thresholds for resting HR, blood pressure, and bone density safety margins. |
| **LSDA-BMD-ISS-04** | NASA Life Sciences Data Archive / OSDR (`osdr.nasa.gov`) | Empirical trabecular bone mineral density loss rates (-1.0% to -1.5% per 30 days) and ARED deadlift/squat resistive load adaptations. |
| **HRP-47052 (Cardiovascular)** | NASA Human Research Roadmap (`humanresearchroadmap.nasa.gov`) | Cephalad fluid shift mechanics, baroreceptor autonomic resetting, and post-flight orthostatic intolerance countermeasures. |
| **HRP-SANS-4819** | NASA Human Research Program Evidence Book | Spaceflight Associated Neuro-ocular Syndrome (SANS): Optic nerve sheath diameter changes and intracranial pressure dynamics. |
| **HRP-BHP-2026** | NASA Behavioral Health & Performance | Circadian misalignment protocols, sleep efficiency thresholds, and cognitive workload moderation. |

---

## 4. System Architecture & Tech Stack

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ASTROVITALS COCKPIT UI                          │
│          React 19 • Tailwind CSS 4 • Framer Motion • Lucide            │
├────────────────────┬───────────────────────────────────┬───────────────┤
│ Left Panel         │ Center Stage                      │ Right Panel   │
│ • Live Vitals      │ • Interactive Holographic Bio-Twin│ • Behavioral  │
│ • Dual-Wave SVG    │ • Real-time Heartbeat Pulse       │   Check-In    │
│ • Drift Gap %      │ • Anatomical Focus Filters        │ • NASA Presc. │
├────────────────────┴───────────────────────────────────┴───────────────┤
│ Bottom Mission Dock: 500-Day Stress-Test Scrubbing Slider              │
│ Presets: Day 1 (Launch) -> Day 180 (Cruise) -> Day 500 (Mars Orbit)   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Local State & REST API
┌───────────────────────────────────▼────────────────────────────────────┐
│                  ASTROVITALS EDGE BACKEND ENGINE                       │
│    FastAPI (Python) • ChromaDB Vectorstore • NASA Standards JSON       │
│                                                                        │
│  GET  /api/space/references  -> Returns NASA HRP & STD-3001 evidence   │
│  POST /api/space/telemetry   -> Runs physiological drift calculations │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. How to Run Locally

### 1. Launch the Frontend (Vite + React)
```bash
cd frontend
npm install
npm run dev
```
Open your browser at `http://localhost:5173/astrovitals` (or click the featured AstroVitals banner on the home page).

### 2. Launch the Edge API (FastAPI)
```bash
# In the project root directory
pip install -r requirements.txt
python -m uvicorn api:app --reload --port 8000
```
API Documentation & NASA Endpoints: `http://localhost:8000/docs`

---

## 6. The 2-Minute Video Pitch Script

* **[0:00 - 0:20] Hook & Danger:**
  *"On Earth, if an astronaut's heart develops an arrhythmia, Houston calls immediately. But on the journey to Mars, radio signals take up to 22 minutes each way. When Earth is 44 minutes away round-trip, an astronaut cannot wait for a flight surgeon."*
* **[0:20 - 0:45] The Innovation:**
  *"Meet AstroVitals: an autonomous, offline-first AI flight surgeon and bio-digital twin built for deep space. Rather than applying terrestrial medical rules, AstroVitals tracks each astronaut's individual pre-flight baseline drift."*
* **[0:45 - 1:25] Live System Demo:**
  *"Watch as we scrub our Mission Day slider from Day 1 to Day 180. The 22-minute communication delay activates. Notice the holographic Bio-Twin pulsing at the astronaut's elevated heart rate, while lumbar bone loss triggers an alert. Clicking 'Execute Countermeasure Protocol' instantly applies NASA-STD-3001 exercise and hydration prescriptions, bringing the astronaut's vitals back to stability."*
* **[1:25 - 2:00] NASA Data & Vision:**
  *"Every insight cites verified NASA Human Research Program and LSDA archives. AstroVitals transforms decades of NASA space medicine into a proactive shield for the Artemis generation."*
