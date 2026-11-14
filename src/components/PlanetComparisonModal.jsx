import React, { useState } from 'react';
import { X, ArrowRightLeft, ShieldAlert, Thermometer, Compass, Activity } from 'lucide-react';
import { CELESTIAL_BODIES } from '../data/solarSystemData';
import { spaceAudio } from '../utils/spaceAudio';

export default function PlanetComparisonModal({ isOpen, onClose, initialPlanetId = 'mars' }) {
  const planetsOnly = CELESTIAL_BODIES.filter(b => b.id !== 'sun');

  const [planetAId, setPlanetAId] = useState('earth');
  const [planetBId, setPlanetBId] = useState(initialPlanetId === 'earth' ? 'mars' : initialPlanetId);

  if (!isOpen) return null;

  const planetA = CELESTIAL_BODIES.find(p => p.id === planetAId) || planetsOnly[2];
  const planetB = CELESTIAL_BODIES.find(p => p.id === planetBId) || planetsOnly[3];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Planet Comparison Matrix"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0D1728] border border-[rgba(180,210,235,0.22)] shadow-[0_25px_80px_rgba(0,0,0,0.9)] p-5 sm:p-8 space-y-6 text-[#F4F7FC] select-none font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[rgba(180,210,235,0.14)] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#7AD7EA]/15 border border-[#7AD7EA]/30 flex items-center justify-center text-[#7AD7EA]">
              <ArrowRightLeft size={18} />
            </div>
            <div>
              <h2 className="font-titan text-xl sm:text-2xl text-[#F4F7FC] uppercase tracking-wide">
                CELESTIAL COMPARISON MATRIX
              </h2>
              <span className="text-xs font-mono-tech text-[#7AD7EA]">
                SPACESHIP 404 // PLANETARY PHYSICS & BIOMEDICAL CONTRAST
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              spaceAudio.playChirp();
              onClose();
            }}
            className="w-10 h-10 rounded-full bg-[#182A44] hover:bg-[#1f3657] text-[#98A7BD] hover:text-[#F4F7FC] border border-white/10 flex items-center justify-center transition-all"
            aria-label="Close Comparison"
          >
            <X size={18} />
          </button>
        </div>

        {/* Planet Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Planet A Selector */}
          <div className="p-3.5 rounded-2xl bg-[#132238]/80 border border-white/10 space-y-2">
            <span className="text-[10px] font-mono-tech text-[#7AD7EA] uppercase block">
              PRIMARY BODY (A)
            </span>
            <select
              value={planetAId}
              onChange={(e) => {
                spaceAudio.playChirp();
                setPlanetAId(e.target.value);
              }}
              className="w-full bg-[#07111F] border border-[#7AD7EA]/30 rounded-xl px-3 py-2 text-sm font-bold text-[#F4F7FC] font-mono-tech focus:outline-none focus:border-[#7AD7EA]"
            >
              {CELESTIAL_BODIES.map(p => (
                <option key={`opt-a-${p.id}`} value={p.id}>
                  {p.name} ({p.type})
                </option>
              ))}
            </select>
          </div>

          {/* Planet B Selector */}
          <div className="p-3.5 rounded-2xl bg-[#132238]/80 border border-white/10 space-y-2">
            <span className="text-[10px] font-mono-tech text-[#E4783B] uppercase block">
              COMPARATIVE BODY (B)
            </span>
            <select
              value={planetBId}
              onChange={(e) => {
                spaceAudio.playChirp();
                setPlanetBId(e.target.value);
              }}
              className="w-full bg-[#07111F] border border-[#E4783B]/30 rounded-xl px-3 py-2 text-sm font-bold text-[#F4F7FC] font-mono-tech focus:outline-none focus:border-[#E4783B]"
            >
              {CELESTIAL_BODIES.map(p => (
                <option key={`opt-b-${p.id}`} value={p.id}>
                  {p.name} ({p.type})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-tech border-collapse">
            <thead>
              <tr className="border-b border-[rgba(180,210,235,0.16)] text-[#98A7BD] text-[11px]">
                <th className="py-2.5 px-3">PARAMETER</th>
                <th className="py-2.5 px-3 text-[#7AD7EA] font-bold">{planetA.name.toUpperCase()}</th>
                <th className="py-2.5 px-3 text-[#E4783B] font-bold">{planetB.name.toUpperCase()}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="py-3 px-3 text-[#98A7BD]">Classification</td>
                <td className="py-3 px-3 text-[#F4F7FC]">{planetA.type}</td>
                <td className="py-3 px-3 text-[#F4F7FC]">{planetB.type}</td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-[#98A7BD]">Diameter</td>
                <td className="py-3 px-3 text-[#F4F7FC] font-bold">{planetA.diameterKm} ({planetA.diameterRelative})</td>
                <td className="py-3 px-3 text-[#F4F7FC] font-bold">{planetB.diameterKm} ({planetB.diameterRelative})</td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-[#98A7BD]">Surface Gravity</td>
                <td className="py-3 px-3 text-[#7AD7EA] font-bold">{planetA.gravityG} G ({planetA.gravityMs})</td>
                <td className="py-3 px-3 text-[#E4783B] font-bold">{planetB.gravityG} G ({planetB.gravityMs})</td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-[#98A7BD]">Distance from Sun</td>
                <td className="py-3 px-3 text-[#F4F7FC]">{planetA.distanceKm} ({planetA.distanceAU} AU)</td>
                <td className="py-3 px-3 text-[#F4F7FC]">{planetB.distanceKm} ({planetB.distanceAU} AU)</td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-[#98A7BD]">Mean Temperature</td>
                <td className="py-3 px-3 text-[#F4F7FC]">{planetA.meanTemp} ({planetA.temperatureRange})</td>
                <td className="py-3 px-3 text-[#F4F7FC]">{planetB.meanTemp} ({planetB.temperatureRange})</td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-[#98A7BD]">Orbital Year</td>
                <td className="py-3 px-3 text-[#F4F7FC]">{planetA.orbitalPeriod}</td>
                <td className="py-3 px-3 text-[#F4F7FC]">{planetB.orbitalPeriod}</td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-[#98A7BD]">Rotation Day</td>
                <td className="py-3 px-3 text-[#F4F7FC]">{planetA.rotationPeriod}</td>
                <td className="py-3 px-3 text-[#F4F7FC]">{planetB.rotationPeriod}</td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-[#98A7BD]">Atmosphere</td>
                <td className="py-3 px-3 text-[#C7D2E3] font-sans text-[11px] leading-relaxed">{planetA.atmosphere}</td>
                <td className="py-3 px-3 text-[#C7D2E3] font-sans text-[11px] leading-relaxed">{planetB.atmosphere}</td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-[#98A7BD]">DSN Radio Latency</td>
                <td className="py-3 px-3 text-[#7AD7EA]">{planetA.commDelayOneWay}</td>
                <td className="py-3 px-3 text-[#E4783B]">{planetB.commDelayOneWay}</td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-[#98A7BD]">Radiation Risk Level</td>
                <td className="py-3 px-3 font-bold text-[#7AD7EA]">{planetA.nasaRiskLevel}</td>
                <td className="py-3 px-3 font-bold text-[#E4783B]">{planetB.nasaRiskLevel}</td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-[#98A7BD]">Astronaut Health Hazards</td>
                <td className="py-3 px-3 text-[#C7D2E3] font-sans text-[11px] leading-relaxed">
                  {planetA.astronautHazards.radiation} • {planetA.astronautHazards.microgravity}
                </td>
                <td className="py-3 px-3 text-[#C7D2E3] font-sans text-[11px] leading-relaxed">
                  {planetB.astronautHazards.radiation} • {planetB.astronautHazards.microgravity}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[rgba(180,210,235,0.14)] flex justify-end">
          <button
            onClick={() => {
              spaceAudio.playChirp();
              onClose();
            }}
            className="px-6 py-2.5 rounded-full bg-[#182A44] hover:bg-[#1f3657] text-[#F4F7FC] font-bold text-xs font-mono-tech border border-white/10 transition-all"
          >
            DISMISS COMPARISON
          </button>
        </div>
      </div>
    </div>
  );
}
