const fs = require('fs');
const path = require('path');

const localesUsDir = path.join(__dirname, '..', 'locales', 'us');
const usDir = path.join(__dirname, '..', 'us');
const distUsDir = path.join(__dirname, '..', 'dist', 'us');

// 1. Navbar Regex Replacer (handles multi-line whitespace)
function cleanNavbar(html) {
    let res = html;
    res = res.replace(/Hosting\s+Ilimitado/g, 'Unlimited Hosting');
    res = res.replace(/Hosting\s+Exclusivo/g, 'Dedicated Hosting');
    res = res.replace(/Linux\s+no\s+administrado/g, 'Unmanaged Linux');
    res = res.replace(/Linux\s+Administrado/g, 'Managed Linux');
    res = res.replace(/Windows\s+no\s+Administrado/g, 'Unmanaged Windows');
    res = res.replace(/Windows\s+Administrado/g, 'Managed Windows');
    res = res.replace(/Radio\s+Streaming/g, 'Radio Streaming');
    res = res.replace(/Video\s+Streaming/g, 'Video Streaming');
    res = res.replace(/Reseller\s+cPanel\s*&\s*WHM/g, 'Reseller cPanel & WHM');
    res = res.replace(/Reseller\s+DirectAdmin/g, 'Reseller DirectAdmin');
    res = res.replace(/Comprobador\s+de\s+dominio/g, 'Domain Checker');
    res = res.replace(/Transferencia\s+de\s+dominio/g, 'Domain Transfer');
    res = res.replace(/Sobre\s+Nosotros/g, 'About Us');
    res = res.replace(/Términos\s+de\s+Servicio/g, 'Terms of Service');
    res = res.replace(/Politica\s+de\s+Privacidad/g, 'Privacy Policy');
    res = res.replace(/Aviso\s+Legal/g, 'Legal Notice');
    res = res.replace(/Cóntactenos/g, 'Contact Us');
    res = res.replace(/Iniciar\s+Sesión/g, 'Sign In');
    res = res.replace(/Servicio\s+sin\s+límites\s+de\s+recursos/g, 'Unmetered Resources');
    res = res.replace(/Recursos\s+exclusivos\s*<br>\s*con\s*mayor\s+velocidad!/g, 'Exclusive Resources <br>with Higher Speed!');
    res = res.replace(/¡Administre\s+usted\s+mismo!/g, 'Full Root Access!');
    res = res.replace(/Todo\s+el\s+poder\s*<br>\s*NINGUNO\s+de\s+los\s+problemas/g, 'All the Power <br>NONE of the Hassle');
    res = res.replace(/¡Control\s+Total\s+por\s+RDP!/g, 'Full RDP Access!');
    res = res.replace(/Servidor\s+Administrado/g, 'Fully Managed Server');
    res = res.replace(/Sonido\s+limpio\s+y\s+fluido\s*<br>\s*Sonido\s+de\s+Calidad/g, 'Crystal Clear Audio <br>HD Quality');
    res = res.replace(/Calidad\s+máxima\s+720p\s*<br>\s*Streaming\s+SSL/g, 'Max 720p Quality <br>SSL Streaming');
    res = res.replace(/2\s+CPU\s*-\s*2Gb\s+Ram,\s*por\s+cPanel/g, '2 CPU - 2GB RAM per account');
    res = res.replace(/2\s+CPU\s*-\s*2Gb\s+Ram,\s*por\s+cuenta/g, '2 CPU - 2GB RAM per account');
    res = res.replace(/Consulta\s+de\s+disponibilidad/g, 'Check Availability');
    res = res.replace(/Transfiera\s+su\s+dominio/g, 'Transfer your domain');
    return res;
}

// 2. Comprehensive Meta Translations
const metaMap = {
    'index.html': {
        title: 'NETZ | Unlimited Web Hosting, VPS Servers, Streaming & Domains',
        desc: 'Leading global provider for high-performance Unlimited Web Hosting, Linux & Windows VPS Servers, Radio & Video Streaming, and Domain Registration. 24/7 technical support and instant provisioning worldwide.'
    },
    'about.html': {
        title: 'About Us | Infrastructure & Engineering Team | NETZ',
        desc: 'Discover our mission, global cloud infrastructure, and 24/7 support engineering team delivering high-performance web hosting solutions.'
    },
    'audio-streaming.html': {
        title: 'HD Radio Streaming with AutoDJ & SonicPanel | NETZ',
        desc: 'Live HD audio streaming service with SonicPanel, cloud AutoDJ, unmetered bandwidth, and responsive HTML5 players for Android & iOS.'
    },
    'aviso-legal.html': {
        title: 'Legal Notice & Corporate Information | NETZ',
        desc: 'Legal notice, terms of use, and corporate information for the NETZ global cloud and web hosting platform.'
    },
    'buscar-dominios.html': {
        title: 'Domain Name Search & Instant Registration | NETZ',
        desc: 'Search, check availability, and register your domain name (.com, .net, .org, .online, .app, and more) at competitive rates with instant global activation.'
    },
    'centro-de-ayuda.html': {
        title: 'Help Center & Knowledgebase | NETZ',
        desc: 'Step-by-step guides, configuration tutorials, and frequently asked questions about Web Hosting, Domains, VPS Servers, and Streaming at NETZ.'
    },
    'contact.html': {
        title: 'Contact Us & 24/7 Technical Support | NETZ',
        desc: 'Get in touch with our international technical support team. Available 24/7 via WhatsApp, email, and live ticket system.'
    },
    'hosting-exclusivo.html': {
        title: 'Dedicated Enterprise Web Hosting | NETZ',
        desc: 'Enterprise dedicated web hosting with isolated resources, pure NVMe storage, and maximum speed for high-traffic operations.'
    },
    'hosting-ilimitado.html': {
        title: 'Unlimited NVMe SSD Web Hosting with cPanel | NETZ',
        desc: 'High-performance Unlimited Web Hosting plans with ultra-fast NVMe SSD storage, cPanel control panel, unlimited corporate emails, and 24/7 support.'
    },
    'politica-de-privacidad.html': {
        title: 'Privacy Policy & Data Protection | NETZ',
        desc: 'Learn about our data protection standards, client confidentiality, cookie policy, and information security at NETZ.'
    },
    'reseller-cpanel.html': {
        title: 'cPanel & WHM Reseller Hosting Multi-Account | NETZ',
        desc: 'Launch or grow your hosting company with cPanel & WHM Reseller plans. Pure NVMe storage, white-label branding, and 24/7 care.'
    },
    'reseller-directadmin.html': {
        title: 'Cost-Effective DirectAdmin Reseller Hosting | NETZ',
        desc: 'High-performance DirectAdmin Reseller plans with unlimited accounts, NVMe storage, and competitive pricing.'
    },
    'terminos-del-servicio.html': {
        title: 'Terms of Service & Refund Policy | NETZ',
        desc: 'Terms, service conditions, provisioning policies, and transparent refund terms for NETZ clients worldwide.'
    },
    'video-streaming.html': {
        title: 'Live HD Video Streaming with SSL | NETZ',
        desc: 'Live HD video streaming with multi-device support, HTML5 players, low latency, and secure SSL encryption.'
    },
    'vps-linux-administrado.html': {
        title: 'Managed Linux VPS Servers 24/7 | NETZ',
        desc: 'High-speed Linux VPS servers with full management included, NVMe storage, 24/7 support, and proactive monitoring.'
    },
    'vps-linux-no-administrado.html': {
        title: 'Unmanaged Linux VPS Servers Root | NETZ',
        desc: 'Linux VPS servers with full root access, modern generation CPUs, and NVMe drives for developers and enterprises.'
    },
    'vps-linux.html': {
        title: 'High-Performance Linux VPS Servers | NETZ',
        desc: 'All the power and scalability of Linux VPS servers for your web applications, databases, and demanding projects.'
    },
    'vps-windows-administrado.html': {
        title: 'Managed Windows VPS Servers | NETZ',
        desc: 'VPS servers with licensed Windows Server, 24/7 managed support, and enterprise-grade hardware for businesses.'
    },
    'vps-windows-no-administrado.html': {
        title: 'Unmanaged Windows VPS Servers RDP | NETZ',
        desc: 'Virtual Windows Server VPS with ultra-fast SSD storage and full RDP access for enterprise applications.'
    },
    'vps-windows.html': {
        title: 'Windows VPS Servers with Official License | NETZ',
        desc: 'Windows VPS servers with licensed Windows Server, SSD storage, and enterprise remote desktop performance.'
    },
    '404.html': {
        title: 'Page Not Found (404) | NETZ',
        desc: 'The page you are looking for does not exist or has been moved.'
    }
};

function cleanMeta(html, page) {
    let res = html;
    const meta = metaMap[page];
    if (meta) {
        res = res.replace(/<title>.*?<\/title>/gi, `<title>${meta.title}</title>`);
        res = res.replace(/<meta property="og:title" content=".*?"/gi, `<meta property="og:title" content="${meta.title}"`);
        res = res.replace(/<meta name="twitter:title" content=".*?"/gi, `<meta name="twitter:title" content="${meta.title}"`);
        res = res.replace(/<meta name="description"\s+content=".*?"/gi, `<meta name="description" content="${meta.desc}"`);
        res = res.replace(/<meta property="og:description"\s+content=".*?"/gi, `<meta property="og:description" content="${meta.desc}"`);
        res = res.replace(/<meta name="twitter:description"\s+content=".*?"/gi, `<meta name="twitter:description" content="${meta.desc}"`);
        res = res.replace(/<meta name="keywords"\s+content=".*?"/gi, `<meta name="keywords" content="web hosting, unlimited hosting, vps servers, radio streaming, domain registration, netz"`);
    }
    return res;
}

// 3. Process all files in locales/us/
const files = fs.readdirSync(localesUsDir).filter(f => f.endsWith('.html'));

console.log(`Iniciando limpieza profunda de Navbar, Metas y Contenido para ${files.length} archivos...`);

for (const file of files) {
    const filePath = path.join(localesUsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Limpieza de navbar y metas
    content = cleanNavbar(content);
    content = cleanMeta(content, file);

    // Escribir en locales/us, us/ y dist/us/
    fs.writeFileSync(filePath, content, 'utf8');
    fs.writeFileSync(path.join(usDir, file), content, 'utf8');
    if (fs.existsSync(distUsDir)) {
        fs.writeFileSync(path.join(distUsDir, file), content, 'utf8');
    }
    console.log(`✅ ${file} limpiado`);
}

console.log('✨ Limpieza profunda de Navbar y Metas finalizada.');

