const fs = require('fs');
const path = require('path');
const { localesUsDir, usDir, distUsDir, replaceFlexible } = require('./translate_us_comprehensive.js');

const finalReplacementsByFile = {
    'hosting-ilimitado.html': [
        ['La activación de los planes se realiza una vez recibamos el pago por el servicio contratado. La activación es inmediata en la gran mayoría de los casos.', 'Account activation is automatic and instant as soon as payment is confirmed by our gateway.'],
        ['La conexión SSH es para usuarios avanzados. Si no tienes los conocimientos suficientes, no utilices el servicio SSH, no damos ningún tipo de soporte respecto a conexiones SSH, configuraciones de servidor o comandos bash.', 'SSH terminal access is intended for experienced developers. We do not provide hands-on debugging for custom terminal commands or shell scripts.'],
        ['No damos ningún tipo de soporte o configuraciones personalizadas en los servicios de node.js, rubygems o Python. Los servicios funcionan de forma independiente dentro del cPanel.', 'Node.js, Python, and Ruby operate within isolated cPanel CloudLinux application environments. Custom coding support is not provided for third-party scripts.'],
        ['Disponemos de múltiples niveles de seguridad, filtros, antivirus y firewalls específicos contra todo tipo de ataques, intentos de intrusión o ataques de denegación de servicio (DDoS).', 'We deploy enterprise-grade defense layers including real-time BitNinja WAF, automated DDoS mitigation, malware scanning, and isolated container environments.']
    ],
    'hosting-exclusivo.html': [
        ['7502P, incorporando la tecnología multihilo simultáneo, 64 cores (núcleos), 320GB DDR4 ECC de memoria', '7502P, featuring simultaneous multithreading technology, 64 cores, 320GB DDR4 ECC memory'],
        ['La activación de los planes se realiza una vez recibamos el pago por el servicio contratado. La activación es inmediata en la gran mayoría de los casos.', 'Account activation is automatic and instant as soon as payment is confirmed by our gateway.'],
        ['La conexión SSH es para usuarios avanzados. Si no tienes los conocimientos suficientes, no utilices el servicio SSH, no damos ningún tipo de soporte respecto a conexiones SSH, configuraciones de servidor o comandos bash.', 'SSH terminal access is intended for experienced developers. We do not provide hands-on debugging for custom terminal commands or shell scripts.'],
        ['No damos ningún tipo de soporte o configuraciones personalizadas en los servicios de node.js, rubygems o Python. Los servicios funcionan de forma independiente dentro del cPanel.', 'Node.js, Python, and Ruby operate within isolated cPanel CloudLinux application environments. Custom coding support is not provided for third-party scripts.'],
        ['Disponemos de múltiples niveles de seguridad, filtros, antivirus y firewalls específicos contra todo tipo de ataques, intentos de intrusión o ataques de denegación de servicio (DDoS).', 'We deploy enterprise-grade defense layers including real-time BitNinja WAF, automated DDoS mitigation, malware scanning, and isolated container environments.']
    ],
    'about.html': [
        ['Es posible realizar cualquier modificación de plan ya sea para aumentar o reducir recursos sin inconvenientes mayores, <br> entra en contacto con nuestro equipo de soporte!<br>¡Nos encantará ayudarte!', 'You can adjust your plan at any time to scale resources up or down seamlessly without downtime.<br>Contact our support engineering team—we are here to help 24/7!'],
        ['Disponemos del mejor equipo de profesionales a su entera disposición para ayudarle en cualquier problema que tenga.', 'Our experienced server engineers are available around the clock to assist with any technical need.'],
        ['Atención muy buena y rápida respuesta a mis problemas cuando tenía inconvenientes con mi cuenta, lo mejor fue el certificado ssl de comodín que viene gratis, se tiene que configurar y listo.', 'Outstanding support response times whenever we had technical questions. The automatic free wildcard SSL certificates make deployment effortless.'],
        ['Son simplemente increíbles, apenas voy iniciando en esto, y me ayudaron bastante en las configuraciones de mis correos corporativos.', 'Simply fantastic service. As a newcomer, their team guided me step-by-step through setting up our professional business email accounts.'],
        ['<b>Kelly López</b>', '<b>Kelly Lopez</b>']
    ],
    'index.html': [
        ['ShoutCast es una solución para la transmisión de audio en directo a través de Internet como una estación tradicional de radio. Los usuarios pueden escuchar esta transmisión desde cualquier reproductor de medios. También es posible la transmisión de audio las 24 horas gracias al emisión.<br>Nuestra solución para Radio Streaming HD es SonicPanel: ShoutCast V1 y V2, AutoDJ,', 'ShoutCast and SonicPanel deliver premier live audio broadcasting across the globe. Listeners can tune in from any desktop or mobile device. Cloud AutoDJ keeps your station streaming 24/7/365 with HD sound and SSL encryption.'],
        ['Entrega y Protección de correo electrónico de nivel empresarial<br>\n                        Utilizamos mailChannels Cloud para que todo el correo saliente se transmita a través de una', 'Enterprise-Grade Email Delivery & Inbox Protection<br>\n                        We route all outbound corporate emails through MailChannels Cloud to eliminate blacklists and guarantee inbox delivery.'],
        ['Entrega y Protección de correo electrónico de nivel empresarial<br> Utilizamos mailChannels Cloud para que todo el correo saliente se transmita a través de una', 'Enterprise-Grade Email Delivery & Inbox Protection<br> We route all outbound corporate emails through MailChannels Cloud to eliminate blacklists and guarantee inbox delivery.']
    ],
    'reseller-directadmin.html': [
        ['<span>Plan Básico</span>', '<span>Basic Plan</span>']
    ],
    'vps-windows-no-administrado.html': [
        ['<h5>¿Que se incluye con un VPS de Windows no administrado?</h5>', '<h5>What is included with an Unmanaged Windows VPS?</h5>'],
        ['¿Que se incluye con un VPS de Windows no administrado?<i', 'What is included with an Unmanaged Windows VPS?<i'],
        ['NETZ seguirá manteniendo y respaldando el nivel de infraestructura, como la energía y las redes de back-end. También continuaremos ofreciendo la consola KVM si el acceso a los inicios de sesión de VNC no sea suficiente. Estamos aumentando constantemente nuestra biblioteca de ISO y también podemos montar una ISO personalizada a pedido. Las imágenes del sistema operativo se actualizarán con frecuencia. Ofrecemos hardware de reemplazo garantizado y soporte para cualquier falla en la red, falla de energía o cualquier problema con los servidores host que ejecutan el entorno virtual.', 'NETZ maintains and supports the core enterprise infrastructure, including power redundancy, network routing, and host hardware. We provide web console VNC/KVM access, an expanding library of Windows Server ISOs, and custom ISO mounting upon request. Hardware failures and host node network issues are guaranteed resolved 24/7.'],
        ['<h5>¿Puedo actualizar mi servidor Windows no administrado a Windows administrado?</h5>', '<h5>Can I upgrade my unmanaged Windows server to fully managed?</h5>'],
        ['¿Puedo actualizar mi servidor Windows no administrado a Windows administrado?<i', 'Can I upgrade unmanaged Windows to managed?<i'],
        ['¿Puedo actualizar mi servidor Windows no administrado a Windows\n                                            administrado?<i', 'Can I upgrade unmanaged Windows to managed?<i'],
        ['¡Absolutamente! Si decide que desea que NETZ administre su servidor, en cualquier momento entra en contacto con nosotros abre un ticket en el área de cliente. Una vez que se complete la actualización a un VPS de Windows administrado, nuestro equipo de expertos está disponible las 24 horas, los 7 días de la semana, los 365 días del año para ayudarlo.', 'Absolutely! If you decide to transition to fully managed Windows hosting, you can upgrade at any time via your client portal. Once activated, our certified engineers are available 24/7/365 to handle server setup, maintenance, security, and troubleshooting.'],
        ['<h5>¿Cúal es la diferencia entre los servidores Windows no administrados y los servidores Windows completamente administrados?</h5>', '<h5>What is the difference between Unmanaged and Managed Windows VPS?</h5>'],
        ['¿Cúal es la diferencia entre los servidores Windows no\n                                            administrados y los servidores Windows completamente administrados?<i', 'Difference between Unmanaged and Managed Windows VPS<i'],
        ['Con un servidor VPS de Windows administrado, siempre que abra un ticket de soporte o realiza una solicitud, nuestro equipo de soporte de administración de Windows hará todo lo posible para ayudarlo. Por ejemplo, si necesitara instalar una aplicación en su VPS administrado, todo lo que tendría que hacer es abrir un ticket de soporte y solicitar que lo ayudemos a instalar la aplicación, y nuestro equipo de soporte se encargaría del resto. Con un servidor VPS no administrado de NETZ, el único soporte que podemos brindar se limita al nivel de infraestructura, como se mencionó anteriormente, para garantizar que tenga la energía, la red y la conexión entre su VPS y la infraestructura de back-end de NETZ. Esto le permitirá personalizar y administrar su servidor como desee.', 'With Managed Windows VPS, our dedicated support engineers actively handle operating system maintenance, role configurations, updates, and software installations. With an Unmanaged Windows VPS, support is focused on core infrastructure (power, hardware health, and network connectivity), leaving OS-level software management in your hands with complete Administrator privileges.'],
        ['<h5>¿Cuáles son los beneficios de tener un VPS no administrado con NETZ?</h5>', '<h5>What are the benefits of having an Unmanaged Windows VPS with NETZ?</h5>'],
        ['¿Cuáles son los beneficios de tener un VPS no administrado con\n                                            NETZ?<i', 'Benefits of an Unmanaged Windows VPS<i'],
        ['Los VPS no administrados de NETZ se ofrecen al precio más accesible posible para aquellos que no necesitan ningún soporte administrativo pero desean un VPS de Windows. Esta también es una excelente manera de aprender a administrar su propio servidor de Windows y es un compañero perfecto para aquellos que ingresan al campo de TI y buscan más experiencia trabajando con acceso de nivel de administrador a un servidor. Aquellos usuarios que tienen experiencia y confían en la administración de sus propios servidores, sin duda se beneficiarán del bajo costo de los VPS de Windows de NETZ.', 'Unmanaged Windows VPS plans deliver enterprise-grade performance at cost-effective rates for developers, IT administrators, and businesses who want dedicated computing power without paying for management overhead. You retain full Administrator RDP control to deploy custom Windows environments.'],
        ['<h5>Administrado vs No administrado, ¿cómo sé cuál el adecuado para mí?</h5>', '<h5>Managed vs Unmanaged: How do I know which is right for me?</h5>'],
        ['Administrado vs No administrado, ¿cómo sé cuál el adecuado para\n                                            mí?<i class="fas fa-angle-right"></i></a></li>', 'Managed vs Unmanaged: Which is right for me?<i class="fas fa-angle-right"></i></a></li>'],
        ['Si necesita un control total de su servidor y se siente cómodo con las tareas de administración, el monitoreo y la realización de actualizaciones del sistema operativo y de las aplicaciones, un VPS no administrado de NETZ es una excelente opción. Si cree que un plan administrado es más adecuado, o si no está seguro de si un VPS no administrado es la elección correcta, un VPS de Windows de NETZ es ideal para usted. Puede agregar recursos como núcleos de CPU, RAM y espacio en disco en cualquier momento que desee, y hay muchas funciones disponibles como agregar más direcciones IP. Hemos diseñado nuestros productos pensando en usted, asegurándose de que tenga tantas opciones como sea posible para que pueda tener éxito con su nuevo servidor.', 'If you have system administration experience and wish to manage your Windows Server instance independently via RDP, Unmanaged is the most cost-effective option. If you prefer our certified engineering team to handle software updates, security firewalls, and 24/7 technical troubleshooting, Managed Windows VPS is the recommended solution.'],
        ['<h5>¿Puedo realizar una copia de seguridad de mi servidor?</h5>', '<h5>Can I backup my Windows server?</h5>'],
        ['¿Puedo realizar una copia de seguridad de mi servidor?<i', 'Can I backup my Windows server?<i'],
        ['¡Sí! Las instantáneas automatizadas y las copias de seguridad de instantáneas a pedido se pueden agregar a cualquier servidor en cualquier momento a través del Portal de la nube de NETZ. Puede configurar copias de seguridad de instantáneas automatizadas para que se realicen en cualquier momento del día o de la noche, y las copias de seguridad de instantáneas a pedido se pueden tomar antes de realizar cualquier cambio en su servidor para que pueda restaurar fácilmente si algo sale mal.', 'Yes! Automated cloud snapshots and on-demand backups can be attached at any time through the NETZ Cloud Portal. You can schedule automatic daily backups or capture instant restore points before making major configuration changes.'],
        ['<h5>¿Cuánto tiempo se tarda en aprovisionar mi VPS?</h5>', '<h5>How long does it take to provision my Windows VPS?</h5>'],
        ['¿Cuánto tiempo se tarda en aprovisionar mi VPS?<i', 'How long does provisioning take?<i'],
        ['En la mayoría de los casos, los servidores VPS se configuran y están listos para usar en cuestión de minutos.', 'In the vast majority of cases, Windows VPS instances are provisioned, licensed, and online within minutes after payment confirmation.']
    ]
};

for (const [file, pairs] of Object.entries(finalReplacementsByFile)) {
    const filePath = path.join(localesUsDir, file);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf8');
    for (const [search, rep] of pairs) {
        content = replaceFlexible(content, search, rep);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    fs.writeFileSync(path.join(usDir, file), content, 'utf8');
    if (fs.existsSync(distUsDir)) {
        fs.writeFileSync(path.join(distUsDir, file), content, 'utf8');
    }
    console.log(`🎯 Limpieza de precisión completada para: ${file}`);
}
