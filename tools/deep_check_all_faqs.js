const fs = require('fs');

const c = fs.readFileSync('locales/br/centro-de-ayuda.html', 'utf8');

// Check every <li id="go-to-qst-XX">
const regex = /<li id="go-to-qst-(\d+)">([\s\S]*?)<\/li>/g;
let match;
let count = 0;
let spanishCount = 0;

const spIndicators = [
    /\b(el|la|los|las|un|una|unos|unas|de|del|en|para|por|con|su|sus|este|esta|estos|estas)\s+(alojamiento|servidor|servidores|sitio|sitios|dominio|dominios|correo|correos|pago|pagos|cuenta|cuentas|cliente|clientes)\b/i,
    /\b(también|además|después|antes|donde|cuando|como|pero|sino|porque|aunque)\b/i,
    /\b(ofrecemos|disponemos|contamos|puedes|puede|pueden|debes|debe|deben|tienes|tiene|tienen)\b/i,
    /\b(hospedaje|servicios|copias de seguridad|bases de datos|ancho de banda|disco duro|tiempo de actividad)\b/i
];

while ((match = regex.exec(c)) !== null) {
    count++;
    const qNum = match[1];
    const qBody = match[2];

    // Check if body has Spanish words
    const spMatches = [];
    if (qBody.includes('¿') || qBody.includes('¡')) spMatches.push('signos ¿ ¡');
    if (/\b(servicios|alojamiento|hospedaje|copias de seguridad|nuestro|nuestros|nuestra|nuestras)\b/i.test(qBody)) {
        spMatches.push('palabras es');
    }
    if (/\b(también|puedes|ofrecemos|disponemos|contáctanos|pago|facturas)\b/i.test(qBody)) {
        spMatches.push('verbos es');
    }

    if (spMatches.length > 0) {
        spanishCount++;
        console.log(`Q${qNum} has Spanish indicators [${spMatches.join(', ')}]:`);
        console.log(qBody.substring(0, 150).replace(/\s+/g, ' '));
    }
}

console.log(`Total checked: ${count}, flagged: ${spanishCount}`);
