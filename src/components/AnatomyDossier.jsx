import React from 'react';
import {
  Heart, Wind, Brain, Bone, Activity, X, RotateCcw,
  ShieldCheck, AlertTriangle, Info, Play, Pause, ChevronRight
} from 'lucide-react';
import { ORGANS_DATA } from '../data/anatomyKnowledgeBase';
import EcgMonitor from './EcgMonitor';

export default function AnatomyDossier({
  selectedOrganId,
  onClose,
  onResetView,
  simulatedBpm,
  setSimulatedBpm,
  simulatedRr,
  setSimulatedRr,
  isHeartPaused,
  setIsHeartPaused,
  isBreathingPaused,
  setIsBreathingPaused,
  currentBreathingPhase
}) {
  if (!selectedOrganId || !ORGANS_DATA[selectedOrganId]) return null;

  const organ = ORGANS_DATA[selectedOrganId];

  return (
    <div className="absolute top-3 right-3 left-3 sm:left-auto sm:w-[380px] max-h-[85%] overflow-y-auto z-30 rounded-2xl bg-[#091424]/95 backdrop-blur-xl border border-[rgba(122,215,234,0.3)] shadow-[0_20px_50px_rgba(0,0,0,0.7)] p-4 text-[#F4F7FC] space-y-3.5 animate-in fade-in zoom-in-95 duration-200 custom-scrollbar">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-[rgba(180,210,235,0.12)] pb-2.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded-full bg-[#7AD7EA]/15 text-[#7AD7EA] border border-[#7AD7EA]/30 font-bold uppercase">
              {organ.systemEn}
            </span>
            <span className="text-[9px] font-mono-tech text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              FOCUS ACTIVE
            </span>
          </div>
          <h3 className="font-titan text-base text-[#F4F7FC] mt-1 tracking-wide">
            {organ.name}
          </h3>
          <p className="text-[11px] font-mono-tech text-[#98A7BD]">
            {organ.nameEn}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onResetView}
            title="إعادة ضبط زاوية الكاميرا للجسد بالكامل"
            className="p-1.5 rounded-lg bg-[#132238] hover:bg-[#1E3250] text-[#98A7BD] hover:text-[#7AD7EA] border border-white/5 transition-colors"
          >
            <RotateCcw size={14} />
          </button>
          <button
            onClick={onClose}
            title="إغلاق اللوحة"
            className="p-1.5 rounded-lg bg-[#132238] hover:bg-rose-950/60 text-[#98A7BD] hover:text-rose-400 border border-white/5 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Physiological Summary */}
      <div className="p-2.5 rounded-xl bg-[#060E1A]/80 border border-white/[0.06] text-xs text-[#C7D2E3] leading-relaxed">
        {organ.physiologicalSummary}
      </div>

      {/* Special Interactive Section for Heart */}
      {selectedOrganId === 'heart' && (
        <div className="space-y-2.5 p-3 rounded-xl bg-[#132238]/60 border border-[rgba(244,63,94,0.25)]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono-tech font-bold text-rose-400 flex items-center gap-1.5">
              <Heart size={13} className="fill-rose-500 animate-pulse" />
              محاكي النبض والانقباض القلبي (BPM)
            </span>
            <button
              onClick={() => setIsHeartPaused(!isHeartPaused)}
              className="px-2 py-0.5 rounded text-[9px] font-mono-tech border border-white/10 bg-[#091322] hover:bg-slate-800 text-slate-300 flex items-center gap-1"
            >
              {isHeartPaused ? <Play size={10} /> : <Pause size={10} />}
              <span>{isHeartPaused ? 'تشغيل' : 'إيقاف مؤقت'}</span>
            </button>
          </div>

          {/* BPM Presets */}
          <div className="grid grid-cols-4 gap-1.5 text-xs font-mono-tech">
            {[
              { val: 60, label: '60 (راحة)' },
              { val: 72, label: '72 (طبيعي)' },
              { val: 90, label: '90 (عمل EVA)' },
              { val: 120, label: '120 (إجهاد)' }
            ].map(preset => (
              <button
                key={preset.val}
                onClick={() => setSimulatedBpm(preset.val)}
                className={`py-1 px-1.5 rounded-lg border text-center text-[10px] font-bold transition-all ${
                  simulatedBpm === preset.val
                    ? 'bg-rose-500/20 text-rose-300 border-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                    : 'bg-[#091322] text-[#98A7BD] border-white/5 hover:border-white/20'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* BPM Slider */}
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-[10px] font-mono-tech text-[#98A7BD]">
              <span>معدل النبض اليدوي</span>
              <span className="font-titan text-rose-400">{simulatedBpm} BPM</span>
            </div>
            <input
              type="range"
              min="45"
              max="160"
              value={simulatedBpm}
              onChange={(e) => setSimulatedBpm(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer h-1.5 bg-[#060E1A] rounded-lg"
            />
          </div>

          {/* Synchronized ECG Canvas */}
          <EcgMonitor bpm={simulatedBpm} isPaused={isHeartPaused} />
        </div>
      )}

      {/* Special Interactive Section for Lungs */}
      {selectedOrganId === 'lungs' && (
        <div className="space-y-2.5 p-3 rounded-xl bg-[#132238]/60 border border-[rgba(56,189,248,0.25)]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono-tech font-bold text-sky-400 flex items-center gap-1.5">
              <Wind size={13} className="text-sky-400 animate-pulse" />
              محاكي التمدد الرئوي والتنفس (RR)
            </span>
            <button
              onClick={() => setIsBreathingPaused(!isBreathingPaused)}
              className="px-2 py-0.5 rounded text-[9px] font-mono-tech border border-white/10 bg-[#091322] hover:bg-slate-800 text-slate-300 flex items-center gap-1"
            >
              {isBreathingPaused ? <Play size={10} /> : <Pause size={10} />}
              <span>{isBreathingPaused ? 'تشغيل' : 'إيقاف مؤقت'}</span>
            </button>
          </div>

          {/* Respiratory Rate Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono-tech text-[#98A7BD]">
              <span>معدل الأنفاس بالدقيقة</span>
              <span className="font-titan text-sky-400">{simulatedRr} Breaths/min</span>
            </div>
            <input
              type="range"
              min="10"
              max="28"
              value={simulatedRr}
              onChange={(e) => setSimulatedRr(Number(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer h-1.5 bg-[#060E1A] rounded-lg"
            />
          </div>

          {/* Real-time Breathing Phase Badge */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-[#060E1A] border border-sky-500/20 text-[10px] font-mono-tech">
            <span className="text-[#98A7BD]">طبيعة المرحلة الحالية:</span>
            <span className={`font-bold px-2 py-0.5 rounded text-[9px] ${
              currentBreathingPhase === 'inspiration'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40 animate-pulse'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
            }`}>
              {currentBreathingPhase === 'inspiration' ? 'شهيق فاعل (Inspiration)' : 'زفير ارتدادي (Expiration)'}
            </span>
          </div>
        </div>
      )}

      {/* Clinical Telemetry Grid */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-mono-tech text-[#7AD7EA] uppercase tracking-wider block">
          المؤشرات الفسيولوجية المرجعية (Reference Metrics)
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono-tech">
          {organ.metrics.map(m => (
            <div key={m.key} className="p-2 rounded-xl bg-[#091322] border border-white/5 space-y-0.5">
              <span className="text-[9px] text-[#98A7BD] block">{m.label}</span>
              <div className="flex items-baseline justify-between">
                <span className="font-titan text-sm text-[#F4F7FC]">
                  {m.key === 'bpm' ? simulatedBpm : m.key === 'rr' ? simulatedRr : m.defaultVal}
                </span>
                <span className="text-[9px] text-[#7AD7EA]">{m.unit}</span>
              </div>
              <span className="text-[8px] text-[#98A7BD]/70 block">
                المجال: {m.normalRange}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Microgravity Effects */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-mono-tech text-amber-400 flex items-center gap-1">
          <AlertTriangle size={11} />
          التغيرات والتكيف مع انعدام الجاذبية (Zero-G Adaptations):
        </span>
        <ul className="space-y-1.5 text-[11px] text-[#C7D2E3] leading-relaxed">
          {organ.microgravityImpact.map((item, idx) => (
            <li key={idx} className="flex items-start gap-1.5 bg-[#060E1A]/40 p-2 rounded-lg border border-white/5">
              <ChevronRight size={12} className="text-amber-400 shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* NASA Countermeasures */}
      <div className="p-2.5 rounded-xl bg-emerald-950/25 border border-emerald-500/25 text-[11px] text-emerald-200 leading-relaxed space-y-1">
        <div className="flex items-center gap-1.5 font-bold font-mono-tech text-emerald-300 text-[10px]">
          <ShieldCheck size={12} />
          بروتوكول ناسا للوقاية والمقاومة (NASA Countermeasure):
        </div>
        <div>{organ.nasaCountermeasure}</div>
      </div>

      {/* Distinction Disclaimer */}
      <div className="flex items-center gap-1 text-[8px] font-mono-tech text-[#98A7BD]/80 border-t border-white/5 pt-2">
        <Info size={10} className="text-cyan-400 shrink-0" />
        <span>{organ.simulationNote}</span>
      </div>
    </div>
  );
}
