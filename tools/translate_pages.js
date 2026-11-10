const { replaceFuzzy, applyList, globalPairs } = require('./translate_base.js');

const pageDictionaries = {
    'audio-streaming.html': [
        ['<title>Radio Streaming SSL con AutoDJ SonicPanel | NETZ</title>', '<title>HD Radio Streaming with AutoDJ & SonicPanel | NETZ</title>'],
        ['<title>Radio Streaming Profesional | NETZ</title>', '<title>Professional Online Radio Streaming | NETZ</title>'],
        ['content="Servicio de streaming de audio en vivo con SonicPanel, AutoDJ, tráfico ilimitado y reproducción compatible con Android e iOS."', 'content="Live HD audio streaming with SonicPanel, cloud AutoDJ, unlimited bandwidth, and HTML5 players for Android & iOS."'],
        ['¿Necesitas Una Forma De Realizar Streaming?', 'Need A Professional Streaming Platform?'],
        ['AUDIO', 'AUDIO'],
        ['Full Oyentes Ilimitados', 'Unlimited Simultaneous Listeners'],
        ['En NETZ te ofrecemos una nueva solución para tu radio online.', 'At NETZ, we provide the ultimate high-fidelity streaming solution for your online radio station.'],
        ['Herramientas Simples Y Potentes', 'Simple Yet Powerful Tools'],
        ['CPU 100% Intel De Alto Rendimiento Y Plataforma Bare Metal 100% SSD.', '100% High-Performance Intel CPUs & Pure Bare-Metal NVMe SSD Architecture.'],
        ['Stream Mini <span>Plan Inicial</span>', 'Stream Mini <span>Starter Plan</span>'],
        ['Stream Junior <span>Plan Especial</span>', 'Stream Junior <span>Special Plan</span>'],
        ['Stream Junior II <span>Plan Premium</span>', 'Stream Junior II <span>Premium Plan</span>'],
        ['Cantidad de Oyentes en Simultáneo', 'Simultaneous Listeners'],
        ['Calidad de audio', 'Audio Bitrate Quality'],
        ['Transmisión con <b>Certificado SSL</b>', 'Broadcast with <b>SSL Certificate</b>'],
        ['AutoDj <b>2 Gb Almacenamiento</b>', 'AutoDJ <b>2 GB Storage</b>'],
        ['AutoDj <b>10 Gb Almacenamiento</b>', 'AutoDJ <b>10 GB Storage</b>'],
        ['AutoDj <b>100 Gb Almacenamiento</b>', 'AutoDJ <b>100 GB Storage</b>'],
        ['Reproductor <b>HTML5</b>', 'Player <b>HTML5 HD</b>'],
        ['Soporte <b>Incluye</b>', 'Support <b>Included 24/7</b>'],

        // Main presentation text
        [`ShoutCast es una solución para la transmisión de audio en directo a través de Internet como una
                        estación tradicional de radio. Los usuarios pueden escuchar esta transmisión desde cualquier
                        reproductor de medios. También es posible la transmisión de audio las 24 horas gracias al
                        sistema de autoDJ, con el cual se puede programar el contenido que desees para su
                        emisión.<br>Nuestra solución para Radio Streaming HD es SonicPanel: ShoutCast V1 y V2, AutoDJ,
                        PlayList, MP3 y AAC Plus V2, con un generador personalizado de reproductores HD HTML5 que son
                        compatibles con Android e iOS, streaming seguro bajo protocolo HTTPS (SSL) y con transferencia
                        ilimitada.`,
         `ShoutCast is an industry-standard solution for live audio broadcasting over the internet like a traditional radio station. Listeners can tune in from any media player or mobile app. 24/7 continuous broadcast is effortless with our cloud AutoDJ system.<br>Our HD Radio Streaming solution is powered by SonicPanel: ShoutCast V1 & V2, AutoDJ, PlayLists, MP3 and AAC+ V2, with custom HTML5 HD players compatible with Android and iOS, secure HTTPS (SSL) streaming, and unlimited bandwidth.`],

        // FAQs
        ['¿Que es Radio Streaming?', 'What is Radio Streaming?'],
        ['Radio Streaming es un servicio para emisiones de audio en directo a través de Internet. NETZ distribuye la señal de streaming y tus oyentes conectándose a internet, pueden escuchar la señal de audio en directo a través de una página web en la cual se incluya el reproductor de audio o directamente desde Windows Media Player, Winamp o cualquier otro reproductor de medios.', 'Radio Streaming is a digital broadcasting service that delivers live audio over the Internet. NETZ distributes your audio signal worldwide so listeners can tune in via web players, mobile apps, or desktop media players.'],
        ['¿Los planes incluyen AutoDj?', 'Do plans include cloud AutoDJ?'],
        ['Sí. A partir del plan Junior incluye la función de AutoDJ y PlayList.', 'Yes. Starting from the Junior plan, automated 24/7 cloud AutoDJ and custom playlist scheduling are fully included.'],
        ['¿Los planes incluyen transferencia ilimitada?', 'Do plans include unmetered bandwidth?'],
        ['Sí. Todos los planes incluyen transferencia ilimitada.', 'Yes. All radio streaming plans feature 100% unmetered bandwidth without data caps.'],
        ['¿EL streaming se realiza bajo secure Streaming (https)?', 'Is the stream broadcasted over secure HTTPS (SSL)?'],
        ['Sí. Todos los planes incluyen la transmisión bajo secure streaming (https). Solamente tienes que indicarnos los datos de tu streaming para activar el protocolo SSL.', 'Yes. All streaming plans broadcast via secure HTTPS (SSL), ensuring total compatibility with modern browsers and mobile platforms.'],
        ['¿Cuanto tiempo tarda en activarse mi cuenta?', 'How long does it take for my account to activate?'],
        ['La activación de los planes se realiza una vez recibamos el pago por el servicio contratado.', 'Activation is instantaneous and automated as soon as your payment is confirmed.'],
        ['¿Puedo elegir un plan y luego cambiarlo por otro?', 'Can I upgrade my streaming plan later?'],
        ['Sí. Puedes cambiar de plan en cualquier momento.', 'Yes. You can upgrade your listener capacity or AutoDJ storage at any time from your Client Area.'],
        ['¿Qué sistemas operativos son compatibles con Radio Streaming?', 'What operating systems and media players are supported?'],
        ['Todos nuestros planes de radio, así como los reproductores HD HTML5 son compatibles con los sistemas operativos Windows, MacOS y Linux. Para smartphones y tabletas, la compatibilidad es total con Android e iOS.', 'Our radio streams and HTML5 HD players work seamlessly across Windows, macOS, Linux, iOS, and Android mobile devices.'],
        ['¿Cuál es la garantía de disponibilidad?', 'What is the uptime and reliability guarantee?'],
        ['Nuestra garantía de disponibilidad del servicio es del 99%.', 'We guarantee 99.9% service uptime backed by our redundant low-latency network.'],
        ['¿Existe una política de devolución de dinero?', 'Do you offer a refund policy for streaming?'],
        ['No hay devolución alguna sobre los servicios de Radio streaming.', 'Radio streaming setups involve immediate dedicated resource reservation, so fees are non-refundable.'],
        ['¿Puedo cancelar mi servicio?', 'Can I cancel my service at any time?'],
        ['Sí. Puedes cancelar el servicio en cualquier momento desde el Área de Clientes sin ningún tipo de problema.', 'Yes. You can cancel your subscription at any time directly from your Client Area without penalties.']
    ],

    'video-streaming.html': [
        ['<title>Video Streaming en Vivo HD con SSL | NETZ</title>', '<title>Live HD Video Streaming with SSL | NETZ</title>'],
        ['<title>Video Streaming en Vivo | NETZ</title>', '<title>Live Video Streaming Platform | NETZ</title>'],
        ['content="Transmisión de video streaming en vivo con calidad HD, soporte multidispositivo y reproductores HTML5 compatibles con SSL."', 'content="Live HD video streaming with multi-device support, HTML5 players, low latency, and secure SSL encryption."'],
        ['content="Transmisión de video en vivo HD 720p con SSL, reproductores HTML5 y soporte multiplataforma."', 'content="Live HD 720p video streaming with SSL, HTML5 players, and cross-platform mobile compatibility."'],
        ['¿Necesitas Una Forma De Realizar Streaming?', 'Need A Professional Streaming Platform?'],
        ['VIDEO STREAMING', 'LIVE VIDEO STREAMING'],
        ['Selecciona el plan de streaming tv y comienza a transmitir.', 'Select your TV streaming plan and start broadcasting live today.'],
        ['Streaming TV Basico', 'Basic TV Streaming'],
        ['Streaming TV Estándar', 'Standard TV Streaming'],
        ['Streaming TV Avanzado', 'Advanced TV Streaming'],
        ['Streaming TV Premium', 'Premium TV Streaming'],
        ['50 Espectadores', '50 Viewers'],
        ['100 Espectadores', '100 Viewers'],
        ['500 Espectadores', '500 Viewers'],
        ['1000 Espectadores', '1,000 Viewers'],
        ['Bitrate Video hasta 720 Kbps', 'Video Bitrate up to 720 Kbps'],
        ['Bitrate Video hasta 1280 Kbps', 'Video Bitrate up to 1280 Kbps'],
        ['Codec video H.264', 'H.264 Video Codec'],
        ['Calidad máxima. 480P', 'Max Resolution 480p SD'],
        ['Calidad máxima. 720P', 'Max Resolution 720p HD'],
        ['Formato MP4', 'MP4 Format Support'],
        ['Players HTML5', 'HTML5 Responsive Players'],
        ['Streaming SSLL', 'SSL Encrypted Streaming'],
        ['Streaming SSL', 'SSL Encrypted Streaming'],
        ['Soporte para moviles', 'Mobile & Tablet Support'],
        ['Wowza Media Server', 'Wowza Media Engine'],
        ['Panel MediaCP (Cast Control)', 'MediaCP Control Panel'],
        ['Estadisticas/GeoMap', 'Real-Time GeoMap & Stats'],
        ['Trafico ilimitado', 'Unlimited Bandwidth'],
        ['Compatible con Smartphone', 'Smartphone Compatible'],
        ['Transmite tus eventos en vivo con la máxima calidad y sin interrupciones', 'Broadcast live events with maximum HD quality, low latency, and zero buffering.'],
        ['Calidad máxima 720p', 'High-Definition 720p Video Quality'],
        ['Streaming seguro bajo protocolo HTTPS (SSL)', '100% Secure HTTPS (SSL) Protocol']
    ],

    'reseller-cpanel.html': [
        ['<title>Hosting Reseller cPanel & WHM Multicuenta | NETZ</title>', '<title>cPanel & WHM Reseller Hosting Multi-Account | NETZ</title>'],
        ['<title>Revendedor de Hosting cPanel & WHM | NETZ</title>', '<title>cPanel & WHM Reseller Hosting | NETZ</title>'],
        ['content="Inicia tu propio negocio de hosting con nuestra plataforma de revendedor cPanel & WHM de alta velocidad y recursos independientes."', 'content="Launch your web hosting business with our high-speed cPanel & WHM reseller platform with isolated resources."'],
        ['content="Inicia o expande tu negocio de hosting con planes Reseller cPanel y WHM. Servidores ultrarrápidos NVMe, cuentas independientes y marca blanca."', 'content="Launch or grow your hosting company with cPanel & WHM Reseller plans. Pure NVMe storage, white-label branding, and 24/7 care."'],
        ['Alojamiento de<br> revendedor', 'Reseller<br> Web Hosting'],
        ['Alojamiento de revendedor', 'Reseller Web Hosting'],
        ['Desarrollado por cPanel', 'Powered by cPanel & WHM'],
        ['Nuestro alojamiento para revendedores ha sido diseñado desde cero para proporcionar un rendimiento constante y de vanguardia.<br><br> Inicie su negocio de alojamiento hoy en la plataforma de alojamiento para revendedores más poderosa del mundo.<br>', 'Our reseller hosting platform is engineered from the ground up to deliver consistent, enterprise-grade speed and reliability.<br><br>Start your hosting company today on the world\'s most powerful, developer-trusted reseller platform.<br>'],
        ['Ver DirectAdmin para revendedor', 'View DirectAdmin Reseller Plans'],
        ['¡Disponemos del plan ideal para iniciar tu negocio!', 'We have the perfect plan to kickstart your hosting business!'],
        ['Alojamiento de revendedor potente, rápido y seguro', 'High-performance, secure, and lightning-fast reseller hosting'],
        ['Básico', 'Starter'],
        ['Alojamiento de revendedor, ideal para alojar varios sitios o blogs.', 'Reseller hosting, perfect for hosting multiple client websites or blogs.'],
        ['Alojamiento de revendedor rápido, confiable y seguro impulsado por cPanel.', 'Fast, reliable, and secure reseller web hosting powered by cPanel.'],
        ['cuentas de cPanel', 'cPanel Accounts'],
        ['almacenamiento SSD', 'SSD Storage'],
        ['Almacenamiento SSD <br>ilimitado', 'Unlimited SSD <br>Storage'],
        ['Almacenamiento SSD ilimitado', 'Unlimited SSD Storage'],
        ['2 núcleos de CPU / 2 GB de RAM', '2 CPU Cores / 2 GB RAM'],
        ['(por cuenta de cPanel)', '(per cPanel account)'],
        ['Bolt-Cache incluido', 'Bolt-Cache Included'],
        ['Litespeed Enterprise', 'LiteSpeed Enterprise Web Server'],
        ['Suite de correo CrossBox', 'CrossBox Modern Webmail Suite'],
        ['Ancho de banda ilimitado', 'Unlimited Bandwidth'],
        ['Servidores de nombres personalizados gratuitos', 'Free Private Name Servers (DNS)'],
        ['Paquetes ilimitados', 'Unlimited Hosting Packages'],
        ['Gestión centralizada', 'Centralized WHM Management'],
        ['Protección DDoS', 'DDoS Shield Protection'],
        ['Soporte técnico 24/7', '24/7 Technical Support'],
        ['(Certificado SSL Gratis<br>en todas las cuentas)', '(Free SSL Certificate<br>on all created accounts)'],

        ['PANEL DE CONTROL LÍDER EN LA INDUSTRIA Y GESTIÓN DE DISTRIBUIDORES CON', 'INDUSTRY-LEADING CONTROL PANEL & WHM RESELLER MANAGEMENT WITH'],
        ['PANEL DE CONTROL LÍDER EN LA INDUSTRIA Y GESTIÓN DE DISTRIBUIDORES', 'INDUSTRY-LEADING CONTROL PANEL & WHM RESELLER MANAGEMENT'],
        ['cPanel es el panel de control líder en el mercado hoy en día, diseñado para brindarle a usted y a sus clientes una experiencia de hospedaje excepcional.', 'cPanel is the industry\'s premier control panel, designed to provide you and your clients with an exceptional hosting experience.'],
        ['Fácil de usar', 'Easy To Use'],
        ['cPanel y WHM han sido diseñados para ser fáciles de usar e intuitivos.', 'cPanel and WHM are engineered for intuitive, effortless hosting management.'],
        ['Robusto', 'Robust'],
        ['cPanel ha sido desarrollado por un equipo dedicado que abarca más de 20 años.', 'cPanel has been built and perfected by an industry-leading engineering team over 20+ years.'],
        ['100% White-Label (Your Brand)', '100% White-Label (Your Brand)'],
        ['Personalice cPanel para sus clientes con su propio logotipo y marca.', 'Customize cPanel for your clients with your own brand logo and styling.'],
        ['Personalice cPanel para sus clientes con su propio logotipo y marca.<br><br>', 'Customize cPanel for your clients with your own brand logo and styling.<br><br>'],
        ['Free Client Migration', 'Free Client Migration'],
        ['Migre sus sitios web con nosotros, utilizando nuestro Centro de migración.', 'Migrate all your client accounts seamlessly using our assisted migration service.'],
        ['Demo Virtual cPanel', 'cPanel Live Demo'],
        ['Demo Virtual Whm', 'WHM Live Demo'],

        ['How Does Reseller Hosting Work?<br> <span>VEA NUESTRA DESCRIPCIÓN GENERAL DE NUESTRO ALOJAMIENTO PARA REVENDEDORES</span>', 'How Does Reseller Hosting Work?<br> <span>AN OVERVIEW OF OUR RESELLER HOSTING ARCHITECTURE</span>'],
        ['How Does Reseller Hosting Work?', 'How Does Reseller Hosting Work?'],
        ['VEA NUESTRA DESCRIPCIÓN GENERAL DE NUESTRO ALOJAMIENTO PARA REVENDEDORES', 'AN OVERVIEW OF OUR RESELLER HOSTING ARCHITECTURE'],
        ['Low Startup Cost', 'Low Startup Cost'],
        ['Reseller Hosting es una opción de bajo costo para administrar su propio negocio con éxito.', 'Reseller hosting is an affordable, low-risk way to launch and operate a profitable hosting company.'],
        ['Predictable Recurring Revenue', 'Predictable Recurring Revenue'],
        ['Puede ejecutar un negocio de alojamiento de forma independiente o como un servicio adicional.', 'Build high-margin recurring income alongside web design, development, or digital marketing services.'],
        ['Automatización', 'Automation Engine'],
        ['Haga crecer su negocio en piloto automático, utilizando nuestra plataforma líder en la industria.', 'Scale your agency on autopilot with automated billing, account setup, and client self-service.'],

        ['<span>Nosotros nos encargamos de...</span>', '<span>We take care of...</span>'],
        ['Gestionar la plataforma', 'Platform Infrastructure'],
        ['Gestionamos proactivamente nuestros servidores para asegurarnos de ofrecer la mejor plataforma de alojamiento para revendedores. Nuestros ingenieros trabajan arduamente para garantizar que nuestra plataforma de alojamiento en la nube de múltiples rutas sirva a sus sitios web lo más rápido posible y permanezca en línea en todo momento.', 'We proactively maintain hardware and high-speed network routing to ensure your client websites load instantaneously and remain online 24/7.'],
        ['Seguridad del servidor', 'Server Security & Firewalls'],
        ['Trabajamos mucho para mantener nuestros servidores seguros y protegidos contra posibles amenazas a través de nuestras instalaciones de protección de nivel de red y malware. También usamos CloudLinux en todos nuestros servicios compartidos para garantizar que cada usuario tenga su propio aislamiento.', 'We deploy multi-layer perimeter shielding with BitNinja, automated malware defense, and CloudLinux CageFS to strictly isolate each customer account.'],
        ['Aplicaciones y software', 'Core Software & Licensing'],
        ['Nuestros paquetes de revendedor incluyen cPanel y WHM como estándar, junto con nuestra combinación única de herramientas e instalaciones para hacer que la experiencia de hospedaje para sus clientes sea una alegría absoluta. Desde instalaciones de almacenamiento en caché únicas integradas internamente hasta malware y seguridad.', 'All reseller plans include genuine cPanel/WHM licenses, LiteSpeed caching, automated PHP upgrades, and security patches pre-configured.'],

        ['<span>Tú te encargas de...</span>', '<span>You take care of...</span>'],
        ['Apoyando a sus clientes', 'Supporting Your Clients'],
        ['Como revendedor, usted es responsable de brindar soporte técnico a sus clientes, ya sea solo o dirigiendo su propio pequeño equipo de agentes. Usted sería el contacto de sus clientes, ya que no podríamos comunicarnos con ellos directamente.', 'You act as the trusted primary contact for your end customers, setting your own brand reputation while we remain invisible behind the scenes.'],
        ['Gestionar su negocio', 'Growing Your Agency'],
        ['Sería responsable del marketing, la publicidad, los precios, los paquetes y la gestión general de su empresa. Para ayudar con la automatización de su negocio, le recomendamos que utilice software de automatización de alojamiento como WHMCS o Blesta.', 'You define your retail pricing, marketing strategies, and customized hosting tiers to maximize profit margins and recurring revenue.'],
        ['Configurar cuentas de cliente', 'Provisioning Client Accounts'],
        ['Puede crear y administrar las cuentas de alojamiento de sus clientes a través del intuitivo y fácil de usar \'WHM\' (WebHost Manager), sin embargo, también le recomendamos que compre una licencia WHMCS que automatizaría esto para usted y su negocio.', 'Easily spin up new cPanel accounts within seconds using WHM, or automate provisioning end-to-end via WHMCS or Blesta.']
    ],

    'reseller-directadmin.html': [
        ['<title>Hosting Reseller DirectAdmin Económico | NETZ</title>', '<title>Cost-Effective DirectAdmin Reseller Hosting | NETZ</title>'],
        ['<title>Revendedor de Hosting DirectAdmin | NETZ</title>', '<title>DirectAdmin Reseller Hosting | NETZ</title>'],
        ['content="Planes Reseller de alto rendimiento con panel DirectAdmin, cuentas ilimitadas, almacenamiento NVMe y el mejor precio del mercado."', 'content="High-performance DirectAdmin Reseller plans with unlimited accounts, NVMe storage, and competitive pricing."'],
        ['content="Servicio de revendedor económico y potente con panel DirectAdmin, soporte 24/7 y activación instantánea."', 'content="Affordable, high-speed reseller hosting powered by DirectAdmin, 24/7 support, and instant activation."'],
        ['Alojamiento de revendedor', 'Reseller Web Hosting'],
        ['Desarrollado por DirectAdmin', 'Powered by DirectAdmin'],
        ['Ver cPanel para revendedor', 'View cPanel Reseller Plans'],
        ['cuentas de DirectAdmin', 'DirectAdmin Accounts'],
        ['Tu marca', '100% White-Label (Your Brand)'],
        ['Personalice cPanel para sus clientes con su propio logotipo y marca.', 'Customize control panels for your clients with your own brand logo and identity.'],
        ['Personalice cPanel para sus clientes con su propio logotipo y marca.<br><br>', 'Customize control panels for your clients with your own brand logo and identity.<br><br>'],
        ['Automatización', 'Automation Engine'],
        ['Haga crecer su negocio en piloto automático, utilizando nuestra plataforma líder en la industria.', 'Scale your agency on autopilot with automated billing, account setup, and client self-service.'],
        ['<span>Nosotros nos encargamos de...</span>', '<span>We take care of...</span>'],
        ['Gestionar la plataforma', 'Platform Infrastructure'],
        ['Gestionamos proactivamente nuestros servidores para asegurarnos de ofrecer la mejor plataforma de alojamiento para revendedores. Nuestros ingenieros trabajan arduamente para garantizar que nuestra plataforma de alojamiento en la nube de múltiples rutas sirva a sus sitios web lo más rápido posible y permanezca en línea en todo momento.', 'We proactively maintain hardware and high-speed network routing to ensure your client websites load instantaneously and remain online 24/7.'],
        ['Seguridad del servidor', 'Server Security & Firewalls'],
        ['Trabajamos mucho para mantener nuestros servidores seguros y protegidos contra posibles amenazas a través de nuestras instalaciones de protección de nivel de red y malware. También usamos CloudLinux en todos nuestros servicios compartidos para garantizar que cada usuario tenga su propio aislamiento.', 'We deploy multi-layer perimeter shielding with BitNinja, automated malware defense, and CloudLinux CageFS to strictly isolate each customer account.'],
        ['Aplicaciones y software', 'Core Software & Licensing'],
        ['Nuestros paquetes de revendedor incluyen DirectAdmin como estándar, junto con nuestra combinación única de herramientas e instalaciones para hacer que la experiencia de hospedaje para sus clientes sea una alegría absoluta. Desde instalaciones de almacenamiento en caché únicas integradas internamente hasta malware y seguridad.', 'All reseller plans include genuine DirectAdmin licenses, LiteSpeed caching, automated PHP upgrades, and security patches pre-configured.'],
        ['<span>Tú te encargas de...</span>', '<span>You take care of...</span>'],
        ['Apoyando a sus clientes', 'Supporting Your Clients'],
        ['Como revendedor, usted es responsable de brindar soporte técnico a sus clientes, ya sea solo o dirigiendo su propio pequeño equipo de agentes. Usted sería el contacto de sus clientes, ya que no podríamos comunicarnos con ellos directamente.', 'You act as the trusted primary contact for your end customers, setting your own brand reputation while we remain invisible behind the scenes.'],
        ['Gestionar su negocio', 'Growing Your Agency'],
        ['Sería responsable del marketing, la publicidad, los precios, los paquetes y la gestión general de su empresa. Para ayudar con la automatización de su negocio, le recomendamos que utilice software de automatización de alojamiento como WHMCS o Blesta.', 'You define your retail pricing, marketing strategies, and customized hosting tiers to maximize profit margins and recurring revenue.'],
        ['Configurar cuentas de cliente', 'Provisioning Client Accounts'],
        ['Puede crear y administrar las cuentas de alojamiento de sus clientes a través del intuitivo y fácil de usar DirectAdmin, sin embargo, también le recomendamos que compre una licencia WHMCS que automatizaría esto para usted y su negocio.', 'Easily spin up new DirectAdmin accounts within seconds, or automate provisioning end-to-end via WHMCS or Blesta.']
    ],

    'about.html': [
        ['<title>Sobre Nosotros | Infraestructura y Equipo NETZ</title>', '<title>About Us | Infrastructure & Engineering Team | NETZ</title>'],
        ['<title>Sobre Nosotros | NETZ</title>', '<title>About Us | High-Performance Hosting & Infrastructure | NETZ</title>'],
        ['content="Conoce la visión, tecnología y servidores de última generación que hacen de NETZ una de las plataformas de hosting más confiables."', 'content="Discover our mission, global cloud infrastructure, and 24/7 support engineering team delivering high-performance hosting solutions."'],
        ['content="sobre netz, empresa hosting, data center servidores, equipo netz"', 'content="about netz, hosting company, cloud infrastructure, engineering team"'],
        ['Estamos contigo en <br>cada paso del camino', 'We are with you at <br>every step of the way'],
        ['Estamos contigo en cada paso del camino', 'We are with you at every step of the way'],
        [`Ya sea que esté buscando un plan de alojamiento de sitios web <b>personales</b> o un plan de
                        alojamiento de sitios web <b>comerciales</b>, somos la solución perfecta para usted. Nuestros
                        poderosos servicios de alojamiento de sitios web no solo lo ayudarán a lograr sus objetivos
                        generales de sitios web, sino que también le brindarán la confianza que necesita al saber que
                        está asociado con una plataforma de alojamiento de sitios web <b>confiable</b> y <b>segura</b>.
                        <br>`,
         `Whether you are launching a personal blog or scaling an enterprise eCommerce platform, NETZ provides the perfect infrastructure. Our high-performance hosting services deliver speed, security, and the peace of mind that comes with enterprise-grade reliability.<br>`],
        ['Empieza con nosotros ahora', 'Get Started With Us Today'],
        ['Dominios', 'Domains'],
        [`Encontrará una gran variedad de dominios, al mejor precio del mercado contratando nuestros servicios de hosting, en el caso que no encuentre en nuestra lista,
                                    <br>¡Ponte en contacto con nosotros lo gestionamos!`,
         `Explore a wide catalog of top-level domains at competitive rates. If you need a specialized TLD, contact us and our team will register it for you promptly!`],
        ['Hosting Ilimitado', 'Unlimited Web Hosting'],
        [`Al confiar en nosotros con sus necesidades de negocio, le prometemos un 99.9% de
                                    tiempo de actividad en cualquier servicio que ofrecemos, fuera de cualquier
                                    mantenimiento estándar que podamos proporcionar.`,
         `By entrusting us with your digital business, we guarantee 99.9% network and service uptime across all our hosting solutions.`],
        ['Hosting Exclusivo', 'Dedicated Hosting'],
        [`Ofrecemos servicios exclusivos de hospedaje web con recursos mejorados ideales para
                                    negocio que requieran un tráfico más elevado, le prometemos un 99.9% de tiempo de
                                    actividad en cualquier servicio que ofrecemos..`,
         `Dedicated hosting services with isolated CPU and RAM resources, engineered for mission-critical operations and high-traffic portals.`],
        ['VPS', 'VPS Servers'],
        [`Disponemos de servicios de VPS administrado y no administrado (Linux – Windows),
                                    Podrá administrar Ud. mismo, <br>Disponibilidad de un 99.9%, fuera de cualquier
                                    mantenimiento estándar que podamos proporcionar.`,
         `High-speed Linux and Windows VPS servers available with full root/RDP control or 24/7 managed administration.`],
        ['Streaming', 'Streaming Platform'],
        [`Estamos preparados para cualquier desafío, habilitamos el servicio de streaming de
                                    Audio y TV con la mejor calidad y alto rendimiento al mejor precio del
                                    mercado<br>Disponibilidad de un 99.9%, fuera de cualquier mantenimiento estándar que
                                    podamos proporcionar.`,
         `Ready for any audience size. HD audio and live video streaming with unmetered bandwidth, HTML5 players, and AutoDJ automation.`],
        ['Reseller', 'Reseller Hosting'],
        [`Aumente sus ingresos con nuestro plan para revendedores. <br> Podrá revender nuestros
                                    productos de hosting con su propia marca, nos encargamos del mantenimiento del
                                    servidor y Ud. de sus clientes. <br> Podrá color sus propios precios a sus
                                    servicios.`,
         `Grow your agency revenue with white-label reseller hosting. Package custom plans, set your profit margins, and manage accounts with WHM or DirectAdmin.`],
        ['Nuestros clientes<br>son lo primero', 'Our Customers<br>Come First'],
        ['Nuestros clientes son lo primero', 'Our Customers Come First'],
        [`Fundada en 2019, NETZ comenzó a cambiar el rostro de la industria del alojamiento desde el
                        principio con un conjunto de nuevos estándares: ofrecer <b>servicios de alojamiento de calidad a
                            un precio razonable.</b> Nuestro personal dedicado asegura que nuestros clientes se sientan
                        respetados, satisfechos y cuidados en todo momento.<br>Aunque nuestro hardware de última
                        generación y nuestro alojamiento confiable no tienen comparación, es realmente nuestro
                        extraordinario servicio al cliente lo que nos distingue en un mar de competidores.<br>
                        Prometemos prepararlo para el éxito con el soporte y el alojamiento líderes en la industria.<br>
                        <b>Puedes confiar en nosotros!</b>
                        <br>`,
         `Founded in 2019, NETZ set out to elevate hosting industry standards: delivering <b>enterprise-grade performance at transparent, accessible pricing.</b> Our dedicated engineering team ensures every client receives attentive, 24/7 technical assistance.<br>While our pure NVMe hardware and multi-gigabit network are second to none, our genuine commitment to client success is what truly sets us apart.<br><b>You can count on us!</b><br>`],
        ['Información importante', 'Key Advantages'],
        ['Copias de seguridad diarias automáticas GRATIS. También disponemos de recursos exclusivos para cada cuenta de hosting ya cPanel o DirectAdmin, es posible duplicar estos recursos con un pago adicional.', 'Free automated daily backups. Every cPanel and DirectAdmin account operates with dedicated memory and compute boundaries, expandable on demand.']
    ],

    'terminos-del-servicio.html': [
        ['<title>Términos del Servicio y Política de Reembolso | NETZ</title>', '<title>Terms of Service & Refund Policy | NETZ</title>'],
        ['<title>Términos del Servicio | NETZ</title>', '<title>Terms of Service | NETZ</title>'],
        ['content="Términos, condiciones de contratación, activación de servicios y política de reembolsos transparente para clientes de NETZ a nivel global."', 'content="Terms, service conditions, provisioning policies, and transparent refund terms for NETZ clients worldwide."'],
        ['content="terminos del servicio netz, condiciones hosting, politica de reembolso hosting, contrato de hosting"', 'content="netz terms of service, hosting conditions, refund policy, hosting agreement"'],

        ['<h4>1. PROCESO DE CONTRATACIÓN Y COMPRA</h4>', '<h4>1. ORDERING PROCESS AND SERVICE AGREEMENT</h4>'],
        ['La contratación de los servicios de NETZ se realiza en forma directa y transparente a través de nuestra plataforma web:', 'Ordering NETZ services is conducted directly, transparently, and securely through our digital platform:'],
        ['- <b>Selección del Plan:</b>', '- <b>Plan Selection:</b>'],
        ['El cliente selecciona el servicio deseado (Hosting Compartido, Hosting Exclusivo, Servidores VPS Linux o Windows, Streaming de Radio/Video, Revendedor o Registro de Dominio) y el ciclo de facturación preferido.', 'The customer chooses the desired plan (Shared Hosting, Dedicated Hosting, Linux/Windows VPS, Streaming, Reseller, or Domain) and preferred billing cycle.'],
        ['- <b>Registro de Cuenta:</b>', '- <b>Account Registration:</b>'],
        ['El cliente completa sus datos de contacto y facturación en el portal de clientes', 'The customer enters verified billing and contact details in the client portal'],
        ['declarando que la información suministrada es veraz y actualizada.', 'confirming that all submitted information is accurate and up to date.'],
        ['- <b>Pago Seguro:</b>', '- <b>Secure Payment:</b>'],
        ['El cliente efectúa el abono a través de los métodos de pago electrónicos habilitados en la plataforma (incluyendo pasarelas autorizadas como dLocal Go, tarjetas de crédito/débito internacionales y locales, transferencias y billeteras digitales).', 'Payment is completed through authorized gateways, international/local credit and debit cards, wire transfers, or digital wallets.'],
        ['- <b>Confirmación de Orden:</b>', '- <b>Order Confirmation:</b>'],
        ['Una vez procesado el pago, el sistema genera de forma automática la factura electrónica y envía los datos de acceso y bienvenida al correo electrónico del titular.', 'Once payment clears, electronic invoices and provisioning credentials are automatically emailed to the account holder.'],

        ['<h4>2. TIEMPOS Y POLÍTICA DE ACTIVACIÓN DE SERVICIOS</h4>', '<h4>2. SERVICE PROVISIONING AND ACTIVATION POLICY</h4>'],
        ['NETZ implementa procesos de provisión según la naturaleza del servicio contratado:', 'NETZ utilizes automated deployment routines tailored to the nature of each service:'],
        ['- <b>Servicios Estándar (Activación Instantánea):</b>', '- <b>Standard Services (Instant Provisioning):</b>'],
        ['- <b>Services Estándar (Activación Instantánea):</b>', '- <b>Standard Services (Instant Provisioning):</b>'],
        ['Los planes estándar de Web Hosting (Ilimitado y Exclusivo), Servidores VPS preconfigurados y cuentas de Radio / Video Streaming cuentan con aprovisionamiento y activación inmediata una vez confirmado el pago.', 'Standard Web Hosting, preconfigured VPS servers, and Radio/Video streaming accounts are provisioned immediately upon verified payment.'],
        ['- <b>Servicios Personalizados o a Medida:</b>', '- <b>Custom & Tailored Services:</b>'],
        ['- <b>Services Personalizados o a Medida:</b>', '- <b>Custom & Tailored Services:</b>'],
        ['Aquellos requerimientos especiales, configuraciones a medida de servidores dedicados, arquitecturas complejas de red o migraciones avanzadas de datos se coordinan directamente con el equipo de ingeniería y se entregan en un plazo de <b>24 a 48 horas hábiles</b> tras la validación y acuerdo técnico con el cliente.', 'Custom server architecture, high-availability clusters, and advanced data migrations are coordinated with engineering and delivered within <b>24 to 48 business hours</b>.'],

        ['<h4 id="reembolsos">3. GARANTÍA DE SATISFACCIÓN, POLÍTICA DE DEVOLUCIONES Y REEMBOLSOS</h4>', '<h4 id="reembolsos">3. SATISFACTION GUARANTEE AND REFUND POLICY</h4>'],
        ['En NETZ respaldamos la calidad de nuestra infraestructura y el compromiso con nuestros clientes:', 'At NETZ, we stand firmly behind our global infrastructure and customer satisfaction:'],
        ['- <b>Garantía de 30 Días para Web Hosting:</b>', '- <b>30-Day Money-Back Guarantee for Web Hosting:</b>'],
        ['Ofrecemos una garantía de satisfacción de <b>30 días corridos</b> para todos los planes de Web Hosting compartido (Hosting Ilimitado y Hosting Exclusivo). Si el cliente no queda satisfecho con el rendimiento del servicio dentro de este período, podrá solicitar el reembolso total del importe abonado por dicho concepto.', 'We provide an unconditional <b>30-day money-back guarantee</b> for all shared hosting plans. If you are not satisfied with performance, you may request a full refund of hosting fees.'],
        ['- <b>Plazo y Modalidad de Procesamiento:</b>', '- <b>Refund Processing Window:</b>'],
        ['Las solicitudes de reembolso aprobadas se procesan en un plazo de <b>3 a 5 días hábiles</b> a través del mismo método de pago utilizado originalmente por el cliente.', 'Approved refunds are processed within <b>3 to 5 business days</b> through the original payment method.'],
        ['- <b>Excepciones y Servicios No Reembolsables:</b>', '- <b>Exceptions & Non-Refundable Services:</b>'],
        ['- <b>Excepciones y Services No Reembolsables:</b>', '- <b>Exceptions & Non-Refundable Services:</b>'],
        ['No aplican para reembolso los importes correspondientes a registros, renovaciones o transferencias de nombres de dominio (debido a que su gestión y arancel ante registradores internacionales ICANN y NIC-PY es irrevocable e intransferible una vez emitido), ni las licencias de software de terceros emitidas expresamente a nombre del cliente (cPanel, CloudLinux, LiteSpeed, Softaculous, etc.).', 'Domain registration, renewal, and transfer fees are non-refundable once registered with ICANN/registries. Third-party licenses (cPanel, LiteSpeed, CloudLinux) are also strictly non-refundable.'],

        ['<h4>4. CANCELACIÓN VOLUNTARIA DE SERVICIOS</h4>', '<h4>4. VOLUNTARY SERVICE CANCELLATION</h4>'],
        ['El cliente tiene total libertad para solicitar la cancelación voluntaria de cualquiera de sus servicios en cualquier momento, gestionándola de forma autónoma desde su área de clientes (<a href="https://client.netz.com.py" target="_blank">client.netz.com.py</a>) o mediante ticket de soporte. No existen contratos de permanencia forzosa ni penalizaciones por baja anticipada.', 'Clients may cancel any service at any time directly through the Client Area (<a href="https://client.netz.com.py" target="_blank">client.netz.com.py</a>) or by submitting a support ticket. There are no lock-in contracts or early termination fees.'],

        ['<h4>5. POLÍTICA DE USO ACEPTABLE Y CONTENIDOS</h4>', '<h4>5. ACCEPTABLE USE POLICY (AUP) AND CONTENT STANDARDS</h4>'],
        ['Todos los servicios provistos por <b>NETZ</b> deben utilizarse exclusivamente para fines lícitos en concordancia con las leyes de la República del Paraguay y tratados internacionales.', 'All services provided by <b>NETZ</b> must be used exclusively for lawful purposes in accordance with international treaties and applicable telecommunications regulations.'],
        ['Queda terminantemente prohibido alojar o transmitir:', 'The following activities and contents are strictly prohibited:'],
        ['Contenido que infrinja la <b>Ley N° 1328/1998 de Derecho de Autor</b> (piratería, software ilegal, copias no autorizadas).', 'Unauthorized distribution of copyrighted materials, intellectual property infringement, or pirated software.'],
        ['Material de pornografía o explotación sexual infantil, tipificado y sancionado severamente por la <b>Ley N° 5653/2016 y el Código Penal Paraguayo</b> (cancelación inmediata y denuncia penal).', 'Child sexual abuse material (CSAM) or any form of exploitation (results in immediate account termination and reporting to international law enforcement).'],
        ['Actividades tipificadas en la <b>Ley N° 4439/2011 de Delitos Informáticos</b>: phishing, malware, ransomware, botnets, scripts de ataque o denegación de servicio (DDoS).', 'Cybercrime activities: phishing pages, malware distribution, botnets, port scanning, ransomware, and denial-of-service (DDoS) scripts.'],
        ['Envío masivo de correo no solicitado (SPAM) o listas de distribución no verificadas.', 'Unsolicited bulk email (SPAM), unverified email scraping lists, or email sender abuse.'],

        ['<h4>6. NIVELES DE SERVICIO Y SOPORTE TÉCNICO</h4>', '<h4>6. SERVICE LEVEL AGREEMENT & TECHNICAL SUPPORT</h4>'],
        ['<h4>6. NIVELES DE SERVICIO Y SUPPORT TÉCNICO</h4>', '<h4>6. SERVICE LEVEL AGREEMENT & TECHNICAL SUPPORT</h4>'],
        ['NETZ garantiza asistencia técnica continua 24/7 en incidencias vinculadas con la infraestructura del servidor (conectividad de red, hardware, operatividad de servicios web, bases de datos y correo).', 'NETZ guarantees continuous 24/7 technical assistance for server infrastructure, network routing, hardware health, and core hosting stack availability.'],
        ['Para servidores VPS no administrados, la configuración del sistema operativo y aplicaciones internas corre por cuenta del cliente.', 'For unmanaged VPS servers, the internal configuration of the operating system and third-party software is the sole responsibility of the customer.'],

        ['<h4>7. COPIAS DE SEGURIDAD (BACKUPS)</h4>', '<h4>7. BACKUPS AND DATA RESPONSIBILITY</h4>'],
        ['NETZ efectúa respaldos periódicos para fines de contingencia del centro de datos. No obstante, se recomienda a cada usuario mantener copias de seguridad locales actualizadas de sus sitios web y bases de datos.', 'NETZ performs periodic system backups for datacenter disaster recovery. However, users are strongly advised to maintain offsite backups of their web files and databases.'],

        ['<h4>8. JURISDICCIÓN Y LEY APLICABLE</h4>', '<h4>8. GOVERNING LAW AND DISPUTE RESOLUTION</h4>'],
        ['El presente contrato se rige íntegramente por las leyes de la <b>República del Paraguay</b>. Para cualquier controversia legal, las partes se someten a los <b>Juzgados y Tribunales de la República del Paraguay</b>.', 'This agreement is governed by the laws applicable to international electronic commerce and digital hosting services, submitting any dispute to competent judicial jurisdictions.'],
        ['Al utilizar nuestros servicios aceptas el <a href="/us/aviso-legal">Aviso Legal</a> - <a href="/us/politica-de-privacidad">Política de Privacidad</a> - <a href="/us/terminos-del-servicio">Términos del Servicio</a>', 'By using our services you accept the <a href="/us/aviso-legal">Legal Notice</a> - <a href="/us/politica-de-privacidad">Privacy Policy</a> - <a href="/us/terminos-del-servicio">Terms of Service</a>'],
        ['Al utilizar nuestros servicios aceptas el <a href="aviso-legal">Aviso Legal</a> - <a href="politica-de-privacidad">Política de Privacidad</a> - <a href="terminos-del-servicio">Términos del Servicio</a>', 'By using our services you accept the <a href="aviso-legal">Legal Notice</a> - <a href="politica-de-privacidad">Privacy Policy</a> - <a href="terminos-del-servicio">Terms of Service</a>'],
        ['Al utilizar nuestros servicios aceptas el <a href="/us/aviso-legal">Legal Notice</a> - <a href="/us/politica-de-privacidad">Política de Privacidad</a> - <a href="/us/terminos-del-servicio">Términos del Servicio</a>', 'By using our services you accept the <a href="/us/aviso-legal">Legal Notice</a> - <a href="/us/politica-de-privacidad">Privacy Policy</a> - <a href="/us/terminos-del-servicio">Terms of Service</a>']
    ],

    'politica-de-privacidad.html': [
        ['<title>Política de Privacidad y Protección de Datos | NETZ</title>', '<title>Privacy Policy & Data Protection | NETZ</title>'],
        ['<title>Política de Privacidad | NETZ</title>', '<title>Privacy Policy | NETZ</title>'],
        ['content="Conoce nuestras estrictas políticas de protección de datos, confidencialidad, uso de cookies y seguridad de la información en NETZ."', 'content="Learn about our data protection standards, client confidentiality, cookie policy, and information security at NETZ."'],
        ['content="politica de privacidad netz, proteccion de datos, confidencialidad hosting, privacidad gdpr"', 'content="netz privacy policy, data protection, hosting privacy, gdpr compliance"'],

        ['<h4>1. RESPONSABLE DEL TRATAMIENTO</h4>', '<h4>1. DATA CONTROLLER AND IDENTITY</h4>'],
        ['<h4>1. CONTROLADOR Y RESPONSABLE DEL TRATAMIENTO</h4>', '<h4>1. DATA CONTROLLER AND IDENTITY</h4>'],
        ['El responsable del tratamiento de los datos personales recopilados a través de este portal, panel de control y formularios de contratación es <b>NETZ</b>.', 'The data controller responsible for the processing of personal data collected through this website, client portal, and order forms is <b>NETZ</b>.'],
        ['Para consultas, aclaraciones o ejercicio de derechos sobre sus datos, puede comunicarse directamente al correo electrónico:', 'For inquiries, updates, or to exercise your data privacy rights, you may contact our privacy desk directly at:'],

        ['<h4>2. DATOS QUE RECOPILAMOS Y FINALIDAD</h4>', '<h4>2. DATA COLLECTED AND PURPOSE OF PROCESSING</h4>'],
        ['<h4>2. DATOS RECOGIDOS Y FINALIDAD DEL TRATAMIENTO</h4>', '<h4>2. DATA COLLECTED AND PURPOSE OF PROCESSING</h4>'],
        ['NETZ recopila los datos estrictamente necesarios para la formalización, facturación y prestación de los servicios contratados:', 'NETZ collects only the data strictly necessary to provision, invoice, and deliver contracted digital services:'],
        ['- <b>Datos identificatorios y de contacto:</b>', '- <b>Identification & Contact Details:</b>'],
        ['Nombre y apellido o Razón Social, RUC / Documento de Identidad, dirección física, número de teléfono y correo electrónico.', 'Full name, organization name, tax ID, physical address, country, telephone number, and email address.'],
        ['- <b>Finalidad:</b>', '- <b>Purpose:</b>'],
        ['Gestión de cuentas de usuario, emisión de facturas legales, provisión técnica del servicio de Hosting, Servidores VPS, Dominios o Streaming, y notificaciones operativas esenciales.', 'Account administration, official billing, technical deployment of Web Hosting, VPS Servers, Domains, or Streaming, and vital operational alerts.'],
        ['- <b>Soporte técnico y atención al cliente:</b>', '- <b>Technical Support & Inquiries:</b>'],
        ['Registro de tickets y consultas técnicas para la resolución de incidencias.', 'Support ticket tracking and technical resolution management.'],
        ['- <b>Comunicaciones informativas:</b>', '- <b>Service Announcements:</b>'],
        ['Envío de avisos sobre renovaciones, mantenimientos o promociones (con opción expresa de baja en cualquier momento).', 'Service renewal notices, scheduled maintenance alerts, or optional product updates (with instant opt-out links).'],

        ['<h4>3. VERACIDAD Y EXACTITUD DE LOS DATOS</h4>', '<h4>3. ACCURACY AND TRUTHFULNESS OF DATA</h4>'],
        ['El usuario garantiza que los datos personales facilitados son veraces, exactos y completos, comprometiéndose a mantenerlos actualizados a través de su panel de cliente. El usuario será el único responsable de cualquier daño o perjuicio derivado de la provisión de información falsa o inexacta.', 'Users guarantee that submitted personal information is true, accurate, and complete, undertaking to keep details updated in the Client Area. Users remain solely responsible for any damages resulting from inaccurate data.'],

        ['<h4>4. DERECHOS DEL TITULAR (DERECHOS ARCO)</h4>', '<h4>4. USER DATA RIGHTS</h4>'],
        ['<h4>4. DERECHOS DEL TITULAR DE LOS DATOS</h4>', '<h4>4. USER DATA RIGHTS</h4>'],
        ['De conformidad con las leyes vigentes en Paraguay, el usuario tiene derecho a solicitar en cualquier momento:', 'In accordance with international data privacy principles (including GDPR benchmarks), users may at any time request:'],
        ['- <b>Acceso:</b>', '- <b>Access:</b>'],
        ['Conocer qué datos personales suyos están siendo tratados por NETZ.', 'Know what personal data is being held and processed by NETZ.'],
        ['- <b>Rectificación:</b>', '- <b>Rectification:</b>'],
        ['Solicitar la corrección de datos inexactos, desactualizados o incompletos.', 'Request modification or updating of any inaccurate or outdated information.'],
        ['- <b>Cancelación / Supresión:</b>', '- <b>Erasure & Deletion:</b>'],
        ['Solicitar la eliminación de sus datos cuando ya no sean necesarios para los fines contractuales o legales.', 'Request deletion of personal data when no longer needed for service delivery and not barred by statutory accounting requirements.'],
        ['- <b>Oposición:</b>', '- <b>Objection:</b>'],
        ['Oponerse al tratamiento de sus datos con fines publicitarios o promocionales.', 'Object to personal data processing for promotional or marketing purposes.'],
        ['Para ejercer estos derechos, el usuario puede enviar una solicitud por escrito a', 'To exercise these rights, users may submit a written notice to'],
        ['o mediante ticket desde el área de clientes.', 'or submit a support ticket via the Client Area.'],

        ['<h4>5. SEGURIDAD DE LA INFORMACIÓN Y CERTIFICADOS SSL</h4>', '<h4>5. INFORMATION SECURITY AND ENCRYPTION</h4>'],
        ['NETZ adopta rigurosas medidas de seguridad técnicas y organizativas para evitar la pérdida, mal uso, alteración o acceso no autorizado a los datos personales. Todas las transmisiones de datos entre su navegador y nuestros servidores viajan cifradas mediante protocolo seguro <b>HTTPS con certificados SSL/TLS</b> de alta seguridad.', 'NETZ employs robust technical and organizational security controls to prevent unauthorized access, loss, or alteration. All communication between client browsers and our platform is encrypted via 256-bit <b>HTTPS with modern SSL/TLS</b>.'],

        ['<h4>6. TRANSFERENCIA INTERNACIONAL Y ALMACENAMIENTO</h4>', '<h4>6. INTERNATIONAL DATA TRANSFER AND HOSTING</h4>'],
        ['<h4>6. TRANSFERENCIA INTERNACIONAL Y ALOJAMIENTO</h4>', '<h4>6. INTERNATIONAL DATA TRANSFER AND HOSTING</h4>'],
        ['Para garantizar alta disponibilidad y redundancia técnica, los datos y servicios pueden estar alojados en centros de datos seguros ubicados en la República del Paraguay y en los Estados Unidos de América, aplicando en todos los casos estrictos estándares de seguridad y confidencialidad.', 'To ensure high availability and hardware redundancy, services and data are hosted in Tier III/IV datacenters operating under strict physical and cybersecurity protocols.'],

        ['<h4>7. CONSERVACIÓN DE LOS DATOS</h4>', '<h4>7. DATA RETENTION</h4>'],
        ['<h4>7. RETENCIÓN Y CONSERVACIÓN DE DATOS</h4>', '<h4>7. DATA RETENTION</h4>'],
        ['Los datos personales se conservarán mientras se mantenga activa la relación contractual y, tras su finalización, durante los plazos legalmente exigibles por la normativa fiscal, tributaria y civil de la República del Paraguay.', 'Personal data is retained for the duration of the active contractual relationship and thereafter as required by commercial, accounting, and tax retention laws.'],

        ['<h4>8. POLÍTICA DE COOKIES</h4>', '<h4>8. COOKIE POLICY</h4>'],
        ['Nuestro sitio web utiliza cookies técnicas indispensables para permitir la navegación, mantener activa la sesión en el Área de Clientes y garantizar la seguridad transaccional. El usuario puede configurar su navegador para bloquearlas o eliminarlas en cualquier momento.', 'Our platform uses essential technical cookies required for navigation, secure session management in the Client Area, and transaction safety. You can configure your browser to manage cookies at any time.']
    ],

    'aviso-legal.html': [
        ['<title>Aviso Legal e Información Corporativa | NETZ</title>', '<title>Legal Notice & Corporate Information | NETZ</title>'],
        ['<title>Aviso Legal | NETZ</title>', '<title>Legal Notice & Regulatory Information | NETZ</title>'],
        ['content="Información legal, condiciones de uso y datos corporativos de la plataforma de servicios en la nube NETZ."', 'content="Legal notice, terms of use, and corporate information for the NETZ cloud and web hosting platform."'],
        ['content="Información legal, titularidad, términos de uso y datos corporativos de la plataforma de servicios en la nube NETZ."', 'content="Legal notice, terms of use, and corporate information for the NETZ cloud and web hosting platform."'],
        ['content="aviso legal netz, informacion corporativa, titularidad web hosting, terminos legales netz"', 'content="netz legal notice, corporate information, hosting ownership, terms of use"'],

        ['<h4>1. INFORMACIÓN GENERAL DEL TITULAR</h4>', '<h4>1. GENERAL CORPORATE INFORMATION</h4>'],
        ['El presente portal web y todos los servicios de tecnología, hosting, streaming, dominios y servidores vinculados son titularidad y operados comercialmente bajo la marca <b>NETZ</b>.', 'This website and all associated cloud hosting, streaming, domain registration, and server solutions are owned and commercially operated under the <b>NETZ</b> brand.'],
        ['En cumplimiento de los estándares de transparencia y comercio electrónico, se informan los datos identificatorios del titular y administrador responsable:', 'In compliance with international transparency and electronic commerce standards, corporate details are set out below:'],
        ['- <b>Responsable legal:</b>', '- <b>Legal Representative:</b>'],
        ['- <b>Identificación fiscal / Registro:</b>', '- <b>Tax Registration ID:</b>'],
        ['- <b>País de Origen:</b>', '- <b>Headquarters & Jurisdiction:</b>'],
        ['República del Paraguay (Operaciones e Infraestructura Global)', 'Republic of Paraguay (Global Infrastructure & Datacenters)'],
        ['- <b>Sitio web oficial:</b>', '- <b>Official Website:</b>'],
        ['- <b>Sitio oficial:</b>', '- <b>Official Website:</b>'],
        ['- <b>Teléfono / WhatsApp:</b>', '- <b>Telephone / WhatsApp:</b>'],
        ['- <b>Correo electrónico general:</b>', '- <b>General Corporate Email:</b>'],
        ['- <b>E-mail institucional general:</b>', '- <b>General Corporate Email:</b>'],
        ['- <b>Correo de soporte técnico:</b>', '- <b>Technical Support Email:</b>'],
        ['- <b>E-mail de soporte técnico:</b>', '- <b>Technical Support Email:</b>'],
        ['- <b>Área de Clientes y Tickets:</b>', '- <b>Client Area & Support Desk:</b>'],

        ['<h4>2. OBJETO Y ÁMBITO DE APLICACIÓN</h4>', '<h4>2. SCOPE AND ACCEPTANCE</h4>'],
        ['El presente Aviso Legal regula el acceso, navegación y uso del sitio web, así como las responsabilidades derivadas de la utilización de sus contenidos y servicios. El acceso o la utilización del sitio web por parte del usuario implican la adhesión y aceptación plena y sin reservas de todas las condiciones aquí publicadas.', 'This Legal Notice governs access, navigation, and usage of this website and related digital services. Using this website implies full, unreserved acceptance of all published terms.'],

        ['<h4>3. PROPIEDAD INTELECTUAL E INDUSTRIAL</h4>', '<h4>3. INTELLECTUAL PROPERTY RIGHTS</h4>'],
        ['Todos los contenidos del portal web, incluyendo pero no limitándose a textos, códigos de programación, diseños, interfaces, marcas, logotipos, gráficos, ilustraciones e imágenes, son propiedad exclusiva de <b>NETZ</b> o de terceros que han autorizado su uso, estando protegidos por la <b>Ley N° 1328/1998 de Derecho de Autor y Derechos Conexos</b> y la <b>Ley N° 1294/1998 de Marcas</b> de la República del Paraguay.', 'All contents of this portal (including text, UI layouts, source code, graphics, branding, and images) are the exclusive property of <b>NETZ</b> or authorized third-party licensors, protected under applicable intellectual property laws.'],
        ['Queda terminantemente prohibida la reproducción total o parcial, distribución, comunicación pública, transformación o explotación de los contenidos sin la previa autorización expresa y por escrito de NETZ.', 'Total or partial reproduction, public distribution, or commercial exploitation without prior written consent from NETZ is strictly prohibited.'],

        ['<h4>4. CONDICIONES DE USO DEL PORTAL</h4>', '<h4>4. CONDITIONS OF PLATFORM USE</h4>'],
        ['<h4>4. CONDICIONES DE USO DEL SITIO</h4>', '<h4>4. CONDITIONS OF PLATFORM USE</h4>'],
        ['El usuario se compromete a hacer un uso diligente, correcto y lícito del sitio web y de los servicios contratados, obligándose expresamente a:', 'Users agree to utilize this platform and contracted services in a diligent, lawful manner, committing specifically to:'],
        ['- No emplear los servicios para fines ilícitos o lesivos de los derechos e intereses de terceros o contrarios al ordenamiento jurídico paraguayo e internacional.', '- Refrain from unlawful activities that infringe third-party rights or breach international cyber-security regulations.'],
        ['- No provocar daños en los sistemas físicos y lógicos de NETZ, de sus proveedores o de terceras personas (introducción de virus, malware, scripts maliciosos o ataques de denegación de servicio).', '- Never damage, overload, or compromise physical and virtual infrastructure (including malware distribution or denial-of-service attacks).'],
        ['- Mantener bajo estricta confidencialidad sus credenciales de acceso (usuario y contraseña) a su panel de control y área de cliente.', '- Safeguard authentication credentials (passwords, API tokens) and maintain sole responsibility for account actions.'],

        ['<h4>5. EXENCIÓN DE RESPONSABILIDAD</h4>', '<h4>5. LIMITATION OF LIABILITY</h4>'],
        ['<h4>5. EXCLUSIÓN DE RESPONSABILIDAD</h4>', '<h4>5. LIMITATION OF LIABILITY</h4>'],
        ['La <b>NETZ</b> actúa como proveedora de servicios de intermediación técnica y alojamiento en internet. En los términos de la legislación aplicable:', '<b>NETZ</b> acts as an infrastructure service provider and hosting intermediary. Under applicable law:'],
        ['<b>NETZ</b> actúa como proveedor de servicios de la sociedad de la información e intermediario técnico de alojamiento. En virtud de la legislación aplicable:', '<b>NETZ</b> acts as an infrastructure service provider and hosting intermediary. Under applicable law:'],
        ['- NETZ no se responsabiliza por la información, contenidos o datos almacenados o transmitidos por los clientes a través de sus servicios de Hosting, Servidores VPS o Streaming.', '- NETZ is not liable for user-generated content, web applications, or data stored/transmitted through hosting or VPS servers.'],
        ['- NETZ no garantiza la inexistencia de interrupciones o errores derivados de causas de fuerza mayor, mantenimientos programados o fallas en las redes de telecomunicaciones ajenas a su control directo.', '- NETZ does not guarantee uninterrupted service in events of force majeure, scheduled maintenance, or external carrier failures.'],

        ['<h4>6. ENLACES A TERCEROS</h4>', '<h4>6. THIRD-PARTY LINKS</h4>'],
        ['En el caso de que en el portal existieran enlaces o hipervínculos hacia otros sitios de Internet, NETZ no ejercerá ningún tipo de control sobre dichos sitios y contenidos, no asumiendo responsabilidad alguna por los daños que pudieran derivarse de su acceso o uso.', 'Any external links provided on this portal are for convenience; NETZ exercises no control over third-party platforms and assumes no liability for their contents.'],

        ['<h4>7. COMUNICACIONES ELECTRÓNICAS</h4>', '<h4>7. ELECTRONIC NOTICES</h4>'],
        ['Conforme a la Ley N° 4868/2013, las comunicaciones realizadas por NETZ a la dirección de correo electrónico provista por el cliente en su registro se considerarán válidas y vinculantes para todos los efectos contractuales y operativos.', 'All communications sent to the client\'s registered email address are considered valid and legally effective for all contractual purposes.'],

        ['<h4>8. LEGISLACIÓN APLICABLE Y JURISDICCIÓN</h4>', '<h4>8. APPLICABLE LAW</h4>'],
        ['<h4>8. LEY APLICABLE Y JURISDICCIÓN</h4>', '<h4>8. APPLICABLE LAW</h4>'],
        ['Para la resolución de cualquier conflicto o discrepancia relacionada con el presente sitio web o con los servicios prestados por NETZ, se aplicará la legislación vigente en la materia, sometiéndose las partes a los juzgados y tribunales competentes.', 'Any dispute regarding this website or services provided by NETZ shall be governed by applicable commercial laws and submitted to competent judicial courts.']
    ]
};

module.exports = { pageDictionaries };
