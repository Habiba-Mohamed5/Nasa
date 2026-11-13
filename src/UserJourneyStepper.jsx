import React from 'react';
import { Rocket, Compass, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { spaceAudio } from './utils/spaceAudio';
import { assetPath } from './utils/assetPath';

export const MISSION_PHASES = [
  {
    id: 1,
    day: 1,
    title: 'المرحلة 1: الإقلاع ومغادرة الأرض',
    subtitle: 'Earth Departure • SLS Injection',
    badge: 'LEO Launch • Day 1',
    image: assetPath('rocket_launch.jpg'),
    description: 'انطلاق صاروخ SLS نحو الفضاء السحيق. الجاذبية تنعدم تدريجياً، وبصمة الرائد في أفضل حالاتها (100% Baseline).',
    icon: Rocket,
    telemetry: { hr: 62, hrv: 64, bmd: 100, delay: 0.1, status: 'NOMINAL', color: '#00F0FF' }
  },
  {
    id: 2,
    day: 180,
    title: 'المرحلة 2: إبحار الفضاء السحيق',
    subtitle: 'Deep-Space Cruise • Baseline Drift',
    badge: 'Deep Space • Day 180',
    image: assetPath('astronaut_portrait.jpg'),
    description: '150 مليون كم بعيداً عن كوكبنا. السوائل تصعد للرأس (Cephalad Shift)، والعظام تبدأ في فقدان الكالسيوم.',
    icon: Compass,
    telemetry: { hr: 78, hrv: 44, bmd: 94.2, delay: 14.2, status: 'CAUTION', color: '#FFB800' }
  },
  {
    id: 3,
    day: 280,
    title: 'المرحلة 3: أزمة انقطاع الاتصال وهبوط الدورة',
    subtitle: 'Mars Blackout • Medical Alert',
    badge: 'RED ALERT • Day 280',
    image: assetPath('sans_scan.jpg'),
    description: 'انقطاع الاتصال مع الأرض لمدة 22 دقيقة! انتفاخ العصب البصري (SANS) مع هبوط حاد في البلازما وتسارع النبض.',
    icon: AlertTriangle,
    telemetry: { hr: 96, hrv: 22, bmd: 90.5, delay: 22.4, status: 'CRITICAL', color: '#FF2A55' }
  },
  {
    id: 4,
    day: 500,
    title: 'المرحلة 4: التدخل المستقل والوصول للمريخ',
    subtitle: 'Autonomous Protocol • Mars Orbit',
    badge: 'Mars Arrival • Day 500',
    image: assetPath('mars_planet.jpg'),
    description: 'نجاح بروتوكول الذكاء الاصطناعي (ARED + LBNP + أملاح). الرائد يصل لمدار المريخ بكامل لياقته واستقرار مؤشراته.',
    icon: CheckCircle2,
    telemetry: { hr: 68, hrv: 56, bmd: 95.8, delay: 22.4, status: 'MISSION SUCCESS', color: '#10B981' }
  }
];

export default function UserJourneyStepper({ activePhaseId, onSelectPhase }) {
  return (
    <div className="relative z-30 w-full max-w-6xl mx-auto px-4 py-1.5 shrink-0">
      {/* Responsive: Horizontal scroll on mobile, 4-col grid on desktop */}
      <div className="flex md:grid md:grid-cols-4 gap-2.5 overflow-x-auto no-scrollbar py-1">
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
              className={`relative min-w-[210px] md:min-w-0 p-2 md:p-2.5 rounded-2xl border text-right transition-all flex flex-col justify-between overflow-hidden group shadow-lg shrink-0 ${
                isActive
                  ? 'bg-slate-900/90 border-cyan-400/80 shadow-[0_0_20px_rgba(0,240,255,0.25)] ring-1 ring-cyan-400/50 scale-[1.01]'
                  : 'bg-slate-950/70 border-white/5 hover:border-cyan-500/30 text-slate-400 hover:text-white'
              }`}
            >
              {/* Photo Thumbnail Banner */}
              <div className="relative w-full h-12 md:h-14 rounded-xl overflow-hidden mb-1.5 border border-white/10 shadow-inner">
                <img
                  src={phase.image}
                  alt={phase.title}
                  className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                    isActive ? 'brightness-110 contrast-110' : 'brightness-75 opacity-70'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Floating Badge on top of Image */}
                <div className="absolute top-1 right-1.5 left-1.5 flex items-center justify-between">
                  <span
                    className="text-[9px] font-mono-tech px-2 py-0.5 rounded-full font-bold backdrop-blur-md"
                    style={{
                      backgroundColor: `${phase.telemetry.color}33`,
                      color: phase.telemetry.color,
                      border: `1px solid ${phase.telemetry.color}66`
                    }}
                  >
                    {phase.badge}
                  </span>
                  <div
                    className="w-4 h-4 rounded-md flex items-center justify-center backdrop-blur-md"
                    style={{ backgroundColor: `${phase.telemetry.color}33`, color: phase.telemetry.color }}
                  >
                    <Icon size={10} />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[11px] md:text-xs font-bold text-white leading-tight truncate font-cairo">
                  {phase.title}
                </h4>
                <p className="text-[9px] text-cyan-400/80 font-mono-tech truncate">
                  {phase.subtitle}
                </p>
              </div>

              {/* Progress Line */}
              <div className="w-full h-1 bg-slate-800/80 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: isActive ? '100%' : '25%',
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
