const fs = require('fs');

const f = fs.readFileSync('assets/js/footer.js', 'utf8');

const regex = /<div class="footer-lang-changer">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/g;

let matches = 0;
let m;
while ((m = regex.exec(f)) !== null) {
    matches++;
    console.log('Match', matches, ':', m[0].substring(0, 100));
}
console.log('Total matches found:', matches);

