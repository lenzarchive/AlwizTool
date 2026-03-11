function getIndent() {
  const v = document.getElementById('indentSelect').value;
  return v === 'tab' ? '\t' : parseInt(v);
}
function countKeys(obj) {
  let n = 0;
  if (Array.isArray(obj)) {
    obj.forEach(v => { n += countKeys(v); });
  } else if (typeof obj === 'object' && obj !== null) {
    n += Object.keys(obj).length;
    Object.values(obj).forEach(v => { n += countKeys(v); });
  }
  return n;
}
function sortObjectKeys(obj) {
  if (Array.isArray(obj)) return obj.map(sortObjectKeys);
  if (typeof obj === 'object' && obj !== null) {
    return Object.keys(obj).sort().reduce((acc, k) => {
      acc[k] = sortObjectKeys(obj[k]);
      return acc;
    }, {});
  }
  return obj;
}
function setStatus(msg, type) {
  const el = document.getElementById('statusMsg');
  el.className = 'text-xs font-medium flex items-center gap-1.5';
  if (type === 'success') {
    el.innerHTML = '<svg class="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg><span class="text-green-600 dark:text-green-400">' + msg + '</span>';
  } else {
    el.innerHTML = '<svg class="w-3.5 h-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg><span class="text-red-600 dark:text-red-400">' + msg + '</span>';
  }
}
function setStats(output, parsed) {
  const statsBar = document.getElementById('statsBar');
  const statChars = document.getElementById('statChars');
  const statKeys = document.getElementById('statKeys');
  statsBar.classList.remove('hidden');
  statChars.textContent = output.length + ' ' + ((I18N && I18N.chars) || 'chars');
  try {
    const keys = countKeys(parsed);
    if (keys > 0) statKeys.textContent = keys + ' ' + ((I18N && I18N.keys) || 'keys');
  } catch(e) {}
}
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnFormat').addEventListener('click', () => {
    try {
      const parsed = JSON.parse(document.getElementById('inputText').value);
      const out = JSON.stringify(parsed, null, getIndent());
      document.getElementById('outputText').value = out;
      setStatus((I18N && I18N.valid) || 'JSON is valid', 'success');
      setStats(out, parsed);
    } catch (e) {
      setStatus(((I18N && I18N.invalid) || 'Invalid JSON') + ': ' + e.message, 'error');
      document.getElementById('statsBar').classList.add('hidden');
    }
  });
  document.getElementById('btnMinify').addEventListener('click', () => {
    try {
      const parsed = JSON.parse(document.getElementById('inputText').value);
      const out = JSON.stringify(parsed);
      document.getElementById('outputText').value = out;
      setStatus((I18N && I18N.minified) || 'Minified', 'success');
      setStats(out, parsed);
    } catch (e) {
      setStatus(((I18N && I18N.invalid) || 'Invalid JSON') + ': ' + e.message, 'error');
    }
  });
  document.getElementById('btnValidate').addEventListener('click', () => {
    try {
      JSON.parse(document.getElementById('inputText').value);
      setStatus((I18N && I18N.valid) || 'JSON is valid', 'success');
    } catch (e) {
      setStatus(((I18N && I18N.invalid) || 'Invalid JSON') + ': ' + e.message, 'error');
    }
  });
  document.getElementById('btnSortKeys').addEventListener('click', () => {
    try {
      const parsed = JSON.parse(document.getElementById('inputText').value);
      const sorted = sortObjectKeys(parsed);
      const out = JSON.stringify(sorted, null, getIndent());
      document.getElementById('outputText').value = out;
      setStatus((I18N && I18N.valid) || 'Keys sorted', 'success');
      setStats(out, sorted);
    } catch (e) {
      setStatus(((I18N && I18N.invalid) || 'Invalid JSON') + ': ' + e.message, 'error');
    }
  });
  document.getElementById('btnClear').addEventListener('click', () => {
    document.getElementById('inputText').value = '';
    document.getElementById('outputText').value = '';
    document.getElementById('statusMsg').textContent = '';
    document.getElementById('statsBar').classList.add('hidden');
  });
  document.getElementById('btnCopy').addEventListener('click', () => {
    const val = document.getElementById('outputText').value;
    if (!val) return showToast((I18N && I18N.nothingToCopy) || 'Nothing to copy', 'error');
    copyToClipboard(val);
    showToast((I18N && I18N.copied) || 'Copied!');
  });
});
