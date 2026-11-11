const fs = require('fs');

const c = fs.readFileSync('locales/br/centro-de-ayuda.html', 'utf8');
const lines = c.split('\n');
lines.forEach((l, i) => {
    if (l.includes('Centro de Ayuda') || l.includes('Ayuda') || l.includes('ayuda') || l.includes('pregunta') || l.includes('Pregunta')) {
        console.log((i + 1) + ': ' + l.trim());
    }
});

