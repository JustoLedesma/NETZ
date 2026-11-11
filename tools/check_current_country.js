const fs = require('fs');

const f = fs.readFileSync('assets/js/footer.js', 'utf8');
const idx = f.indexOf('var currentCountryCode =');
console.log(f.substring(idx - 100, idx + 500));
