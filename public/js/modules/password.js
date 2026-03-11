const CHARS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  ambiguous: '0Ol1I'
};
const WORDS = ['apple','bridge','cloud','dance','earth','flame','grace','house','ivory','jewel','knife','lemon','mango','night','ocean','piano','quest','river','stone','tiger','ultra','vapor','water','xenon','yacht','zebra','amber','brave','coral','dream','eagle','frost','globe','heart','input','joker','karma','light','magic','noble','olive','pearl','queen','radar','silver','torch','unity','voice','wheat','index','young','above','below','chair','drive','enter','float','great','hotel','inner','juice','kings','laugh','mercy','north','outer','price','quota','raise','south','track','upset','valid','waste','xerox','yield','zones','alert','bench','clear','delta','event','field','grant','hurry','image','joint','knock','layer','metal','nerve','orbit','plant','quick','reach','sharp','table','ultra','value','watch','extra','yearl','zipper','actor','baker','chess','depot','eager','facet','group','hinge','infer','judge','kiosk','lunar','micro','nanny','optic','proxy','quake','range','serve','title','urban','venus','woven','axiom','blaze','candy','decay','elite','fairy','grasp','hedge','intro','jazzy','kluge','lance','march','nexus','oxide','pixel','quart','relay','solar','tempo','under','vista','windy','oxide','brave','craft','draft','elite','final','grade','happy','irony','joust','lunar','mauve','nurse','other','power','query','rocky','stoic','triad','unite','vault','world','xenon','young','zeros','album','black','civic','dunno','earns','faint','gavel','haste','ideal','jelly','krill','lower','mount','novel','opine','plumb','quiet','rainy','spare','theta','uncle','uvula','viola','wring','xylem','yodel','zonal'];
function secureRandomIndex(max) {
  const limit = Math.floor(0x100000000 / max) * max;
  let n;
  do {
    [n] = crypto.getRandomValues(new Uint32Array(1));
  } while (n >= limit);
  return n % max;
}
function generatePassword(len, opts) {
  let charset = '';
  if (opts.upper) charset += CHARS.upper;
  if (opts.lower) charset += CHARS.lower;
  if (opts.numbers) charset += CHARS.numbers;
  if (opts.symbols) charset += CHARS.symbols;
  if (opts.excAmbiguous) charset = [...charset].filter(c => !CHARS.ambiguous.includes(c)).join('');
  if (!charset) return '';
  return Array.from({ length: len }, () => charset[secureRandomIndex(charset.length)]).join('');
}
function generatePassphrase(wordCount, separator) {
  return Array.from({ length: wordCount }, () => WORDS[secureRandomIndex(WORDS.length)]).join(separator);
}
function getStrength(pw) {
  let s = 0;
  if (pw.length >= 12) s++; if (pw.length >= 16) s++;
  if (/[A-Z]/.test(pw)) s++; if (/[a-z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++; if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (pw.includes(' ') || pw.includes('-') || pw.includes('.')) s++;
  if (s <= 2) return { label: (I18N && I18N.weak) || 'Weak', color: 'bg-red-500', pct: 25 };
  if (s <= 4) return { label: (I18N && I18N.medium) || 'Medium', color: 'bg-yellow-500', pct: 60 };
  return { label: (I18N && I18N.strong) || 'Strong', color: 'bg-green-500', pct: 100 };
}
function isPassphrase() {
  return document.querySelector('input[name="pwMode"]:checked')?.value === 'passphrase';
}
function generatePasswords() {
  const count = Math.min(parseInt(document.getElementById('pwCount').value) || 5, 50);
  let passwords;
  if (isPassphrase()) {
    const wordCount = parseInt(document.getElementById('wordCountRange').value) || 4;
    const sep = document.getElementById('separatorSelect').value;
    passwords = Array.from({ length: count }, () => generatePassphrase(wordCount, sep));
  } else {
    const len = parseInt(document.getElementById('lengthRange').value);
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
    passwords = Array.from({ length: count }, () => generatePassword(len, opts));
  }
  const list = document.getElementById('passwordList');
  list.innerHTML = '';
  passwords.forEach(pw => {
    const row = document.createElement('div');
    row.className = 'flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg group';
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
    fill.className = 'h-full rounded-full transition-all duration-500 ' + st.color;
    fill.style.width = st.pct + '%';
  }
}
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('lengthRange').addEventListener('input', () => {
    document.getElementById('lengthVal').textContent = document.getElementById('lengthRange').value;
  });
  document.getElementById('wordCountRange').addEventListener('input', () => {
    document.getElementById('wordCountVal').textContent = document.getElementById('wordCountRange').value;
  });
  document.querySelectorAll('input[name="pwMode"]').forEach(r => {
    r.addEventListener('change', () => {
      const isPass = r.value === 'passphrase';
      document.getElementById('randomOptions').classList.toggle('hidden', isPass);
      document.getElementById('passphraseOptions').classList.toggle('hidden', !isPass);
    });
  });
  document.getElementById('btnGenerate').addEventListener('click', generatePasswords);
  document.getElementById('btnCopyAll').addEventListener('click', () => {
    const spans = document.querySelectorAll('#passwordList span.font-mono');
    if (!spans.length) return showToast((I18N && I18N.generateFirst) || 'Generate first!', 'error');
    copyToClipboard([...spans].map(s => s.textContent).join('\n'));
    showToast((I18N && I18N.copied) || 'Copied!');
  });
  generatePasswords();
});
