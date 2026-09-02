export const HOTBAR_SIZE = 9;
export const HOTBAR_GAP = 0;
export const HOTBAR_SLOT_SIZE = 50;
export const INVENTORY_HOTBAR_GAP = 0;

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
