export const HOTBAR_SIZE = 9;

export function normalizeHotbarIndex(number) {
  return Math.max(0, Math.min(HOTBAR_SIZE - 1, Math.floor(number) - 1));
}

export function slotLabel(index) {
  return String(index + 1);
}
