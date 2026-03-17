const CHAR_MAP = {
  'à':'a','á':'a','â':'a','ã':'a','ä':'a','å':'a','æ':'ae',
  'ç':'c','è':'e','é':'e','ê':'e','ë':'e',
  'ì':'i','í':'i','î':'i','ï':'i',
  'ð':'d','ñ':'n','ò':'o','ó':'o','ô':'o','õ':'o','ö':'o','ø':'o',
  'ù':'u','ú':'u','û':'u','ü':'u','ý':'y','þ':'th','ÿ':'y',
  'À':'a','Á':'a','Â':'a','Ã':'a','Ä':'a','Å':'a','Æ':'ae',
  'Ç':'c','È':'e','É':'e','Ê':'e','Ë':'e',
  'Ì':'i','Í':'i','Î':'i','Ï':'i',
  'Ð':'d','Ñ':'n','Ò':'o','Ó':'o','Ô':'o','Õ':'o','Ö':'o','Ø':'o',
  'Ù':'u','Ú':'u','Û':'u','Ü':'u','Ý':'y','Þ':'th',
  '&':'and','@':'at','%':'pct','#':'hash','+':'plus',
};

function toSlug(text, separator, lowercase) {
  let s = text;
  // Replace known chars
  s = s.replace(/[^\u0000-\u007E]/g, c => CHAR_MAP[c] || '-');
  // Replace special chars
  s = s.replace(/[&@%#+]/g, c => CHAR_MAP[c] || c);
  // Remove anything non-alphanumeric (except separator placeholder)
  s = s.replace(/[^a-zA-Z0-9\s-]/g, '');
  // Replace spaces and hyphens with separator
  s = s.replace(/[\s-]+/g, separator || '-');
  // Trim
  s = s.replace(new RegExp('^[' + (separator||'-') + ']+|[' + (separator||'-') + ']+$', 'g'), '');
  if (lowercase !== false) s = s.toLowerCase();
  return s;
}

document.addEventListener('DOMContentLoaded', () => {
  const inputText = document.getElementById('inputText');
  const outputText = document.getElementById('outputText');
  const separatorSelect = document.getElementById('separatorSelect');
  const lowercaseCheck = document.getElementById('lowercaseCheck');
  const charCount = document.getElementById('charCount');
  const wordCount = document.getElementById('wordCount');

  function update() {
    const sep = separatorSelect.value;
    const lower = lowercaseCheck.checked;
    const slug = toSlug(inputText.value, sep, lower);
    outputText.value = slug;
    charCount.textContent = slug.length + ' chars';
    wordCount.textContent = slug ? slug.split(sep).filter(Boolean).length + ' parts' : '0 parts';
  }

  inputText.addEventListener('input', update);
  separatorSelect.addEventListener('change', update);
  lowercaseCheck.addEventListener('change', update);

  document.getElementById('btnCopy').addEventListener('click', () => {
    if (!outputText.value) return showToast(I18N.nothingToCopy || 'Nothing to copy', 'error');
    copyToClipboard(outputText.value);
    showToast(I18N.copied || 'Copied!');
  });

  document.getElementById('btnClear').addEventListener('click', () => {
    inputText.value = ''; outputText.value = '';
    charCount.textContent = ''; wordCount.textContent = '';
  });
});
