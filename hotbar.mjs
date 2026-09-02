export function normalizeHotbarIndex(number) {
  return Math.max(0, Math.min(19, Math.floor(number) - 1));
}

export function slotLabel(index) {
  return String(index + 1);
}
