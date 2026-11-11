const fs = require('fs');

const f = fs.readFileSync('assets/js/footer.js', 'utf8');
const lines = f.split('\n');
console.log('--- Spanish footer lang changer (lines 105-135) ---');
console.log(lines.slice(105, 135).join('\n'));
console.log('--- Portuguese footer lang changer (lines 245-275) ---');
console.log(lines.slice(245, 275).join('\n'));
console.log('--- English footer lang changer (lines 375-405) ---');
console.log(lines.slice(375, 405).join('\n'));

