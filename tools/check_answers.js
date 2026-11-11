const fs = require('fs');

const c = fs.readFileSync('locales/br/centro-de-ayuda.html', 'utf8');

const qMatches = c.match(/<li id="go-to-qst-\d+">[\s\S]*?<\/li>/g) || [];
console.log('Total questions found:', qMatches.length);

for (let i = 0; i < Math.min(10, qMatches.length); i++) {
    console.log('--- Q' + (i + 1) + ' ---');
    console.log(qMatches[i].substring(0, 250).replace(/\s+/g, ' '));
}
