export const HOTBAR_SIZE = 9;
export const HOTBAR_GAP = 0;
export const HOTBAR_SLOT_SIZE = 50;
export const INVENTORY_HOTBAR_GAP = 0;
export const INVENTORY_COLUMNS = 9;
export const INVENTORY_ROWS = 2;
export const INVENTORY_SLOT_COUNT = 11;

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
