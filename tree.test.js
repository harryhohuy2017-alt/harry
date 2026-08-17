const fs = require('fs');
const assert = require('assert');
const source = fs.readFileSync('game.js', 'utf8');

assert(source.includes('function generateTrees()'), 'game.js must generate trees');
assert(source.includes("treePart:'trunk'"), 'tree trunks must be tagged');
assert(source.includes("treePart:'leaf'"), 'tree leaves must be tagged');
assert(source.includes('treeDecayAt'), 'tree leaves must have delayed decay state');
assert(source.includes("inventory.wood=(inventory.wood||0)+1"), 'breaking a trunk must give wood');
assert(source.includes('generateTrees();'), 'tree generation must run when the world is created');

console.log('Tree feature checks passed');
