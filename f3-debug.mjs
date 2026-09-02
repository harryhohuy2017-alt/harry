export function toggleF3(visible) {
  return !visible;
}

export function formatF3Debug({ fps = 0, x = 0, y = 0, z = 0, facing = 'unknown', block = 'none' } = {}) {
  return [
    `FPS: ${Math.round(fps)}`,
    `XYZ: ${Number(x).toFixed(2)} ${Number(y).toFixed(2)} ${Number(z).toFixed(2)}`,
    `Facing: ${facing}`,
    `Block: ${block}`,
  ].join('\n');
}
