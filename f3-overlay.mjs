import { toggleF3 } from './f3-debug.mjs';

const overlay = document.createElement('pre');
overlay.id = 'f3Debug';
overlay.style.cssText = 'position:fixed;left:10px;top:10px;margin:0;padding:8px 10px;color:#fff;background:#000b;font:13px monospace;line-height:1.4;z-index:100;pointer-events:none;display:none;white-space:pre;text-shadow:1px 1px #000';
document.body.appendChild(overlay);

let visible = false;
let frames = 0;
let last = performance.now();
let fps = 0;

addEventListener('keydown', event => {
  if (event.code !== 'F3' || event.repeat) return;
  event.preventDefault();
  visible = toggleF3(visible);
  overlay.style.display = visible ? 'block' : 'none';
});

function update() {
  const now = performance.now();
  frames++;
  if (now - last >= 500) {
    fps = frames * 1000 / (now - last);
    frames = 0;
    last = now;
  }
  if (visible) {
    overlay.textContent = [
      'Minecraft-like Debug',
      `FPS: ${Math.round(fps)}`,
      'XYZ: game coordinates',
      'Facing: camera direction',
      'Controls: Arrow keys · Shift · Space',
      'F3: Hide debug'
    ].join('\n');
  }
  requestAnimationFrame(update);
}
update();
