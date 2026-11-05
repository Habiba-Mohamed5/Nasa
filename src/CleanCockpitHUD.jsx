import React from 'react';
import {
  Heart, Activity, Bone, Brain, Zap, ShieldCheck,
  Radio, WifiOff, Clock, User, CheckCircle2, RotateCcw,
  Sparkles, Compass, AlertCircle
} from 'lucide-react';
import { spaceAudio } from './utils/spaceAudio';

export default function CleanCockpitHUD({
  telemetry,
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
          LEFT HUD: 3 CLEAN VISUAL GAUGES (Zero Text Clutter)
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute top-20 left-6 z-30 w-72 flex flex-col gap-3 pointer-events-auto">
        {/* Heart Rate & Cardiovascular Card */}
        <div className="p-4 bg-slate-950/75 border border-cyan-500/30 rounded-2xl backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.6)] transition-all hover:border-cyan-400">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <Heart size={18} className="animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white tracking-wider">صحة القلب والدورة</h4>
                <span className="text-[10px] text-slate-400 font-mono">Heart & Vitals</span>
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
            <div className="font-mono text-3xl font-black text-white">
              {bpm}
              <span className="text-xs text-slate-400 font-normal ml-1">BPM</span>
            </div>
            <div className="text-right text-[11px] font-mono text-cyan-300">
              HRV: <strong className="text-white">{hrv} ms</strong>
            </div>
          </div>

          {/* Animated ECG Pulse Line */}
          <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-rose-500 transition-all duration-300"
              style={{ width: `${Math.min(100, (bpm / 120) * 100)}%` }}
            />
          </div>
        </div>

        {/* Bone & Muscle Density Card */}
        <div className="p-4 bg-slate-950/75 border border-cyan-500/30 rounded-2xl backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.6)] transition-all hover:border-cyan-400">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Bone size={18} />
              </div>
              <div>
                <h4 className="text-xs font-black text-white tracking-wider">كثافة العظام والعضلات</h4>
                <span className="text-[10px] text-slate-400 font-mono">Bone Mineral Density</span>
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
            <span className="text-[10px] text-slate-400">Trabecular Spine</span>
          </div>

          {/* Bone Density Progress Bar */}
          <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-300"
              style={{ width: `${bmd}%` }}
            />
          </div>
        </div>

        {/* Brain & Cognitive Energy Card */}
        <div className="p-4 bg-slate-950/75 border border-cyan-500/30 rounded-2xl backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.6)] transition-all hover:border-cyan-400">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Brain size={18} />
              </div>
              <div>
                <h4 className="text-xs font-black text-white tracking-wider">الطاقة العصبية واليقظة</h4>
                <span className="text-[10px] text-slate-400 font-mono">Cognitive & Sleep</span>
              </div>
            </div>
            <span className="text-[10px] text-cyan-300 font-mono font-bold">
              {healthScore}/100
            </span>
          </div>

          {/* Energy battery bar */}
          <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-cyan-400 transition-all duration-300"
              style={{ width: `${healthScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          RIGHT HUD: VISUAL INTERVENTION CARD (One-Click Protocol)
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute top-20 right-6 z-30 w-80 flex flex-col gap-3 pointer-events-auto">
        {/* Mission Flight Surgeon Status */}
        <div className="p-4 bg-slate-950/80 border border-cyan-500/30 rounded-2xl backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-black text-white tracking-wider font-mono">
                AUTONOMOUS FLIGHT SURGEON
              </span>
            </div>
            <span className="text-[10px] text-cyan-300 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 font-bold">
              NASA HRP
            </span>
          </div>

          {/* Visual Device Illustration Card */}
          <div className="p-3 bg-gradient-to-br from-slate-900 to-cyan-950/40 border border-slate-800 rounded-xl mb-3 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0">
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
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black text-sm font-sans tracking-wide transition-all shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:scale-105 flex items-center justify-center gap-2"
            >
              <Zap size={16} />
              <span>تنفيذ التدخل العلاجي الآن</span>
            </button>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-between text-xs font-bold text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
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
        <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl backdrop-blur-xl flex items-center justify-between">
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
