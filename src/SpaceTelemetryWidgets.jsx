import React from 'react';
import { Activity, Bone, Eye } from 'lucide-react';
import { assetPath } from './utils/assetPath';

/**
 * 1. Cephalad Hemodynamic & Fluid-Shift Instrument
 */
export function HemodynamicFluidWidget({ telemetry, bpm, hrv }) {
  const isHighShift = telemetry.fluidShiftIndex > 70;
  const shiftColor = isHighShift ? '#FF2A55' : telemetry.fluidShiftIndex > 50 ? '#7AD7EA' : '#F4F7FC';

  return (
    <div className="p-3 bg-[#132238]/85 border border-[rgba(180,210,235,0.14)] hover:border-[#7AD7EA]/40 rounded-2xl backdrop-blur-xl shadow-xl transition-all overflow-hidden group">
      {/* Header */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#7AD7EA]/15 border border-[#7AD7EA]/30 flex items-center justify-center text-[#7AD7EA] shadow-[0_0_10px_rgba(122,215,234,0.2)]">
            <Activity size={14} />
          </div>
          <div className="text-right">
            <h4 className="text-xs font-bold text-[#F4F7FC] tracking-wide font-cairo">انتقال السوائل والهيموديناميكا</h4>
            <span className="text-[9px] text-[#7AD7EA] font-mono-tech">0-G Cephalad Fluid Shift</span>
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
      <div className="grid grid-cols-2 gap-2 my-2 p-2 bg-[#0D1728] rounded-xl border border-[rgba(180,210,235,0.1)] font-mono-tech">
        <div className="text-right">
          <span className="text-[8px] text-[#98A7BD] block font-sans">CARDIAC / HRV</span>
          <div className="text-base font-bold text-[#F4F7FC] flex items-baseline justify-end gap-1 font-titan">
            <span>{bpm}</span>
            <span className="text-[9px] text-[#98A7BD] font-normal">BPM</span>
          </div>
          <span className="text-[9px] text-[#7AD7EA]">RMSSD: {hrv} ms</span>
        </div>
        <div className="text-right">
          <span className="text-[8px] text-[#98A7BD] block font-sans">CEPHALAD FLUID</span>
          <div className="text-base font-bold flex items-baseline justify-end gap-1 font-titan">
            <span style={{ color: shiftColor }}>+{telemetry.fluidShiftIndex}%</span>
          </div>
          <span className="text-[9px] text-[#98A7BD]">~1.8L Headward</span>
        </div>
      </div>

      {/* Real Doppler Echocardiogram & Fluid Shift Scan */}
      <div className="relative w-full h-20 rounded-xl overflow-hidden border border-[#7AD7EA]/30 mb-2 shadow-inner">
        <img
          src={assetPath('hemodynamics_scan.jpg')}
          alt="Cephalad Fluid Shift & Doppler Echo Scan"
          className="w-full h-full object-cover filter contrast-110 brightness-105 transition-transform group-hover:scale-105 duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07111F] via-transparent to-transparent opacity-85" />
        <div className="absolute bottom-1 right-2 left-2 flex items-center justify-between font-mono-tech text-[9px]">
          <span className="text-[#7AD7EA] font-bold">FLOW: 84 cm/s</span>
          <span className="text-[#C7D2E3] text-[8px]">CVP: 8.4 mmHg</span>
        </div>
      </div>

      {/* Fluid Vector Line */}
      <div className="w-full h-1 bg-[#0D1728] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#7AD7EA] to-rose-500 transition-all duration-300"
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
    <div className="p-3 bg-[#132238]/85 border border-[rgba(180,210,235,0.14)] hover:border-[#7AD7EA]/40 rounded-2xl backdrop-blur-xl shadow-xl transition-all overflow-hidden group">
      {/* Header */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#7E78C9]/20 border border-[#7E78C9]/35 flex items-center justify-center text-[#7E78C9] shadow-[0_0_10px_rgba(126,120,201,0.2)]">
            <Bone size={14} />
          </div>
          <div className="text-right">
            <h4 className="text-xs font-bold text-[#F4F7FC] tracking-wide font-cairo">تآكل العظام الإسفنجية</h4>
            <span className="text-[9px] text-[#7E78C9] font-mono-tech">Trabecular Micro-Lattice</span>
          </div>
        </div>
        <span className="text-[9px] text-rose-400 font-mono-tech font-bold px-1.5 py-0.5 bg-rose-500/10 rounded border border-rose-500/30">
          -{telemetry.bmdLoss}% فقدان
        </span>
      </div>

      {/* Main Metric Digits */}
      <div className="grid grid-cols-2 gap-2 my-2 p-2 bg-[#0D1728] rounded-xl border border-[rgba(180,210,235,0.1)] font-mono-tech">
        <div className="text-right">
          <span className="text-[8px] text-[#98A7BD] block font-sans">FEMORAL / LUMBAR</span>
          <div className="text-base font-bold text-[#F4F7FC] flex items-baseline justify-end gap-1 font-titan">
            <span>{bmd}</span>
            <span className="text-[9px] text-[#98A7BD] font-normal">%</span>
          </div>
          <span className="text-[9px] text-[#7AD7EA]">Target: &gt; 92%</span>
        </div>
        <div className="text-right">
          <span className="text-[8px] text-[#98A7BD] block font-sans">URINARY CALCIUM</span>
          <div className="text-base font-bold flex items-baseline justify-end gap-1 font-titan">
            <span style={{ color: statusColor }}>+28%</span>
          </div>
          <span className="text-[9px] text-[#98A7BD]">Renal Stone Risk</span>
        </div>
      </div>

      {/* Real DEXA Spine & Trabecular Micro-architecture Scan */}
      <div className="relative w-full h-20 rounded-xl overflow-hidden border border-[#7E78C9]/30 mb-2 shadow-inner">
        <img
          src={assetPath('bone_loss_scan.jpg')}
          alt="Trabecular Micro-architecture & DEXA Scan"
          className="w-full h-full object-cover filter contrast-110 brightness-105 transition-transform group-hover:scale-105 duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07111F] via-transparent to-transparent opacity-85" />
        <div className="absolute bottom-1 right-2 left-2 flex items-center justify-between font-mono-tech text-[9px]">
          <span className="text-[#7AD7EA] font-bold">DEXA T: -2.8 SD</span>
          <span className="text-[#C7D2E3] text-[8px]">Ca: High Excretion</span>
        </div>
      </div>

      {/* Trabecular Integrity Bar */}
      <div className="w-full h-1 bg-[#0D1728] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#7AD7EA] to-emerald-400 transition-all duration-500"
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
    <div className="p-3 bg-[#132238]/85 border border-[rgba(180,210,235,0.14)] hover:border-[#7AD7EA]/40 rounded-2xl backdrop-blur-xl shadow-xl transition-all overflow-hidden group">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#7AD7EA]/15 border border-[#7AD7EA]/30 flex items-center justify-center text-[#7AD7EA] shadow-[0_0_10px_rgba(122,215,234,0.2)]">
            <Eye size={14} />
          </div>
          <div className="text-right">
            <h4 className="text-xs font-bold text-[#F4F7FC] tracking-wide font-cairo">سونار العصب البصري (SANS)</h4>
            <span className="text-[9px] text-[#7AD7EA] font-mono-tech">Optic Sheath (ONSD) Scanner</span>
          </div>
        </div>
        <span
          className="px-2 py-0.5 rounded-full text-[9px] font-mono-tech font-bold"
          style={{
            backgroundColor: isSANSAlert ? '#FF2A5522' : '#7AD7EA22',
            color: isSANSAlert ? '#FF2A55' : '#7AD7EA',
            border: `1px solid ${isSANSAlert ? '#FF2A5555' : '#7AD7EA55'}`
          }}
        >
          {isSANSAlert ? 'إنذار SANS' : 'طبيعي'}
        </span>
      </div>

      {/* REAL ULTRASOUND IMAGE SCAN */}
      <div className="relative w-full h-20 rounded-xl overflow-hidden border border-[#7AD7EA]/30 my-2 shadow-inner">
        <img
          src={assetPath('sans_scan.jpg')}
          alt="SANS Ultrasonic Diagnostic Scan"
          className="w-full h-full object-cover filter contrast-110 brightness-105 transition-transform group-hover:scale-105 duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07111F] via-transparent to-transparent opacity-85" />
        <div className="absolute bottom-1 right-2 left-2 flex items-center justify-between font-mono-tech text-[9px]">
          <span className="text-[#7AD7EA] font-bold">ONSD: {onsdMm} mm</span>
          <span className="text-[#C7D2E3] text-[8px]">ICP: 22 mmHg</span>
        </div>
      </div>
    </div>
  );
}
