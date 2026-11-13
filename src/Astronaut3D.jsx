import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Eye, Sparkles, Activity, ShieldCheck, Heart } from 'lucide-react';
import { spaceAudio } from './utils/spaceAudio';

export default function Astronaut3D({ telemetry, scanMode, setScanMode }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const animFrameRef = useRef(null);

  const astronautGroupRef = useRef(null);
  const heartMeshRef = useRef(null);
  const spineMeshesRef = useRef([]);
  const suitMaterialsRef = useRef([]);

  const [isRotating, setIsRotating] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });

  // Dynamic colors
  const heartColorHex = telemetry.currentHR > 90 ? 0xff2a55 : telemetry.currentHR > 80 ? 0xffb800 : 0x00f0ff;
  const boneColorHex = telemetry.bmdRetention < 93 ? 0xff2a55 : telemetry.bmdRetention < 96 ? 0xffb800 : 0x00f0ff;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 450;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.15, 4.8);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;
    container.replaceChildren(renderer.domElement);

    // 4. Lighting (Cinematic Warm Burnt-Orange & Amber Lighting)
    const ambientLight = new THREE.AmbientLight(0x382c26, 1.4);
    scene.add(ambientLight);

    // Warm Burnt-Orange Key Light from the Glowing Planetary Crescent
    const orangeKeyLight = new THREE.DirectionalLight(0xe4783b, 3.2);
    orangeKeyLight.position.set(3, 3, 4);
    scene.add(orangeKeyLight);

    // Warm Amber/Gold Rim Light from Space
    const rimSunLight = new THREE.DirectionalLight(0xffa566, 2.4);
    rimSunLight.position.set(-4, -1, -3);
    scene.add(rimSunLight);

    // Warm Fill Light
    const warmFillLight = new THREE.PointLight(0xa64d2d, 1.8, 12);
    warmFillLight.position.set(0, -3, 3);
    scene.add(warmFillLight);

    // 5. Astronaut Group (The entire floating character)
    const astroGroup = new THREE.Group();
    astronautGroupRef.current = astroGroup;
    scene.add(astroGroup);

    suitMaterialsRef.current = [];

    // --- High-Tech Materials ---
    const suitWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.35,
      metalness: 0.1,
      transparent: true,
      opacity: scanMode ? 0.25 : 1.0,
      wireframe: scanMode
    });
    suitMaterialsRef.current.push(suitWhiteMat);

    const suitDarkMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
      metalness: 0.3,
      transparent: true,
      opacity: scanMode ? 0.3 : 1.0
    });
    suitMaterialsRef.current.push(suitDarkMat);

    // Reflective Gold Visor (Apollo/Artemis style)
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0xffb703,
      emissive: 0x664400,
      roughness: 0.05,
      metalness: 0.95,
      transparent: true,
      opacity: scanMode ? 0.35 : 0.95
    });
    suitMaterialsRef.current.push(visorMat);

    // Cyan Neon Trims Material
    const cyanNeonMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.9
    });

    // ==========================================
    // BUILD 3D ASTRONAUT BODY
    // ==========================================

    // --- HELMET ---
    const helmetGeo = new THREE.SphereGeometry(0.52, 32, 28);
    const helmet = new THREE.Mesh(helmetGeo, suitWhiteMat);
    helmet.position.y = 1.68;
    helmet.scale.set(1.02, 1.08, 1.05);
    astroGroup.add(helmet);

    // Visor (Curved front gold shield)
    const visorGeo = new THREE.SphereGeometry(0.42, 28, 20, 0, Math.PI);
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.rotation.y = -Math.PI / 2;
    visor.position.set(0, 1.7, 0.18);
    visor.scale.set(1.02, 0.88, 0.92);
    astroGroup.add(visor);

    // Helmet Collar Ring
    const collarGeo = new THREE.TorusGeometry(0.44, 0.06, 12, 32);
    const collar = new THREE.Mesh(collarGeo, suitDarkMat);
    collar.rotation.x = Math.PI / 2;
    collar.position.y = 1.25;
    astroGroup.add(collar);

    // --- TORSO (Space Suit Jacket) ---
    const torsoGeo = new THREE.CylinderGeometry(0.62, 0.52, 1.15, 20);
    const torso = new THREE.Mesh(torsoGeo, suitWhiteMat);
    torso.position.y = 0.72;
    torso.scale.set(1.15, 1, 0.85);
    astroGroup.add(torso);

    // Chest Computer / Mission Control Pack (DCM)
    const chestPackGeo = new THREE.BoxGeometry(0.48, 0.42, 0.18);
    const chestPack = new THREE.Mesh(chestPackGeo, suitDarkMat);
    chestPack.position.set(0, 0.82, 0.48);
    astroGroup.add(chestPack);

    // Chest Status LEDs (Blinking lights)
    const ledGeo = new THREE.SphereGeometry(0.025, 8, 8);
    const ledGreen = new THREE.Mesh(ledGeo, new THREE.MeshBasicMaterial({ color: 0x10b981 }));
    ledGreen.position.set(-0.14, 0.9, 0.58);
    const ledBlue = new THREE.Mesh(ledGeo, new THREE.MeshBasicMaterial({ color: 0x00f0ff }));
    ledBlue.position.set(0, 0.9, 0.58);
    const ledRed = new THREE.Mesh(ledGeo, new THREE.MeshBasicMaterial({ color: 0xf43f5e }));
    ledRed.position.set(0.14, 0.9, 0.58);
    astroGroup.add(ledGreen);
    astroGroup.add(ledBlue);
    astroGroup.add(ledRed);

    // --- LIFE SUPPORT BACKPACK (PLSS) ---
    const backpackGeo = new THREE.BoxGeometry(0.85, 1.1, 0.42);
    const backpack = new THREE.Mesh(backpackGeo, suitWhiteMat);
    backpack.position.set(0, 0.78, -0.46);
    astroGroup.add(backpack);

    // Oxygen Tank Cylinders on top of backpack
    const tankGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.65, 14);
    const tankL = new THREE.Mesh(tankGeo, suitDarkMat);
    tankL.position.set(0.24, 0.88, -0.62);
    const tankR = new THREE.Mesh(tankGeo, suitDarkMat);
    tankR.position.set(-0.24, 0.88, -0.62);
    astroGroup.add(tankL);
    astroGroup.add(tankR);

    // --- ARMS & GLOVES (Floating in Zero-G) ---
    // Shoulder joints
    const shoulderGeo = new THREE.SphereGeometry(0.22, 16, 16);
    const shoulderL = new THREE.Mesh(shoulderGeo, suitDarkMat);
    shoulderL.position.set(0.82, 1.05, 0);
    const shoulderR = new THREE.Mesh(shoulderGeo, suitDarkMat);
    shoulderR.position.set(-0.82, 1.05, 0);
    astroGroup.add(shoulderL);
    astroGroup.add(shoulderR);

    // Arms
    const armGeo = new THREE.CylinderGeometry(0.15, 0.12, 0.75, 16);
    const armL = new THREE.Mesh(armGeo, suitWhiteMat);
    armL.position.set(0.95, 0.65, 0.12);
    armL.rotation.z = -0.35;
    armL.rotation.x = 0.25;
    const armR = new THREE.Mesh(armGeo, suitWhiteMat);
    armR.position.set(-0.95, 0.65, 0.12);
    armR.rotation.z = 0.35;
    armR.rotation.x = 0.25;
    astroGroup.add(armL);
    astroGroup.add(armR);

    // Gloves
    const gloveGeo = new THREE.SphereGeometry(0.14, 12, 12);
    const gloveL = new THREE.Mesh(gloveGeo, suitDarkMat);
    gloveL.position.set(1.18, 0.28, 0.26);
    const gloveR = new THREE.Mesh(gloveGeo, suitDarkMat);
    gloveR.position.set(-1.18, 0.28, 0.26);
    astroGroup.add(gloveL);
    astroGroup.add(gloveR);

    // --- WAIST & LEGS ---
    const waistGeo = new THREE.CylinderGeometry(0.48, 0.44, 0.35, 16);
    const waist = new THREE.Mesh(waistGeo, suitDarkMat);
    waist.position.y = 0.05;
    astroGroup.add(waist);

    // Thighs (Slightly relaxed, bent in Zero-G)
    const thighGeo = new THREE.CylinderGeometry(0.2, 0.15, 0.85, 14);
    const thighL = new THREE.Mesh(thighGeo, suitWhiteMat);
    thighL.position.set(0.3, -0.48, 0.08);
    thighL.rotation.x = -0.2;
    const thighR = new THREE.Mesh(thighGeo, suitWhiteMat);
    thighR.position.set(-0.3, -0.48, 0.08);
    thighR.rotation.x = -0.2;
    astroGroup.add(thighL);
    astroGroup.add(thighR);

    // Boots
    const bootGeo = new THREE.BoxGeometry(0.24, 0.22, 0.45);
    const bootL = new THREE.Mesh(bootGeo, suitDarkMat);
    bootL.position.set(0.34, -1.25, 0.2);
    bootL.rotation.x = -0.15;
    const bootR = new THREE.Mesh(bootGeo, suitDarkMat);
    bootR.position.set(-0.34, -1.25, 0.2);
    bootR.rotation.x = -0.15;
    astroGroup.add(bootL);
    astroGroup.add(bootR);

    // ==========================================
    // INTERNAL X-RAY ORGANS (Visible in Scan Mode or Glowing Inside)
    // ==========================================
    // Glowing Anatomical Heart inside chest
    const heartGeo = new THREE.IcosahedronGeometry(0.22, 2);
    const heartMat = new THREE.MeshStandardMaterial({
      color: heartColorHex,
      emissive: heartColorHex,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      wireframe: true
    });
    const heartMesh = new THREE.Mesh(heartGeo, heartMat);
    heartMesh.position.set(0.12, 0.85, 0.15);
    heartMeshRef.current = heartMesh;
    astroGroup.add(heartMesh);

    // Glowing Vertebral Spine (BMD Density Degradation)
    const spineMeshes = [];
    for (let i = 0; i < 7; i++) {
      const vGeo = new THREE.BoxGeometry(0.12, 0.06, 0.1);
      const isLumbar = i > 3;
      const vMat = new THREE.MeshStandardMaterial({
        color: isLumbar ? boneColorHex : 0x00f0ff,
        emissive: isLumbar ? boneColorHex : 0x004466,
        emissiveIntensity: 0.6
      });
      const vMesh = new THREE.Mesh(vGeo, vMat);
      vMesh.position.set(0, 1.1 - i * 0.12, -0.05);
      astroGroup.add(vMesh);
      spineMeshes.push(vMesh);
    }
    spineMeshesRef.current = spineMeshes;

    // Glowing Halo Reticle around Astronaut
    const haloGeo = new THREE.RingGeometry(1.6, 1.63, 64);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.y = 0.4;
    astroGroup.add(halo);

    // Center whole astronaut vertically
    astroGroup.position.y = -0.2;

    // ==========================================
    // 6. ANIMATION LOOP (Smooth Zero-G Floating)
    // ==========================================
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Zero-Gravity Floating Motion (Bobbing up, down & gentle tilt)
      if (astroGroup) {
        astroGroup.position.y = -0.2 + Math.sin(time * 1.4) * 0.12;
        astroGroup.rotation.z = Math.sin(time * 0.8) * 0.04;
        astroGroup.rotation.x = Math.cos(time * 0.9) * 0.03;

        // Auto slow rotation if enabled
        if (isRotating) {
          astroGroup.rotation.y += 0.007;
        }

        // Arm floating sway
        armL.rotation.z = -0.35 + Math.sin(time * 1.5) * 0.06;
        armR.rotation.z = 0.35 - Math.sin(time * 1.5) * 0.06;
      }

      // Heartbeat pulse frequency based on BPM
      if (heartMeshRef.current) {
        const bpm = telemetry.currentHR || 72;
        const pulse = 1 + Math.sin(time * (bpm / 60) * Math.PI * 2) * 0.18;
        heartMeshRef.current.scale.set(pulse, pulse, pulse);
      }

      // Halo ring gentle spin
      halo.rotation.z += 0.004;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (rendererRef.current) rendererRef.current.dispose();
    };
  }, []);

  // Update Materials when Scan Mode Toggles
  useEffect(() => {
    suitMaterialsRef.current.forEach((mat) => {
      mat.wireframe = scanMode;
      mat.opacity = scanMode ? 0.28 : 1.0;
    });
  }, [scanMode]);

  // Update heart and bone colors based on telemetry
  useEffect(() => {
    if (heartMeshRef.current) {
      heartMeshRef.current.material.color.setHex(heartColorHex);
      heartMeshRef.current.material.emissive.setHex(heartColorHex);
    }
    spineMeshesRef.current.forEach((m, idx) => {
      if (idx > 3) {
        m.material.color.setHex(boneColorHex);
        m.material.emissive.setHex(boneColorHex);
      }
    });
  }, [telemetry.currentHR, telemetry.bmdRetention]);

  // Mouse & Touch Drag to Rotate Astronaut
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setIsRotating(false);
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !astronautGroupRef.current) return;
    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;

    astronautGroupRef.current.rotation.y += deltaX * 0.009;
    astronautGroupRef.current.rotation.x = Math.max(-0.4, Math.min(0.4, astronautGroupRef.current.rotation.x + deltaY * 0.006));

    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setIsRotating(false);
      previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !astronautGroupRef.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - previousMousePosition.current.x;
    const deltaY = e.touches[0].clientY - previousMousePosition.current.y;

    astronautGroupRef.current.rotation.y += deltaX * 0.009;
    astronautGroupRef.current.rotation.x = Math.max(-0.4, Math.min(0.4, astronautGroupRef.current.rotation.x + deltaY * 0.006));

    previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between select-none overflow-hidden">
      {/* Top Floating Controls */}
      <div className="relative z-20 flex items-center justify-between w-full px-4 pt-2">
        {/* Astronaut Badge */}
        <div className="flex items-center gap-2 bg-slate-900/80 border border-cyan-500/30 px-3 py-1.5 rounded-xl backdrop-blur-md shadow-lg">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-orbitron font-bold text-white tracking-wider">
            ZERO-G FLOATING EVA SUIT
          </span>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-2">
          {/* X-Ray Scan Mode Toggle */}
          <button
            onClick={() => {
              spaceAudio.playChirp();
              setScanMode(!scanMode);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border shadow-lg ${
              scanMode
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                : 'bg-slate-900/80 text-cyan-300 border-cyan-500/40 hover:bg-slate-800'
            }`}
          >
            <Eye size={13} />
            <span>{scanMode ? 'X-Ray Scan: ON' : 'X-Ray Scan'}</span>
          </button>

          {/* 360 Auto-Rotate Toggle */}
          <button
            onClick={() => {
              spaceAudio.playBeep(1400);
              setIsRotating(!isRotating);
            }}
            className={`p-2 rounded-xl border text-xs transition-all ${
              isRotating
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-900/80 text-slate-400 border-slate-800'
            }`}
            title="Toggle 360° Float Spin"
          >
            <RotateCw size={14} className={isRotating ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* The Interactive 3D Canvas */}
      <div
        ref={mountRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        className="w-full h-[460px] cursor-grab active:cursor-grabbing flex items-center justify-center my-1 touch-none"
      />

      {/* Quick Organ Focus Pill Bar */}
      <div className="relative z-20 flex items-center gap-2 pb-2">
        <span className="text-[10px] font-mono text-slate-400 bg-slate-950/80 px-2 py-1 rounded-lg border border-slate-800/80">
          💡 اسحب بالماوس أو اللمس لتدوير رائد الفضاء 360° في أي اتجاه
        </span>
      </div>
    </div>
  );
}
