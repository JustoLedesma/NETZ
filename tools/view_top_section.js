const fs = require('fs');

const c = fs.readFileSync('locales/br/centro-de-ayuda.html', 'utf8');
const start = c.indexOf('<section class="padding-100-0 position-relative">');
const end = c.indexOf('<ul id="nuhost-filter-list">');

console.log(c.substring(start, end));

