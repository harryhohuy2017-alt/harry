import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeHotbarIndex,
  slotLabel,
  HOTBAR_SIZE,
  HOTBAR_GAP,
  HOTBAR_SLOT_SIZE,
  INVENTORY_HOTBAR_GAP,
  INVENTORY_COLUMNS,
  INVENTORY_ROWS,
  INVENTORY_SLOT_COUNT,
  BEDROCK_PANEL_BACKGROUND,
  BEDROCK_SLOT_BACKGROUND,
  BEDROCK_PANEL_BORDER,
  BEDROCK_SELECTED_BORDER,
  BEDROCK_SLOT_BORDER,
  BEDROCK_SLOT_LIGHT_BORDER,
  BEDROCK_SLOT_INNER_BORDER,
  buildHotbarStyle,
  buildInventoryStyle,
  buildBedrockSlotStyle,
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
  const style = buildHotbarStyle();
  assert.equal(HOTBAR_GAP, 0);
  assert.equal(INVENTORY_HOTBAR_GAP, 0);
  assert.equal(HOTBAR_SLOT_SIZE, 50);
  assert.equal(style.gap, '0');
  assert.equal(style.borderRadius, '0');
  assert.equal(style.display, 'grid');
  assert.equal(style.gridTemplateColumns, 'repeat(9, 50px)');
  assert.equal(BEDROCK_PANEL_BACKGROUND, '#313131');
  assert.equal(BEDROCK_SLOT_BACKGROUND, '#1f1f1f');
  assert.equal(BEDROCK_PANEL_BORDER, '#777');
  assert.equal(BEDROCK_SELECTED_BORDER, '#fff');
});

test('inventory has exactly the 11 item slots used by the game', () => {
  const style = buildInventoryStyle();
  assert.equal(INVENTORY_COLUMNS, 9);
  assert.equal(INVENTORY_ROWS, 2);
  assert.equal(INVENTORY_SLOT_COUNT, 11);
  assert.equal(style.display, 'grid');
  assert.equal(style.gridTemplateColumns, 'repeat(9, 50px)');
  assert.equal(style.gridTemplateRows, 'repeat(2, 50px)');
  assert.equal(style.gap, '0');
});

test('Bedrock slots use layered borders and a crisp selected state', () => {
  assert.equal(BEDROCK_SLOT_BORDER, '#555');
  assert.equal(BEDROCK_SLOT_LIGHT_BORDER, '#999');
  assert.equal(BEDROCK_SLOT_INNER_BORDER, '#111');
  assert.deepEqual(buildBedrockSlotStyle(false), {
    border: '2px solid #555',
    borderTopColor: '#999',
    borderLeftColor: '#999',
    borderRadius: '0',
    background: '#1f1f1f',
    boxShadow: 'inset 0 0 0 1px #111',
  });
  assert.deepEqual(buildBedrockSlotStyle(true), {
    border: '2px solid #fff',
    borderTopColor: '#fff',
    borderLeftColor: '#fff',
    borderRadius: '0',
    background: '#1f1f1f',
    boxShadow: 'inset 0 0 0 1px #fff, 0 0 0 2px #111',
  });
});
