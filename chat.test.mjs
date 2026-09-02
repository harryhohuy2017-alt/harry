import test from 'node:test';
import assert from 'node:assert/strict';
import { handleChatCommand, CHAT_COMMANDS, shouldKeepKeyInChatInput } from './chat.mjs';

test('chat supports T-style command handling with help, time, and gamemode', () => {
  assert.deepEqual(CHAT_COMMANDS, ['/help', '/time', '/gamemode']);
  assert.match(handleChatCommand('/help'), /help/i);
  assert.match(handleChatCommand('/time'), /time/i);
  assert.match(handleChatCommand('/gamemode'), /gamemode/i);
});

test('ordinary chat text is returned as a chat message', () => {
  assert.equal(handleChatCommand('hello'), 'hello');
});

test('chat input keeps E and P available for typing', () => {
  assert.equal(shouldKeepKeyInChatInput('KeyE'), true);
  assert.equal(shouldKeepKeyInChatInput('KeyP'), true);
  assert.equal(shouldKeepKeyInChatInput('KeyT'), true);
  assert.equal(shouldKeepKeyInChatInput('Escape'), false);
});
