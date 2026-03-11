function getMode() {
  const r = document.querySelector('input[name="modeSelect"]:checked');
  return r ? r.value : 'component';
}
function encodeRFC3986(str) {
  return encodeURIComponent(str)
    .replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase());
}
function doEncode() {
  const input = document.getElementById('inputText').value;
  const errEl = document.getElementById('errorMsg');
  errEl.classList.add('hidden');
  try {
    const mode = getMode();
    let result;
    if (mode === 'component') result = encodeURIComponent(input);
    else if (mode === 'full') result = encodeURI(input);
    else if (mode === 'double') result = encodeURIComponent(encodeURIComponent(input));
    else if (mode === 'rfc') result = encodeRFC3986(input);
    document.getElementById('outputText').value = result;
  } catch (e) {
    errEl.textContent = e.message;
    errEl.classList.remove('hidden');
  }
}
function doDecode() {
  const input = document.getElementById('inputText').value.trim();
  const errEl = document.getElementById('errorMsg');
  errEl.classList.add('hidden');
  try {
    const mode = getMode();
    let result;
    if (mode === 'double') result = decodeURIComponent(decodeURIComponent(input));
    else result = decodeURIComponent(input);
    document.getElementById('outputText').value = result;
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
  document.getElementById('btnCopy').addEventListener('click', () => {
    const val = document.getElementById('outputText').value;
    if (!val) return showToast((I18N && I18N.nothingToCopy) || 'Nothing to copy', 'error');
    copyToClipboard(val);
    showToast((I18N && I18N.copied) || 'Copied!');
  });
  document.getElementById('btnSwap').addEventListener('click', () => {
    const i = document.getElementById('inputText');
    const o = document.getElementById('outputText');
    const tmp = i.value; i.value = o.value; o.value = tmp;
    document.getElementById('errorMsg').classList.add('hidden');
  });
});
