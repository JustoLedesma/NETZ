const fs = require('fs');

const c = fs.readFileSync('locales/br/centro-de-ayuda.html', 'utf8');
const lines = c.split('\n');

lines.forEach((l, i) => {
    if (/\b(ayuda|administrado)\b/i.test(l)) {
        console.log(`${i + 1}: ${l.trim()}`);
    }
});

