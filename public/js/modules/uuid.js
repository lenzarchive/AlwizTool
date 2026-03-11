function generateUUID() {
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, x => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`;
}
function formatUUID(uuid, fmt) {
  if (fmt === 'uppercase') return uuid.toUpperCase();
  if (fmt === 'noHyphen') return uuid.replace(/-/g, '');
  if (fmt === 'braces') return '{' + uuid + '}';
  return uuid;
}
function renderUUIDs() {
  const count = Math.min(parseInt(document.getElementById('countInput').value) || 10, 100);
  const fmt = document.getElementById('formatSelect').value;
  const list = document.getElementById('uuidList');
  list.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const uuid = formatUUID(generateUUID(), fmt);
    const row = document.createElement('div');
    row.className = 'flex items-center justify-between gap-3 px-3 py-2 bg-slate-50 dark:bg-slate-800/70 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-colors group cursor-default';
    const span = document.createElement('span');
    span.className = 'font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-200 select-all flex-1';
    span.textContent = uuid;
    const btn = document.createElement('button');
    btn.className = 'copy-btn opacity-0 group-hover:opacity-100 transition-opacity shrink-0';
    btn.textContent = 'Copy';
    btn.addEventListener('click', () => { copyToClipboard(uuid); showToast((I18N.copied || 'Copied!')); });
    row.append(span, btn);
    list.appendChild(row);
  }
}
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnGenerate').addEventListener('click', renderUUIDs);
  document.getElementById('btnCopyAll').addEventListener('click', () => {
    const spans = document.querySelectorAll('#uuidList span.font-mono');
    if (!spans.length) return showToast((I18N && I18N.generateFirst) || 'Generate first!', 'error');
    copyToClipboard([...spans].map(s => s.textContent).join('\n'));
    showToast(spans.length + ' UUIDs — ' + ((I18N && I18N.copied) || 'Copied!'));
  });
  document.getElementById('formatSelect').addEventListener('change', renderUUIDs);
  renderUUIDs();
});
