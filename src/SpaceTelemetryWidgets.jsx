import React from 'react';
import { Radio, AlertTriangle, ShieldCheck, Zap, Activity, Eye, Bone } from 'lucide-react';

/**
 * 1. Cephalad Hemodynamic & Fluid-Shift Instrument
 */
export function HemodynamicFluidWidget({ telemetry, bpm, hrv }) {
  const isHighShift = telemetry.fluidShiftIndex > 70;
  const shiftColor = isHighShift ? '#FF2A55' : telemetry.fluidShiftIndex > 50 ? '#FFB800' : '#00F0FF';

  return (
    <div className="p-3.5 bg-slate-950/90 border border-cyan-500/40 rounded-2xl backdrop-blur-xl shadow-2xl transition-all hover:border-cyan-400 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.3)]">
            <Activity size={15} />
          </div>
          <div>
            <h4 className="text-xs font-black text-white tracking-wider">انتقال السوائل والهيموديناميكا</h4>
            <span className="text-[9px] text-slate-400 font-mono">0-G Cephalad Fluid Shift</span>
          </div>
        </div>
        <span
          className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold"
          style={{ backgroundColor: `${shiftColor}22`, color: shiftColor, border: `1px solid ${shiftColor}44` }}
        >
          {isHighShift ? 'احتقان رأسي' : 'مستقر'}
        </span>
      </div>

      {/* Main Metric Digits */}
      <div className="grid grid-cols-2 gap-2 my-2 p-2 bg-slate-900/70 rounded-xl border border-slate-800 font-mono">
        <div>
          <span className="text-[8px] text-slate-500 block">CARDIAC / HRV</span>
          <div className="text-lg font-black text-white flex items-baseline gap-1">
            <span>{bpm}</span>
            <span className="text-[9px] text-slate-400 font-normal">BPM</span>
          </div>
          <span className="text-[9px] text-cyan-300">RMSSD: {hrv} ms</span>
        </div>
        <div>
          <span className="text-[8px] text-slate-500 block">CEPHALAD FLUID</span>
          <div className="text-lg font-black text-white flex items-baseline gap-1">
            <span style={{ color: shiftColor }}>+{telemetry.fluidShiftIndex}%</span>
          </div>
          <span className="text-[9px] text-slate-400">~1.8L Headward</span>
        </div>
      </div>

      {/* Real Doppler Echocardiogram & Fluid Shift Scan */}
      <div className="relative w-full h-20 rounded-xl overflow-hidden border border-cyan-500/30 mb-2 shadow-inner group">
        <img
          src="/hemodynamics_scan.jpg"
          alt="Cephalad Fluid Shift & Doppler Echo Scan"
          className="w-full h-full object-cover filter contrast-125 brightness-105 transition-transform group-hover:scale-105 duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-1 right-2 left-2 flex items-center justify-between font-mono text-[9px]">
          <span className="text-cyan-300 font-bold">FLOW: 84 cm/s</span>
          <span className="text-slate-300 text-[8px]">CVP: 8.4 mmHg</span>
        </div>
      </div>

      {/* Fluid Vector Line */}
      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-rose-500 transition-all duration-300"
          style={{ width: `${Math.min(100, telemetry.fluidShiftIndex)}%` }}
        />
      </div>
    </div>
  );
}

/**
 * 2. Trabecular Micro-Architecture & Bone Resorption Scanner
 */
export function TrabecularBoneWidget({ telemetry, bmd }) {
  const isLossCritical = telemetry.bmdLoss > 5.0;
  const statusColor = isLossCritical ? '#FF2A55' : telemetry.bmdLoss > 3.0 ? '#FFB800' : '#10B981';

  return (
    <div className="p-3.5 bg-slate-950/90 border border-cyan-500/40 rounded-2xl backdrop-blur-xl shadow-2xl transition-all hover:border-cyan-400 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]">
            <Bone size={15} />
          </div>
          <div>
            <h4 className="text-xs font-black text-white tracking-wider">مصفوفة تآكل العظام الإسفنجية</h4>
            <span className="text-[9px] text-slate-400 font-mono">Trabecular Micro-Lattice</span>
          </div>
        </div>
        <span className="text-[9px] text-rose-400 font-mono font-bold">
          -{telemetry.bmdLoss}% فقدان
        </span>
      </div>

      {/* Main Metric Digits */}
      <div className="grid grid-cols-2 gap-2 my-2 p-2 bg-slate-900/70 rounded-xl border border-slate-800 font-mono">
        <div>
          <span className="text-[8px] text-slate-500 block">FEMORAL / LUMBAR</span>
          <div className="text-lg font-black text-white flex items-baseline gap-1">
            <span>{bmd}</span>
            <span className="text-[9px] text-slate-400 font-normal">% بقاء</span>
          </div>
          <span className="text-[9px] text-amber-300">Target: &gt; 92%</span>
        </div>
        <div>
          <span className="text-[8px] text-slate-500 block">URINARY CALCIUM</span>
          <div className="text-lg font-black text-white flex items-baseline gap-1">
            <span style={{ color: statusColor }}>+28%</span>
          </div>
          <span className="text-[9px] text-slate-400">Renal Stone Risk</span>
        </div>
      </div>

      {/* Real DEXA Spine & Trabecular Micro-architecture Scan */}
      <div className="relative w-full h-20 rounded-xl overflow-hidden border border-amber-500/30 mb-2 shadow-inner group">
        <img
          src="/bone_loss_scan.jpg"
          alt="Trabecular Micro-architecture & DEXA Scan"
          className="w-full h-full object-cover filter contrast-125 brightness-105 transition-transform group-hover:scale-105 duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-1 right-2 left-2 flex items-center justify-between font-mono text-[9px]">
          <span className="text-amber-300 font-bold">DEXA T: -2.8 SD</span>
          <span className="text-slate-300 text-[8px]">Ca: Hypercalciuric</span>
        </div>
      </div>

      {/* Trabecular Integrity Bar */}
      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-500"
          style={{ width: `${bmd}%` }}
        />
      </div>
    </div>
  );
}

/**
 * 3. Neuro-Ocular Sheath & ICP Sensor (SANS) with REAL MEDICAL SCAN IMAGE
 */
export function NeuroOcularSANSWidget({ telemetry }) {
  const onsdMm = (5.0 + (telemetry.fluidShiftIndex / 100) * 0.9).toFixed(1);
  const isSANSAlert = onsdMm >= 5.8;

  return (
    <div className="p-3.5 bg-slate-950/90 border border-purple-500/40 rounded-2xl backdrop-blur-xl shadow-2xl transition-all hover:border-purple-400 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
            <Eye size={15} />
          </div>
          <div>
            <h4 className="text-xs font-black text-white tracking-wider">سونار العصب البصري (SANS)</h4>
            <span className="text-[9px] text-slate-400 font-mono">Optic Sheath (ONSD) Scanner</span>
          </div>
        </div>
        <span
          className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold"
          style={{
            backgroundColor: isSANSAlert ? '#FF2A5522' : '#00F0FF22',
            color: isSANSAlert ? '#FF2A55' : '#00F0FF',
            border: `1px solid ${isSANSAlert ? '#FF2A5544' : '#00F0FF44'}`
          }}
        >
          {isSANSAlert ? 'إنذار SANS' : 'طبيعي'}
        </span>
      </div>

      {/* REAL ULTRASOUND IMAGE SCAN */}
      <div className="relative w-full h-20 rounded-xl overflow-hidden border border-purple-500/30 my-2 shadow-inner group">
        <img
          src="/sans_scan.jpg"
          alt="SANS Ultrasonic Diagnostic Scan"
          className="w-full h-full object-cover filter contrast-125 brightness-105 transition-transform group-hover:scale-105 duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-1 right-2 left-2 flex items-center justify-between font-mono text-[9px]">
          <span className="text-cyan-300 font-bold">ONSD: {onsdMm} mm</span>
          <span className="text-slate-300 text-[8px]">ICP: 22 mmHg</span>
        </div>
      </div>
    </div>
  );
}
