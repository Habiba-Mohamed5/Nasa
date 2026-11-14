import * as THREE from 'three';

/**
 * Spaceship 404 — High-Fidelity 3D Aerospace Exploration Vessel
 * Inspired by NASA Deep Space Transit Architectures & Artemis Deep Space Hab:
 * - Multi-segment pressurized cylindrical hull with thermal micrometeorite shielding
 * - Integrated auxiliary propellant tanks with Kapton multi-layer insulation (MLI)
 * - Forward command bridge with multi-pane angled panoramic cupola windows
 * - Articulated high-gain communications dish and telemetry booms
 * - Photovoltaic solar array wings with structural support trusses
 * - 4 Gimballed Ion Propulsion Thrusters with dual-layer dynamic plasma exhaust plumes
 * - Reaction Control System (RCS) quads and navigational strobes
 * - Authentic 404 IDEAS / NASA ASTROVITALS hull insignia
 */

export function createSpaceship404() {
  const shipGroup = new THREE.Group();
  shipGroup.name = 'Spaceship404';

  const disposable = {
    geometries: [],
    materials: [],
    textures: []
  };

  // 1. Procedural High-Res Hull Decal Canvas Texture ("404 ASTROVITALS")
  const decalCanvas = document.createElement('canvas');
  decalCanvas.width = 512;
  decalCanvas.height = 128;
  const dctx = decalCanvas.getContext('2d');
  dctx.fillStyle = '#E2E8F0';
  dctx.fillRect(0, 0, 512, 128);

  // Subtle panel line seams
  dctx.strokeStyle = '#94A3B8';
  dctx.lineWidth = 2;
  dctx.strokeRect(4, 4, 504, 120);
  dctx.beginPath();
  dctx.moveTo(160, 4); dctx.lineTo(160, 124);
  dctx.moveTo(340, 4); dctx.lineTo(340, 124);
  dctx.stroke();

  // Branding Typography
  dctx.fillStyle = '#07111F';
  dctx.font = 'bold 52px monospace';
  dctx.fillText('404', 36, 82);
  dctx.font = 'bold 22px sans-serif';
  dctx.fillText('ASTROVITALS // NASA', 175, 74);

  // International Orange Accent Stripe
  dctx.fillStyle = '#E4783B';
  dctx.fillRect(4, 4, 504, 10);
  dctx.fillRect(4, 114, 504, 10);

  const decalTex = new THREE.CanvasTexture(decalCanvas);
  decalTex.needsUpdate = true;
  disposable.textures.push(decalTex);

  // 2. Solar Cell Grid Canvas Texture
  const solarCanvas = document.createElement('canvas');
  solarCanvas.width = 256;
  solarCanvas.height = 256;
  const sctx = solarCanvas.getContext('2d');
  sctx.fillStyle = '#0A182E';
  sctx.fillRect(0, 0, 256, 256);
  sctx.strokeStyle = '#1E3A5F';
  sctx.lineWidth = 3;
  for (let i = 0; i <= 256; i += 32) {
    sctx.beginPath();
    sctx.moveTo(i, 0); sctx.lineTo(i, 256);
    sctx.moveTo(0, i); sctx.lineTo(256, i);
    sctx.stroke();
  }
  sctx.strokeStyle = '#7AD7EA';
  sctx.lineWidth = 1;
  for (let i = 16; i < 256; i += 32) {
    sctx.beginPath();
    sctx.moveTo(i, 0); sctx.lineTo(i, 256);
    sctx.stroke();
  }
  const solarTex = new THREE.CanvasTexture(solarCanvas);
  solarTex.wrapS = THREE.RepeatWrapping;
  solarTex.wrapT = THREE.RepeatWrapping;
  solarTex.repeat.set(4, 2);
  solarTex.needsUpdate = true;
  disposable.textures.push(solarTex);

  // 3. Materials
  const hullMat = new THREE.MeshStandardMaterial({
    map: decalTex,
    color: 0xe8ecf2,
    roughness: 0.35,
    metalness: 0.45
  });
  disposable.materials.push(hullMat);

  const plainHullMat = new THREE.MeshStandardMaterial({
    color: 0xd8dde4,
    roughness: 0.4,
    metalness: 0.5
  });
  disposable.materials.push(plainHullMat);

  const darkTitaniumMat = new THREE.MeshStandardMaterial({
    color: 0x1a222d,
    roughness: 0.45,
    metalness: 0.75
  });
  disposable.materials.push(darkTitaniumMat);

  const kaptonGoldMat = new THREE.MeshStandardMaterial({
    color: 0xdf9b28,
    roughness: 0.22,
    metalness: 0.92
  });
  disposable.materials.push(kaptonGoldMat);

  const solarMat = new THREE.MeshStandardMaterial({
    map: solarTex,
    roughness: 0.18,
    metalness: 0.85
  });
  disposable.materials.push(solarMat);

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x7ad7ea,
    roughness: 0.08,
    metalness: 0.92,
    transmission: 0.6,
    transparent: true,
    opacity: 0.88,
    reflectivity: 0.9
  });
  disposable.materials.push(glassMat);

  // 4. Main Pressurized Hab Cylinder (Spine)
  const habGeo = new THREE.CylinderGeometry(0.72, 0.76, 3.8, 32);
  disposable.geometries.push(habGeo);
  const habMesh = new THREE.Mesh(habGeo, hullMat);
  habMesh.rotation.x = Math.PI / 2;
  shipGroup.add(habMesh);

  // Structural Collar Rings
  [-1.3, -0.4, 0.5, 1.4].forEach((zPos) => {
    const collarGeo = new THREE.TorusGeometry(0.78, 0.035, 12, 32);
    disposable.geometries.push(collarGeo);
    const collarMesh = new THREE.Mesh(collarGeo, darkTitaniumMat);
    collarMesh.position.z = zPos;
    shipGroup.add(collarMesh);
  });

  // 5. Four Auxiliary Propellant & Cryo Tanks (Mounted longitudinally along the hull)
  const tankAngles = [Math.PI / 4, 3 * Math.PI / 4, 5 * Math.PI / 4, 7 * Math.PI / 4];
  tankAngles.forEach((angle) => {
    const tankGeo = new THREE.CylinderGeometry(0.22, 0.22, 2.2, 16);
    disposable.geometries.push(tankGeo);
    const tankMesh = new THREE.Mesh(tankGeo, kaptonGoldMat);
    tankMesh.rotation.x = Math.PI / 2;
    const r = 0.88;
    tankMesh.position.set(Math.cos(angle) * r, Math.sin(angle) * r, 0.0);
    shipGroup.add(tankMesh);

    // Hemispherical caps for tanks
    [-1.1, 1.1].forEach((capZ) => {
      const capGeo = new THREE.SphereGeometry(0.22, 12, 12);
      disposable.geometries.push(capGeo);
      const capMesh = new THREE.Mesh(capGeo, kaptonGoldMat);
      capMesh.position.set(Math.cos(angle) * r, Math.sin(angle) * r, capZ);
      shipGroup.add(capMesh);
    });
  });

  // 6. Forward Command Bridge & Aerodynamic Nose Cone
  const noseGeo = new THREE.ConeGeometry(0.72, 1.35, 32);
  disposable.geometries.push(noseGeo);
  const noseMesh = new THREE.Mesh(noseGeo, plainHullMat);
  noseMesh.rotation.x = -Math.PI / 2;
  noseMesh.position.z = 2.55;
  shipGroup.add(noseMesh);

  // Command Bridge Observation Cupola (Multi-pane forward observation bay)
  const cupolaGeo = new THREE.SphereGeometry(0.44, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.5);
  disposable.geometries.push(cupolaGeo);
  const cupolaMesh = new THREE.Mesh(cupolaGeo, glassMat);
  cupolaMesh.rotation.x = Math.PI / 2;
  cupolaMesh.position.z = 2.85;
  shipGroup.add(cupolaMesh);

  // Structural Window Pillars around Cupola
  for (let i = 0; i < 4; i++) {
    const pillarAngle = (i * Math.PI) / 2;
    const pillarGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.45, 8);
    disposable.geometries.push(pillarGeo);
    const pillarMesh = new THREE.Mesh(pillarGeo, darkTitaniumMat);
    pillarMesh.position.set(Math.cos(pillarAngle) * 0.4, Math.sin(pillarAngle) * 0.4, 2.9);
    pillarMesh.rotation.z = pillarAngle;
    shipGroup.add(pillarMesh);
  }

  // 7. Lateral Photovoltaic Solar Wings with Gold Truss Booms
  [-1, 1].forEach((side) => {
    // Structural Boom
    const boomGeo = new THREE.CylinderGeometry(0.065, 0.065, 1.1, 12);
    disposable.geometries.push(boomGeo);
    const boomMesh = new THREE.Mesh(boomGeo, kaptonGoldMat);
    boomMesh.rotation.z = Math.PI / 2;
    boomMesh.position.set(side * 1.3, 0, -0.3);
    shipGroup.add(boomMesh);

    // Primary Solar Panel
    const wingGeo = new THREE.BoxGeometry(2.8, 0.04, 1.25);
    disposable.geometries.push(wingGeo);
    const wingMesh = new THREE.Mesh(wingGeo, solarMat);
    wingMesh.position.set(side * 2.7, 0, -0.3);
    shipGroup.add(wingMesh);

    // Gold End Caps & Trim
    const trimGeo = new THREE.BoxGeometry(0.1, 0.06, 1.28);
    disposable.geometries.push(trimGeo);
    const trimMesh = new THREE.Mesh(trimGeo, kaptonGoldMat);
    trimMesh.position.set(side * 4.12, 0, -0.3);
    shipGroup.add(trimMesh);
  });

  // 8. Articulated High-Gain Communications Dish (Dorsal)
  const dishPylonGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.65, 8);
  disposable.geometries.push(dishPylonGeo);
  const dishPylonMesh = new THREE.Mesh(dishPylonGeo, darkTitaniumMat);
  dishPylonMesh.position.set(0, 0.95, 0.6);
  dishPylonMesh.rotation.z = 0.2;
  shipGroup.add(dishPylonMesh);

  const dishGeo = new THREE.CylinderGeometry(0.52, 0.08, 0.12, 24);
  disposable.geometries.push(dishGeo);
  const dishMesh = new THREE.Mesh(dishGeo, plainHullMat);
  dishMesh.position.set(0.12, 1.3, 0.6);
  dishMesh.rotation.x = 0.5;
  dishMesh.rotation.z = 0.2;
  shipGroup.add(dishMesh);

  const subReflectorGeo = new THREE.ConeGeometry(0.09, 0.38, 8);
  disposable.geometries.push(subReflectorGeo);
  const subReflectorMesh = new THREE.Mesh(subReflectorGeo, kaptonGoldMat);
  subReflectorMesh.position.set(0.12, 1.5, 0.72);
  subReflectorMesh.rotation.x = -0.5;
  shipGroup.add(subReflectorMesh);

  // 9. Rear Engine Block & 4 Gimballed Ion Propulsion Thrusters
  const nozzlePositions = [
    [-0.34, -0.34],
    [0.34, -0.34],
    [-0.34, 0.34],
    [0.34, 0.34]
  ];

  const thrusterOuterCones = [];
  const thrusterInnerCores = [];

  // Rear Bulkhead Plate
  const bulkheadGeo = new THREE.CylinderGeometry(0.74, 0.76, 0.25, 32);
  disposable.geometries.push(bulkheadGeo);
  const bulkheadMesh = new THREE.Mesh(bulkheadGeo, darkTitaniumMat);
  bulkheadMesh.rotation.x = Math.PI / 2;
  bulkheadMesh.position.z = -1.98;
  shipGroup.add(bulkheadMesh);

  nozzlePositions.forEach(([x, y]) => {
    // Titanium Bell Nozzle
    const bellGeo = new THREE.CylinderGeometry(0.16, 0.28, 0.65, 20);
    disposable.geometries.push(bellGeo);
    const bellMesh = new THREE.Mesh(bellGeo, darkTitaniumMat);
    bellMesh.rotation.x = Math.PI / 2;
    bellMesh.position.set(x, y, -2.25);
    shipGroup.add(bellMesh);

    // Inner engine throat glow
    const throatGeo = new THREE.CircleGeometry(0.15, 16);
    disposable.geometries.push(throatGeo);
    const throatMat = new THREE.MeshBasicMaterial({ color: 0x7ad7ea });
    disposable.materials.push(throatMat);
    const throatMesh = new THREE.Mesh(throatGeo, throatMat);
    throatMesh.position.set(x, y, -2.25);
    shipGroup.add(throatMesh);

    // Outer Ion Plasma Exhaust Flame Cone
    const outerFlameGeo = new THREE.ConeGeometry(0.28, 1.6, 16);
    disposable.geometries.push(outerFlameGeo);
    const outerFlameMat = new THREE.MeshBasicMaterial({
      color: 0x7ad7ea,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    disposable.materials.push(outerFlameMat);
    const outerFlameMesh = new THREE.Mesh(outerFlameGeo, outerFlameMat);
    outerFlameMesh.rotation.x = -Math.PI / 2;
    outerFlameMesh.position.set(x, y, -3.3);
    shipGroup.add(outerFlameMesh);
    thrusterOuterCones.push(outerFlameMesh);

    // Inner Hot Core Plasma Cone (Intense Cyan/White core)
    const innerFlameGeo = new THREE.ConeGeometry(0.12, 1.1, 12);
    disposable.geometries.push(innerFlameGeo);
    const innerFlameMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    disposable.materials.push(innerFlameMat);
    const innerFlameMesh = new THREE.Mesh(innerFlameGeo, innerFlameMat);
    innerFlameMesh.rotation.x = -Math.PI / 2;
    innerFlameMesh.position.set(x, y, -2.95);
    shipGroup.add(innerFlameMesh);
    thrusterInnerCores.push(innerFlameMesh);
  });

  // 10. RCS (Reaction Control System) Thruster Quads
  [
    [0.72, 0, 1.6],
    [-0.72, 0, 1.6],
    [0, 0.72, 1.6],
    [0, -0.72, 1.6]
  ].forEach(([x, y, z]) => {
    const rcsGeo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
    disposable.geometries.push(rcsGeo);
    const rcsMesh = new THREE.Mesh(rcsGeo, darkTitaniumMat);
    rcsMesh.position.set(x, y, z);
    shipGroup.add(rcsMesh);
  });

  // 11. Navigation Strobes & Lights
  const portLight = new THREE.PointLight(0xff3344, 1.2, 5);
  portLight.position.set(-4.1, 0, -0.3);
  shipGroup.add(portLight);

  const stbdLight = new THREE.PointLight(0x33ff66, 1.2, 5);
  stbdLight.position.set(4.1, 0, -0.3);
  shipGroup.add(stbdLight);

  const strobeLight = new THREE.PointLight(0xffffff, 2.0, 10);
  strobeLight.position.set(0, 1.45, 0.6);
  shipGroup.add(strobeLight);

  // Animation Update Loop
  let strobeTimer = 0;
  const updateShip = (delta, isAccelerating = false) => {
    strobeTimer += delta;

    // Flash dorsal strobe every 1.2 seconds
    strobeLight.intensity = (strobeTimer % 1.2 < 0.1) ? 2.5 : 0.05;

    // Thruster flame dynamics (pulsing & color shift on acceleration)
    const baseScale = isAccelerating ? 1.5 : 0.85;
    thrusterOuterCones.forEach((flame, idx) => {
      const flicker = baseScale + Math.sin(strobeTimer * 24 + idx) * 0.12;
      flame.scale.set(flicker, isAccelerating ? 1.8 : 0.95, flicker);
      flame.material.opacity = isAccelerating ? 0.95 : 0.6;
      flame.material.color.setHex(isAccelerating ? 0xe4783b : 0x7ad7ea);
    });

    thrusterInnerCores.forEach((core, idx) => {
      const coreFlicker = (isAccelerating ? 1.3 : 0.8) + Math.sin(strobeTimer * 30 + idx) * 0.08;
      core.scale.set(coreFlicker, isAccelerating ? 1.5 : 0.9, coreFlicker);
      core.material.color.setHex(isAccelerating ? 0xffddaa : 0xffffff);
    });
  };

  const dispose = () => {
    disposable.geometries.forEach(g => g.dispose());
    disposable.materials.forEach(m => m.dispose());
    disposable.textures.forEach(t => t.dispose());
  };

  return { shipGroup, updateShip, dispose };
}
