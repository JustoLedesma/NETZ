const fs = require('fs');

const nb = fs.readFileSync('assets/js/navbar.js', 'utf8');
const lines = nb.split('\n');
console.log(lines.slice(340, 370).join('\n'));

