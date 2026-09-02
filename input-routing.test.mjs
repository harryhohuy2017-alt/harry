import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldHandleGameKey } from './input-routing.mjs';

test('game shortcuts do not capture keys while chat input is focused', () => {
  assert.equal(shouldHandleGameKey({ target: { tagName: 'INPUT' } }), false);
  assert.equal(shouldHandleGameKey({ target: { tagName: 'TEXTAREA' } }), false);
  assert.equal(shouldHandleGameKey({ target: { tagName: 'CANVAS' } }), true);
});
