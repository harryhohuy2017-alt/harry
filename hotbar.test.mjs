import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeHotbarIndex,
  slotLabel,
  HOTBAR_SIZE,
  HOTBAR_GAP,
  HOTBAR_SLOT_SIZE,
  INVENTORY_HOTBAR_GAP,
} from './hotbar9.mjs';

test('hotbar exposes exactly 9 numbered slots', () => {
  assert.equal(HOTBAR_SIZE, 9);
  assert.equal(normalizeHotbarIndex(1), 0);
  assert.equal(normalizeHotbarIndex(9), 8);
  assert.equal(normalizeHotbarIndex(10), 8);
  assert.equal(normalizeHotbarIndex(20), 8);
  assert.equal(slotLabel(0), '1');
  assert.equal(slotLabel(8), '9');
});

test('Bedrock-style inventory and hotbar are visually continuous', () => {
  assert.equal(HOTBAR_GAP, 0);
  assert.equal(INVENTORY_HOTBAR_GAP, 0);
  assert.equal(HOTBAR_SLOT_SIZE, 50);
});
