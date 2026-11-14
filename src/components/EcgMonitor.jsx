import React, { useEffect, useRef } from 'react';
import { Activity, Radio } from 'lucide-react';

export default function EcgMonitor({
  bpm = 72,
  isPaused = false,
  className = ''
}) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const stateRef = useRef({
    x: 0,
    points: [],
    lastTime: performance.now()
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 320;
    const height = rect.height || 90;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const midY = height / 2;
    const gridColor = 'rgba(122, 215, 234, 0.08)';
    const gridMajorColor = 'rgba(122, 215, 234, 0.16)';

    // Function to calculate P-QRS-T amplitude at phase t in [0, 1)
    const getEcgSample = (phase) => {
      // P wave: 0.05 to 0.15 (rounded bump)
      if (phase >= 0.05 && phase < 0.15) {
        const pNorm = (phase - 0.05) / 0.10;
        return Math.sin(pNorm * Math.PI) * 12;
      }
      // PR segment: flat
      if (phase >= 0.15 && phase < 0.20) {
        return 0;
      }
      // Q wave: 0.20 to 0.23 (slight negative dip)
      if (phase >= 0.20 && phase < 0.23) {
        const qNorm = (phase - 0.20) / 0.03;
        return -Math.sin(qNorm * Math.PI) * 7;
      }
      // R wave: 0.23 to 0.28 (sharp tall systolic spike)
      if (phase >= 0.23 && phase < 0.28) {
        const rNorm = (phase - 0.23) / 0.05;
        return Math.sin(rNorm * Math.PI) * 44;
      }
      // S wave: 0.28 to 0.32 (sharp negative deflection)
      if (phase >= 0.28 && phase < 0.32) {
        const sNorm = (phase - 0.28) / 0.04;
        return -Math.sin(sNorm * Math.PI) * 14;
      }
      // ST segment: flat
      if (phase >= 0.32 && phase < 0.38) {
        return 0;
      }
      // T wave: 0.38 to 0.54 (gentle ventricular repolarization)
      if (phase >= 0.38 && phase < 0.54) {
        const tNorm = (phase - 0.38) / 0.16;
        return Math.sin(tNorm * Math.PI) * 16;
      }
      // Baseline resting interval
      return 0;
    };

    let phase = 0;
    let sweepX = 0;
    const history = [];
    const maxPoints = Math.floor(width);

    const render = (time) => {
      animRef.current = requestAnimationFrame(render);
      if (isPaused) return;

      const dt = (time - stateRef.current.lastTime) / 1000;
      stateRef.current.lastTime = time;

      // Rate of progress through the cardiac cycle based on BPM
      const cycleFrequency = (bpm || 72) / 60; // cycles per second
      phase = (phase + dt * cycleFrequency) % 1.0;

      const sample = getEcgSample(phase);
      const y = midY - sample;

      history.push({ x: sweepX, y });
      if (history.length > maxPoints) {
        history.shift();
      }

      sweepX = (sweepX + dt * 75) % width;

      // Clear canvas
      ctx.fillStyle = '#060E1A';
      ctx.fillRect(0, 0, width, height);

      // Draw standard medical ECG millimeter grid
      ctx.lineWidth = 1;
      ctx.strokeStyle = gridColor;
      for (let gx = 0; gx < width; gx += 10) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
        ctx.stroke();
      }
      for (let gy = 0; gy < height; gy += 10) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
        ctx.stroke();
      }

      // Major grid lines (50px / 0.2s)
      ctx.strokeStyle = gridMajorColor;
      for (let gx = 0; gx < width; gx += 50) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
        ctx.stroke();
      }
      for (let gy = 0; gy < height; gy += 50) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
        ctx.stroke();
      }

      // Draw ECG trace with phosphor glow
      if (history.length > 1) {
        ctx.shadowColor = bpm > 90 ? '#F43F5E' : '#7AD7EA';
        ctx.shadowBlur = 8;
        ctx.lineWidth = 2;
        ctx.strokeStyle = bpm > 90 ? '#FB7185' : '#7AD7EA';

        ctx.beginPath();
        for (let i = 0; i < history.length; i++) {
          const pt = history[i];
          // Don't draw wrap-around line across canvas
          if (i > 0 && Math.abs(pt.x - history[i - 1].x) > 20) {
            ctx.stroke();
            ctx.beginPath();
          }
          if (i === 0) {
            ctx.moveTo(pt.x, pt.y);
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Draw scanning sweep head
        const currentPt = history[history.length - 1];
        if (currentPt) {
          ctx.beginPath();
          ctx.arc(currentPt.x, currentPt.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
        }
      }
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [bpm, isPaused]);

  return (
    <div className={`p-2.5 rounded-xl bg-[#091322] border border-[rgba(180,210,235,0.18)] shadow-inner relative overflow-hidden ${className}`}>
      <div className="flex items-center justify-between mb-1.5 text-[10px] font-mono-tech">
        <div className="flex items-center gap-1.5 text-[#7AD7EA]">
          <Activity size={12} className={bpm > 90 ? 'text-rose-400 animate-pulse' : 'text-[#7AD7EA]'} />
          <span className="font-bold tracking-wider">CARDIAC TELEMETRY // LEAD II</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-[#98A7BD] px-1.5 py-0.5 rounded bg-[#132238] border border-white/5">
            25 mm/s • 10 mm/mV
          </span>
          <span className="text-xs font-titan font-bold text-white px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
            {bpm} <span className="text-[9px] font-mono-tech text-cyan-300">BPM</span>
          </span>
        </div>
      </div>

      <div className="relative w-full h-[76px] rounded-lg overflow-hidden border border-[rgba(180,210,235,0.1)]">
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
        />
        {/* Subtle vignette */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#060E1A]/40 via-transparent to-[#060E1A]/40" />
      </div>

      <div className="flex items-center justify-between mt-1 text-[8px] font-mono-tech text-[#98A7BD]">
        <span>P-R: 160ms • QRS: 85ms • Q-Tc: 412ms</span>
        <span className="text-amber-300/80">SIMULATED BIO-MODEL // NASA STD</span>
      </div>
    </div>
  );
}
