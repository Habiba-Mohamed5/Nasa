import React, { useEffect, useRef } from 'react';

export default function SpaceNebulaCanvas({ missionDay = 180 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Stars array
    const stars = Array.from({ length: 180 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.4,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.4 + 0.1
    }));

    let time = 0;

    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Deep space gradient
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.4,
        50,
        width * 0.5,
        height * 0.5,
        width * 0.7
      );
      bgGrad.addColorStop(0, '#0a1428');
      bgGrad.addColorStop(0.5, '#060913');
      bgGrad.addColorStop(1, '#03050a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Distant Mars Red Planet
      const marsProgress = Math.min(1, Math.max(0, missionDay / 500));
      const marsX = width * 0.85 - marsProgress * (width * 0.2);
      const marsY = height * 0.22;
      const marsRadius = 45 + marsProgress * 30;

      // Mars Glow
      const marsGlow = ctx.createRadialGradient(marsX, marsY, marsRadius * 0.6, marsX, marsY, marsRadius * 1.8);
      marsGlow.addColorStop(0, 'rgba(239, 68, 68, 0.4)');
      marsGlow.addColorStop(0.5, 'rgba(185, 28, 28, 0.15)');
      marsGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = marsGlow;
      ctx.beginPath();
      ctx.arc(marsX, marsY, marsRadius * 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Mars Body
      const marsBody = ctx.createRadialGradient(marsX - marsRadius * 0.3, marsY - marsRadius * 0.3, 5, marsX, marsY, marsRadius);
      marsBody.addColorStop(0, '#f87171');
      marsBody.addColorStop(0.5, '#b91c1c');
      marsBody.addColorStop(1, '#450a0a');
      ctx.fillStyle = marsBody;
      ctx.beginPath();
      ctx.arc(marsX, marsY, marsRadius, 0, Math.PI * 2);
      ctx.fill();

      // Distant Earth Blue Crescent
      const earthX = width * 0.12;
      const earthY = height * 0.75;
      const earthRadius = Math.max(15, 38 - marsProgress * 22);

      const earthGlow = ctx.createRadialGradient(earthX, earthY, earthRadius * 0.5, earthX, earthY, earthRadius * 2);
      earthGlow.addColorStop(0, 'rgba(6, 182, 212, 0.3)');
      earthGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = earthGlow;
      ctx.beginPath();
      ctx.arc(earthX, earthY, earthRadius * 2, 0, Math.PI * 2);
      ctx.fill();

      const earthBody = ctx.createRadialGradient(earthX - earthRadius * 0.3, earthY - earthRadius * 0.3, 2, earthX, earthY, earthRadius);
      earthBody.addColorStop(0, '#38bdf8');
      earthBody.addColorStop(0.7, '#0284c7');
      earthBody.addColorStop(1, '#082f49');
      ctx.fillStyle = earthBody;
      ctx.beginPath();
      ctx.arc(earthX, earthY, earthRadius, 0, Math.PI * 2);
      ctx.fill();

      // Interplanetary Transit Vector Line
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
      ctx.setLineDash([4, 6]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(earthX, earthY);
      ctx.quadraticCurveTo(width * 0.5, height * 0.6, marsX, marsY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Stars animation
      stars.forEach((star) => {
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }

        const flicker = Math.sin(time * 3 + star.x) * 0.2 + 0.8;
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * flicker})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [missionDay]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 opacity-80" />;
}
