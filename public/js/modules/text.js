function analyzeText() {
  const text = document.getElementById('inputText').value;
  document.getElementById('statChars').textContent = text.length;
  document.getElementById('statNoSpace').textContent = text.replace(/\s/g, '').length;
  document.getElementById('statWords').textContent = text.trim() ? text.trim().split(/\s+/).length : 0;
  document.getElementById('statLines').textContent = text ? text.split('\n').length : 0;
}

function getEl() { return document.getElementById('inputText'); }
function setVal(v) { getEl().value = v; analyzeText(); }

const actions = {
  toUpper: () => setVal(getEl().value.toUpperCase()),
  toLower: () => setVal(getEl().value.toLowerCase()),
  toTitle: () => setVal(getEl().value.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase())),
  toSentence: () => setVal(getEl().value.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase())),
  toCamel: () => setVal(getEl().value.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())),
  toSnake: () => setVal(getEl().value.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '').toLowerCase()),
  toKebab: () => setVal(getEl().value.trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '').toLowerCase()),
  toPascal: () => setVal(getEl().value.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase()).replace(/\s+/g, '')),
  trimText: () => setVal(getEl().value.trim()),
  removeExtraSpaces: () => setVal(getEl().value.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n')),
  reverseText: () => setVal(getEl().value.split('').reverse().join('')),
  removeDuplicateLines: () => setVal([...new Set(getEl().value.split('\n'))].join('\n')),
  sortLines: () => setVal(getEl().value.split('\n').sort((a, b) => a.localeCompare(b)).join('\n')),
};

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('inputText').addEventListener('input', analyzeText);
  document.querySelectorAll('.text-action-btn').forEach(btn => {
    btn.addEventListener('click', () => { const fn = actions[btn.dataset.action]; if (fn) fn(); });
  });
  document.getElementById('btnCopyText').addEventListener('click', () => {
    const val = getEl().value;
    if (!val) return showToast((I18N && I18N.noText) || 'No text', 'error');
    copyToClipboard(val); showToast((I18N && I18N.copied) || 'Copied!');
  });
  document.getElementById('btnClearText').addEventListener('click', () => setVal(''));
});
