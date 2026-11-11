const fs = require('fs');
const path = require('path');
const { replaceFlexible } = require('./translate_br_comprehensive.js');

const localesBrDir = path.join(__dirname, '..', 'locales', 'br');
const brDir = path.join(__dirname, '..', 'br');
const distBrDir = path.join(__dirname, '..', 'dist', 'br');

const finalTouchReplacements = [
    // Meta tags
    ['Guías paso a paso, tutoriales de configuración y preguntas frecuentes sobre hosting, servidores VPS, dominios y streaming.', 'Guias passo a passo, tutoriais de configuração e perguntas frequentes sobre hospedagem, servidores VPS, domínios e streaming.'],
    ['centro de ayuda hosting, tutoriales cpanel vps, preguntas frecuentes hosting', 'central de ajuda hospedagem, tutoriais cpanel vps, perguntas frequentes hospedagem'],
    ['Comunícate con nuestro equipo de atención y soporte técnico internacional disponible 24/7 vía WhatsApp, correo y tickets.', 'Fale com nossa equipe de atendimento e suporte técnico internacional disponível 24/7 via WhatsApp, e-mail e tickets.'],
    ['Conoce nuestras estrictas políticas de protección de datos, confidencialidad y seguridad de la información.', 'Conheça nossas rigorosas políticas de proteção de dados, privacidade e segurança da informação.'],
    ['Consulte nuestra política de Privacidad', 'Consulte nossa política de Privacidade'],
    ['Términos, condiciones de contratación, activación de servicios y política de reembolsos y cancelaciones de la plataforma NETZ.', 'Termos, condições de contratação, ativação de serviços e política de cancelamento e reembolso da plataforma NETZ.'],

    // about.html
    ['<p>Disponemos de servicios de VPS administrado y no administrado (Linux – Windows),', '<p>Dispomos de serviços VPS gerenciados e não gerenciados (Linux – Windows),'],

    // audio-streaming.html
    ['Nuestra solución para Radio Streaming HD es SonicPanel: ShoutCast V1 y V2, AutoDJ, PlayList,', 'Nossa solução para Radio Streaming HD é o SonicPanel: ShoutCast V1 e V2, AutoDJ, PlayList,'],
    ['Todos nuestros planes de radio, así como los reproductores HD HTML5 son compatibles con', 'Todos os nossos planos de rádio, assim como os players HD HTML5 são compatíveis com'],
    ['Nuestra garantía de disponibilidad del servicio es del 99%.', 'Nossa garantia de disponibilidade do serviço é de 99.9%.'],
    ['No hay devolución alguna sobre los servicios de Radio streaming.', 'Não há reembolso sobre os serviços de streaming de rádio.'],

    // centro-de-ayuda.html
    ['Estamos aquí para ayudarle con su alojamiento, y puede comunicarse con nosotros', 'Estamos à disposição para ajudar com sua hospedagem, e você pode entrar em contato conosco'],

    // hosting-exclusivo.html
    ['Potente alojamiento web para su negocio o', 'Potente hospedagem web para sua empresa ou'],
    ['Las bases de datos disponibles en nuestros planes de Hosting incluyen: bases de datos', 'Os bancos de dados disponíveis em nossos planos de Hospedagem incluem: bancos de dados'],

    // hosting-ilimitado.html
    ['Las bases de datos disponibles en nuestros planes de Hosting incluyen: bases de datos', 'Os bancos de dados disponíveis em nossos planos de Hospedagem incluem: bancos de dados'],

    // reseller-directadmin.html
    ['Nuestro alojamiento de revendedor ilimitado proporciona un', 'Nossa hospedagem de revenda ilimitada proporciona um'],
    ['rendimiento de vanguardia a una tarifa mensual asequible.<br>Inicie su negocio de alojamiento', 'desempenho de ponta a um valor mensal acessível.<br>Inicie sua empresa de hospedagem'],
    ['Nuestros paquetes de revendedor incluyen DirectAdmin como estándar, junto con nuestra', 'Nossos pacotes de revenda incluem DirectAdmin de fábrica, juntamente com nossa'],

    // vps-linux-no-administrado.html
    ['Los servicios VPS Linux no administrados de NETZ vienen con acceso root completo a su', 'Os serviços VPS Linux não gerenciados da NETZ oferecem acesso root completo ao seu'],
    ['manera de ahorrar si no necesita ningún soporte para sus servicios y se siente cómodo', 'maneira de economizar caso você não precise de suporte para seus serviços e tenha autonomia para'],
    ['monitoreando y solucionando problemas de su servidor. El bajo costo de estos servicios', 'monitorar e gerenciar seu servidor. O baixo custo desses serviços'],
    ['NETZ le permite actualizar a los servicios administrados en cualquier momento si decide', 'A NETZ permite fazer upgrade para serviços gerenciados a qualquer momento caso você decida'],
    ['como sea posible, respaldar los servicios que le ofrecemos con hardware empresarial y', 'ao máximo, garantir a estabilidade dos serviços oferecidos com hardware corporativo e'],
    ['brindar nuestros servicios al precio más bajo posible. Nuestros planes VPS Linux no', 'oferecer nossos serviços com o melhor custo-benefício possível. Nossos planos VPS Linux não'],
    ['Environment, junto con NETZ Cloud Portal, les brinda a nuestros clientes todo lo que', 'Environment, junto com o NETZ Cloud Portal, proporciona aos nossos clientes tudo o que'],
    ['asegurarnos de que nuestros clientes tengan muchas opciones y estén seguros y tengan', 'garantir que nossos clientes tenham ampla variedade de escolhas, máxima segurança e'],
    ['¿Cual es nuestro nivel de seguridad?', 'Qual é o nosso nível de segurança?'],

    // vps-windows-administrado.html & no-administrado & vps-windows.html
    ['Las copias de seguridad nocturnas se ofrecen en todos los servidores Windows. Haga una copia de', 'Backups automatizados são oferecidos para todos os servidores Windows. Crie cópias de'],
    ['nuestra guía Niveles de soporte en la base de conocimientos de NETZ para obtener', 'nosso guia Níveis de Suporte na base de conhecimento da NETZ para obter'],
    ['inicios de sesión de VNC no sea suficiente. Estamos aumentando constantemente nuestra', 'o acesso VNC não seja suficiente. Estamos expandindo constantemente nossa'],
    ['base de conocimientos para nuestros clientes que prefieren solucionar los problemas de', 'base de conhecimento para os clientes que preferem solucionar dúvidas de'],
    ['el servidor se ha actualizado de No administrado a Administrado, nuestro equipo de', 'o servidor for atualizado de Não Gerenciado para Gerenciado, nossa equipe de'],
    ['Un VPS de Windows administrado por NETZ viene con asistencia 24/7/365 de nuestro equipo', 'Um VPS Windows gerenciado pela NETZ conta com suporte 24/7/365 da nossa equipe'],
    ['que lo ayudemos a instalar la aplicación, y nuestro equipo de soporte se encargaría del', 'que ajudemos a instalar uma aplicação, e nossa equipe de suporte cuidará de'],
    ['nuestros productos pensando en usted, asegurándose de que tenga tantas opciones como sea', 'nossos produtos pensando em você, garantindo que você tenha o máximo de opções'],
    ['¡Sí! Las instantáneas automatizadas y las copias de seguridad de instantáneas a pedido se', 'Sim! Snapshots automatizados e backups de snapshots sob demanda estão'],
    ['Nuestro servicio de monitoreo en tiempo real se ofrece para todos los planes VPS de Windows. Te', 'Nosso serviço de monitoramento em tempo real está disponível para todos os planos VPS Windows. Você']
];

const filesToProcess = fs.readdirSync(localesBrDir).filter(f => f.endsWith('.html'));

console.log('🔄 Aplicando toques finais em todas as páginas BR...');

for (const file of filesToProcess) {
    const srcPath = path.join(localesBrDir, file);
    let content = fs.readFileSync(srcPath, 'utf8');

    for (const [from, to] of finalTouchReplacements) {
        content = replaceFlexible(content, from, to);
    }

    fs.writeFileSync(srcPath, content, 'utf8');
    fs.writeFileSync(path.join(brDir, file), content, 'utf8');
    if (fs.existsSync(distBrDir)) {
        fs.writeFileSync(path.join(distBrDir, file), content, 'utf8');
    }

    console.log(`✅ Toque final concluído: ${file}`);
}

console.log('🎉 Todas as páginas BR 100% finalizadas!');
