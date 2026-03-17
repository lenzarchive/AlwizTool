const DEFAULT_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
const ALPHABETS = {
  default: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-',
  alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  lowercase: 'abcdefghijklmnopqrstuvwxyz0123456789',
  numbers: '0123456789',
  hex: '0123456789abcdef',
};

function nanoId(size, alphabet) {
  const arr = new Uint8Array(size * 2);
  crypto.getRandomValues(arr);
  let id = '';
  for (let i = 0; i < arr.length && id.length < size; i++) {
    const idx = arr[i] % alphabet.length;
    id += alphabet[idx];
  }
  return id;
}

document.addEventListener('DOMContentLoaded', () => {
  const sizeInput = document.getElementById('sizeInput');
  const countInput = document.getElementById('countInput');
  const alphabetSelect = document.getElementById('alphabetSelect');
  const customAlphabet = document.getElementById('customAlphabet');
  const outputText = document.getElementById('outputText');
  const charCount = document.getElementById('charCount');

  function getAlphabet() {
    const sel = alphabetSelect.value;
    if (sel === 'custom') return customAlphabet.value || DEFAULT_ALPHABET;
    return ALPHABETS[sel] || DEFAULT_ALPHABET;
  }

  function updateCharCount() {
    const a = getAlphabet();
    const unique = [...new Set(a)];
    charCount.textContent = unique.length + ' ' + (I18N.uniqueChars || 'unique chars');
  }

  alphabetSelect.addEventListener('change', () => {
    customAlphabet.classList.toggle('hidden', alphabetSelect.value !== 'custom');
    updateCharCount();
  });

  customAlphabet.addEventListener('input', updateCharCount);
  updateCharCount();

  document.getElementById('btnGenerate').addEventListener('click', () => {
    const size = Math.max(1, Math.min(512, parseInt(sizeInput.value) || 21));
    const count = Math.max(1, Math.min(100, parseInt(countInput.value) || 1));
    const alphabet = getAlphabet();
    if (alphabet.length < 2) return showToast(I18N.errAlphabet || 'Alphabet too short', 'error');
    const ids = [];
    for (let i = 0; i < count; i++) ids.push(nanoId(size, alphabet));
    outputText.value = ids.join('\n');
  });

  document.getElementById('btnCopy').addEventListener('click', () => {
    if (!outputText.value) return showToast(I18N.nothingToCopy || 'Nothing to copy', 'error');
    copyToClipboard(outputText.value);
    showToast(I18N.copied || 'Copied!');
  });

  document.getElementById('btnClear').addEventListener('click', () => { outputText.value = ''; });

  // Generate on load
  document.getElementById('btnGenerate').click();
});
