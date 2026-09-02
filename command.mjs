export function executeCommand(input) {
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
  if (command === 'setblock') return parts.length >= 4 ? `Setblock: ${parts[3]} at ${parts.slice(0, 3).join(' ')}` : 'Usage: /setblock <x> <y> <z> <block>';
  return `Unknown command: /${command}`;
}
