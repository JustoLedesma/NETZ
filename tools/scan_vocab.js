const fs = require('fs');

const c = fs.readFileSync('locales/br/centro-de-ayuda.html', 'utf8');

// Check every word in the entire file
const words = c.match(/[a-zA-ZáéíóúÁÉÍÓÚñÑãõÃÕçÇêôÊÔüÜ]+/g) || [];

const spWords = [
    'nuevo', 'administrado', 'administrada', 'facturas', 'deuda', 'pagarlas',
    'totalidad', 'únicamente', 'establecido', 'abajo', 'teléfono', 'correo',
    'electrónico', 'cualquier', 'ofrecemos', 'fuera', 'estándar', 'podamos',
    'proporcionar', 'ayuda', 'conocimientos'
];

const found = {};
words.forEach(w => {
    const lower = w.toLowerCase();
    if (spWords.includes(lower)) {
        found[lower] = (found[lower] || 0) + 1;
    }
});

console.log('Found specific Spanish vocabulary:', found);

