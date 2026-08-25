const fs = require('fs');
const path = require('path');

const replacements = [
  ['Ã¡', 'á'], ['Ã©', 'é'], ['Ã­', 'í'], ['Ã³', 'ó'],
  ['Ãº', 'ú'], ['Ã£', 'ã'], ['Ãµ', 'õ'], ['Ã¢', 'â'],
  ['Ãª', 'ê'], ['Ã´', 'ô'], ['Ã¼', 'ü'], ['Ã§', 'ç'],
  ['Ã‰', 'É'], ['Ã\x81', 'Á'], ['Ã\x93', 'Ó'],
  ['Ã\x9a', 'Ú'], ['Ã\x89', 'Ê'], ['Ã\x83', 'Ã'],
  ['Ã\x95', 'Õ'], ['Ã\x82', 'Â'], ['Ã\x94', 'Ô'],
  ['Âº', 'º'], ['Ã‰', 'É'], ['Ã¡', 'á'],
  ['\u00c3\u00a9', 'é'], ['\u00c3\u00a1', 'á'],
  ['\u00c3\u00ad', 'í'], ['\u00c3\u00b3', 'ó'],
  ['\u00c3\u00ba', 'ú'], ['\u00c3\u00a3', 'ã'],
  ['\u00c3\u00b5', 'õ'], ['\u00c3\u00a2', 'â'],
  ['\u00c3\u00aa', 'ê'], ['\u00c3\u00b4', 'ô'],
  ['\u00c3\u00bc', 'ü'], ['\u00c3\u00a7', 'ç'],
  ['\u00c3\u0089', 'É'], ['\u00c3\u0081', 'Á'],
  ['\u00c3\u0093', 'Ó'], ['\u00c3\u009a', 'Ú'],
  ['\u00c3\u0095', 'Õ'], ['\u00c3\u0082', 'Â'],
  ['\u00c3\u0094', 'Ô'], ['\u00c3\u008a', 'Ê'],
];

function fixFile(f) {
  let d = fs.readFileSync(f, 'utf8');
  const orig = d;
  for (const [bad, good] of replacements) {
    d = d.split(bad).join(good);
  }
  if (d !== orig) {
    fs.writeFileSync(f, d, 'utf8');
    return true;
  }
  return false;
}

function walk(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  let count = 0;
  for (const i of items) {
    const full = path.join(dir, i.name);
    if (i.isDirectory() && i.name !== 'node_modules' && i.name !== 'dist') {
      count += walk(full);
    } else if (i.name.endsWith('.jsx') || i.name.endsWith('.js')) {
      if (fixFile(full)) {
        console.log('fixed: ' + full);
        count++;
      }
    }
  }
  return count;
}

const n = walk('src');
console.log('Total fixed: ' + n);
