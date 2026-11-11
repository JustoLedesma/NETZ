const fs = require('fs');

const nb = fs.readFileSync('assets/js/navbar.js', 'utf8');
const ft = fs.readFileSync('assets/js/footer.js', 'utf8');

console.log('--- navbar.js occurrences ---');
nb.split('\n').forEach((l, i) => {
    if (l.includes('centro-de-ayuda') || l.includes('ajuda') || l.includes('ayuda') || l.includes('Central')) {
        console.log((i + 1) + ': ' + l.trim());
    }
});

console.log('--- footer.js occurrences ---');
ft.split('\n').forEach((l, i) => {
    if (l.includes('centro-de-ayuda') || l.includes('ajuda') || l.includes('ayuda') || l.includes('Central') || l.includes('Respostas')) {
        console.log((i + 1) + ': ' + l.trim());
    }
});

