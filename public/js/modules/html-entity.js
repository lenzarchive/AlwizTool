const NAMED_MAP = {
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  '©': '&copy;', '®': '&reg;', '™': '&trade;', '€': '&euro;', '£': '&pound;',
  '¥': '&yen;', '°': '&deg;', '±': '&plusmn;', '×': '&times;', '÷': '&divide;',
  '¼': '&frac14;', '½': '&frac12;', '¾': '&frac34;', '…': '&hellip;',
  '—': '&mdash;', '–': '&ndash;', '"': '&ldquo;', '"': '&rdquo;',
  '\u00a0': '&nbsp;', '¡': '&iexcl;', '¿': '&iquest;'
};
const NAMED_REVERSE = Object.fromEntries(Object.entries(NAMED_MAP).map(([k,v]) => [v, k]));
function encodeHtml(text, fmt) {
  const chars = Object.keys(NAMED_MAP);
  return text.split('').map(ch => {
    if (!chars.includes(ch) && ch.charCodeAt(0) < 128) return ch;
    const code = ch.charCodeAt(0);
    if (fmt === 'named' && NAMED_MAP[ch]) return NAMED_MAP[ch];
    if (fmt === 'decimal') return `&#${code};`;
    if (fmt === 'hex') return `&#x${code.toString(16).toUpperCase()};`;
    return NAMED_MAP[ch] || ch;
  }).join('');
}
function decodeHtml(text) {
  return text
    .replace(/&[a-zA-Z]+;/g, m => NAMED_REVERSE[m] || m)
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
}
function convert() {
  const input = document.getElementById('inputText').value;
  const mode = document.getElementById('modeSelect').value;
  const fmt = document.getElementById('formatSelect').value;
  document.getElementById('outputText').value = mode === 'encode' ? encodeHtml(input, fmt) : decodeHtml(input);
}
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('inputText').addEventListener('input', convert);
  document.getElementById('modeSelect').addEventListener('change', convert);
  document.getElementById('formatSelect').addEventListener('change', convert);
  document.getElementById('btnConvert').addEventListener('click', convert);
  document.getElementById('btnClear').addEventListener('click', () => {
    document.getElementById('inputText').value = '';
    document.getElementById('outputText').value = '';
  });
  document.getElementById('btnSwap').addEventListener('click', () => {
    const i = document.getElementById('inputText');
    const o = document.getElementById('outputText');
    [i.value, o.value] = [o.value, i.value];
  });
  document.getElementById('btnCopy').addEventListener('click', () => {
    const val = document.getElementById('outputText').value;
    if (!val) return showToast(I18N.nothingToCopy, 'error');
    copyToClipboard(val);
    showToast(I18N.copied);
  });
});
