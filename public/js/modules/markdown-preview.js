let htmlOutput = '';
function renderMarkdown() {
  const input = document.getElementById('inputText').value;
  const preview = document.getElementById('mdPreview');
  const charCount = input.length;
  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;
  document.getElementById('statChars').textContent = charCount + ' ' + (document.getElementById('statChars').textContent.split(' ').slice(1).join(' ') || 'chars');
  document.getElementById('statWords').textContent = wordCount + ' ' + (document.getElementById('statWords').textContent.split(' ').slice(1).join(' ') || 'words');
  if (typeof marked === 'undefined') {
    preview.textContent = 'Markdown library loading...';
    return;
  }
  marked.setOptions({ breaks: true, gfm: true });
  htmlOutput = marked.parse(input);
  preview.innerHTML = htmlOutput;
}
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('inputText').addEventListener('input', renderMarkdown);
  document.getElementById('btnCopyHtml').addEventListener('click', () => {
    if (!htmlOutput) return showToast(I18N.nothingToCopy, 'error');
    copyToClipboard(htmlOutput);
    showToast(I18N.copied);
  });
  document.getElementById('inputText').value = '# Welcome to Markdown Preview\n\nType your **Markdown** here and see it rendered live.\n\n## Features\n\n- Live rendering\n- GitHub Flavored Markdown\n- Tables and code blocks\n\n```js\nconsole.log("Hello, world!");\n```\n\n| Column A | Column B |\n|----------|----------|\n| Cell 1   | Cell 2   |\n';
  renderMarkdown();
});
