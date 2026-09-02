import { toggleF3, formatF3Debug } from './f3-debug.mjs';

export function createF3MenuText({ fps = 0, x = 0, y = 0, z = 0, facing = 'unknown', block = 'none' } = {}) {
  return [
    'Minecraft-like Debug',
    formatF3Debug({ fps, x, y, z, facing, block }),
    'Controls: Arrow keys · Shift · Space',
    'F3: Hide debug'
  ].join('\n');
}

const overlay = document.createElement('pre');
overlay.id = 'f3Debug';
overlay.setAttribute('aria-label', 'F3 debug menu');
overlay.style.cssText = [
  'position:fixed', 'left:10px', 'top:10px', 'margin:0', 'padding:10px 12px',
  'color:#fff', 'background:rgba(0,0,0,.82)', 'border:1px solid #777',
  'font:13px/1.45 monospace', 'z-index:2147483647', 'pointer-events:none',
  'display:none', 'white-space:pre', 'text-shadow:1px 1px #000'
].join(';');
document.body.appendChild(overlay);

let visible = false;
let frames = 0;
let last = performance.now();
let fps = 0;

window.addEventListener('keydown', event => {
  if (event.code !== 'F3' || event.repeat) return;
  event.preventDefault();
  event.stopPropagation();
  visible = toggleF3(visible);
  overlay.style.display = visible ? 'block' : 'none';
  if (visible) updateText();
}, true);

function updateText() {
  const debug = globalThis.gameDebugContext || {};
  overlay.textContent = createF3MenuText({
    fps,
    x: Number(debug.x) || 0,
    y: Number(debug.y) || 0,
    z: Number(debug.z) || 0,
    facing: debug.facing || 'unknown',
    block: debug.block || 'none'
  });
}

function update() {
  const now = performance.now();
  frames++;
  if (now - last >= 500) {
    fps = frames * 1000 / (now - last);
    frames = 0;
    last = now;
  }
  if (visible) updateText();
  requestAnimationFrame(update);
}
update();
