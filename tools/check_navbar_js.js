const fs = require('fs');

const nb = fs.readFileSync('assets/js/navbar.js', 'utf8');
const lines = nb.split('\n');
console.log('--- navbar detection logic ---');
lines.forEach((l, i) => {
    if (l.includes('isBr') || l.includes('country') || l.includes('template') || l.includes('navbarHTML_pt')) {
        console.log((i + 1) + ': ' + l.trim());
    }
});

