import React from 'react';
import {
  Zap, Radio, WifiOff, CheckCircle2, ShieldAlert, FileText,
  Sliders, Cpu, Layers
} from 'lucide-react';
import {
  HemodynamicFluidWidget,
  TrabecularBoneWidget,
  NeuroOcularSANSWidget
} from './SpaceTelemetryWidgets';
import { spaceAudio } from './utils/spaceAudio';

export default function CleanCockpitHUD({
  telemetry,
  currentPhase,
  onApplyCountermeasure,
  onResetCountermeasure,
  countermeasureApplied,
  isCommBlackout,
  onToggleBlackout
}) {
  const bpm = telemetry.currentHR;
  const hrv = telemetry.currentHRV;
  const bmd = telemetry.bmdRetention;

  return (
    <div className="w-full h-full flex flex-col justify-between pointer-events-none select-none">
      {/* ─────────────────────────────────────────────────────────────
          STORY BANNER: NARRATIVE USER JOURNEY (Center Top)
      ───────────────────────────────────────────────────────────── */}
      {currentPhase && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 w-full max-w-xl pointer-events-auto">
          <div
            className="p-3 bg-slate-950/90 border rounded-2xl backdrop-blur-xl shadow-2xl flex items-center justify-between text-right"
            style={{ borderColor: `${currentPhase.telemetry.color}66` }}
          >
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full animate-ping"
                style={{ backgroundColor: currentPhase.telemetry.color }}
              />
              <span className="text-[11px] font-mono font-bold uppercase" style={{ color: currentPhase.telemetry.color }}>
                {currentPhase.badge}
              </span>
            </div>
            <p className="text-xs text-slate-200 font-medium max-w-md truncate">
              {currentPhase.description}
            </p>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          LEFT HUD: 3 NASA-SPECIFIC PHYSIOLOGICAL INSTRUMENTS
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute top-36 left-6 z-30 w-80 flex flex-col gap-3 pointer-events-auto">
        {/* 1. Microgravity Cephalad Fluid Shift & Hemodynamics (No generic heart!) */}
        <HemodynamicFluidWidget telemetry={telemetry} bpm={bpm} hrv={hrv} />

        {/* 2. Trabecular Bone Demineralization Matrix (No generic bone!) */}
        <TrabecularBoneWidget telemetry={telemetry} bmd={bmd} />

        {/* 3. Neuro-Ocular Sheath & SANS Eye Pressure (No generic brain!) */}
        <NeuroOcularSANSWidget telemetry={telemetry} />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          RIGHT HUD: NASA COUNTERMEASURE FLIGHT OPERATIONS
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute top-36 right-6 z-30 w-84 flex flex-col gap-3 pointer-events-auto">
        {/* NASA HRP Flight Surgeon Prescription Deck */}
        <div className="p-4 bg-slate-950/90 border border-cyan-500/40 rounded-2xl backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-black text-white tracking-wider font-mono">
                NASA FLIGHT SURGEON CORE
              </span>
            </div>
            <span className="text-[10px] text-cyan-300 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 font-mono font-bold">
              NASA-STD-3001
            </span>
          </div>

          {/* Real Space Hardware Schematic Module */}
          <div className="p-3.5 bg-gradient-to-br from-slate-900 to-cyan-950/40 border border-slate-800 rounded-xl mb-3 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shrink-0 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              {/* Space Exercise Device Icon */}
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v10M8 12h8" />
              </svg>
            </div>
            <div>
              <h5 className="text-xs font-bold text-white font-mono">ARED + CEVIS + LBNP PROTOCOL</h5>
              <p className="text-[11px] text-slate-300 leading-snug mt-0.5">
                تعديل حمل مكابس المقاومة الفضائية (+12%) مع سحب سوائل للأطراف السفلية بضغط -30 mmHg.
              </p>
            </div>
          </div>

          {/* Action Trigger Button */}
          {!countermeasureApplied ? (
            <button
              onClick={onApplyCountermeasure}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black text-sm font-sans tracking-wide transition-all shadow-[0_0_30px_rgba(0,240,255,0.5)] hover:scale-105 flex items-center justify-center gap-2"
            >
              <Zap size={18} />
              <span>تطبيق بروتوكول التدخل الفضائي الآن</span>
            </button>
          ) : (
            <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/60 flex items-center justify-between text-xs font-bold text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.4)]">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-400" />
                تم تفعيل البروتوكول الفضائي واستقرار الدورة!
              </span>
              <button
                onClick={onResetCountermeasure}
                className="text-[10px] text-slate-400 hover:text-white underline ml-2 shrink-0"
              >
                إعادة
              </button>
            </div>
          )}
        </div>

        {/* Deep Space Comm Delay Switch Card */}
        <div className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-2xl backdrop-blur-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
              {isCommBlackout ? <WifiOff size={14} className="text-amber-400 animate-pulse" /> : <Radio size={14} className="text-emerald-400" />}
              <span>DSN COMM-LAG TELEMETRY</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {telemetry.commDelayMinutes} دقيقة زمن انتقال الإشارة لهيوستن
            </span>
          </div>

          <button
            onClick={onToggleBlackout}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border font-mono ${
              isCommBlackout
                ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-slate-900 text-slate-400 border-slate-700'
            }`}
          >
            {isCommBlackout ? 'الوضع الذاتي المستقل' : 'محاكاة الانقطاع'}
          </button>
        </div>
      </div>
    </div>
  );
}
