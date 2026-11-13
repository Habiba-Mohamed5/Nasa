import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Activity, Bone, Eye, Radio, CheckCircle2, Bot, ArrowRight, Database } from 'lucide-react';
import { NASA_REFERENCES } from '../data/nasaKnowledgeBase';

export default function AboutPage() {
  return (
    <div className="space-y-12 max-w-6xl mx-auto px-4 sm:px-8 py-4">
      {/* 1. Header Banner */}
      <section className="p-8 sm:p-12 rounded-[32px] cinematic-card-bg border border-white/[0.08] shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="text-[10px] font-mono-tech text-[#E4783B] uppercase tracking-widest block">
            ABOUT ASTROVITALS • NASA SPACE APPS 2026
          </span>
          <h1 className="font-titan text-3xl sm:text-4xl lg:text-5xl text-[#EBEBEB] uppercase leading-tight tracking-wide">
            REVOLUTIONIZING DEEP SPACE ASTRONAUT HEALTHCARE
          </h1>
          <p className="text-xs sm:text-sm text-[#ACACAC] leading-relaxed">
            AstroVitals is an autonomous bio-digital twin and clinical decision support system (CDSS) engineered for deep space exploration missions where real-time medical evacuation to Earth is physically impossible.
          </p>
        </div>
      </section>

      {/* 2. The Core Problem: The Deep Space Physiological Challenge */}
      <section className="space-y-6">
        <div className="border-b border-white/[0.08] pb-4">
          <span className="text-[10px] font-mono-tech text-[#E4783B] uppercase tracking-widest block mb-1">
            PHYSIOLOGICAL & OPERATIONAL VULNERABILITIES
          </span>
          <h2 className="font-titan text-2xl text-[#EBEBEB] uppercase tracking-wide">
            THE HAZARDS OF A 500-DAY TRANSIT TO MARS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Hazard 1: Fluid Shift & Hemodynamics */}
          <div className="p-6 rounded-2xl bg-[#171311] border border-white/[0.06] space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#E4783B]/15 text-[#E4783B] flex items-center justify-center">
                <Activity size={18} />
              </div>
              <h3 className="text-sm font-bold text-[#EBEBEB] font-sans">
                Cephalad Fluid Redistribution (~2 Liters)
              </h3>
            </div>
            <p className="text-xs text-[#ACACAC] leading-relaxed">
              Without hydrostatic gravity, approximately 2,000 ml of bodily fluid shifts headward, causing facial edema, jugular vein engorgement, reduced stroke volume, and autonomic cardiovascular deconditioning.
            </p>
          </div>

          {/* Hazard 2: Trabecular Bone Decay */}
          <div className="p-6 rounded-2xl bg-[#171311] border border-white/[0.06] space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#E4783B]/15 text-[#E4783B] flex items-center justify-center">
                <Bone size={18} />
              </div>
              <h3 className="text-sm font-bold text-[#EBEBEB] font-sans">
                Trabecular Bone Demineralization (1.2% / Month)
              </h3>
            </div>
            <p className="text-xs text-[#ACACAC] leading-relaxed">
              Skeletal unloading accelerates osteoclast resorption in weight-bearing bones (lumbar spine, femoral neck), elevating urinary calcium excretion and triggering acute renal stone (nephrolithiasis) risks.
            </p>
          </div>

          {/* Hazard 3: SANS Optic Pressure */}
          <div className="p-6 rounded-2xl bg-[#171311] border border-white/[0.06] space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#E4783B]/15 text-[#E4783B] flex items-center justify-center">
                <Eye size={18} />
              </div>
              <h3 className="text-sm font-bold text-[#EBEBEB] font-sans">
                Spaceflight Associated Neuro-Ocular Syndrome (SANS)
              </h3>
            </div>
            <p className="text-xs text-[#ACACAC] leading-relaxed">
              Chronic intracranial venous hypertension enlarges the optic nerve sheath diameter (ONSD &gt; 5.8 mm), producing posterior globe flattening, choroidal folds, and hyperopic vision deterioration.
            </p>
          </div>

          {/* Hazard 4: Comm Blackout & Latency */}
          <div className="p-6 rounded-2xl bg-[#171311] border border-white/[0.06] space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#E4783B]/15 text-[#E4783B] flex items-center justify-center">
                <Radio size={18} />
              </div>
              <h3 className="text-sm font-bold text-[#EBEBEB] font-sans">
                DSN Communication Latency (Up to 22.4 Minutes)
              </h3>
            </div>
            <p className="text-xs text-[#ACACAC] leading-relaxed">
              At 55–400 million kilometers from Earth, speed-of-light radio delay renders tele-medicine and live consultation with Houston Flight Surgeons impossible during critical medical emergencies.
            </p>
          </div>
        </div>
      </section>

      {/* 3. The Solution: AstroVitals System Architecture */}
      <section className="p-8 rounded-[28px] bg-[#171311] border border-white/[0.08] space-y-6">
        <div className="border-b border-white/[0.08] pb-4">
          <span className="text-[10px] font-mono-tech text-[#E4783B] uppercase tracking-widest block mb-1">
            ENGINEERING & MEDICAL ARCHITECTURE
          </span>
          <h2 className="font-titan text-2xl text-[#EBEBEB] uppercase tracking-wide">
            HOW ASTROVITALS SOLVES DEEP SPACE MEDICAL AUTONOMY
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#ACACAC] leading-relaxed">
          <div className="space-y-2">
            <div className="font-bold text-[#EBEBEB] text-sm font-sans flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#E4783B]/20 text-[#E4783B] font-mono-tech text-xs flex items-center justify-center font-bold">1</span>
              <span>Multi-Sensor Telemetry Ingestion</span>
            </div>
            <p>
              Integrates Astroskin smart undershirt continuous ECG, portable ocular ultrasound (Butterfly iQ), and i-STAT blood/urine electrolyte analyzers into an onboard unified data matrix.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-[#EBEBEB] text-sm font-sans flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#E4783B]/20 text-[#E4783B] font-mono-tech text-xs flex items-center justify-center font-bold">2</span>
              <span>Offline Edge Neural Core (AURA)</span>
            </div>
            <p>
              Runs deterministic heuristics and neural decision pipelines locally on the spacecraft’s avionics, compliant with NASA-STD-3001 Vol 1 Rev B threshold rules without requiring Earth connectivity.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-[#EBEBEB] text-sm font-sans flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#E4783B]/20 text-[#E4783B] font-mono-tech text-xs flex items-center justify-center font-bold">3</span>
              <span>Closed-Loop Countermeasures</span>
            </div>
            <p>
              Prescribes and regulates Advanced Resistive Exercise Device (ARED) loading, Lower Body Negative Pressure (LBNP) protocols, and electrolyte oral rehydration therapies dynamically.
            </p>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap gap-4 items-center">
          <Link
            to="/features"
            className="px-6 py-2.5 rounded-full bg-[#E4783B] text-[#0D0B0A] font-bold text-xs tracking-wider transition-all hover:bg-[#d46a30]"
          >
            EXPLORE CLINICAL FEATURES
          </Link>
          <Link
            to="/ai-identity"
            className="px-6 py-2.5 rounded-full bg-[#252121] text-[#EBEBEB] border border-white/10 font-bold text-xs tracking-wider transition-all hover:bg-white/5"
          >
            CONSULT AURA AI SURGEON
          </Link>
        </div>
      </section>

      {/* 4. Scientific Grounding & Citations */}
      <section className="space-y-4">
        <h3 className="text-xs font-mono-tech text-[#808080] uppercase tracking-wider">
          GROUNDED SCIENTIFIC STANDARDS & ARCHIVES
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {NASA_REFERENCES.map((ref) => (
            <div key={ref.id} className="p-4 rounded-xl bg-[#171311] border border-white/[0.06] space-y-1.5">
              <span className="text-[9px] font-mono-tech text-[#E4783B] px-1.5 py-0.5 rounded bg-[#E4783B]/10 border border-[#E4783B]/20">
                {ref.documentCode}
              </span>
              <h4 className="text-xs font-bold text-[#EBEBEB] line-clamp-1">{ref.title}</h4>
              <p className="text-[10px] text-[#808080] line-clamp-2">{ref.evidenceSummary}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
