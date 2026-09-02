import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import { normalizeHotbarIndex, slotLabel } from './hotbar9.mjs';

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
const sun = new THREE.DirectionalLight(0xffffff, 2.5); sun.position.set(15, 30, 10); sun.castShadow = true; scene.add(sun);
const blocks={grass:{color:0x55a84f},dirt:{color:0x8b5a32},stone:{color:0x858585},sand:{color:0xd9c27a},wood:{color:0x8f633d},leaves:{color:0x2f7d32,transparent:true}};
const geometries=new Map(), materials=new Map();
function materialFor(type){if(!materials.has(type))materials.set(type,new THREE.MeshLambertMaterial({color:blocks[type].color,transparent:!!blocks[type].transparent,opacity:blocks[type].transparent?.92:1}));return materials.get(type)}
function geometryFor(){if(!geometries.has('cube'))geometries.set('cube',new THREE.BoxGeometry(1,1,1));return geometries.get('cube')}
const world=new Map(), key=(x,y,z)=>`${x},${y},${z}`;
function setBlock(x,y,z,type){world.set(key(x,y,z),{x,y,z,type})} function removeBlock(x,y,z){world.delete(key(x,y,z))}
for(let x=-14;x<=14;x++)for(let z=-14;z<=14;z++){const h=1+Math.max(0,Math.floor(1.2*Math.sin(x*.35)*Math.cos(z*.25)));for(let y=-1;y<=h;y++)setBlock(x,y,z,y===h?'grass':y>h-3?'dirt':'stone')}
const meshes=new Map();
function rebuildWorld(){for(const mesh of meshes.values())scene.remove(mesh);meshes.clear();for(const b of world.values()){const m=new THREE.Mesh(geometryFor(),materialFor(b.type));m.position.set(b.x,b.y,b.z);m.castShadow=true;m.receiveShadow=true;m.userData.blockKey=key(b.x,b.y,b.z);scene.add(m);meshes.set(m.userData.blockKey,m)}} rebuildWorld();
const outline=new THREE.LineSegments(new THREE.EdgesGeometry(geometryFor()),new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:.95}));outline.scale.setScalar(1.04);outline.visible=false;scene.add(outline);
const raycaster=new THREE.Raycaster(),center=new THREE.Vector2(0,0);let target=null;
function updateTarget(){raycaster.setFromCamera(center,camera);const hits=raycaster.intersectObjects([...meshes.values()],false);target=hits[0]||null;if(target){outline.position.copy(target.object.position);outline.visible=true}else outline.visible=false}
function faceNormalFromHit(hit){if(!hit.face)return new THREE.Vector3(0,1,0);return hit.face.normal.clone().transformDirection(hit.object.matrixWorld).normalize()}
let actionAnim=null;
function startAction(type,object,position){actionAnim={type,object,start:performance.now(),duration:type==='break'?220:150,position:position.clone()}}
function updateAction(now){if(!actionAnim)return;const p=Math.min(1,(now-actionAnim.start)/actionAnim.duration);if(actionAnim.type==='break'){const s=1-Math.sin(p*Math.PI)*.10;actionAnim.object.scale.set(s,s,s);actionAnim.object.rotation.z=Math.sin(p*Math.PI*6)*.025;if(p>=1){const q=actionAnim.position;removeBlock(Math.round(q.x),Math.round(q.y),Math.round(q.z));rebuildWorld();updateTarget();actionAnim=null}}else{const s=.15+.85*(1-Math.pow(1-p,3));actionAnim.object.scale.set(s,s,s);if(p>=1){actionAnim.object.scale.set(1,1,1);actionAnim=null}}}
function breakTarget(){if(!target||actionAnim)return;const p=target.object.position;if(p.y<=-1)return;startAction('break',target.object,p)}
let selectedBlock='grass';
const hotbarItems=['grass','dirt','stone','sand','wood','leaves','grass','dirt','stone'];
const inventoryItems=['wood','leaves','grass','dirt','stone','sand','wood','leaves','grass','dirt','stone'];
let inventoryOpen=false;
const hotbar=document.createElement('div');
hotbar.id='hotbar';
hotbar.style.cssText='position:fixed;left:50%;bottom:18px;transform:translateX(-50%);display:flex;gap:4px;padding:6px 7px;background:#111b;border:2px solid #555;border-radius:6px;box-shadow:0 4px 18px #0008;z-index:20;user-select:none;pointer-events:auto;font-family:Arial,sans-serif';
for(let i=0;i<9;i++){const slot=document.createElement('button');slot.type='button';slot.dataset.index=String(i);slot.style.cssText='position:relative;flex:0 0 50px;width:50px;height:50px;padding:0;border:2px solid #777;border-radius:3px;background:#222d;cursor:pointer;box-sizing:border-box;color:#fff';const icon=document.createElement('span');icon.style.cssText='display:block;width:27px;height:27px;margin:8px auto 0;border:1px solid #111';const type=hotbarItems[i];icon.style.background=`#${blocks[type].color.toString(16).padStart(6,'0')}`;const label=document.createElement('span');label.textContent=slotLabel(i);label.style.cssText='position:absolute;left:3px;top:2px;font:700 11px Arial,sans-serif;text-shadow:1px 1px 2px #000';slot.append(icon,label);slot.addEventListener('click',()=>selectHotbarSlot(i));hotbar.appendChild(slot)}
document.body.appendChild(hotbar);
const inventory=document.createElement('div');
inventory.id='inventory';
inventory.style.cssText='position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);display:none;grid-template-columns:repeat(6,50px);gap:5px;padding:12px;background:#111e;border:3px solid #666;border-radius:7px;box-shadow:0 8px 30px #000b;z-index:30;user-select:none;font-family:Arial,sans-serif';
const inventoryTitle=document.createElement('div');inventoryTitle.textContent='KHO ĐỒ · Ô 10–20';inventoryTitle.style.cssText='grid-column:1/-1;color:#fff;font-weight:700;text-align:center;margin-bottom:3px';inventory.appendChild(inventoryTitle);
for(let i=0;i<11;i++){const slot=document.createElement('button');slot.type='button';slot.dataset.index=String(i);slot.style.cssText='position:relative;width:50px;height:50px;padding:0;border:2px solid #777;border-radius:3px;background:#222d;cursor:pointer;box-sizing:border-box;color:#fff';const icon=document.createElement('span');icon.style.cssText='display:block;width:27px;height:27px;margin:8px auto 0;border:1px solid #111';const type=inventoryItems[i];icon.style.background=`#${blocks[type].color.toString(16).padStart(6,'0')}`;const label=document.createElement('span');label.textContent=String(i+10);label.style.cssText='position:absolute;left:3px;top:2px;font:700 11px Arial,sans-serif;text-shadow:1px 1px 2px #000';slot.append(icon,label);slot.addEventListener('click',()=>selectInventorySlot(i));inventory.appendChild(slot)}
document.body.appendChild(inventory);
function selectHotbarSlot(index){const i=normalizeHotbarIndex(index+1);selectedBlock=hotbarItems[i];for(const slot of hotbar.children){const active=Number(slot.dataset.index)===i;slot.style.border=active?'2px solid #fff':'2px solid #777';slot.style.boxShadow=active?'0 0 0 2px #000,0 0 10px #fff8':'none'}}
function selectInventorySlot(index){selectedBlock=inventoryItems[Math.max(0,Math.min(inventoryItems.length-1,index))];for(const slot of inventory.children){if(!slot.dataset.index)continue;const active=Number(slot.dataset.index)===index;slot.style.border=active?'2px solid #fff':'2px solid #777';slot.style.boxShadow=active?'0 0 0 2px #000,0 0 10px #fff8':'none'}}
function toggleInventory(){inventoryOpen=!inventoryOpen;inventory.style.display=inventoryOpen?'grid':'none'}
selectHotbarSlot(0);
function placeBlock(){if(!target||actionAnim)return;const p=target.object.position,n=faceNormalFromHit(target);const x=Math.round(p.x+n.x),y=Math.round(p.y+n.y),z=Math.round(p.z+n.z);const box=new THREE.Box3(new THREE.Vector3(x-.5,y-.5,z-.5),new THREE.Vector3(x+.5,y+.5,z+.5));const playerBox=new THREE.Box3(new THREE.Vector3(camera.position.x-.3,camera.position.y-1.65,camera.position.z-.3),new THREE.Vector3(camera.position.x+.3,camera.position.y+.15,camera.position.z+.3));if(box.intersectsBox(playerBox)||world.has(key(x,y,z)))return;setBlock(x,y,z,selectedBlock);rebuildWorld();const m=meshes.get(key(x,y,z));if(m){m.scale.set(.15,.15,.15);startAction('place',m,m.position)}updateTarget()}
canvas.addEventListener('mousedown',e=>{if(paused)return;if(e.button===0)breakTarget();if(e.button===2)placeBlock()});canvas.addEventListener('contextmenu',e=>e.preventDefault());
const player={speed:4.5,sneakSpeed:2.2,normalEye:1.7,sneakEye:1.35,jumpSpeed:7.2,gravity:20};const keys=new Set();let verticalVelocity=0,grounded=false,jumpWasDown=false,paused=false,currentEye=player.normalEye,bobTime=0;
addEventListener('keydown',e=>{if(e.code==='KeyE'&&!e.repeat){e.preventDefault();toggleInventory();return}if(/^Digit[1-9]$/.test(e.code)){selectHotbarSlot(Number(e.code.slice(-1))-1)}keys.add(e.code);if(e.code==='KeyP'&&!e.repeat)togglePause()});
addEventListener('keyup',e=>keys.delete(e.code));
const pauseOverlay=document.createElement('div');pauseOverlay.textContent='TẠM DỪNG — Nhấn P để tiếp tục';pauseOverlay.style.cssText='position:fixed;left:50%;top:18%;transform:translateX(-50%);padding:10px 16px;border-radius:8px;background:#000a;color:#fff;font:700 18px Arial,sans-serif;display:none;pointer-events:none;z-index:40';document.body.appendChild(pauseOverlay);
function togglePause(){paused=!paused;pauseOverlay.style.display=paused?'block':'none';if(!paused){jumpWasDown=keys.has('Space');clock.getDelta()}}
let yaw=0,pitch=0;canvas.addEventListener('click',()=>{if(!paused)canvas.requestPointerLock?.()});document.addEventListener('mousemove',e=>{if(paused||document.pointerLockElement!==canvas)return;yaw-=e.movementX*.0022;pitch-=e.movementY*.0022;pitch=Math.max(-Math.PI/2+.05,Math.min(Math.PI/2-.05,pitch))});
function highestBlockBelow(x,z){const px=Math.round(x),pz=Math.round(z);let highest=-Infinity;for(const b of world.values())if(b.x===px&&b.z===pz&&b.y>highest)highest=b.y;return highest}
const clock=new THREE.Clock();
function updatePlayer(dt){camera.rotation.order='YXZ';camera.rotation.y=yaw;camera.rotation.x=pitch;const sneaking=keys.has('ShiftLeft')||keys.has('ShiftRight'),forward=new THREE.Vector3(0,0,-1).applyEuler(new THREE.Euler(0,yaw,0)),right=new THREE.Vector3(1,0,0).applyEuler(new THREE.Euler(0,yaw,0)),direction=new THREE.Vector3();if(keys.has('ArrowUp'))direction.add(forward);if(keys.has('ArrowDown'))direction.sub(forward);if(keys.has('ArrowRight'))direction.add(right);if(keys.has('ArrowLeft'))direction.sub(right);if(direction.lengthSq())direction.normalize();const moving=direction.lengthSq()>0;camera.position.addScaledVector(direction,(sneaking?player.sneakSpeed:player.speed)*dt);const highest=highestBlockBelow(camera.position.x,camera.position.z),normalFloorY=highest>-Infinity?highest+.5+player.normalEye:player.normalEye+.5,sneakFloorY=highest>-Infinity?highest+.5+player.sneakEye:player.sneakEye+.5,floorY=sneaking?sneakFloorY:normalFloorY;if(camera.position.y<=floorY+.06&&verticalVelocity<=0){camera.position.y=floorY;verticalVelocity=0;grounded=true}else grounded=false;const jumpDown=keys.has('Space');if(jumpDown&&!jumpWasDown&&grounded&&!sneaking){verticalVelocity=player.jumpSpeed;grounded=false}jumpWasDown=jumpDown;if(!grounded){verticalVelocity-=player.gravity*dt;camera.position.y+=verticalVelocity*dt;if(camera.position.y<floorY){camera.position.y=floorY;verticalVelocity=0;grounded=true}}const targetEye=sneaking?player.sneakEye:player.normalEye;currentEye=THREE.MathUtils.damp(currentEye,targetEye,14,dt);const baseEyeY=highest>-Infinity?highest+.5:.5;if(moving&&grounded)bobTime+=dt*(sneaking?7:10);else bobTime=THREE.MathUtils.damp(bobTime,0,10,dt);const bob=moving&&grounded?Math.sin(bobTime)*(sneaking?.025:.045):0;if(grounded)camera.position.y=baseEyeY+currentEye+bob}
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.05);if(!paused){updatePlayer(dt);updateTarget();updateAction(performance.now())}renderer.render(scene,camera)}animate();addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight,false)});
