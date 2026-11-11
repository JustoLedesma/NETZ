const fs = require('fs');
const path = require('path');

const { globalBrReplacements, localesBrDir, brDir, distBrDir, safeReplace, replaceFlexible } = require('./translate_br_comprehensive.js');
const { hostingBrReplacements } = require('./translate_br_modules_hosting.js');
const { streamingResellerBrReplacements } = require('./translate_br_modules_streaming_reseller.js');
const { vpsBrReplacements } = require('./translate_br_modules_vps.js');
const { legalAboutBrReplacements } = require('./translate_br_modules_legal_about.js');
const { domainsBrReplacements } = require('./translate_br_modules_domains.js');
const faqPtMap = require('./faq_pt_map.json');

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

console.log('🌟 Iniciando tradução unificada e definitiva para todas as páginas BR...');

function translateFaqPagePt(content) {
    let res = content;

    // Header & Search
    res = replaceFlexible(res, '<span>Centro de Ayuda</span>Es posible que hayamos respondido su pregunta<br> Deslice hacia abajo para explorar temas', '<span>Central de Ajuda</span>Podemos já ter respondido à sua dúvida<br> Role para baixo para explorar os tópicos');
    res = replaceFlexible(res, '<span>Centro de Ayuda</span>Es posible que hayamos respondido su pregunta<br>Deslice hacia abajo para explorar temas', '<span>Central de Ajuda</span>Podemos já ter respondido à sua dúvida<br>Role para baixo para explorar os tópicos');
    res = replaceFlexible(res, 'Si aun así no encuentra la respuesta que necesita, no dude en contactarnos, con gusto lo ayudaremos:', 'Se ainda não encontrar a resposta necessária, não hesite em falar conosco, teremos prazer em ajudar:');
    res = replaceFlexible(res, 'placeholder="Busque su pregunta aquí.."', 'placeholder="Pesquise sua dúvida aqui..."');
    res = replaceFlexible(res, 'Al confiar en nosotros con sus necesidades de negocio, le prometemos un 99.9% de tiempo de actividad de la red para todos los servicios de alojamiento web.', 'Ao confiar na NETZ com as necessidades da sua empresa, garantimos 99.9% de uptime para todos os serviços.');
    res = replaceFlexible(res, 'En el caso de que el dominio con la extensión que necesita no disponemos en el buscador.', 'Caso a extensão de domínio que você precisa não esteja listada na busca,');
    res = replaceFlexible(res, 'No hay problema contáctanos que activaremos de forma manual.', 'Não se preocupe! Fale conosco que ativaremos manualmente para você.');
    res = replaceFlexible(res, 'Nuestra dedicación al servicio de atención al cliente llega también a todo el mundo.', 'Nossa dedicação ao suporte ao cliente também atinge o mundo todo.');

    // Replace all 65 questions and answers
    for (const item of faqPtMap) {
        // 1. Sidebar TOC Link
        const tocRegex = new RegExp(`(<a href="#go-to-qst-${item.num}">)[\\s\\S]*?(<i[\\s\\S]*?<\\/a>)`, 'gi');
        res = res.replace(tocRegex, `$1${item.q_pt} <i class="fas fa-angle-right"></i></a>`);

        // 2. Main Question item block: <li id="go-to-qst-XX"><span>...</span>...</li>
        const mainRegex = new RegExp(`(<li id="go-to-qst-${item.num}">)<span>[\\s\\S]*?<\\/span>[\\s\\S]*?(<\\/li>)`, 'gi');
        res = res.replace(mainRegex, `$1<span>${item.q_pt}</span>\n                    ${item.a_pt}\n                $2`);
    }

    return res;
}

for (const file of productionFiles) {
    const srcPath = path.join(localesBrDir, file);
    if (!fs.existsSync(srcPath)) {
        console.warn(`Arquivo não encontrado: ${srcPath}`);
        continue;
    }

    let content = fs.readFileSync(srcPath, 'utf8');

    // 1. Reemplazos globales (navbar, footers, badges, botones, términos comunes)
    content = safeReplace(content, globalBrReplacements);

    // 2. Reemplazos por módulos
    if (file === 'hosting-ilimitado.html' || file === 'hosting-exclusivo.html' || file === 'index.html') {
        content = safeReplace(content, hostingBrReplacements);
    }

    if (file.includes('streaming') || file.includes('reseller')) {
        content = safeReplace(content, streamingResellerBrReplacements);
    }

    if (file.includes('vps')) {
        content = safeReplace(content, vpsBrReplacements);
    }

    if (file === 'about.html' || file === 'contact.html' || file === '404.html' || file.includes('terminos') || file.includes('privacidad') || file.includes('aviso')) {
        content = safeReplace(content, legalAboutBrReplacements);
    }

    if (file === 'buscar-dominios.html') {
        content = safeReplace(content, domainsBrReplacements);
    }

    if (file === 'centro-de-ayuda.html') {
        content = translateFaqPagePt(content);
    }

    // Escribir archivo sincronizado en los 3 destinos (locales/br, br, dist/br)
    fs.writeFileSync(srcPath, content, 'utf8');
    fs.writeFileSync(path.join(brDir, file), content, 'utf8');
    if (fs.existsSync(distBrDir)) {
        fs.writeFileSync(path.join(distBrDir, file), content, 'utf8');
    }

    console.log(`✅ Traduzido e sincronizado: ${file}`);
}

console.log('🎉 Todas as páginas BR processadas com sucesso!');
