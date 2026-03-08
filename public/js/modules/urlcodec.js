document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnEncode').addEventListener('click', () => {
    const input = document.getElementById('inputText').value;
    const mode = document.getElementById('modeSelect').value;
    const errEl = document.getElementById('errorMsg');
    errEl.classList.add('hidden');
    try {
      document.getElementById('outputText').value = mode === 'full' ? encodeURI(input) : encodeURIComponent(input);
    } catch (e) {
      errEl.textContent = e.message; errEl.classList.remove('hidden');
    }
  });

  document.getElementById('btnDecode').addEventListener('click', () => {
    const input = document.getElementById('inputText').value;
    const mode = document.getElementById('modeSelect').value;
    const errEl = document.getElementById('errorMsg');
    errEl.classList.add('hidden');
    try {
      document.getElementById('outputText').value = mode === 'full' ? decodeURI(input) : decodeURIComponent(input);
    } catch (e) {
      errEl.textContent = (window.I18N && I18N.decodeFail) || 'Invalid input.';
      errEl.classList.remove('hidden');
    }
  });

  document.getElementById('btnClear').addEventListener('click', () => {
    document.getElementById('inputText').value = '';
    document.getElementById('outputText').value = '';
    document.getElementById('errorMsg').classList.add('hidden');
  });

  document.getElementById('btnCopy').addEventListener('click', () => {
    const val = document.getElementById('outputText').value;
    if (!val) return showToast((window.I18N && I18N.nothingToCopy) || 'Nothing to copy', 'error');
    copyToClipboard(val); showToast((window.I18N && I18N.copied) || 'Copied!');
  });

  document.getElementById('btnSwap').addEventListener('click', () => {
    const i = document.getElementById('inputText'), o = document.getElementById('outputText');
    const tmp = i.value; i.value = o.value; o.value = tmp;
  });
});
