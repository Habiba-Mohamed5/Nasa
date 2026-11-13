import React from 'react';
import { Activity, Bone, Eye } from 'lucide-react';
import { assetPath } from './utils/assetPath';

/**
 * 1. Cephalad Hemodynamic & Fluid-Shift Instrument
 */
export function HemodynamicFluidWidget({ telemetry, bpm, hrv }) {
  const isHighShift = telemetry.fluidShiftIndex > 70;
  const shiftColor = isHighShift ? '#FF2A55' : telemetry.fluidShiftIndex > 50 ? '#E4783B' : '#EBEBEB';

  return (
    <div className="p-3 bg-[#171311]/90 border border-white/[0.08] hover:border-[#E4783B]/40 rounded-2xl backdrop-blur-xl shadow-xl transition-all overflow-hidden group">
      {/* Header */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#E4783B]/15 border border-[#E4783B]/30 flex items-center justify-center text-[#E4783B] shadow-[0_0_10px_rgba(228,120,59,0.2)]">
            <Activity size={14} />
          </div>
          <div className="text-right">
            <h4 className="text-xs font-bold text-[#EBEBEB] tracking-wide font-cairo">انتقال السوائل والهيموديناميكا</h4>
            <span className="text-[9px] text-[#A64D2D] font-mono-tech">0-G Cephalad Fluid Shift</span>
          </div>
        </div>
        <span
          className="px-2 py-0.5 rounded-full text-[9px] font-mono-tech font-bold"
          style={{ backgroundColor: `${shiftColor}22`, color: shiftColor, border: `1px solid ${shiftColor}55` }}
        >
          {isHighShift ? 'احتقان رأسي' : 'مستقر'}
        </span>
      </div>

      {/* Main Metric Digits */}
      <div className="grid grid-cols-2 gap-2 my-2 p-2 bg-[#0D0B0A] rounded-xl border border-white/5 font-mono-tech">
        <div className="text-right">
          <span className="text-[8px] text-[#808080] block font-sans">CARDIAC / HRV</span>
          <div className="text-base font-bold text-[#EBEBEB] flex items-baseline justify-end gap-1 font-titan">
            <span>{bpm}</span>
            <span className="text-[9px] text-[#808080] font-normal">BPM</span>
          </div>
          <span className="text-[9px] text-[#E4783B]">RMSSD: {hrv} ms</span>
        </div>
        <div className="text-right">
          <span className="text-[8px] text-[#808080] block font-sans">CEPHALAD FLUID</span>
          <div className="text-base font-bold flex items-baseline justify-end gap-1 font-titan">
            <span style={{ color: shiftColor }}>+{telemetry.fluidShiftIndex}%</span>
          </div>
          <span className="text-[9px] text-[#808080]">~1.8L Headward</span>
        </div>
      </div>

      {/* Real Doppler Echocardiogram & Fluid Shift Scan */}
      <div className="relative w-full h-20 rounded-xl overflow-hidden border border-[#E4783B]/30 mb-2 shadow-inner">
        <img
          src={assetPath('hemodynamics_scan.jpg')}
          alt="Cephalad Fluid Shift & Doppler Echo Scan"
          className="w-full h-full object-cover filter contrast-110 brightness-105 transition-transform group-hover:scale-105 duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B0A] via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-1 right-2 left-2 flex items-center justify-between font-mono-tech text-[9px]">
          <span className="text-[#E4783B] font-bold">FLOW: 84 cm/s</span>
          <span className="text-[#ACACAC] text-[8px]">CVP: 8.4 mmHg</span>
        </div>
      </div>

      {/* Fluid Vector Line */}
      <div className="w-full h-1 bg-[#252121] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#E4783B] to-rose-500 transition-all duration-300"
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
    <div className="p-3 bg-[#171311]/90 border border-white/[0.08] hover:border-[#E4783B]/40 rounded-2xl backdrop-blur-xl shadow-xl transition-all overflow-hidden group">
      {/* Header */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#E4783B]/15 border border-[#E4783B]/30 flex items-center justify-center text-[#E4783B] shadow-[0_0_10px_rgba(228,120,59,0.2)]">
            <Bone size={14} />
          </div>
          <div className="text-right">
            <h4 className="text-xs font-bold text-[#EBEBEB] tracking-wide font-cairo">تآكل العظام الإسفنجية</h4>
            <span className="text-[9px] text-[#A64D2D] font-mono-tech">Trabecular Micro-Lattice</span>
          </div>
        </div>
        <span className="text-[9px] text-rose-400 font-mono-tech font-bold px-1.5 py-0.5 bg-rose-500/10 rounded border border-rose-500/30">
          -{telemetry.bmdLoss}% فقدان
        </span>
      </div>

      {/* Main Metric Digits */}
      <div className="grid grid-cols-2 gap-2 my-2 p-2 bg-[#0D0B0A] rounded-xl border border-white/5 font-mono-tech">
        <div className="text-right">
          <span className="text-[8px] text-[#808080] block font-sans">FEMORAL / LUMBAR</span>
          <div className="text-base font-bold text-[#EBEBEB] flex items-baseline justify-end gap-1 font-titan">
            <span>{bmd}</span>
            <span className="text-[9px] text-[#808080] font-normal">%</span>
          </div>
          <span className="text-[9px] text-[#E4783B]">Target: &gt; 92%</span>
        </div>
        <div className="text-right">
          <span className="text-[8px] text-[#808080] block font-sans">URINARY CALCIUM</span>
          <div className="text-base font-bold flex items-baseline justify-end gap-1 font-titan">
            <span style={{ color: statusColor }}>+28%</span>
          </div>
          <span className="text-[9px] text-[#808080]">Renal Stone Risk</span>
        </div>
      </div>

      {/* Real DEXA Spine & Trabecular Micro-architecture Scan */}
      <div className="relative w-full h-20 rounded-xl overflow-hidden border border-[#E4783B]/30 mb-2 shadow-inner">
        <img
          src={assetPath('bone_loss_scan.jpg')}
          alt="Trabecular Micro-architecture & DEXA Scan"
          className="w-full h-full object-cover filter contrast-110 brightness-105 transition-transform group-hover:scale-105 duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B0A] via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-1 right-2 left-2 flex items-center justify-between font-mono-tech text-[9px]">
          <span className="text-[#E4783B] font-bold">DEXA T: -2.8 SD</span>
          <span className="text-[#ACACAC] text-[8px]">Ca: High Excretion</span>
        </div>
      </div>

      {/* Trabecular Integrity Bar */}
      <div className="w-full h-1 bg-[#252121] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#E4783B] to-emerald-400 transition-all duration-500"
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
    <div className="p-3 bg-[#171311]/90 border border-white/[0.08] hover:border-[#E4783B]/40 rounded-2xl backdrop-blur-xl shadow-xl transition-all overflow-hidden group">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#E4783B]/15 border border-[#E4783B]/30 flex items-center justify-center text-[#E4783B] shadow-[0_0_10px_rgba(228,120,59,0.2)]">
            <Eye size={14} />
          </div>
          <div className="text-right">
            <h4 className="text-xs font-bold text-[#EBEBEB] tracking-wide font-cairo">سونار العصب البصري (SANS)</h4>
            <span className="text-[9px] text-[#A64D2D] font-mono-tech">Optic Sheath (ONSD) Scanner</span>
          </div>
        </div>
        <span
          className="px-2 py-0.5 rounded-full text-[9px] font-mono-tech font-bold"
          style={{
            backgroundColor: isSANSAlert ? '#FF2A5522' : '#E4783B22',
            color: isSANSAlert ? '#FF2A55' : '#E4783B',
            border: `1px solid ${isSANSAlert ? '#FF2A5555' : '#E4783B55'}`
          }}
        >
          {isSANSAlert ? 'إنذار SANS' : 'طبيعي'}
        </span>
      </div>

      {/* REAL ULTRASOUND IMAGE SCAN */}
      <div className="relative w-full h-20 rounded-xl overflow-hidden border border-[#E4783B]/30 my-2 shadow-inner">
        <img
          src={assetPath('sans_scan.jpg')}
          alt="SANS Ultrasonic Diagnostic Scan"
          className="w-full h-full object-cover filter contrast-110 brightness-105 transition-transform group-hover:scale-105 duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B0A] via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-1 right-2 left-2 flex items-center justify-between font-mono-tech text-[9px]">
          <span className="text-[#E4783B] font-bold">ONSD: {onsdMm} mm</span>
          <span className="text-[#ACACAC] text-[8px]">ICP: 22 mmHg</span>
        </div>
      </div>
    </div>
  );
}
