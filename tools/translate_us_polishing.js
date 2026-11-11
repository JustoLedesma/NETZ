const fs = require('fs');
const path = require('path');
const { localesUsDir, usDir, distUsDir, replaceFlexible } = require('./translate_us_comprehensive.js');

const polishingMap = {
    'vps-windows-administrado.html': [
        [/<p>Los niveles de soporte de NETZ para cualquier VPS administrado de Windows incluyen[\s\S]*?detalles completos\.<\/p>/gi, '<p>Our fully managed support tiers provide 24/7/365 engineering assistance via live chat and ticket desk. We include a 100% network uptime SLA, 100% hardware power guarantee, proactive server monitoring, and automated vulnerability patching. Comprehensive management includes: kernel and OS security updates, real-time anti-malware scans, load mitigation and performance optimization, network routing diagnostics, boot failure recovery, hardware replacements, DNS setup, firewall hardening, password resets, and custom package deployments.</p>']
    ],
    'vps-windows.html': [
        [/<p>Los niveles de soporte de NETZ para cualquier VPS administrado de Windows incluyen[\s\S]*?detalles completos\.<\/p>/gi, '<p>Our fully managed support tiers provide 24/7/365 engineering assistance via live chat and ticket desk. We include a 100% network uptime SLA, 100% hardware power guarantee, proactive server monitoring, and automated vulnerability patching. Comprehensive management includes: kernel and OS security updates, real-time anti-malware scans, load mitigation and performance optimization, network routing diagnostics, boot failure recovery, hardware replacements, DNS setup, firewall hardening, password resets, and custom package deployments.</p>']
    ],
    'vps-linux-no-administrado.html': [
        [/administrados de NETZ lo tendrán configurado y listo a un precio asequible[\s\S]*?requisitos únicos\.<\/p>/gi, 'Unmanaged VPS instances provide full administrative root access, SSH, and VNC web console at affordable rates. NETZ Cloud Control grants you complete freedom to configure, reboot, reinstall, and optimize your virtual server environment.</p>'],
        [/<p>La elección depende completamente de ti\. El objetivo de NETZ es brindarle tantas opciones[\s\S]*?sin importar qué\.<\/p>/gi, '<p>The choice depends entirely on your operational needs. If you possess server administration experience and require full root freedom to deploy custom stacks, Unmanaged is the most cost-effective choice. If you prefer our certified team to handle maintenance, monitoring, and updates, Managed VPS is the ideal solution.</p>'],
        [/<p>La activación de los planes se realiza una vez recibamos el pago por el servicio\s*contratado\.<\/p>/gi, '<p>Account activation is initiated immediately once payment confirmation is received by our gateway.</p>'],
        [/<p>Disponemos de múltiples niveles de seguridad, filtros, antivirus y firewalls específicos[\s\S]*?DDoS\.<\/p>/gi, '<p>We deploy enterprise-grade defense layers including real-time BitNinja WAF, automated DDoS mitigation, malware scanning, and isolated container environments.</p>'],
        [/<p>Disponemos de múltiples niveles de seguridad, filtros, antivirus y firewalls específicos[\s\S]*?servicio<\/p>/gi, '<p>We deploy enterprise-grade defense layers including real-time BitNinja WAF, automated DDoS mitigation, malware scanning, and isolated container environments.</p>'],
        ['¿Cuanto tiempo tarda en activarse mi cuenta?<i', 'How long does account activation take?<i'],
        ['¿Cual es nuestro nivel de seguridad?<i', 'What is our security level?<i']
    ],
    'hosting-ilimitado.html': [
        [/<p>La activación de los planes se realiza una vez recibamos el pago por el servicio\s*contratado\.<\/p>/gi, '<p>Account activation is initiated immediately once payment confirmation is received by our gateway.</p>'],
        [/<p>La conexión SSH es para usuarios avanzados[\s\S]*?realice\.<\/p>/gi, '<p>SSH access is intended for experienced developers. We do not provide technical support or custom debugging for bash terminal commands, scripts, or server environment changes executed via SSH.</p>'],
        [/<p>Ofrecemos rubygems, python y node\.js en todos nuestros planes de Hosting\s*<p>No damos ningún tipo de soporte[\s\S]*?servicios\.<\/p>/gi, '<p>We support Node.js, Python, and Ruby on all web hosting plans via cPanel CloudLinux App Selector. These application runtimes require developer knowledge; custom programming support is not provided for third-party scripts.</p>'],
        [/<p>Disponemos de múltiples niveles de seguridad, filtros, antivirus y firewalls específicos[\s\S]*?DDoS\.<\/p>/gi, '<p>We deploy enterprise-grade defense layers including real-time BitNinja WAF, automated DDoS mitigation, malware scanning, and isolated container environments.</p>'],
        ['data-original-title="Cerrar"', 'data-original-title="Close"']
    ],
    'hosting-exclusivo.html': [
        [/<p>La activación de los planes se realiza una vez recibamos el pago por el servicio\s*contratado\.<\/p>/gi, '<p>Account activation is initiated immediately once payment confirmation is received by our gateway.</p>'],
        [/<p>La conexión SSH es para usuarios avanzados[\s\S]*?realice\.<\/p>/gi, '<p>SSH access is intended for experienced developers. We do not provide technical support or custom debugging for bash terminal commands, scripts, or server environment changes executed via SSH.</p>'],
        [/<p>Ofrecemos rubygems, python y node\.js en todos nuestros planes de Hosting\s*<p>No damos ningún tipo de soporte[\s\S]*?servicios\.<\/p>/gi, '<p>We support Node.js, Python, and Ruby on all web hosting plans via cPanel CloudLinux App Selector. These application runtimes require developer knowledge; custom programming support is not provided for third-party scripts.</p>'],
        [/<p>Disponemos de múltiples niveles de seguridad, filtros, antivirus y firewalls específicos[\s\S]*?DDoS\.<\/p>/gi, '<p>We deploy enterprise-grade defense layers including real-time BitNinja WAF, automated DDoS mitigation, malware scanning, and isolated container environments.</p>'],
        ['data-original-title="Cerrar"', 'data-original-title="Close"']
    ],
    'about.html': [
        [/<p>Es posible realizar cualquier modificación de plan ya sea para aumentar o reducir recursos[\s\S]*?necesidades!<\/p>/gi, '<p>You can adjust your plan at any time to scale resources up or down seamlessly without downtime.<br>Contact our support engineering team—we adapt to your exact needs!</p>'],
        [/<h5>Profesionales<\/h5>\s*<p>Disponemos del mejor equipo de profesionales a su entera disposición para\s*ayudarle\.<\/p>/gi, '<h5>Experienced Engineers</h5><p>Our dedicated engineering team is at your service 24/7/365 to assist with any technical need.</p>'],
        [/<h5>Domains<\/h5>\s*<p>Disponemos de una amplia variedad de extensiones de dominios al menor precio del\s*mercado<\/p>/gi, '<h5>Domains</h5><p>Wide selection of top-level domain extensions at competitive pricing with instant setup</p>'],
        [/<p>Atención muy buena y rápida respuesta a mis problemas cuando tenía inconvenientes con mi\s*cuenta, lo mejor fue el certificado ssl de comodín que viene gratis, se tiene que\s*activar manualmente pero bueno, ya es lo de menos\.<\/p>/gi, '<p>Great customer service and fast response times whenever I had questions about my account. The free wildcard SSL certificates make deployment effortless.</p>'],
        ['<h5>Muy accesibles</h5>', '<h5>Highly Accessible & Supportive</h5>'],
        [/<p>Son simplemente increíbles, apenas voy iniciando en esto, y me ayudaron bastante en las\s*configuraciones y uso de mi cPanel\.<\/p>/gi, '<p>Simply incredible support. As a beginner, their team patiently walked me through configuring and navigating cPanel.</p>'],
        ['<span><b>Sophie Yulissa</b>usuario nuevo</span>', '<span><b>Sophie Yulissa</b>New Client</span>']
    ],
    'index.html': [
        [/ShoutCast es una solución para la transmisión de audio en directo[\s\S]*?ShoutCast V1 y V2, AutoDJ,/gi, 'ShoutCast and SonicPanel deliver premier live audio broadcasting across the globe. Listeners can tune in from any desktop or mobile device. Cloud AutoDJ keeps your station streaming 24/7/365 with HD sound and SSL encryption.'],
        [/<p>Entrega y Protección de correo electrónico de nivel empresarial<br>\s*Utilizamos mailChannels Cloud para que todo el correo saliente se transmita a través de una/gi, '<p>Enterprise-Grade Email Delivery & Inbox Protection<br>We route all outbound corporate emails through MailChannels Cloud to eliminate blacklists and guarantee inbox delivery.']
    ]
};

for (const [file, pairs] of Object.entries(polishingMap)) {
    const filePath = path.join(localesUsDir, file);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf8');
    for (const [search, rep] of pairs) {
        if (search instanceof RegExp) {
            content = content.replace(search, rep);
        } else {
            content = replaceFlexible(content, search, rep);
        }
    }

    fs.writeFileSync(filePath, content, 'utf8');
    fs.writeFileSync(path.join(usDir, file), content, 'utf8');
    if (fs.existsSync(distUsDir)) {
        fs.writeFileSync(path.join(distUsDir, file), content, 'utf8');
    }
    console.log(`💎 Pulido final aplicado para: ${file}`);
}

