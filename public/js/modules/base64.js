function getInputMode()   { return document.getElementById('encodingMode').value; }
function getOutputFormat(){ return document.getElementById('outputFormat').value; }
function applyOutputFormat(b64) {
  const fmt = getOutputFormat();
  if (fmt === 'nopad') {
    return b64.replace(/=+$/, '');
  }
  if (fmt === 'urlsafe') {
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  if (fmt === 'mime') {
    return b64.match(/.{1,76}/g).join('\r\n');
  }
  return b64; 
}
function normaliseBase64(s) {
  s = s.replace(/\s/g, '');
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  const rem = s.length % 4;
  if (rem === 2) s += '==';
  else if (rem === 3) s += '=';
  return s;
}
function encodeInput(text) {
  const mode = getInputMode();
  if (mode === 'utf8') {
    const bytes = new TextEncoder().encode(text);
    const bin = Array.from(bytes, b => String.fromCharCode(b)).join('');
    return btoa(bin);
  }
  if (mode === 'latin1') {
    for (let i = 0; i < text.length; i++) {
      if (text.charCodeAt(i) > 255)
        throw new Error('Character "' + text[i] + '" (U+' + text.charCodeAt(i).toString(16).toUpperCase() + ') is out of Latin-1 range (0–255).');
    }
    return btoa(text);
  }
  if (mode === 'hex') {
    const clean = text.replace(/[\s:]/g, '');
    if (clean.length % 2 !== 0) throw new Error('Hex string must have an even number of digits.');
    if (!/^[0-9a-fA-F]*$/.test(clean)) throw new Error('Invalid hex string — only 0-9 and a-f allowed.');
    const bin = clean.match(/.{2}/g).map(b => String.fromCharCode(parseInt(b, 16))).join('');
    return btoa(bin);
  }
  if (mode === 'binary') {
    const clean = text.replace(/\s/g, '');
    if (!/^[01]*$/.test(clean)) throw new Error('Binary string must contain only 0 and 1.');
    if (clean.length % 8 !== 0) throw new Error('Binary string length must be a multiple of 8.');
    const bin = clean.match(/.{8}/g).map(b => String.fromCharCode(parseInt(b, 2))).join('');
    return btoa(bin);
  }
  if (mode === 'utf16le' || mode === 'utf16be') {
    const le = mode === 'utf16le';
    const bytes = [];
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      if (le) { bytes.push(code & 0xff, (code >> 8) & 0xff); }
      else     { bytes.push((code >> 8) & 0xff, code & 0xff); }
    }
    const bin = bytes.map(b => String.fromCharCode(b)).join('');
    return btoa(bin);
  }
  throw new Error('Unknown encoding mode: ' + mode);
}
function decodeInput(raw) {
  const mode  = getInputMode();
  const b64   = normaliseBase64(raw);
  let bin;
  try { bin = atob(b64); }
  catch(e) { throw new Error('Input is not valid Base64. (' + e.message + ')'); }
  const bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
  if (mode === 'utf8') {
    try {
      return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    } catch(e) {
      throw new Error('Byte sequence is not valid UTF-8. Try Latin-1 mode if the data uses a single-byte encoding.');
    }
  }
  if (mode === 'latin1') {
    return Array.from(bytes, b => String.fromCharCode(b)).join('');
  }
  if (mode === 'hex') {
    return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join(' ');
  }
  if (mode === 'binary') {
    return Array.from(bytes, b => b.toString(2).padStart(8, '0')).join(' ');
  }
  if (mode === 'utf16le' || mode === 'utf16be') {
    if (bytes.length % 2 !== 0) throw new Error('Byte count must be even for UTF-16 decoding.');
    const le = mode === 'utf16le';
    let result = '';
    for (let i = 0; i < bytes.length; i += 2) {
      const code = le
        ? bytes[i] | (bytes[i + 1] << 8)
        : (bytes[i] << 8) | bytes[i + 1];
      result += String.fromCharCode(code);
    }
    return result;
  }
  throw new Error('Unknown encoding mode: ' + mode);
}
function setError(msg) {
  const e = document.getElementById('errorMsg');
  e.textContent = msg;
  e.classList.remove('hidden');
}
function clearError() {
  document.getElementById('errorMsg').classList.add('hidden');
}
function setStat(msg) {
  const s = document.getElementById('statBar');
  s.textContent = msg;
  s.classList.remove('hidden');
}
function clearStat() {
  document.getElementById('statBar').classList.add('hidden');
}
function doEncode() {
  const input = document.getElementById('inputText').value;
  clearError(); clearStat();
  try {
    const raw = encodeInput(input);
    const out = applyOutputFormat(raw);
    document.getElementById('outputText').value = out;
    setStat(out.replace(/\s/g,'').length + ' chars output · ' + input.length + ' chars input');
  } catch(e) {
    setError(e.message);
  }
}
function doDecode() {
  const input = document.getElementById('inputText').value.trim();
  clearError(); clearStat();
  try {
    const out = decodeInput(input);
    document.getElementById('outputText').value = out;
    setStat(out.length + ' chars decoded from ' + input.replace(/\s/g,'').length + ' chars Base64');
  } catch(e) {
    setError(e.message);
  }
}
function showModeHint() {
  const hint = document.getElementById('modeHint');
  const hintText = document.getElementById('modeHintText');
  const hasOutput = document.getElementById('outputText').value;
  if (hasOutput) {
    hintText.textContent = (window.I18N && I18N.modeChanged) || 'Mode changed — press Encode or Decode to re-run.';
    hint.classList.remove('hidden');
  }
}
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnEncode').addEventListener('click', () => {
    document.getElementById('modeHint').classList.add('hidden');
    doEncode();
  });
  document.getElementById('btnDecode').addEventListener('click', () => {
    document.getElementById('modeHint').classList.add('hidden');
    doDecode();
  });
  document.getElementById('btnClear').addEventListener('click', () => {
    document.getElementById('inputText').value  = '';
    document.getElementById('outputText').value = '';
    document.getElementById('modeHint').classList.add('hidden');
    clearError(); clearStat();
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
    const tmp = i.value;
    i.value = o.value;
    o.value = tmp;
    document.getElementById('modeHint').classList.add('hidden');
    clearError(); clearStat();
  });
  document.getElementById('encodingMode').addEventListener('change', showModeHint);
  document.getElementById('outputFormat').addEventListener('change', () => {
    const out = document.getElementById('outputText').value;
    if (out) showModeHint();
  });
});
