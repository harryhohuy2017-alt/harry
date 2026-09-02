export const HOTBAR_SIZE = 9;
export const HOTBAR_GAP = 0;
export const HOTBAR_SLOT_SIZE = 50;
export const INVENTORY_HOTBAR_GAP = 0;
export const INVENTORY_COLUMNS = 9;
export const INVENTORY_ROWS = 2;
export const INVENTORY_SLOT_COUNT = 11;

export const BEDROCK_PANEL_BACKGROUND = '#313131';
export const BEDROCK_SLOT_BACKGROUND = '#1f1f1f';
export const BEDROCK_PANEL_BORDER = '#777';
export const BEDROCK_SELECTED_BORDER = '#fff';
export const BEDROCK_SLOT_BORDER = '#555';
export const BEDROCK_SLOT_LIGHT_BORDER = '#999';
export const BEDROCK_SLOT_INNER_BORDER = '#111';

export function normalizeHotbarIndex(number) {
  return Math.max(0, Math.min(HOTBAR_SIZE - 1, Math.floor(number) - 1));
}

export function slotLabel(index) {
  return String(index + 1);
}

export function buildHotbarStyle() {
  return {
    gap: String(HOTBAR_GAP),
    borderRadius: '0',
    display: 'grid',
    gridTemplateColumns: `repeat(${HOTBAR_SIZE}, ${HOTBAR_SLOT_SIZE}px)`,
  };
}

export function buildInventoryStyle() {
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${INVENTORY_COLUMNS}, ${HOTBAR_SLOT_SIZE}px)`,
    gridTemplateRows: `repeat(${INVENTORY_ROWS}, ${HOTBAR_SLOT_SIZE}px)`,
    gap: String(INVENTORY_HOTBAR_GAP),
  };
}

export function buildBedrockSlotStyle(selected = false) {
  return {
    border: selected ? `2px solid ${BEDROCK_SELECTED_BORDER}` : `2px solid ${BEDROCK_SLOT_BORDER}`,
    borderTopColor: selected ? BEDROCK_SELECTED_BORDER : BEDROCK_SLOT_LIGHT_BORDER,
    borderLeftColor: selected ? BEDROCK_SELECTED_BORDER : BEDROCK_SLOT_LIGHT_BORDER,
    borderRadius: '0',
    background: BEDROCK_SLOT_BACKGROUND,
    boxShadow: selected
      ? `inset 0 0 0 1px ${BEDROCK_SELECTED_BORDER}, 0 0 0 2px ${BEDROCK_SLOT_INNER_BORDER}`
      : `inset 0 0 0 1px ${BEDROCK_SLOT_INNER_BORDER}`,
  };
}
