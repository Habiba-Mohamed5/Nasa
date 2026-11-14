import React, { useState, useEffect } from 'react';
import { Compass, Radio } from 'lucide-react';
import { spaceAudio } from '../utils/spaceAudio';

export default function SpaceScrollTelemetryRail() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');

  const milestones = [
    { id: 'hero', label: '01 // ORBITAL INSERTION', short: '01', alt: '400 KM' },
    { id: 'readiness', label: '02 // BIO-DIGITAL TWIN', short: '02', alt: '12,000 KM' },
    { id: 'features', label: '03 // CLINICAL PILLARS', short: '03', alt: '45,000 KM' },
    { id: 'ai-preview', label: '04 // AURA AI COPILOT', short: '04', alt: '250,000 KM' },
    { id: 'cockpit-cta', label: '05 // DEEP SPACE OPS', short: '05', alt: 'MARS TRANSIT' }
  ];

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
          if (totalScroll > 0) {
            const current = window.scrollY;
            const progress = Math.min(100, Math.max(0, (current / totalScroll) * 100));
            setScrollProgress(progress);

            // Determine active section based on scroll position
            milestones.forEach((m) => {
              const el = document.getElementById(m.id);
              if (el) {
                const rect = el.getBoundingClientRect();
                if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.2) {
                  setActiveSection(m.id);
                }
              }
            });
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToMilestone = (id) => {
    spaceAudio.playChirp();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <aside
      aria-label="Spaceflight Telemetry Altitude Rail"
      className="hidden xl:flex fixed right-5 top-1/2 -translate-y-1/2 z-40 flex-col items-center select-none pointer-events-auto"
    >
      {/* Top Telemetry Heading */}
      <div className="flex flex-col items-center gap-1 mb-3 text-[9px] font-mono-tech text-[#7AD7EA] tracking-widest uppercase opacity-80">
        <Radio size={11} className="animate-pulse text-[#7AD7EA]" />
        <span>DSN TRACK</span>
      </div>

      {/* Vertical Rail Track */}
      <div className="relative w-6 h-64 flex items-center justify-center">
        {/* Background Track Line */}
        <div className="absolute w-[2px] h-full bg-[#182A44] rounded-full overflow-hidden">
          {/* Active Glowing Fill */}
          <div
            className="w-full bg-gradient-to-b from-[#7AD7EA] via-[#7E78C9] to-[#E4783B] transition-all duration-150 ease-out shadow-[0_0_8px_rgba(122,215,234,0.6)]"
            style={{ height: `${scrollProgress}%` }}
          />
        </div>

        {/* Milestone Waypoints */}
        <div className="absolute inset-y-0 flex flex-col justify-between items-center py-1">
          {milestones.map((m) => {
            const isActive = activeSection === m.id;
            return (
              <button
                key={m.id}
                onClick={() => scrollToMilestone(m.id)}
                className="group relative flex items-center justify-center p-1.5 focus:outline-none"
                title={`${m.label} (${m.alt})`}
                aria-label={`Scroll to ${m.label}`}
              >
                {/* Node Dot */}
                <div
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-200 border ${
                    isActive
                      ? 'bg-[#7AD7EA] border-white scale-125 shadow-[0_0_12px_#7AD7EA]'
                      : 'bg-[#132238] border-[#7AD7EA]/30 group-hover:border-[#7AD7EA] group-hover:scale-110'
                  }`}
                />

                {/* Hover / Active Flyout Label */}
                <div className="absolute right-7 px-2.5 py-1 rounded-md bg-[#0D1728]/95 border border-[#7AD7EA]/25 text-[10px] font-mono-tech text-[#F4F7FC] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none shadow-xl flex items-center gap-2">
                  <span className="text-[#7AD7EA] font-bold">{m.short}</span>
                  <span>{m.label.split('// ')[1]}</span>
                  <span className="text-[9px] text-[#98A7BD] border-l border-white/10 pl-1.5">{m.alt}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Altitude Indicator Bottom */}
      <div className="mt-3 text-[9px] font-mono-tech text-[#98A7BD] tracking-wider text-center">
        <span className="block text-[#F4F7FC] font-bold">{Math.round(scrollProgress)}%</span>
        <span>TRAJECTORY</span>
      </div>
    </aside>
  );
}
