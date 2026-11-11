const fs = require('fs');

const f = fs.readFileSync('assets/js/footer.js', 'utf8');
console.log('Total length:', f.length);
console.log('Lines count:', f.split('\n').length);
const idx = f.indexOf('function renderFooter()');
console.log(f.substring(idx));
