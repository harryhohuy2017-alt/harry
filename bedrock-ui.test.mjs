import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('./3d.html', import.meta.url), 'utf8');

test('Bedrock-like HUD uses a dark framed inventory and hotbar', () => {
  assert.match(html, /background:#303030!important/);
  assert.match(html, /border:3px solid #8b8b8b!important/);
  assert.match(html, /inset 0 0 0 2px #1b1b1b/);
  assert.match(html, /grid-template-columns:repeat\(9,50px\)!important/);
  assert.match(html, /grid-template-rows:repeat\(2,50px\)!important/);
  assert.match(html, /#hotbar\{[^}]*bottom:10px!important/);
});
