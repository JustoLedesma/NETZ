const fs = require('fs');
const path = require('path');

const localesBrDir = path.join(__dirname, '..', 'locales', 'br');
const brDir = path.join(__dirname, '..', 'br');
const distBrDir = path.join(__dirname, '..', 'dist', 'br');

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceFlexible(content, searchStr, replaceStr) {
    if (searchStr instanceof RegExp) {
        return content.replace(searchStr, replaceStr);
    }
    const escaped = escapeRegex(searchStr);
    const pattern = escaped.replace(/\s+/g, '\\s+');
    const regex = new RegExp(pattern, 'g');
    return content.replace(regex, replaceStr);
}

// 1. Specific Centro de Ayuda fixes
function fixCentroDeAyuda(content) {
    let res = content;

    // Meta titles
    res = res.replace(/Centro de Ayuda y Base de Conocimientos \| NETZ/g, 'Central de Ajuda e Base de Conhecimento | NETZ');
    res = res.replace(/<title>Centro de Ayuda y Base de Conocimientos \| NETZ<\/title>/g, '<title>Central de Ajuda e Base de Conhecimento | NETZ</title>');

    // Box 1
    res = replaceFlexible(res,
        'Ao confiar em nossa infraestrutura, garantimos 99.9% de disponibilidade em todos os serviços fornecidos. en cualquier servicio que ofrecemos, fuera de cualquier mantenimiento estándar que podamos proporcionar.',
        'Ao confiar na infraestrutura da NETZ, garantimos 99.9% de uptime para todos os serviços fornecidos, assegurando máxima estabilidade contínua ao seu projeto.'
    );

    // Box 3
    res = replaceFlexible(res,
        'Atendimento humanizado e especializado disponível em múltiplos canais para apoiar seu crescimento online. Estamos à disposição para ajudar com sua hospedagem, e você pode entrar em contato conosco por teléfono, correo electrónico o chat en vivo.',
        'Atendimento humanizado e especializado disponível em múltiplos canais para apoiar seu crescimento online. Estamos à disposição para ajudar com sua hospedagem via WhatsApp, e-mail ou chat ao vivo 24 horas por dia.'
    );

    // Box 4
    res = replaceFlexible(res,
        'A continuación hay un resumen de las facturas seleccionadas y la deuda total para pagarlas en su totalidad. Para realizar el pago, por favor, únicamente seleccione el método de pago establecido más abajo.<br><br>',
        'Gerencie suas faturas, visualize histórico financeiro e renove seus serviços com facilidade e segurança através da Área do Cliente com opções de pagamento flexíveis.<br><br>'
    );

    return res;
}

// 2. Global navbar & common static words across all BR files
const globalNavbarReplacements = [
    ['>Nuevo<', '>Novo<'],
    ['class="nav-new-tag">Nuevo</span>', 'class="nav-new-tag">Novo</span>'],
    ['<span class="nav-new-tag">Nuevo</span>', '<span class="nav-new-tag">Novo</span>'],
    ['Linux no administrado', 'Linux Não Gerenciado'],
    ['Linux no Administrado', 'Linux Não Gerenciado'],
    ['Linux Administrado', 'Linux Gerenciado'],
    ['Linux administrado', 'Linux Gerenciado'],
    ['Windows no administrado', 'Windows Não Gerenciado'],
    ['Windows no Administrado', 'Windows Não Gerenciado'],
    ['Windows Administrado', 'Windows Gerenciado'],
    ['Windows administrado', 'Windows Gerenciado'],
    ['Hosting Exclusivo<span>Recursos exclusivos</span>', 'Hospedagem Exclusiva<span>Recursos Exclusivos</span>'],
    ['Hosting Exclusivo', 'Hospedagem Exclusiva'],
    ['Radio Streaming<span>Áudio limpo e fluido', 'Radio Streaming<span>Áudio limpo e fluido'],
    ['Video Streaming<span>Qualidade máxima 720p', 'Video Streaming<span>Qualidade máxima 720p']
];

console.log('🚀 Aplicando correções definitivas em centro-de-ayuda e navbars BR...');

const files = fs.readdirSync(localesBrDir).filter(f => f.endsWith('.html'));

for (const file of files) {
    const srcPath = path.join(localesBrDir, file);
    let content = fs.readFileSync(srcPath, 'utf8');

    // Navbar fixes on all pages
    for (const [from, to] of globalNavbarReplacements) {
        content = replaceFlexible(content, from, to);
    }

    // Specific centro-de-ayuda fixes
    if (file === 'centro-de-ayuda.html') {
        content = fixCentroDeAyuda(content);
    }

    fs.writeFileSync(srcPath, content, 'utf8');
    fs.writeFileSync(path.join(brDir, file), content, 'utf8');
    if (fs.existsSync(distBrDir)) {
        fs.writeFileSync(path.join(distBrDir, file), content, 'utf8');
    }

    console.log(`✅ Processado: ${file}`);
}

console.log('🎉 Todas as páginas BR atualizadas com sucesso!');
