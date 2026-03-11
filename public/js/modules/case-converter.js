function toWords(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')   
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/[-_./\\]/g, ' ')             
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .split(' ')
    .filter(Boolean);
}
const converters = {
  camelCase:     w => w.map((word, i) => i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)).join(''),
  pascalCase:    w => w.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(''),
  snakeCase:     w => w.join('_'),
  kebabCase:     w => w.join('-'),
  screamingSnake:w => w.join('_').toUpperCase(),
  dotCase:       w => w.join('.'),
  titleCase:     w => w.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
  sentenceCase:  w => { const j = w.join(' '); return j.charAt(0).toUpperCase() + j.slice(1); },
  lowerCase:     w => w.join(' ').toLowerCase(),
  upperCase:     w => w.join(' ').toUpperCase(),
};
function convertAll() {
  const input = document.getElementById('inputText').value;
  const words = toWords(input);
  if (!input.trim()) {
    Object.keys(converters).forEach(k => {
      const el = document.getElementById('case-' + k);
      if (el) el.value = '';
    });
    return;
  }
  Object.entries(converters).forEach(([key, fn]) => {
    const el = document.getElementById('case-' + key);
    if (el) el.value = fn(words);
  });
}
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('inputText').addEventListener('input', convertAll);
  document.getElementById('btnClear').addEventListener('click', () => {
    document.getElementById('inputText').value = '';
    convertAll();
  });
  document.querySelectorAll('.copy-case-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = document.getElementById(btn.dataset.id).value;
      if (!val || val === '—') return showToast(I18N.nothingToCopy, 'error');
      copyToClipboard(val);
      showToast(I18N.copied);
    });
  });
});
