const fs = require('fs');
const path = require('path');

const { globalReplacements, localesUsDir, usDir, distUsDir, safeReplace } = require('./translate_us_comprehensive.js');
const { hostingReplacements } = require('./translate_us_modules_hosting.js');
const { streamingResellerReplacements } = require('./translate_us_modules_streaming_reseller.js');
const { vpsReplacements } = require('./translate_us_modules_vps.js');
const { legalAboutReplacements } = require('./translate_us_modules_legal_about.js');
const { domainsReplacements } = require('./translate_us_modules_domains.js');
const faqEnglishMap = require('./faq_english_map.json');

const productionFiles = [
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

console.log('🌟 Iniciando traducción unificada y definitiva para todas las páginas US...');

function translateFaqPage(content) {
    let res = content;

    // Header & Search
    res = res.replace(/<span>Centro de Ayuda<\/span>Es posible que hayamos respondido su\s*pregunta<br>\s*Deslice hacia abajo/gi, '<span>Help Center</span>We may have already answered your question<br> Scroll down to explore topics');
    res = res.replace(/Si aun así no encuentra la respuesta que necesita, no dude en contactarnos,\s*con gusto lo ayudaremos/gi, 'If you cannot find the answer you are looking for, please get in touch—our support team will gladly assist you:');
    res = res.replace(/placeholder="Busque su pregunta aquí\.\."/gi, 'placeholder="Search your question here..."');
    res = res.replace(/Al confiar en nosotros con sus necesidades de negocio, le prometemos un\s*99\.9% de tiempo de actividad/gi, 'By entrusting your business to NETZ, we guarantee a 99.9% uptime SLA across all services.');
    res = res.replace(/En el caso de que el dominio con la extensión que necesita no disponemos en\s*el buscador\./gi, 'If the specialized domain extension you need is not listed in the search bar,');
    res = res.replace(/No hay problema contáctanos que activaremos de forma manual\./gi, 'No problem! Contact our support desk and we will activate it manually for you.');
    res = res.replace(/Nuestra dedicación al servicio de atención al cliente llega también a todo\s*el mundo\./gi, 'Our customer support team is available 24/7 worldwide across live chat, WhatsApp, and tickets.');

    // Replace all 65 questions and answers
    for (const item of faqEnglishMap) {
        // 1. Sidebar TOC Link
        const tocRegex = new RegExp(`(<a href="#go-to-qst-${item.num}">)[\\s\\S]*?(<i class="fas fa-angle-right"><\\/i><\\/a>)`, 'gi');
        res = res.replace(tocRegex, `$1${item.q_en}$2`);

        // 2. Main Question item block: <li id="go-to-qst-XX"><span>...</span>...</li>
        const mainRegex = new RegExp(`(<li id="go-to-qst-${item.num}">)<span>[\\s\\S]*?<\\/span>[\\s\\S]*?(<\\/li>)`, 'gi');
        res = res.replace(mainRegex, `$1<span>${item.q_en}</span>\n                    ${item.a_en}\n                $2`);
    }

    return res;
}

for (const file of productionFiles) {
    const srcPath = path.join(localesUsDir, file);
    if (!fs.existsSync(srcPath)) {
        console.warn(`Archivo no encontrado: ${srcPath}`);
        continue;
    }

    let content = fs.readFileSync(srcPath, 'utf8');

    // 1. Reemplazos globales (navbar, footers, badges, botones, términos comunes)
    content = safeReplace(content, globalReplacements);

    // 2. Reemplazos por módulos
    if (file === 'hosting-ilimitado.html' || file === 'hosting-exclusivo.html' || file === 'index.html') {
        content = safeReplace(content, hostingReplacements);
    }

    if (file.includes('streaming') || file.includes('reseller')) {
        content = safeReplace(content, streamingReplacements = streamingResellerReplacements);
    }

    if (file.includes('vps')) {
        content = safeReplace(content, vpsReplacements);
    }

    if (file === 'about.html' || file === 'contact.html' || file === '404.html' || file.includes('terminos') || file.includes('privacidad') || file.includes('aviso')) {
        content = safeReplace(content, legalAboutReplacements);
    }

    if (file === 'buscar-dominios.html') {
        content = safeReplace(content, domainsReplacements);
    }

    if (file === 'centro-de-ayuda.html') {
        content = translateFaqPage(content);
    }

    // Escribir archivo sincronizado en los 3 destinos (locales/us, us, dist/us)
    fs.writeFileSync(srcPath, content, 'utf8');
    fs.writeFileSync(path.join(usDir, file), content, 'utf8');
    if (fs.existsSync(distUsDir)) {
        fs.writeFileSync(path.join(distUsDir, file), content, 'utf8');
    }

    console.log(`✅ Traducido y sincronizado: ${file}`);
}

console.log('🎉 Todas las páginas US procesadas correctamente!');
