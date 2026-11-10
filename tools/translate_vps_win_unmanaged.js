const fs = require('fs');
const path = require('path');
const { localesUsDir, usDir, distUsDir, replaceFlexible } = require('./translate_us_comprehensive.js');

const file = 'vps-windows-no-administrado.html';
const filePath = path.join(localesUsDir, file);
let content = fs.readFileSync(filePath, 'utf8');

content = replaceFlexible(content,
    'NETZ seguirá manteniendo y respaldando el nivel de infraestructura, como la energía y las redes. Nos aseguraremos de que se cree su servidor de Windows no administrado y de que se resuelva cualquier problema de nivel superior cuando el uso de su panel de control / inicios de sesión de VNC no sea suficiente. Estamos aumentando constantemente nuestra Knowledgebase para nuestros clientes que prefieren solucionar los problemas de sus servidores sin pedir soporte.',
    'NETZ maintains and supports the core infrastructure, such as host power redundancy and backend network routing. We ensure your unmanaged Windows Server instance is provisioned, online, and accessible via VNC/KVM web console if native RDP credentials need reset. You also have access to our comprehensive Knowledgebase for independent troubleshooting.'
);

content = replaceFlexible(content,
    'Los clientes VPS de Windows no administrados de NETZ pueden actualizar en cualquier momento entra en contacto con nosotros abre un ticket en el área de cliente. Una vez que el servidor se ha actualizado de No administrado a Administrado, nuestro equipo de expertos está disponible las 24 horas, los 7 días de la semana, los 365 días del año para brindar cualquier soporte que se encuentre dentro de los Niveles de soporte de NETZ.',
    'Unmanaged Windows VPS clients can upgrade to fully managed hosting at any time by opening a ticket in the Client Area. Once upgraded, our certified engineering team is available 24/7/365 to handle server maintenance, security updates, and administrative troubleshooting.'
);

content = replaceFlexible(content,
    'Un VPS de Windows administrado por NETZ viene con asistencia 24/7/365 de nuestro equipo de expertos, lo que significa que, si necesita ayuda en cualquier momento, haremos todo lo posible para ayudarlo. Por ejemplo, si necesitara instalar una aplicación en su VPS administrado, todo lo que tendría que hacer es abrir un ticket de soporte y solicitar que lo ayudemos a instalar la aplicación, y nuestro equipo de soporte se encargaría del resto. Con un servidor VPS no administrado de NETZ, el único soporte que podemos brindar es a nivel de infraestructura para garantizar que su servidor VPS pueda iniciarse y tenga la energía, la red y la conexión entre su VPS y la infraestructura de back-end de NETZ. Esto le permitirá personalizar y administrar su servidor como desee.',
    'With a Managed Windows VPS, our dedicated support engineers actively handle operating system maintenance, software installations, and security patches. With an Unmanaged Windows VPS, support is focused on core infrastructure (power, hardware health, and network connectivity), leaving OS-level software management in your hands with complete Administrator privileges.'
);

content = replaceFlexible(content,
    'Cualquier desarrollador, administrador de sistemas o empresa que ya cuente con un equipo de TI puede comenzar a usar un VPS no administrado de NETZ a un precio muy asequible. Esta también es una excelente manera de aprender a administrar su propio servidor de Windows y es un compañero perfecto para aquellos que ingresan al campo de TI y buscan más experiencia trabajando con acceso de nivel de administrador a un servidor. Aquellos que deseen este nivel de acceso, incluidos los profesionales de TI, los desarrolladores de pila completa, los empresarios y las empresas que desean un control total de varios servidores, sin duda se beneficiarán del bajo costo de los VPS de Windows de NETZ.',
    'Developers, system administrators, and organizations with in-house IT expertise can leverage an Unmanaged Windows VPS at our most cost-effective rates. It provides full Administrator RDP control to deploy custom Windows environments, software, and tools tailored to your exact requirements.'
);

content = replaceFlexible(content,
    'Si necesita un control total de su servidor y se siente cómodo con las tareas de administración, el monitoreo y la realización de actualizaciones del sistema operativo y de las aplicaciones, un VPS no administrado de NETZ es una excelente opción. Si cree que los pros superan a los contras al determinar si tener el control total de su servidor es la elección correcta, un VPS de Windows de NETZ es ideal para usted. Puede agregar recursos como núcleos de CPU, RAM y espacio en disco en cualquier momento que desee, y hay muchas funciones disponibles como agregar más direcciones IP. Hemos diseñado nuestros productos pensando en usted, asegurándose de que tenga tantas opciones como sea posible al usar su VPS de Windows.',
    'If you have system administration experience and wish to manage your Windows Server instance independently via RDP, Unmanaged is the most cost-effective option. If you prefer our certified engineering team to handle software updates, security firewalls, and 24/7 technical troubleshooting, Managed Windows VPS is the recommended solution.'
);

content = replaceFlexible(content,
    '¡Sí! Las instantáneas automatizadas y las copias de seguridad de instantáneas a pedido se pueden crear directamente desde el panel de control de NETZ.',
    'Yes! Automated daily snapshots and on-demand recovery backups can be created and managed directly through your NETZ Cloud Portal.'
);

fs.writeFileSync(filePath, content, 'utf8');
fs.writeFileSync(path.join(usDir, file), content, 'utf8');
if (fs.existsSync(distUsDir)) {
    fs.writeFileSync(path.join(distUsDir, file), content, 'utf8');
}
console.log('✅ vps-windows-no-administrado.html traducido 100%');
