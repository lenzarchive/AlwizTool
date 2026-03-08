function hexToRgb(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16)
  };
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h;
  const s = max === 0 ? 0 : d / max, v = max;
  if (max === min) { h = 0; } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
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

function updateAll(hex) {
  const { r, g, b } = hexToRgb(hex);
  const hsl = rgbToHsl(r, g, b);
  const hsv = rgbToHsv(r, g, b);
  const cmyk = rgbToCmyk(r, g, b);
  document.getElementById('rgbOutput').value = `rgb(${r}, ${g}, ${b})`;
  document.getElementById('rgbaOutput').value = `rgba(${r}, ${g}, ${b}, 1)`;
  document.getElementById('hslOutput').value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  document.getElementById('hslaOutput').value = `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1)`;
  document.getElementById('hsvOutput').value = `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`;
  document.getElementById('cmykOutput').value = `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
  document.getElementById('colorPreview').style.backgroundColor = hex;
}

document.addEventListener('DOMContentLoaded', () => {
  const picker = document.getElementById('colorPicker');
  const hexInput = document.getElementById('hexInput');

  picker.addEventListener('input', () => {
    hexInput.value = picker.value;
    updateAll(picker.value);
  });

  hexInput.addEventListener('input', () => {
    let val = hexInput.value.trim();
    if (!val.startsWith('#')) val = '#' + val;
    if (/^#[0-9a-fA-F]{6}$/.test(val)) {
      picker.value = val;
      updateAll(val);
    }
  });

  document.querySelectorAll('.copy-color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = document.getElementById(btn.dataset.source).value;
      if (!val) return;
      copyToClipboard(val);
      showToast(i18nColor.copied);
    });
  });

  updateAll('#4f46e5');
});
