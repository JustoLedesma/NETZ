const fs = require('fs');
const path = require('path');

const localesUsDir = path.join(__dirname, '..', 'locales', 'us');
const usDir = path.join(__dirname, '..', 'us');
const distUsDir = path.join(__dirname, '..', 'dist', 'us');

// Helper to replace text with regex ignoring varying spaces and newlines
function replaceFuzzy(content, search, replacement) {
    if (content.includes(search)) {
        return content.split(search).join(replacement);
    }
    const words = search.trim().split(/\s+/).map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    if (words.length === 0) return content;
    const pattern = new RegExp(words.join('\\s+'), 'g');
    return content.replace(pattern, replacement);
}

function applyList(content, list) {
    let res = content;
    for (const [s, r] of list) {
        res = replaceFuzzy(res, s, r);
    }
    return res;
}

// Global replacements across all templates
const globalPairs = [
    ['lang="es"', 'lang="en-US"'],
    ['data-country="py"', 'data-country="us"'],
    ['content="es_LA"', 'content="en_US"'],
    ['content="es_ES"', 'content="en_US"'],
    ['"inLanguage": "es"', '"inLanguage": "en"'],
    ['"knowsLanguage": ["es", "Spanish"]', '"knowsLanguage": ["en", "English"]'],

    // Common meta descriptions
    ['content="Proveedor global de Web Hosting Ilimitado, Servidores VPS, Streaming de Audio/Video y Registro de Dominios en español."', 'content="Global provider of Unlimited Web Hosting, VPS Servers, Audio/Video Streaming, and Domain Registration."'],
    ['content="Plataforma líder en Web Hosting Ilimitado de alto rendimiento, Servidores VPS Linux y Windows, Streaming de Radio y Video, y Registro de Dominios. Soporte 24/7 y activación inmediata a nivel mundial."', 'content="Leading platform for high-performance Unlimited Web Hosting, Linux & Windows VPS Servers, Radio & Video Streaming, and Domain Registration. 24/7 support and instant activation worldwide."'],
    ['content="web hosting ilimitado, comprar hosting, servidores vps administrados, vps linux, vps windows, comprar dominios baratos, streaming radio sonicpanel, video streaming ssl, hosting revendedor, hosting cpanel, netz"', 'content="unlimited web hosting, buy hosting, managed vps servers, linux vps, windows vps, cheap domains, radio streaming sonicpanel, video streaming ssl, reseller hosting, cpanel hosting, netz"'],

    // Common Navbar
    ['>Inicio<', '>Home<'],
    ['>Inicio <', '>Home <'],
    ['Servicio sin límites de recursos', 'Unmetered Resources'],
    ['Servicio sin límites de\n                                                recursos', 'Unmetered Resources'],
    ['Recursos exclusivos <br>con mayor velocidad!', 'Exclusive Resources <br>with Higher Speed!'],
    ['Recursos exclusivos <br>con\n                                                mayor velocidad!', 'Exclusive Resources <br>with Higher Speed!'],
    ['¡Administre usted mismo!', 'Full Root Access!'],
    ['Todo el poder <br>NINGUNO de los problemas', 'All the Power <br>NONE of the Hassle'],
    ['¡Control Total por RDP!', 'Full RDP Access!'],
    ['Sonido limpio y fluido <br>Sonido de Calidad', 'Crystal Clear Audio <br>HD Quality'],
    ['Calidad máxima 720p <br>Streaming SSL', 'Max 720p Quality <br>SSL Streaming'],
    ['2 CPU - 2Gb Ram, por cPanel', '2 CPU - 2GB RAM per account'],
    ['2 CPU - 2Gb Ram, por cuenta', '2 CPU - 2GB RAM per account'],
    ['Consulta de disponibilidad', 'Check Availability'],
    ['Transfiera su dominio', 'Transfer your domain'],
    ['>Sobre Nosotros<', '>About Us<'],
    ['>Términos de Servicio<', '>Terms of Service<'],
    ['>Politica de Privacidad<', '>Privacy Policy<'],
    ['>Aviso Legal<', '>Legal Notice<'],
    ['>Cóntactenos<', '>Contact Us<'],
    ['>Iniciar Sesión<', '>Sign In<'],
    ['placeholder="Contraseña"', 'placeholder="Password"'],
    ['placeholder="E-mail"', 'placeholder="Email Address"'],
    ['placeholder="Buscador de Dominios"', 'placeholder="Search domain name here..."'],
    ['title="login"', 'title="Sign In"'],
    ['title="Buscar"', 'title="Search"'],
    ['value="Buscar"', 'value="Search"'],
    ['title="Transferir"', 'title="Transfer"'],
    ['value="Transferir"', 'value="Transfer"'],

    // Common buttons & badges
    ['<span class="change-box-text">Mensual</span>', '<span class="change-box-text">Monthly</span>'],
    ['<span class="change-box-text">Anual</span>', '<span class="change-box-text">Yearly</span>'],
    ['<span class="change-box-text">Año</span>', '<span class="change-box-text">Yearly</span>'],
    ['>Mensual<', '>Monthly<'],
    ['>Anual<', '>Yearly<'],
    ['>Año<', '>Yearly<'],
    ['>Contratar<', '>Order Now<'],
    ['>Ver Planes<', '>View Plans<'],
    ['>Ver planes<', '>View Plans<'],
    ['>Más Información<', '>More Info<'],
    ['>Saber más<', '>Learn More<'],
    ['>Comprar Ahora<', '>Buy Now<'],
    ['2 Meses Gratis con el pago anual', '2 Months Free with Annual Billing'],
    ['2 Meses Gratis con el pago Anual', '2 Months Free with Annual Billing'],
    ['2 meses gratis con el pago anual', '2 Months Free with Annual Billing'],
    ['Recursos exclusivos con mayor velocidad!', 'Exclusive resources with higher speed!'],
    ['CHEQUEA NUESTROS PLANES DE HOSTING', 'EXPLORE OUR WEB HOSTING PLANS'],
    ['Chequea nuestros planes de hosting', 'Explore our web hosting plans'],
    ['Preguntas frecuentes', 'Frequently Asked Questions'],
    ['En caso de que sus dudas no son aclaradas no dude en visitar nuestra', 'If your questions are not answered here, feel free to visit our'],
    ['base de conocimientos', 'Knowledgebase'],
    ['¿Qué nos hace tan Grandes?', 'What Makes Us Stand Out?'],
    ['Nuestras Características', 'Our Key Features'],
    ['Herramientas simples pero poderosas', 'Simple yet powerful tools'],
    ['Todo lo que necesitas y mucho más', 'Everything you need and much more'],
    ['In one place at an solo click de distancia.', 'In one place, just a single click away.'],
    ['In one place at an solo clic de distancia.', 'In one place, just a single click away.'],
    ['A un solo lugar a un solo clic de distancia', 'In one place, just a single click away'],
    ['A un solo lugar a un solo click de distancia.', 'In one place, just a single click away.'],
    ['Ver política de reembolsos', 'View refund policy'],
    ['/Mensual', ' /Month'],
    ['/Anual', ' /Year'],
    ['/Año', ' /Year'],

    // Common Footer
    ['Únete ahora y disfruta de los mejores precios de', 'Join now and enjoy the best prices for'],
    ['Únete Ahora Y Disfruta De Los Mejores Precios De', 'Join now and enjoy the best prices for'],
    ['Alojamiento Web Y Dominios', 'Web Hosting and Domains'],
    ['Ofrecemos servicios de Radio Streaming, Video Streaming, Hosting con recurso Ilimitado, Hosting exclusivos, Dominios.', 'We provide high-performance Radio Streaming, Video Streaming, Unlimited Web Hosting, Dedicated Hosting, and Domain Registration.'],
    ['Ofrecemos servicios de Radio Streaming, Video Streaming, Hosting con recurso ilimitado, Hosting exclusivos, Dominios.', 'We provide high-performance Radio Streaming, Video Streaming, Unlimited Web Hosting, Dedicated Hosting, and Domain Registration.'],
    ['REGÍSTRATE', 'REGISTER'],
    ['INICIAR SESIÓN', 'SIGN IN'],
    ['Gestiones de Usuario', 'Client Area'],
    ['Preguntas y Respuestas', 'Help Center & FAQ'],
    ['Preguntas Y Respuestas', 'Help Center & FAQ'],
    ['Contáctenos', 'Contact Us'],
    ['¿Olvidó su Contraseña?', 'Forgot Password?'],
    ['¿Olvidó Su Contraseña?', 'Forgot Password?'],
    ['Revisión Y Pago', 'Billing & Invoices'],
    ['Área De Clientes', 'Client Area'],
    ['Gestiona Tu Cuenta', 'Manage Account'],
    ['Comprobador de dominio', 'Domain Checker'],
    ['Comprobador De Dominio', 'Domain Checker'],
    ['Métodos de pagos', 'Payment Methods'],
    ['Contactos Rápido', 'Quick Contacts'],
    ['SOPORTE', 'SUPPORT'],
    ['SOBRE NOSOTROS', 'ABOUT US'],
    ['POLITICA DE PRIVACIDAD', 'PRIVACY POLICY'],
    ['AVISO LEGAL', 'LEGAL NOTICE'],
    ['TÉRMINOS DE SERVICIO', 'TERMS OF SERVICE'],
    ['Todos los derechos reservados.', 'All rights reserved.'],
    ['Hecho con amor en Paraguay por NETZ', 'Crafted with care by NETZ'],
    ['Our expert support team is here for you 24/7', 'Our expert support team is here for you 24/7'],
    ['Abrir un ticket', 'Open a Ticket'],
    ['Abrir un Ticket', 'Open a Ticket']
];

console.log('Cargando diccionarios de traducción para cada página...');

module.exports = {
    replaceFuzzy,
    applyList,
    globalPairs,
    localesUsDir,
    usDir,
    distUsDir
};
