const CHARS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789', symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?', ambiguous: '0Ol1I'
};

function generatePassword(len, opts) {
  let charset = '';
  if (opts.upper) charset += CHARS.upper;
  if (opts.lower) charset += CHARS.lower;
  if (opts.numbers) charset += CHARS.numbers;
  if (opts.symbols) charset += CHARS.symbols;
  if (opts.excAmbiguous) charset = [...charset].filter(c => !CHARS.ambiguous.includes(c)).join('');
  if (!charset) return '';
  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);
  return Array.from(arr, n => charset[n % charset.length]).join('');
}

function getStrength(pw) {
  let s = 0;
  if (pw.length >= 12) s++; if (pw.length >= 16) s++;
  if (/[A-Z]/.test(pw)) s++; if (/[a-z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++; if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (s <= 2) return { label: (I18N && I18N.weak) || 'Weak', color: 'bg-red-500', pct: 25 };
  if (s <= 4) return { label: (I18N && I18N.medium) || 'Medium', color: 'bg-yellow-500', pct: 60 };
  return { label: (I18N && I18N.strong) || 'Strong', color: 'bg-green-500', pct: 100 };
}

function generatePasswords() {
  const len = parseInt(document.getElementById('lengthRange').value);
  const count = Math.min(parseInt(document.getElementById('pwCount').value) || 1, 50);
  const opts = {
    upper: document.getElementById('incUppercase').checked,
    lower: document.getElementById('incLowercase').checked,
    numbers: document.getElementById('incNumbers').checked,
    symbols: document.getElementById('incSymbols').checked,
    excAmbiguous: document.getElementById('excAmbiguous').checked,
  };
  if (!opts.upper && !opts.lower && !opts.numbers && !opts.symbols) {
    return showToast((I18N && I18N.pickOne) || 'Pick at least one type', 'error');
  }
  const passwords = Array.from({ length: count }, () => generatePassword(len, opts));
  const list = document.getElementById('passwordList');
  list.innerHTML = '';
  passwords.forEach(pw => {
    const row = document.createElement('div');
    row.className = 'flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg group';
    const span = document.createElement('span');
    span.className = 'font-mono text-sm text-slate-800 dark:text-slate-200 flex-1 break-all select-all';
    span.textContent = pw;
    const btn = document.createElement('button');
    btn.className = 'copy-btn shrink-0';
    btn.textContent = 'Copy';
    btn.addEventListener('click', () => { copyToClipboard(pw); showToast((I18N && I18N.copied) || 'Copied!'); });
    row.append(span, btn);
    list.appendChild(row);
  });
  if (passwords.length > 0) {
    const st = getStrength(passwords[0]);
    document.getElementById('strengthBar').classList.remove('hidden');
    document.getElementById('strengthLabel').textContent = st.label;
    const fill = document.getElementById('strengthFill');
    fill.className = 'h-full rounded-full transition-all duration-300 ' + st.color;
    fill.style.width = st.pct + '%';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const range = document.getElementById('lengthRange');
  range.addEventListener('input', () => { document.getElementById('lengthVal').textContent = range.value; });
  document.getElementById('btnGenerate').addEventListener('click', generatePasswords);
  document.getElementById('btnCopyAll').addEventListener('click', () => {
    const spans = document.querySelectorAll('#passwordList span.font-mono');
    if (!spans.length) return showToast((I18N && I18N.generateFirst) || 'Generate first!', 'error');
    copyToClipboard([...spans].map(s => s.textContent).join('\n'));
    showToast((I18N && I18N.copied) || 'Copied!');
  });
  generatePasswords();
});
