function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const n = parseInt(hex, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
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
function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h;
  const s = max === 0 ? 0 : d / max;
  const v = max;
  if (d === 0) { h = 0; }
  else {
    switch (max) {
      case r: h = ((g - b) / d % 6) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
}
function rgbToCmyk(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const k = 1 - Math.max(r, g, b);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: Math.round((1 - r - k) / (1 - k) * 100),
    m: Math.round((1 - g - k) / (1 - k) * 100),
    y: Math.round((1 - b - k) / (1 - k) * 100),
    k: Math.round(k * 100)
  };
}
function updateFromHex(hex) {
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return;
  const { r, g, b } = hexToRgb(hex);
  const hsl = rgbToHsl(r, g, b);
  const hsv = rgbToHsv(r, g, b);
  const cmyk = rgbToCmyk(r, g, b);
  document.getElementById('colorPicker').value = hex;
  document.getElementById('colorPreview').style.backgroundColor = hex;
  document.getElementById('rgbOutput').value = `rgb(${r}, ${g}, ${b})`;
  document.getElementById('rgbaOutput').value = `rgba(${r}, ${g}, ${b}, 1)`;
  document.getElementById('hslOutput').value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  document.getElementById('hslaOutput').value = `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1)`;
  document.getElementById('hsvOutput').value = `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`;
  document.getElementById('cmykOutput').value = `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
}
document.addEventListener('DOMContentLoaded', () => {
  const picker = document.getElementById('colorPicker');
  const hexInput = document.getElementById('hexInput');
  picker.addEventListener('input', e => {
    hexInput.value = e.target.value;
    updateFromHex(e.target.value);
  });
  hexInput.addEventListener('input', e => {
    let v = e.target.value.trim();
    if (!v.startsWith('#')) v = '#' + v;
    e.target.value = v;
    updateFromHex(v);
  });
  document.querySelectorAll('.copy-color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = document.getElementById(btn.dataset.source).value;
      if (!val) return;
      copyToClipboard(val);
      showToast((I18N && I18N.copied) || 'Copied!');
    });
  });
  updateFromHex('#4f46e5');
});
