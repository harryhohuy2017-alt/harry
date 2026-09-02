import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeHotbarIndex, slotLabel } from './hotbar.mjs';

test('hotbar has 20 numbered slots and clamps safely', () => {
  assert.equal(normalizeHotbarIndex(1), 0);
  assert.equal(normalizeHotbarIndex(10), 9);
  assert.equal(normalizeHotbarIndex(20), 19);
  assert.equal(normalizeHotbarIndex(21), 19);
  assert.equal(slotLabel(0), '1');
  assert.equal(slotLabel(19), '20');
});
