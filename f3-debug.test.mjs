import test from 'node:test';
import assert from 'node:assert/strict';
import { toggleF3, formatF3Debug } from './f3-debug.mjs';

test('F3 toggles the debug overlay state', () => {
  assert.equal(toggleF3(false), true);
  assert.equal(toggleF3(true), false);
});

test('F3 debug text contains FPS and player coordinates', () => {
  const text = formatF3Debug({ fps: 60, x: 1.25, y: 2.7, z: -4.5 });
  assert.match(text, /FPS: 60/);
  assert.match(text, /XYZ: 1\.25 2\.70 -4\.50/);
});
