const fs = require('fs');

const c = fs.readFileSync('locales/br/centro-de-ayuda.html', 'utf8');
const lastQ = c.indexOf('<li id="go-to-qst-65">');
console.log(c.substring(lastQ + 200));

