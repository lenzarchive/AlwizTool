document.addEventListener('DOMContentLoaded', () => {
  const fields = ['title','description','keywords','author','robots','viewport','charset','themeColor','ogTitle','ogDesc','ogImage','ogUrl','ogType','twitterCard','twitterSite','twitterTitle','twitterDesc','twitterImage'];
  const outputText = document.getElementById('outputText');

  function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function generate() {
    const tags = [];
    const charset = getVal('charset') || 'UTF-8';
    tags.push('<meta charset="' + charset + '">');
    tags.push('<meta http-equiv="X-UA-Compatible" content="IE=edge">');

    const viewport = getVal('viewport') || 'width=device-width, initial-scale=1.0';
    tags.push('<meta name="viewport" content="' + viewport + '">');

    const title = getVal('title');
    if (title) tags.push('<title>' + title + '</title>');

    const desc = getVal('description');
    if (desc) tags.push('<meta name="description" content="' + desc + '">');

    const keywords = getVal('keywords');
    if (keywords) tags.push('<meta name="keywords" content="' + keywords + '">');

    const author = getVal('author');
    if (author) tags.push('<meta name="author" content="' + author + '">');

    const robots = getVal('robots');
    if (robots) tags.push('<meta name="robots" content="' + robots + '">');

    const theme = getVal('themeColor');
    if (theme) tags.push('<meta name="theme-color" content="' + theme + '">');

    // Open Graph
    const ogTitle = getVal('ogTitle') || title;
    const ogDesc = getVal('ogDesc') || desc;
    const ogImage = getVal('ogImage');
    const ogUrl = getVal('ogUrl');
    const ogType = getVal('ogType') || 'website';
    if (ogTitle || ogDesc || ogImage || ogUrl) {
      tags.push('');
      tags.push('<!-- Open Graph -->');
      if (ogType) tags.push('<meta property="og:type" content="' + ogType + '">');
      if (ogTitle) tags.push('<meta property="og:title" content="' + ogTitle + '">');
      if (ogDesc) tags.push('<meta property="og:description" content="' + ogDesc + '">');
      if (ogImage) tags.push('<meta property="og:image" content="' + ogImage + '">');
      if (ogUrl) tags.push('<meta property="og:url" content="' + ogUrl + '">');
    }

    // Twitter Card
    const twCard = getVal('twitterCard');
    const twSite = getVal('twitterSite');
    const twTitle = getVal('twitterTitle') || ogTitle;
    const twDesc = getVal('twitterDesc') || ogDesc;
    const twImage = getVal('twitterImage') || ogImage;
    if (twCard || twTitle || twDesc || twImage) {
      tags.push('');
      tags.push('<!-- Twitter Card -->');
      tags.push('<meta name="twitter:card" content="' + (twCard || 'summary_large_image') + '">');
      if (twSite) tags.push('<meta name="twitter:site" content="' + twSite + '">');
      if (twTitle) tags.push('<meta name="twitter:title" content="' + twTitle + '">');
      if (twDesc) tags.push('<meta name="twitter:description" content="' + twDesc + '">');
      if (twImage) tags.push('<meta name="twitter:image" content="' + twImage + '">');
    }

    outputText.value = tags.join('\n');
  }

  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', generate);
    if (el && el.tagName === 'SELECT') el.addEventListener('change', generate);
  });

  document.getElementById('btnCopy').addEventListener('click', () => {
    if (!outputText.value) return showToast(I18N.nothingToCopy || 'Nothing to copy', 'error');
    copyToClipboard(outputText.value);
    showToast(I18N.copied || 'Copied!');
  });

  document.getElementById('btnClear').addEventListener('click', () => {
    fields.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    outputText.value = '';
  });

  generate();
});
