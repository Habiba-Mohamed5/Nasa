import React from 'react';
import {
  Zap, Radio, WifiOff, CheckCircle2
} from 'lucide-react';
import {
  HemodynamicFluidWidget,
  TrabecularBoneWidget,
  NeuroOcularSANSWidget
} from './SpaceTelemetryWidgets';
import { assetPath } from './utils/assetPath';

export default function CleanCockpitHUD({
  telemetry,
  currentPhase,
  onApplyCountermeasure,
  onResetCountermeasure,
  countermeasureApplied,
  isCommBlackout,
  onToggleBlackout,
  mobileTab = 'viewport' // 'viewport' | 'telemetry' | 'operations'
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
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 w-full max-w-lg px-4 pointer-events-auto">
          <div
            className="p-2.5 bg-[#171311]/90 border rounded-2xl backdrop-blur-xl shadow-xl flex items-center justify-between text-right"
            style={{ borderColor: `${currentPhase.telemetry.color}55` }}
          >
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full animate-ping"
                style={{ backgroundColor: currentPhase.telemetry.color }}
              />
              <span className="text-[10px] font-mono-tech font-bold uppercase" style={{ color: currentPhase.telemetry.color }}>
                {currentPhase.badge}
              </span>
            </div>
            <p className="text-[11px] text-[#EBEBEB] font-cairo font-medium truncate max-w-xs md:max-w-md">
              {currentPhase.description}
            </p>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          LEFT HUD: 3 NASA-SPECIFIC PHYSIOLOGICAL INSTRUMENTS
      ───────────────────────────────────────────────────────────── */}
      <div
        className={`absolute top-14 left-4 z-30 w-full max-w-[310px] max-h-[calc(100vh-210px)] overflow-y-auto flex flex-col gap-2.5 pointer-events-auto pr-1 no-scrollbar transition-all ${
          mobileTab === 'telemetry'
            ? 'flex !left-1/2 !-translate-x-1/2 !max-w-sm !top-12'
            : 'hidden lg:flex'
        }`}
      >
        {/* 1. Microgravity Cephalad Fluid Shift & Hemodynamics */}
        <HemodynamicFluidWidget telemetry={telemetry} bpm={bpm} hrv={hrv} />

        {/* 2. Trabecular Bone Demineralization Matrix */}
        <TrabecularBoneWidget telemetry={telemetry} bmd={bmd} />

        {/* 3. Neuro-Ocular Sheath & SANS Eye Pressure */}
        <NeuroOcularSANSWidget telemetry={telemetry} />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          RIGHT HUD: NASA COUNTERMEASURE FLIGHT OPERATIONS
      ───────────────────────────────────────────────────────────── */}
      <div
        className={`absolute top-14 right-4 z-30 w-full max-w-[320px] max-h-[calc(100vh-210px)] overflow-y-auto flex flex-col gap-2.5 pointer-events-auto transition-all ${
          mobileTab === 'operations'
            ? 'flex !left-1/2 !-translate-x-1/2 !max-w-sm !top-12'
            : 'hidden lg:flex'
        }`}
      >
        {/* NASA HRP Flight Surgeon Prescription Deck */}
        <div className="p-3.5 bg-[#171311]/90 border border-white/[0.08] rounded-2xl backdrop-blur-xl shadow-xl">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E4783B] animate-ping" />
              <span className="text-xs font-bold text-[#EBEBEB] tracking-wider font-titan">
                FLIGHT SURGEON CORE
              </span>
            </div>
            <span className="text-[9px] text-[#E4783B] px-2 py-0.5 rounded bg-[#252121] border border-[#E4783B]/40 font-mono-tech font-bold">
              NASA-STD-3001
            </span>
          </div>

          {/* Real ARED Space Exercise Image */}
          <div className="relative w-full h-28 rounded-xl overflow-hidden border border-[#E4783B]/30 mb-3 shadow-inner group">
            <img
              src={assetPath('ared_exercise.jpg')}
              alt="NASA ARED Resistance Exercise Device"
              className="w-full h-full object-cover filter brightness-105 contrast-110 transition-transform group-hover:scale-105 duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B0A] via-[#0D0B0A]/30 to-transparent opacity-90" />
            <div className="absolute bottom-2 right-2 left-2 text-right">
              <span className="text-[9px] font-mono-tech font-bold text-[#E4783B] uppercase block">
                NASA ARED RESISTIVE EXERCISE POD
              </span>
              <p className="text-[10px] text-[#EBEBEB] line-clamp-1 font-cairo">
                تدريب الأثقال الفضائية بالضغط الهيدروليكي لمنع تآكل العظام
              </p>
            </div>
          </div>

          {/* Action Trigger Button */}
          {!countermeasureApplied ? (
            <button
              onClick={onApplyCountermeasure}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#E4783B] to-[#A64D2D] hover:opacity-95 text-[#0D0B0A] font-black text-xs font-cairo tracking-wide transition-all shadow-[0_0_20px_rgba(228,120,59,0.35)] hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Zap size={16} />
              <span>تطبيق بروتوكول التدخل الفضائي الآن</span>
            </button>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/60 flex items-center justify-between text-xs font-bold text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <span className="flex items-center gap-2 font-cairo text-[11px]">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                تم تفعيل البروتوكول واستقرار الدورة!
              </span>
              <button
                onClick={onResetCountermeasure}
                className="text-[10px] text-[#808080] hover:text-[#EBEBEB] underline ml-2 shrink-0 font-mono-tech"
              >
                إعادة
              </button>
            </div>
          )}
        </div>

        {/* Deep Space Comm Delay Switch Card */}
        <div className="p-3 bg-[#171311]/90 border border-white/[0.08] rounded-2xl backdrop-blur-xl flex items-center justify-between">
          <div className="text-right">
            <div className="text-xs font-bold text-[#EBEBEB] flex items-center justify-end gap-1.5 font-titan">
              <span>DSN COMM-LAG TELEMETRY</span>
              {isCommBlackout ? <WifiOff size={14} className="text-amber-400 animate-pulse" /> : <Radio size={14} className="text-emerald-400" />}
            </div>
            <span className="text-[10px] text-[#808080] font-mono-tech block mt-0.5">
              {telemetry.commDelayMinutes} دقيقة زمن انتقال الإشارة لهيوستن
            </span>
          </div>

          <button
            onClick={onToggleBlackout}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border font-cairo ${
              isCommBlackout
                ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-[#252121] text-[#ACACAC] border-white/10 hover:text-[#EBEBEB]'
            }`}
          >
            {isCommBlackout ? 'الوضع الذاتي' : 'محاكاة الانقطاع'}
          </button>
        </div>
      </div>
    </div>
  );
}
