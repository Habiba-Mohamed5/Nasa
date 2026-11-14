import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Rocket, Sun, ShieldAlert, ArrowRight, CheckCircle2, Globe, Orbit } from 'lucide-react';
import InteractiveSolarSystem from '../components/InteractiveSolarSystem';
import { MISSION_PHASES } from '../UserJourneyStepper';
import { spaceAudio } from '../utils/spaceAudio';
import { assetPath } from '../utils/assetPath';

export default function PlanetsPage({ setMissionDay, setCurrentPhase, onOpenAiDrawer }) {
  const bodies = [
    {
      id: 'moon',
      title: 'THE MOON',
      subtitle: 'Earth Departure & Artemis Gateway',
      quote: 'The First Celestial Body To Be The Object Of Space Exploration',
      image: assetPath('rocket_launch.jpg'),
      day: 1,
      phaseId: 1,
      stats: {
        distance: '384,400 km from Earth',
        gravity: '0.166 G (1/6th Earth)',
        missionContext: 'Artemis VII SLS Injection & Lunar Flyby. Baseline crew vitals at 100% nominal pre-flight calibration.'
      },
      description: 'The Moon serves as humanity’s proving ground for deep space habitation. In the Artemis program, the lunar Gateway station validates long-duration life support systems and autonomous operations before crews embark on the 3-year journey to Mars.'
    },
    {
      id: 'sun',
      title: 'THE SUN',
      subtitle: 'Interplanetary Radiation & Solar Storms',
      quote: 'The Sun Governs Deep Space Biology And Solar Storms',
      image: assetPath('spacecraft_cockpit_mars.jpg'),
      day: 180,
      phaseId: 2,
      stats: {
        distance: '1 Astronomical Unit (149.6M km)',
        hazard: 'Galactic Cosmic Rays (GCR) & Solar Particle Events (SPE)',
        missionContext: 'Day 180 Deep Space Cruise. Crew experiences cumulative microgravity cephalad fluid shift and bone loss.'
      },
      description: 'While unvisited, the Sun governs deep space biology. Solar Particle Events (SPE) from coronal mass ejections present acute radiation sickness threats, requiring storm shelters within the Orion spacecraft and autonomous dosimeter monitoring.'
    },
    {
      id: 'mars',
      title: 'MARS',
      subtitle: 'Orbital Insertion & Surface Expedition',
      quote: 'Mars Has Been An Important Part Of Human Space Exploration',
      image: assetPath('mars_planet.jpg'),
      day: 500,
      phaseId: 4,
      stats: {
        distance: '55M to 400M km from Earth',
        gravity: '0.38 G (38% of Earth Gravity)',
        missionContext: 'Day 500 Mars Orbital Insertion. Autonomous protocols stabilize crew cardiovascular and neuromuscular tone.'
      },
      description: 'The primary destination of 21st-century human spaceflight. Reaching Mars requires surviving 500 days of microgravity, isolation, and communication blackout, followed by rapid adaptation to Martian surface gravity.'
    }
  ];

  const handleSelectBody = (body) => {
    spaceAudio.playChirp();
    if (setMissionDay) setMissionDay(body.day);
    if (setCurrentPhase) {
      const match = MISSION_PHASES.find(p => p.id === body.phaseId);
      if (match) setCurrentPhase(match);
    }
  };

  return (
    <div className="space-y-10 sm:space-y-14 max-w-7xl mx-auto px-3.5 sm:px-8 py-3 sm:py-6">
      {/* ─────────────────────────────────────────────────────────────
          1. Header Banner
      ───────────────────────────────────────────────────────────── */}
      <section className="p-6 sm:p-10 md:p-12 rounded-2xl sm:rounded-[36px] cinematic-card-bg border border-[rgba(180,210,235,0.16)] shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#132238]/80 border border-[#7AD7EA]/30 text-[10px] font-mono-tech text-[#7AD7EA] uppercase tracking-widest">
            <Orbit size={13} className="text-[#7AD7EA]" />
            <span>SOLAR SYSTEM OBSERVATORY & FLIGHT HAZARD RADAR</span>
          </div>
          <h1 className="font-titan text-3xl sm:text-4xl lg:text-5xl text-[#F4F7FC] uppercase leading-tight tracking-wide">
            EXPLORE THE CELESTIAL BODIES
          </h1>
          <p className="text-xs sm:text-sm text-[#C7D2E3] leading-relaxed max-w-2xl font-sans">
            Interactive astronomical radar spanning all eight planetary orbits from Mercury to Neptune. Inspect real NASA planetary physics, surface gravities, atmospheric compositions, and critical human spaceflight survival hazards.
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. Interactive Solar System Explorer (Mercury to Neptune)
      ───────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass size={18} className="text-[#7AD7EA]" />
            <h2 className="font-titan text-xl sm:text-2xl text-[#F4F7FC] uppercase tracking-wide">
              INTERACTIVE SOLAR SYSTEM RADAR
            </h2>
          </div>
          <span className="text-[11px] font-mono-tech text-[#98A7BD] hidden sm:inline">
            NASA-STD-3001 VOL 1 ALIGNED
          </span>
        </div>

        <InteractiveSolarSystem
          setMissionDay={setMissionDay}
          setCurrentPhase={setCurrentPhase}
          onOpenAiDrawer={onOpenAiDrawer}
        />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. Artemis VII & Mars Deep Space Milestones
      ───────────────────────────────────────────────────────────── */}
      <section className="space-y-6 pt-4">
        <div className="border-t border-[rgba(180,210,235,0.14)] pt-8 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono-tech text-[#7AD7EA] uppercase tracking-widest block">
              TRANSIT WAYPOINTS & MISSION DAY MILESTONES
            </span>
            <h2 className="font-titan text-xl sm:text-2xl text-[#F4F7FC] uppercase tracking-wide">
              CRITICAL CELESTIAL ENCOUNTERS
            </h2>
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {bodies.map((b) => (
            <div
              key={b.id}
              id={b.id}
              className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-[28px] bg-[#132238]/85 border border-[rgba(180,210,235,0.14)] hover:border-[#7AD7EA]/40 hover:shadow-[0_15px_40px_rgba(7,17,31,0.8)] transition-all grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center"
            >
              {/* Image */}
              <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-[rgba(180,210,235,0.16)] shadow-xl h-60 sm:h-72 group">
                <img
                  src={b.image}
                  alt={b.title}
                  className="w-full h-full object-cover filter brightness-95 contrast-105 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07111F] via-transparent to-transparent opacity-85" />
                <div className="absolute top-3 left-3">
                  <span className="text-[9px] font-mono-tech px-2.5 py-1 rounded-full bg-[#07111F]/90 text-[#7AD7EA] border border-[#7AD7EA]/40 font-bold uppercase">
                    MISSION DAY {b.day}
                  </span>
                </div>
              </div>

              {/* Text & Specs */}
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <span className="text-[10px] font-mono-tech text-[#7AD7EA] uppercase tracking-wider block mb-1">
                    {b.subtitle}
                  </span>
                  <h3 className="font-titan text-2xl sm:text-3xl text-[#F4F7FC] uppercase tracking-wide">
                    {b.title}
                  </h3>
                  <p className="text-xs italic text-[#7AD7EA] mt-1 font-sans">
                    "{b.quote}"
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-[#C7D2E3] leading-relaxed font-sans">
                  {b.description}
                </p>

                {/* Specs Box */}
                <div className="p-3.5 rounded-xl bg-[#0D1728] border border-[rgba(180,210,235,0.1)] space-y-1.5 text-xs font-mono-tech">
                  <div className="flex items-center justify-between">
                    <span className="text-[#98A7BD]">DISTANCE:</span>
                    <span className="text-[#F4F7FC]">{b.stats.distance}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#98A7BD]">GRAVITATIONAL SPECS:</span>
                    <span className="text-[#7AD7EA]">{b.stats.gravity || b.stats.hazard}</span>
                  </div>
                  <div className="pt-1 border-t border-[rgba(180,210,235,0.08)] text-[11px] text-[#C7D2E3]">
                    {b.stats.missionContext}
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleSelectBody(b)}
                    className="px-5 py-2.5 rounded-full bg-[#E4783B] hover:bg-[#d46a30] text-[#07111F] font-bold text-xs tracking-wider transition-all shadow-[0_0_15px_rgba(228,120,59,0.3)] hover:scale-105"
                  >
                    SET TRAJECTORY TO {b.title}
                  </button>
                  <Link
                    to="/workspace"
                    className="px-4 py-2.5 rounded-full bg-[#182A44] text-[#F4F7FC] border border-[#7AD7EA]/30 text-xs font-bold transition-all hover:bg-[#1f3657]"
                  >
                    Open in Workspace
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
