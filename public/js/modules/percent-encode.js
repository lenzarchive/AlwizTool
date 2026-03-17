document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('inputText');
  const output = document.getElementById('outputText');
  const modeSelect = document.getElementById('modeSelect');

  function encode() {
    const text = input.value;
    if (!text) { output.value = ''; return; }
    const mode = modeSelect.value;
    let result;
    if (mode === 'full') {
      result = encodeURIComponent(text);
    } else if (mode === 'component') {
      result = encodeURIComponent(text).replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase());
    } else {
      result = encodeURI(text);
    }
    output.value = result;
  }

  function decode() {
    const text = input.value;
    if (!text) { output.value = ''; return; }
    try {
      output.value = decodeURIComponent(text.replace(/\+/g, ' '));
    } catch (e) {
      showToast((I18N.errInvalid || 'Invalid encoding') + ': ' + e.message, 'error');
    }
  }

  document.getElementById('btnEncode').addEventListener('click', encode);
  document.getElementById('btnDecode').addEventListener('click', decode);
  document.getElementById('btnClear').addEventListener('click', () => { input.value = ''; output.value = ''; });
  document.getElementById('btnCopy').addEventListener('click', () => {
    if (!output.value) return showToast(I18N.nothingToCopy || 'Nothing to copy', 'error');
    copyToClipboard(output.value);
    showToast(I18N.copied || 'Copied!');
  });
  input.addEventListener('input', () => {
    if (output.value) encode();
  });
});
