function updateStats() {
  const text = document.getElementById('inputText').value;
  document.getElementById('statChars').textContent = text.length;
  document.getElementById('statNoSpace').textContent = text.replace(/\s/g, '').length;
  document.getElementById('statWords').textContent = text.trim() ? text.trim().split(/\s+/).length : 0;
  document.getElementById('statLines').textContent = text ? text.split('\n').length : 0;
  const sentences = text.trim() ? (text.match(/[.!?]+/g) || []).length || 1 : 0;
  document.getElementById('statSentences').textContent = sentences;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const readMins = Math.max(1, Math.ceil(words / 200));
  document.getElementById('statReadTime').textContent = words > 0 ? readMins : 0;
}
function transformText(action) {
  const ta = document.getElementById('inputText');
  let t = ta.value;
  switch (action) {
    case 'toUpper': t = t.toUpperCase(); break;
    case 'toLower': t = t.toLowerCase(); break;
    case 'toTitle': t = t.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()); break;
    case 'toSentence': t = t.charAt(0).toUpperCase() + t.slice(1).toLowerCase(); break;
    case 'toCamel':
      t = t.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (m, i) => i === 0 ? m.toLowerCase() : m.toUpperCase()).replace(/\s+/g, '');
      break;
    case 'toSnake': t = t.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''); break;
    case 'toKebab': t = t.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''); break;
    case 'toPascal': t = t.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, m => m.toUpperCase()).replace(/\s+/g, ''); break;
    case 'trimText': t = t.trim(); break;
    case 'removeExtraSpaces': t = t.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim(); break;
    case 'reverseText': t = t.split('').reverse().join(''); break;
    case 'removeDuplicateLines': t = [...new Set(t.split('\n'))].join('\n'); break;
    case 'sortLines': t = t.split('\n').sort((a, b) => a.localeCompare(b)).join('\n'); break;
    case 'addLineNumbers': t = t.split('\n').map((l, i) => (i + 1).toString().padStart(3, ' ') + '  ' + l).join('\n'); break;
    case 'rot13': t = t.replace(/[a-zA-Z]/g, c => String.fromCharCode(c.charCodeAt(0) + (c.toLowerCase() < 'n' ? 13 : -13))); break;
    case 'toSlug': t = t.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-'); break;
  }
  ta.value = t;
  updateStats();
}
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('inputText').addEventListener('input', updateStats);
  document.querySelectorAll('.text-action-btn').forEach(btn => {
    btn.addEventListener('click', () => transformText(btn.dataset.action));
  });
  document.getElementById('btnCopyText').addEventListener('click', () => {
    const val = document.getElementById('inputText').value;
    if (!val) return showToast((I18N && I18N.noText) || 'No text', 'error');
    copyToClipboard(val);
    showToast((I18N && I18N.copied) || 'Copied!');
  });
  document.getElementById('btnClearText').addEventListener('click', () => {
    document.getElementById('inputText').value = '';
    updateStats();
  });
  updateStats();
});
