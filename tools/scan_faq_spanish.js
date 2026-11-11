const fs = require('fs');

const content = fs.readFileSync('locales/br/centro-de-ayuda.html', 'utf8');
const lines = content.split('\n');

const spanishPatterns = [
    /cualquiera/i,
    /cualquier/i,
    /ofrecemos/i,
    /estándar/i,
    /podamos/i,
    /proporcionar/i,
    /teléfono/i,
    /correo electrónico/i,
    /chat en vivo/i,
    /A continuación/i,
    /facturas/i,
    /deuda/i,
    /pagarlas/i,
    /por favor/i,
    /únicamente/i,
    /método/i,
    /establecido/i,
    /más abajo/i,
    /ayuda/i,
    /servicios/i,
    /alojamiento/i,
    /nuestro/i,
    /nuestros/i,
    /nuestra/i,
    /nuestras/i,
    /también/i,
    /también/i,
    /deslice/i,
    /hacia abajo/i,
    /temas/i,
    /con gusto/i,
    /ayudaremos/i,
    /haga/i,
    /usted/i,
    /cuenta/i,
    /cuentas/i,
    /español/i,
    /paraguay/i
];

console.log('--- Lines matching Spanish patterns in locales/br/centro-de-ayuda.html ---');
lines.forEach((line, idx) => {
    // skip script tags / css
    if (idx < 50 && (line.includes('<script') || line.includes('<meta') || line.includes('<link'))) return;
    for (const pat of spanishPatterns) {
        if (pat.test(line)) {
            console.log(`L${idx + 1}: ${line.trim()}`);
            break;
        }
    }
});

