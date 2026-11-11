const fs = require('fs');

const c = fs.readFileSync('locales/br/centro-de-ayuda.html', 'utf8');
const lines = c.split('\n');
console.log('--- Lines 1-50 ---');
console.log(lines.slice(0, 50).join('\n'));
