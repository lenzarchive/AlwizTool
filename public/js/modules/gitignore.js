const GITIGNORE_TEMPLATES = {
  node: { label: 'Node.js', content: `# Node
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.npm
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
dist/
build/
.cache/
coverage/` },
  python: { label: 'Python', content: `# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
ENV/
.venv
dist/
build/
*.egg-info/
.eggs/
*.egg
pip-log.txt
.pytest_cache/
.mypy_cache/
.coverage
htmlcov/` },
  java: { label: 'Java', content: `# Java
*.class
*.jar
*.war
*.ear
*.nar
hs_err_pid*
.classpath
.project
.settings/
target/
build/` },
  rust: { label: 'Rust', content: `# Rust
/target
Cargo.lock
**/*.rs.bk` },
  go: { label: 'Go', content: `# Go
*.exe
*.exe~
*.dll
*.so
*.dylib
*.test
*.out
vendor/
go.sum` },
  php: { label: 'PHP', content: `# PHP
vendor/
composer.lock
.env
*.log
cache/
storage/
public/storage` },
  react: { label: 'React', content: `# React
node_modules/
build/
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*` },
  vue: { label: 'Vue.js', content: `# Vue
node_modules/
dist/
.env
.env.*
!.env.example
*.local
.DS_Store` },
  laravel: { label: 'Laravel', content: `# Laravel
vendor/
node_modules/
public/hot
public/storage
storage/*.key
.env
.env.backup
Homestead.json
Homestead.yaml
npm-debug.log
yarn-error.log` },
  django: { label: 'Django', content: `# Django
*.pyc
__pycache__/
*.py[cod]
db.sqlite3
db.sqlite3-journal
media/
staticfiles/
.env
venv/
.venv/` },
  vscode: { label: 'VS Code', content: `# VS Code
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
*.vsix` },
  intellij: { label: 'IntelliJ / JetBrains', content: `# IntelliJ
.idea/
*.iws
*.iml
*.ipr
out/
*.class` },
  macos: { label: 'macOS', content: `# macOS
.DS_Store
.AppleDouble
.LSOverride
._*
.Spotlight-V100
.Trashes
.AppleDB
.AppleDesktop` },
  windows: { label: 'Windows', content: `# Windows
Thumbs.db
Thumbs.db:encryptable
ehthumbs.db
ehthumbs_vista.db
*.stackdump
[Dd]esktop.ini
$RECYCLE.BIN/
*.cab
*.msi
*.msix
*.msm
*.msp
*.lnk` },
  linux: { label: 'Linux', content: `# Linux
*~
.fuse_hidden*
.directory
.Trash-*
.nfs*` },
  dotenv: { label: '.env files', content: `# Environment variables
.env
.env.*
!.env.example
!.env.sample` },
  logs: { label: 'Log files', content: `# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
pnpm-debug.log*
lerna-debug.log*` },
  docker: { label: 'Docker', content: `# Docker
.dockerignore
docker-compose.override.yml` },
};

document.addEventListener('DOMContentLoaded', () => {
  const checkboxes = document.querySelectorAll('.tmpl-check');
  const output = document.getElementById('outputText');

  function build() {
    const selected = [...document.querySelectorAll('.tmpl-check:checked')].map(el => el.value);
    if (!selected.length) { output.value = ''; return; }
    const parts = selected.map(key => {
      const t = GITIGNORE_TEMPLATES[key];
      return '# ========================================\n# ' + t.label + '\n# ========================================\n' + t.content;
    });
    output.value = parts.join('\n\n');
  }

  checkboxes.forEach(cb => cb.addEventListener('change', build));

  document.getElementById('btnSelectAll').addEventListener('click', () => {
    checkboxes.forEach(cb => cb.checked = true); build();
  });
  document.getElementById('btnClear').addEventListener('click', () => {
    checkboxes.forEach(cb => cb.checked = false); output.value = '';
  });
  document.getElementById('btnCopy').addEventListener('click', () => {
    if (!output.value) return showToast(I18N.nothingToCopy || 'Nothing to copy', 'error');
    copyToClipboard(output.value);
    showToast(I18N.copied || 'Copied!');
  });
  document.getElementById('btnDownload').addEventListener('click', () => {
    if (!output.value) return showToast(I18N.nothingToCopy || 'Nothing to copy', 'error');
    const blob = new Blob([output.value], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = '.gitignore';
    a.click();
  });
});
