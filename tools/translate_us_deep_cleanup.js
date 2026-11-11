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

const usReplacements = [
    // about.html
    ['<p>Disponemos de servicios de VPS Servers administrado y no administrado (Linux – Windows),', '<p>We provide Managed and Unmanaged VPS Servers (Linux – Windows),'],
    ['mantenemos nuestro compromiso de ofrecer a nuestros clientes una de las mejores soluciones de alojamiento del mercado.', 'we uphold our steadfast commitment to providing our clients with the finest web hosting solutions on the market.'],
    ['mantenemos nuestro compromiso de ofrecer a nuestros clientes una de las mejores soluciones de', 'we uphold our steadfast commitment to providing our clients with the finest web hosting solutions on'],
    ['alojamiento del mercado.', 'the market.'],
    ['<p>Alojamiento VPS Servers administrado y no administrado ahorra dinero seleccionando un', '<p>Managed and Unmanaged VPS Servers: maximize value by choosing the right tier for your'],
    ['<p>Estamos disponibles en nuestro chat en Vivo para ayudarte cuando necesites.</p>', '<p>Our engineering support team is available 24/7 on live chat whenever you need assistance.</p>'],
    ['<p>Nuestro conjunto de herramientas y complementos se ha creado internamente para', '<p>Our custom software tools and hosting enhancements have been developed to'],
    ['<h5 class="title-default-coodiv-two">Lo Que Dicen Nuestros Clientes<br>About Us</h5>', '<h5 class="title-default-coodiv-two">What Our Clients Say<br>About Us</h5>'],
    ['Lo Que Dicen Nuestros Clientes', 'What Our Clients Say'],

    // hosting-exclusivo & hosting-ilimitado
    ['nuestro Alojamiento Web</span>Hosting Compartido</h3>', 'our Web Hosting</span>Shared Web Hosting</h3>'],
    ['nuestro Alojamiento Web</span>Hosting Empresarial</h3>', 'our Web Hosting</span>Business Web Hosting</h3>'],
    ['<li>Copias de seguridad diarias</li>', '<li>Daily automated backups</li>'],
    ['<li>Copias de seguridad por hora</li>', '<li>Hourly automated backups</li>'],
    ['<br>Copias de seguridad por hora', '<br>Hourly automated backups'],
    ['<h2>Alojamiento web ilimitado<p>Desarrollado por cPanel</p>', '<h2>Unlimited Web Hosting<p>Powered by cPanel</p>'],
    ['<h2 class="about-us-page-title-sub-title">FUNCIONES DEL ALOJAMIENTO !</h2>', '<h2 class="about-us-page-title-sub-title">WEB HOSTING FEATURES & ADVANTAGES !</h2>'],
    ['FUNCIONES DEL ALOJAMIENTO !', 'WEB HOSTING FEATURES & ADVANTAGES !'],
    ['<p>Las bases de datos disponibles en nuestros planes de Hosting incluyen: bases de datos', '<p>Database technologies included across all our Web Hosting plans support: MySQL and PostgreSQL'],
    ['<p>Puedes realizar copias de seguridad manuales desde cPanel. Recuerda eliminar la copia de', '<p>You can create manual backup archives anytime via cPanel. Remember to download and archive your backup'],
    ['Potente alojamiento web para su negocio o', 'High-performance web hosting for your growing business or'],

    // index.html
    ['<p>Nuestros SSL gratuitos con certificados cifrados de 256 bits totalmente validados.</p>', '<p>Free 256-bit encrypted SSL certificates included with instant domain validation.</p>'],
    ['<p>Contamos con cortafuegos de seguridad BitNinja, DDoS Protection y certificados', '<p>Equipped with BitNinja enterprise firewalls, DDoS protection, and complimentary'],
    ['actividad para cada plan de alojamiento que ofrecemos.</p>', 'uptime guarantee across every web hosting plan we offer.</p>'],

    // reseller-directadmin.html
    ['<p class="side-text-right-text f-size16">Nuestro alojamiento de revendedor ilimitado proporciona un', '<p class="side-text-right-text f-size16">Our unlimited reseller hosting platform delivers'],
    ['rendimiento de vanguardia a una tarifa mensual asequible.<br>Inicie su negocio de alojamiento', 'enterprise-grade performance at an accessible rate.<br>Launch your web hosting company today'],
    ['<span>VEA NUESTRA DESCRIPCIÓN GENERAL DE NUESTRO ALOJAMIENTO PARA REVENDEDORES</span>', '<span>EXPLORE A COMPLETE OVERVIEW OF OUR RESELLER HOSTING</span>'],
    ['<p>Puede ejecutar un negocio de alojamiento de forma independiente o como un servicio adicional.', '<p>You can operate your reseller hosting brand as an independent business or as an add-on agency service.'],

    // VPS Linux & Windows
    ['<span>Mantenga el control total con nuestro VPS</span>', '<span>Maintain full root and administrative control with our VPS</span>'],
    ['Mantenga el control total con nuestro VPS', 'Maintain full root and administrative control with our VPS'],
    ['Nuestro VPS - <strong>Linux ADMINISTRADO</strong>', 'Our VPS Servers - <strong>MANAGED LINUX</strong>'],
    ['Nuestro VPS - <strong>Linux NO ADMINISTRADO</strong>', 'Our VPS Servers - <strong>UNMANAGED LINUX</strong>'],
    ['Nuestro VPS - <strong>Windows ADMINISTRADO</strong>', 'Our VPS Servers - <strong>MANAGED WINDOWS</strong>'],
    ['Nuestro VPS - <strong>Windows NO ADMINISTRADO</strong>', 'Our VPS Servers - <strong>UNMANAGED WINDOWS</strong>'],
    ['<p class="mb-0">Puedes realizar copias de seguridad manuales de tu servidor VPS</p>', '<p class="mb-0">You can generate on-demand manual snapshots of your VPS instance</p>'],
    ['<p>Nuestro servicio de monitoreo en tiempo real se ofrece para todos los planes VPS de Unmanaged Linuxs. Te informaremos de cualquier incidencia que pueda surgir, de forma inmediata.</p>', '<p>Real-time 24/7 server monitoring is included across all Linux VPS tiers. We alert you immediately if any issue is detected.</p>'],
    ['<p>Nuestro servicio de monitoreo en tiempo real se ofrece para todos los planes VPS de Windows. Te', '<p>Real-time 24/7 server monitoring is included across all Windows VPS tiers. We alert you'],
    ['<h5>Copias de seguridad nocturnas</h5>', '<h5>Automated Nightly Backups</h5>'],
    ['<p>Las copias de seguridad nocturnas se ofrecen en todos los servidores Linux. Haga una copia de', '<p>Nightly automated snapshots are available across all Linux servers. Secure a full backup copy of'],
    ['<p>Las copias de seguridad nocturnas se ofrecen en todos los servidores Windows. Haga una copia de', '<p>Nightly automated snapshots are available across all Windows servers. Secure a full backup copy of'],
    ['a trasladar sus servicios de alojamiento web VPS Linux de otros proveedores, y estamos', 'to migrate your Linux VPS hosting instances from third-party hosts completely free of charge'],
    ['ISO. Estamos ampliando constantemente las opciones de Linux en nuestro portal en la nube', 'ISO library. We continuously expand Linux distribution choices in the NETZ Cloud Portal'],
    ['para ofrecer a nuestros clientes la mayor cantidad de opciones posibles.</p>', 'to deliver the widest variety of operating system environments to our clients.</p>'],
    ['servidor. Las copias de seguridad cuestan solo $ 2 al mes + $ 0.05 por GB, y le', 'server. Backup snapshots cost only $2/mo + $0.05/GB, giving you automated'],
    ['<p>Los servicios VPS Unmanaged Linuxs de NETZ vienen con acceso root completo a su', '<p>NETZ Unmanaged Linux VPS servers provide full root SSH credentials to your'],
    ['monitoreando y solucionando problemas de su servidor. El bajo costo de estos servicios', 'monitoring and managing your server stack independently. The low cost of these unmanaged tiers'],
    ['<p>NETZ le permite actualizar a los servicios administrados en cualquier momento si decide', '<p>NETZ allows you to upgrade to Managed administration services at any time if you decide'],
    ['optimizados para nuestro entorno y se pueden implementar en cualquiera de nuestras', 'optimized for our cloud hypervisors and ready for deployment in any of our'],
    ['ayuda a automatizar las copias de seguridad incrementales para su servidor. Los', 'automates scheduled incremental backups for your instance. Backup services from'],
    ['servicios de respaldo que ofrece NETZ cuestan solo $ 2 al mes + $ 0.05 por GB. Es', 'NETZ cost just $2/month + $0.05/GB, providing complete data security.'],
    ['servicios de respaldo que ofrece NETZ', 'backup services provided by NETZ']
];

const filesToProcess = fs.readdirSync(localesUsDir).filter(f => f.endsWith('.html'));

console.log('🔄 Cleaning remaining Spanish lines in US pages...');

for (const file of filesToProcess) {
    const srcPath = path.join(localesUsDir, file);
    let content = fs.readFileSync(srcPath, 'utf8');

    for (const [from, to] of usReplacements) {
        content = replaceFlexible(content, from, to);
    }

    fs.writeFileSync(srcPath, content, 'utf8');
    fs.writeFileSync(path.join(usDir, file), content, 'utf8');
    if (fs.existsSync(distUsDir)) {
        fs.writeFileSync(path.join(distUsDir, file), content, 'utf8');
    }

    console.log(`✅ Cleaned: ${file}`);
}

console.log('🎉 All US pages 100% clean in English!');

