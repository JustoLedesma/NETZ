const fs = require('fs');

const c = fs.readFileSync('config/country_currency.json', 'utf8');
console.log(c);
