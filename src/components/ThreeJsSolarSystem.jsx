import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { CELESTIAL_BODIES } from '../data/solarSystemData';
import {
  createSunTexture,
  createMercuryTexture,
  createVenusTexture,
  createEarthTexture,
  createMoonTexture,
  createMarsTexture,
  createJupiterTexture,
  createSaturnTexture,
  createSaturnRingsTexture,
  createUranusTexture,
  createNeptuneTexture
} from '../utils/planetaryTextures';
import { spaceAudio } from '../utils/spaceAudio';

export default function ThreeJsSolarSystem({
  selectedPlanetId = 'mars',
  onSelectPlanet,
  onHoverPlanet,
  viewMode = 'focus', // 'focus' | 'overview'
  onViewModeChange,
  scanActive = false
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const animFrameRef = useRef(null);

  // Mesh and data references
  const planetMeshesRef = useRef(new Map());
  const orbitLinesRef = useRef(new Map());
  const moonGroupRef = useRef(null);
  const sunMeshRef = useRef(null);
  const sunGlowMeshRef = useRef(null);

  // Interaction & camera interpolation state
  const isDraggingRef = useRef(false);
  const previousPointerPos = useRef({ x: 0, y: 0 });
  const orbitSpherical = useRef({ radius: 6.5, theta: 0.6, phi: 1.2 });
  const cameraTargetPos = useRef(new THREE.Vector3(0, 48, 72));
  const cameraLookAtPos = useRef(new THREE.Vector3(0, 0, 0));
  const currentCameraLookAt = useRef(new THREE.Vector3(0, 0, 0));

  const [hoveredBodyId, setHoveredBodyId] = useState(null);

  // Selected planet reference
  const selectedBody = CELESTIAL_BODIES.find(b => b.id === selectedPlanetId) || CELESTIAL_BODIES[4];

  // Helper to get corresponding texture
  const getTextureForBody = (type) => {
    switch (type) {
      case 'sun': return createSunTexture();
      case 'mercury': return createMercuryTexture();
      case 'venus': return createVenusTexture();
      case 'earth': return createEarthTexture();
      case 'mars': return createMarsTexture();
      case 'jupiter': return createJupiterTexture();
      case 'saturn': return createSaturnTexture();
      case 'uranus': return createUranusTexture();
      case 'neptune': return createNeptuneTexture();
      default: return createMarsTexture();
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 800;
    let height = container.clientHeight || 550;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 48, 72);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;
    container.replaceChildren(renderer.domElement);

    // 4. Cinematic Lighting
    // Central PointLight at the Sun (physically illuminates day/night hemispheres of all planets)
    const sunPointLight = new THREE.PointLight(0xfff8ea, 4.2, 400, 0.4);
    sunPointLight.position.set(0, 0, 0);
    scene.add(sunPointLight);

    // Deep cosmic ambient illumination for shaded hemispheres
    const ambientLight = new THREE.AmbientLight(0x0c192c, 0.65);
    scene.add(ambientLight);

    // 5. Build Celestial Bodies & Orbital Tracks
    const disposableResources = {
      geometries: [],
      materials: [],
      textures: []
    };

    CELESTIAL_BODIES.forEach((body) => {
      // Create Orbital Path Line
      if (body.orbitDistance3D > 0) {
        const segments = 128;
        const orbitPoints = [];
        for (let i = 0; i <= segments; i++) {
          const theta = (i / segments) * Math.PI * 2;
          orbitPoints.push(
            new THREE.Vector3(
              Math.cos(theta) * body.orbitDistance3D,
              0,
              Math.sin(theta) * body.orbitDistance3D
            )
          );
        }
        const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
        disposableResources.geometries.push(orbitGeo);

        const orbitMat = new THREE.LineBasicMaterial({
          color: body.id === selectedPlanetId ? new THREE.Color(body.color) : 0x223a5e,
          transparent: true,
          opacity: body.id === selectedPlanetId ? 0.85 : 0.28,
          linewidth: 1
        });
        disposableResources.materials.push(orbitMat);

        const orbitLine = new THREE.Line(orbitGeo, orbitMat);
        scene.add(orbitLine);
        orbitLinesRef.current.set(body.id, orbitLine);
      }

      // Create Planetary Sphere Mesh
      const sphereGeo = new THREE.SphereGeometry(body.radius3D, 48, 48);
      disposableResources.geometries.push(sphereGeo);

      const texture = getTextureForBody(body.textureType);
      disposableResources.textures.push(texture);

      let material;
      if (body.id === 'sun') {
        material = new THREE.MeshBasicMaterial({
          map: texture,
          color: 0xffffff
        });

        // Sun outer atmospheric glow
        const glowGeo = new THREE.SphereGeometry(body.radius3D * 1.18, 32, 32);
        const glowMat = new THREE.MeshBasicMaterial({
          color: 0xff8c00,
          transparent: true,
          opacity: 0.25,
          side: THREE.BackSide
        });
        disposableResources.geometries.push(glowGeo);
        disposableResources.materials.push(glowMat);
        const glowMesh = new THREE.Mesh(glowGeo, glowMat);
        scene.add(glowMesh);
        sunGlowMeshRef.current = glowMesh;
      } else {
        material = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.8,
          metalness: 0.05
        });
      }
      disposableResources.materials.push(material);

      const planetMesh = new THREE.Mesh(sphereGeo, material);
      planetMesh.userData = { id: body.id, bodyData: body };
      planetMesh.rotation.z = body.axialTilt || 0;

      // Position along orbit (staggered static angle for clear view)
      const initialAngle = (CELESTIAL_BODIES.indexOf(body) * 0.78) % (Math.PI * 2);
      planetMesh.position.set(
        Math.cos(initialAngle) * body.orbitDistance3D,
        0,
        Math.sin(initialAngle) * body.orbitDistance3D
      );

      scene.add(planetMesh);
      planetMeshesRef.current.set(body.id, planetMesh);

      if (body.id === 'sun') {
        sunMeshRef.current = planetMesh;
      }

      // Add Saturn's Rings
      if (body.hasRings && body.id === 'saturn') {
        const ringGeo = new THREE.RingGeometry(body.ringInner3D, body.ringOuter3D, 64);
        disposableResources.geometries.push(ringGeo);

        const ringTex = createSaturnRingsTexture();
        disposableResources.textures.push(ringTex);

        // Orient UV coordinates along radial axis
        const pos = ringGeo.attributes.position;
        const uvs = ringGeo.attributes.uv;
        for (let i = 0; i < pos.count; i++) {
          const vx = pos.getX(i);
          const vy = pos.getY(i);
          const dist = Math.sqrt(vx * vx + vy * vy);
          const u = (dist - body.ringInner3D) / (body.ringOuter3D - body.ringInner3D);
          uvs.setXY(i, u, 0.5);
        }

        const ringMat = new THREE.MeshBasicMaterial({
          map: ringTex,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.92
        });
        disposableResources.materials.push(ringMat);

        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.rotation.y = body.axialTilt;
        planetMesh.add(ringMesh);
      }

      // Add Uranus Vertical Rings
      if (body.hasRings && body.id === 'uranus') {
        const ringGeo = new THREE.RingGeometry(body.ringInner3D, body.ringOuter3D, 48);
        disposableResources.geometries.push(ringGeo);

        const ringMat = new THREE.MeshBasicMaterial({
          color: 0x72d9dd,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.4
        });
        disposableResources.materials.push(ringMat);

        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.y = Math.PI / 2;
        planetMesh.add(ringMesh);
      }

      // Add Earth's Moon
      if (body.hasMoon) {
        const moonGroup = new THREE.Group();
        const moonGeo = new THREE.SphereGeometry(body.moonRadius3D, 24, 24);
        const moonTex = createMoonTexture();
        disposableResources.geometries.push(moonGeo);
        disposableResources.textures.push(moonTex);

        const moonMat = new THREE.MeshStandardMaterial({
          map: moonTex,
          roughness: 0.9
        });
        disposableResources.materials.push(moonMat);

        const moonMesh = new THREE.Mesh(moonGeo, moonMat);
        moonMesh.position.set(body.moonDistance3D, 0.2, 0);
        moonGroup.add(moonMesh);
        planetMesh.add(moonGroup);
        moonGroupRef.current = moonGroup;
      }
    });

    // 6. Raycasting Setup for Planet Hover and Clicks
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const getIntersectedBody = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);

      const meshes = Array.from(planetMeshesRef.current.values());
      const intersects = raycaster.intersectObjects(meshes, false);
      if (intersects.length > 0) {
        return intersects[0].object.userData.bodyData;
      }
      return null;
    };

    const handlePointerMove = (e) => {
      if (isDraggingRef.current) {
        const deltaX = e.clientX - previousPointerPos.current.x;
        const deltaY = e.clientY - previousPointerPos.current.y;
        previousPointerPos.current = { x: e.clientX, y: e.clientY };

        orbitSpherical.current.theta -= deltaX * 0.008;
        orbitSpherical.current.phi = Math.max(
          0.1,
          Math.min(Math.PI - 0.1, orbitSpherical.current.phi - deltaY * 0.008)
        );
        return;
      }

      const body = getIntersectedBody(e);
      if (body) {
        container.style.cursor = 'pointer';
        setHoveredBodyId(body.id);
        if (onHoverPlanet) onHoverPlanet(body);
      } else {
        container.style.cursor = 'default';
        setHoveredBodyId(null);
        if (onHoverPlanet) onHoverPlanet(null);
      }
    };

    const handlePointerDown = (e) => {
      isDraggingRef.current = true;
      previousPointerPos.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;

      // Check if this was a click rather than a drag
      const deltaX = Math.abs(e.clientX - previousPointerPos.current.x);
      const deltaY = Math.abs(e.clientY - previousPointerPos.current.y);
      if (deltaX < 5 && deltaY < 5) {
        const body = getIntersectedBody(e);
        if (body && onSelectPlanet) {
          spaceAudio.playChirp();
          onSelectPlanet(body.id);
        }
      }
    };

    const handleWheel = (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY * 0.005;
      orbitSpherical.current.radius = Math.max(
        selectedBody.radius3D * 2.2,
        Math.min(95, orbitSpherical.current.radius + zoomFactor * 2)
      );
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('pointermove', handlePointerMove);
    domElement.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    domElement.addEventListener('wheel', handleWheel, { passive: false });

    // 7. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const cr = entry.contentRect;
        width = cr.width || width;
        height = cr.height || height;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    });
    resizeObserver.observe(container);

    // 8. 60 FPS Render Loop with Smooth Camera Damping
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      // Only render if tab is visible to conserve GPU
      if (document.hidden) return;

      const delta = clock.getDelta();

      // Spin planets around their rotation axes
      planetMeshesRef.current.forEach((mesh, id) => {
        const body = mesh.userData.bodyData;
        if (body) {
          mesh.rotation.y += body.rotationSpeed || 0.005;
        }
      });

      // Orbit the Moon around Earth
      if (moonGroupRef.current) {
        moonGroupRef.current.rotation.y += 0.012;
      }

      // Subtle Sun pulse
      if (sunGlowMeshRef.current) {
        const pulse = 1 + Math.sin(clock.getElapsedTime() * 1.5) * 0.03;
        sunGlowMeshRef.current.scale.set(pulse, pulse, pulse);
      }

      // Camera Targeting & Smooth Travel Interpolation (Lerp)
      const currentMesh = planetMeshesRef.current.get(selectedPlanetId);

      if (viewMode === 'focus' && currentMesh) {
        // Target is the selected planet
        cameraLookAtPos.current.copy(currentMesh.position);

        // Spherical orbital position around the target planet
        const r = orbitSpherical.current.radius;
        const phi = orbitSpherical.current.phi;
        const theta = orbitSpherical.current.theta;

        const offsetX = r * Math.sin(phi) * Math.sin(theta);
        const offsetY = r * Math.cos(phi);
        const offsetZ = r * Math.sin(phi) * Math.cos(theta);

        cameraTargetPos.current.set(
          currentMesh.position.x + offsetX,
          currentMesh.position.y + offsetY,
          currentMesh.position.z + offsetZ
        );
      } else {
        // Solar System Overview Mode
        cameraTargetPos.current.set(0, 52, 75);
        cameraLookAtPos.current.set(0, 0, 0);
      }

      // Smooth camera damp (cinematic motion, zero abrupt snapping)
      camera.position.lerp(cameraTargetPos.current, 0.06);
      currentCameraLookAt.current.lerp(cameraLookAtPos.current, 0.08);
      camera.lookAt(currentCameraLookAt.current);

      renderer.render(scene, camera);
    };

    animate();

    // 9. Comprehensive WebGL Cleanup
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      resizeObserver.disconnect();

      domElement.removeEventListener('pointermove', handlePointerMove);
      domElement.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      domElement.removeEventListener('wheel', handleWheel);

      disposableResources.geometries.forEach(g => g.dispose());
      disposableResources.materials.forEach(m => m.dispose());
      disposableResources.textures.forEach(t => t.dispose());

      renderer.dispose();
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
    };
  }, []);

  // Update Orbit Line Colors and Camera Target Radius when selectedPlanetId changes
  useEffect(() => {
    orbitLinesRef.current.forEach((line, id) => {
      const isSelected = id === selectedPlanetId;
      line.material.color.set(isSelected ? (selectedBody.color || 0x7ad7ea) : 0x223a5e);
      line.material.opacity = isSelected ? 0.9 : 0.28;
    });

    // Reset default inspection radius calibrated to planet size
    if (viewMode === 'focus' && selectedBody) {
      orbitSpherical.current.radius = Math.max(selectedBody.radius3D * 3.4, 4.5);
    }
  }, [selectedPlanetId, viewMode, selectedBody]);

  return (
    <div className="relative w-full h-full min-h-[460px] sm:min-h-[580px] lg:min-h-[640px] select-none rounded-2xl sm:rounded-3xl overflow-hidden bg-[#07111F]/90 border border-[rgba(180,210,235,0.18)] shadow-2xl">
      {/* Three.js Canvas Mount */}
      <div ref={mountRef} className="w-full h-full min-h-[460px] sm:min-h-[580px] lg:min-h-[640px]" />

      {/* ─────────────────────────────────────────────────────────────
          Cockpit 3D Viewport HUD Overlay & Targeting Reticle
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none select-none p-4 sm:p-6 flex flex-col justify-between">
        
        {/* Top HUD Telemetry Coordinates */}
        <div className="flex items-center justify-between text-[10px] font-mono-tech text-[#7AD7EA] tracking-widest uppercase">
          <div className="flex items-center gap-2 bg-[#0D1728]/80 px-3 py-1.5 rounded-full border border-[#7AD7EA]/30 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#7AD7EA] animate-ping" />
            <span>404 OBSERVATION DECK // CAMERA {viewMode.toUpperCase()}</span>
          </div>

          <div className="hidden sm:flex items-center gap-3 bg-[#0D1728]/80 px-3.5 py-1.5 rounded-full border border-white/10 backdrop-blur-md text-[#98A7BD]">
            <span>FOV: 45°</span>
            <span className="text-white/20">•</span>
            <span>BEARING: {selectedBody.orbitDistance3D.toFixed(1)} AU</span>
            <span className="text-white/20">•</span>
            <span className="text-[#7AD7EA] font-bold">LOCK: {selectedBody.name.toUpperCase()}</span>
          </div>
        </div>

        {/* Center Targeting Reticle (Active when a planet is focused) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
          <div className={`relative transition-all duration-500 ${
            scanActive ? 'w-48 h-48 border border-[#7AD7EA] animate-pulse' : 'w-36 h-36 border border-[#7AD7EA]/25'
          } rounded-full flex items-center justify-center`}>
            {/* Crosshairs */}
            <span className="absolute w-full h-[1px] bg-[#7AD7EA]/30" />
            <span className="absolute h-full w-[1px] bg-[#7AD7EA]/30" />
            
            {/* Corner Bracket Reticles */}
            <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#7AD7EA]" />
            <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#7AD7EA]" />
            <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#7AD7EA]" />
            <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#7AD7EA]" />

            {/* Target Label */}
            <div className="absolute -top-7 text-[9px] font-mono-tech px-2 py-0.5 rounded bg-[#07111F]/90 text-[#7AD7EA] border border-[#7AD7EA]/40 uppercase tracking-widest whitespace-nowrap">
              TARGET LOCK // {selectedBody.name}
            </div>
          </div>
        </div>

        {/* Bottom Interactive HUD Status & Controls Cue */}
        <div className="flex flex-wrap items-end justify-between text-[11px] font-mono-tech gap-3">
          <div className="flex items-center gap-2 bg-[#0D1728]/85 px-3.5 py-2 rounded-xl border border-white/10 backdrop-blur-md text-[#C7D2E3]">
            <span className="text-[#7AD7EA] font-bold">CONTROLS:</span>
            <span>Drag to Orbit (360°)</span>
            <span className="text-white/20">•</span>
            <span>Scroll to Zoom</span>
            <span className="text-white/20">•</span>
            <span>Click Planet to Lock</span>
          </div>

          <div className="pointer-events-auto flex items-center gap-2">
            {viewMode === 'focus' ? (
              <button
                onClick={() => {
                  spaceAudio.playChirp();
                  if (onViewModeChange) onViewModeChange('overview');
                }}
                className="px-4 py-2 rounded-full bg-[#182A44] hover:bg-[#1f3657] text-[#7AD7EA] border border-[#7AD7EA]/40 text-xs font-mono-tech font-bold transition-all shadow-lg hover:scale-105"
              >
                ← SOLAR SYSTEM OVERVIEW
              </button>
            ) : (
              <button
                onClick={() => {
                  spaceAudio.playChirp();
                  if (onViewModeChange) onViewModeChange('focus');
                }}
                className="px-4 py-2 rounded-full bg-[#E4783B] hover:bg-[#d46a30] text-[#07111F] text-xs font-mono-tech font-bold transition-all shadow-lg hover:scale-105"
              >
                FOCUS TARGET: {selectedBody.name.toUpperCase()} →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
