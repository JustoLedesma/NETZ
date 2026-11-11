const fs = require('fs');

const c = fs.readFileSync('locales/br/centro-de-ayuda.html', 'utf8');
const lines = c.split('\n');
console.log(lines.slice(170, 260).join('\n'));
