document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  if (path.includes('url-encode') || path.includes('html-entities')) {
    let mode = path.includes('html-entities') ? 'html' : 'url';
    const inputEl = document.getElementById('url-input') || document.getElementById('html-input');
    const outputEl = document.getElementById('url-output') || document.getElementById('html-output');

    function urlEncode(str) { return encodeURIComponent(str); }
    function urlDecode(str) { return decodeURIComponent(str); }
    function htmlEncode(str) {
      const el = document.createElement('div');
      el.appendChild(document.createTextNode(str));
      return el.innerHTML;
    }
    function htmlDecode(str) {
      const el = document.createElement('div');
      el.innerHTML = str;
      return el.textContent || '';
    }

    document.getElementById('mode-url')?.addEventListener('click', () => { mode = 'url'; });
    document.getElementById('mode-html')?.addEventListener('click', () => { mode = 'html'; });

    document.getElementById('btn-encode')?.addEventListener('click', () => {
      const input = inputEl?.value;
      if (!input) { Toast.show('Input kosong', 'warning'); return; }
      try {
        outputEl.value = mode === 'html' ? htmlEncode(input) : urlEncode(input);
      } catch (e) { Toast.show(e.message, 'error'); }
    });

    document.getElementById('btn-decode')?.addEventListener('click', () => {
      const input = inputEl?.value;
      if (!input) { Toast.show('Input kosong', 'warning'); return; }
      try {
        outputEl.value = mode === 'html' ? htmlDecode(input) : urlDecode(input);
      } catch (e) { Toast.show('Decode gagal: ' + e.message, 'error'); }
    });

    document.getElementById('btn-clear')?.addEventListener('click', () => {
      if (inputEl) inputEl.value = '';
      if (outputEl) outputEl.value = '';
    });

    document.getElementById('btn-copy')?.addEventListener('click', () => {
      if (!outputEl?.value) { Toast.show('Tidak ada output', 'warning'); return; }
      copyToClipboard(outputEl.value);
    });
  }

  if (path.includes('timestamp')) {
    function updateNow() {
      const now = new Date();
      const nowUnix = document.getElementById('now-unix');
      const nowLocal = document.getElementById('now-local');
      const nowUtc = document.getElementById('now-utc');
      if (nowUnix) nowUnix.textContent = Math.floor(now.getTime() / 1000);
      if (nowLocal) nowLocal.textContent = now.toLocaleString('id-ID');
      if (nowUtc) nowUtc.textContent = now.toUTCString();
    }
    updateNow();
    setInterval(updateNow, 1000);
    document.getElementById('btn-refresh')?.addEventListener('click', updateNow);

    document.getElementById('btn-ts-convert')?.addEventListener('click', () => {
      const raw = document.getElementById('ts-input')?.value?.trim();
      if (!raw) { Toast.show('Masukkan timestamp', 'warning'); return; }
      let ts = parseInt(raw);
      if (raw.length === 13) ts = Math.floor(ts / 1000);
      const d = new Date(ts * 1000);
      if (isNaN(d.getTime())) { Toast.show('Timestamp tidak valid', 'error'); return; }
      const result = document.getElementById('ts-result');
      result?.classList.remove('hidden');
      const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
      setEl('ts-local', d.toLocaleString('id-ID'));
      setEl('ts-utc', d.toUTCString());
      setEl('ts-iso', d.toISOString());
      const diff = Math.floor((Date.now() / 1000) - ts);
      const abs = Math.abs(diff);
      let rel;
      if (abs < 60) rel = `${abs} detik ${diff > 0 ? 'lalu' : 'dari sekarang'}`;
      else if (abs < 3600) rel = `${Math.floor(abs / 60)} menit ${diff > 0 ? 'lalu' : 'dari sekarang'}`;
      else if (abs < 86400) rel = `${Math.floor(abs / 3600)} jam ${diff > 0 ? 'lalu' : 'dari sekarang'}`;
      else rel = `${Math.floor(abs / 86400)} hari ${diff > 0 ? 'lalu' : 'dari sekarang'}`;
      setEl('ts-relative', rel);
    });

    document.getElementById('btn-date-convert')?.addEventListener('click', () => {
      const val = document.getElementById('date-input')?.value;
      if (!val) { Toast.show('Pilih tanggal & waktu', 'warning'); return; }
      const d = new Date(val);
      if (isNaN(d.getTime())) { Toast.show('Tanggal tidak valid', 'error'); return; }
      const result = document.getElementById('date-result');
      result?.classList.remove('hidden');
      const setEl = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
      setEl('date-unix', Math.floor(d.getTime() / 1000));
      setEl('date-unix-ms', d.getTime());
      setEl('date-iso', d.toISOString());
    });
  }

  if (path.includes('color')) {
    function hexToRgb(hex) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    }

    function rgbToHex(r, g, b) {
      return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('');
    }

    function rgbToHsl(r, g, b) {
      r /= 255; g /= 255; b /= 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;
      if (max === min) { h = s = 0; }
      else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
          case g: h = ((b - r) / d + 2) / 6; break;
          case b: h = ((r - g) / d + 4) / 6; break;
        }
      }
      return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    }

    function hslToRgb(h, s, l) {
      h /= 360; s /= 100; l /= 100;
      let r, g, b;
      if (s === 0) { r = g = b = l; }
      else {
        const hue2rgb = (p, q, t) => {
          if (t < 0) t += 1; if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
      }
      return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
    }

    function rgbToCmyk(r, g, b) {
      r /= 255; g /= 255; b /= 255;
      const k = 1 - Math.max(r, g, b);
      if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
      return {
        c: Math.round((1 - r - k) / (1 - k) * 100),
        m: Math.round((1 - g - k) / (1 - k) * 100),
        y: Math.round((1 - b - k) / (1 - k) * 100),
        k: Math.round(k * 100),
      };
    }

    function updateAll(hex) {
      const isValidHex = /^#[0-9A-Fa-f]{6}$/.test(hex);
      if (!isValidHex) return;
      const { r, g, b } = hexToRgb(hex);
      const hsl = rgbToHsl(r, g, b);
      const cmyk = rgbToCmyk(r, g, b);

      const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
      set('hex-input', hex);
      set('rgb-r', r); set('rgb-g', g); set('rgb-b', b);
      set('hsl-h', hsl.h); set('hsl-s', hsl.s); set('hsl-l', hsl.l);

      const preview = document.getElementById('color-preview');
      const picker = document.getElementById('color-picker');
      if (preview) preview.style.background = hex;
      if (picker) picker.value = hex;

      const setFmt = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
      setFmt('fmt-hex', hex.toUpperCase());
      setFmt('fmt-rgb', `rgb(${r}, ${g}, ${b})`);
      setFmt('fmt-hsl', `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);
      setFmt('fmt-cmyk', `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`);
      setFmt('fmt-css-var', `--color: ${hex};`);

      const shadesGrid = document.getElementById('shades-grid');
      if (shadesGrid) {
        shadesGrid.innerHTML = Array.from({ length: 10 }, (_, i) => {
          const l = Math.round(10 + (i * 8));
          return `<div style="background:hsl(${hsl.h},${hsl.s}%,${l}%)" title="hsl(${hsl.h},${hsl.s}%,${l}%)"></div>`;
        }).join('');
      }
    }

    const picker = document.getElementById('color-picker');
    const hexInput = document.getElementById('hex-input');
    picker?.addEventListener('input', e => updateAll(e.target.value));
    hexInput?.addEventListener('input', e => {
      if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) updateAll(e.target.value);
    });

    ['rgb-r', 'rgb-g', 'rgb-b'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', () => {
        const r = parseInt(document.getElementById('rgb-r')?.value || 0);
        const g = parseInt(document.getElementById('rgb-g')?.value || 0);
        const b = parseInt(document.getElementById('rgb-b')?.value || 0);
        updateAll(rgbToHex(r, g, b));
      });
    });

    ['hsl-h', 'hsl-s', 'hsl-l'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', () => {
        const h = parseInt(document.getElementById('hsl-h')?.value || 0);
        const s = parseInt(document.getElementById('hsl-s')?.value || 0);
        const l = parseInt(document.getElementById('hsl-l')?.value || 0);
        const { r, g, b } = hslToRgb(h, s, l);
        updateAll(rgbToHex(r, g, b));
      });
    });

    document.querySelectorAll('.copy-fmt').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        if (target) copyToClipboard(target.textContent);
      });
    });

    updateAll('#22D3EE');
  }
});
