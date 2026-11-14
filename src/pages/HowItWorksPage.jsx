import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity, Cpu, ShieldAlert, Zap, Radio, CheckCircle2,
  ArrowRight, FileText, Database, Compass
} from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'Multimodal Sensor Ingestion',
      subtitle: 'Body Area Network & Point-of-Care Hardware',
      desc: 'Astronauts wear Astroskin smart garments capturing continuous 3-lead ECG, HRV RMSSD, respiration, and blood pressure. Point-of-care devices (portable ultrasound Butterfly iQ, i-STAT blood/urine analyzers) feed diagnostic data directly into the spacecraft avionics data bus.',
      details: [
        'Continuous raw ECG & baroreceptor vagal tone monitoring',
        'Jugular venous Doppler echo velocity (flow rate ~84 cm/s)',
        'Optic nerve sheath diameter (ONSD) ultrasound scans',
        'Urinary calcium turnover analysis for hypercalciuria'
      ],
      icon: Activity
    },
    {
      num: '02',
      title: 'Local Edge Inference & Baseline Drift Tracking',
      subtitle: 'Zero Earth Latency Avionics Engine',
      desc: 'The onboard neural core runs localized heuristics grounded in the NASA Integrated Medical Model (IMM) and Human Research Program evidence base. It continuously compares telemetry against each astronaut’s pre-flight baseline (Day 1) to identify physiological degradation.',
      details: [
        'Real-time calculation of cephalad fluid shift index (0-100%)',
        'Trabecular bone mineral density (BMD) decay projection (-1.2%/30 days)',
        'Cardiovascular deconditioning index & plasma deficit calculation',
        'NASA-STD-3001 threshold rule triggers (Warnings at >15% drift)'
      ],
      icon: Cpu
    },
    {
      num: '03',
      title: 'Autonomous Clinical Decision Triage',
      subtitle: 'ExMC Clinical Decision Support System (AURA)',
      desc: 'When telemetry breaches NASA-STD-3001 caution or alert bounds, AURA automatically conducts diagnostic triage. It establishes severity classifications (Nominal, Caution, Critical Tier 1) and formulates medical recommendations without waiting for Ground Control approval.',
      details: [
        'Cardiovascular decompensation triage (Tier 1 Orthostatic Intolerance)',
        'SANS optic disc edema risk evaluation (Tier 1 Critical Vision Risk)',
        'Renal nephrolithiasis stone precipitation risk estimation (Tier 2 Warning)',
        'Autonomous Emergency Override during Solar Particle Events & Blackouts'
      ],
      icon: ShieldAlert
    },
    {
      num: '04',
      title: 'Closed-Loop Countermeasure Prescription',
      subtitle: 'Physical & Pharmacological Prescriptions',
      desc: 'AURA formulates targeted, actionable daily intervention schedules. The crew receives calibrated prescriptions adjusting exercise regimens, lower body negative pressure decompression sessions, and nutritional/electrolyte intake.',
      details: [
        'ARED hydraulic deadlift & squat load adjustment (+12.5% loading)',
        'Lower Body Negative Pressure (LBNP) chamber sessions (-30 mmHg, 30m)',
        'Isotonic electrolyte fluid restoration (750ml–1000ml oral rehydration)',
        'Habitat Solid-State Lighting (SLA) spectral tuning for circadian rhythm'
      ],
      icon: Zap
    },
    {
      num: '05',
      title: 'Mission Trajectory Feedback & DSN Uplink',
      subtitle: 'Closed-Loop Outcome Verification',
      desc: 'Post-intervention telemetry verifies whether physiological stabilization criteria have been fulfilled. As soon as the DSN radio window re-establishes, AURA compiles an encrypted 50KB mission medical packet to synchronize with Houston Mission Control.',
      details: [
        'Real-time verification of HRV vagal tone recovery and blood pressure rebound',
        'Compilation of compact 50KB telemetry packets for Deep Space Network transmission',
        'Automated longitudinal medical logging across the 500-day journey',
        'Continuous crew readiness score updates prior to Mars Orbital Insertion'
      ],
      icon: Radio
    }
  ];

  return (
    <div className="space-y-8 sm:space-y-12 max-w-6xl mx-auto px-3.5 sm:px-8 py-3 sm:py-4">
      {/* 1. Header Banner */}
      <section className="p-5 sm:p-8 md:p-12 rounded-2xl sm:rounded-[32px] cinematic-card-bg border border-[rgba(180,210,235,0.14)] shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2 sm:space-y-3">
          <span className="text-[10px] font-mono-tech text-[#7AD7EA] uppercase tracking-widest block">
            HOW IT WORKS • END-TO-END CLINICAL ARCHITECTURE
          </span>
          <h1 className="font-titan text-2xl sm:text-4xl lg:text-5xl text-[#F4F7FC] uppercase leading-tight tracking-wide">
            THE AUTONOMOUS CLINICAL WORKFLOW
          </h1>
          <p className="text-xs sm:text-sm text-[#C7D2E3] leading-relaxed">
            From biosensors on the astronaut’s body to real-time neural diagnosis and closed-loop countermeasure execution.
          </p>
        </div>
      </section>

      {/* 2. Step-by-Step Interactive Workflow */}
      <section className="space-y-6">
        <div className="space-y-6">
          {steps.map((st, i) => {
            const Icon = st.icon;
            return (
              <div
                key={st.num}
                className="p-6 sm:p-8 rounded-[28px] bg-[#132238]/85 backdrop-blur-md border border-[rgba(180,210,235,0.14)] hover:border-[#7AD7EA]/40 transition-all grid grid-cols-1 md:grid-cols-12 gap-6 items-start"
              >
                {/* Number & Icon */}
                <div className="md:col-span-3 flex md:flex-col items-center md:items-start justify-between gap-4">
                  <span className="font-titan text-4xl sm:text-5xl text-[#7AD7EA] drop-shadow-[0_0_20px_rgba(122,215,234,0.3)]">
                    {st.num}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-[#7AD7EA]/15 border border-[#7AD7EA]/30 flex items-center justify-center text-[#7AD7EA]">
                    <Icon size={24} />
                  </div>
                  <span className="text-[10px] font-mono-tech text-[#98A7BD] uppercase block">
                    STEP {st.num} OF 05
                  </span>
                </div>

                {/* Content */}
                <div className="md:col-span-9 space-y-3">
                  <div>
                    <span className="text-[10px] font-mono-tech text-[#7AD7EA] uppercase tracking-wider block mb-1">
                      {st.subtitle}
                    </span>
                    <h3 className="font-titan text-xl sm:text-2xl text-[#F4F7FC] uppercase tracking-wide">
                      {st.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-[#C7D2E3] leading-relaxed font-sans">
                    {st.desc}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {st.details.map((d, dIdx) => (
                      <div key={dIdx} className="p-2.5 rounded-xl bg-[#0D1728] border border-[rgba(180,210,235,0.1)] flex items-start gap-2 text-xs text-[#F4F7FC]">
                        <CheckCircle2 size={13} className="text-[#7AD7EA] shrink-0 mt-0.5" />
                        <span className="text-[11px] leading-snug">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Bottom CTA */}
      <section className="p-8 rounded-[28px] bg-[#132238]/90 backdrop-blur-md border border-[rgba(180,210,235,0.14)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-titan text-xl text-[#F4F7FC] uppercase">
            EXPERIENCE THE PLATFORM IN ACTION
          </h3>
          <p className="text-xs text-[#C7D2E3] mt-1">
            Access the live Mission Control Workspace to interact with the 3D astronaut and execute countermeasures.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/workspace"
            className="px-6 py-2.5 rounded-full bg-[#E4783B] text-[#07111F] font-bold text-xs tracking-wider transition-all hover:bg-[#d46a30] shadow-[0_0_18px_rgba(228,120,59,0.3)]"
          >
            ENTER WORKSPACE
          </Link>
          <Link
            to="/ai-identity"
            className="px-6 py-2.5 rounded-full bg-[#182A44] text-[#F4F7FC] border border-[#7AD7EA]/30 font-bold text-xs tracking-wider transition-all hover:bg-[#1f3657]"
          >
            AURA SURGEON
          </Link>
        </div>
      </section>
    </div>
  );
}
