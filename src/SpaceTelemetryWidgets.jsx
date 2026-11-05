import React from 'react';
import { Radio, AlertTriangle, ShieldCheck, Zap, Activity } from 'lucide-react';

/**
 * 1. Cephalad Hemodynamic & Fluid-Shift Instrument
 * Replaces generic hospital ECG with NASA microgravity fluid redistribution metrics
 */
export function HemodynamicFluidWidget({ telemetry, bpm, hrv }) {
  const isHighShift = telemetry.fluidShiftIndex > 70;
  const shiftColor = isHighShift ? '#FF2A55' : telemetry.fluidShiftIndex > 50 ? '#FFB800' : '#00F0FF';

  return (
    <div className="p-4 bg-slate-950/85 border border-cyan-500/30 rounded-2xl backdrop-blur-xl shadow-2xl transition-all hover:border-cyan-400">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            {/* Aerospace Fluid Redistribution Vector Icon */}
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M12 2l4 4M12 2L8 6" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="14" r="5" strokeDasharray="2 2" />
            </svg>
          </div>
          <div>
            <h4 className="text-xs font-black text-white tracking-wider">انتقال السوائل الرأسي والهيموديناميكا</h4>
            <span className="text-[10px] text-slate-400 font-mono">0-G Cephalad Hemodynamics</span>
          </div>
        </div>
        <span
          className="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
          style={{ backgroundColor: `${shiftColor}22`, color: shiftColor, border: `1px solid ${shiftColor}44` }}
        >
          {isHighShift ? 'احتقان رأسي مرتفع' : 'تأقلم مستقر'}
        </span>
      </div>

      {/* Main Metric Digits */}
      <div className="grid grid-cols-2 gap-2 my-2.5 p-2 bg-slate-900/60 rounded-xl border border-slate-800 font-mono">
        <div>
          <span className="text-[9px] text-slate-500 block">CARDIAC PACE / HRV</span>
          <div className="text-xl font-black text-white flex items-baseline gap-1">
            <span>{bpm}</span>
            <span className="text-[10px] text-slate-400 font-normal">BPM</span>
          </div>
          <span className="text-[10px] text-cyan-300">RMSSD: {hrv} ms</span>
        </div>
        <div>
          <span className="text-[9px] text-slate-500 block">CEPHALAD SHIFT</span>
          <div className="text-xl font-black text-white flex items-baseline gap-1">
            <span style={{ color: shiftColor }}>+{telemetry.fluidShiftIndex}%</span>
          </div>
          <span className="text-[10px] text-slate-400">~1.8L Chest/Head</span>
        </div>
      </div>

      {/* Real-time Hemodynamic Vector Flow Visualization */}
      <div className="w-full h-9 bg-slate-900/80 rounded-xl overflow-hidden px-2 flex items-center justify-between border border-slate-800/80">
        <span className="text-[9px] font-mono text-slate-400">AORTIC FLOW</span>
        <svg viewBox="0 0 160 30" className="w-36 h-6">
          <path
            d="M 0 15 Q 20 0 40 15 T 80 15 T 120 15 T 160 15"
            fill="none"
            stroke={shiftColor}
            strokeWidth="1.8"
            strokeDasharray="4 2"
          >
            <animate attributeName="stroke-dashoffset" values="0; 24" dur="1.2s" repeatCount="indefinite" />
          </path>
        </svg>
        <span className="text-[9px] font-mono text-cyan-300 font-bold">1.2 m/s</span>
      </div>
    </div>
  );
}

/**
 * 2. Trabecular Micro-Architecture & Bone Resorption Scanner
 * Replaces generic bone icon with micro-lattice space decay metrics
 */
export function TrabecularBoneWidget({ telemetry, bmd }) {
  const isLossCritical = telemetry.bmdLoss > 5.0;
  const statusColor = isLossCritical ? '#FF2A55' : telemetry.bmdLoss > 3.0 ? '#FFB800' : '#10B981';

  return (
    <div className="p-4 bg-slate-950/85 border border-cyan-500/30 rounded-2xl backdrop-blur-xl shadow-2xl transition-all hover:border-cyan-400">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            {/* Trabecular Bone Micro-Lattice Grid Icon */}
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <div>
            <h4 className="text-xs font-black text-white tracking-wider">مصفوفة تآكل العظام الإسفنجية</h4>
            <span className="text-[10px] text-slate-400 font-mono">Trabecular Micro-Architecture</span>
          </div>
        </div>
        <span className="text-[10px] text-rose-400 font-mono font-bold">
          -{telemetry.bmdLoss}% تآكل شهري
        </span>
      </div>

      {/* Main Metric Digits */}
      <div className="grid grid-cols-2 gap-2 my-2.5 p-2 bg-slate-900/60 rounded-xl border border-slate-800 font-mono">
        <div>
          <span className="text-[9px] text-slate-500 block">FEMORAL / LUMBAR</span>
          <div className="text-xl font-black text-white flex items-baseline gap-1">
            <span>{bmd}</span>
            <span className="text-[10px] text-slate-400 font-normal">% بقاء</span>
          </div>
          <span className="text-[10px] text-amber-300">Target: &gt; 92%</span>
        </div>
        <div>
          <span className="text-[9px] text-slate-500 block">URINARY CALCIUM PROXY</span>
          <div className="text-xl font-black text-white flex items-baseline gap-1">
            <span style={{ color: statusColor }}>+28%</span>
          </div>
          <span className="text-[10px] text-slate-400">Renal Stone Risk</span>
        </div>
      </div>

      {/* Trabecular Strut Structural Integrity Bar */}
      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
        <div
          className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 transition-all duration-500"
          style={{ width: `${bmd}%` }}
        />
      </div>
    </div>
  );
}

/**
 * 3. Neuro-Ocular Sheath & ICP Sensor (SANS)
 * Replaces generic brain icon with Spaceflight Associated Neuro-ocular Syndrome optics
 */
export function NeuroOcularSANSWidget({ telemetry }) {
  const onsdMm = (5.0 + (telemetry.fluidShiftIndex / 100) * 0.9).toFixed(1);
  const isSANSAlert = onsdMm >= 5.8;

  return (
    <div className="p-4 bg-slate-950/85 border border-cyan-500/30 rounded-2xl backdrop-blur-xl shadow-2xl transition-all hover:border-cyan-400">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            {/* Ocular Globe & Optic Sheath Vector Icon */}
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="7" />
              <circle cx="12" cy="12" r="3" />
              <path d="M12 19v3M12 2v3M5 12H2M22 12h-3" />
            </svg>
          </div>
          <div>
            <h4 className="text-xs font-black text-white tracking-wider">ضغط العصب البصري ومتلازمة SANS</h4>
            <span className="text-[10px] text-slate-400 font-mono">Optic Sheath (ONSD) & ICP</span>
          </div>
        </div>
        <span
          className="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
          style={{
            backgroundColor: isSANSAlert ? '#FF2A5522' : '#00F0FF22',
            color: isSANSAlert ? '#FF2A55' : '#00F0FF',
            border: `1px solid ${isSANSAlert ? '#FF2A5544' : '#00F0FF44'}`
          }}
        >
          {isSANSAlert ? 'إنذار SANS نشط' : 'قاع العين طبيعي'}
        </span>
      </div>

      {/* Main Metric Digits */}
      <div className="grid grid-cols-2 gap-2 my-2.5 p-2 bg-slate-900/60 rounded-xl border border-slate-800 font-mono">
        <div>
          <span className="text-[9px] text-slate-500 block">ONSD DIAMETER</span>
          <div className="text-xl font-black text-white flex items-baseline gap-1">
            <span style={{ color: isSANSAlert ? '#FF2A55' : '#00F0FF' }}>{onsdMm}</span>
            <span className="text-[10px] text-slate-400 font-normal">mm</span>
          </div>
          <span className="text-[10px] text-slate-400">Normal: &lt; 5.2mm</span>
        </div>
        <div>
          <span className="text-[9px] text-slate-500 block">INTRACRANIAL CSF</span>
          <div className="text-xl font-black text-white flex items-baseline gap-1">
            <span>22</span>
            <span className="text-[10px] text-slate-400 font-normal">mmHg</span>
          </div>
          <span className="text-[10px] text-amber-300">Globe Flattening: Low</span>
        </div>
      </div>

      {/* Ultrasonic Scan Line */}
      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-500"
          style={{ width: `${Math.min(100, (onsdMm / 6.2) * 100)}%` }}
        />
      </div>
    </div>
  );
}
