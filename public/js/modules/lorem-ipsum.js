const LOREM_WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor reprehenderit voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(' ');

function randomWord(exclude) {
  let w;
  do { w = LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]; } while (w === exclude);
  return w;
}

function generateWords(count) {
  return Array.from({length: count}, (_, i) => i === 0 ? 'lorem' : randomWord()).join(' ');
}

function generateSentence() {
  const len = 8 + Math.floor(Math.random() * 12);
  const words = Array.from({length: len}, (_, i) => randomWord());
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(' ') + '.';
}

function generateParagraph() {
  const count = 4 + Math.floor(Math.random() * 4);
  return Array.from({length: count}, generateSentence).join(' ');
}

function generate() {
  const type = document.getElementById('typeSelect').value;
  const count = Math.max(1, Math.min(100, parseInt(document.getElementById('countInput').value) || 3));
  const startWithLorem = document.getElementById('startWithLorem').checked;
  const wrapHtml = document.getElementById('htmlTags').checked;
  let result = '';

  if (type === 'words') {
    result = generateWords(count);
    if (startWithLorem) result = 'Lorem ipsum ' + result.split(' ').slice(2).join(' ');
  } else if (type === 'sentences') {
    const sentences = Array.from({length: count}, generateSentence);
    if (startWithLorem) sentences[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
    result = sentences.join(' ');
  } else {
    const paragraphs = Array.from({length: count}, (_, i) => {
      const p = generateParagraph();
      return (i === 0 && startWithLorem) ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + p : p;
    });
    result = wrapHtml ? paragraphs.map(p => '<p>' + p + '</p>').join('\n') : paragraphs.join('\n\n');
  }

  document.getElementById('outputText').value = result;
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnGenerate').addEventListener('click', generate);
  document.getElementById('btnCopy').addEventListener('click', () => {
    const val = document.getElementById('outputText').value;
    if (!val) return showToast(I18N.nothingToCopy, 'error');
    copyToClipboard(val);
    showToast(I18N.copied);
  });
  generate();
});
