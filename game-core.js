export const BLOCKS=[
  {name:'Grass',color:'#5aa657'},
  {name:'Dirt',color:'#9b6b43'},
  {name:'Stone',color:'#777'},
  {name:'Sand',color:'#d9c27a'}
];
export function createWorld(width=32,height=18){const world=[];for(let y=0;y<height;y++)for(let x=0;x<width;x++){const edge=x===0||y===0||x===width-1||y===height-1;world.push({x:x*30,y:y*30,type:edge?4:((x+y)%11===0?3:1)});}return world;}
export function blockAt(world,x,y){return world.find(b=>b.x===x*30&&b.y===y*30)||null;}
export function setBlock(world,x,y,type){const block=blockAt(world,x,y);if(!block){world.push({x:x*30,y:y*30,type});return true}block.type=type;return true;}
export function removeBlock(world,x,y){const i=world.findIndex(b=>b.x===x*30&&b.y===y*30);if(i<0)return null;return world.splice(i,1)[0];}
export function createInventory(){return {grass:0,dirt:0,stone:0,sand:0,stick:0,plank:0,apple:0,dirtyWater:0,cleanWater:0};}
export function addItem(inventory,item,amount=1){inventory[item]=(inventory[item]||0)+amount;return inventory;}
export function craft(inventory,recipe){for(const [item,count] of Object.entries(recipe.input))if((inventory[item]||0)<count)return false;for(const [item,count] of Object.entries(recipe.input))inventory[item]-=count;for(const [item,count] of Object.entries(recipe.output))addItem(inventory,item,count);return true;}
export function consumeFood(inventory,survival,item='apple',restore=8){if((inventory[item]||0)<1)return false;inventory[item]--;survival.hunger=Math.min(survival.maxHunger,survival.hunger+restore);return true;}
export function drinkWater(inventory,survival,item='cleanWater',restore=8){if((inventory[item]||0)<1)return false;inventory[item]--;survival.thirst=Math.min(survival.maxThirst,survival.thirst+restore);return true;}
export function serializeState(state){return JSON.stringify(state);}
export function deserializeState(text){return JSON.parse(text);}
