import test from 'node:test';
import assert from 'node:assert/strict';
import { executeCommand } from './command.mjs';

test('/setblock calls the world setter with coordinates and block type', () => {
  const placed = [];
  const result = executeCommand('/setblock 10 64 -3 stone', {
    setBlock(x, y, z, type) { placed.push({ x, y, z, type }); }
  });

  assert.deepEqual(placed, [{ x: 10, y: 64, z: -3, type: 'stone' }]);
  assert.equal(result, 'Setblock: stone at 10 64 -3');
});
