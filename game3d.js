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
camera.position.set(0, 2.7, 7);

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
const selectedBlock = 'grass';
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
function removeBlock(x, y, z) { world.delete(key(x, y, z)); }
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

const outline = new THREE.LineSegments(new THREE.EdgesGeometry(geometryFor()), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 }));
outline.scale.setScalar(1.04);
outline.visible = false;
scene.add(outline);

const raycaster = new THREE.Raycaster();
const center = new THREE.Vector2(0, 0);
let target = null;
function updateTarget() {
  raycaster.setFromCamera(center, camera);
  const hits = raycaster.intersectObjects([...meshes.values()], false);
  target = hits[0] || null;
  if (target) {
    outline.position.copy(target.object.position);
    outline.visible = true;
  } else outline.visible = false;
}
function faceNormalFromHit(hit) {
  if (!hit.face) return new THREE.Vector3(0, 1, 0);
  return hit.face.normal.clone().transformDirection(hit.object.matrixWorld).normalize();
}
function breakTarget() {
  if (!target) return;
  const p = target.object.position;
  if (p.y <= -1) return;
  removeBlock(Math.round(p.x), Math.round(p.y), Math.round(p.z));
  rebuildWorld();
  updateTarget();
}
function placeBlock() {
  if (!target) return;
  const p = target.object.position;
  const n = faceNormalFromHit(target);
  const x = Math.round(p.x + n.x), y = Math.round(p.y + n.y), z = Math.round(p.z + n.z);
  const newBox = new THREE.Box3(new THREE.Vector3(x - 0.5, y - 0.5, z - 0.5), new THREE.Vector3(x + 0.5, y + 0.5, z + 0.5));
  const playerBox = new THREE.Box3(new THREE.Vector3(camera.position.x - 0.3, camera.position.y - 1.65, camera.position.z - 0.3), new THREE.Vector3(camera.position.x + 0.3, camera.position.y + 0.15, camera.position.z + 0.3));
  if (newBox.intersectsBox(playerBox) || world.has(key(x, y, z))) return;
  setBlock(x, y, z, selectedBlock);
  rebuildWorld();
  updateTarget();
}
canvas.addEventListener('mousedown', e => { if (e.button === 0) breakTarget(); if (e.button === 2) placeBlock(); });
canvas.addEventListener('contextmenu', e => e.preventDefault());

const player = { height: 1.7, speed: 4.5, sneakSpeed: 2.2, normalEye: 1.7, sneakEye: 1.35 };
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

  const sneaking = keys.has('ShiftLeft') || keys.has('ShiftRight');
  const forward = new THREE.Vector3(0, 0, -1).applyEuler(new THREE.Euler(0, yaw, 0));
  const right = new THREE.Vector3(1, 0, 0).applyEuler(new THREE.Euler(0, yaw, 0));
  const direction = new THREE.Vector3();
  if (keys.has('ArrowUp')) direction.add(forward);
  if (keys.has('ArrowDown')) direction.sub(forward);
  if (keys.has('ArrowRight')) direction.add(right);
  if (keys.has('ArrowLeft')) direction.sub(right);
  if (direction.lengthSq()) direction.normalize();

  const speed = sneaking ? player.sneakSpeed : player.speed;
  camera.position.addScaledVector(direction, speed * dt);

  let highest = -Infinity;
  const px = Math.round(camera.position.x), pz = Math.round(camera.position.z);
  for (const block of world.values()) {
    if (block.x === px && block.z === pz && block.y > highest) highest = block.y;
  }
  const eye = sneaking ? player.sneakEye : player.normalEye;
  camera.position.y = highest > -Infinity ? highest + eye + 0.5 : eye + 0.5;
}

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  updatePlayer(dt);
  updateTarget();
  renderer.render(scene, camera);
}
animate();

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight, false);
});
