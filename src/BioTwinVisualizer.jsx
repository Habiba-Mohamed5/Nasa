import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Activity, Brain, Bone, ShieldAlert, CheckCircle2, Info } from 'lucide-react';

export default function BioTwinVisualizer({
  telemetry,
  selectedSystem,
  setSelectedSystem,
  onOrganClick
}) {
  const [hoveredNode, setHoveredNode] = useState(null);

  const hrAnimationDuration = Math.max(0.4, 60 / (telemetry.currentHR || 72));

  // Determine colors based on telemetry thresholds
  const heartColor = telemetry.currentHR > 95 ? '#FF2A55' : telemetry.currentHR > 80 ? '#FFB800' : '#00F0FF';
  const brainColor = telemetry.fluidShiftIndex > 65 || telemetry.behavioralScore < 60 ? '#FFB800' : '#00F0FF';
  const boneColor = telemetry.bmdRetention < 93 ? '#FF2A55' : telemetry.bmdRetention < 96 ? '#FFB800' : '#00F0FF';

  const systems = [
    { id: 'all', label: 'All Systems', icon: Activity },
    { id: 'cardiovascular', label: 'Cardiovascular', icon: Heart },
    { id: 'skeletal', label: 'Skeletal Density', icon: Bone },
    { id: 'neural', label: 'Neural & SANS', icon: Brain }
  ];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-4 overflow-hidden select-none">
      {/* Background Cybernetic HUD Grid & Reticle */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="hudGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#060913" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50%" cy="50%" r="38%" fill="url(#hudGlow)" />
          <circle cx="50%" cy="50%" r="42%" fill="none" stroke="#00F0FF" strokeWidth="0.5" strokeDasharray="6 8" />
          <circle cx="50%" cy="50%" r="28%" fill="none" stroke="#00F0FF" strokeWidth="0.5" strokeOpacity="0.3" />
          <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="#00F0FF" strokeWidth="0.5" strokeOpacity="0.2" />
          <line x1="50%" y1="10%" x2="50%" y2="90%" stroke="#00F0FF" strokeWidth="0.5" strokeOpacity="0.2" />
        </svg>
      </div>

      {/* Top Filter Buttons for Systems */}
      <div className="relative z-20 flex items-center gap-1.5 p-1 bg-slate-900/80 backdrop-blur-md rounded-xl border border-cyan-500/20 shadow-lg">
        {systems.map((sys) => {
          const Icon = sys.icon;
          const isActive = selectedSystem === sys.id;
          return (
            <button
              key={sys.id}
              onClick={() => setSelectedSystem(sys.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon size={13} className={isActive ? 'text-cyan-400' : 'text-slate-400'} />
              <span>{sys.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Holographic SVG Bio-Twin */}
      <div className="relative z-10 w-full max-w-[280px] h-[340px] flex items-center justify-center my-1">
        <svg
          viewBox="0 0 240 380"
          className="w-full h-full filter drop-shadow-[0_0_20px_rgba(0,240,255,0.15)]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
            </linearGradient>
            <radialGradient id="heartPulseGlow">
              <stop offset="0%" stopColor={heartColor} stopOpacity="0.8" />
              <stop offset="100%" stopColor={heartColor} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Hologram Silhouette Outline */}
          <path
            d="M120 25 
               C132 25 142 35 142 50 
               C142 62 135 72 127 75 
               C145 80 165 92 170 115 
               L178 185 C180 195 174 200 167 198 L160 145 
               L158 230 C158 245 152 270 148 310 L140 365 
               C138 375 128 375 125 365 L121 260 L119 260 
               L115 365 C112 375 102 375 100 365 L92 310 
               C88 270 82 245 82 230 L80 145 
               L73 198 C66 200 60 195 62 185 
               L70 115 C75 92 95 80 113 75 
               C105 72 98 62 98 50 
               C98 35 108 25 120 25 Z"
            fill="url(#bodyGradient)"
            stroke="#00F0FF"
            strokeWidth="1.2"
            strokeOpacity="0.5"
            strokeDasharray="4 2"
          />

          {/* Internal Skeleton & Vascular Landmarks */}
          {(selectedSystem === 'all' || selectedSystem === 'skeletal') && (
            <g id="skeletal-layer" className="transition-opacity duration-300">
              {/* Vertebral Column (Spine) */}
              {Array.from({ length: 9 }).map((_, i) => (
                <rect
                  key={`vertebra-${i}`}
                  x={116}
                  y={88 + i * 14}
                  width={8}
                  height={8}
                  rx={2}
                  fill={i > 5 ? boneColor : '#00F0FF'}
                  opacity={i > 5 ? 0.9 : 0.6}
                  stroke={boneColor}
                  strokeWidth="0.5"
                  className="cursor-pointer hover:opacity-100"
                  onClick={() => onOrganClick && onOrganClick('skeletal')}
                />
              ))}

              {/* Femur & Pelvis */}
              <path
                d="M102 215 Q120 225 138 215 L144 285 L132 285 L128 230 L112 230 L108 285 L96 285 Z"
                fill="none"
                stroke={boneColor}
                strokeWidth="1.2"
                strokeOpacity="0.7"
                strokeDasharray="2 3"
              />
            </g>
          )}

          {/* Cardiovascular Network */}
          {(selectedSystem === 'all' || selectedSystem === 'cardiovascular') && (
            <g id="cardiovascular-layer" className="cursor-pointer" onClick={() => onOrganClick && onOrganClick('cardiovascular')}>
              {/* Arterial Arch & Vena Cava */}
              <path
                d="M120 95 Q130 110 120 135 Q115 155 120 180"
                fill="none"
                stroke={heartColor}
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.8"
              />
              <path
                d="M120 108 Q145 115 160 140"
                fill="none"
                stroke={heartColor}
                strokeWidth="1"
                opacity="0.6"
              />
              <path
                d="M120 108 Q95 115 80 140"
                fill="none"
                stroke={heartColor}
                strokeWidth="1"
                opacity="0.6"
              />

              {/* Heart Node with Dynamic Pulse */}
              <circle cx="120" cy="122" r="16" fill="url(#heartPulseGlow)">
                <animate
                  attributeName="r"
                  values="12; 18; 12"
                  dur={`${hrAnimationDuration}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.9; 0.3; 0.9"
                  dur={`${hrAnimationDuration}s`}
                  repeatCount="indefinite"
                />
              </circle>

              <circle
                cx="120"
                cy="122"
                r="7"
                fill={heartColor}
                stroke="#ffffff"
                strokeWidth="1.5"
                onMouseEnter={() => setHoveredNode('heart')}
                onMouseLeave={() => setHoveredNode(null)}
              />
            </g>
          )}

          {/* Neural / Cranial Node (Brain & SANS) */}
          {(selectedSystem === 'all' || selectedSystem === 'neural') && (
            <g id="neural-layer" className="cursor-pointer" onClick={() => onOrganClick && onOrganClick('neural')}>
              <circle
                cx="120"
                cy="48"
                r="12"
                fill={brainColor}
                fillOpacity="0.25"
                stroke={brainColor}
                strokeWidth="1.2"
                strokeDasharray="3 3"
                onMouseEnter={() => setHoveredNode('cranial')}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <animate
                  attributeName="stroke-dashoffset"
                  values="0; 20"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </circle>
              {/* Eye nodes representing SANS */}
              <circle cx="114" cy="46" r="2.2" fill="#00F0FF" />
              <circle cx="126" cy="46" r="2.2" fill="#00F0FF" />
            </g>
          )}

          {/* Interactive Target Rings on Key Organs */}
          <g transform="translate(120, 122)">
            <circle cx="0" cy="0" r="22" fill="none" stroke={heartColor} strokeWidth="0.6" strokeDasharray="3 4">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0"
                to="360"
                dur="8s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        </svg>

        {/* Floating Telemetry Callouts over the Bio-Twin */}
        <div className="absolute top-4 left-0 text-left bg-slate-900/90 border border-cyan-500/30 rounded-lg p-2 backdrop-blur-md text-[10px] shadow-lg">
          <div className="text-cyan-400 font-mono font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            CRANIAL / SANS
          </div>
          <div className="text-slate-300 font-mono">Shift: {telemetry.fluidShiftIndex}%</div>
          <div className="text-slate-400 text-[9px]">Cephalad Pressure</div>
        </div>

        <div className="absolute top-24 right-0 text-right bg-slate-900/90 border border-cyan-500/30 rounded-lg p-2 backdrop-blur-md text-[10px] shadow-lg">
          <div className="text-cyan-400 font-mono font-bold flex items-center justify-end gap-1">
            CARDIAC PACER
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: heartColor }}
            />
          </div>
          <div className="font-mono text-white text-xs font-bold">{telemetry.currentHR} BPM</div>
          <div className="text-slate-400 text-[9px]">HRV: {telemetry.currentHRV} ms</div>
        </div>

        <div className="absolute bottom-6 left-0 text-left bg-slate-900/90 border border-cyan-500/30 rounded-lg p-2 backdrop-blur-md text-[10px] shadow-lg">
          <div className="text-amber-400 font-mono font-bold">LUMBAR / BMD</div>
          <div className="font-mono text-white text-xs font-bold">{telemetry.bmdRetention}%</div>
          <div className="text-rose-400 text-[9px]">Loss: -{telemetry.bmdLoss}%</div>
        </div>
      </div>

      {/* Bottom Status Ribbon */}
      <div className="relative z-20 w-full flex items-center justify-between px-3 py-2 bg-slate-950/70 border border-white/5 rounded-xl text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Bio-Twin State:</span>
          <span
            className="px-2 py-0.5 rounded font-bold uppercase text-[10px]"
            style={{
              backgroundColor: `${telemetry.riskColor}22`,
              color: telemetry.riskColor,
              border: `1px solid ${telemetry.riskColor}55`
            }}
          >
            {telemetry.riskLevel}
          </span>
        </div>
        <div className="text-slate-400 text-[11px]">
          Composite Index: <span className="text-white font-bold">{telemetry.overallHealthIndex}/100</span>
        </div>
      </div>
    </div>
  );
}
