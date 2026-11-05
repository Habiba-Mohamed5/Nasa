import React from 'react';
import {
  Heart, Activity, Bone, Brain, Zap, ShieldCheck,
  Radio, WifiOff, Clock, User, CheckCircle2, RotateCcw,
  Sparkles, Compass, AlertCircle, ShieldAlert
} from 'lucide-react';
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
  const healthScore = telemetry.overallHealthIndex;

  return (
    <div className="w-full h-full flex flex-col justify-between pointer-events-none select-none">
      {/* ─────────────────────────────────────────────────────────────
          STORY BANNER: NARRATIVE USER JOURNEY (Center Top)
      ───────────────────────────────────────────────────────────── */}
      {currentPhase && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 w-full max-w-xl pointer-events-auto">
          <div
            className="p-3 bg-slate-950/85 border rounded-2xl backdrop-blur-xl shadow-2xl flex items-center justify-between text-right"
            style={{ borderColor: `${currentPhase.telemetry.color}55` }}
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
          LEFT HUD: 3 CLEAN VISUAL GAUGES WITH ANIMATIONS
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute top-36 left-6 z-30 w-72 flex flex-col gap-3 pointer-events-auto">
        {/* Heart Rate & Cardiovascular Card */}
        <div className="p-4 bg-slate-950/80 border border-cyan-500/30 rounded-2xl backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.6)] transition-all hover:border-cyan-400">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                <Heart size={20} className="animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white tracking-wider">صحة القلب والنبض</h4>
                <span className="text-[10px] text-slate-400 font-mono">Cardiac Rhythm</span>
              </div>
            </div>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold"
              style={{
                backgroundColor: bpm > 88 ? '#FF2A5522' : '#10B98122',
                color: bpm > 88 ? '#FF2A55' : '#10B981',
                border: `1px solid ${bpm > 88 ? '#FF2A5544' : '#10B98144'}`
              }}
            >
              {bpm > 88 ? 'تحذير إجهاد' : 'مستقر وآمن'}
            </span>
          </div>

          <div className="flex items-baseline justify-between my-2">
            <div className="font-mono text-3xl font-black text-white flex items-baseline gap-1">
              <span>{bpm}</span>
              <span className="text-xs text-slate-400 font-normal">BPM</span>
            </div>
            <div className="text-right text-[11px] font-mono text-cyan-300">
              HRV: <strong className="text-white">{hrv} ms</strong>
            </div>
          </div>

          {/* Animated ECG Pulse Wave SVG */}
          <div className="w-full h-8 bg-slate-900/60 rounded-xl overflow-hidden flex items-center px-1 border border-slate-800">
            <svg viewBox="0 0 200 40" className="w-full h-full">
              <path
                d="M 0 20 L 30 20 L 40 10 L 50 30 L 60 5 L 70 35 L 80 20 L 110 20 L 120 10 L 130 30 L 140 5 L 150 35 L 160 20 L 200 20"
                fill="none"
                stroke={bpm > 88 ? '#FF2A55' : '#00F0FF'}
                strokeWidth="1.8"
                className="ecg-line"
              />
            </svg>
          </div>
        </div>

        {/* Bone & Muscle Density Card */}
        <div className="p-4 bg-slate-950/80 border border-cyan-500/30 rounded-2xl backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.6)] transition-all hover:border-cyan-400">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                <Bone size={20} />
              </div>
              <div>
                <h4 className="text-xs font-black text-white tracking-wider">كثافة الهيكل العظمي</h4>
                <span className="text-[10px] text-slate-400 font-mono">Trabecular Density</span>
              </div>
            </div>
            <span className="text-[10px] text-rose-400 font-mono font-bold">
              -{telemetry.bmdLoss}% فقدان
            </span>
          </div>

          <div className="flex items-baseline justify-between my-2">
            <div className="font-mono text-3xl font-black text-white">
              {bmd}
              <span className="text-xs text-slate-400 font-normal ml-1">%</span>
            </div>
            <span className="text-[10px] text-slate-400">Lumbar & Femur</span>
          </div>

          {/* Bone Density Progress Bar */}
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-500"
              style={{ width: `${bmd}%` }}
            />
          </div>
        </div>

        {/* Brain & Cognitive Energy Card */}
        <div className="p-4 bg-slate-950/80 border border-cyan-500/30 rounded-2xl backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.6)] transition-all hover:border-cyan-400">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                <Brain size={20} />
              </div>
              <div>
                <h4 className="text-xs font-black text-white tracking-wider">اليقظة والمناعة</h4>
                <span className="text-[10px] text-slate-400 font-mono">Cognitive & SANS</span>
              </div>
            </div>
            <span className="text-[10px] text-cyan-300 font-mono font-bold">
              {healthScore}/100
            </span>
          </div>

          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 mt-2">
            <div
              className="h-full bg-cyan-400 transition-all duration-500"
              style={{ width: `${healthScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          RIGHT HUD: VISUAL INTERVENTION CARD (One-Click Protocol)
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute top-36 right-6 z-30 w-80 flex flex-col gap-3 pointer-events-auto">
        {/* Mission Flight Surgeon Status */}
        <div className="p-4 bg-slate-950/85 border border-cyan-500/30 rounded-2xl backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-black text-white tracking-wider font-mono">
                AI FLIGHT SURGEON CORE
              </span>
            </div>
            <span className="text-[10px] text-cyan-300 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 font-bold">
              NASA HRP
            </span>
          </div>

          {/* Visual Device Illustration Card */}
          <div className="p-3.5 bg-gradient-to-br from-slate-900 via-slate-900/90 to-cyan-950/50 border border-cyan-500/30 rounded-xl mb-3 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shrink-0 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <Zap size={24} className="text-cyan-400 animate-bounce" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-white">بروتوكول جهاز المقاومة ARED</h5>
              <p className="text-[11px] text-slate-300 leading-snug mt-0.5">
                تعديل أحمال التمارين + سوائل كهرلية لتعويض ضمور العظام وضغط القلب.
              </p>
            </div>
          </div>

          {/* Big Action Button */}
          {!countermeasureApplied ? (
            <button
              onClick={onApplyCountermeasure}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black text-sm font-sans tracking-wide transition-all shadow-[0_0_30px_rgba(0,240,255,0.5)] hover:scale-105 flex items-center justify-center gap-2"
            >
              <Zap size={18} />
              <span>تنفيذ التدخل العلاجي الآن</span>
            </button>
          ) : (
            <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/60 flex items-center justify-between text-xs font-bold text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.4)]">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-400" />
                تم تفعيل الحماية الفضائية واستقرار المؤشرات!
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

        {/* Mars Comm Delay Switch Card */}
        <div className="p-3.5 bg-slate-950/85 border border-slate-800 rounded-2xl backdrop-blur-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              {isCommBlackout ? <WifiOff size={14} className="text-amber-400 animate-pulse" /> : <Radio size={14} className="text-emerald-400" />}
              <span>تأخر الاتصال مع الأرض</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {telemetry.commDelayMinutes} دقيقة زمن وصول الإشارة
            </span>
          </div>

          <button
            onClick={onToggleBlackout}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
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
