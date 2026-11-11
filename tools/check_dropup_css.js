const fs = require('fs');

const css = fs.readFileSync('assets/css/main.min.css', 'utf8');
const idx = css.indexOf('.dropupmenulagchanger');
console.log(css.substring(idx - 100, idx + 400));

