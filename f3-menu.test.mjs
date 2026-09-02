import test from 'node:test';
import assert from 'node:assert/strict';
import { createF3MenuText } from './f3-overlay.mjs';

test('F3 menu text has a real Minecraft-style debug header and coordinates', () => {
  const text = createF3MenuText({ fps: 60, x: 1.25, y: 2.7, z: -4.5, facing: 'north' });
  assert.match(text, /Minecraft-like Debug/);
  assert.match(text, /FPS: 60/);
  assert.match(text, /XYZ: 1\.25 2\.70 -4\.50/);
  assert.match(text, /Facing: north/);
});
