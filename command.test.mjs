import test from 'node:test';
import assert from 'node:assert/strict';
import { executeCommand } from './command.mjs';

test('commands support help, gamemode, give, tp and setblock', () => {
  assert.equal(executeCommand('/help'), 'Commands: /help, /time, /gamemode, /give, /tp, /setblock');
  assert.equal(executeCommand('/gamemode creative'), 'Gamemode: creative');
  assert.equal(executeCommand('/give wood'), 'Gave: wood');
  assert.equal(executeCommand('/tp 1 2 3'), 'Teleport: 1 2 3');
  assert.equal(executeCommand('/setblock 1 2 3 stone'), 'Setblock: stone at 1 2 3');
});
