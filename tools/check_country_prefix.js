const fs = require('fs');

const f = fs.readFileSync('assets/js/footer.js', 'utf8');
const idx = f.indexOf('function getCountryPrefix()');
console.log(f.substring(idx, idx + 400));
