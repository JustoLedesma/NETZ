const fs = require('fs');
const path = require('path');
const { localesUsDir, usDir, distUsDir, replaceFlexible, safeReplace } = require('./translate_us_comprehensive.js');
const faqEnglishMap = require('./faq_english_map.json');

console.log('🚀 Ejecutando pase de traducción ultra-profundo para US English...');

// 1. Deep index replacements
const indexDeepReplacements = [
    ['"description": "Proveedor global de Web Unlimited Hosting, Servidores VPS, Streaming de Audio/Video y Registro de Dominios en español."', '"description": "Leading global provider of Unlimited Web Hosting, VPS Cloud Servers, Audio & Video Streaming, and Domain Registration."'],
    ['title="Activación rápida"', 'title="Instant Activation"'],
    ['PERFECTO..</span>REGISTRO DE DOMINIOS<small>Al precio más accesible del mercado</small></h3>', 'PERFECT DOMAIN NAME..</span>DOMAIN REGISTRATION<small>At the most competitive prices in the industry</small></h3>'],
    ['<i class="circle-sub-title-header-slider">Alojamiento Web</i> Rápido y Seguro', '<i class="circle-sub-title-header-slider">Web Hosting</i> Fast & Secure'],
    ['Potencia tu presencia en línea con nuestro hosting confiable y de alto rendimiento.', 'Power your online presence with high-performance, ultra-reliable web hosting.'],
    ['Transmite tu música o programa en vivo con la mejor calidad de audio sin cortes.', 'Broadcast your music or live show with crystal-clear audio and zero interruptions.'],
    ['Control total, recursos dedicados y escalabilidad para tus proyectos más exigentes.', 'Full root control, dedicated cloud resources, and seamless scalability for your demanding projects.'],
    ['Rendimiento garantizado con discos NVMe ultrarrápidos.', 'Guaranteed enterprise performance with ultra-fast NVMe SSD storage.'],
    ['Haga que su empresa este en línea hoy mismo con unidades SSD rápidas, creador de sitios web gratuito y almacenamiento web de correo ilimitado.', 'Get your business online today with high-speed SSD drives, free website builder, and unlimited business email storage.'],
    ['<h5>Certificados SSL comodín</h5>', '<h5>Free Wildcard SSL Certificates</h5>'],
    ['<p>Instale un certificado SSL comodín totalmente validado de forma gratuita.</p>', '<p>Deploy fully validated Wildcard SSL certificates across all domains effortlessly at no cost.</p>'],
    ['<h5>Auto renovación</h5>', '<h5>Automated Renewal</h5>'],
    ['<p>Se instala una vez, se renueva automáticamente en la vida útil de la cuenta.</p>', '<p>Configured once, automatically renewed for the entire active lifetime of your account.</p>'],
    ['Garantía de disponibilidad del 99.9% en nuestros servicios.', '99.9% uptime SLA guarantee across all cloud services.'],
    ['2 núcleos de CPU y 2 GB de RAM estándar, ampliable x2 especial para sitios más', '2 CPU cores and 2 GB RAM standard allocation, 2x expandable on demand for high-traffic sites'],
    ['<h4>Ultra rápida</h4>', '<h4>Blazingly Fast</h4>'],
    ['<p>Hasta 16 veces más rápida<br>Significa una experiencia más completa y atractiva', '<p>Up to 16x faster response times<br>Delivering an engaging, seamless user experience'],
    ['¡Aquí hay algunas cosas que creemos que nos hacen el ajuste perfecto para usted!<br>¡Respaldamos nuestro alojamiento y nuestro servicio al cliente!<br>Ofrecemos una garantía de tiempo de', 'Here is why NETZ is the perfect partner for your online business!<br>We stand firmly behind our high-performance infrastructure and 24/7 dedicated customer care!'],
    ['ShoutCast es una solución para la transmisión de audio en directo a través de Internet como una estación tradicional de radio. Los usuarios pueden escuchar esta transmisión desde cualquier reproductor de medios. También es posible la transmisión de audio las 24 horas gracias al emisión.<br>Nuestra solución para Radio Streaming HD es SonicPanel: ShoutCast V1 y V2, AutoDJ,', 'ShoutCast and SonicPanel deliver premier live audio broadcasting across the globe. Listeners can tune in from any desktop or mobile device. Cloud AutoDJ keeps your station streaming 24/7/365 with HD sound and SSL encryption.'],
    ['Cantidad de Oyentes en Simultáneo <b>1.000</b>', 'Simultaneous Listeners <b>1,000</b>'],
    ['Transmisión con <b>Certificado SSL</b>', 'Stream with <b>SSL Certificate</b>'],
    ['Cantidad de Oyentes en Simultáneo <b>3.000</b>', 'Simultaneous Listeners <b>3,000</b>'],
    ['Cantidad de Oyentes en Simultáneo <b>5.000</b>', 'Simultaneous Listeners <b>5,000</b>'],
    ['<h2>Panel de control fácil de usar</h2>', '<h2>Intuitive, Easy-to-Use Control Panel</h2>'],
    ['<h5 class="mt-0">Fácil uso</h5>', '<h5 class="mt-0">Easy Navigation</h5>'],
    ['Nuestro panel esta optimizado para su fácil uso, y puede ser', 'Our control panel is optimized for effortless website and database management, accessible from'],
    ['Ofrecemos más velocidad y optimización en WP con cache LiteSpeed', 'Accelerate WordPress with integrated server-level LiteSpeed caching'],
    ['<h2>Retransmisión de correo electrónico de MailChannels</h2>', '<h2>MailChannels Corporate Email Relay</h2>'],
    ['Entrega y Protección de correo electrónico de nivel empresarial<br>Utilizamos mailChannels Cloud para que todo el correo saliente se transmita a través de una', 'Enterprise-Grade Email Delivery & Inbox Protection<br>We route all outbound corporate emails through MailChannels Cloud to eliminate blacklists and guarantee inbox delivery.'],
    ['Nuestro servicio de retransmisión de correo se incluye de forma gratuita', 'Our outbound email delivery relay is included free on all hosting accounts'],
    ['MailChannels garantiza que sus correos electrónicos se entreguen', 'MailChannels guarantees your business emails reach the inbox reliably'],
    ['real sobre amenazas nuevas y actuales. Así es como ejecutamos nuestros servidores para hacer esta red aún más fuerte.', 'real-time telemetry on new and evolving threats, keeping our cloud infrastructure resilient, hardened, and secure.']
];

// 2. Unmanaged VPS FAQs replacements
const unmanagedFaqReplacements = [
    ['<h5>¿Qué es un servidor VPS Unmanaged Linux?</h5>', '<h5>What is an Unmanaged Linux VPS Server?</h5>'],
    ['<h5>¿Qué es un VPS de Windows?</h5>', '<h5>What is a Windows VPS Server?</h5>'],
    ['<h5>¿Puedo actualizar mi servidor no administrado a administrado?</h5>', '<h5>Can I upgrade my unmanaged server to fully managed?</h5>'],
    ['<h5>¿Cúal es la diferencia entre los servidores Unmanaged Linuxs y los servidores', '<h5>What is the difference between Unmanaged Linux and Managed Linux?</h5>'],
    ['<h5>¿Existe algún beneficio al solicitar un VPS Unmanaged Linux?</h5>', '<h5>What are the benefits of choosing an Unmanaged Linux VPS?</h5>'],
    ['<h5>¿Debo comprar un VPS Linux administrado o no administrado?</h5>', '<h5>Should I choose a Managed or Unmanaged Linux VPS?</h5>'],
    ['¿Qué es un servidor VPS Unmanaged Linux?<i', 'What is an Unmanaged Linux VPS?<i'],
    ['¿Puedo actualizar mi servidor no administrado a administrado?<i', 'Can I upgrade unmanaged to managed?<i'],
    ['¿Cúal es la diferencia entre los servidores Unmanaged Linuxs', 'Difference between Unmanaged and Managed<i'],
    ['¿Existe algún beneficio al solicitar un VPS Unmanaged Linux?<i', 'Benefits of an Unmanaged Linux VPS<i'],
    ['¿Debo comprar un VPS Linux administrado o no administrado?<i', 'Managed vs Unmanaged VPS<i'],
    ['manera de ahorrar si no necesita ningún soporte para sus servicios y se siente cómodo', 'cost-effective solution if you do not require server administration support and feel confident'],
    ['le permite ahorrar dinero y está destinado a usuarios personales o comerciales que tienen experiencia en administración de servidores además de la experiencia en la realización de cualquier problema de mantenimiento y resolución de problemas. Los VPS no administrados no vienen con ningún soporte técnico, administrativo o de gestión.</p>', 'managing your own operating system. It is designed for developers and system administrators with server management experience. Unmanaged VPS plans do not include operating system technical support.</p>'],
    ['cualquier momento a través de la página de descripción general de su servidor en el Portal de control de la nube con el clic de un botón. Una vez que se complete su actualización, nuestro equipo de expertos puede brindarle cualquier asistencia técnica, administrativa o de gestión que pueda necesitar..</p>', 'any time directly through your cloud control panel with 1 click. Once upgraded, our certified engineering team takes over technical maintenance, OS updates, and 24/7 proactive monitoring.</p>'],
    ['realiza una solicitud, haremos todo lo que esté a nuestro alcance para solucionar el problema. Por ejemplo, si su servidor o aplicación necesita una actualización o un parche, todo lo que tendrá que hacer es abrir un ticket de soporte y solicitar que su sistema o aplicación se actualice, y lo ayudaremos. Con un plan de VPS no administrado de NETZ, nos aseguraremos de que su VPS pueda iniciarse y esté en su base funcional con la energía, la red y la conexión entre él y NETZ para que pueda realizar las acciones necesarias en él. NETZ no proporcionará ninguna otra asistencia o soporte.</p>', 'submits a request, our engineers will actively handle server-side issues. For example, if your OS needs security patches, our team takes care of it. With an Unmanaged VPS, NETZ ensures hardware uptime, network routing, and power redundancy, while internal software configuration remains the sole responsibility of the client.</p>'],
    ['administrados de NETZ lo tendrán configurado y listo a un precio asequible. Recibirá satisfacer sus necesidades únicas, incluido el acceso root completo al servidor, acceso SSH y VNC. NETZ Cloud Control también le brinda todo lo que necesita para administrar y configurar su servidor como mejor le parezca en función de sus requisitos únicos.</p>', 'Unmanaged VPS instances provide full administrative root access, SSH, and VNC web console at affordable rates. NETZ Cloud Control grants you complete freedom to configure, reboot, reinstall, and optimize your virtual server environment.</p>'],
    ['La elección depende completamente de ti. El objetivo de NETZ es brindarle tantas opciones brindar nuestros servicios al precio más bajo posible. Nuestros planes VPS Unmanaged Linuxs nos permiten brindar a los clientes que tienen experiencia en el monitoreo y mantenimiento de servidores privados virtuales planes más rentables. NETZ Cloud asegurarnos de que nuestros clientes tengan muchas opciones y estén seguros y tengan éxito sin importar qué.</p>', 'The choice depends entirely on your operational needs. If you possess server administration experience and require full root freedom to deploy custom stacks, Unmanaged is the most cost-effective choice. If you prefer our certified team to handle maintenance, monitoring, and updates, Managed VPS is the ideal solution.</p>']
];

// 3. Shared Hosting remaining replacements
const hostingDeepRemaining = [
    ['Haga que su empresa este en línea hoy mismo con unidades SSD rápidas, creador de sitios web gratuito y almacenamiento web de correo ilimitado. <br>Certificados SSL gratuitos incluidos.', 'Get your business online today with high-speed SSD drives, free website builder, and unlimited business email storage. <br>Free SSL certificates included.'],
    ['7502P, incorporando la tecnología multihilo simultáneo, 64 cores (núcleos), 320GB DDR4 ECC de memoria', '7502P, featuring simultaneous multithreading technology, 64 cores, 320GB DDR4 ECC memory'],
    ['La activación de los planes se realiza una vez recibamos el pago por el servicio contratado. La activación es inmediata en la gran mayoría de los casos.', 'Account activation is automatic and immediate once payment confirmation is received by our gateway.'],
    ['La conexión SSH es para usuarios avanzados. Si no tienes los conocimientos suficientes, no utilices el servicio SSH, no damos ningún tipo de soporte respecto a conexiones SSH, configuraciones de servidor o comandos bash.', 'SSH terminal access is intended for experienced developers. We do not provide hands-on debugging for custom terminal commands or shell scripts.'],
    ['No damos ningún tipo de soporte o configuraciones personalizadas en los servicios de node.js, rubygems o Python. Los servicios funcionan de forma independiente dentro del cPanel.', 'Node.js, Python, and Ruby operate within isolated cPanel CloudLinux application environments. Custom coding support is not provided for third-party scripts.'],
    ['Disponemos de múltiples niveles de seguridad, filtros, antivirus y firewalls específicos contra todo tipo de ataques, intentos de intrusión o ataques de denegación de servicio (DDoS).', 'We deploy enterprise-grade defense layers including real-time BitNinja WAF, automated DDoS mitigation, malware scanning, and isolated container environments.']
];

// 4. Centro de Ayuda deep TOC regex
function cleanHelpCenterDeep(content) {
    let res = content;

    // Remaining Spanish text in help center cards
    res = res.replace(/Our customer support team is available 24\/7 worldwide across live chat, WhatsApp, and tickets\.\s*Estamos aquí para ayudarle con su alojamiento, y puede comunicarse con nosotros\s*por teléfono, correo electrónico o chat en vivo\./gi, 'Our customer support team is available 24/7 worldwide across live chat, WhatsApp, and tickets. We are here to assist with your web hosting and you can contact us anytime via phone, email, or live chat.');
    res = res.replace(/A continuación hay un resumen de las facturas seleccionadas y la deuda total\s*para pagarlas en su totalidad\. Para realizar el pago, por favor, únicamente seleccione el\s*método de pago establecido más abajo\.<br><br>/gi, 'Below is a summary of your selected invoices and the total balance for settlement. To make payment, please choose your preferred payment gateway below.<br><br>');
    res = res.replace(/mantenimiento estándar que podamos proporcionar\./gi, 'standard maintenance windows.');

    // Replace TOC links that have multiline formatting
    for (const item of faqEnglishMap) {
        const pattern = new RegExp(`(<a href="#go-to-qst-${item.num}">)[\\s\\S]*?(<i[\\s\\S]*?<\\/a>)`, 'gi');
        res = res.replace(pattern, `$1${item.q_en}$2`);
    }

    return res;
}

// Execute deep pass across files
const allFiles = fs.readdirSync(localesUsDir).filter(f => f.endsWith('.html'));

for (const file of allFiles) {
    const filePath = path.join(localesUsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    if (file === 'index.html') {
        content = safeReplace(content, indexDeepReplacements);
    }

    if (file.includes('vps')) {
        content = safeReplace(content, unmanagedFaqReplacements);
    }

    if (file.includes('hosting')) {
        content = safeReplace(content, hostingDeepRemaining);
    }

    if (file === 'centro-de-ayuda.html') {
        content = cleanHelpCenterDeep(content);
    }

    // Write synchronized
    fs.writeFileSync(filePath, content, 'utf8');
    fs.writeFileSync(path.join(usDir, file), content, 'utf8');
    if (fs.existsSync(distUsDir)) {
        fs.writeFileSync(path.join(distUsDir, file), content, 'utf8');
    }
}

console.log('✨ Pase de traducción ultra-profundo completado.');
