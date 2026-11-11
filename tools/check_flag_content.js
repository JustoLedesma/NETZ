const fs = require('fs');

console.log('py3.svg:', fs.readFileSync('assets/img/flags/py3.svg', 'utf8').substring(0, 300));
console.log('usa.svg:', fs.readFileSync('assets/img/flags/usa.svg', 'utf8').substring(0, 300));

