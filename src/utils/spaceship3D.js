import * as THREE from 'three';

/**
 * Spaceship 404 — 3D Aerospace Exploration Vessel
 * Inspired by NASA Deep Space Transit architectures (Image 2 reference):
 * - Modular cylindrical habitat hull with titanium & composite thermal tiles
 * - Forward command cupola with reinforced observation window panes
 * - Lateral solar array radiators with photovoltaic grid texture
 * - Articulated high-gain communications dish
 * - Rear ion propulsion block with glowing plasma exhaust
 * - Navigational strobes (Port Red, Starboard Green, White Tail Strobe)
 */

export function createSpaceship404() {
  const shipGroup = new THREE.Group();
  shipGroup.name = 'Spaceship404';

  const disposable = {
    geometries: [],
    materials: [],
    textures: []
  };

  // 1. Decal canvas texture for "404" insignia
  const decalCanvas = document.createElement('canvas');
  decalCanvas.width = 512;
  decalCanvas.height = 128;
  const dctx = decalCanvas.getContext('2d');
  dctx.fillStyle = '#E8ECEF';
  dctx.fillRect(0, 0, 512, 128);
  dctx.fillStyle = '#07111F';
  dctx.font = 'bold 64px sans-serif';
  dctx.fillText('404  ASTROVITALS', 30, 85);
  dctx.fillStyle = '#E4783B';
  dctx.fillRect(0, 0, 512, 8);
  const decalTex = new THREE.CanvasTexture(decalCanvas);
  disposable.textures.push(decalTex);

  // 2. Hull Material (aerospace matte titanium composite)
  const hullMat = new THREE.MeshStandardMaterial({
    color: 0xd8dde4,
    roughness: 0.38,
    metalness: 0.55
  });
  disposable.materials.push(hullMat);

  const darkTrimMat = new THREE.MeshStandardMaterial({
    color: 0x1f2937,
    roughness: 0.5,
    metalness: 0.7
  });
  disposable.materials.push(darkTrimMat);

  const goldFoilMat = new THREE.MeshStandardMaterial({
    color: 0xdfa030,
    roughness: 0.25,
    metalness: 0.95
  });
  disposable.materials.push(goldFoilMat);

  // 3. Main Pressurized Crew Hull (Segmented Cylinder)
  const hullGeo = new THREE.CylinderGeometry(0.7, 0.78, 3.2, 24);
  disposable.geometries.push(hullGeo);
  const hullMesh = new THREE.Mesh(hullGeo, hullMat);
  hullMesh.rotation.x = Math.PI / 2;
  shipGroup.add(hullMesh);

  // Hull Ring Reinforcements
  [-1.0, 0, 1.0].forEach((zPos) => {
    const ringGeo = new THREE.TorusGeometry(0.76, 0.04, 12, 24);
    disposable.geometries.push(ringGeo);
    const ringMesh = new THREE.Mesh(ringGeo, darkTrimMat);
    ringMesh.position.z = zPos;
    shipGroup.add(ringMesh);
  });

  // 4. Forward Command Cupola & Nosecone
  const noseGeo = new THREE.ConeGeometry(0.7, 1.1, 24);
  disposable.geometries.push(noseGeo);
  const noseMesh = new THREE.Mesh(noseGeo, hullMat);
  noseMesh.rotation.x = -Math.PI / 2;
  noseMesh.position.z = 2.15;
  shipGroup.add(noseMesh);

  // Cupola Observation Glass Dome
  const cupolaGeo = new THREE.SphereGeometry(0.42, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
  disposable.geometries.push(cupolaGeo);
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x7ad7ea,
    roughness: 0.1,
    metalness: 0.9,
    transparent: true,
    opacity: 0.85
  });
  disposable.materials.push(glassMat);
  const cupolaMesh = new THREE.Mesh(cupolaGeo, glassMat);
  cupolaMesh.rotation.x = Math.PI / 2;
  cupolaMesh.position.z = 2.45;
  shipGroup.add(cupolaMesh);

  // 5. Lateral Photovoltaic Solar Wings (Port & Starboard)
  [-1, 1].forEach((side) => {
    const wingGeo = new THREE.BoxGeometry(2.4, 0.05, 1.1);
    disposable.geometries.push(wingGeo);
    const solarMat = new THREE.MeshStandardMaterial({
      color: 0x142b47,
      roughness: 0.2,
      metalness: 0.85
    });
    disposable.materials.push(solarMat);
    const wingMesh = new THREE.Mesh(wingGeo, solarMat);
    wingMesh.position.set(side * 2.1, 0, -0.2);
    shipGroup.add(wingMesh);

    // Gold Foil Truss Connector
    const trussGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.9, 8);
    disposable.geometries.push(trussGeo);
    const trussMesh = new THREE.Mesh(trussGeo, goldFoilMat);
    trussMesh.rotation.z = Math.PI / 2;
    trussMesh.position.set(side * 1.15, 0, -0.2);
    shipGroup.add(trussMesh);
  });

  // 6. High-Gain Communications Dish (Dorsal)
  const dishGeo = new THREE.CylinderGeometry(0.45, 0.08, 0.12, 16);
  disposable.geometries.push(dishGeo);
  const dishMesh = new THREE.Mesh(dishGeo, hullMat);
  dishMesh.position.set(0, 1.05, 0.4);
  dishMesh.rotation.x = 0.4;
  shipGroup.add(dishMesh);

  // Dish Feed Horn
  const hornGeo = new THREE.ConeGeometry(0.08, 0.35, 8);
  disposable.geometries.push(hornGeo);
  const hornMesh = new THREE.Mesh(hornGeo, goldFoilMat);
  hornMesh.position.set(0, 1.25, 0.5);
  hornMesh.rotation.x = -0.4;
  shipGroup.add(hornMesh);

  // 7. Rear Propulsion Block & Ion Thruster Nozzles
  const nozzlePositions = [
    [-0.32, -0.32],
    [0.32, -0.32],
    [-0.32, 0.32],
    [0.32, 0.32]
  ];

  const thrusterFlames = [];

  nozzlePositions.forEach(([x, y]) => {
    // Engine bell
    const bellGeo = new THREE.CylinderGeometry(0.14, 0.26, 0.6, 16);
    disposable.geometries.push(bellGeo);
    const bellMesh = new THREE.Mesh(bellGeo, darkTrimMat);
    bellMesh.rotation.x = Math.PI / 2;
    bellMesh.position.set(x, y, -1.9);
    shipGroup.add(bellMesh);

    // Ion Plasma Exhaust Cone
    const flameGeo = new THREE.ConeGeometry(0.24, 1.2, 16);
    disposable.geometries.push(flameGeo);
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0x7ad7ea,
      transparent: true,
      opacity: 0.85
    });
    disposable.materials.push(flameMat);
    const flameMesh = new THREE.Mesh(flameGeo, flameMat);
    flameMesh.rotation.x = -Math.PI / 2;
    flameMesh.position.set(x, y, -2.8);
    shipGroup.add(flameMesh);
    thrusterFlames.push(flameMesh);
  });

  // 8. Navigation Lights
  // Port: Red Light (Left)
  const portLight = new THREE.PointLight(0xff3333, 1.5, 4);
  portLight.position.set(-3.3, 0, -0.2);
  shipGroup.add(portLight);

  // Starboard: Green Light (Right)
  const stbdLight = new THREE.PointLight(0x33ff66, 1.5, 4);
  stbdLight.position.set(3.3, 0, -0.2);
  shipGroup.add(stbdLight);

  // Strobe indicator on top
  const strobeLight = new THREE.PointLight(0xffffff, 2.0, 8);
  strobeLight.position.set(0, 1.2, -1.2);
  shipGroup.add(strobeLight);

  // Animation hook to pulse thrusters and flash strobe
  let strobeTimer = 0;
  const updateShip = (delta, isAccelerating = false) => {
    strobeTimer += delta;

    // Flash tail strobe once every second
    strobeLight.intensity = (strobeTimer % 1.0 < 0.1) ? 2.5 : 0.05;

    // Thruster flame dynamics
    thrusterFlames.forEach((flame, idx) => {
      const baseScale = isAccelerating ? 1.4 : 0.7;
      const flicker = baseScale + Math.sin(strobeTimer * 20 + idx) * 0.15;
      flame.scale.set(flicker, isAccelerating ? 1.6 : 0.8, flicker);
      flame.material.opacity = isAccelerating ? 0.95 : 0.55;
      flame.material.color.setHex(isAccelerating ? 0xe4783b : 0x7ad7ea); // Blue cruising, orange acceleration
    });
  };

  const dispose = () => {
    disposable.geometries.forEach(g => g.dispose());
    disposable.materials.forEach(m => m.dispose());
    disposable.textures.forEach(t => t.dispose());
  };

  return { shipGroup, updateShip, dispose };
}
