const fs = require('fs');
const path = require('path');
const { localesUsDir, usDir, distUsDir, replaceFlexible } = require('./translate_us_comprehensive.js');

const finalRoundMap = {
    'reseller-directadmin.html': [
        ['2 núcleos de CPU / 2 GB de RAM', '2 CPU Cores / 2 GB RAM']
    ],
    'vps-linux-no-administrado.html': [
        ['<h5>¿Cuanto tiempo tarda en activarse mi cuenta?</h5>', '<h5>How long does account activation take?</h5>'],
        ['<h5>¿Cual es nuestro nivel de seguridad?</h5>', '<h5>What is our security level?</h5>']
    ],
    'vps-windows-no-administrado.html': [
        [/<p>NETZ seguirá manteniendo y respaldando el nivel de infraestructura[\s\S]*?entorno virtual\.<\/p>/gi, '<p>NETZ maintains and supports the core enterprise infrastructure, including power redundancy, network routing, and host hardware. We provide web console VNC/KVM access, an expanding library of Windows Server ISOs, and custom ISO mounting upon request. Hardware failures and host node network issues are guaranteed resolved 24/7.</p>'],
        [/¡Absolutamente! Si decide que desea que NETZ administre su servidor[\s\S]*?para ayudarlo\.<\/p>/gi, 'Absolutely! If you decide to transition to fully managed Windows hosting, you can upgrade at any time via your client portal. Once activated, our certified engineers are available 24/7/365 to handle server setup, maintenance, security, and troubleshooting.</p>'],
        [/Con un servidor VPS de Windows administrado[\s\S]*?como desee\.<\/p>/gi, 'With Managed Windows VPS, our dedicated support engineers actively handle operating system maintenance, role configurations, updates, and software installations. With an Unmanaged Windows VPS, support is focused on core infrastructure (power, hardware health, and network connectivity), leaving OS-level software management in your hands with complete Administrator privileges.</p>'],
        [/Los VPS no administrados de NETZ se ofrecen al precio más accesible posible[\s\S]*?Windows de NETZ\.<\/p>/gi, 'Unmanaged Windows VPS plans deliver enterprise-grade performance at cost-effective rates for developers, IT administrators, and businesses who want dedicated computing power without paying for management overhead. You retain full Administrator RDP control to deploy custom Windows environments.</p>'],
        [/<p>Si necesita un control total de su servidor y se siente cómodo con las tareas de[\s\S]*?nuevo servidor\.<\/p>/gi, '<p>If you have system administration experience and wish to manage your Windows Server instance independently via RDP, Unmanaged is the most cost-effective option. If you prefer our certified engineering team to handle software updates, security firewalls, and 24/7 technical troubleshooting, Managed Windows VPS is the recommended solution.</p>'],
        [/<p>¡Sí! Las instantáneas automatizadas y las copias de seguridad de instantáneas a pedido[\s\S]*?algo sale mal\.<\/p>/gi, '<p>Yes! Automated cloud snapshots and on-demand backups can be attached at any time through the NETZ Cloud Portal. You can schedule automatic daily backups or capture instant restore points before making major configuration changes.</p>']
    ]
};

for (const [file, pairs] of Object.entries(finalRoundMap)) {
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
    console.log(`✨ Rematado al 100%: ${file}`);
}
