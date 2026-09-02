export function shouldHandleGameKey(event) {
  const tag = String(event?.target?.tagName || '').toUpperCase();
  return tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT';
}
