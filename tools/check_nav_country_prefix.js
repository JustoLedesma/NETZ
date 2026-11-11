const fs = require('fs');

const nb = fs.readFileSync('assets/js/navbar.js', 'utf8');
const idx = nb.indexOf('function getCountryPrefix()');
console.log(nb.substring(idx, idx + 400));
