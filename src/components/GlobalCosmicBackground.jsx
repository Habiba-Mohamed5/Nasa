import React, { useMemo, useState, useEffect } from 'react';

/**
 * GlobalCosmicBackground
 * Highly realistic, multi-layered cosmic space background with subtle scroll parallax:
 * - Deep Space Navy (#07111F) & Midnight Blue (#0D1728) base gradients
 * - 4 distinct astronomical star layers: Micro-star dust, Mid-magnitude stars, Focal beacons with diffraction halos, and Open star clusters
 * - Layered scroll parallax (stars and nebulae shift at calibrated speeds)
 * - Soft Cosmic Purple (#7E78C9) & Soft Cyan (#7AD7EA) deep space nebulae
 * - Thin orbital mechanics trajectories and subtle constellation lines
 * - Contrast-preserving atmospheric vignette for AAA text readability
 * - Zero layout shift, fully hardware accelerated (translate3d), responsive across all devices
 */
export default function GlobalCosmicBackground() {
  const [scrollY, setScrollY] = useState(0);

  // Listen to window scroll with requestAnimationFrame for smooth 60fps/120fps GPU parallax
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY || window.pageYOffset || 0);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 1. Distant Micro-Star Dust (160 tiny stars: 0.7px - 1.1px)
  const microStars = useMemo(() => {
    const list = [];
    for (let i = 0; i < 160; i++) {
      const x = ((i * 41 + 17) % 100);
      const y = ((i * 83 + 31) % 100);
      const size = (i % 5 === 0) ? 1.1 : (i % 3 === 0) ? 0.9 : 0.7;
      const opacity = 0.2 + ((i * 19) % 45) / 100;
      const color = (i % 6 === 0) ? '#7AD7EA' : (i % 9 === 0) ? '#7E78C9' : '#F4F7FC';
      list.push({ id: `micro-${i}`, x, y, size, opacity, color });
    }
    return list;
  }, []);

  // 2. Mid-Field Stars (65 stars: 1.3px - 1.9px with subtle stellar classification colors)
  const midStars = useMemo(() => {
    const list = [];
    const colors = ['#F4F7FC', '#FFFFFF', '#7AD7EA', '#C7D2E3', '#FFF5E4', '#7E78C9'];
    for (let i = 0; i < 65; i++) {
      const x = ((i * 59 + 23) % 100);
      const y = ((i * 67 + 43) % 100);
      const size = 1.3 + ((i * 13) % 7) / 10;
      const opacity = 0.35 + ((i * 23) % 50) / 100;
      const color = colors[i % colors.length];
      const twinkleType = i % 3 === 0 ? 'fast' : i % 2 === 0 ? 'slow' : null;
      list.push({ id: `mid-${i}`, x, y, size, opacity, color, twinkleType });
    }
    return list;
  }, []);

  // 3. Focal Beacon Stars with Subtle Atmospheric Halos (16 prominent stars)
  const beaconStars = useMemo(() => {
    return [
      { id: 'b-1', x: 12, y: 15, size: 2.4, color: '#7AD7EA', halo: 'rgba(122, 215, 234, 0.45)' },
      { id: 'b-2', x: 28, y: 32, size: 2.2, color: '#F4F7FC', halo: 'rgba(244, 247, 252, 0.35)' },
      { id: 'b-3', x: 74, y: 18, size: 2.6, color: '#7E78C9', halo: 'rgba(126, 120, 201, 0.45)' },
      { id: 'b-4', x: 88, y: 28, size: 2.3, color: '#7AD7EA', halo: 'rgba(122, 215, 234, 0.40)' },
      { id: 'b-5', x: 45, y: 55, size: 2.2, color: '#FFF5E4', halo: 'rgba(255, 245, 228, 0.35)' },
      { id: 'b-6', x: 82, y: 64, size: 2.5, color: '#7AD7EA', halo: 'rgba(122, 215, 234, 0.45)' },
      { id: 'b-7', x: 19, y: 72, size: 2.4, color: '#F4F7FC', halo: 'rgba(244, 247, 252, 0.40)' },
      { id: 'b-8', x: 63, y: 84, size: 2.3, color: '#7E78C9', halo: 'rgba(126, 120, 201, 0.40)' },
      { id: 'b-9', x: 34, y: 88, size: 2.2, color: '#7AD7EA', halo: 'rgba(122, 215, 234, 0.35)' },
      { id: 'b-10', x: 92, y: 92, size: 2.5, color: '#F4F7FC', halo: 'rgba(244, 247, 252, 0.45)' },
      { id: 'b-11', x: 52, y: 22, size: 2.0, color: '#7AD7EA', halo: 'rgba(122, 215, 234, 0.30)' },
      { id: 'b-12', x: 6, y: 48, size: 2.3, color: '#FFF5E4', halo: 'rgba(255, 245, 228, 0.40)' },
      { id: 'b-13', x: 95, y: 12, size: 2.4, color: '#7AD7EA', halo: 'rgba(122, 215, 234, 0.40)' },
      { id: 'b-14', x: 68, y: 42, size: 2.1, color: '#F4F7FC', halo: 'rgba(244, 247, 252, 0.35)' },
      { id: 'b-15', x: 15, y: 92, size: 2.2, color: '#7E78C9', halo: 'rgba(126, 120, 201, 0.35)' },
      { id: 'b-16', x: 58, y: 68, size: 2.4, color: '#7AD7EA', halo: 'rgba(122, 215, 234, 0.40)' }
    ];
  }, []);

  // 4. Subtle Astronomical Open Star Clusters (Natural groupings like the Pleiades)
  const starClusters = useMemo(() => {
    return [
      // Cluster Alpha (Top-Right deep space)
      {
        baseX: 79, baseY: 22,
        offsets: [
          [0, 0, 1.4], [0.8, -0.6, 1.0], [-0.7, 0.5, 0.9], [1.2, 0.7, 1.2],
          [-1.0, -0.8, 0.8], [0.3, 1.1, 1.1], [-0.4, -1.2, 0.9], [1.5, -0.3, 0.8]
        ]
      },
      // Cluster Beta (Bottom-Left)
      {
        baseX: 18, baseY: 68,
        offsets: [
          [0, 0, 1.3], [-0.9, 0.4, 0.9], [0.7, -0.7, 1.1], [1.1, 0.8, 0.8],
          [-0.6, -1.0, 1.0], [0.4, 1.2, 0.9], [-1.3, -0.2, 0.8]
        ]
      },
      // Cluster Gamma (Lower-Right)
      {
        baseX: 86, baseY: 76,
        offsets: [
          [0, 0, 1.2], [0.9, -0.5, 0.9], [-0.8, 0.6, 1.0], [1.2, 0.4, 0.8],
          [-0.5, -0.9, 0.9], [0.6, 1.0, 1.1]
        ]
      }
    ];
  }, []);

  // Calibrated parallax translation values (subtle, non-distracting)
  const parallaxDistantY = -scrollY * 0.04;
  const parallaxMidY = -scrollY * 0.09;
  const parallaxBrightY = -scrollY * 0.16;
  const parallaxNebulaY = -scrollY * 0.22;
  const parallaxOrbitY = -scrollY * 0.06;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0"
    >
      {/* ─────────────────────────────────────────────────────────────
          1. Deep Space Navy to Midnight Blue Continuous Gradient Base
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#07111F] via-[#0D1728] to-[#07111F]" />

      {/* ─────────────────────────────────────────────────────────────
          2. Layered Deep Space Nebulae (Organic Radial Glows with Scroll Parallax)
      ───────────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translate3d(0, ${parallaxNebulaY}px, 0)` }}
      >
        {/* Soft Cosmic Purple Nebula (Top-Center) */}
        <div
          className="absolute w-[720px] h-[720px] rounded-full blur-[150px] opacity-[0.16] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #7E78C9 0%, rgba(126, 120, 201, 0.35) 40%, transparent 70%)',
            top: '4%',
            left: '38%',
            transform: 'translate(-50%, -20%)',
          }}
        />

        {/* Soft Cyan Atmospheric Horizon (Right-Center) */}
        <div
          className="absolute w-[620px] h-[620px] rounded-full blur-[140px] opacity-[0.14] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #7AD7EA 0%, rgba(122, 215, 234, 0.30) 42%, transparent 70%)',
            top: '38%',
            right: '-6%',
          }}
        />

        {/* Deep Cosmic Indigo / Slate Glow (Bottom-Left) */}
        <div
          className="absolute w-[680px] h-[680px] rounded-full blur-[160px] opacity-[0.12] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #7E78C9 0%, #132238 60%, transparent 80%)',
            bottom: '4%',
            left: '-6%',
          }}
        />

        {/* Subtle Warm Galactic Center Glow (Subtle burnt-orange rim support) */}
        <div
          className="absolute w-[440px] h-[440px] rounded-full blur-[130px] opacity-[0.08] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #E4783B 0%, rgba(228, 120, 59, 0.25) 45%, transparent 75%)',
            top: '18%',
            left: '12%',
          }}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. Global Orbital Trajectory Curves & Constellation Lines
      ───────────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 will-change-transform opacity-70"
        style={{ transform: `translate3d(0, ${parallaxOrbitY}px, 0)` }}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 1920 1080"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="globalOrbitGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7AD7EA" stopOpacity="0.14" />
              <stop offset="45%" stopColor="#7E78C9" stopOpacity="0.09" />
              <stop offset="100%" stopColor="#07111F" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="globalOrbitGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7E78C9" stopOpacity="0.12" />
              <stop offset="50%" stopColor="#7AD7EA" stopOpacity="0.07" />
              <stop offset="100%" stopColor="#07111F" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Upper Orbital Arc */}
          <path
            d="M -150 180 C 450 100, 1250 480, 2100 280"
            stroke="url(#globalOrbitGrad1)"
            strokeWidth="1.5"
            strokeDasharray="6 8"
          />

          {/* Lower Trajectory Arc */}
          <path
            d="M 50 960 C 700 800, 1400 1040, 2050 720"
            stroke="url(#globalOrbitGrad2)"
            strokeWidth="1.2"
            strokeDasharray="4 6"
          />

          {/* Subtle Deep Space Constellation Vectors */}
          <g stroke="rgba(199, 210, 227, 0.14)" strokeWidth="0.8">
            <line x1="240" y1="160" x2="330" y2="220" />
            <line x1="330" y1="220" x2="440" y2="190" />
            <line x1="1520" y1="580" x2="1610" y2="530" />
            <line x1="1610" y1="530" x2="1730" y2="610" />
            <line x1="1730" y1="610" x2="1820" y2="570" />
          </g>
        </svg>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. Layer A: Distant Micro-Star Dust (Parallax Speed: 0.04)
      ───────────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translate3d(0, ${parallaxDistantY}px, 0)` }}
      >
        {microStars.map((s) => (
          <span
            key={s.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              backgroundColor: s.color,
              opacity: s.opacity,
            }}
          />
        ))}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. Layer B: Mid-Magnitude Stars & Clusters (Parallax Speed: 0.09)
      ───────────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translate3d(0, ${parallaxMidY}px, 0)` }}
      >
        {midStars.map((s) => (
          <span
            key={s.id}
            className={`absolute rounded-full pointer-events-none ${
              s.twinkleType === 'fast'
                ? 'animate-twinkle-fast'
                : s.twinkleType === 'slow'
                ? 'animate-twinkle-slow'
                : ''
            }`}
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              backgroundColor: s.color,
              opacity: s.opacity,
            }}
          />
        ))}

        {/* Star Clusters */}
        {starClusters.map((cluster, cIdx) => (
          <div key={`cluster-${cIdx}`} className="absolute pointer-events-none">
            {cluster.offsets.map(([ox, oy, sz], starIdx) => (
              <span
                key={`cstar-${cIdx}-${starIdx}`}
                className="absolute rounded-full"
                style={{
                  left: `${cluster.baseX + ox}%`,
                  top: `${cluster.baseY + oy}%`,
                  width: `${sz}px`,
                  height: `${sz}px`,
                  backgroundColor: starIdx % 2 === 0 ? '#7AD7EA' : '#F4F7FC',
                  opacity: 0.45 + (starIdx % 4) * 0.12,
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          6. Layer C: Focal Beacon Stars with Halos (Parallax Speed: 0.16)
      ───────────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translate3d(0, ${parallaxBrightY}px, 0)` }}
      >
        {beaconStars.map((b) => (
          <div
            key={b.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 animate-beacon-pulse pointer-events-none"
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
            }}
          >
            {/* Outer Diffuse Halo */}
            <span
              className="absolute -inset-1 rounded-full blur-[2px] opacity-70"
              style={{ backgroundColor: b.halo }}
            />
            {/* Core Star Body */}
            <span
              className="relative block rounded-full"
              style={{
                width: `${b.size}px`,
                height: `${b.size}px`,
                backgroundColor: b.color,
                boxShadow: `0 0 6px 1px ${b.halo}`,
              }}
            />
          </div>
        ))}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          7. Subtle Contrast-Protecting Vignette
          Ensures high text readability across the center and margins
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#07111F]/20 to-[#07111F]/80 pointer-events-none" />
    </div>
  );
}
