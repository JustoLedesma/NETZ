const fs = require('fs');
const path = require('path');
const { replaceFlexible } = require('./translate_br_comprehensive.js');

const localesBrDir = path.join(__dirname, '..', 'locales', 'br');
const brDir = path.join(__dirname, '..', 'br');
const distBrDir = path.join(__dirname, '..', 'dist', 'br');

const deepReplacements = [
    // Hosting Ilimitado & Exclusivo sections
    ['Mantenga El Control Total De Su Entorno Con Nuestro Alojamiento Web', 'Mantenha o Controle Total do Seu Ambiente Com Nossa Hospedagem Web'],
    ['Mantenga El Control Total De Su Entorno<br> Con Nuestro Alojamiento Web', 'Mantenha o Controle Total do Seu Ambiente<br> Com Nossa Hospedagem Web'],
    ['Mantenga El Control Total De Su Entorno<br>Con Nuestro Alojamiento Web', 'Mantenha o Controle Total do Seu Ambiente<br>Com Nossa Hospedagem Web'],
    ['HOSTING EMPRESARIAL', 'HOSPEDAGEM EMPRESARIAL'],
    ['Alojamiento Empresarial', 'Hospedagem Empresarial'],
    ['Potente alojamiento cPanel diseñado para sitios web o comercio electrónico más grandes y exigentes', 'Potente hospedagem cPanel desenvolvida para sites corporativos e e-commerces de alta exigência'],
    ['Alojamiento compatible con PCI diseñado para proporcionar un rendimiento líder en la industria con grandes límites de recursos en unidades NVMe puras.', 'Hospedagem com conformidade PCI desenvolvida para alta performance com amplos limites de recursos em SSD NVMe puro.'],
    ['Nuestro alojamiento empresarial es ideal para empresas en crecimiento, blogs o sitios web de comercio electrónico para un rendimiento líder en la industria.', 'Nossa hospedagem empresarial é ideal para empresas em expansão, portais e e-commerces que exigem o máximo desempenho.'],
    ['WEB HOSTING COMPARTIDO', 'HOSPEDAGEM COMPARTILHADA'],
    ['WEB HOSTING EXCLUSIVO', 'HOSPEDAGEM EXCLUSIVA'],
    ['cPanel ha sido diseñado para ser fácil de usar e intuitivo.', 'O cPanel foi desenvolvido para ser intuitivo e fácil de usar.'],
    ['cPanel ha sido diseñado para ser fácil de usar e intuitivo', 'O cPanel foi desenvolvido para ser intuitivo e fácil de usar'],
    ['cPanel ha sido desarrollado por un equipo dedicado que abarca más de 20 años.', 'O cPanel é aprimorado continuamente por uma equipe dedicada há mais de 20 anos.'],
    ['cPanel ha sido desarrollado por un equipo dedicado que abarca más de 20 años', 'O cPanel é aprimorado continuamente por uma equipe dedicada há mais de 20 anos'],
    ['Potentes funciones de alojamiento para nuevos sitios web y aplicaciones avanzadas', 'Poderosos recursos de hospedagem para novos projetos e aplicações web avançadas'],
    ['Nuestro alojamiento web ilimitado ha sido diseñado desde cero para brindar un rendimiento constante y de vanguardia.', 'Nossa hospedagem web ilimitada foi desenvolvida do zero para oferecer desempenho constante e de ponta.'],
    ['Alojamiento web con almacenamiento ilimitado, ancho de banda ilimitado, certificados SSL gratuitos y copias de seguridad diarias incluidas sin cargo.', 'Hospedagem web com armazenamento ilimitado, tráfego ilimitado, certificados SSL gratuitos e backups diários inclusos sem custo.'],
    ['Simple yet powerful tools', 'Ferramentas simples e poderosas'],
    ['Everything you need and much more', 'Tudo o que você precisa e muito mais'],
    ['In one place at an solo click de distancia.', 'Em um só lugar a apenas um clique de distância.'],
    ['Asegura y garantiza la fiabilidad de tus recursos dirigidos al público como sitios web, API y aplicaciones.', 'Garante e protege a disponibilidade dos seus recursos públicos como sites, APIs e aplicações.'],
    ['Con este plugin que se conecta directamente con el servidor y utiliza la tecnología y desde servidor para acelerar WordPress.', 'Conecta-se diretamente ao servidor e utiliza aceleração em nível de kernel para potencializar o WordPress.'],
    ['Es prioridad máxima en nuestro servicio. BitNinja protege tanto de ataques únicos como de multitud de ataques simultáneos.', 'Prioridade máxima em nosso serviço. O BitNinja protege tanto contra ataques isolados quanto investidas simultâneas.'],
    ['Es hermoso, increíblemente rápido y viene con características avanzadas que le brindan a usted y a su equipo tecnologías de comunicación de vanguardia.', 'Moderno, ultrarrápido e repleto de recursos avançados que oferecem a você e à sua equipe e-mail corporativo de ponta.'],
    ['Es un sistema de gestión de contenidos, Es la forma más simple y popular para crear su propio sitio o blog, es el manejador de contenidos más grande del mundo.', 'O sistema de gerenciamento de conteúdo mais popular do mundo, ideal para criar sites e blogs com rapidez e facilidade.'],
    ['Es constructor de sitios web profesional y muy fácil de utilizar. No se necesitas tener conocimientos en programación o configuraciones complejas.', 'Criador de sites profissional e intuitivo. Não requer conhecimentos de programação ou configurações complexas.'],
    ['Sus aplicaciones favoritas', 'Seus aplicativos favoritos'],
    ['Nuestro alojamiento compartido viene optimizado', 'Nossa hospedagem compartilhada vem otimizada'],
    ['Con la aplicación más popular', 'Com os aplicativos mais populares'],
    ['Con instalación de un clic', 'Com instalação em um clique'],
    ['HOSTING FEATURES & BENEFITS !', 'RECURSOS E BENEFÍCIOS DA HOSPEDAGEM!'],
    ['¡Herramientas simples y potentes, a su entera disposición en todos los planes!', 'Ferramentas simples e poderosas à sua inteira disposição em todos os planos!'],
    ['Seguridad y malware<br>Seguridad a prueba de balas', 'Segurança e Antimalware<br>Proteção blindada'],
    ['Seguridad y malware', 'Segurança e Antimalware'],
    ['Seguridad a prueba de balas', 'Proteção blindada'],
    ['Alojamiento en la nube<br>Ultrarrápido Bolt-Cache', 'Hospedagem na Nuvem<br>Bolt-Cache Ultrarrápido'],
    ['Alojamiento en la nube', 'Hospedagem na Nuvem'],
    ['Ultrarrápido Bolt-Cache', 'Bolt-Cache Ultrarrápido'],
    ['Copias de seguridad<br>Diarias y gratuitas', 'Backups Automáticos<br>Diários e gratuitos'],
    ['Copias de seguridad', 'Backups Automáticos'],
    ['Diarias y gratuitas', 'Diários e gratuitos'],
    ['Certificados SSL completos<br>de 256 bits. Gratis', 'Certificados SSL Completos<br>256 bits gratuitos'],
    ['Certificados SSL completos', 'Certificados SSL Completos'],
    ['de 256 bits. Gratis', '256 bits gratuitos'],
    ['MailChannels - ¡No más problemas de listas negras!', 'MailChannels - Sem problemas de listas negras!'],
    ['Almacenamiento en caché de proxy NGINX', 'Armazenamento em cache NGINX'],
    ['Instalación de aplicaciones simplificado', 'Instalação de aplicativos simplificada'],
    ['99,9% de tiempo de Actividad garantizado', '99.9% de uptime garantido'],
    ['99.9% de tiempo de Actividad garantizado', '99.9% de uptime garantido'],

    // Reseller cPanel & DirectAdmin
    ['Alojamiento de revendedor', 'Hospedagem Revenda'],
    ['Alojamiento de<br> revendedor', 'Hospedagem de<br> Revenda'],
    ['Alojamiento de<br>revendedor', 'Hospedagem de<br>Revenda'],
    ['Nuestro alojamiento para revendedores ha sido diseñado desde cero para proporcionar un rendimiento constante y de vanguardia.', 'Nossa hospedagem revenda foi desenvolvida do zero para oferecer desempenho consistente e tecnologia de ponta.'],
    ['Inicie su negocio de alojamiento hoy en la plataforma de alojamiento para revendedores más poderosa del mundo.', 'Inicie sua empresa de hospedagem hoje mesmo na plataforma de revenda mais poderosa do mercado.'],
    ['Ver DirectAdmin para revendedor', 'Ver planos Revenda DirectAdmin'],
    ['Ver cPanel para revendedor', 'Ver planos Revenda cPanel'],
    ['¡Disponemos del plan ideal para iniciar tu negocio!', 'Temos o plano ideal para iniciar seu negócio!'],
    ['Alojamiento de revendedor potente, rápido y seguro', 'Hospedagem revenda potente, rápida e segura'],
    ['Alojamiento de revendedor, ideal para alojar varios sitios o blogs.', 'Hospedagem revenda, perfeita para hospedar múltiplos sites ou blogs.'],
    ['Alojamiento de revendedor rápido, confiable y seguro impulsado por cPanel.', 'Hospedagem revenda rápida, estável e segura com cPanel.'],
    ['Alojamiento de revendedor rápido, confiable y seguro impulsado por DirectAdmin.', 'Hospedagem revenda rápida, estável e segura com DirectAdmin.'],
    ['cuentas de cPanel', 'Contas cPanel'],
    ['cuentas de DirectAdmin', 'Contas DirectAdmin'],
    ['Almacenamiento SSD <br>ilimitado', 'Armazenamento SSD <br>ilimitado'],
    ['Almacenamiento SSD ilimitado', 'Armazenamento SSD ilimitado'],
    ['2 núcleos de CPU / 2 GB de RAM', '2 núcleos de CPU / 2 GB de RAM'],
    ['(por cuenta de cPanel)', '(por conta cPanel)'],
    ['(por cuenta de DirectAdmin)', '(por conta DirectAdmin)'],
    ['Suite de correo CrossBox', 'Suíte de E-mail CrossBox'],
    ['Servidores de nombres personalizados gratuitos', 'Servidores DNS personalizados grátis'],
    ['Paquetes ilimitados', 'Pacotes ilimitados'],
    ['Gestión centralizada', 'Gerenciamento centralizado WHM'],
    ['(Certificado SSL Gratis<br>en todas las cuentas)', '(Certificado SSL Grátis<br>em todas as contas)'],
    ['PANEL DE CONTROL LÍDER EN LA INDUSTRIA Y GESTIÓN DE DISTRIBUIDORES', 'PAINEL DE CONTROLE LÍDER E GERENCIAMENTO DE REVENDA'],
    ['Tu marca', 'Sua Marca Própria (White-Label)'],
    ['Migración', 'Migração Gratuita'],
    ['¿Cómo funciona?', 'Como funciona a Revenda?'],
    ['Negocios de bajo costo', 'Baixo custo inicial'],
    ['Ingresos fijos', 'Faturamento recorrente'],
    ['Automatización', 'Automação total'],
    ['<span>Nosotros nos encargamos de...</span>', '<span>Nós cuidamos de...</span>'],
    ['Gestionar la plataforma', 'Manter os servidores, a rede e a alta disponibilidade 24/7'],
    ['Seguridad del servidor', 'Segurança BitNinja, firewalls WAF, backups automáticos e proteção DDoS'],
    ['Aplicaciones y software', 'Atualizações constantes do sistema, patches de segurança e licenças'],
    ['<span>Tú te encargas de...</span>', '<span>Você cuida de...</span>'],
    ['Apoyando a sus clientes', 'Definir seus preços, montar seus pacotes e atender seus clientes'],
    ['Gestionar su negocio', 'Expandir sua marca e aumentar seus lucros'],
    ['Configurar cuentas de cliente', 'Criar e gerenciar contas de clientes com um clique no WHM'],
    ['Migre sus sitios web con nosotros, utilizando nuestro Centro de migración.', 'Migre seus sites para a NETZ através da nossa Central de Migração gratuita.'],
    ['VEA NUESTRA DESCRIPCIÓN GENERAL DE NUESTRO ALOJAMIENTO PARA REVENDEDORES', 'CONFIRA UMA VISÃO GERAL DA NOSSA HOSPEDAGEM REVENDA'],
    ['Puede ejecutar un negocio de alojamiento de forma independiente o como un servicio adicional.', 'Você pode administrar um negócio de hospedagem de forma autônoma ou como um serviço adicional.'],
    ['Haga crecer su negocio en piloto automático, utilizando nuestra plataforma líder en la', 'Expanda seu negócio no piloto automático utilizando nossa plataforma líder do'],
    ['Gestionamos proactivamente nuestros servidores para asegurarnos de ofrecer la mejor', 'Gerenciamos proativamente nossos servidores para entregar a melhor'],
    ['plataforma de alojamiento para revendedores. Nuestros ingenieros trabajan arduamente para', 'plataforma de revenda de hospedagem. Nossos engenheiros trabalham continuamente para'],
    ['garantizar que nuestra plataforma de alojamiento en la nube de múltiples rutas sirva a sus', 'garantir que nossa plataforma em nuvem atenda perfeitamente aos seus'],
    ['Trabajamos mucho para mantener nuestros servidores seguros y protegidos contra posibles', 'Trabalhamos continuamente para manter nossos servidores seguros e protegidos contra'],
    ['amenazas a través de nuestras instalaciones de protección de nivel de red y malware. También', 'ameaças através de proteção de rede avançada e antimalware. Também'],
    ['usamos CloudLinux en todos nuestros servicios compartidos para garantizar que cada usuario', 'usamos CloudLinux em todos os servidores compartilhados para garantir que cada usuário'],
    ['Nuestros paquetes de revendedor incluyen cPanel y WHM como estándar, junto con nuestra', 'Nossos pacotes de revenda incluem cPanel e WHM de fábrica, com recursos'],
    ['utilice software de automatización de alojamiento como WHMCS o Blesta.', 'utilize softwares de automação de hospedagem como WHMCS ou Blesta.'],
    ['Puede crear y administrar las cuentas de alojamiento de sus clientes a través del intuitivo y', 'Você pode criar e gerenciar as contas de hospedagem de seus clientes através do intuitivo'],

    // About Us
    ['Estamos contigo en <br>cada paso del camino', 'Estamos com você em <br>cada etapa do caminho'],
    ['Estamos contigo en cada paso del camino', 'Estamos com você em cada etapa do caminho'],
    ['Ya sea que esté buscando un plan de alojamiento de sitios web <b>personales</b> o un plan de alojamiento de sitios web <b>comerciales</b>, somos la solución perfecta para usted. Nuestros poderosos servicios de alojamiento de sitios web no solo lo ayudarán a lograr sus objetivos generales de sitios web, sino que también le brindarán la confianza que necesita al saber que está asociado con una plataforma de alojamiento de sitios web <b>confiable</b> y <b>segura</b>.', 'Quer você esteja procurando um plano de hospedagem de sites <b>pessoais</b> ou <b>comerciais</b>, somos a solução ideal para você. Nossos poderosos serviços de hospedagem não só ajudarão você a atingir seus objetivos online, como também darão a confiança e segurança que você precisa em uma plataforma <b>estável</b> e <b>segura</b>.'],
    ['Encontrará una gran variedad de dominios, al mejor precio del mercado contratando nuestros servicios de hosting, en el caso que no encuentre en nuestra lista, <br>¡Ponte en contacto con nosotros lo gestionamos!', 'Você encontrará uma grande variedade de domínios com os melhores preços do mercado ao contratar nossa hospedagem. Se a extensão desejada não estiver listada, <br>fale conosco que providenciaremos imediatamente!'],
    ['Al confiar en nosotros con sus necesidades de negocio, le prometemos un 99.9% de tiempo de actividad en cualquier servicio que ofrecemos, fuera de cualquier mantenimiento estándar que podamos proporcionar.', 'Ao confiar na NETZ com as necessidades da sua empresa, garantimos 99.9% de uptime em todos os serviços oferecidos.'],
    ['Ofrecemos servicios exclusivos de hospedaje web con recursos mejorados ideales para negocio que requieran un tráfico más elevado, le prometemos un 99.9% de tiempo de actividad en cualquier servicio que ofrecemos..', 'Oferecemos serviços exclusivos de hospedagem web com recursos aprimorados ideais para projetos com alto tráfego e 99.9% de uptime garantido.'],
    ['Disponemos de servicios de VPS administrado y no administrado (Linux – Windows), Podrá administrar Ud. mismo, <br>Disponibilidad de un 99.9%, fuera de cualquier mantenimiento estándar que podamos proporcionar.', 'Dispomos de serviços VPS gerenciados e não gerenciados (Linux – Windows) para você administrar como preferir, com 99.9% de disponibilidade.'],
    ['Estamos preparados para cualquier desafío, habilitamos el servicio de streaming de Audio y TV con la mejor calidad y alto rendimiento al mejor precio del mercado<br>Disponibilidad de un 99.9%, fuera de cualquier mantenimiento estándar que podamos proporcionar.', 'Prontos para qualquer desafio: serviços de streaming de Áudio e TV com máxima qualidade, alto desempenho e estabilidade de 99.9%.'],
    ['Aumente sus ingresos con nuestro plan para revendedores. <br> Podrá revender nuestros productos de hosting con su propia marca, nos encargamos del mantenimiento del servidor y Ud. de sus clientes. <br> Podrá color sus propios precios a sus servicios.', 'Aumente seus lucros com nosso plano para revendedores. <br> Revenda serviços de hospedagem sob sua própria marca: nós cuidamos dos servidores e você gerencia seus clientes e seus próprios preços.'],
    ['Nuestros clientes<br>son lo primero', 'Nossos clientes<br>estão em primeiro lugar'],
    ['Nuestros clientes son lo primero', 'Nossos clientes estão em primeiro lugar'],
    ['Fundada en 2019, NETZ comenzó a cambiar el rostro de la industria del alojamiento desde el principio con un conjunto de nuevos estándares: ofrecer <b>servicios de alojamiento de calidad a un precio razonable.</b> Nuestro personal dedicado asegura que nuestros clientes se sientan respetados, satisfechos y cuidados en todo momento.<br>Aunque nuestro hardware de última generación y nuestro alojamiento confiable no tienen comparación, es realmente nuestro extraordinario servicio al cliente lo que nos distingue en un mar de competidores.<br> Prometemos prepararlo para el éxito con el soporte y el alojamiento líderes en la industria.<br> <b>Puedes confiar en nosotros!</b>', 'Fundada em 2019, a NETZ começou a transformar a indústria de hospedagem com novos padrões: oferecer <b>serviços de hospedagem de qualidade com preços acessíveis.</b> Nossa equipe dedicada garante que nossos clientes se sintam acolhidos, satisfeitos e bem atendidos em todos os momentos.<br>Embora nossa infraestrutura moderna e nossos servidores sejam incomparáveis, é nosso suporte ao cliente humanizado que realmente nos diferencia.<br><b>Você pode contar com a NETZ!</b>'],
    ['Información importante', 'Informações Importantes'],
    ['Copias de seguridad diarias automáticas GRATIS. También disponemos de recursos exclusivos para cada cuenta de hosting ya cPanel o DirectAdmin, es posible duplicar estos recursos con un pago adicional.', 'Backups automáticos diários GRATUITOS. Também disponibilizamos recursos dedicados para cada conta cPanel ou DirectAdmin, expansíveis sob demanda.'],
    ['mantenemos nuestro compromiso de ofrecer a nuestros clientes una de las mejores soluciones de alojamiento del mercado.', 'mantemos nosso compromisso de oferecer aos nossos clientes as melhores soluções de hospedagem do mercado.'],
    ['mantenemos nuestro compromiso de ofrecer a nuestros clientes una de las mejores soluciones de', 'mantemos nosso compromisso de oferecer aos nossos clientes as melhores soluções de'],
    ['alojamiento del mercado.', 'hospedagem do mercado.'],
    ['Alojamiento VPS administrado y no administrado ahorra dinero seleccionando un', 'Hospedagem VPS gerenciada e não gerenciada: economize escolhendo o'],
    ['Estamos disponibles en nuestro chat en Vivo para ayudarte cuando necesites.', 'Estamos disponíveis em nosso chat ao vivo 24/7 para ajudar sempre que precisar.'],
    ['Nuestro conjunto de herramientas y complementos se ha creado internamente para', 'Nosso conjunto de ferramentas e recursos foi desenvolvido sob medida para'],
    ['Lo Que Dicen Nuestros Clientes<br>Sobre Nós', 'O Que Nossos Clientes Dizem<br>Sobre Nós'],
    ['Lo Que Dicen Nuestros Clientes<br>Sobre Nosotros', 'O Que Nossos Clientes Dizem<br>Sobre Nós'],

    // VPS Linux & Windows
    ['Mantenga el control total con nuestro VPS', 'Mantenha controle total com nossos servidores VPS'],
    ['<span>Mantenga el control total con nuestro VPS</span>', '<span>Mantenha controle total com nossos servidores VPS</span>'],
    ['Todos nuestros planes cuentan con garantía de satisfacción. Ver política de reembolsos', 'Todos os nossos planos contam com garantia de satisfação. Consulte nossa política de reembolso'],
    ['Nuestro servicio de monitoreo en tiempo real se ofrece para todos los planes VPS de Linux no', 'Nosso serviço de monitoramento em tempo real está disponível para todos os servidores VPS Linux não'],
    ['Las copias de seguridad nocturnas se ofrecen en todos los servidores Linux. Haga una copia de', 'Backups automatizados são oferecidos em todos os servidores Linux. Crie cópias de'],
    ['Perguntas Frequentes<span>En caso de que sus dudas no son aclaradas no dude en visitar nuestra', 'Perguntas Frequentes<span>Caso suas dúvidas não sejam esclarecidas, visite nossa'],
    ['a trasladar sus servicios de alojamiento web VPS Linux de otros proveedores, y estamos', 'a migrar seus serviços de servidores VPS Linux de outros provedores com suporte'],
    ['servidor esté listo para su uso y haya enviado una solicitud de migración, nuestros', 'servidor estiver pronto e enviar a solicitação de migração, nossa'],
    ['ISO. Estamos ampliando constantemente las opciones de Linux en nuestro portal en la nube para ofrecer a nuestros clientes la mayor cantidad de opciones posibles.', 'ISO. Estamos expandindo constantemente as opções de sistemas operacionais em nossa nuvem para oferecer máxima flexibilidade.'],
    ['Le damos la opción de agregar copias de seguridad a su servidor cuando realiza su pedido', 'Oferecemos a opção de adicionar backups automáticos ao seu servidor durante o pedido'],
    ['facilitamos la adición de copias de seguridad incrementales automatizadas para su servidor. Las copias de seguridad cuestan solo', 'facilitamos a ativação de backups incrementais automatizados para o seu servidor. Os backups custam apenas'],
    ['Las copias de seguridad cuestan solo', 'Os backups custam apenas'],

    // Buttons
    ['>Contratar<', '>Contratar Agora<']
];

const filesToProcess = fs.readdirSync(localesBrDir).filter(f => f.endsWith('.html'));

console.log('🔄 Aplicando traduções profundas em todas as páginas BR...');

for (const file of filesToProcess) {
    const srcPath = path.join(localesBrDir, file);
    let content = fs.readFileSync(srcPath, 'utf8');

    for (const [from, to] of deepReplacements) {
        content = replaceFlexible(content, from, to);
    }

    fs.writeFileSync(srcPath, content, 'utf8');
    fs.writeFileSync(path.join(brDir, file), content, 'utf8');
    if (fs.existsSync(distBrDir)) {
        fs.writeFileSync(path.join(distBrDir, file), content, 'utf8');
    }

    console.log(`✅ Atualizado: ${file}`);
}

console.log('🎉 Finalizadas as traduções profundas BR!');
