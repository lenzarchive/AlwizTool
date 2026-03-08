function doEncode() {
  const input = document.getElementById('inputText').value;
  const urlSafe = document.getElementById('urlSafe').checked;
  const errEl = document.getElementById('errorMsg');
  errEl.classList.add('hidden');
  try {
    let encoded = btoa(unescape(encodeURIComponent(input)));
    if (urlSafe) encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    document.getElementById('outputText').value = encoded;
  } catch (e) {
    errEl.textContent = e.message;
    errEl.classList.remove('hidden');
  }
}

function doDecode() {
  let input = document.getElementById('inputText').value.trim();
  const urlSafe = document.getElementById('urlSafe').checked;
  const errEl = document.getElementById('errorMsg');
  errEl.classList.add('hidden');
  try {
    if (urlSafe) {
      input = input.replace(/-/g, '+').replace(/_/g, '/');
      while (input.length % 4) input += '=';
    }
    document.getElementById('outputText').value = decodeURIComponent(escape(atob(input)));
  } catch (e) {
    errEl.textContent = (window.I18N && I18N.decodeFail) || 'Decode failed.';
    errEl.classList.remove('hidden');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnEncode').addEventListener('click', doEncode);
  document.getElementById('btnDecode').addEventListener('click', doDecode);
  document.getElementById('btnClear').addEventListener('click', () => {
    document.getElementById('inputText').value = '';
    document.getElementById('outputText').value = '';
    document.getElementById('errorMsg').classList.add('hidden');
  });
  document.getElementById('btnCopyOutput').addEventListener('click', () => {
    const val = document.getElementById('outputText').value;
    if (!val) return showToast((window.I18N && I18N.nothingToCopy) || 'Nothing to copy', 'error');
    copyToClipboard(val);
    showToast((window.I18N && I18N.copied) || 'Copied!');
  });
  document.getElementById('btnSwap').addEventListener('click', () => {
    const i = document.getElementById('inputText');
    const o = document.getElementById('outputText');
    const tmp = i.value; i.value = o.value; o.value = tmp;
  });
});
