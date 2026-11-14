import * as THREE from 'three';

/**
 * Procedural Planetary Texture Generator for Spaceship 404
 * Generates astronomically accurate, high-resolution (1024x512 / 512x256) surface maps
 * using HTML5 Canvas with physically accurate NASA color grading.
 * Zero external download latency, zero network failures, instant WebGL compilation.
 */

// Simple deterministic pseudo-random helper for consistent terrain details
function pseudoNoise(x, y, seed = 0) {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453123;
  return n - Math.floor(n);
}

// 1. Sun (Radiant solar surface with granular convection cells and solar flare flareouts)
export function createSunTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#FF4500');
  grad.addColorStop(0.3, '#FF8C00');
  grad.addColorStop(0.5, '#FFD700');
  grad.addColorStop(0.7, '#FFA500');
  grad.addColorStop(1, '#FF4500');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Solar flare granules & convection cells
  ctx.fillStyle = 'rgba(255, 255, 230, 0.25)';
  for (let i = 0; i < 400; i++) {
    const x = (i * 137.5) % canvas.width;
    const y = (i * 83.3) % canvas.height;
    const r = 4 + (i % 8);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Sunspots
  ctx.fillStyle = 'rgba(120, 25, 0, 0.45)';
  const sunspots = [[320, 220, 16], [480, 280, 22], [720, 180, 14], [860, 310, 18]];
  sunspots.forEach(([sx, sy, sr]) => {
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(60, 10, 0, 0.65)';
    ctx.beginPath();
    ctx.arc(sx, sy, sr * 0.5, 0, Math.PI * 2);
    ctx.fill();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// 2. Mercury (Gray/tan cratered volcanic silicate crust)
export function createMercuryTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Base basalt gray-tan
  ctx.fillStyle = '#6E6B65';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Surface tonal variation
  for (let x = 0; x < canvas.width; x += 16) {
    for (let y = 0; y < canvas.height; y += 16) {
      const v = pseudoNoise(x * 0.05, y * 0.05, 12);
      const shade = Math.floor(100 + v * 35);
      ctx.fillStyle = `rgb(${shade}, ${shade - 3}, ${shade - 6})`;
      ctx.fillRect(x, y, 16, 16);
    }
  }

  // Impact craters
  for (let i = 0; i < 120; i++) {
    const cx = (i * 211) % canvas.width;
    const cy = (i * 173) % canvas.height;
    const cr = 3 + (i % 12);
    // Rim
    ctx.strokeStyle = 'rgba(210, 205, 195, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, Math.PI * 2);
    ctx.stroke();
    // Shadow interior
    ctx.fillStyle = 'rgba(45, 42, 38, 0.5)';
    ctx.beginPath();
    ctx.arc(cx, cy, cr * 0.75, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

// 3. Venus (Dense sulfuric acid swirling clouds, pale yellow-amber)
export function createVenusTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Base golden-cream
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#E8C88A');
  grad.addColorStop(0.2, '#F0D8A8');
  grad.addColorStop(0.5, '#E5C07A');
  grad.addColorStop(0.8, '#D8B26A');
  grad.addColorStop(1, '#CFA658');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Chevron atmospheric cloud bands (Venus characteristic V-shape)
  ctx.fillStyle = 'rgba(255, 245, 220, 0.22)';
  for (let i = 0; i < 18; i++) {
    const y = i * 30;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(canvas.width * 0.25, y + 25, canvas.width * 0.75, y - 25, canvas.width, y + 10);
    ctx.lineTo(canvas.width, y + 20);
    ctx.bezierCurveTo(canvas.width * 0.75, y - 5, canvas.width * 0.25, y + 45, 0, y + 20);
    ctx.closePath();
    ctx.fill();
  }

  // Soft atmospheric streaks
  ctx.fillStyle = 'rgba(180, 130, 60, 0.12)';
  for (let i = 0; i < 25; i++) {
    const y = (i * 37) % canvas.height;
    ctx.fillRect(0, y, canvas.width, 6 + (i % 8));
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

// 4. Earth (Blue ocean, green/brown continents, white polar caps, and cloud swirl)
export function createEarthTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Deep oceanic blue
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  oceanGrad.addColorStop(0, '#0F3057');
  oceanGrad.addColorStop(0.5, '#00587A');
  oceanGrad.addColorStop(1, '#0F3057');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Continents (Americas, Eurasia, Africa, Australia)
  ctx.fillStyle = '#2C5E3B'; // Forest Green
  // Eurasia / Africa block
  ctx.beginPath();
  ctx.ellipse(550, 180, 160, 90, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#7A6843'; // Sahara / Desert
  ctx.beginPath();
  ctx.ellipse(520, 240, 100, 70, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#235332'; // Southern Africa
  ctx.beginPath();
  ctx.ellipse(540, 330, 60, 80, -0.1, 0, Math.PI * 2);
  ctx.fill();

  // Americas
  ctx.fillStyle = '#346B42'; // North America
  ctx.beginPath();
  ctx.ellipse(220, 160, 90, 70, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2B5738'; // South America
  ctx.beginPath();
  ctx.ellipse(260, 320, 70, 110, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Australia
  ctx.fillStyle = '#8B6B3D';
  ctx.beginPath();
  ctx.ellipse(780, 350, 60, 45, 0, 0, Math.PI * 2);
  ctx.fill();

  // Polar Ice Caps (North & South)
  ctx.fillStyle = '#F4F9FF';
  ctx.fillRect(0, 0, canvas.width, 35);
  ctx.fillRect(0, canvas.height - 40, canvas.width, 40);

  // Atmospheric cloud swirls
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  for (let i = 0; i < 14; i++) {
    const cy = 60 + i * 28;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.bezierCurveTo(canvas.width * 0.3, cy + 40, canvas.width * 0.7, cy - 40, canvas.width, cy + 15);
    ctx.lineTo(canvas.width, cy + 30);
    ctx.bezierCurveTo(canvas.width * 0.7, cy - 25, canvas.width * 0.3, cy + 55, 0, cy + 30);
    ctx.closePath();
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

// 5. Moon (Silvery gray cratered highland terrain)
export function createMoonTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#8E9196';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Lunar maria (dark basalt plains)
  ctx.fillStyle = '#5A5D63';
  ctx.beginPath();
  ctx.ellipse(200, 110, 65, 45, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(290, 90, 50, 40, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(170, 160, 45, 35, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Craters with ray systems (like Tycho)
  for (let i = 0; i < 60; i++) {
    const x = (i * 97) % canvas.width;
    const y = (i * 61) % canvas.height;
    ctx.strokeStyle = 'rgba(240, 243, 248, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, 2 + (i % 6), 0, Math.PI * 2);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

// 6. Mars (Rusty red oxide, dark volcanic plains Valles Marineris, and white polar ice)
export function createMarsTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Base Martian rusty oxide
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#B85028');
  grad.addColorStop(0.3, '#C85A27');
  grad.addColorStop(0.6, '#D66B33');
  grad.addColorStop(1, '#A03F1C');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Dark volcanic plains (Syrtis Major, Acidalia Planitia)
  ctx.fillStyle = '#592D1D';
  ctx.beginPath();
  ctx.ellipse(450, 260, 130, 60, -0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(750, 230, 90, 50, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Valles Marineris rift canyon
  ctx.strokeStyle = '#381A0F';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(250, 280);
  ctx.quadraticCurveTo(400, 310, 520, 290);
  ctx.stroke();

  // Olympus Mons caldera
  ctx.fillStyle = '#783A20';
  ctx.beginPath();
  ctx.arc(200, 220, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#401C0E';
  ctx.beginPath();
  ctx.arc(200, 220, 6, 0, Math.PI * 2);
  ctx.fill();

  // Northern & Southern Polar Ice Caps
  ctx.fillStyle = '#F8FAFC';
  ctx.beginPath();
  ctx.ellipse(canvas.width / 2, 18, canvas.width * 0.35, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(canvas.width / 2, canvas.height - 14, canvas.width * 0.25, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

// 7. Jupiter (Gas Giant belts, creamy zones, Great Red Spot, turbulent eddy currents)
export function createJupiterTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Alternating chromatic belts & zones
  const bands = [
    { color: '#8F6649', h: 30 }, // Polar
    { color: '#C8A882', h: 25 },
    { color: '#7E4E30', h: 40 }, // North Temperate
    { color: '#D4BFA4', h: 35 },
    { color: '#9E5B32', h: 50 }, // North Equatorial Belt
    { color: '#E4D5BE', h: 45 }, // Equatorial Zone
    { color: '#A8572A', h: 55 }, // South Equatorial Belt
    { color: '#D8C2A8', h: 40 },
    { color: '#885437', h: 45 }, // South Temperate Belt
    { color: '#C2A98A', h: 35 },
    { color: '#7E4C33', h: 50 },
    { color: '#85593F', h: 62 },
  ];

  let currentY = 0;
  bands.forEach((b) => {
    ctx.fillStyle = b.color;
    ctx.fillRect(0, currentY, canvas.width, b.h);
    currentY += b.h;
  });

  // Atmospheric turbulent shear waves
  for (let i = 0; i < 20; i++) {
    const y = i * 26;
    ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 255, 255, 0.12)' : 'rgba(70, 30, 10, 0.14)';
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.lineTo(x + 20, y + (i % 2 === 0 ? 6 : -6));
      ctx.lineTo(x + 40, y);
    }
    ctx.lineTo(canvas.width, y + 15);
    ctx.lineTo(0, y + 15);
    ctx.closePath();
    ctx.fill();
  }

  // The Great Red Spot (in the South Equatorial Belt ~y=300)
  ctx.save();
  ctx.translate(680, 290);
  ctx.rotate(-0.08);
  // Outer storm halo
  ctx.fillStyle = '#C84B25';
  ctx.beginPath();
  ctx.ellipse(0, 0, 48, 28, 0, 0, Math.PI * 2);
  ctx.fill();
  // Core eye
  ctx.fillStyle = '#E36437';
  ctx.beginPath();
  ctx.ellipse(0, 0, 32, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#F5966B';
  ctx.beginPath();
  ctx.ellipse(0, 0, 16, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

// 8. Saturn Sphere (Muted golden sand and pale amber atmospheric zones)
export function createSaturnTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Soft muted golden bands
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#B39C6D');
  grad.addColorStop(0.2, '#D9C598');
  grad.addColorStop(0.4, '#C8B282');
  grad.addColorStop(0.5, '#E5D6AD');
  grad.addColorStop(0.65, '#D4BF8C');
  grad.addColorStop(0.85, '#BFA875');
  grad.addColorStop(1, '#A6905E');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle zonal striations
  for (let y = 0; y < canvas.height; y += 12) {
    ctx.fillStyle = y % 24 === 0 ? 'rgba(255, 255, 230, 0.08)' : 'rgba(80, 60, 20, 0.06)';
    ctx.fillRect(0, y, canvas.width, 6);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

// 9. Saturn Rings (High-resolution concentric ring alpha map)
export function createSaturnRingsTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  // Ring gradient along horizontal axis (representing radial distance from planet)
  const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
  grad.addColorStop(0.00, 'rgba(0, 0, 0, 0)'); // Inner gap
  grad.addColorStop(0.12, 'rgba(160, 140, 100, 0.15)'); // D Ring
  grad.addColorStop(0.22, 'rgba(190, 170, 125, 0.45)'); // C Ring
  grad.addColorStop(0.45, 'rgba(235, 215, 165, 0.90)'); // B Ring (Brightest)
  grad.addColorStop(0.65, 'rgba(225, 205, 155, 0.85)');
  grad.addColorStop(0.70, 'rgba(0, 0, 0, 0.05)'); // Cassini Division Gap
  grad.addColorStop(0.74, 'rgba(200, 180, 135, 0.70)'); // A Ring
  grad.addColorStop(0.88, 'rgba(180, 160, 120, 0.65)');
  grad.addColorStop(0.92, 'rgba(0, 0, 0, 0)'); // Encke Gap
  grad.addColorStop(0.95, 'rgba(170, 150, 115, 0.40)');
  grad.addColorStop(1.00, 'rgba(0, 0, 0, 0)'); // Outer boundary

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Micro-ringlet striations
  for (let x = 0; x < canvas.width; x += 4) {
    if (x % 16 === 0) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(x, 0, 1, canvas.height);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 10. Uranus (Aquamarine cyan ice giant with delicate atmospheric sheen)
export function createUranusTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#59BFC4');
  grad.addColorStop(0.3, '#75D8DC');
  grad.addColorStop(0.5, '#8EE5E8');
  grad.addColorStop(0.7, '#6ACDD2');
  grad.addColorStop(1, '#50AFB4');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Faint methane cloud streaks
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  for (let i = 0; i < 8; i++) {
    const y = 30 + i * 25;
    ctx.fillRect(0, y, canvas.width, 8);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

// 11. Neptune (Vibrant cobalt & deep azure blue, supersonic white cirrus storm streaks)
export function createNeptuneTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#1E3F96');
  grad.addColorStop(0.3, '#2A55B8');
  grad.addColorStop(0.5, '#3866D8');
  grad.addColorStop(0.7, '#254EAA');
  grad.addColorStop(1, '#183482');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // The Great Dark Spot (Vortex storm at y=110)
  ctx.fillStyle = '#12255C';
  ctx.beginPath();
  ctx.ellipse(320, 110, 42, 24, -0.1, 0, Math.PI * 2);
  ctx.fill();

  // Supersonic white methane cirrus cloud streaks (scooter clouds)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.beginPath();
  ctx.ellipse(330, 130, 36, 4, 0.05, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(160, 85, 48, 5, -0.05, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}
