const fs = require('fs');

const dir = 'locales/br';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const spWords = [
    'nuevo', 'administrado', 'administrada', 'facturas', 'deuda', 'pagarlas',
    'totalidad', 'únicamente', 'establecido', 'abajo', 'teléfono', 'correo',
    'electrónico', 'cualquier', 'ofrecemos', 'fuera', 'estándar', 'podamos',
    'proporcionar', 'ayuda', 'conocimientos'
];

files.forEach(file => {
    const c = fs.readFileSync(dir + '/' + file, 'utf8');
    const words = c.match(/[a-zA-ZáéíóúÁÉÍÓÚñÑãõÃÕçÇêôÊÔüÜ]+/g) || [];
    const found = {};
    words.forEach(w => {
        const lower = w.toLowerCase();
        if (spWords.includes(lower)) {
            // Check if it's not part of an acceptable word
            found[lower] = (found[lower] || 0) + 1;
        }
    });
    if (Object.keys(found).length > 0) {
        console.log(file, '->', JSON.stringify(found));
    }
});
