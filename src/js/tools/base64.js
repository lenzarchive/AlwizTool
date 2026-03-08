function encodeBase64(str) {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch {
    return btoa(str);
  }
}

function decodeBase64(str) {
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch {
    try {
      return atob(str);
    } catch {
      throw new Error('Input bukan Base64 yang valid');
    }
  }
}

function encodeFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result.split(',')[1]);
    reader.onerror = () => reject(new Error('Gagal membaca file'));
    reader.readAsDataURL(file);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const inputEl = document.getElementById('input-text');
  const outputEl = document.getElementById('output-text');
  const outputInfo = document.getElementById('output-info');
  const outputLength = document.getElementById('output-length');
  const fileInput = document.getElementById('file-input');

  function setOutput(value) {
    outputEl.value = value;
    if (outputLength) outputLength.textContent = value.length.toLocaleString();
    if (outputInfo) outputInfo.classList.toggle('hidden', !value);
  }

  document.getElementById('btn-encode')?.addEventListener('click', () => {
    const input = inputEl.value;
    if (!input) { Toast.show('Input tidak boleh kosong', 'warning'); return; }
    try {
      setOutput(encodeBase64(input));
    } catch (e) {
      Toast.show(e.message, 'error');
    }
  });

  document.getElementById('btn-decode')?.addEventListener('click', () => {
    const input = inputEl.value.trim();
    if (!input) { Toast.show('Input tidak boleh kosong', 'warning'); return; }
    try {
      setOutput(decodeBase64(input));
    } catch (e) {
      Toast.show(e.message, 'error');
    }
  });

  document.getElementById('btn-copy')?.addEventListener('click', () => {
    const text = outputEl.value;
    if (!text) { Toast.show('Tidak ada output', 'warning'); return; }
    copyToClipboard(text);
  });

  document.getElementById('btn-swap')?.addEventListener('click', () => {
    const temp = inputEl.value;
    inputEl.value = outputEl.value;
    setOutput(temp);
  });

  document.getElementById('clear-input')?.addEventListener('click', () => {
    inputEl.value = '';
    setOutput('');
  });

  fileInput?.addEventListener('change', async () => {
    const file = fileInput.files[0];
    if (!file) return;
    try {
      const b64 = await encodeFileToBase64(file);
      const prefix = `data:${file.type};base64,`;
      inputEl.value = `${prefix}${b64}`;
      setOutput(b64);
      Toast.show(`File "${file.name}" di-encode`, 'success');
    } catch (e) {
      Toast.show(e.message, 'error');
    }
    fileInput.value = '';
  });
});
