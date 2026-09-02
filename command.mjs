export function executeCommand(input, context = {}) {
  const text = String(input ?? '').trim();
  if (!text.startsWith('/')) return text;
  const parts = text.slice(1).split(/\s+/).filter(Boolean);
  const command = (parts.shift() || '').toLowerCase();
  if (command === 'help') return 'Commands: /help, /time, /gamemode, /give, /tp, /setblock';
  if (command === 'time') return `Time: ${new Date().toLocaleTimeString()}`;
  if (command === 'gamemode') {
    const mode = (parts[0] || 'survival').toLowerCase();
    return mode === 'creative' || mode === 'survival' ? `Gamemode: ${mode}` : 'Usage: /gamemode survival|creative';
  }
  if (command === 'give') return parts[0] ? `Gave: ${parts[0]}` : 'Usage: /give <item>';
  if (command === 'tp') return parts.length >= 3 ? `Teleport: ${parts.slice(0, 3).join(' ')}` : 'Usage: /tp <x> <y> <z>';
  if (command === 'setblock') {
    if (parts.length < 4) return 'Usage: /setblock <x> <y> <z> <block>';
    const [xText, yText, zText, type] = parts;
    const x = Number(xText), y = Number(yText), z = Number(zText);
    if (![x, y, z].every(Number.isInteger)) return 'Usage: /setblock <x> <y> <z> <block>';
    if (typeof context.hasBlockType === 'function' && !context.hasBlockType(type)) return `Unknown block: ${type}`;
    if (typeof context.setBlock === 'function') context.setBlock(x, y, z, type);
    return `Setblock: ${type} at ${x} ${y} ${z}`;
  }
  return `Unknown command: /${command}`;
}
