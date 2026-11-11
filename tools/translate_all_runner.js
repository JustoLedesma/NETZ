const fs = require('fs');
const path = require('path');
const { applyList, globalPairs, localesUsDir, usDir, distUsDir } = require('./translate_base.js');
const { pageDictionaries } = require('./translate_pages.js');

const productionPages = [
    '404.html',
    'about.html',
    'audio-streaming.html',
    'aviso-legal.html',
    'buscar-dominios.html',
    'centro-de-ayuda.html',
    'contact.html',
    'hosting-exclusivo.html',
    'hosting-ilimitado.html',
    'index.html',
    'politica-de-privacidad.html',
    'reseller-cpanel.html',
    'reseller-directadmin.html',
    'terminos-del-servicio.html',
    'video-streaming.html',
    'vps-linux-administrado.html',
    'vps-linux-no-administrado.html',
    'vps-linux.html',
    'vps-windows-administrado.html',
    'vps-windows-no-administrado.html',
    'vps-windows.html'
];

console.log('🚀 Iniciando traducción masiva y exhaustiva a US English...');

let totalTranslated = 0;

for (const page of productionPages) {
    const rootPath = path.join(__dirname, '..', page);
    if (!fs.existsSync(rootPath)) {
        console.warn(`⚠️ No se encontró archivo raíz: ${page}`);
        continue;
    }

    let content = fs.readFileSync(rootPath, 'utf8');

    // 1. Reemplazos globales (metas, navbar estático, badges, footer estático)
    content = applyList(content, globalPairs);

    // 2. Diccionario específico de la página
    if (pageDictionaries[page]) {
        content = applyList(content, pageDictionaries[page]);
    }

    // 3. Reemplazos especiales para páginas con estructuras complejas
    if (page === 'hosting-ilimitado.html') {
        content = content.replace(/Es prioridad máxima en nuestro servicio[\s\S]*?multitud de ataques simultaneos\./g, 
            'Top security priority. BitNinja shields your server from zero-day exploits, botnets, and multi-vector cyber attacks.');
        content = content.replace(/Boost your cuenta aumentá los recursos, ideal para sitios web y comercio electrónico más exigentes\./g,
            'Scale your account resources on demand, ideal for high-traffic stores and demanding web apps.');
        content = content.replace(/1-Click App <br>aplicaciónes simplificado/g, '1-Click App <br>Installer (Softaculous)');
    }

    if (page === 'audio-streaming.html') {
        content = content.replace(/ShoutCast es una solución[\s\S]*?transferencia ilimitada\./g,
            'ShoutCast is an industry-standard solution for live audio broadcasting over the internet like a traditional radio station. Listeners can tune in from any media player or mobile app. 24/7 continuous broadcast is effortless with our cloud AutoDJ system.<br>Our HD Radio Streaming solution is powered by SonicPanel: ShoutCast V1 & V2, AutoDJ, PlayLists, MP3 and AAC+ V2, with custom HTML5 HD players compatible with Android and iOS, secure HTTPS (SSL) streaming, and unlimited bandwidth.');
    }

    // Guardar en locales/us/, us/ y dist/us/
    const targetLocales = path.join(localesUsDir, page);
    const targetUs = path.join(usDir, page);
    const targetDist = path.join(distUsDir, page);

    fs.writeFileSync(targetLocales, content, 'utf8');
    fs.writeFileSync(targetUs, content, 'utf8');
    if (fs.existsSync(distUsDir)) {
        fs.writeFileSync(targetDist, content, 'utf8');
    }

    console.log(`✅ ${page} traducido y sincronizado en locales/us, us/ y dist/us`);
    totalTranslated++;
}

console.log(`\n✨ Traducción completada con éxito para ${totalTranslated} páginas.`);

