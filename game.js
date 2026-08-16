const canvas=document.getElementById('game');
const ctx=canvas.getContext('2d');
const keys=new Set();
const player={x:480,y:270,size:22,speed:3};
let paused=false, selected=1;
const blocks=[
  {name:'Grass',color:'#5aa657'},
  {name:'Dirt',color:'#9b6b43'},
  {name:'Stone',color:'#777'},
  {name:'Sand',color:'#d9c27a'}
];
const world=[];
for(let y=0;y<18;y++)for(let x=0;x<32;x++){
  const edge=x===0||y===0||x===31||y===17;
  world.push({x:x*30,y:y*30,type:edge?3:((x+y)%11===0?2:1)});
}
function draw(){
  ctx.fillStyle='#79bfe8';ctx.fillRect(0,0,canvas.width,canvas.height);
  for(const b of world){ctx.fillStyle=blocks[b.type-1].color;ctx.fillRect(b.x,b.y,30,30);ctx.strokeStyle='#0002';ctx.strokeRect(b.x,b.y,30,30)}
  ctx.fillStyle='#3b2d20';ctx.fillRect(player.x-player.size/2,player.y-player.size/2,player.size,player.size);
  ctx.fillStyle='#ffd7a8';ctx.fillRect(player.x-7,player.y-15,14,10);
  ctx.fillStyle='#fff';ctx.font='14px system-ui';ctx.fillText('Block: '+blocks[selected-1].name,12,525);
}
function update(){
  if(!paused){if(keys.has('w'))player.y-=player.speed;if(keys.has('s'))player.y+=player.speed;if(keys.has('a'))player.x-=player.speed;if(keys.has('d'))player.x+=player.speed;player.x=Math.max(15,Math.min(945,player.x));player.y=Math.max(15,Math.min(525,player.y))}
  draw();requestAnimationFrame(update);
}
addEventListener('keydown',e=>{keys.add(e.key.toLowerCase());if(/^1$|^2$|^3$|^4$/.test(e.key))selected=Number(e.key);if(e.key.toLowerCase()==='p'){paused=!paused;document.getElementById('pause').classList.toggle('hidden',!paused)}if(e.key===' '||e.key==='ArrowUp'||e.key==='ArrowDown')e.preventDefault()});
addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
update();
