import React from 'react';
import { Rocket, Compass, AlertTriangle, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';
import { spaceAudio } from './utils/spaceAudio';

export const MISSION_PHASES = [
  {
    id: 1,
    day: 1,
    title: 'المرحلة 1: الإقلاع ومغادرة الأرض',
    subtitle: 'Earth Departure & 0-G Injection',
    badge: 'LEO Launch • Day 1',
    description: 'انطلاق صاروخ SLS نحو الفضاء السحيق. الجاذبية تنعدم تدريجياً، وبصمة الرائد في أفضل حالاتها (100% Baseline).',
    bgColor: 'from-blue-600/20 to-cyan-600/20',
    borderColor: 'border-cyan-500/40',
    icon: Rocket,
    telemetry: { hr: 62, hrv: 64, bmd: 100, delay: 0.1, status: 'NOMINAL', color: '#00F0FF' }
  },
  {
    id: 2,
    day: 180,
    title: 'المرحلة 2: إبحار الفضاء السحيق',
    subtitle: 'Deep-Space Cruise & Baseline Drift',
    badge: 'Deep Space • Day 180',
    description: '150 مليون كم بعيداً عن كوكبنا. السوائل تصعد للرأس (Cephalad Shift)، والعظام تبدأ في فقدان الكالسيوم.',
    bgColor: 'from-purple-600/20 to-blue-600/20',
    borderColor: 'border-purple-500/40',
    icon: Compass,
    telemetry: { hr: 78, hrv: 44, bmd: 94.2, delay: 14.2, status: 'CAUTION', color: '#FFB800' }
  },
  {
    id: 3,
    day: 280,
    title: 'المرحلة 3: أزمة انقطاع الاتصال وهبوط الدورة',
    subtitle: 'Mars Comm Blackout & Medical Crisis',
    badge: 'RED ALERT • Day 280',
    description: 'انقطاع الاتصال مع الأرض لمدة 22 دقيقة! انتفاخ العصب البصري (SANS) مع هبوط حاد في البلازما وتسارع النبض.',
    bgColor: 'from-rose-600/30 to-amber-600/30',
    borderColor: 'border-rose-500/60',
    icon: AlertTriangle,
    telemetry: { hr: 96, hrv: 22, bmd: 90.5, delay: 22.4, status: 'CRITICAL', color: '#FF2A55' }
  },
  {
    id: 4,
    day: 500,
    title: 'المرحلة 4: التدخل المستقل والوصول للمريخ',
    subtitle: 'Autonomous Protocol & Mars Orbit Insertion',
    badge: 'Mars Arrival • Day 500',
    description: 'نجاح بروتوكول الذكاء الاصطناعي (ARED + LBNP + أملاح). الرائد يصل لمدار المريخ بكامل لياقته واستقرار مؤشراته.',
    bgColor: 'from-emerald-600/20 to-cyan-600/20',
    borderColor: 'border-emerald-500/40',
    icon: CheckCircle2,
    telemetry: { hr: 68, hrv: 56, bmd: 95.8, delay: 22.4, status: 'MISSION SUCCESS', color: '#10B981' }
  }
];

export default function UserJourneyStepper({ activePhaseId, onSelectPhase }) {
  return (
    <div className="relative z-30 w-full max-w-5xl mx-auto px-4 py-2">
      {/* 4 Interactive Phase Steps */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {MISSION_PHASES.map((phase) => {
          const Icon = phase.icon;
          const isActive = activePhaseId === phase.id;

          return (
            <button
              key={phase.id}
              onClick={() => {
                if (phase.id === 3) {
                  spaceAudio.playEmergencyAlarm();
                } else {
                  spaceAudio.playChirp();
                }
                onSelectPhase(phase);
              }}
              className={`relative p-3 rounded-2xl border text-right transition-all flex flex-col justify-between overflow-hidden group shadow-lg ${
                isActive
                  ? `bg-gradient-to-b ${phase.bgColor} ${phase.borderColor} shadow-[0_0_25px_rgba(0,240,255,0.25)] scale-[1.02]`
                  : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {/* Active Step Indicator Pill */}
              <div className="flex items-center justify-between w-full mb-1.5">
                <span
                  className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold"
                  style={{
                    backgroundColor: `${phase.telemetry.color}22`,
                    color: phase.telemetry.color,
                    border: `1px solid ${phase.telemetry.color}44`
                  }}
                >
                  {phase.badge}
                </span>
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${phase.telemetry.color}22`, color: phase.telemetry.color }}
                >
                  <Icon size={14} />
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black text-white leading-tight mb-0.5">{phase.title}</h4>
                <p className="text-[10px] text-slate-400 font-mono truncate">{phase.subtitle}</p>
              </div>

              {/* Progress Line */}
              <div className="w-full h-1 bg-slate-800/80 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: isActive ? '100%' : '30%',
                    backgroundColor: phase.telemetry.color
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
