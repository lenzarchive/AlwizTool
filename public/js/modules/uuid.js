function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = crypto.getRandomValues(new Uint8Array(1))[0] & 15;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function renderUUIDs() {
  const count = Math.min(parseInt(document.getElementById('countInput').value) || 5, 100);
  const fmt = document.getElementById('formatSelect').value;
  const list = document.getElementById('uuidList');
  list.innerHTML = '';
  for (let i = 0; i < count; i++) {
    let uuid = generateUUID();
    if (fmt === 'uppercase') uuid = uuid.toUpperCase();
    else if (fmt === 'noHyphen') uuid = uuid.replace(/-/g, '');
    const row = document.createElement('div');
    row.className = 'flex items-center justify-between gap-3 p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group';
    const span = document.createElement('span');
    span.className = 'font-mono text-sm text-slate-800 dark:text-slate-200 select-all';
    span.textContent = uuid;
    const btn = document.createElement('button');
    btn.className = 'copy-btn opacity-0 group-hover:opacity-100 transition-opacity shrink-0';
    btn.textContent = 'Copy';
    btn.addEventListener('click', () => { copyToClipboard(uuid); showToast('UUID ' + (I18N.copied || 'Copied!')); });
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
    showToast(spans.length + ' UUID ' + ((I18N && I18N.copied) || 'Copied!'));
  });
  renderUUIDs();
});
