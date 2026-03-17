document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('inputText');
  const output = document.getElementById('outputText');
  const modeSelect = document.getElementById('modeSelect');
  const separatorSelect = document.getElementById('separatorSelect');
  const uppercaseCheck = document.getElementById('uppercaseCheck');

  function encode() {
    const text = input.value;
    if (!text) { output.value = ''; return; }
    const sep = separatorSelect.value;
    let result = Array.from(new TextEncoder().encode(text))
      .map(b => b.toString(16).padStart(2, '0'))
      .join(sep);
    if (uppercaseCheck.checked) result = result.toUpperCase();
    output.value = result;
  }

  function decode() {
    let text = input.value.trim();
    if (!text) { output.value = ''; return; }
    try {
      text = text.replace(/[^0-9a-fA-F]/g, '');
      if (text.length % 2 !== 0) throw new Error(I18N.errOddLength || 'Odd-length hex string');
      const bytes = [];
      for (let i = 0; i < text.length; i += 2) {
        bytes.push(parseInt(text.slice(i, i + 2), 16));
      }
      output.value = new TextDecoder().decode(new Uint8Array(bytes));
    } catch (e) {
      output.value = '';
      showToast((I18N.errInvalid || 'Invalid hex') + ': ' + e.message, 'error');
    }
  }

  document.getElementById('btnEncode').addEventListener('click', () => {
    modeSelect.value = 'encode';
    encode();
  });
  document.getElementById('btnDecode').addEventListener('click', () => {
    modeSelect.value = 'decode';
    decode();
  });
  document.getElementById('btnClear').addEventListener('click', () => {
    input.value = ''; output.value = '';
  });
  document.getElementById('btnCopy').addEventListener('click', () => {
    if (!output.value) return showToast(I18N.nothingToCopy || 'Nothing to copy', 'error');
    copyToClipboard(output.value);
    showToast(I18N.copied || 'Copied!');
  });
});
