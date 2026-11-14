import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bot, Activity, Bone, Eye, Zap, Radio, ShieldCheck,
  CheckCircle2, ArrowRight, Sliders, ExternalLink
} from 'lucide-react';
import { assetPath } from '../utils/assetPath';

export default function FeaturesPage() {
  const featureList = [
    {
      id: 'aura-ai',
      badge: 'CLINICAL AI COPILOT',
      title: 'AURA Autonomous AI Flight Surgeon',
      subtitle: 'NASA Exploration Medical Capability (ExMC) Local Neural Engine',
      description: 'An onboard clinical decision support system executing deterministic threshold algorithms and neural heuristics directly on spacecraft avionics with zero dependency on Earth connectivity.',
      bullets: [
        'Deterministic evaluation against NASA-STD-3001 Vol 1 thresholds',
        'Dynamic clinical triage across cardiovascular, skeletal, and ocular domains',
        'Automatic countermeasure prescription generation (ARED, LBNP, hydration)',
        'Full bilingual support in professional Arabic and technical English'
      ],
      linkText: 'Open AURA Console',
      linkUrl: '/ai-identity',
      image: assetPath('astronaut_portrait.jpg')
    },
    {
      id: 'bio-twin',
      badge: 'DIAGNOSTIC INSTRUMENTATION',
      title: 'Bio-Digital Twin & Diagnostic Scanners',
      subtitle: 'Multi-Sensor Spaceflight Physiological Ingestion',
      description: 'Real-time telemetry tracking calibrated from NASA Life Sciences Data Archive (LSDA) and ISS human flight data, providing actionable insights into microgravity-induced bodily adaptation.',
      bullets: [
        'Color Doppler Echocardiography trace for 0-G cephalad fluid redistribution (~2L headward)',
        'High-resolution Micro-CT trabecular bone micro-architecture resorption matrix',
        'Portable Ocular Ultrasound scanner tracking Optic Nerve Sheath Diameter (ONSD > 5.8 mm)',
        'Continuous Astroskin 3-lead ECG, HRV RMSSD decay, and arterial pressure monitoring'
      ],
      linkText: 'Launch Live Telemetry Deck',
      linkUrl: '/workspace',
      image: assetPath('hemodynamics_scan.jpg')
    },
    {
      id: 'eva-3d',
      badge: 'INTERACTIVE VIEWPORT',
      title: '3D Zero-G EVA Astronaut & Anatomical X-Ray',
      subtitle: 'Real-Time WebGL Zero-Gravity Biomechanical Simulation',
      description: 'An interactive Three.js 3D model of the astronaut floating weightlessly in deep space, featuring touch and mouse 360° orbital manipulation and anatomical X-Ray bio-scan mode.',
      bullets: [
        '360° orbital rotation with inertia damping and touch-drag support',
        'Anatomical X-Ray scan rendering bioluminescent pulsating heart synced to live BPM',
        'Spinal column color-coded dynamically based on bone mineral density retention',
        'Chest-mounted Display and Control Module (DCM) with live tri-color telemetry LEDs'
      ],
      linkText: 'Inspect 3D Spacesuit',
      linkUrl: '/workspace',
      image: assetPath('sans_scan.jpg')
    },
    {
      id: 'countermeasures',
      badge: 'INTERVENTION PROTOCOLS',
      title: 'NASA Countermeasure Flight Operations',
      subtitle: 'ARED Resistive Pod & LBNP Autonomous Therapy',
      description: 'Dynamic execution of targeted physiological countermeasures designed to arrest skeletal bone demineralization and prevent cardiovascular collapse upon planetary insertion.',
      bullets: [
        'Advanced Resistive Exercise Device (ARED) hydraulic loading adjustments (+12.5% deadlift/squat)',
        'Lower Body Negative Pressure (LBNP) 30-minute decompression sessions at -30 mmHg',
        'Hypercalciuria and renal nephrolithiasis mitigation via targeted oral electrolyte rehydration',
        'Instant one-click protocol execution with live telemetry recovery verification'
      ],
      linkText: 'Execute Countermeasures',
      linkUrl: '/workspace',
      image: assetPath('ared_exercise.jpg')
    }
  ];

  return (
    <div className="space-y-8 sm:space-y-12 max-w-6xl mx-auto px-3.5 sm:px-8 py-3 sm:py-4">
      {/* Header Banner */}
      <section className="p-5 sm:p-8 md:p-12 rounded-2xl sm:rounded-[32px] cinematic-card-bg border border-white/[0.08] shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2 sm:space-y-3">
          <span className="text-[10px] font-mono-tech text-[#E4783B] uppercase tracking-widest block">
            CLINICAL SPECIFICATIONS • NASA-STD-3001
          </span>
          <h1 className="font-titan text-2xl sm:text-4xl lg:text-5xl text-[#EBEBEB] uppercase leading-tight tracking-wide">
            EXPLORE PLATFORM CLINICAL FEATURES
          </h1>
          <p className="text-xs sm:text-sm text-[#ACACAC] leading-relaxed">
            Every instrument, diagnostic scanner, and autonomous intervention protocol is engineered specifically for long-duration deep space exploration.
          </p>
        </div>
      </section>

      {/* Feature Showcase Rows */}
      <section className="space-y-6 sm:space-y-8">
        {featureList.map((feat, idx) => (
          <div
            key={feat.id}
            className={`p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-[28px] bg-[#171311] border border-white/[0.08] grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center ${
              idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}
          >
            {/* Visual Preview */}
            <div className={`lg:col-span-5 relative rounded-2xl overflow-hidden border border-white/10 shadow-xl h-64 sm:h-72 group ${
              idx % 2 === 1 ? 'lg:order-2' : ''
            }`}>
              <img
                src={feat.image}
                alt={feat.title}
                className="w-full h-full object-cover filter brightness-95 contrast-105 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B0A] via-[#0D0B0A]/20 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className="text-[9px] font-mono-tech px-2.5 py-1 rounded-full bg-[#0D0B0A]/90 text-[#E4783B] border border-[#E4783B]/40 font-bold uppercase backdrop-blur-md">
                  {feat.badge}
                </span>
              </div>
            </div>

            {/* Description & Bullets */}
            <div className={`lg:col-span-7 space-y-4 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
              <div>
                <span className="text-[10px] font-mono-tech text-[#E4783B] uppercase tracking-wider block mb-1">
                  {feat.subtitle}
                </span>
                <h3 className="font-titan text-xl sm:text-2xl text-[#EBEBEB] uppercase tracking-wide">
                  {feat.title}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-[#ACACAC] leading-relaxed font-sans">
                {feat.description}
              </p>

              <ul className="space-y-2 text-xs text-[#EBEBEB] font-sans">
                {feat.bullets.map((b, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-2">
                    <CheckCircle2 size={15} className="text-[#E4783B] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2">
                <Link
                  to={feat.linkUrl}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#E4783B] hover:bg-[#d46a30] text-[#0D0B0A] font-bold text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(228,120,59,0.3)] hover:scale-105"
                >
                  <span>{feat.linkText}</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
