import { executeCommand } from './command.mjs';

export const CHAT_COMMANDS = ['/help', '/time', '/gamemode', '/give', '/tp', '/setblock'];

export function handleChatCommand(input) {
  const text = String(input ?? '').trim();
  if (!text) return '';
  return text.startsWith('/') ? executeCommand(text) : text;
}

export function shouldKeepKeyInChatInput(code) {
  return code !== 'Escape';
}

function initChat() {
  if (document.querySelector('#chat-ui')) return;
  const panel = document.createElement('div');
  panel.id = 'chat-ui';
  panel.style.cssText = 'position:fixed;left:50%;bottom:86px;transform:translateX(-50%);width:min(620px,calc(100vw - 28px));display:none;z-index:60;font-family:Arial,sans-serif;pointer-events:auto';
  const log = document.createElement('div');
  log.style.cssText = 'max-height:180px;overflow:auto;margin-bottom:6px;padding:8px;background:#101010dd;border:2px solid #777;color:#fff;font-size:14px;line-height:1.45;box-shadow:inset 0 0 0 2px #1b1b1b';
  const form = document.createElement('form');
  form.style.cssText = 'display:flex;gap:0';
  const input = document.createElement('input');
  input.type = 'text'; input.autocomplete = 'off'; input.placeholder = 'Press T to chat...';
  input.style.cssText = 'flex:1;min-width:0;padding:9px 10px;border:2px solid #777;border-right:0;border-radius:0;background:#1f1f1f;color:#fff;outline:none;font:14px Arial,sans-serif;box-sizing:border-box';
  const send = document.createElement('button');
  send.type = 'submit'; send.textContent = 'Send';
  send.style.cssText = 'padding:0 14px;border:2px solid #777;border-radius:0;background:#313131;color:#fff;font-weight:700;cursor:pointer';
  form.append(input, send); panel.append(log, form); document.body.appendChild(panel);
  let open = false;
  function addMessage(text) { const line=document.createElement('div'); line.textContent=text; log.appendChild(line); log.scrollTop=log.scrollHeight; }
  function setOpen(value) { open=value; panel.style.display=open?'block':'none'; if(open) input.focus(); }
  form.addEventListener('submit', event => {
    event.preventDefault();
    const text=input.value.trim();
    if(!text)return;
    addMessage(handleChatCommand(text));
    input.value='';
  });
  input.addEventListener('keydown', event => {
    if (event.code === 'Escape') {
      event.preventDefault();
      setOpen(false);
      return;
    }
    if (shouldKeepKeyInChatInput(event.code)) event.stopPropagation();
  });
  addEventListener('keydown', event => {
    if (event.code === 'KeyT' && !event.repeat && document.activeElement !== input) { event.preventDefault(); setOpen(true); return; }
    if (event.code === 'Escape' && open) { event.preventDefault(); setOpen(false); }
  });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initChat, { once: true });
  else initChat();
}
