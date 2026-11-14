import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  RotateCw, Eye, Sparkles, Activity, ShieldCheck, Heart, Wind,
  Brain, Layers, Maximize2, RotateCcw, Sliders, ChevronDown, Check,
  Info, Loader2, Bone
} from 'lucide-react';
import { spaceAudio } from './utils/spaceAudio';
import AnatomyDossier from './components/AnatomyDossier';
import { ORGANS_DATA, ANATOMY_SYSTEMS } from './data/anatomyKnowledgeBase';

export default function Astronaut3D({ telemetry, scanMode, setScanMode }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const animFrameRef = useRef(null);

  // Groups and loaded refs
  const worldGroupRef = useRef(null);
  const astronautGroupRef = useRef(null);
  const anatomyGroupRef = useRef(null);

  // Organ Mesh references for animation
  const heartMeshRef = useRef(null);
  const heartBaseScaleRef = useRef(new THREE.Vector3(0.040, 0.040, 0.040));
  const heartBasePosRef = useRef(new THREE.Vector3(-0.025, 1.28, 0.035));

  const lungMeshRef = useRef(null);
  const lungBaseScaleRef = useRef(new THREE.Vector3(0.0095, 0.0095, 0.0095));
  const lungBasePosRef = useRef(new THREE.Vector3(0, 1.28, 0.01));

  const brainMeshRef = useRef(null);
  const liverMeshRef = useRef(null);
  const kidneyMeshRef = useRef(null);

  const boneMeshesRef = useRef([]);
  const muscleMeshesRef = useRef([]);
  const astronautMaterialsRef = useRef([]);

  // Camera lerp targets
  const targetCamPosRef = useRef(new THREE.Vector3(0, 1.15, 3.8));
  const targetLookAtRef = useRef(new THREE.Vector3(0, 1.05, 0));
  const defaultCamPos = new THREE.Vector3(0, 1.15, 3.8);
  const defaultLookAt = new THREE.Vector3(0, 1.05, 0);

  // UI States
  const [viewMode, setViewMode] = useState('astronaut'); // 'astronaut' | 'anatomy'
  const [loadingProgress, setLoadingProgress] = useState(15);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [selectedOrgan, setSelectedOrgan] = useState(null);

  // System Layer Toggles
  const [layerVisibility, setLayerVisibility] = useState({
    skeleton: true,
    muscles: true,
    cardiovascular: true,
    respiratory: true,
    nervous: true,
    visceral: true
  });
  const [skeletonOpacity, setSkeletonOpacity] = useState(0.85);
  const [musclesOpacity, setMusclesOpacity] = useState(0.55);
  const [showLayerDrawer, setShowLayerDrawer] = useState(false);

  // Cardiac & Respiratory Simulation States
  const [simulatedBpm, setSimulatedBpm] = useState(telemetry?.currentHR || 72);
  const [isHeartPaused, setIsHeartPaused] = useState(false);

  const [simulatedRr, setSimulatedRr] = useState(16);
  const [isBreathingPaused, setIsBreathingPaused] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('inspiration');

  // Keep simulatedBpm synced if telemetry changes and not manually tuned
  useEffect(() => {
    if (telemetry?.currentHR) {
      setSimulatedBpm(telemetry.currentHR);
    }
  }, [telemetry?.currentHR]);

  // Model Base URL
  const baseUrl = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') + '/';

  // 1. Initial 3D Scene Setup & Model Loading
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 450;
    const height = container.clientHeight || 520;

    // A. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // B. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.05, 100);
    camera.position.copy(defaultCamPos);
    cameraRef.current = camera;

    // C. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;
    container.replaceChildren(renderer.domElement);

    // D. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.copy(defaultLookAt);
    controls.minDistance = 0.6;
    controls.maxDistance = 6.0;
    controls.maxPolarAngle = Math.PI * 0.88;
    controls.minPolarAngle = Math.PI * 0.12;
    controlsRef.current = controls;

    // E. Cinematic Space Lighting
    const ambientLight = new THREE.AmbientLight(0x283548, 1.8);
    scene.add(ambientLight);

    // Key Light (Warm golden planetary crescent reflection)
    const keyLight = new THREE.DirectionalLight(0xffa566, 3.2);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    // Cyan Space Rim Light (Earth albedo / cosmic glow)
    const rimLight = new THREE.DirectionalLight(0x7ad7ea, 2.6);
    rimLight.position.set(-4, 2, -3);
    scene.add(rimLight);

    // Soft Upward Fill Light
    const fillLight = new THREE.PointLight(0x38bdf8, 1.2, 10);
    fillLight.position.set(0, -2, 2.5);
    scene.add(fillLight);

    // F. World Group
    const worldGroup = new THREE.Group();
    worldGroupRef.current = worldGroup;
    scene.add(worldGroup);

    // Astronaut Group
    const astroGroup = new THREE.Group();
    astronautGroupRef.current = astroGroup;
    worldGroup.add(astroGroup);

    // Anatomy Group
    const anatomyGroup = new THREE.Group();
    anatomyGroupRef.current = anatomyGroup;
    worldGroup.add(anatomyGroup);

    // G. Configure Loaders
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
    loader.setDRACOLoader(dracoLoader);

    let loadedItems = 0;
    const totalToLoad = 6;

    const onProgressStep = () => {
      loadedItems++;
      setLoadingProgress(Math.min(95, Math.round((loadedItems / totalToLoad) * 100)));
      if (loadedItems >= 3) {
        setIsLoaded(true);
      }
    };

    // 1. Load Photorealistic Official NASA EVA EMU Spacesuit
    loader.load(
      baseUrl + 'models/nasa_astronaut.glb',
      (gltf) => {
        const astroModel = gltf.scene;
        astronautMaterialsRef.current = [];

        // NASA model: height 1.88m, facing +Z towards camera
        astroModel.scale.set(0.0254, 0.0254, 0.0254);
        astroModel.rotation.set(0, 0, 0);
        astroModel.position.set(0, 0.943, 0);

        astroModel.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              const mat = child.material.clone();
              const matName = mat.name || '';
              // astnt1_2 is the Apollo/Artemis gold reflective visor
              if (matName.includes('2')) {
                mat.color = new THREE.Color(0xffb703);
                mat.emissive = new THREE.Color(0x442200);
                mat.metalness = 0.95;
                mat.roughness = 0.08;
              } else {
                mat.roughness = 0.55;
                mat.metalness = 0.12;
              }
              child.material = mat;
              astronautMaterialsRef.current.push(mat);
            }
          }
        });

        astroGroup.add(astroModel);
        onProgressStep();
      },
      undefined,
      (err) => console.warn('nasa_astronaut.glb load warning:', err)
    );

    // 2. Load Skeleton (242 Bones from BodyParts3D)
    loader.load(
      baseUrl + 'models/skeleton.glb',
      (gltf) => {
        const skelModel = gltf.scene;
        boneMeshesRef.current = [];
        skelModel.scale.set(0.414, 0.414, 0.414);
        skelModel.position.set(0, 0.86, 0);

        skelModel.traverse((child) => {
          if (child.isMesh) {
            const boneMat = new THREE.MeshStandardMaterial({
              color: 0xf1f5f9,
              roughness: 0.4,
              metalness: 0.1,
              transparent: true,
              opacity: skeletonOpacity
            });
            child.material = boneMat;
            child.userData.organId = 'skeleton';
            boneMeshesRef.current.push(child);
          }
        });

        anatomyGroup.add(skelModel);
        onProgressStep();
      },
      undefined,
      (err) => console.warn('skeleton.glb load warning:', err)
    );

    // 3. Load Musculature (177 Muscle Groups from BodyParts3D)
    loader.load(
      baseUrl + 'models/muscles.glb',
      (gltf) => {
        const muscModel = gltf.scene;
        muscleMeshesRef.current = [];
        muscModel.scale.set(0.258, 0.258, 0.258);
        muscModel.position.set(0, 0.86, 0);

        muscModel.traverse((child) => {
          if (child.isMesh) {
            const muscleMat = new THREE.MeshStandardMaterial({
              color: 0xbe123c,
              roughness: 0.65,
              metalness: 0.05,
              transparent: true,
              opacity: musclesOpacity
            });
            child.material = muscleMat;
            child.userData.organId = 'muscles';
            muscleMeshesRef.current.push(child);
          }
        });

        anatomyGroup.add(muscModel);
        onProgressStep();
      },
      undefined,
      (err) => console.warn('muscles.glb load warning:', err)
    );

    // 4. Load Detailed Anatomical Heart
    loader.load(
      baseUrl + 'models/heart.glb',
      (gltf) => {
        const heartModel = gltf.scene;
        heartModel.scale.copy(heartBaseScaleRef.current);
        heartModel.position.copy(heartBasePosRef.current);
        heartModel.rotation.set(0.12, 0.25, -0.15);

        heartModel.traverse((child) => {
          if (child.isMesh) {
            child.userData.organId = 'heart';
            if (child.material) {
              child.material.roughness = 0.35;
              child.material.metalness = 0.1;
            }
          }
        });

        heartMeshRef.current = heartModel;
        anatomyGroup.add(heartModel);
        onProgressStep();
      },
      undefined,
      (err) => console.warn('heart.glb load warning:', err)
    );

    // 5. Load Detailed Lungs
    loader.load(
      baseUrl + 'models/lung.glb',
      (gltf) => {
        const lungModel = gltf.scene;
        lungModel.scale.copy(lungBaseScaleRef.current);
        lungModel.position.set(0.0, 1.19, 0.04);
        lungModel.rotation.set(0, 0, 0);

        lungModel.traverse((child) => {
          if (child.isMesh) {
            child.userData.organId = 'lungs';
            const lungMat = new THREE.MeshStandardMaterial({
              color: 0x93c5fd,
              roughness: 0.5,
              metalness: 0.05,
              transparent: true,
              opacity: 0.92
            });
            child.material = lungMat;
          }
        });

        lungMeshRef.current = lungModel;
        anatomyGroup.add(lungModel);
        onProgressStep();
      },
      undefined,
      (err) => console.warn('lung.glb load warning:', err)
    );

    // 6. Load 19-Lobe Anatomical Brain
    loader.load(
      baseUrl + 'models/brain.glb',
      (gltf) => {
        const brainModel = gltf.scene;
        brainModel.scale.set(0.038, 0.038, 0.038);
        brainModel.position.set(0, 1.63, 0.005);

        brainModel.traverse((child) => {
          if (child.isMesh) {
            child.userData.organId = 'brain';
            const brainMat = new THREE.MeshStandardMaterial({
              color: 0xfbcfe8,
              roughness: 0.45,
              metalness: 0.05
            });
            child.material = brainMat;
          }
        });

        brainMeshRef.current = brainModel;
        anatomyGroup.add(brainModel);
        onProgressStep();
      },
      undefined,
      (err) => console.warn('brain.glb load warning:', err)
    );

    // Load Visceral Liver
    loader.load(
      baseUrl + 'models/liver.glb',
      (gltf) => {
        const liverModel = gltf.scene;
        liverModel.scale.set(0.048, 0.048, 0.048);
        liverModel.position.set(0.06, 1.12, 0.03);

        liverModel.traverse((child) => {
          if (child.isMesh) {
            child.userData.organId = 'liver';
            const liverMat = new THREE.MeshStandardMaterial({
              color: 0x881337,
              roughness: 0.4,
              metalness: 0.1
            });
            child.material = liverMat;
          }
        });

        liverMeshRef.current = liverModel;
        anatomyGroup.add(liverModel);
      },
      undefined,
      (err) => console.warn('liver.glb load warning:', err)
    );

    // Load Kidneys
    loader.load(
      baseUrl + 'models/kidney.glb',
      (gltf) => {
        const kidneyModel = gltf.scene;
        kidneyModel.scale.set(0.026, 0.026, 0.026);
        kidneyModel.position.set(0, 1.08, -0.04);

        kidneyModel.traverse((child) => {
          if (child.isMesh) {
            child.userData.organId = 'kidneys';
            const kidMat = new THREE.MeshStandardMaterial({
              color: 0x9f1239,
              roughness: 0.35,
              metalness: 0.05
            });
            child.material = kidMat;
          }
        });

        kidneyMeshRef.current = kidneyModel;
        anatomyGroup.add(kidneyModel);
      },
      undefined,
      (err) => console.warn('kidney.glb load warning:', err)
    );

    // H. Click / Tap Raycasting to Select Organs
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleCanvasClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(anatomyGroup.children, true);

      if (intersects.length > 0) {
        for (let hit of intersects) {
          let cur = hit.object;
          while (cur && cur !== anatomyGroup) {
            if (cur.userData?.organId) {
              handleFocusOrgan(cur.userData.organId);
              return;
            }
            cur = cur.parent;
          }
        }
      }
    };

    renderer.domElement.addEventListener('click', handleCanvasClick);

    // I. Animation Loop with Real Cardiac & Respiratory Mechanics
    let startTime = performance.now();

    const animate = (currentTime) => {
      animFrameRef.current = requestAnimationFrame(animate);
      const time = (currentTime - startTime) * 0.001;

      // Controls update for damping & autoRotate
      controls.autoRotate = isRotating;
      controls.autoRotateSpeed = 1.0;
      controls.update();

      // Smooth Camera & Target Lerp when focusing an organ
      camera.position.lerp(targetCamPosRef.current, 0.05);
      controls.target.lerp(targetLookAtRef.current, 0.05);

      // Microgravity Floating Motion
      if (worldGroup) {
        worldGroup.position.y = Math.sin(time * 0.9) * 0.035;
        worldGroup.rotation.z = Math.sin(time * 0.6) * 0.015;
      }

      // --- REAL CARDIAC MECHANICS (Two-phase Systole & Diastole) ---
      if (heartMeshRef.current && !isHeartPaused) {
        const bpm = simulatedBpm || 72;
        const beatDuration = 60 / bpm; // seconds per cardiac cycle
        const tCycle = (time % beatDuration) / beatDuration; // 0 to 1

        const baseS = heartBaseScaleRef.current;
        let scaleX = baseS.x;
        let scaleY = baseS.y;
        let scaleZ = baseS.z;
        let twistY = 0.25;

        // Phase 1: Ventricular Systole (0 to 0.35 of cycle: rapid contraction + torsional twist)
        if (tCycle < 0.35) {
          const sysPhase = tCycle / 0.35;
          const contraction = Math.sin(sysPhase * Math.PI);
          // Radial contraction (~10%) and long-axis shortening (~6%)
          scaleX = baseS.x * (1.0 - contraction * 0.10);
          scaleZ = baseS.z * (1.0 - contraction * 0.10);
          scaleY = baseS.y * (1.0 - contraction * 0.06);
          // Ventricular torsional twist
          twistY += contraction * 0.10;
        } else {
          // Phase 2: Ventricular Diastole (rapid filling then slow filling rest)
          const diaPhase = (tCycle - 0.35) / 0.65;
          const earlyFill = Math.sin(Math.min(diaPhase * 2, 1) * Math.PI) * 0.04;
          scaleX = baseS.x * (1.0 + earlyFill);
          scaleZ = baseS.z * (1.0 + earlyFill);
          scaleY = baseS.y * (1.0 + earlyFill * 0.5);
        }

        heartMeshRef.current.scale.set(scaleX, scaleY, scaleZ);
        heartMeshRef.current.rotation.y = twistY;
      }

      // --- REAL RESPIRATORY MECHANICS (Active Inspiration & Passive Recoil) ---
      if (lungMeshRef.current && !isBreathingPaused) {
        const rr = simulatedRr || 16;
        const breathDuration = 60 / rr; // seconds per breath
        const tBreath = (time % breathDuration) / breathDuration; // 0 to 1

        const baseLungS = lungBaseScaleRef.current;
        let lungScaleX = baseLungS.x;
        let lungScaleY = baseLungS.y;
        let lungScaleZ = baseLungS.z;
        let lungY = 1.19;

        // Active Inspiration: First 42% of respiratory cycle
        if (tBreath < 0.42) {
          const inspPhase = tBreath / 0.42;
          const inspExpand = Math.sin(inspPhase * Math.PI * 0.5); // 0 to 1
          lungScaleX = baseLungS.x * (1.0 + inspExpand * 0.12);
          lungScaleZ = baseLungS.z * (1.0 + inspExpand * 0.10);
          lungScaleY = baseLungS.y * (1.0 + inspExpand * 0.08);
          // Diaphragmatic excursion
          lungY = 1.19 - inspExpand * 0.008;

          setBreathingPhase('inspiration');
        } else {
          // Passive Expiration: Remaining 58% of cycle
          const expPhase = (tBreath - 0.42) / 0.58;
          const expRecoil = Math.cos(expPhase * Math.PI * 0.5); // 1 to 0
          lungScaleX = baseLungS.x * (1.0 + expRecoil * 0.12);
          lungScaleZ = baseLungS.z * (1.0 + expRecoil * 0.10);
          lungScaleY = baseLungS.y * (1.0 + expRecoil * 0.08);
          lungY = 1.19 - expRecoil * 0.008;

          setBreathingPhase('expiration');
        }

        lungMeshRef.current.scale.set(lungScaleX, lungScaleY, lungScaleZ);
        lungMeshRef.current.position.y = lungY;
      }

      renderer.render(scene, camera);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    // Responsive Resize Observer (Handles both window resize and mobile tab switches from display:none to flex)
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0 && rendererRef.current && cameraRef.current) {
          cameraRef.current.aspect = w / h;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(w, h);
        }
      }
    });

    resizeObserver.observe(container);

    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        cameraRef.current.aspect = w / h;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(w, h);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleCanvasClick);
      dracoLoader.dispose();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (rendererRef.current) rendererRef.current.dispose();
    };
  }, []);

  // 2. View Mode & Scan Mode Switching Logic
  useEffect(() => {
    if (!astronautGroupRef.current || !anatomyGroupRef.current) return;

    if (viewMode === 'astronaut') {
      astronautGroupRef.current.visible = true;
      if (scanMode) {
        astronautMaterialsRef.current.forEach((mat) => {
          mat.transparent = true;
          mat.opacity = 0.25;
          mat.wireframe = true;
        });
        anatomyGroupRef.current.visible = true;
      } else {
        astronautMaterialsRef.current.forEach((mat) => {
          mat.transparent = false;
          mat.opacity = 1.0;
          mat.wireframe = false;
        });
        anatomyGroupRef.current.visible = false;
      }
    } else {
      astronautGroupRef.current.visible = false;
      anatomyGroupRef.current.visible = true;
    }
  }, [viewMode, scanMode]);

  // 3. Layer Visibility Updates
  useEffect(() => {
    boneMeshesRef.current.forEach(m => {
      m.visible = layerVisibility.skeleton;
      if (m.material) {
        m.material.opacity = skeletonOpacity;
        m.material.transparent = skeletonOpacity < 0.99;
      }
    });

    muscleMeshesRef.current.forEach(m => {
      m.visible = layerVisibility.muscles;
      if (m.material) {
        m.material.opacity = musclesOpacity;
        m.material.transparent = musclesOpacity < 0.99;
      }
    });

    if (heartMeshRef.current) heartMeshRef.current.visible = layerVisibility.cardiovascular;
    if (lungMeshRef.current) lungMeshRef.current.visible = layerVisibility.respiratory;
    if (brainMeshRef.current) brainMeshRef.current.visible = layerVisibility.nervous;
    if (liverMeshRef.current) liverMeshRef.current.visible = layerVisibility.visceral;
    if (kidneyMeshRef.current) kidneyMeshRef.current.visible = layerVisibility.visceral;
  }, [layerVisibility, skeletonOpacity, musclesOpacity]);

  // 4. Focus Camera on Organ
  const handleFocusOrgan = useCallback((organId) => {
    spaceAudio.playChirp();
    setSelectedOrgan(organId);
    if (viewMode !== 'anatomy') {
      setViewMode('anatomy');
    }

    const organInfo = ORGANS_DATA[organId];
    if (organInfo) {
      targetLookAtRef.current.set(...organInfo.cameraTarget);
      targetCamPosRef.current.set(...organInfo.cameraPos);
    }
  }, [viewMode]);

  // 5. Reset Camera View
  const handleResetCamera = useCallback(() => {
    spaceAudio.playBeep(900);
    targetCamPosRef.current.copy(defaultCamPos);
    targetLookAtRef.current.copy(defaultLookAt);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between select-none overflow-hidden rounded-2xl bg-[#060E1A]">
      {/* Loading Overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 z-40 bg-[#07111F]/90 backdrop-blur-md flex flex-col items-center justify-center space-y-3">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-[#7AD7EA] animate-spin" />
            <Activity className="w-5 h-5 text-[#E4783B] absolute animate-pulse" />
          </div>
          <div className="text-center space-y-1">
            <span className="font-titan text-sm text-[#F4F7FC] tracking-wider block">
              INITIALIZING 3D BIOMEDICAL TWIN
            </span>
            <span className="text-[10px] font-mono-tech text-[#98A7BD]">
              Loading NASA EVA EMU & Anatomical Geometry • {loadingProgress}%
            </span>
          </div>
          <div className="w-48 h-1.5 bg-[#0D1728] rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-[#7AD7EA] to-[#E4783B] transition-all duration-300 rounded-full"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Top Header Mode Bar */}
      <div className="relative z-20 flex flex-wrap items-center justify-between w-full px-3 pt-3 gap-2">
        {/* Dual Mode Switcher Pill */}
        <div className="flex items-center p-1 rounded-xl bg-[#0B1526]/90 border border-[rgba(180,210,235,0.18)] shadow-lg backdrop-blur-md">
          <button
            onClick={() => {
              spaceAudio.playChirp();
              setViewMode('astronaut');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-tech font-bold transition-all ${
              viewMode === 'astronaut'
                ? 'bg-gradient-to-r from-[#7AD7EA] to-[#38BDF8] text-[#07111F] shadow-[0_0_15px_rgba(122,215,234,0.4)]'
                : 'text-[#98A7BD] hover:text-[#F4F7FC]'
            }`}
          >
            <span>🧑‍🚀 رائد الفضاء (EVA SUIT)</span>
          </button>

          <button
            onClick={() => {
              spaceAudio.playChirp();
              setViewMode('anatomy');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-tech font-bold transition-all ${
              viewMode === 'anatomy'
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                : 'text-[#98A7BD] hover:text-[#F4F7FC]'
            }`}
          >
            <Activity size={13} className="animate-pulse" />
            <span>🧬 تشريح الأعضاء (BIO-SCAN)</span>
          </button>
        </div>

        {/* Action Toggles: Layers, X-Ray, 360 Spin, Reset */}
        <div className="flex items-center gap-1.5">
          {/* Anatomy Layer Drawer Toggle */}
          {(viewMode === 'anatomy' || scanMode) && (
            <button
              onClick={() => {
                spaceAudio.playBeep(1200);
                setShowLayerDrawer(!showLayerDrawer);
              }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-mono-tech border transition-all ${
                showLayerDrawer
                  ? 'bg-purple-600/20 text-purple-300 border-purple-400'
                  : 'bg-[#0B1526]/80 text-[#98A7BD] border-white/10 hover:text-white'
              }`}
              title="طبقات الأجهزة التشريحية"
            >
              <Layers size={13} />
              <span className="hidden sm:inline">الطبقات</span>
            </button>
          )}

          {/* X-Ray Scan Mode */}
          {viewMode === 'astronaut' && (
            <button
              onClick={() => {
                spaceAudio.playChirp();
                setScanMode(!scanMode);
              }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-mono-tech border transition-all ${
                scanMode
                  ? 'bg-cyan-500 text-[#07111F] font-bold border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                  : 'bg-[#0B1526]/80 text-[#98A7BD] border-white/10 hover:text-white'
              }`}
              title="تفعيل الأشعة السينية لرؤية الأعضاء داخل البذلة"
            >
              <Eye size={13} />
              <span className="hidden sm:inline">{scanMode ? 'X-Ray: ON' : 'X-Ray'}</span>
            </button>
          )}

          {/* 360 Auto-Rotate Toggle */}
          <button
            onClick={() => {
              spaceAudio.playBeep(1400);
              setIsRotating(!isRotating);
            }}
            className={`p-1.5 rounded-xl border text-xs transition-all ${
              isRotating
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-[#0B1526]/80 text-[#98A7BD] border-white/10'
            }`}
            title="تبديل الدوران التلقائي 360°"
          >
            <RotateCw size={14} className={isRotating ? 'animate-spin' : ''} />
          </button>

          {/* Camera Reset */}
          <button
            onClick={handleResetCamera}
            className="p-1.5 rounded-xl border border-white/10 bg-[#0B1526]/80 text-[#98A7BD] hover:text-[#7AD7EA] transition-all"
            title="إعادة ضبط زاوية الكاميرا للجسد بالكامل"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Anatomical Systems Layer Drawer (Collapsible) */}
      {showLayerDrawer && (viewMode === 'anatomy' || scanMode) && (
        <div className="absolute top-14 left-3 z-30 w-64 p-3 rounded-2xl bg-[#0B1526]/95 backdrop-blur-xl border border-[rgba(180,210,235,0.2)] shadow-2xl space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
            <span className="text-[11px] font-mono-tech font-bold text-[#7AD7EA] flex items-center gap-1.5">
              <Layers size={13} />
              طبقات الأجهزة التشريحية
            </span>
            <button
              onClick={() => setShowLayerDrawer(false)}
              className="text-[#98A7BD] hover:text-white text-xs"
            >
              ✕
            </button>
          </div>

          <div className="space-y-1.5 text-xs font-mono-tech">
            {ANATOMY_SYSTEMS.map((sys) => (
              <label
                key={sys.id}
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={layerVisibility[sys.id]}
                    onChange={(e) => {
                      setLayerVisibility(prev => ({ ...prev, [sys.id]: e.target.checked }));
                    }}
                    className="accent-cyan-400 rounded"
                  />
                  <span className="text-[#F4F7FC] text-[11px]">{sys.name}</span>
                </div>
                <span className="text-[9px] text-[#98A7BD]">{sys.nameEn}</span>
              </label>
            ))}
          </div>

          {/* Opacity Sliders for Bone & Muscle Transparency */}
          <div className="space-y-2 pt-2 border-t border-white/10 text-[10px] font-mono-tech text-[#98A7BD]">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>شفافية العظام (Skeleton Opacity)</span>
                <span className="text-cyan-300">{Math.round(skeletonOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={skeletonOpacity}
                onChange={(e) => setSkeletonOpacity(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1 bg-[#060E1A] rounded"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span>شفافية العضلات (Muscles Opacity)</span>
                <span className="text-rose-400">{Math.round(musclesOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={musclesOpacity}
                onChange={(e) => setMusclesOpacity(Number(e.target.value))}
                className="w-full accent-rose-500 h-1 bg-[#060E1A] rounded"
              />
            </div>
          </div>
        </div>
      )}

      {/* The 3D WebGL Canvas */}
      <div
        ref={mountRef}
        className="w-full flex-1 min-h-[380px] sm:min-h-[460px] cursor-grab active:cursor-grabbing flex items-center justify-center"
        style={{ touchAction: 'none' }}
      />

      {/* Floating Organ Focus Details Dossier */}
      <AnatomyDossier
        selectedOrganId={selectedOrgan}
        onClose={() => setSelectedOrgan(null)}
        onResetView={handleResetCamera}
        simulatedBpm={simulatedBpm}
        setSimulatedBpm={setSimulatedBpm}
        simulatedRr={simulatedRr}
        setSimulatedRr={setSimulatedRr}
        isHeartPaused={isHeartPaused}
        setIsHeartPaused={setIsHeartPaused}
        isBreathingPaused={isBreathingPaused}
        setIsBreathingPaused={setIsBreathingPaused}
        currentBreathingPhase={breathingPhase}
      />

      {/* Bottom Quick-Focus Organ Drawer Bar */}
      <div className="relative z-20 flex flex-col items-center w-full px-3 pb-2.5 gap-1.5">
        {/* Quick Organ Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1.5 px-2 rounded-xl bg-[#0B1526]/80 border border-white/10 backdrop-blur-md custom-scrollbar">
          <span className="text-[9px] font-mono-tech text-[#98A7BD] uppercase tracking-wider shrink-0 pl-1">
            تركيز العضو:
          </span>

          <button
            onClick={() => handleFocusOrgan('heart')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono-tech font-bold shrink-0 transition-all border ${
              selectedOrgan === 'heart'
                ? 'bg-rose-500/20 text-rose-300 border-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                : 'bg-[#132238] text-[#C7D2E3] border-white/5 hover:border-white/20'
            }`}
          >
            <Heart size={11} className="text-rose-400 fill-rose-500 animate-pulse" />
            <span>القلب ({simulatedBpm} BPM)</span>
          </button>

          <button
            onClick={() => handleFocusOrgan('lungs')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono-tech font-bold shrink-0 transition-all border ${
              selectedOrgan === 'lungs'
                ? 'bg-sky-500/20 text-sky-300 border-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.3)]'
                : 'bg-[#132238] text-[#C7D2E3] border-white/5 hover:border-white/20'
            }`}
          >
            <Wind size={11} className="text-sky-400" />
            <span>الرئتان ({simulatedRr} RR)</span>
          </button>

          <button
            onClick={() => handleFocusOrgan('brain')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono-tech font-bold shrink-0 transition-all border ${
              selectedOrgan === 'brain'
                ? 'bg-purple-500/20 text-purple-300 border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                : 'bg-[#132238] text-[#C7D2E3] border-white/5 hover:border-white/20'
            }`}
          >
            <Brain size={11} className="text-purple-400" />
            <span>الدماغ (SANS)</span>
          </button>

          <button
            onClick={() => handleFocusOrgan('skeleton')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono-tech font-bold shrink-0 transition-all border ${
              selectedOrgan === 'skeleton'
                ? 'bg-slate-500/20 text-slate-200 border-slate-300'
                : 'bg-[#132238] text-[#C7D2E3] border-white/5 hover:border-white/20'
            }`}
          >
            <Bone size={11} className="text-slate-300" />
            <span>الهيكل والعمود الفقري</span>
          </button>

          <button
            onClick={() => handleFocusOrgan('muscles')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono-tech font-bold shrink-0 transition-all border ${
              selectedOrgan === 'muscles'
                ? 'bg-red-500/20 text-red-200 border-red-400'
                : 'bg-[#132238] text-[#C7D2E3] border-white/5 hover:border-white/20'
            }`}
          >
            <Activity size={11} className="text-red-400" />
            <span>العضلات والحركة</span>
          </button>

          <button
            onClick={() => handleFocusOrgan('liver')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono-tech font-bold shrink-0 transition-all border ${
              selectedOrgan === 'liver'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400'
                : 'bg-[#132238] text-[#C7D2E3] border-white/5 hover:border-white/20'
            }`}
          >
            <span>الكبد والاستقلاب</span>
          </button>

          <button
            onClick={() => handleFocusOrgan('kidneys')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono-tech font-bold shrink-0 transition-all border ${
              selectedOrgan === 'kidneys'
                ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                : 'bg-[#132238] text-[#C7D2E3] border-white/5 hover:border-white/20'
            }`}
          >
            <span>الكليتان (Gauer-Henry)</span>
          </button>
        </div>

        {/* User Interaction Helper */}
        <div className="flex items-center justify-between w-full text-[9px] font-mono-tech text-[#98A7BD] px-1">
          <span>💡 اسحب بالماوس أو اللمس لتدوير النموذج 360° • قرّب بالبكرة/الأصابع للتكبير</span>
          <span className="text-[#7AD7EA]">NASA SPACE MEDICINE DIGITAL TWIN</span>
        </div>
      </div>
    </div>
  );
}
