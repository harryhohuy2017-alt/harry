import test from 'node:test';
import assert from 'node:assert/strict';

function makeIcons(value, full, empty) {
  return Array.from({ length: 10 }, (_, i) => i < value ? full : empty).join('');
}

test('health and hunger HUD render ten slots', () => {
  assert.equal(makeIcons(10, '♥', '♡').length, 10);
  assert.equal(makeIcons(8, '♥', '♡'), '♥♥♥♥♥♥♥♥♡♡');
  assert.equal(makeIcons(6, '🍗', '·'), '🍗🍗🍗🍗🍗🍗····');
});
