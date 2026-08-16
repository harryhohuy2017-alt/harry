const canvas=document.getElementById('game');
const ctx=canvas.getContext('2d');
const keys=new Set();
const player={x:480,y:270,size:22,speed:3};
let paused=false, selected=1, inventoryOpen=false;
const blocks=[
  {name:'Grass',color:'#5aa657',item:'grass'},
  {name:'Dirt',color:'#9b6b43',item:'dirt'},
  {name:'Stone',color:'#777',item:'stone'},
  {name:'Sand',color:'#d9c27a',item:'sand'}
];
const world=[];
const inventory={grass:20,dirt:20,stone:10,sand:10,stick:0,plank:0};
for(let y=0;y<18;y++)for(let x=0;x<32;x++){
  const edge=x===0||y===0||x===31||y===17;
  world.push({x:x*30,y:y*30,type:edge?4:((x+y)%11===0?3:1)});
}
function gridAt(px,py){return {x:Math.floor(px/30),y:Math.floor(py/30)}}
function blockAt(gx,gy){return world.find(b=>b.x===gx*30&&b.y===gy*30)||null}
function playerGrid(){return gridAt(player.x,player.y)}
function near(gx,gy){const p=playerGrid();return Math.abs(p.x-gx)+Math.abs(p.y-gy)<=2}
function placeBlock(){const p=playerGrid(), gx=p.x+1, gy=p.y;if(!near(gx,gy)||blockAt(gx,gy))return;const b=blocks[selected-1];if((inventory[b.item]||0)<=0)return;world.push({x:gx*30,y:gy*30,type:selected});inventory[b.item]--}
function breakBlock(){const p=playerGrid(), gx=p.x+1, gy=p.y, b=blockAt(gx,gy);if(!b||!near(gx,gy))return;if(gx===0||gy===0||gx===31||gy===17)return;const index=world.indexOf(b);world.splice(index,1);inventory[blocks[b.type-1].item]++}
function saveGame(){localStorage.setItem('sandboxGameSave',JSON.stringify({player,world,inventory}));flash('💾 Đã lưu game')}
function loadGame(){const raw=localStorage.getItem('sandboxGameSave');if(!raw)return flash('Chưa có bản lưu');const s=JSON.parse(raw);player.x=s.player.x;player.y=s.player.y;world.length=0;world.push(...s.world);Object.assign(inventory,s.inventory);flash('📂 Đã tải game')}
let notice='',noticeUntil=0;function flash(t){notice=t;noticeUntil=performance.now()+1400}
function draw(){
  ctx.fillStyle='#79bfe8';ctx.fillRect(0,0,canvas.width,canvas.height);
  for(const b of world){ctx.fillStyle=blocks[b.type-1].color;ctx.fillRect(b.x,b.y,30,30);ctx.strokeStyle='#0002';ctx.strokeRect(b.x,b.y,30,30)}
  ctx.fillStyle='#3b2d20';ctx.fillRect(player.x-player.size/2,player.y-player.size/2,player.size,player.size);
  ctx.fillStyle='#ffd7a8';ctx.fillRect(player.x-7,player.y-15,14,10);
  ctx.fillStyle='#fff';ctx.font='14px system-ui';ctx.fillText(`Block: ${blocks[selected-1].name} | [Space] đặt | [X] phá`,12,525);
  if(inventoryOpen){ctx.fillStyle='#000c';ctx.fillRect(260,115,440,310);ctx.fillStyle='#fff';ctx.font='24px system-ui';ctx.fillText('🎒 INVENTORY',420,150);ctx.font='18px system-ui';blocks.forEach((b,i)=>ctx.fillText(`${i+1}. ${b.name}: ${inventory[b.item]||0}`,300,195+i*42));ctx.fillText(`Stick: ${inventory.stick}   Plank: ${inventory.plank}`,300,370);ctx.font='14px system-ui';ctx.fillText('I để đóng/mở',300,400)}
  if(performance.now()<noticeUntil){ctx.fillStyle='#000b';ctx.fillRect(360,18,240,38);ctx.fillStyle='#fff';ctx.font='16px system-ui';ctx.fillText(notice,390,43)}
}
function update(){if(!paused&&!inventoryOpen){if(keys.has('w'))player.y-=player.speed;if(keys.has('s'))player.y+=player.speed;if(keys.has('a'))player.x-=player.speed;if(keys.has('d'))player.x+=player.speed;player.x=Math.max(15,Math.min(945,player.x));player.y=Math.max(15,Math.min(525,player.y))}draw();requestAnimationFrame(update)}
addEventListener('keydown',e=>{const k=e.key.toLowerCase();keys.add(k);if(/^1$|^2$|^3$|^4$/.test(e.key))selected=Number(e.key);if(k==='p'){paused=!paused;document.getElementById('pause').classList.toggle('hidden',!paused)}if(k==='i')inventoryOpen=!inventoryOpen;if(k==='x')breakBlock();if(e.code==='Space')placeBlock();if(k==='f5')saveGame();if(k==='f9')loadGame();if(e.code==='Space'||e.key.startsWith('Arrow'))e.preventDefault()});
addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
update();
