import React, { useState, useMemo } from 'react';
import { Activity, TrendingUp, AlertTriangle } from 'lucide-react';

export default function DualWaveChart({ telemetry }) {
  const [activeMetric, setActiveMetric] = useState('hrv'); // 'hr', 'hrv', 'bmd', 'bp'

  const metricsConfig = {
    hrv: {
      label: 'Heart Rate Variability (RMSSD)',
      unit: 'ms',
      baselineVal: telemetry.baseline.restingHRV,
      currentVal: telemetry.currentHRV,
      driftPct: telemetry.hrvDriftPct,
      isHigherWorse: false,
      color: telemetry.currentHRV < 30 ? '#FF2A55' : telemetry.currentHRV < 45 ? '#FFB800' : '#00F0FF',
      thresholdLabel: 'Critical: < 25 ms'
    },
    hr: {
      label: 'Resting Heart Rate',
      unit: 'bpm',
      baselineVal: telemetry.baseline.restingHR,
      currentVal: telemetry.currentHR,
      driftPct: telemetry.hrDriftPct,
      isHigherWorse: true,
      color: telemetry.currentHR > 90 ? '#FF2A55' : telemetry.currentHR > 78 ? '#FFB800' : '#00F0FF',
      thresholdLabel: 'Elevated: > 85 bpm'
    },
    bmd: {
      label: 'Bone Mineral Density Retention',
      unit: '%',
      baselineVal: 100,
      currentVal: telemetry.bmdRetention,
      driftPct: -telemetry.bmdLoss,
      isHigherWorse: false,
      color: telemetry.bmdRetention < 92 ? '#FF2A55' : telemetry.bmdRetention < 96 ? '#FFB800' : '#00F0FF',
      thresholdLabel: 'Osteopenia Risk: < 92%'
    },
    bp: {
      label: 'Systolic Blood Pressure',
      unit: 'mmHg',
      baselineVal: telemetry.baseline.bpSystolic,
      currentVal: telemetry.currentSystolic,
      driftPct: Number((((telemetry.currentSystolic - telemetry.baseline.bpSystolic) / telemetry.baseline.bpSystolic) * 100).toFixed(1)),
      isHigherWorse: true,
      color: telemetry.currentSystolic > 140 ? '#FF2A55' : telemetry.currentSystolic > 128 ? '#FFB800' : '#00F0FF',
      thresholdLabel: 'Cephalad Stasis: > 135'
    }
  };

  const currentConfig = metricsConfig[activeMetric];

  // Generate 14-day historical points leading to the current day
  const chartPoints = useMemo(() => {
    const points = [];
    const baseDay = Math.max(1, telemetry.missionDay - 13);
    for (let i = 0; i < 14; i++) {
      const day = baseDay + i;
      const dayFactor = i / 13; // 0 to 1 progress
      // interpolate from previous to current
      const diff = currentConfig.currentVal - currentConfig.baselineVal;
      const simulatedVal = currentConfig.baselineVal + diff * (0.3 + dayFactor * 0.7);
      points.push({
        day,
        baseline: currentConfig.baselineVal,
        val: Number(simulatedVal.toFixed(1))
      });
    }
    return points;
  }, [telemetry.missionDay, activeMetric, currentConfig]);

  // Compute SVG coordinates
  const svgWidth = 320;
  const svgHeight = 120;
  const padding = { top: 15, bottom: 25, left: 35, right: 15 };

  const minVal = Math.min(...chartPoints.map(p => Math.min(p.val, p.baseline))) * 0.9;
  const maxVal = Math.max(...chartPoints.map(p => Math.max(p.val, p.baseline))) * 1.1;

  const getX = (index) => padding.left + (index / (chartPoints.length - 1)) * (svgWidth - padding.left - padding.right);
  const getY = (val) => svgHeight - padding.bottom - ((val - minVal) / (maxVal - minVal || 1)) * (svgHeight - padding.top - padding.bottom);

  // Path for baseline (straight dashed line)
  const baselineY = getY(currentConfig.baselineVal);
  const baselinePath = `M ${padding.left} ${baselineY} L ${svgWidth - padding.right} ${baselineY}`;

  // Path for actual microgravity trajectory
  const actualPath = chartPoints.reduce((acc, point, index) => {
    const x = getX(index);
    const y = getY(point.val);
    return `${acc} ${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }, '');

  // Shaded area path between actual and baseline
  const areaPath = `${actualPath} L ${svgWidth - padding.right} ${baselineY} L ${padding.left} ${baselineY} Z`;

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-md shadow-xl flex flex-col justify-between">
      {/* Top Header & Metric Selector */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-cyan-400" />
          <span className="text-xs font-bold text-white tracking-wide uppercase">Individual Baseline Drift</span>
        </div>

        {/* Metric Selector Pills */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-0.5 rounded-lg border border-slate-800 text-[10px]">
          {['hrv', 'hr', 'bmd', 'bp'].map((key) => (
            <button
              key={key}
              onClick={() => setActiveMetric(key)}
              className={`px-2 py-0.5 rounded font-mono font-bold uppercase transition-all ${
                activeMetric === key
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Title & Live Value Pill */}
      <div className="flex items-baseline justify-between mb-1">
        <div>
          <div className="text-xs text-slate-300 font-medium">{currentConfig.label}</div>
          <div className="text-[10px] text-slate-500 font-mono">14-Day Trajectory vs. Earth Baseline</div>
        </div>

        <div className="text-right">
          <div className="font-mono text-lg font-black text-white flex items-center justify-end gap-1">
            <span style={{ color: currentConfig.color }}>{currentConfig.currentVal}</span>
            <span className="text-[11px] text-slate-400 font-normal">{currentConfig.unit}</span>
          </div>
          <div className="text-[10px] font-mono flex items-center justify-end gap-1">
            <span className="text-slate-500">Base: {currentConfig.baselineVal}</span>
            <span
              className="px-1 rounded text-[9px] font-bold"
              style={{
                backgroundColor: `${currentConfig.color}22`,
                color: currentConfig.color
              }}
            >
              {currentConfig.driftPct > 0 ? `+${currentConfig.driftPct}%` : `${currentConfig.driftPct}%`}
            </span>
          </div>
        </div>
      </div>

      {/* Dual-Wave SVG Canvas */}
      <div className="w-full relative my-1">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="driftAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={currentConfig.color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={currentConfig.color} stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={padding.left} y1={padding.top} x2={svgWidth - padding.right} y2={padding.top} stroke="#334155" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.4" />
          <line x1={padding.left} y1={svgHeight - padding.bottom} x2={svgWidth - padding.right} y2={svgHeight - padding.bottom} stroke="#334155" strokeWidth="0.5" opacity="0.5" />

          {/* Area between baseline and trajectory */}
          <path d={areaPath} fill="url(#driftAreaGrad)" />

          {/* Baseline Curve (Dashed Cyan) */}
          <path d={baselinePath} fill="none" stroke="#00F0FF" strokeWidth="1.2" strokeDasharray="4 4" opacity="0.7" />

          {/* Actual Microgravity Trajectory (Solid Glowing) */}
          <path d={actualPath} fill="none" stroke={currentConfig.color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />

          {/* Current point highlight */}
          {chartPoints.length > 0 && (
            <g transform={`translate(${getX(chartPoints.length - 1)}, ${getY(currentConfig.currentVal)})`}>
              <circle r="5" fill={currentConfig.color} opacity="0.3" className="animate-ping" />
              <circle r="3.5" fill={currentConfig.color} stroke="#ffffff" strokeWidth="1" />
            </g>
          )}

          {/* Y-Axis Value Labels */}
          <text x={padding.left - 4} y={getY(currentConfig.baselineVal) + 3} textAnchor="end" fill="#00F0FF" fontSize="9" fontFamily="monospace" opacity="0.8">
            {currentConfig.baselineVal}
          </text>
          <text x={padding.left - 4} y={getY(currentConfig.currentVal) + 3} textAnchor="end" fill={currentConfig.color} fontSize="9" fontFamily="monospace" fontWeight="bold">
            {Math.round(currentConfig.currentVal)}
          </text>

          {/* X-Axis Day Labels */}
          <text x={padding.left} y={svgHeight - 8} fill="#64748B" fontSize="8" fontFamily="monospace">
            Day {chartPoints[0]?.day}
          </text>
          <text x={svgWidth - padding.right} y={svgHeight - 8} textAnchor="end" fill="#94A3B8" fontSize="8" fontFamily="monospace">
            Day {chartPoints[chartPoints.length - 1]?.day} (Now)
          </text>
        </svg>
      </div>

      {/* Chart Legend & Threshold Note */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-2 font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-cyan-400 inline-block border-b border-dashed border-cyan-400" />
            Earth Baseline
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-1 inline-block rounded-full" style={{ backgroundColor: currentConfig.color }} />
            Active Microgravity
          </span>
        </div>
        <span className="text-amber-400/90 flex items-center gap-1">
          <AlertTriangle size={10} />
          {currentConfig.thresholdLabel}
        </span>
      </div>
    </div>
  );
}
