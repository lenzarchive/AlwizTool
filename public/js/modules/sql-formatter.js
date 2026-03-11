const SQL_KEYWORDS = [
  'SELECT','FROM','WHERE','JOIN','LEFT JOIN','RIGHT JOIN','INNER JOIN','OUTER JOIN','FULL JOIN',
  'CROSS JOIN','ON','AND','OR','NOT','IN','EXISTS','BETWEEN','LIKE','IS NULL','IS NOT NULL',
  'INSERT INTO','VALUES','UPDATE','SET','DELETE FROM','CREATE TABLE','DROP TABLE','ALTER TABLE',
  'ADD COLUMN','DROP COLUMN','MODIFY COLUMN','CREATE INDEX','DROP INDEX','CREATE VIEW','DROP VIEW',
  'UNION','UNION ALL','INTERSECT','EXCEPT','GROUP BY','ORDER BY','HAVING','LIMIT','OFFSET',
  'AS','DISTINCT','ALL','TOP','CASE','WHEN','THEN','ELSE','END','WITH','CTE',
  'PRIMARY KEY','FOREIGN KEY','REFERENCES','UNIQUE','NOT NULL','DEFAULT','CHECK','INDEX',
  'BEGIN','COMMIT','ROLLBACK','TRANSACTION'
];
function formatSql(sql) {
  let s = sql.replace(/\s+/g, ' ').trim();
  SQL_KEYWORDS.sort((a, b) => b.length - a.length).forEach(kw => {
    const re = new RegExp('\\b' + kw.replace(/ /g, '\\s+') + '\\b', 'gi');
    s = s.replace(re, kw);
  });
  const BREAK_BEFORE = ['SELECT','FROM','WHERE','JOIN','LEFT JOIN','RIGHT JOIN','INNER JOIN',
    'OUTER JOIN','FULL JOIN','CROSS JOIN','ON','AND','OR','GROUP BY','ORDER BY','HAVING',
    'LIMIT','OFFSET','UNION','UNION ALL','INTERSECT','EXCEPT','INSERT INTO','VALUES',
    'UPDATE','SET','DELETE FROM'];
  BREAK_BEFORE.forEach(kw => {
    const re = new RegExp('\\s+' + kw.replace(/ /g, '\\s+') + '(?=\\s|$)', 'g');
    s = s.replace(re, '\n' + kw);
  });
  const lines = s.split('\n');
  const INDENT_WORDS = ['AND','OR','ON','SET'];
  return lines.map((line, i) => {
    const trimmed = line.trim();
    const firstWord = trimmed.split(/\s+/)[0];
    if (i === 0) return trimmed;
    if (INDENT_WORDS.includes(firstWord)) return '  ' + trimmed;
    if (['FROM','WHERE','JOIN','LEFT','RIGHT','INNER','OUTER','FULL','CROSS','GROUP','ORDER','HAVING','LIMIT','OFFSET','UNION','INTERSECT','EXCEPT','VALUES'].some(w => trimmed.startsWith(w))) return trimmed;
    return '  ' + trimmed;
  }).join('\n');
}
function minifySql(sql) {
  return sql.replace(/\s+/g, ' ').trim();
}
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnFormat').addEventListener('click', () => {
    const sql = document.getElementById('inputText').value.trim();
    if (!sql) return;
    document.getElementById('outputText').value = formatSql(sql);
  });
  document.getElementById('btnMinify').addEventListener('click', () => {
    const sql = document.getElementById('inputText').value.trim();
    if (!sql) return;
    document.getElementById('outputText').value = minifySql(sql);
  });
  document.getElementById('btnClear').addEventListener('click', () => {
    document.getElementById('inputText').value = '';
    document.getElementById('outputText').value = '';
  });
  document.getElementById('inputText').addEventListener('input', () => {
    const sql = document.getElementById('inputText').value.trim();
    if (sql) document.getElementById('outputText').value = formatSql(sql);
  });
  document.getElementById('btnCopy').addEventListener('click', () => {
    const val = document.getElementById('outputText').value;
    if (!val) return showToast(I18N.nothingToCopy, 'error');
    copyToClipboard(val);
    showToast(I18N.copied);
  });
});
