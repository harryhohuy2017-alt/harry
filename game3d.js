import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const canvas = document.querySelector('#game3d');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight, false);
renderer.shadowMap.enabled = true;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x87ceeb, 18, 70);

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.05, 150);
camera.position.set(0, 3, 7);

scene.add(new THREE.HemisphereLight(0xffffff, 0x6b7d52, 2.2));
const sun = new THREE.DirectionalLight(0xffffff, 2.5);
sun.position.set(15, 30, 10);
sun.castShadow = true;
scene.add(sun);

const blocks = {
  grass: { color: 0x55a84f },
  dirt: { color: 0x8b5a32 },
  stone: { color: 0x858585 },
  sand: { color: 0xd9c27a },
  wood: { color: 0x8f633d },
  leaves: { color: 0x2f7d32, transparent: true },
};
const geometries = new Map();
const materials = new Map();
function materialFor(type) {
  if (!materials.has(type)) materials.set(type, new THREE.MeshLambertMaterial({ color: blocks[type].color, transparent: !!blocks[type].transparent, opacity: blocks[type].transparent ? 0.92 : 1 }));
  return materials.get(type);
}
function geometryFor() {
  if (!geometries.has('cube')) geometries.set('cube', new THREE.BoxGeometry(1, 1, 1));
  return geometries.get('cube');
}

const world = new Map();
const key = (x, y, z) => `${x},${y},${z}`;
function setBlock(x, y, z, type) { world.set(key(x, y, z), { x, y, z, type }); }
function makeTerrain() {
  for (let x = -14; x <= 14; x++) {
    for (let z = -14; z <= 14; z++) {
      const h = 1 + Math.max(0, Math.floor(1.2 * Math.sin(x * 0.35) * Math.cos(z * 0.25)));
      for (let y = -1; y <= h; y++) setBlock(x, y, z, y === h ? 'grass' : y > h - 3 ? 'dirt' : 'stone');
    }
  }
}
makeTerrain();

const meshes = new Map();
function rebuildWorld() {
  for (const mesh of meshes.values()) scene.remove(mesh);
  meshes.clear();
  for (const block of world.values()) {
    const mesh = new THREE.Mesh(geometryFor(), materialFor(block.type));
    mesh.position.set(block.x, block.y, block.z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.blockKey = key(block.x, block.y, block.z);
    scene.add(mesh);
    meshes.set(mesh.userData.blockKey, mesh);
  }
}
rebuildWorld();

const player = { velocity: new THREE.Vector3(), height: 1.7, speed: 4.5, sprint: 7.5 };
const keys = new Set();
addEventListener('keydown', e => keys.add(e.code));
addEventListener('keyup', e => keys.delete(e.code));

let yaw = 0, pitch = 0;
canvas.addEventListener('click', () => canvas.requestPointerLock?.());
document.addEventListener('mousemove', e => {
  if (document.pointerLockElement !== canvas) return;
  yaw -= e.movementX * 0.0022;
  pitch -= e.movementY * 0.0022;
  pitch = Math.max(-Math.PI / 2 + 0.05, Math.min(Math.PI / 2 - 0.05, pitch));
});

const clock = new THREE.Clock();
function updatePlayer(dt) {
  camera.rotation.order = 'YXZ';
  camera.rotation.y = yaw;
  camera.rotation.x = pitch;

  const forward = new THREE.Vector3(0, 0, -1).applyEuler(new THREE.Euler(0, yaw, 0));
  const right = new THREE.Vector3(1, 0, 0).applyEuler(new THREE.Euler(0, yaw, 0));
  const direction = new THREE.Vector3();
  if (keys.has('ArrowUp')) direction.add(forward);
  if (keys.has('ArrowDown')) direction.sub(forward);
  if (keys.has('ArrowRight')) direction.add(right);
  if (keys.has('ArrowLeft')) direction.sub(right);
  if (direction.lengthSq()) direction.normalize();
  const speed = keys.has('ShiftLeft') || keys.has('ShiftRight') ? player.sprint : player.speed;
  camera.position.addScaledVector(direction, speed * dt);
  camera.position.y = player.height + 1;
}

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  updatePlayer(dt);
  renderer.render(scene, camera);
}
animate();

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight, false);
});
