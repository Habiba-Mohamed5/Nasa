import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, ZoomIn, ZoomOut, Compass, Eye, Heart, Bone, Brain, Layers } from 'lucide-react';
import { spaceAudio } from './utils/spaceAudio';

export default function ThreeBioTwin3D({ telemetry, selectedSystem, setSelectedSystem, onOrganClick }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const animFrameRef = useRef(null);

  // 3D Object references for real-time updates
  const heartMeshRef = useRef(null);
  const heartParticlesRef = useRef(null);
  const spineMeshesRef = useRef([]);
  const cranialMeshRef = useRef(null);
  const scanPlaneRef = useRef(null);
  const bodyGroupRef = useRef(null);
  const targetCameraPos = useRef(new THREE.Vector3(0, 0, 7.5));

  // Controls State
  const [autoRotate, setAutoRotate] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });

  // Compute dynamic colors based on telemetry
  const heartColorHex = telemetry.currentHR > 95 ? 0xFF2A55 : telemetry.currentHR > 80 ? 0xFFB800 : 0x00F0FF;
  const boneColorHex = telemetry.bmdRetention < 93 ? 0xFF2A55 : telemetry.bmdRetention < 96 ? 0xFFB800 : 0x00F0FF;
  const brainColorHex = telemetry.fluidShiftIndex > 65 || telemetry.behavioralScore < 60 ? 0xFFB800 : 0x00F0FF;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 420;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);
    cameraRef.current = camera;

    // 3. Renderer with antialias and alpha transparency
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    container.replaceChildren(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00f0ff, 2, 20);
    pointLight.position.set(3, 4, 5);
    scene.add(pointLight);

    const backLight = new THREE.PointLight(0x3b82f6, 1.5, 20);
    backLight.position.set(-3, -2, -4);
    scene.add(backLight);

    // 5. Build 3D Holographic Astronaut Bio-Twin
    const bodyGroup = new THREE.Group();
    bodyGroupRef.current = bodyGroup;
    scene.add(bodyGroup);

    // Materials
    const cyanWireMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });

    const glowBodyMat = new THREE.MeshPhongMaterial({
      color: 0x041c2c,
      emissive: 0x005577,
      specular: 0x00f0ff,
      shininess: 40,
      transparent: true,
      opacity: 0.45,
      wireframe: false
    });

    // --- Head / Cranium ---
    const headGeo = new THREE.SphereGeometry(0.55, 20, 20);
    const headMesh = new THREE.Mesh(headGeo, glowBodyMat);
    headMesh.position.y = 2.45;
    bodyGroup.add(headMesh);

    const headWire = new THREE.Mesh(headGeo, cyanWireMat);
    headWire.position.y = 2.45;
    headWire.scale.set(1.05, 1.05, 1.05);
    bodyGroup.add(headWire);

    // Cranial Core / SANS Brain
    const brainGeo = new THREE.IcosahedronGeometry(0.32, 2);
    const brainMat = new THREE.MeshBasicMaterial({ color: brainColorHex, wireframe: true, transparent: true, opacity: 0.8 });
    const cranialMesh = new THREE.Mesh(brainGeo, brainMat);
    cranialMesh.position.y = 2.45;
    cranialMeshRef.current = cranialMesh;
    bodyGroup.add(cranialMesh);

    // Optic Nerves / Eyes for SANS
    const eyeGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(0.18, 2.48, 0.48);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(-0.18, 2.48, 0.48);
    bodyGroup.add(eyeL);
    bodyGroup.add(eyeR);

    // --- Neck ---
    const neckGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.35, 12);
    const neckMesh = new THREE.Mesh(neckGeo, glowBodyMat);
    neckMesh.position.y = 1.95;
    bodyGroup.add(neckMesh);

    // --- Torso / Chest Cage ---
    const chestGeo = new THREE.CylinderGeometry(0.75, 0.55, 1.3, 16);
    const chestMesh = new THREE.Mesh(chestGeo, glowBodyMat);
    chestMesh.position.y = 1.25;
    chestMesh.scale.set(1.1, 1, 0.7);
    bodyGroup.add(chestMesh);

    const chestWire = new THREE.Mesh(chestGeo, cyanWireMat);
    chestWire.position.y = 1.25;
    chestWire.scale.set(1.15, 1.02, 0.75);
    bodyGroup.add(chestWire);

    // --- 3D Anatomical Heart (Pulsing Icosahedron + Vascular Rings) ---
    const heartGeo = new THREE.DodecahedronGeometry(0.24, 1);
    const heartMat = new THREE.MeshPhongMaterial({
      color: heartColorHex,
      emissive: heartColorHex,
      emissiveIntensity: 0.6,
      shininess: 80,
      transparent: true,
      opacity: 0.95
    });
    const heartMesh = new THREE.Mesh(heartGeo, heartMat);
    heartMesh.position.set(0.14, 1.35, 0.22);
    heartMeshRef.current = heartMesh;
    bodyGroup.add(heartMesh);

    // Heart Vascular Particles Orbit
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 0.38 + (Math.random() - 0.5) * 0.12;
      particlePos[i * 3] = 0.14 + Math.cos(angle) * radius;
      particlePos[i * 3 + 1] = 1.35 + Math.sin(angle) * (radius * 0.6);
      particlePos[i * 3 + 2] = 0.22 + (Math.random() - 0.5) * 0.15;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: heartColorHex,
      size: 0.04,
      transparent: true,
      opacity: 0.8
    });
    const heartParticles = new THREE.Points(particleGeo, particleMat);
    heartParticlesRef.current = heartParticles;
    bodyGroup.add(heartParticles);

    // --- Vertebral Spine Column (BMD Density Degradation Nodes) ---
    const spineMeshes = [];
    const spineSegments = 8;
    for (let i = 0; i < spineSegments; i++) {
      const vGeo = new THREE.BoxGeometry(0.18, 0.08, 0.14);
      const isLumbar = i > 4; // Lower spine loses bone fastest
      const vMat = new THREE.MeshPhongMaterial({
        color: isLumbar ? boneColorHex : 0x00f0ff,
        emissive: isLumbar ? boneColorHex : 0x004466,
        emissiveIntensity: isLumbar ? 0.5 : 0.2,
        transparent: true,
        opacity: 0.9
      });
      const vMesh = new THREE.Mesh(vGeo, vMat);
      vMesh.position.set(0, 1.6 - i * 0.14, -0.05);
      bodyGroup.add(vMesh);
      spineMeshes.push(vMesh);
    }
    spineMeshesRef.current = spineMeshes;

    // --- Pelvis & Hips ---
    const pelvisGeo = new THREE.CylinderGeometry(0.55, 0.48, 0.45, 14);
    const pelvisMesh = new THREE.Mesh(pelvisGeo, glowBodyMat);
    pelvisMesh.position.y = 0.45;
    pelvisMesh.scale.set(1.05, 1, 0.7);
    bodyGroup.add(pelvisMesh);

    // --- Legs & Femur Bones ---
    const legGeo = new THREE.CylinderGeometry(0.16, 0.11, 1.5, 10);
    const legL = new THREE.Mesh(legGeo, glowBodyMat);
    legL.position.set(0.32, -0.5, 0);
    const legR = new THREE.Mesh(legGeo, glowBodyMat);
    legR.position.set(-0.32, -0.5, 0);
    bodyGroup.add(legL);
    bodyGroup.add(legR);

    // Lower Legs
    const lowerLegGeo = new THREE.CylinderGeometry(0.11, 0.08, 1.4, 10);
    const lowerL = new THREE.Mesh(lowerLegGeo, glowBodyMat);
    lowerL.position.set(0.32, -1.9, 0);
    const lowerR = new THREE.Mesh(lowerLegGeo, glowBodyMat);
    lowerR.position.set(-0.32, -1.9, 0);
    bodyGroup.add(lowerL);
    bodyGroup.add(lowerR);

    // --- Arms ---
    const armGeo = new THREE.CylinderGeometry(0.12, 0.09, 1.3, 10);
    const armL = new THREE.Mesh(armGeo, glowBodyMat);
    armL.position.set(0.95, 1.0, 0);
    armL.rotation.z = -0.15;
    const armR = new THREE.Mesh(armGeo, glowBodyMat);
    armR.position.set(-0.95, 1.0, 0);
    armR.rotation.z = 0.15;
    bodyGroup.add(armL);
    bodyGroup.add(armR);

    // --- 3D Holographic Scanning Ring / Laser Plane ---
    const scanRingGeo = new THREE.RingGeometry(0.9, 1.25, 32);
    const scanRingMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35
    });
    const scanPlane = new THREE.Mesh(scanRingGeo, scanRingMat);
    scanPlane.rotation.x = Math.PI / 2;
    scanPlane.position.y = 0;
    scanPlaneRef.current = scanPlane;
    bodyGroup.add(scanPlane);

    // --- Ambient Floating Dust Particles ---
    const dustCount = 300;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPos[i] = (Math.random() - 0.5) * 8;
      dustPos[i + 1] = (Math.random() - 0.5) * 8;
      dustPos[i + 2] = (Math.random() - 0.5) * 8;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({ color: 0x00f0ff, size: 0.025, transparent: true, opacity: 0.35 });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);

    // Center entire body vertically
    bodyGroup.position.y = -0.15;

    // 6. Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Auto-rotation when enabled
      if (autoRotate && bodyGroupRef.current) {
        bodyGroupRef.current.rotation.y += 0.008;
      }

      // Dynamic Heartbeat Pulse Scale based on live BPM
      if (heartMeshRef.current) {
        const hr = telemetry.currentHR || 72;
        const hrFrequency = (hr / 60) * Math.PI * 2;
        const pulse = 1 + Math.sin(elapsedTime * hrFrequency) * 0.14;
        heartMeshRef.current.scale.set(pulse, pulse, pulse);
      }

      // Rotate Heart Vascular Particle Ring
      if (heartParticlesRef.current) {
        heartParticlesRef.current.rotation.y += 0.02;
        heartParticlesRef.current.rotation.z += 0.01;
      }

      // Sweep Scanning Laser Plane Vertically
      if (scanPlaneRef.current) {
        scanPlaneRef.current.position.y = Math.sin(elapsedTime * 2.2) * 2.3 + 0.4;
      }

      // Rotate Cranial Core
      if (cranialMeshRef.current) {
        cranialMeshRef.current.rotation.y += 0.015;
      }

      // Smooth Camera LERP to Target Focus
      if (cameraRef.current) {
        cameraRef.current.position.lerp(targetCameraPos.current, 0.06);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
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

  // Update 3D Materials when Telemetry changes
  useEffect(() => {
    if (heartMeshRef.current) {
      heartMeshRef.current.material.color.setHex(heartColorHex);
      heartMeshRef.current.material.emissive.setHex(heartColorHex);
    }
    if (heartParticlesRef.current) {
      heartParticlesRef.current.material.color.setHex(heartColorHex);
    }
    if (cranialMeshRef.current) {
      cranialMeshRef.current.material.color.setHex(brainColorHex);
    }
    spineMeshesRef.current.forEach((m, idx) => {
      if (idx > 4) {
        m.material.color.setHex(boneColorHex);
        m.material.emissive.setHex(boneColorHex);
      }
    });
  }, [telemetry.currentHR, telemetry.bmdRetention, telemetry.fluidShiftIndex]);

  // Camera Target Zoom based on System Selection
  useEffect(() => {
    if (selectedSystem === 'cardiovascular') {
      targetCameraPos.current.set(0.2, 1.2, 3.8);
      setAutoRotate(false);
    } else if (selectedSystem === 'skeletal') {
      targetCameraPos.current.set(0, 0.8, 4.2);
      setAutoRotate(false);
    } else if (selectedSystem === 'neural') {
      targetCameraPos.current.set(0, 2.3, 3.2);
      setAutoRotate(false);
    } else {
      targetCameraPos.current.set(0, 0, 7.5);
      setAutoRotate(true);
    }
  }, [selectedSystem]);

  // Mouse Orbit Drag Handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setAutoRotate(false);
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !bodyGroupRef.current) return;
    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;

    bodyGroupRef.current.rotation.y += deltaX * 0.008;
    bodyGroupRef.current.rotation.x = Math.max(-0.6, Math.min(0.6, bodyGroupRef.current.rotation.x + deltaY * 0.005));

    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    if (!cameraRef.current) return;
    const zoomDelta = e.deltaY * 0.005;
    const newZ = Math.max(3.0, Math.min(10.0, targetCameraPos.current.z + zoomDelta));
    targetCameraPos.current.z = newZ;
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-3 select-none overflow-hidden">
      {/* 3D System Filter Buttons */}
      <div className="relative z-20 flex items-center gap-1.5 p-1 bg-slate-900/90 backdrop-blur-xl rounded-xl border border-cyan-500/30 shadow-lg">
        {[
          { id: 'all', label: 'All Systems', icon: Layers },
          { id: 'cardiovascular', label: 'Cardiovascular 3D', icon: Heart },
          { id: 'skeletal', label: 'Skeletal Density 3D', icon: Bone },
          { id: 'neural', label: 'Neural & SANS 3D', icon: Brain }
        ].map((sys) => {
          const Icon = sys.icon;
          const isActive = selectedSystem === sys.id;
          return (
            <button
              key={sys.id}
              onClick={() => {
                spaceAudio.playChirp();
                setSelectedSystem(sys.id);
                if (onOrganClick && sys.id !== 'all') onOrganClick(sys.id);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/60 shadow-[0_0_15px_rgba(0,240,255,0.35)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon size={13} className={isActive ? 'text-cyan-400' : 'text-slate-400'} />
              <span>{sys.label}</span>
            </button>
          );
        })}
      </div>

      {/* The 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="relative z-10 w-full h-[360px] cursor-grab active:cursor-grabbing flex items-center justify-center my-1"
      />

      {/* 3D Navigation Controls Floating Widget */}
      <div className="absolute top-16 right-4 z-20 flex flex-col gap-1.5 bg-slate-900/80 border border-cyan-500/30 p-1.5 rounded-xl backdrop-blur-md shadow-xl text-slate-300">
        <button
          onClick={() => {
            spaceAudio.playBeep(1400);
            setAutoRotate(!autoRotate);
          }}
          className={`p-1.5 rounded-lg transition-all ${autoRotate ? 'bg-cyan-500/30 text-cyan-300 shadow-sm' : 'hover:bg-slate-800'}`}
          title="Toggle 360° Auto-Rotation"
        >
          <RotateCw size={15} className={autoRotate ? "animate-spin" : ""} />
        </button>
        <button
          onClick={() => {
            spaceAudio.playBeep(1800);
            targetCameraPos.current.z = Math.max(3.2, targetCameraPos.current.z - 1.0);
          }}
          className="p-1.5 rounded-lg hover:bg-slate-800 transition-all"
          title="Zoom In 3D"
        >
          <ZoomIn size={15} />
        </button>
        <button
          onClick={() => {
            spaceAudio.playBeep(1000);
            targetCameraPos.current.z = Math.min(9.5, targetCameraPos.current.z + 1.0);
          }}
          className="p-1.5 rounded-lg hover:bg-slate-800 transition-all"
          title="Zoom Out 3D"
        >
          <ZoomOut size={15} />
        </button>
        <button
          onClick={() => {
            spaceAudio.playBeep(1200);
            setSelectedSystem('all');
            targetCameraPos.current.set(0, 0, 7.5);
            if (bodyGroupRef.current) {
              bodyGroupRef.current.rotation.set(0, 0, 0);
            }
            setAutoRotate(true);
          }}
          className="p-1.5 rounded-lg hover:bg-slate-800 transition-all text-cyan-400"
          title="Reset 3D Perspective"
        >
          <Compass size={15} />
        </button>
      </div>

      {/* Interactive 3D Callout Badges */}
      <div className="absolute top-16 left-4 z-20 text-left bg-slate-900/90 border border-cyan-500/30 rounded-xl p-2.5 backdrop-blur-md text-[10px] font-mono shadow-xl">
        <div className="text-cyan-400 font-bold flex items-center gap-1.5 mb-1">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          3D HOLOGRAPHIC SCANNER
        </div>
        <div className="text-slate-300">Target: Cmdr. Alex Vance</div>
        <div className="text-slate-400 text-[9px]">Click & Drag anywhere to rotate in 3D</div>
      </div>

      {/* Bottom Status Ribbon */}
      <div className="relative z-20 w-full flex items-center justify-between px-3 py-2 bg-slate-950/80 border border-cyan-500/20 rounded-xl text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">3D Volumetric State:</span>
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
        <div className="text-slate-400 text-[11px] flex items-center gap-2">
          <span>Camera Z: {targetCameraPos.current.z.toFixed(1)}m</span>
          <span>•</span>
          <span>FPS: <strong className="text-emerald-400">60</strong></span>
        </div>
      </div>
    </div>
  );
}
