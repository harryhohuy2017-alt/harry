import {createInventory, addItem, consumeFood, drinkWater} from './game-core.js';

const inventory=createInventory();
addItem(inventory,'apple',2);
const survival={hunger:5,maxHunger:20,thirst:5,maxThirst:20};

if(!consumeFood(inventory,survival,'apple',8))throw new Error('Food should be consumed when available');
if(inventory.apple!==1||survival.hunger!==13)throw new Error('Food must reduce inventory and restore hunger');
if(consumeFood(inventory,survival,'apple',8)===false&&inventory.apple!==0)throw new Error('Second food should be consumed');
if(!drinkWater(inventory,survival,'dirtyWater',6))throw new Error('Dirty water should be drinkable');
if(survival.thirst!==11)throw new Error('Water must restore thirst');
console.log('Food/water core tests passed');
