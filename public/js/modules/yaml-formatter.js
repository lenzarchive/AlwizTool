// js-yaml loaded via CDN in the view
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('inputText');
  const output = document.getElementById('outputText');
  const statusMsg = document.getElementById('statusMsg');
  const modeSelect = document.getElementById('modeSelect');

  function setStatus(msg, type) {
    statusMsg.className = 'text-xs font-medium flex items-center gap-1.5';
    if (type === 'success') {
      statusMsg.innerHTML = '<svg class="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg><span class="text-green-600 dark:text-green-400">' + msg + '</span>';
    } else {
      statusMsg.innerHTML = '<svg class="w-3.5 h-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg><span class="text-red-600 dark:text-red-400">' + msg + '</span>';
    }
  }

  document.getElementById('btnFormat').addEventListener('click', () => {
    const text = input.value.trim();
    if (!text) return;
    const mode = modeSelect.value;
    try {
      const parsed = jsyaml.load(text);
      if (mode === 'yaml') {
        output.value = jsyaml.dump(parsed, { indent: 2, lineWidth: -1 });
        setStatus(I18N.validMsg || 'Valid YAML', 'success');
      } else {
        output.value = JSON.stringify(parsed, null, 2);
        setStatus(I18N.convertedJson || 'Converted to JSON', 'success');
      }
    } catch(e) {
      setStatus((I18N.invalidMsg || 'Invalid YAML') + ': ' + e.message, 'error');
    }
  });

  document.getElementById('btnFromJson').addEventListener('click', () => {
    const text = input.value.trim();
    if (!text) return;
    try {
      const parsed = JSON.parse(text);
      output.value = jsyaml.dump(parsed, { indent: 2, lineWidth: -1 });
      setStatus(I18N.convertedYaml || 'Converted to YAML', 'success');
    } catch(e) {
      setStatus((I18N.invalidJson || 'Invalid JSON') + ': ' + e.message, 'error');
    }
  });

  document.getElementById('btnValidate').addEventListener('click', () => {
    const text = input.value.trim();
    if (!text) return;
    try {
      jsyaml.load(text);
      setStatus(I18N.validMsg || 'Valid YAML', 'success');
    } catch(e) {
      setStatus((I18N.invalidMsg || 'Invalid YAML') + ': ' + e.message, 'error');
    }
  });

  document.getElementById('btnClear').addEventListener('click', () => {
    input.value = ''; output.value = ''; statusMsg.innerHTML = '';
  });

  document.getElementById('btnCopy').addEventListener('click', () => {
    if (!output.value) return showToast(I18N.nothingToCopy || 'Nothing to copy', 'error');
    copyToClipboard(output.value);
    showToast(I18N.copied || 'Copied!');
  });
});
