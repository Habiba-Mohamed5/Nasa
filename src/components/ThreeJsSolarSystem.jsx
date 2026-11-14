import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { CELESTIAL_BODIES } from '../data/solarSystemData';
import {
  loadPlanetTexture,
  getSaturnRingsTexture,
  getUranusRingsTexture
} from '../utils/planetaryTextures';
import { createSpaceship404 } from '../utils/spaceship3D';
import { spaceAudio } from '../utils/spaceAudio';

/**
 * ThreeJsSolarSystem — Persistent 60 FPS Real-Time 3D Viewport with Spaceship 404
 *
 * Camera & Flight Modes:
 * 1. 'cockpit': Inside Spaceship 404 looking out through the observation cupola
 * 2. 'external': 3rd-person view of Spaceship 404 traveling between planets with thrusters firing
 * 3. 'orbit': 360° close inspection orbit around the selected planet
 *
 * Performance:
 * - Single-mount architecture (0 WebGL context destruction)
 * - Off-screen rendering pause via IntersectionObserver
 * - Hardware accelerated 60+ FPS
 */
export default function ThreeJsSolarSystem({
  selectedPlanetId = 'mars',
  onSelectPlanet,
  onHoverPlanet,
  viewMode = 'focus', // 'focus' | 'overview'
  cameraMode = 'cockpit', // 'cockpit' | 'external' | 'orbit'
  onCameraModeChange,
  isAccelerating = false,
  flightVelocity = 34.8
}) {
  const mountRef = useRef(null);
  const isVisibleRef = useRef(true);

  // Mutable prop refs
  const selectedPlanetIdRef = useRef(selectedPlanetId);
  const viewModeRef = useRef(viewMode);
  const cameraModeRef = useRef(cameraMode);
  const isAcceleratingRef = useRef(isAccelerating);
  const onSelectPlanetRef = useRef(onSelectPlanet);
  const onHoverPlanetRef = useRef(onHoverPlanet);

  useEffect(() => {
    selectedPlanetIdRef.current = selectedPlanetId;
  }, [selectedPlanetId]);

  useEffect(() => {
    viewModeRef.current = viewMode;
  }, [viewMode]);

  useEffect(() => {
    cameraModeRef.current = cameraMode;
  }, [cameraMode]);

  useEffect(() => {
    isAcceleratingRef.current = isAccelerating;
  }, [isAccelerating]);

  useEffect(() => {
    onSelectPlanetRef.current = onSelectPlanet;
  }, [onSelectPlanet]);

  useEffect(() => {
    onHoverPlanetRef.current = onHoverPlanet;
  }, [onHoverPlanet]);

  // Mesh & group references
  const planetMeshesRef = useRef(new Map());
  const orbitLinesRef = useRef(new Map());
  const earthCloudsRef = useRef(null);
  const moonGroupRef = useRef(null);
  const sunGlowMeshRef = useRef(null);
  const spaceshipRef = useRef(null);
  const shipApiRef = useRef(null);

  // Flight simulation state
  const shipPositionRef = useRef(new THREE.Vector3(22.0, 1.2, 18.0));
  const shipVelocityRef = useRef(new THREE.Vector3(0, 0, 0));
  const shipOrientationRef = useRef(new THREE.Euler(0, 0, 0));

  // Camera interpolation state
  const isDraggingRef = useRef(false);
  const previousPointerPos = useRef({ x: 0, y: 0 });
  const orbitSpherical = useRef({ radius: 3.8, theta: 0.6, phi: 1.25 });
  const cameraTargetPos = useRef(new THREE.Vector3(0, 48, 72));
  const cameraLookAtPos = useRef(new THREE.Vector3(0, 0, 0));
  const currentCameraLookAt = useRef(new THREE.Vector3(0, 0, 0));

  // Target radius adjustment on planet select
  useEffect(() => {
    const body = CELESTIAL_BODIES.find(b => b.id === selectedPlanetId);
    if (body) {
      const baseDist = body.radius3D * (body.hasRings ? 4.2 : 3.4);
      orbitSpherical.current.radius = Math.max(3.0, baseDist);

      // Play thruster burn sound when transitioning to a new planet
      spaceAudio.playThrusterBurn(1.8);

      // Highlight active orbit line
      orbitLinesRef.current.forEach((line, id) => {
        if (line && line.material) {
          const isSel = id === selectedPlanetId;
          line.material.color = isSel ? new THREE.Color(body.color) : new THREE.Color(0x1f3657);
          line.material.opacity = isSel ? 0.85 : 0.22;
          line.material.needsUpdate = true;
        }
      });
    }
  }, [selectedPlanetId]);

  // Main WebGL Lifecycle
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 800;
    let height = container.clientHeight || 550;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

    const startBody = CELESTIAL_BODIES.find(b => b.id === selectedPlanetIdRef.current) || CELESTIAL_BODIES[4];
    const initialAngle = (CELESTIAL_BODIES.indexOf(startBody) * 0.78) % (Math.PI * 2);
    const startX = Math.cos(initialAngle) * startBody.orbitDistance3D;
    const startZ = Math.sin(initialAngle) * startBody.orbitDistance3D;

    shipPositionRef.current.set(startX + 4.5, 1.2, startZ + 3.8);

    camera.position.set(startX + 5.0, 2.5, startZ + 5.5);
    camera.lookAt(startX, 0, startZ);
    currentCameraLookAt.current.set(startX, 0, startZ);
    cameraLookAtPos.current.set(startX, 0, startZ);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.replaceChildren(renderer.domElement);

    // 4. Lighting & Illumination
    const sunPointLight = new THREE.PointLight(0xfff5e6, 4.5, 450, 0.45);
    sunPointLight.position.set(0, 0, 0);
    scene.add(sunPointLight);

    // Balanced cosmic ambient & celestial hemisphere light (prevents pitch-black night side)
    const hemiLight = new THREE.HemisphereLight(0xddeeff, 0x102035, 0.9);
    scene.add(hemiLight);

    // Soft camera-tracking key light for cinematic planetary illumination
    const cameraLight = new THREE.DirectionalLight(0xffffff, 0.75);
    cameraLight.position.set(0, 0, 1);
    camera.add(cameraLight);
    scene.add(camera);

    const disposableResources = {
      geometries: [],
      materials: [],
      textures: []
    };

    // 5. Build 3D Spaceship 404 Model
    const ship = createSpaceship404();
    scene.add(ship.shipGroup);
    spaceshipRef.current = ship.shipGroup;
    shipApiRef.current = ship;

    // 6. Build Celestial Bodies & Orbit Tracks
    CELESTIAL_BODIES.forEach((body) => {
      // Orbit Line
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

        const isCurrent = body.id === selectedPlanetIdRef.current;
        const orbitMat = new THREE.LineBasicMaterial({
          color: isCurrent ? new THREE.Color(body.color) : 0x1f3657,
          transparent: true,
          opacity: isCurrent ? 0.85 : 0.22,
          linewidth: 1
        });
        disposableResources.materials.push(orbitMat);

        const orbitLine = new THREE.Line(orbitGeo, orbitMat);
        scene.add(orbitLine);
        orbitLinesRef.current.set(body.id, orbitLine);
      }

      // Planetary Sphere Mesh
      const sphereGeo = new THREE.SphereGeometry(body.radius3D, 48, 48);
      disposableResources.geometries.push(sphereGeo);

      const texture = loadPlanetTexture(body.id);
      disposableResources.textures.push(texture);

      let material;
      if (body.id === 'sun') {
        material = new THREE.MeshBasicMaterial({
          map: texture,
          color: 0xffffff
        });

        // Sun outer atmospheric corona glow
        const glowGeo = new THREE.SphereGeometry(body.radius3D * 1.15, 32, 32);
        const glowMat = new THREE.MeshBasicMaterial({
          color: 0xff8c00,
          transparent: true,
          opacity: 0.22,
          side: THREE.BackSide
        });
        disposableResources.geometries.push(glowGeo);
        disposableResources.materials.push(glowMat);
        const glowMesh = new THREE.Mesh(glowGeo, glowMat);
        scene.add(glowMesh);
        sunGlowMeshRef.current = glowMesh;
      } else {
        const isGasGiant = ['jupiter', 'saturn', 'uranus', 'neptune'].includes(body.id);
        material = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: isGasGiant ? 0.45 : body.id === 'earth' ? 0.6 : 0.85,
          metalness: 0.02
        });
      }
      disposableResources.materials.push(material);

      const planetMesh = new THREE.Mesh(sphereGeo, material);
      planetMesh.userData = { id: body.id, bodyData: body };
      planetMesh.rotation.z = body.axialTilt || 0;

      // Staggered orbital position
      const bIndex = CELESTIAL_BODIES.indexOf(body);
      const angle = (bIndex * 0.78) % (Math.PI * 2);
      planetMesh.position.set(
        Math.cos(angle) * body.orbitDistance3D,
        0,
        Math.sin(angle) * body.orbitDistance3D
      );

      scene.add(planetMesh);
      planetMeshesRef.current.set(body.id, planetMesh);

      // Earth Cloud Layer & Moon
      if (body.id === 'earth') {
        const cloudGeo = new THREE.SphereGeometry(body.radius3D * 1.02, 40, 40);
        disposableResources.geometries.push(cloudGeo);

        const cloudTex = loadPlanetTexture('earth');
        const cloudMat = new THREE.MeshStandardMaterial({
          map: cloudTex,
          transparent: true,
          opacity: 0.25,
          blending: THREE.AdditiveBlending,
          roughness: 0.3
        });
        disposableResources.materials.push(cloudMat);

        const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
        planetMesh.add(cloudMesh);
        earthCloudsRef.current = cloudMesh;

        // Orbiting Moon
        const moonGroup = new THREE.Group();
        const moonGeo = new THREE.SphereGeometry(0.35, 24, 24);
        const moonTex = loadPlanetTexture('moon');
        const moonMat = new THREE.MeshStandardMaterial({
          map: moonTex,
          roughness: 0.9,
          metalness: 0.05
        });
        disposableResources.geometries.push(moonGeo);
        disposableResources.materials.push(moonMat);
        const moonMesh = new THREE.Mesh(moonGeo, moonMat);
        moonMesh.position.set(2.8, 0.4, 0);
        moonGroup.add(moonMesh);
        planetMesh.add(moonGroup);
        moonGroupRef.current = moonGroup;
      }

      // Saturn 3D Rings
      if (body.hasRings && body.id === 'saturn') {
        const ringGeo = new THREE.RingGeometry(body.ringInner3D, body.ringOuter3D, 64);
        disposableResources.geometries.push(ringGeo);

        const ringTex = getSaturnRingsTexture();
        disposableResources.textures.push(ringTex);

        const pos = ringGeo.attributes.position;
        const uvs = ringGeo.attributes.uv;
        for (let i = 0; i < pos.count; i++) {
          const vx = pos.getX(i);
          const vy = pos.getY(i);
          const dist = Math.sqrt(vx * vx + vy * vy);
          const u = (dist - body.ringInner3D) / (body.ringOuter3D - body.ringInner3D);
          uvs.setXY(i, u, 0.5);
        }

        const ringMat = new THREE.MeshStandardMaterial({
          map: ringTex,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.92,
          roughness: 0.6
        });
        disposableResources.materials.push(ringMat);

        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.rotation.y = body.axialTilt;
        planetMesh.add(ringMesh);
      }

      // Uranus Vertical Rings
      if (body.hasRings && body.id === 'uranus') {
        const ringGeo = new THREE.RingGeometry(body.ringInner3D, body.ringOuter3D, 48);
        disposableResources.geometries.push(ringGeo);

        const ringTex = getUranusRingsTexture();
        const ringMat = new THREE.MeshStandardMaterial({
          map: ringTex,
          color: 0x8fe3e8,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.45,
          roughness: 0.7
        });
        disposableResources.materials.push(ringMat);

        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.y = Math.PI / 2;
        planetMesh.add(ringMesh);
      }
    });

    // 7. Raycaster for Interactive Planet Selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const getIntersectedBody = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

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
          0.15,
          Math.min(Math.PI - 0.15, orbitSpherical.current.phi - deltaY * 0.008)
        );
        return;
      }

      const body = getIntersectedBody(e);
      if (body) {
        container.style.cursor = 'pointer';
        if (onHoverPlanetRef.current) onHoverPlanetRef.current(body);
      } else {
        container.style.cursor = 'grab';
        if (onHoverPlanetRef.current) onHoverPlanetRef.current(null);
      }
    };

    const handlePointerDown = (e) => {
      isDraggingRef.current = true;
      container.style.cursor = 'grabbing';
      previousPointerPos.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      container.style.cursor = 'grab';

      const deltaX = Math.abs(e.clientX - previousPointerPos.current.x);
      const deltaY = Math.abs(e.clientY - previousPointerPos.current.y);
      if (deltaX < 5 && deltaY < 5) {
        const body = getIntersectedBody(e);
        if (body && onSelectPlanetRef.current) {
          spaceAudio.playChirp();
          onSelectPlanetRef.current(body.id);
        }
      }
    };

    const handleWheel = (e) => {
      e.preventDefault();
      const currentId = selectedPlanetIdRef.current;
      const body = CELESTIAL_BODIES.find(b => b.id === currentId) || CELESTIAL_BODIES[4];
      const zoomFactor = e.deltaY * 0.004;
      const minRadius = Math.max(2.0, body.radius3D * 1.6);
      const maxRadius = viewModeRef.current === 'focus' ? body.radius3D * 9.0 : 110;
      orbitSpherical.current.radius = Math.max(
        minRadius,
        Math.min(maxRadius, orbitSpherical.current.radius + zoomFactor * 3.5)
      );
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('pointermove', handlePointerMove);
    domElement.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    domElement.addEventListener('wheel', handleWheel, { passive: false });

    // 8. Intersection Observer to Pause Rendering When Off-Screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // 9. Resize Observer
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

    // 10. 60 FPS Render Loop
    let clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (document.hidden || !isVisibleRef.current) return;

      const delta = clock.getDelta();

      // Spin planets on their axes
      planetMeshesRef.current.forEach((mesh) => {
        const b = mesh.userData.bodyData;
        if (b) {
          mesh.rotation.y += b.rotationSpeed || 0.005;
        }
      });

      // Earth clouds rotate
      if (earthCloudsRef.current) {
        earthCloudsRef.current.rotation.y += 0.0065;
      }

      // Moon orbits Earth
      if (moonGroupRef.current) {
        moonGroupRef.current.rotation.y += 0.012;
      }

      // Sun corona pulse
      if (sunGlowMeshRef.current) {
        const pulse = 1 + Math.sin(clock.getElapsedTime() * 1.5) * 0.025;
        sunGlowMeshRef.current.scale.set(pulse, pulse, pulse);
      }

      // Update Spaceship 404 Model
      const targetId = selectedPlanetIdRef.current;
      const currentMesh = planetMeshesRef.current.get(targetId);
      const isAcc = isAcceleratingRef.current;

      if (shipApiRef.current) {
        shipApiRef.current.updateShip(delta, isAcc);
      }

      if (currentMesh && spaceshipRef.current) {
        // Spaceship smoothly cruises along observation orbit towards current planet
        const targetPos = currentMesh.position;
        const offsetDist = Math.max(3.2, currentMesh.geometry.parameters.radius * 3.8);

        // Vector from planet to ship
        const shipTarget = new THREE.Vector3(
          targetPos.x + offsetDist * Math.cos(clock.getElapsedTime() * 0.08),
          targetPos.y + 1.2,
          targetPos.z + offsetDist * Math.sin(clock.getElapsedTime() * 0.08)
        );

        shipPositionRef.current.lerp(shipTarget, 0.04);
        spaceshipRef.current.position.copy(shipPositionRef.current);

        // Look at the planet
        spaceshipRef.current.lookAt(targetPos);
      }

      // ─────────────────────────────────────────────────────────────
      // CAMERA POSITIONING (Cockpit / External 3D Vessel / Orbit)
      // ─────────────────────────────────────────────────────────────
      const mode = cameraModeRef.current;
      const viewM = viewModeRef.current;

      if (viewM === 'overview') {
        // Solar System Full System Map
        if (spaceshipRef.current) spaceshipRef.current.visible = true;
        cameraTargetPos.current.set(0, 52, 75);
        cameraLookAtPos.current.set(0, 0, 0);
      } else if (currentMesh) {
        const planetPos = currentMesh.position;

        if (mode === 'cockpit' && spaceshipRef.current) {
          // Cockpit Observation Mode: The user is INSIDE the pressurized bridge.
          // Hide external vessel mesh so the panoramic window HUD (CockpitModeHUD) frames the planet cleanly.
          spaceshipRef.current.visible = false;
          const shipPos = spaceshipRef.current.position;
          
          cameraTargetPos.current.copy(shipPos);
          cameraLookAtPos.current.copy(planetPos);
        } else if (mode === 'external' && spaceshipRef.current) {
          // 3rd-person cinematic chase camera looking at Spaceship 404 (Image 2 & 5 Inspiration)
          spaceshipRef.current.visible = true;
          const shipPos = spaceshipRef.current.position;

          const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(spaceshipRef.current.quaternion);
          const right = new THREE.Vector3(1, 0, 0).applyQuaternion(spaceshipRef.current.quaternion);
          const up = new THREE.Vector3(0, 1, 0).applyQuaternion(spaceshipRef.current.quaternion);

          // Elevated 3/4 cinematic angle: trailing behind, offset up & to starboard
          const chaseCam = shipPos.clone()
            .add(forward.clone().multiplyScalar(-7.2))
            .add(up.clone().multiplyScalar(3.2))
            .add(right.clone().multiplyScalar(3.8));

          cameraTargetPos.current.copy(chaseCam);
          // Frame the vessel cruising towards the planet
          cameraLookAtPos.current.copy(shipPos.clone().add(forward.clone().multiplyScalar(3.0)));
        } else {
          // Planet Orbit Mode (360° close planetary inspection)
          if (spaceshipRef.current) spaceshipRef.current.visible = true;
          cameraLookAtPos.current.copy(planetPos);

          const r = orbitSpherical.current.radius;
          const phi = orbitSpherical.current.phi;
          const theta = orbitSpherical.current.theta;

          const offsetX = r * Math.sin(phi) * Math.sin(theta);
          const offsetY = r * Math.cos(phi);
          const offsetZ = r * Math.sin(phi) * Math.cos(theta);

          cameraTargetPos.current.set(
            planetPos.x + offsetX,
            planetPos.y + offsetY,
            planetPos.z + offsetZ
          );
        }
      }

      camera.position.lerp(cameraTargetPos.current, 0.06);
      currentCameraLookAt.current.lerp(cameraLookAtPos.current, 0.08);
      camera.lookAt(currentCameraLookAt.current);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      resizeObserver.disconnect();

      domElement.removeEventListener('pointermove', handlePointerMove);
      domElement.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      domElement.removeEventListener('wheel', handleWheel);

      if (shipApiRef.current) {
        shipApiRef.current.dispose();
      }

      disposableResources.geometries.forEach(g => g.dispose());
      disposableResources.materials.forEach(m => m.dispose());
      disposableResources.textures.forEach(t => t.dispose());

      renderer.dispose();
    };
  }, []); // Single mount

  return (
    <div
      ref={mountRef}
      className="relative w-full h-full min-h-[460px] sm:min-h-[560px] lg:min-h-[640px] select-none rounded-2xl overflow-hidden"
      style={{ touchAction: 'none' }}
    />
  );
}
