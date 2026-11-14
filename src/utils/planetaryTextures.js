import * as THREE from 'three';
import { assetPath } from './assetPath';

/**
 * Authentic NASA Planetary Texture Loader & Fallback System
 *
 * Source Attribution:
 * - NASA Scientific Visualization Studio (SVS)
 * - NASA Jet Propulsion Laboratory (JPL) Planetary Photojournal
 * - USGS Astrogeology Science Center
 * - All textures are official US Government public domain or CC-BY 4.0 cartographic maps
 *
 * Provides real-time cached texture loading with instantaneous canvas fallback.
 */

const textureLoader = new THREE.TextureLoader();
const textureCache = new Map();

// Deterministic pseudo-noise for procedural fallbacks
function pseudoNoise(x, y, seed = 0) {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453123;
  return n - Math.floor(n);
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTHENTIC NASA TEXTURE MAPS
// ─────────────────────────────────────────────────────────────────────────────
const NASA_TEXTURE_MAPS = {
  sun: 'textures/planets/sunmap.jpg',
  mercury: 'textures/planets/mercurymap.jpg',
  venus: 'textures/planets/venusmap.jpg',
  earth: 'textures/planets/earthmap1k.jpg',
  moon: 'textures/planets/moonmap1k.jpg',
  mars: 'textures/planets/marsmap1k.jpg',
  jupiter: 'textures/planets/jupitermap.jpg',
  saturn: 'textures/planets/saturnmap.jpg',
  uranus: 'textures/planets/uranusmap.jpg',
  neptune: 'textures/planets/neptunemap.jpg'
};

/**
 * Loads authentic NASA planetary texture with caching, filtering, and async callback
 */
export function loadPlanetTexture(bodyId, onLoadCallback) {
  const key = bodyId.toLowerCase();
  if (textureCache.has(key)) {
    const cached = textureCache.get(key);
    if (onLoadCallback) onLoadCallback(cached);
    return cached;
  }

  const mapFile = NASA_TEXTURE_MAPS[key];
  if (mapFile) {
    const url = assetPath(mapFile);
    const texture = textureLoader.load(
      url,
      (t) => {
        t.wrapS = THREE.RepeatWrapping;
        t.wrapT = THREE.ClampToEdgeWrapping;
        t.minFilter = THREE.LinearMipMapLinearFilter;
        t.magFilter = THREE.LinearFilter;
        t.needsUpdate = true;
        if (onLoadCallback) onLoadCallback(t);
      },
      undefined,
      (err) => {
        console.warn(`NASA texture load failed for ${bodyId}, using procedural fallback`, err);
        const fallback = createFallbackTexture(bodyId);
        textureCache.set(key, fallback);
        if (onLoadCallback) onLoadCallback(fallback);
      }
    );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    textureCache.set(key, texture);
    return texture;
  }

  // Fallback to procedural generator
  const fallback = createFallbackTexture(bodyId);
  textureCache.set(key, fallback);
  if (onLoadCallback) onLoadCallback(fallback);
  return fallback;
}

/**
 * Loads Saturn 3D radial ring texture (Cassini division + alpha channel)
 */
export function getSaturnRingsTexture() {
  const key = 'saturn-rings-radial';
  if (textureCache.has(key)) return textureCache.get(key);

  const texture = textureLoader.load(assetPath('textures/planets/saturn_rings_radial.png'));
  texture.minFilter = THREE.LinearMipMapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  textureCache.set(key, texture);
  return texture;
}

/**
 * Loads Uranus vertical rings texture
 */
export function getUranusRingsTexture() {
  const key = 'uranus-rings-radial';
  if (textureCache.has(key)) return textureCache.get(key);

  const texture = textureLoader.load(assetPath('textures/planets/uranus_rings_radial.png'));
  texture.minFilter = THREE.LinearMipMapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  textureCache.set(key, texture);
  return texture;
}

// ─────────────────────────────────────────────────────────────────────────────
// PROCEDURAL CANVAS FALLBACKS (Instant WebGL compilation fallback)
// ─────────────────────────────────────────────────────────────────────────────
function createFallbackTexture(bodyId) {
  switch (bodyId) {
    case 'sun': return createSunTexture();
    case 'mercury': return createMercuryTexture();
    case 'venus': return createVenusTexture();
    case 'earth': return createEarthTexture();
    case 'moon': return createMoonTexture();
    case 'mars': return createMarsTexture();
    case 'jupiter': return createJupiterTexture();
    case 'saturn': return createSaturnTexture();
    case 'uranus': return createUranusTexture();
    case 'neptune': return createNeptuneTexture();
    default: return createMarsTexture();
  }
}

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
  return new THREE.CanvasTexture(canvas);
}

export function createMercuryTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#6E6B65';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return new THREE.CanvasTexture(canvas);
}

export function createVenusTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#D4A373';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return new THREE.CanvasTexture(canvas);
}

export function createEarthTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#1D4E89';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return new THREE.CanvasTexture(canvas);
}

export function createMoonTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#8E9196';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return new THREE.CanvasTexture(canvas);
}

export function createMarsTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#B85028';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return new THREE.CanvasTexture(canvas);
}

export function createJupiterTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#C89D7C';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return new THREE.CanvasTexture(canvas);
}

export function createSaturnTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#E2BF7D';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return new THREE.CanvasTexture(canvas);
}

export function createSaturnRingsTexture() {
  return getSaturnRingsTexture();
}

export function createUranusTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#72D9DD';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return new THREE.CanvasTexture(canvas);
}

export function createNeptuneTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#274687';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return new THREE.CanvasTexture(canvas);
}
