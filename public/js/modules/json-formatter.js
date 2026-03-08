function setStatus(msg, ok) {
  const el = document.getElementById('statusMsg');
  el.textContent = msg;
  el.className = 'text-xs font-medium ' + (ok ? 'text-green-600 dark:text-green-400' : 'text-red-500');
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnFormat').addEventListener('click', () => {
    const input = document.getElementById('inputText').value.trim();
    if (!input) return;
    try {
      const indent = document.getElementById('indentSelect').value;
      document.getElementById('outputText').value = JSON.stringify(JSON.parse(input), null, indent === 'tab' ? '\t' : parseInt(indent));
      setStatus((I18N && I18N.valid) || '✓ Valid', true);
    } catch (e) { setStatus(((I18N && I18N.invalid) || '✗') + ': ' + e.message, false); }
  });

  document.getElementById('btnMinify').addEventListener('click', () => {
    const input = document.getElementById('inputText').value.trim();
    if (!input) return;
    try {
      const result = JSON.stringify(JSON.parse(input));
      document.getElementById('outputText').value = result;
      setStatus(((I18N && I18N.minified) || '✓ Minified') + ' (' + result.length + ' chars)', true);
    } catch (e) { setStatus(((I18N && I18N.invalid) || '✗') + ': ' + e.message, false); }
  });

  document.getElementById('btnValidate').addEventListener('click', () => {
    const input = document.getElementById('inputText').value.trim();
    if (!input) return;
    try { JSON.parse(input); setStatus((I18N && I18N.valid) || '✓ Valid!', true); }
    catch (e) { setStatus(((I18N && I18N.invalid) || '✗') + ': ' + e.message, false); }
  });

  document.getElementById('btnClear').addEventListener('click', () => {
    document.getElementById('inputText').value = '';
    document.getElementById('outputText').value = '';
    document.getElementById('statusMsg').textContent = '';
  });

  document.getElementById('btnCopy').addEventListener('click', () => {
    const val = document.getElementById('outputText').value;
    if (!val) return showToast((I18N && I18N.nothingToCopy) || 'Nothing to copy', 'error');
    copyToClipboard(val); showToast((I18N && I18N.copied) || 'Copied!');
  });
});
