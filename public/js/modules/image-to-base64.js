function formatBytes(b) {
  if (b < 1024) return b + ' B';
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB';
  return (b / (1024 * 1024)).toFixed(2) + ' MB';
}
function processFile(file) {
  if (!file || !file.type.startsWith('image/')) return;
  if (file.size > 10 * 1024 * 1024) return showToast(I18N.fileTooLarge || 'File exceeds 10 MB limit', 'error');
  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUri = e.target.result;
    const withoutPrefix = document.getElementById('withoutPrefix').checked;
    const output = withoutPrefix ? dataUri.split(',')[1] : dataUri;
    document.getElementById('outputText').value = output;
    document.getElementById('imagePreview').src = dataUri;
    document.getElementById('previewBox').classList.remove('hidden');
    document.getElementById('fileSizeInfo').textContent = I18N.fileSizeLabel + ': ' + formatBytes(file.size);
    document.getElementById('outputSizeInfo').textContent = I18N.outputSizeLabel + ': ' + formatBytes(output.length);
  };
  reader.readAsDataURL(file);
}
document.addEventListener('DOMContentLoaded', () => {
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  dropZone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => processFile(e.target.files[0]));
  dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('border-indigo-500'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('border-indigo-500'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('border-indigo-500');
    processFile(e.dataTransfer.files[0]);
  });
  document.getElementById('withoutPrefix').addEventListener('change', () => {
    const output = document.getElementById('outputText').value;
    if (!output) return;
    const withoutPrefix = document.getElementById('withoutPrefix').checked;
    const src = document.getElementById('imagePreview').src;
    if (withoutPrefix) {
      document.getElementById('outputText').value = src.split(',')[1] || output;
    } else {
      const wasStripped = !output.startsWith('data:');
      if (wasStripped) document.getElementById('outputText').value = src;
    }
  });
  document.getElementById('btnCopy').addEventListener('click', () => {
    const val = document.getElementById('outputText').value;
    if (!val) return showToast(I18N.nothingToCopy, 'error');
    copyToClipboard(val);
    showToast(I18N.copied);
  });
});
