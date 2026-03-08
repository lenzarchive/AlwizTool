const LOREM_WORDS = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'perspiciatis', 'unde', 'omnis', 'iste', 'natus', 'error', 'voluptatem', 'accusantium', 'doloremque', 'laudantium', 'totam', 'rem', 'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo', 'inventore', 'veritatis'];

function randomWord() {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
}

function generateLoremWords(count, startWithLorem = true) {
  const words = [];
  for (let i = 0; i < count; i++) {
    words.push(startWithLorem && i === 0 ? 'Lorem' : startWithLorem && i === 1 ? 'ipsum' : randomWord());
  }
  return words.join(' ');
}

function generateLoremSentence(startWithLorem = false) {
  const wordCount = Math.floor(Math.random() * 10) + 8;
  const words = [];
  for (let i = 0; i < wordCount; i++) {
    words.push(i === 0 && startWithLorem ? 'Lorem' : i === 1 && startWithLorem ? 'ipsum' : randomWord());
  }
  return words.join(' ').replace(/^\w/, c => c.toUpperCase()) + '.';
}

function generateLoremParagraph(startWithLorem = false) {
  const sentenceCount = Math.floor(Math.random() * 4) + 4;
  const sentences = [];
  for (let i = 0; i < sentenceCount; i++) {
    sentences.push(generateLoremSentence(i === 0 && startWithLorem));
  }
  return sentences.join(' ');
}

function generatePassword(length, opts) {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const ambiguous = /[0Ol1I]/g;

  let charset = '';
  if (opts.upper) charset += upper;
  if (opts.lower) charset += lower;
  if (opts.numbers) charset += numbers;
  if (opts.symbols) charset += symbols;
  if (opts.excludeAmbiguous) charset = charset.replace(ambiguous, '');
  if (!charset) return '';

  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr, n => charset[n % charset.length]).join('');
}

function passwordStrength(pwd) {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (pwd.length >= 16) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 2) return { level: 'Lemah', color: 'bg-error', width: '25%' };
  if (score <= 4) return { level: 'Sedang', color: 'bg-warning', width: '50%' };
  if (score <= 5) return { level: 'Kuat', color: 'bg-success', width: '75%' };
  return { level: 'Sangat Kuat', color: 'bg-accent', width: '100%' };
}

function formatUUID(uuid, format) {
  switch (format) {
    case 'uppercase': return uuid.toUpperCase();
    case 'no-hyphen': return uuid.replace(/-/g, '');
    case 'braces': return `{${uuid}}`;
    default: return uuid;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  if (path.includes('password')) {
    const slider = document.getElementById('length-slider');
    const display = document.getElementById('length-display');
    const list = document.getElementById('password-list');
    const strengthSection = document.getElementById('strength-section');
    const strengthBar = document.getElementById('strength-bar');
    const strengthLabel = document.getElementById('strength-label');

    slider?.addEventListener('input', () => { if (display) display.textContent = slider.value; });

    document.getElementById('btn-generate')?.addEventListener('click', () => {
      const length = parseInt(slider?.value || 16);
      const count = parseInt(document.getElementById('count-input')?.value || 1);
      const opts = {
        upper: document.getElementById('use-upper')?.checked,
        lower: document.getElementById('use-lower')?.checked,
        numbers: document.getElementById('use-numbers')?.checked,
        symbols: document.getElementById('use-symbols')?.checked,
        excludeAmbiguous: document.getElementById('exclude-ambiguous')?.checked,
      };
      if (!opts.upper && !opts.lower && !opts.numbers && !opts.symbols) {
        Toast.show('Pilih minimal satu jenis karakter', 'warning');
        return;
      }
      const passwords = Array.from({ length: count }, () => generatePassword(length, opts));
      list.innerHTML = passwords.map((p, i) => `
        <div class="flex items-center gap-2 p-2.5 bg-surface border border-border rounded-lg group">
          <span class="text-xs text-muted w-4 shrink-0">${i + 1}</span>
          <code class="flex-1 font-mono text-sm text-primary break-all">${p}</code>
          <button class="btn-ghost text-xs py-0.5 px-2 opacity-0 group-hover:opacity-100 transition-opacity copy-pwd" data-pwd="${p}">Copy</button>
        </div>
      `).join('');
      if (passwords[0] && strengthSection && strengthBar && strengthLabel) {
        const s = passwordStrength(passwords[0]);
        strengthSection.classList.remove('hidden');
        strengthBar.className = `h-full rounded-full transition-all duration-500 ${s.color}`;
        strengthBar.style.width = s.width;
        strengthLabel.textContent = s.level;
        strengthLabel.className = `text-xs font-medium ${s.color.replace('bg-', 'text-')}`;
      }
      list.querySelectorAll('.copy-pwd').forEach(btn => {
        btn.addEventListener('click', () => copyToClipboard(btn.dataset.pwd));
      });
    });

    document.getElementById('btn-copy-all')?.addEventListener('click', () => {
      const items = [...list.querySelectorAll('code')].map(el => el.textContent).join('\n');
      if (!items) { Toast.show('Generate dulu', 'warning'); return; }
      copyToClipboard(items, 'Semua password disalin!');
    });
  }

  if (path.includes('uuid')) {
    document.getElementById('btn-generate')?.addEventListener('click', async () => {
      const count = parseInt(document.getElementById('uuid-count')?.value || 5);
      const format = document.getElementById('uuid-format')?.value || 'standard';
      const list = document.getElementById('uuid-list');
      if (!list) return;
      list.innerHTML = '<div class="text-sm text-muted">Generating...</div>';
      try {
        const res = await fetch(`/api/uuid?count=${count}`);
        const data = await res.json();
        list.innerHTML = data.uuids.map((u, i) => {
          const formatted = formatUUID(u, format);
          return `
            <div class="flex items-center gap-2 p-2 bg-surface border border-border rounded-lg group">
              <span class="text-xs text-muted w-4 shrink-0">${i + 1}</span>
              <code class="flex-1 font-mono text-sm text-accent break-all">${formatted}</code>
              <button class="btn-ghost text-xs py-0.5 px-2 opacity-0 group-hover:opacity-100 transition-opacity copy-uuid" data-uuid="${formatted}">Copy</button>
            </div>
          `;
        }).join('');
        list.querySelectorAll('.copy-uuid').forEach(btn => {
          btn.addEventListener('click', () => copyToClipboard(btn.dataset.uuid));
        });
      } catch {
        list.innerHTML = '<div class="text-sm text-error">Gagal generate UUID</div>';
      }
    });

    document.getElementById('btn-copy-all')?.addEventListener('click', () => {
      const items = [...document.querySelectorAll('.copy-uuid')].map(el => el.dataset.uuid).join('\n');
      if (!items) { Toast.show('Generate dulu', 'warning'); return; }
      copyToClipboard(items, 'Semua UUID disalin!');
    });
  }

  if (path.includes('lorem')) {
    function generate() {
      const type = document.getElementById('lorem-type')?.value || 'paragraphs';
      const count = parseInt(document.getElementById('lorem-count')?.value || 3);
      const startLorem = document.getElementById('start-lorem')?.checked;
      const htmlFormat = document.getElementById('html-format')?.checked;
      const output = document.getElementById('lorem-output');
      let result = '';
      if (type === 'words') {
        result = generateLoremWords(count, startLorem);
      } else if (type === 'sentences') {
        result = Array.from({ length: count }, (_, i) => generateLoremSentence(i === 0 && startLorem)).join(' ');
      } else {
        const paras = Array.from({ length: count }, (_, i) => generateLoremParagraph(i === 0 && startLorem));
        result = htmlFormat ? paras.map(p => `<p>${p}</p>`).join('\n\n') : paras.join('\n\n');
      }
      if (output) output.value = result;
    }

    document.getElementById('btn-generate')?.addEventListener('click', generate);
    document.getElementById('btn-copy')?.addEventListener('click', () => {
      const val = document.getElementById('lorem-output')?.value;
      if (!val) return;
      copyToClipboard(val);
    });
    generate();
  }

  if (path.includes('qr-code')) {
    document.getElementById('btn-generate')?.addEventListener('click', async () => {
      const text = document.getElementById('qr-input')?.value?.trim();
      const size = document.getElementById('qr-size')?.value || 300;
      const errorLevel = document.getElementById('qr-error')?.value || 'M';
      const placeholder = document.getElementById('qr-placeholder');
      const result = document.getElementById('qr-result');
      const loading = document.getElementById('qr-loading');
      const img = document.getElementById('qr-image');
      const dlBtn = document.getElementById('btn-download');
      if (!text) { Toast.show('Masukkan teks atau URL', 'warning'); return; }
      placeholder?.classList.add('hidden');
      result?.classList.add('hidden');
      loading?.classList.remove('hidden');
      try {
        const res = await fetch('/api/qrcode', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, size: parseInt(size), errorLevel }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        if (img) img.src = data.dataUrl;
        if (dlBtn) dlBtn.href = data.dataUrl;
        loading?.classList.add('hidden');
        result?.classList.remove('hidden');
      } catch (e) {
        loading?.classList.add('hidden');
        placeholder?.classList.remove('hidden');
        Toast.show(e.message || 'Gagal generate QR Code', 'error');
      }
    });
  }
});
