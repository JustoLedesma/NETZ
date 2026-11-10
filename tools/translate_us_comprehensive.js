const fs = require('fs');
const path = require('path');

const localesUsDir = path.join(__dirname, '..', 'locales', 'us');
const usDir = path.join(__dirname, '..', 'us');
const distUsDir = path.join(__dirname, '..', 'dist', 'us');

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

function safeReplace(content, pairs) {
    let res = content;
    for (const [from, to] of pairs) {
        res = replaceFlexible(res, from, to);
    }
    return res;
}

// 1. Global replacements across all files
const globalReplacements = [
    // Static navbar dropdown items and links
    [/>Dominios</g, '>Domains<'],
    [/>Empresa</g, '>Company<'],
    [/>Inicio</g, '>Home<'],
    [/>Hosting</g, '>Hosting<'],
    [/>Servicios</g, '>Services<'],
    [/>Contacto</g, '>Contact<'],
    [/>Contáctenos</g, '>Contact Us<'],
    [/>Iniciar Sesión</g, '>Sign In<'],
    [/>Regístrate</g, '>Register<'],
    [/>¿Olvidó Su Contraseña\?</g, '>Forgot Password?<'],
    [/>Revisión Y Pago</g, '>Review & Checkout<'],
    [/>Área De Clientes</g, '>Client Area<'],
    [/>Gestiona Tu Cuenta</g, '>Manage Your Account<'],
    [/>Preguntas Y Respuestas</g, '>Questions & Answers<'],
    [/>Comprobador De Dominio</g, '>Domain Checker<'],
    [/>Hosting Ilimitado</g, '>Unlimited Hosting<'],
    [/>Hosting Exclusivo</g, '>Dedicated Hosting<'],
    [/>Radio Streaming</g, '>Radio Streaming<'],
    [/>Video Streaming</g, '>Video Streaming<'],
    [/>Linux No Administrado</g, '>Unmanaged Linux<'],
    [/>Linux Administrado</g, '>Managed Linux<'],
    [/>Windows No Administrado</g, '>Unmanaged Windows<'],
    [/>Windows Administrado</g, '>Managed Windows<'],
    [/>Reseller CPanel & WHM</g, '>Reseller cPanel & WHM<'],
    [/>Reseller DirectAdmin</g, '>Reseller DirectAdmin<'],
    [/>Sobre Nosotros</g, '>About Us<'],
    [/>Aviso Legal</g, '>Legal Notice<'],
    [/>Política de Privacidad</g, '>Privacy Policy<'],
    [/>Términos de Servicio</g, '>Terms of Service<'],
    [/>Términos del Servicio</g, '>Terms of Service<'],
    [/>Gestiones de Usuario</g, '>Account Management<'],
    [/>Métodos de pagos</g, '>Payment Methods<'],
    [/>Contactos Rápido</g, '>Quick Contacts<'],
    ['Hecho con amor en Paraguay por NETZ', 'Engineered with pride by NETZ'],
    ['Español - Paraguay', 'English - United States'],
    ['Última Actualización: 2026', 'Last Updated: 2026'],
    ['Al utilizar nuestros servicios aceptas el', 'By using our services you accept our'],
    ['Nuestro equipo de soporte está aquí para usted 24/7', 'Our support engineering team is here for you 24/7'],
    [/de nuestra sección de atención al cliente\./g, 'through our 24/7 customer support channels.'],
    [/sección de <a href="centro-de-ayuda">preguntas y respuestas<\/a>/g, '<a href="centro-de-ayuda">Help Center & FAQ</a> section'],
    [/seccion de <a href="centro-de-ayuda">preguntas y respuestas<\/a>/g, '<a href="centro-de-ayuda">Help Center & FAQ</a> section'],
    ['¿Todavía tienes preguntas?', 'Still have questions?'],
    ['PUEDES HABLAR CON NOSOTROS.', 'GET IN TOUCH WITH US TODAY.'],
    ['PUEDES\n                        HABLAR CON NOSOTROS.', 'GET IN TOUCH WITH US TODAY.'],
    ['¿Necesitas<br>ayuda inmediata?', 'Need<br>Immediate Help?'],
    ['¿Necesitas ayuda inmediata?', 'Need Immediate Help?'],
    ['Nuestro equipo de apoyo está a su disposición<br>24 horas al\n                        día, 7 días a la semana.', 'Our specialized support team is available<br>24 hours a day, 7 days a week.'],
    ['Nuestro equipo de apoyo está a su disposición<br>24 horas al día, 7 días a la semana.', 'Our specialized support team is available<br>24 hours a day, 7 days a week.'],
    ['Abrir Ticket', 'Open Support Ticket'],
    ['Realizar Pago', 'Make Payment'],
    ['Pagar Ahora', 'Pay Now'],
    ['Comprar Hosting', 'Order Web Hosting'],
    ['Soporte 24/7', '24/7 Technical Support'],
    ['¡Empieza ahora!', 'Get Started Now!'],
    ['Empieza ahora', 'Get Started Now'],
    ['Comenzar ahora', 'Get Started Now'],
    ['Contratar ahora', 'Order Now'],
    ['Comprar ahora', 'Buy Now'],
    ['Ver Planes', 'View Plans'],
    ['Ver planes', 'View Plans'],
    ['Mes', 'Month'],
    ['/mes', '/month'],
    ['Año', 'Annual'],
    ['/año', '/year'],
    ['Mensual', 'Monthly'],
    ['Anual', 'Annual'],
    ['2 MESES GRATIS CON EL PAGO ANUAL', '2 MONTHS FREE ON ANNUAL BILLING'],
    ['CHEQUEA NUESTROS PLANES DE HOSTING', 'EXPLORE OUR HOSTING PLANS'],
    ['Recursos exclusivos con mayor velocidad!', 'Exclusive Resources with Maximum Speed!'],
    ['Haga Que Su Empresa Este En Línea Hoy Mismo Con Unidades SSD Rápidas, Creador De Sitios Web Gratuito *', 'Get Your Business Online Today with High-Speed SSD Drives, Free Website Builder *'],
    ['Almacenamiento Web De Correo Ilimitado', 'Unlimited Business Email Storage'],
    ['Certificados SSL Gratuitos Incluidos', 'Free SSL Certificates Included'],
    ['Servicio sin límites de<br>recursos', 'Unmetered Resources'],
    ['Servicio sin límites de<br>\n                        recursos', 'Unmetered Resources'],
    ['Servicio sin límites de\n                        recursos', 'Unmetered Resources'],
    ['Recursos exclusivos <br>con mayor velocidad!', 'Dedicated Resources <br>with Maximum Speed!'],
    ['¡Administre usted mismo!', 'Full Root Access!'],
    ['Todo el poder <br>NINGUNO de los problemas', 'All the Power <br>NONE of the Hassle'],
    ['¡Control Total por RDP!', 'Full RDP Access!'],
    ['Servidor Administrado', 'Fully Managed Server'],
    ['Sonido limpio y fluido <br>Sonido de Calidad', 'Crystal Clear Audio <br>HD Quality'],
    ['Calidad máxima 720p <br>Streaming SSL', 'Max 720p Quality <br>SSL Streaming'],
    ['2 CPU - 2Gb Ram, por cPanel', '2 CPU - 2GB RAM per cPanel account'],
    ['2 CPU - 2Gb Ram, por cuenta', '2 CPU - 2GB RAM per account'],
    ['Consulta de disponibilidad', 'Check Availability'],
    ['Transfiera su dominio', 'Transfer your domain'],
    ['Dominio Gratis', 'Free Domain'],
    ['(por cuenta de cPanel)', '(per cPanel account)'],
    ['(por cuenta de alojamiento)', '(per hosting account)'],
    ['(Certificado SSL Gratis<br>en todas las cuentas)', '(Free SSL Certificate<br>on all accounts)'],
    ['(Certificado SSL Gratis en todas las cuentas)', '(Free SSL Certificate on all accounts)'],
    ['Gestión centralizada', 'Centralized Management'],
    ['Protección DDoS', 'DDoS Protection'],
    ['Protección DDoS de nivel empresarial', 'Enterprise-Grade DDoS Protection'],
    ['Soporte técnico 24/7', '24/7 Technical Support'],
    ['MagicSpam Protección', 'MagicSpam Protection'],
    ['99,99% de garantía de tiempo de actividad', '99.99% Uptime Guarantee'],
    ['99,9% de tiempo de <br>Actividad garantizado', '99.9% Guaranteed<br>Uptime SLA'],
    ['99,9% de tiempo de<br>Actividad garantizado', '99.9% Guaranteed<br>Uptime SLA'],
    ['99.9% de garantía de tiempo de actividad', '99.9% Uptime Guarantee'],
    ['Migración libre', 'Free Migration'],
    ['Migración', 'Free Migration'],
    ['Simultaneous Listeners <b>Ilimitado</b>', 'Simultaneous Listeners <b>Unlimited</b>'],
    ['Transferencia <b>Ilimitada</b>', 'Bandwidth <b>Unlimited</b>'],
    ['Calidad <b>HD</b>', 'Quality <b>HD</b>'],
    ['AutoDJ <b>Incluido</b>', 'AutoDJ <b>Included</b>'],
    ['Panel <b>SonicPanel</b>', 'Control Panel <b>SonicPanel</b>']
];

module.exports = {
    safeReplace,
    replaceFlexible,
    globalReplacements,
    localesUsDir,
    usDir,
    distUsDir
};
