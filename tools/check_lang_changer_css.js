const fs = require('fs');

const css = fs.readFileSync('assets/css/main.min.css', 'utf8');
let idx = css.indexOf('.footer-lang-changer');
while (idx !== -1) {
    console.log(css.substring(Math.max(0, idx - 50), idx + 250));
    idx = css.indexOf('.footer-lang-changer', idx + 1);
}
let idx2 = css.indexOf('dropupmenulagchanger');
while (idx2 !== -1) {
    console.log(css.substring(Math.max(0, idx2 - 50), idx2 + 250));
    idx2 = css.indexOf('dropupmenulagchanger', idx2 + 1);
}
let idx3 = css.indexOf('.lang-changer-drop-up');
while (idx3 !== -1) {
    console.log(css.substring(Math.max(0, idx3 - 50), idx3 + 250));
    idx3 = css.indexOf('.lang-changer-drop-up', idx3 + 1);
}

