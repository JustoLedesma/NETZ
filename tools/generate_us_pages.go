package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"
)

// Definición de reemplazos comunes para toda la web en en-US
var globalReplacementsEN = [][2]string{
	// Meta y cabecera general
	{"lang=\"es\"", "lang=\"en-US\""},
	{"data-country=\"py\"", "data-country=\"us\""},
	{"content=\"es_LA\"", "content=\"en_US\""},
	{"content=\"es_ES\"", "content=\"en_US\""},

	// Títulos exactos de todas las páginas
	{"<title>Página no encontrada (404) | NETZ</title>", "<title>Page Not Found (404) | NETZ</title>"},
	{"<title>Sobre Nosotros | Infraestructura y Equipo NETZ</title>", "<title>About Us | Infrastructure and Engineering Team | NETZ</title>"},
	{"<title>Sobre Nosotros | NETZ</title>", "<title>About Us | High-Performance Hosting & Domains | NETZ</title>"},
	{"<title>Radio Streaming SSL con AutoDJ SonicPanel | NETZ</title>", "<title>Radio Streaming SSL with AutoDJ SonicPanel | NETZ</title>"},
	{"<title>Radio Streaming Profesional | NETZ</title>", "<title>Professional Radio Streaming | NETZ</title>"},
	{"<title>Aviso Legal e Información Corporativa | NETZ</title>", "<title>Legal Notice & Corporate Information | NETZ</title>"},
	{"<title>Aviso Legal | NETZ</title>", "<title>Legal Notice & Regulatory Information | NETZ</title>"},
	{"<title>Comprobador y Registro de Dominios Web | NETZ</title>", "<title>Domain Checker & Web Domain Registration | NETZ</title>"},
	{"<title>Centro de Ayuda y Base de Conocimientos | NETZ</title>", "<title>Help Center & Knowledgebase | NETZ</title>"},
	{"<title>Centro de Ayuda y Preguntas Frecuentes | NETZ</title>", "<title>Help Center & Frequently Asked Questions | NETZ</title>"},
	{"<title>Contacto y Soporte Técnico 24/7 | NETZ</title>", "<title>Contact Us & 24/7 Technical Support | NETZ</title>"},
	{"<title>Contacto y Soporte | NETZ</title>", "<title>Contact & Customer Support | NETZ</title>"},
	{"<title>Hosting Exclusivo y Empresarial Dedicado | NETZ</title>", "<title>Dedicated Business & Enterprise Hosting | NETZ</title>"},
	{"<title>Hosting Exclusivo de Alto Rendimiento | NETZ</title>", "<title>High-Performance Dedicated Hosting | NETZ</title>"},
	{"<title>Hosting Ilimitado SSD NVMe con cPanel | NETZ</title>", "<title>Unlimited Hosting SSD NVMe with cPanel | NETZ</title>"},
	{"<title>Hosting Ilimitado con cPanel | NETZ</title>", "<title>Unlimited Web Hosting with cPanel | NETZ</title>"},
	{"<title>NETZ | Web Hosting Ilimitado, Servidores VPS, Streaming y Dominios</title>", "<title>NETZ | Unlimited Web Hosting, VPS Servers, Streaming & Domains</title>"},
	{"<title>Mejor Servicio de Web Hosting, Dominios y Servidores VPS | NETZ</title>", "<title>Leading Web Hosting, Domain Registration & VPS Servers | NETZ</title>"},
	{"<title>Política de Privacidad y Protección de Datos | NETZ</title>", "<title>Privacy Policy & Data Protection | NETZ</title>"},
	{"<title>Política de Privacidad | NETZ</title>", "<title>Privacy Policy | NETZ</title>"},
	{"<title>Hosting Reseller cPanel & WHM Multicuenta | NETZ</title>", "<title>cPanel & WHM Reseller Hosting Multi-Account | NETZ</title>"},
	{"<title>Revendedor de Hosting cPanel & WHM | NETZ</title>", "<title>cPanel & WHM Reseller Hosting | NETZ</title>"},
	{"<title>Hosting Reseller DirectAdmin Económico | NETZ</title>", "<title>Cost-Effective DirectAdmin Reseller Hosting | NETZ</title>"},
	{"<title>Revendedor de Hosting DirectAdmin | NETZ</title>", "<title>DirectAdmin Reseller Hosting | NETZ</title>"},
	{"<title>Términos del Servicio y Política de Reembolso | NETZ</title>", "<title>Terms of Service & Refund Policy | NETZ</title>"},
	{"<title>Términos del Servicio | NETZ</title>", "<title>Terms of Service | NETZ</title>"},
	{"<title>Video Streaming en Vivo HD con SSL | NETZ</title>", "<title>Live HD Video Streaming with SSL | NETZ</title>"},
	{"<title>Video Streaming en Vivo | NETZ</title>", "<title>Live Video Streaming | NETZ</title>"},
	{"<title>Servidores VPS Linux Administrado 24/7 | NETZ</title>", "<title>Managed Linux VPS Servers 24/7 | NETZ</title>"},
	{"<title>Servidores VPS Linux No Administrado Root | NETZ</title>", "<title>Unmanaged Linux VPS Servers Root | NETZ</title>"},
	{"<title>Servidores VPS Linux | NETZ</title>", "<title>High-Performance Linux VPS Servers | NETZ</title>"},
	{"<title>Servidores VPS Windows Administrado | NETZ</title>", "<title>Managed Windows VPS Servers | NETZ</title>"},
	{"<title>Servidores VPS Windows No Administrado RDP | NETZ</title>", "<title>Unmanaged Windows VPS Servers RDP | NETZ</title>"},
	{"<title>Servidores VPS Windows | NETZ</title>", "<title>Windows VPS Servers with Official License | NETZ</title>"},

	// OpenGraph y Meta Descriptions globales
	{"content=\"Plataforma líder en Web Hosting Ilimitado de alto rendimiento, Servidores VPS Linux y Windows, Streaming de Radio y Video, y Registro de Dominios. Soporte 24/7 y activación inmediata a nivel mundial.\"", "content=\"Leading platform for high-performance Unlimited Web Hosting, Linux & Windows VPS Servers, Radio & Video Streaming, and Domain Registration. 24/7 support and instant activation worldwide.\""},
	{"content=\"Ofrecemos los mejores planes de hosting web, registro de dominios, radio streaming, VPS y servidores dedicados con alta velocidad, seguridad y soporte 24/7.\"", "content=\"We offer high-performance web hosting plans, domain registration, radio streaming, VPS, and dedicated servers with high speed, top security, and 24/7 support.\""},
	{"content=\"web hosting ilimitado, comprar hosting, servidores vps administrados, vps linux, vps windows, comprar dominios baratos, streaming radio sonicpanel, video streaming ssl, hosting revendedor, hosting cpanel, netz\"", "content=\"unlimited web hosting, buy hosting, managed vps servers, linux vps, windows vps, cheap domains, radio streaming sonicpanel, video streaming ssl, reseller hosting, cpanel hosting, netz\""},
	{"content=\"hosting paraguay, web hosting, dominios py, servidores vps, hosting cpanel, streaming radio\"", "content=\"web hosting, vps servers, cheap domains, cpanel hosting, radio streaming, dedicated servers, netz\""},

	// Barra de navegación fija
	{"<a class=\"nav-link\" href=\"index\">Inicio", "<a class=\"nav-link\" href=\"index\">Home"},
	{"<a class=\"nav-link\" href=\"/us/\">Inicio", "<a class=\"nav-link\" href=\"/us/\">Home"},
	{">Hosting<", ">Hosting<"},
	{">Hosting Ilimitado<", ">Unlimited Hosting<"},
	{"<span class=\"nav-new-tag\">Servicio sin límites de recursos</span>", "<span class=\"nav-new-tag\">Unmetered Resources</span>"},
	{">Hosting Exclusivo<", ">Dedicated Hosting<"},
	{"<span>Recursos exclusivos</span>", "<span>Exclusive Resources</span>"},
	{">Vps<", ">VPS<"},
	{">Linux no administrado<", ">Unmanaged Linux<"},
	{"<span>¡Administre usted mismo!</span>", "<span>Full Root Access!</span>"},
	{">Linux Administrado<", ">Managed Linux<"},
	{"<span>Todo el poder <br>NINGUNO de los problemas</span>", "<span>All the power <br>NONE of the hassle</span>"},
	{">Windows no Administrado<", ">Unmanaged Windows<"},
	{"<span>¡Control Total por RDP!</span>", "<span>Full RDP Control!</span>"},
	{">Windows Administrado<", ">Managed Windows<"},
	{">Radio Streaming<", ">Radio Streaming<"},
	{"<span>Sonido limpio y fluido <br>Sonido de Calidad</span>", "<span>Crystal Clear Audio <br>HD Quality</span>"},
	{">Video Streaming<", ">Video Streaming<"},
	{"<span>Calidad máxima 720p <br>Streaming SSL</span>", "<span>Max Quality 720p <br>SSL Streaming</span>"},
	{">Reseller<", ">Reseller<"},
	{"<span>2 CPU - 2Gb Ram, por cPanel</span>", "<span>2 CPU - 2GB RAM per account</span>"},
	{"<span>2 CPU - 2Gb Ram, por cuenta</span>", "<span>2 CPU - 2GB RAM per account</span>"},
	{">Dominios<", ">Domains<"},
	{">Comprobador de dominio<", ">Domain Checker<"},
	{"<span class=\"nav-new-tag\">Consulta de disponibilidad</span>", "<span class=\"nav-new-tag\">Check Availability</span>"},
	{">Transferencia de dominio<", ">Domain Transfer<"},
	{"<span>Transfiera su dominio</span>", "<span>Transfer your domain</span>"},
	{">Empresa<", ">Company<"},
	{">Sobre Nosotros<", ">About Us<"},
	{">Términos de Servicio<", ">Terms of Service<"},
	{">Politica de Privacidad<", ">Privacy Policy<"},
	{">Aviso Legal<", ">Legal Notice<"},
	{">Cóntactenos<", ">Contact Us<"},
	{">Iniciar Sesión<", ">Sign In<"},
	{"placeholder=\"Contraseña\"", "placeholder=\"Password\""},
	{"placeholder=\"Usuario\"", "placeholder=\"Email Address\""},
	{"placeholder=\"Email\"", "placeholder=\"Email Address\""},
	{"title=\"login\"", "title=\"Sign In\""},

	// Selector de ciclo de facturación
	{"<span class=\"change-box-text\">Mensual</span>", "<span class=\"change-box-text\">Monthly</span>"},
	{"<span class=\"change-box-text\">Año</span>", "<span class=\"change-box-text\">Yearly</span>"},
	{"<small> /Mensual</small>", "<small> /Month</small>"},
	{"<small> /Año</small>", "<small> /Year</small>"},
	{"<b>Mensual</b>", "<b>Monthly</b>"},
	{"<b>Año</b>", "<b>Yearly</b>"},

	// Botones universales de acción
	{">Contratar<", ">Get Started<"},
	{">Comprar Ahora<", ">Order Now<"},
	{">Comprar<", ">Order Now<"},
	{">Ver Planes<", ">View Plans<"},
	{">Volver al Inicio<", ">Back to Home<"},
	{">Empieza con nosotros ahora<", ">Get started with us today<"},
	{">Empieza con\n                            nosotros ahora<", ">Get started with\n                            us today<"},

	// Características de Hosting y Planes
	{"Plan Básico", "Basic Plan"},
	{"Plan Pro +", "Pro+ Plan"},
	{"Plan Pro", "Pro Plan"},
	{"Principalmente para uso personal", "Ideal for personal projects and blogs"},
	{"Principalmente para uso empresarial", "Perfect for businesses and online stores"},
	{"Principalmente para uso\n                                empresarial", "Perfect for businesses\n                                and online stores"},
	{"Almacenamiento 30 Gb SSD", "30 GB SSD Storage"},
	{"Almacenamiento ilimitado SSD", "Unlimited SSD Storage"},
	{"Almacenamiento ilimitado NVMe", "Unlimited NVMe Storage"},
	{"Trafico ilimitado", "Unlimited Bandwidth"},
	{"Cuentas de Email ilimitadas", "Unlimited Email Accounts"},
	{"Soporte Node.js", "Node.js Support"},
	{"Sistema WebMail", "Professional Webmail"},
	{"Acceso FTP ilimitado", "Unlimited FTP Access"},
	{"Copias de seguridad diarias", "Daily Automated Backups"},
	{"Gestión centralizada", "Centralized Management"},
	{"Protección DDoS de nivel empresarial", "Enterprise-grade DDoS Protection"},
	{"Protección DDoS", "DDoS Protection"},
	{"Soporte técnico 24/7", "24/7 Technical Support"},
	{"Certificado SSL Gratis", "Free SSL Certificate"},
	{"Certificado SSL Gratuito", "Free SSL Certificate"},
	{"Subdominios ilimitados", "Unlimited Subdomains"},
	{"MySQL ilimitado", "Unlimited MySQL Databases"},
	{"MagicSpam Protección", "MagicSpam Anti-Spam Protection"},
	{"Dominio Gratis", "Free Domain"},
	{"Firewall de aplicaciones web", "Web Application Firewall (WAF)"},

	// Tooltips de dominios
	{"title=\"Activación rápida\"", "title=\"Instant Activation\""},
	{"title=\"Compra segura\"", "title=\"Secure Purchase\""},

	// Comentarios / links de reembolso
	{"Ver política de reembolsos", "View refund policy"},

	// WhatsApp links
	{"text=Hola%20vengo%20desde%20la%20web,%20%C2%BFMe%20pueden%20dar%20m%C3%A1s%20informaci%C3%B3n?", "text=Hello,%20I%20am%20visiting%20from%20the%20website,%20could%20you%20give%20me%20more%20information?"},
}

func applyReplacements(content string, pairs [][2]string) string {
	res := content
	for _, p := range pairs {
		res = strings.ReplaceAll(res, p[0], p[1])
	}
	return res
}

func translateIndexEN(c string) string {
	pairs := [][2]string{
		{"ENCUENTRA TU NOMBRE DE DOMINIO\n                            PERFECTO..", "FIND YOUR PERFECT DOMAIN\n                            NAME.."},
		{"<span>ENCUENTRA TU NOMBRE DE DOMINIO PERFECTO..</span>", "<span>FIND YOUR PERFECT DOMAIN NAME..</span>"},
		{"REGISTRO DE DOMINIOS<small>Al precio más accesible del mercado</small>", "DOMAIN REGISTRATION<small>At the most affordable price on the market</small>"},
		{"REGISTRO DE DOMINIOS", "DOMAIN REGISTRATION"},
		{"Al precio más accesible del mercado", "At the most affordable price on the market"},
		{"placeholder=\"Buscador de Dominios\"", "placeholder=\"Search domain name here...\""},
		{"title=\"Buscar\"", "title=\"Search\""},
		{"value=\"Buscar\"", "value=\"Search\""},
		{"title=\"Transferir\"", "title=\"Transfer\""},
		{"value=\"Transferir\"", "value=\"Transfer\""},
		{"Precio Inicial desde USD 1.99/Año", "Starting price from USD 1.99/Year"},

		// Sección Hosting
		{"CHEQUEA NUESTROS PLANES DE HOSTING <br><span class=\"mr-tp-20\">Recursos\n                    exclusivos con mayor velocidad!</span>", "CHECK OUR HOSTING PLANS <br><span class=\"mr-tp-20\">Dedicated resources with lightning speed!</span>"},
		{"CHEQUEA NUESTROS PLANES DE HOSTING", "CHECK OUR HOSTING PLANS"},
		{"Recursos exclusivos con mayor velocidad!", "Dedicated resources with lightning speed!"},
		{"2 Meses Gratis con el pago anual", "2 Months Free with Annual Billing"},
		{"Haga que su empresa este en línea hoy mismo con\n                    unidades SSD rápidas, creador de sitios web gratuito y almacenamiento web de correo ilimitado.\n                    <br>Certificados SSL gratuitos incluidos.", "Get your business online today with fast SSD drives, free website builder, and unlimited email web storage.<br>Free SSL Certificates included."},
		{"Haga que su empresa este en línea hoy mismo con unidades SSD rápidas", "Get your business online today with fast SSD drives"},

		// SSL Boxes
		{"<h5>Cifrado de 256 bits</h5>", "<h5>256-Bit SSL Encryption</h5>"},
		{"Nuestros SSL gratuitos con certificados cifrados de 256 bits totalmente validados.", "Our free SSL certificates feature fully validated 256-bit encryption."},
		{"<h5>Certificados SSL comodín</h5>", "<h5>Wildcard SSL Certificates</h5>"},
		{"Instale un certificado SSL comodín totalmente validado de forma gratuita.", "Install a fully validated Wildcard SSL certificate free of charge."},
		{"<h5>Auto renovación</h5>", "<h5>Automatic Renewal</h5>"},
		{"Se instala una vez, se renueva automáticamente en la vida útil de la cuenta.", "Installed once, auto-renews seamlessly for the lifetime of your account."},

		// Características
		{"<h4>Servidores seguros</h4>", "<h4>Secure Servers</h4>"},
		{"Contamos con cortafuegos de seguridad BitNinja, DDoS Protection y certificados\n                                        SSL gratuitos", "Equipped with BitNinja security firewalls, DDoS Protection, and free SSL certificates."},
		{"Contamos con cortafuegos de seguridad BitNinja, DDoS Protection y certificados SSL gratuitos", "Equipped with BitNinja security firewalls, DDoS Protection, and free SSL certificates."},
		{"<h4>99.9% de tiempo de actividad</h4>", "<h4>99.9% Uptime Guarantee</h4>"},
		{"Garantía de disponibilidad del 99.9% en nuestros servicios.", "99.9% service availability guarantee across our network."},
		{"<h4>Grandes posibilidades</h4>", "<h4>High Scalability</h4>"},
		{"2 núcleos de CPU y 2 GB de RAM estándar, ampliable x2 especial para sitios más\n                                        exigentes.", "2 CPU cores and 2 GB RAM standard, 2x expandable for high-traffic demanding sites."},
		{"<h4>Ultra rápida</h4>", "<h4>Ultra-Fast Performance</h4>"},
		{"Hasta 16 veces más rápida<br>Significa una experiencia más completa y atractiva\n                                        para los visitantes", "Up to 16x faster speed<br>Delivering an engaging, seamless experience for your visitors."},

		{"¿Qué nos hace tan Grandes?", "What Makes Us Stand Out?"},
		{"Nuestras Características", "Our Key Features"},
		{"¡Aquí hay algunas cosas que creemos que nos hacen el ajuste perfecto para usted!<br>¡Respaldamos\n                        nuestro alojamiento y nuestro servicio al cliente!<br>Ofrecemos una garantía de tiempo de\n                        actividad para cada plan de alojamiento que ofrecemos.", "Here is why we are the perfect fit for your projects!<br>We stand behind our hosting platform and customer care!<br>We offer an uptime guarantee on every hosting plan we provide."},

		// Radio Streaming
		{"<b>Radio<br>Streaming</b>", "<b>Radio<br>Streaming</b>"},
		{"ShoutCast es una solución para la transmisión de audio en directo a través de Internet como una\n                        estación tradicional de radio. Los usuarios pueden escuchar esta transmisión desde cualquier\n                        reproductor de medios. También es posible la transmisión de audio las 24 horas gracias al\n                        sistema de autoDJ, con el cual se puede programar el contenido que desees para su\n                        emisión.<br>Nuestra solución para Radio Streaming HD es SonicPanel: ShoutCast V1 y V2, AutoDJ,\n                        PlayList, MP3 y AAC Plus V2, con un generador personalizado de reproductores HD HTML5 que son\n                        compatibles con Android e iOS, streaming seguro bajo protocolo HTTPS (SSL) y con transferencia\n                        ilimitada.", "ShoutCast is an industry-standard solution for live audio broadcasting over the internet like a traditional radio station. Listeners can tune in from any media player or mobile app. 24/7 continuous broadcast is effortless with our cloud AutoDJ system.<br>Our HD Radio Streaming solution is powered by SonicPanel: ShoutCast V1 & V2, AutoDJ, PlayLists, MP3 and AAC+ V2, with custom HTML5 HD players compatible with Android and iOS, secure HTTPS (SSL) streaming, and unlimited bandwidth."},
		{"Stream Mini <span>Plan Inicial</span>", "Stream Mini <span>Starter Plan</span>"},
		{"Stream Junior <span>Plan Especial</span>", "Stream Junior <span>Special Plan</span>"},
		{"Stream Junior II <span>Plan Premium</span>", "Stream Junior II <span>Premium Plan</span>"},
		{"Cantidad de Oyentes en Simultáneo", "Simultaneous Listeners"},
		{"Calidad de audio", "Audio Quality"},
		{"Transmisión con <b>Certificado SSL</b>", "Broadcast with <b>SSL Certificate</b>"},
		{"AutoDj <b>2 Gb Almacenamiento</b>", "AutoDJ <b>2 GB Storage</b>"},
		{"AutoDj <b>10 Gb Almacenamiento</b>", "AutoDJ <b>10 GB Storage</b>"},
		{"AutoDj <b>100 Gb Almacenamiento</b>", "AutoDJ <b>100 GB Storage</b>"},
		{"Reproductor <b>HTML5</b>", "Player <b>HTML5</b>"},
		{"Soporte <b>Incluye</b>", "Support <b>Included</b>"},

		// Panel de control
		{"<h2>Panel de control fácil de usar</h2>", "<h2>Easy-to-Use Control Panel</h2>"},
		{"<h5 class=\"mt-0\">Fácil uso</h5>", "<h5 class=\"mt-0\">Intuitive & User-Friendly</h5>"},
		{"Nuestro panel esta optimizado para su fácil uso, y puede ser\n                                        utilizado por personas con poca experiencia en desarrollo web.", "Our control panel is streamlined for effortless management, perfect for beginners and pros alike."},
		{"<h5 class=\"mt-0\">Optimizado</h5>", "<h5 class=\"mt-0\">Highly Optimized</h5>"},
		{"Disponemos de una amplia variedad de herramientas para satisfacer\n                                        sus necesidades de usuario y desarrollador.", "Equipped with comprehensive developer tools and modules to meet every technical requirement."},
		{"<h5 class=\"mt-0\">Sencillo e intuitivo</h5>", "<h5 class=\"mt-0\">Fast & Reliable</h5>"},
		{"Ofrecemos más velocidad y optimización en WP con cache LiteSpeed\n                                        para brindar un rendimiento de vanguardia.", "Boost WordPress speed with LiteSpeed caching for blazing-fast page loads."},

		// MailChannels
		{"<h2>Retransmisión de correo electrónico de MailChannels</h2>", "<h2>MailChannels Outbound Email Delivery</h2>"},
		{"Entrega y Protección de correo electrónico de nivel empresarial<br>\n                            Utilizamos mailChannels Cloud para que todo el correo saliente se transmita a través de una\n                            red distribuida de direcciones IP dedicadas a entregar su correo.", "Enterprise-grade email delivery and anti-spam protection.<br>We use MailChannels Cloud to route all outbound email through an intelligent distributed network of trusted IPs, guaranteeing inbox placement."},
		{"<b>Incluido GRATIS</b>", "<b>Included FREE</b>"},
		{"Nuestro servicio de retransmisión de correo se incluye de forma gratuita\n                                            con todos los buzones de correo.", "Our premium email relay service is included free of charge with all mailboxes."},
		{"<b>Bandeja no SPAM!</b>", "<b>Inbox Delivery, No SPAM!</b>"},
		{"MailChannels garantiza que sus correos electrónicos se entreguen\n                                            correctamente.", "MailChannels ensures your critical business emails reach the recipient's primary inbox reliably."},

		// Mapa mundial
		{"<h3>Estamos corriendo en todo el mundo.</h3>", "<h3>Global Network Infrastructure.</h3>"},
		{"Cada servicio que brindamos es una fuente de inteligencia en tiempo\n                    real sobre amenazas nuevas y actuales. Así es como ejecutamos nuestros servidores para hacer esta\n                    red aún más fuerte.", "Every service we provide leverages real-time global threat intelligence. That is how our infrastructure keeps your data fast, resilient, and secure."},
		{"<b>E.E.U.U.</b>", "<b>U.S.A.</b>"},
	}
	return applyReplacements(c, pairs)
}

func translateBuscarDominiosEN(c string) string {
	pairs := [][2]string{
		{"content=\"Encuentra y registra tu nombre de dominio web (.com, .net, .org, .online, .app y más) al mejor precio global con activación instantánea.\"", "content=\"Search and register your domain name (.com, .net, .org, .online, .app, and more) at the best global rates with instant activation.\""},
		{"content=\"registro de dominios, comprar dominio web, transferir dominio, dominios baratos com net org\"", "content=\"domain registration, buy domain, domain transfer, cheap domains com net org us\""},
		{"content=\"Comprobador y Registro de Dominios Web | NETZ\"", "content=\"Domain Checker & Web Domain Registration | NETZ\""},

		// Hero
		{"<span>ENCUENTRA TU NOMBRE DE DOMINIO PERFECTO..</span>REGISTRO DE DOMINIOS", "<span>FIND YOUR PERFECT DOMAIN NAME..</span>DOMAIN REGISTRATION"},
		{"placeholder=\"Buscador de Dominios\"", "placeholder=\"Search domain name here...\""},
		{"title=\"Buscar\"", "title=\"Search\""},
		{"value=\"Buscar\"", "value=\"Search\""},
		{"title=\"Transferir\"", "title=\"Transfer\""},
		{"value=\"Transferir\"", "value=\"Transfer\""},

		// Bloque de 3 columnas
		{"<h5>Activación instantánea</h5>", "<h5>Instant Activation</h5>"},
		{"<p>La activación es realizada en cuestión de minutos</p>", "<p>Your domain is activated within minutes after payment confirmation.</p>"},
		{"<h5>Personalización</h5>", "<h5>Full Customization</h5>"},
		{"<p>Personalice su dominio con la extensión de su preferencia</p>", "<p>Choose the extension that perfectly represents your online brand.</p>"},
		{"<h5>Renovación</h5>", "<h5>Hassle-Free Renewal</h5>"},
		{"<p>Renovación automática de su dominio</p>", "<p>Seamless auto-renewal to keep your brand always protected.</p>"},

		// Tablas de dominios
		{"Dominios de activación manual", "Manual Activation Domains"},
		{"<span>Consultar disponibilidad</span>", "<span>Check Availability</span>"},
		{"<span>Dominio</span>", "<span>Domain</span>"},
		{"<small class=\"ltd-name-small-phone\">Dominio</small>", "<small class=\"ltd-name-small-phone\">Domain</small>"},
		{"<span>Registro en GS.</span>", "<span>Registration (GS)</span>"},
		{"<small class=\"ltd-name-small-phone\">Registro en GS.</small>", "<small class=\"ltd-name-small-phone\">Registration (GS)</small>"},
		{"<span>Registro en USD.</span>", "<span>Registration (USD)</span>"},
		{"<small class=\"ltd-name-small-phone\">Registro en USD.</small>", "<small class=\"ltd-name-small-phone\">Registration (USD)</small>"},
		{"<span>Renovación</span>", "<span>Renewal</span>"},
		{"<small class=\"ltd-name-small-phone\">Renovación</small>", "<small class=\"ltd-name-small-phone\">Renewal</small>"},
		{"<span>Acciones</span>", "<span>Actions</span>"},

		{"title=\"Consulta disponibilidad en NIC.PY\"", "title=\"Check availability at NIC.PY\""},

		{"Dominios de activación automatica", "Instant Automated Activation Domains"},
		{"<span>Activación en cuestion de minutos</span>", "<span>Activated within minutes</span>"},
		{"Cargando dominios...", "Loading domain extensions..."},

		// Mensajes de JavaScript
		{"No se pudieron cargar los dominios en este momento.", "Unable to load domain extensions at this moment."},
		{"No hay dominios de activación automática disponibles en este momento.", "No automatic activation domains available at this time."},
		{"Consultando disponibilidad…", "Checking availability..."},
		{"¡Disponible!", "Available!"},
		{"Registrar", "Register"},
		{"No disponible", "Unavailable"},
		{"El dominio <strong style=\"color: #2b3940;\">", "The domain <strong style=\"color: #2b3940;\">"},
		{"ya se encuentra registrado.", "is already registered."},
		{"No se pudo verificar el dominio, intente nuevamente", "Unable to verify domain, please try again."},
	}
	return applyReplacements(c, pairs)
}

func translateHostingIlimitadoEN(c string) string {
	pairs := [][2]string{
		{"content=\"Alojamiento web con recursos ilimitados, discos SSD, soporte 24/7 y panel de control cPanel para tu sitio o negocio.\"", "content=\"Web hosting with unmetered resources, SSD drives, 24/7 technical support, and cPanel control panel for your website or business.\""},
		{"content=\"Planes de Web Hosting Ilimitado con almacenamiento SSD NVMe ultra rápido, panel cPanel, cuentas de correo corporativas ilimitadas y soporte 24/7.\"", "content=\"Unlimited Web Hosting plans with ultra-fast NVMe SSD storage, cPanel, unlimited business emails, and 24/7 support.\""},
		{"<span>Mantenga el control total de su entorno <br>con", "<span>Maintain full control of your web environment <br>with"},
		{"Recursos exclusivos con mayor velocidad!", "Dedicated resources with lightning speed!"},
		{"2 Meses Gratis con el pago anual", "2 Months Free with Annual Billing"},
		{"Haga que su empresa este en línea hoy mismo con", "Get your business online today with"},
		{"Fácil de usar", "Easy to use"},
		{"Robusto", "Robust"},
		{"Poderoso", "Powerful"},
		{"Alojamiento web ilimitado", "Unlimited Web Hosting"},
		{"Desarrollado por cPanel", "Powered by cPanel"},
		{"¡Disponemos de opciones de aumento de la CPU y la RAM!", "CPU and RAM scaling options available on demand!"},
		{"Impulsa tu", "Boost your"},
		{"Herramientas simples pero poderosas", "Simple yet powerful tools"},
		{"Todo lo que necesitas y mucho más", "Everything you need and much more"},
		{"A un solo lugar a un", "In one place at an"},
		{"FUNCIONES DEL ALOJAMIENTO !", "HOSTING FEATURES & BENEFITS !"},
		{"Preguntas frecuentes", "Frequently Asked Questions"},
		{"En caso de que sus dudas no son aclaradas no dude en visitar nuestra", "If your questions are not answered here, feel free to visit our"},
		{"¿Los planes de Hosting son gestionados?", "Are the hosting plans managed?"},
		{"¿Es necesario comprar un dominio al adquirir un plan?", "Do I need to buy a domain when purchasing a hosting plan?"},
		{"¿Cuanto tiempo tarda en activarse mi cuenta?", "How long does it take for my account to activate?"},
		{"¿Puedo elegir un plan y luego cambiarlo por otro?", "Can I upgrade or change my plan later?"},
		{"¿Qué tipo de base de datos están incluidas?", "What types of databases are included?"},
		{"¿Cuál es la garantía de disponibilidad?", "What is the uptime guarantee?"},
		{"¿Qué contenido puedo alojar?", "What kind of content can I host?"},
		{"¿Ofrecemos conexión SSH?", "Do you provide SSH access?"},
		{"¿Ofrecemos rubygems, Python y node.js?", "Do you support RubyGems, Python, and Node.js?"},
		{"¿Se permite el envió de Spam?", "Is sending SPAM allowed?"},
		{"¿Puedo realizar copias de seguridad?", "Can I make backups of my data?"},
		{"¿Cual es nuestro nivel de seguridad?", "What security measures do you have in place?"},
	}
	return applyReplacements(c, pairs)
}

func translateHostingExclusivoEN(c string) string {
	pairs := [][2]string{
		{"content=\"Servicio de hosting exclusivo con recursos dedicados, discos NVMe y aislamiento total para proyectos de alto tráfico.\"", "content=\"Dedicated hosting service with isolated resources, NVMe drives, and total performance isolation for high-traffic projects.\""},
		{"content=\"Web Hosting con recursos de CPU y memoria RAM 100% exclusivos para proyectos de alto rendimiento. Máxima velocidad y aislamiento total.\"", "content=\"Web Hosting with 100% dedicated CPU and RAM resources for high-performance projects. Maximum speed and complete isolation.\""},
		{"Hosting Exclusivo", "Dedicated Hosting"},
		{"Recursos exclusivos con mayor velocidad!", "Dedicated resources with lightning speed!"},
		{"Rendimiento garantizado con unidades NVMe", "Guaranteed performance with ultra-fast NVMe drives"},
		{"Aislamiento total de recursos", "Complete resource isolation"},
		{"Preguntas frecuentes", "Frequently Asked Questions"},
	}
	return applyReplacements(c, pairs)
}

func translateVpsLinuxEN(c string) string {
	pairs := [][2]string{
		{"content=\"Servidores VPS Linux de alta velocidad con administración completa incluida, discos NVMe, soporte 24/7 y monitoreo proactivo.\"", "content=\"High-speed Linux VPS servers with full management included, NVMe storage, 24/7 support, and proactive monitoring.\""},
		{"content=\"Servidores VPS Linux con acceso root completo, procesadores de última generación y discos NVMe para desarrolladores y empresas.\"", "content=\"Linux VPS servers with full root access, modern generation CPUs, and NVMe drives for developers and enterprises.\""},
		{"content=\"Toda la potencia y escalabilidad de servidores VPS Linux para tus aplicaciones web, bases de datos y proyectos de alta demanda.\"", "content=\"All the power and scalability of Linux VPS servers for your web applications, databases, and demanding projects.\""},
		{"con menos de 60 segundos de respuesta en todo el", "with sub-60 second automated deployment worldwide"},
		{"Nuestro VPS - <strong>Linux NO ADMINISTRADO</strong>", "Our VPS - <strong>Unmanaged Linux</strong>"},
		{"Nuestro VPS - <strong>Linux ADMINISTRADO</strong>", "Our VPS - <strong>Managed Linux</strong>"},
		{"Funciones incluidas en todos los planes", "Features included in all plans"},
		{"Puertos de 1 Gbps", "1 Gbps Network Ports"},
		{"Discos de estado sólido", "NVMe Solid State Drives"},
		{"Tiempo de actividad", "99.9% Uptime Guarantee"},
		{"ISO personalizados", "Custom ISO Uploads"},
		{"Firewall empresarial", "Enterprise-Grade Firewall"},
		{"Mejoramos el rendimiento y la seguridad de su VPS.", "We enhance the performance and security of your VPS."},
		{"Sistema de monitoreo", "24/7 Real-Time Monitoring"},
		{"Escalabilidad instantánea", "Instant On-Demand Scalability"},
		{"Copias de seguridad nocturnas", "Automated Daily Backups"},
		{"¿Cuál es tu sistema favorito de Linux?", "What is your preferred Linux distribution?"},
		{"Elija", "Choose between Ubuntu, Debian, AlmaLinux, or Rocky Linux"},
		{"Preguntas frecuentes", "Frequently Asked Questions"},
		{"¿Qué es un VPS linux administrado?", "What is a managed Linux VPS?"},
		{"¿Me ayudaran a emigrar de mi antiguo proveedor a NETZ?", "Will you help me migrate from my previous hosting provider to NETZ?"},
		{"¿Qué se incluye en la gestión completa del servidor?", "What is included in fully managed server support?"},
		{"¿Tengo el control total de mi VPS Linux?", "Do I have full root control of my Linux VPS?"},
		{"¿Puedo actualizar mi VPS de Linux más adelante?", "Can I upgrade my Linux VPS resources later?"},
		{"¿Puedo cargar mi propia ISO para usar en mi VPS Linux?", "Can I upload my own custom ISO to install on my Linux VPS?"},
		{"¿Ofrecen una solución de copias de seguridad en Linux VPS?", "Do you provide automated backup solutions for Linux VPS?"},
	}
	return applyReplacements(c, pairs)
}

func translateVpsWindowsEN(c string) string {
	pairs := [][2]string{
		{"content=\"Servidores VPS con Windows Server oficial, administración profesional 24/7 y hardware de alta gama para empresas.\"", "content=\"VPS servers with licensed Windows Server, 24/7 managed support, and enterprise-grade hardware for businesses.\""},
		{"content=\"Servidores virtuales VPS Windows Server con almacenamiento SSD ultrarrápido y acceso RDP para aplicaciones empresariales.\"", "content=\"Virtual Windows Server VPS with ultra-fast SSD storage and full RDP access for enterprise applications.\""},
		{"Mantenga el control total con nuestro VPS", "Maintain full control and reliability with our VPS Servers"},
		{"Nuestro VPS - <strong>Windows ADMINISTRADO</strong>", "Our VPS - <strong>Managed Windows</strong>"},
		{"Nuestro VPS - <strong>Windows NO ADMINISTRADO</strong>", "Our VPS - <strong>Unmanaged Windows</strong>"},
		{"Implemente su servidor Windows al instante", "Deploy your Windows server instantly"},
		{"Inicie", "Connect via Remote Desktop Protocol (RDP) securely and instantly"},
		{"Funciones incluidas en todos los planes", "Features included in all plans"},
		{"Puertos de 1 Gbps", "1 Gbps Network Ports"},
		{"Discos de estado sólido", "NVMe Solid State Drives"},
		{"Tiempo de actividad", "99.9% Uptime Guarantee"},
		{"Firewall empresarial", "Enterprise-Grade Firewall"},
		{"Mejoramos el rendimiento y la seguridad de su VPS.", "We enhance the performance and security of your VPS."},
		{"Sistema de monitoreo", "24/7 Real-Time Monitoring"},
		{"Escalabilidad instantánea", "Instant On-Demand Scalability"},
		{"Copias de seguridad nocturnas", "Automated Daily Backups"},
		{"Preguntas frecuentes", "Frequently Asked Questions"},
		{"¿Qué es un VPS de Windows?", "What is a Windows VPS?"},
		{"¿Cómo accedo a mi VPS de Windows?", "How do I access my Windows VPS?"},
		{"¿Puedo navegar por internet con mi VPS de Windows?", "Can I browse the internet and run custom software on my Windows VPS?"},
		{"¿Proporciona licencias de Microsoft SQL (MSSQL)?", "Do you support Microsoft SQL Server (MSSQL) databases?"},
		{"¿Mi VPS de Windows tendrá licencia?", "Does my Windows VPS include an official genuine license?"},
		{"¿Puedo actualizar mi VPS de Windows más adelante?", "Can I upgrade my Windows VPS CPU, RAM, or storage later?"},
		{"¿Ofrecen copias de seguridad en Windows VPS?", "Do you provide automated backups for Windows VPS?"},
		{"¿Que se incluye en la gestión completa del servidor?", "What is included in fully managed Windows server support?"},
		{"¿Mi VPS de Windows requerirá actualizaciones de Windows?", "Will my Windows VPS receive official system updates?"},
	}
	return applyReplacements(c, pairs)
}

func translateAudioStreamingEN(c string) string {
	pairs := [][2]string{
		{"content=\"Servicio de streaming de audio en vivo con SonicPanel, AutoDJ, tráfico ilimitado y reproducción compatible con Android e iOS.\"", "content=\"Live audio streaming service with SonicPanel, AutoDJ, unlimited bandwidth, and player support for Android & iOS.\""},
		{"¿Necesitas Una Forma De Realizar Streaming?", "Need a Professional Audio Streaming Platform?"},
		{"AUDIO", "AUDIO"},
		{"Full Oyentes Ilimitados", "Unlimited Simultaneous Listeners"},
		{"En NETZ te ofrecemos una nueva solución para tu radio online.", "At NETZ, we provide the ultimate high-fidelity streaming solution for your online radio."},
		{"Herramientas Simples Y Potentes", "Simple Yet Powerful Tools"},
		{"Preguntas frecuentes", "Frequently Asked Questions"},
		{"¿Que es Radio Streaming?", "What is Radio Streaming?"},
		{"¿Los planes incluyen AutoDj?", "Do plans include cloud AutoDJ?"},
		{"¿Los planes incluyen transferencia ilimitada?", "Do plans include unmetered bandwidth?"},
		{"¿EL streaming se realiza bajo secure Streaming (https)?", "Is the stream delivered over secure HTTPS (SSL)?"},
		{"¿Cuanto tiempo tarda en activarse mi cuenta?", "How long does it take for my radio service to activate?"},
		{"¿Puedo elegir un plan y luego cambiarlo por otro?", "Can I upgrade my streaming plan at any time?"},
		{"¿Qué sistemas operativos son compatibles con Radio Streaming?", "What operating systems and media players are supported?"},
		{"¿Cuál es la garantía de disponibilidad?", "What is the uptime and reliability guarantee?"},
		{"¿Existe una política de devolución de dinero?", "Do you offer a money-back satisfaction guarantee?"},
		{"¿Puedo cancelar mi servicio?", "Can I cancel my service at any time?"},
	}
	return applyReplacements(c, pairs)
}

func translateVideoStreamingEN(c string) string {
	pairs := [][2]string{
		{"content=\"Transmisión de video streaming en vivo con calidad HD, soporte multidispositivo y reproductores HTML5 compatibles con SSL.\"", "content=\"Live HD video streaming with multi-device support, HTML5 players, and SSL encryption.\""},
		{"content=\"Transmisión de video en vivo HD 720p con SSL, reproductores HTML5 y soporte multiplataforma.\"", "content=\"Live HD video streaming with SSL, HTML5 players, and cross-platform compatibility.\""},
		{"Video Streaming", "Video Streaming"},
		{"Transmite tus eventos en vivo con la máxima calidad y sin interrupciones", "Broadcast your live events with maximum HD quality, low latency, and zero buffering."},
		{"Calidad máxima 720p", "High-Definition 720p Video Quality"},
		{"Streaming seguro bajo protocolo HTTPS (SSL)", "100% Secure HTTPS (SSL) Streaming Protocol"},
	}
	return applyReplacements(c, pairs)
}

func translateResellerCpanelEN(c string) string {
	pairs := [][2]string{
		{"content=\"Inicia o expande tu negocio de hosting con planes Reseller cPanel y WHM. Crea tus propios paquetes con recursos dedicados.\"", "content=\"Launch or scale your web hosting business with cPanel & WHM Reseller plans. Create custom packages with dedicated account resources.\""},
		{"content=\"Inicia tu propio negocio de hosting con nuestra plataforma de revendedor cPanel & WHM de alta velocidad y recursos independientes.\"", "content=\"Launch your own hosting business with our high-speed cPanel & WHM reseller platform featuring independent account resources.\""},
		{"Alojamiento de<br> revendedor", "Reseller<br> Web Hosting"},
		{"Alojamiento de revendedor potente, rápido y", "Powerful, fast and reliable reseller web hosting"},
		{"¡Disponemos del plan ideal para iniciar tu negocio!", "We have the perfect plan to launch or grow your hosting business!"},
		{"Alojamiento de revendedor, ideal para alojar varios sitios o blogs.", "Reseller hosting, perfect for hosting multiple websites or client projects with ease."},
		{"(por cuenta de cPanel)", "(per cPanel account)"},
		{"(Certificado SSL Gratis<br>en todas las cuentas)", "(Free SSL Certificate<br>on all created accounts)"},
		{"PANEL DE CONTROL LÍDER EN LA INDUSTRIA Y GESTIÓN DE DISTRIBUIDORES", "INDUSTRY-LEADING CONTROL PANEL & MULTI-ACCOUNT MANAGEMENT"},
		{"Tu marca", "Your Own White-Label Brand"},
		{"Migración", "Free Account Migrations"},
		{"¿Cómo funciona?", "How does reseller hosting work?"},
		{"Negocios de bajo costo", "Low-cost startup business"},
		{"Ingresos fijos", "Predictable recurring revenue"},
		{"Automatización", "Full automation with WHMCS & cPanel"},
		{"<span>Nosotros nos encargamos de...</span>", "<span>We take care of...</span>"},
		{"Gestionar la plataforma", "Managing the physical servers, network, and 24/7 uptime"},
		{"Seguridad del servidor", "Server security, BitNinja firewalls, daily backups, and DDoS mitigation"},
		{"Aplicaciones y software", "Continuous operating system, PHP, and cPanel software updates"},
		{"<span>Tú te encargas de...</span>", "<span>You take care of...</span>"},
		{"Apoyando a sus clientes", "Setting your pricing, creating plans, and assisting your customers"},
		{"Gestionar su negocio", "Managing and growing your hosting brand"},
		{"Configurar cuentas de cliente", "Creating isolated cPanel accounts for your clients in one click"},
	}
	return applyReplacements(c, pairs)
}

func translateResellerDirectAdminEN(c string) string {
	pairs := [][2]string{
		{"content=\"Planes Reseller de alto rendimiento con panel DirectAdmin, cuentas ilimitadas, discos NVMe y soporte técnico 24/7.\"", "content=\"High-performance Reseller plans with DirectAdmin panel, unlimited accounts, NVMe drives, and 24/7 technical support.\""},
		{"content=\"Servicio de revendedor económico y potente con panel DirectAdmin, soporte 24/7 y activación instantánea.\"", "content=\"Cost-effective and powerful reseller hosting with DirectAdmin panel, 24/7 support, and instant activation.\""},
		{"Alojamiento de revendedor", "Reseller Web Hosting"},
		{"Desarrollado por DirectAdmin", "Powered by DirectAdmin Panel"},
		{"¡Disponemos del plan ideal para iniciar tu negocio!", "We have the ideal plan to kickstart your web hosting venture!"},
	}
	return applyReplacements(c, pairs)
}

func translateAboutEN(c string) string {
	pairs := [][2]string{
		{"content=\"Conoce la historia, misión, infraestructura y equipo detrás de NETZ, tu proveedor confiable de soluciones web.\"", "content=\"Discover the story, mission, global infrastructure, and engineering team behind NETZ, your trusted hosting provider.\""},
		{"content=\"Conoce la visión, tecnología y servidores de última generación que respaldan todos los servicios de hosting y VPS de NETZ.\"", "content=\"Learn about the vision, advanced technology, and modern enterprise servers powering all NETZ hosting and VPS solutions.\""},
		{"Mejor Proveedor De Alojamiento Web", "Industry Leader in Web Infrastructure & Connectivity"},
		{"SOBRE EL EQUIPO DE", "ABOUT THE NETZ TEAM"},
		{"Estamos contigo en <br>cada paso del camino", "We are with you at <br>every step of your journey"},
		{"Nuestros clientes<br>son lo primero", "Our clients<br>always come first"},
		{"Información importante", "Important Information"},
		{"Copias de seguridad diarias automáticas", "Automated daily backups on redundant remote storage"},
		{"Aumento de recursos", "Seamless on-demand resource scaling"},
		{"Modificación de plan", "Flexible plan upgrades with zero downtime"},
		{"Sobre Nosotros", "About Us"},
		{"Lo Que Dicen Nuestros Clientes<br>Sobre Nosotros", "What Our Valued Clients<br>Say About Us"},
		{"No llegue a tener problemas", "Never had a single uptime issue"},
		{"Rápida respuesta", "Fast and dedicated customer support"},
		{"Muy accesibles", "Affordable pricing with unmatched quality"},
		{"Estoy muy contento", "Outstanding performance and flawless service"},
		{"Mi tienda online", "My e-commerce store is significantly faster"},
		{"Buen servicio de VPS", "Reliable and high-speed VPS servers"},
	}
	return applyReplacements(c, pairs)
}

func translateContactEN(c string) string {
	pairs := [][2]string{
		{"content=\"Comunícate con nuestro equipo de atención y soporte técnico internacional. Estamos disponibles para ayudarte 24/7/365.\"", "content=\"Reach out to our global technical support and sales team. We are available to assist you 24/7/365.\""},
		{"content=\"Ponte en contacto con el equipo de soporte técnico y comercial de NETZ. Estamos disponibles para ayudarte 24/7.\"", "content=\"Get in touch with the NETZ technical and sales engineering team. Available 24/7 to assist you.\""},
		{"¿Todavía tienes preguntas?", "Still have questions?"},
		{"PUEDES\n                        HABLAR CON NOSOTROS.", "TALK TO US DIRECTLY."},
		{"PUEDES HABLAR CON NOSOTROS.", "TALK TO US DIRECTLY."},
		{"<a href=\"index\">Inicio</a> - Contactos", "<a href=\"index\">Home</a> - Contact Us"},
		{"<a href=\"/us/\">Inicio</a> - Contactos", "<a href=\"/us/\">Home</a> - Contact Us"},
		{"Ponte en contacto<span>Cuentanos ¿Cómo pueden nuestros servicios hacer crecer su\n                                negocio?</span>", "Get in touch<span>Tell us: how can our hosting solutions accelerate your business?</span>"},
		{"placeholder=\"Nombre\"", "placeholder=\"Your Full Name\""},
		{"placeholder=\"Correo electronico\"", "placeholder=\"Your Business Email\""},
		{"placeholder=\"Ingrese su mensaje\"", "placeholder=\"Type your detailed inquiry here...\""},
		{">Enviar<", ">Send Message<"},
		{"¿Necesitas<br>ayuda inmediata?", "Need<br>immediate assistance?"},
		{"Nuestro equipo de apoyo está a su disposición<br>24 horas al\n                        día, 7 días a la semana.", "Our dedicated technical engineering team is ready to help<br>24 hours a day, 7 days a week."},
	}
	return applyReplacements(c, pairs)
}

func translateCentroDeAyudaEN(c string) string {
	pairs := [][2]string{
		{"content=\"Guías paso a paso, tutoriales de configuración y preguntas frecuentes sobre Web Hosting, VPS, Streaming y Dominios en NETZ.\"", "content=\"Step-by-step guides, configuration tutorials, and FAQs on Web Hosting, VPS, Streaming, and Domains at NETZ.\""},
		{"content=\"Encuentra respuestas a preguntas comunes sobre hosting, dominios, streaming, servidores VPS y métodos de pago en NETZ.\"", "content=\"Find fast answers to common questions about web hosting, domains, streaming, VPS servers, and billing at NETZ.\""},
		{"<span>Centro de Ayuda</span>Es posible que hayamos respondido su\n                    pregunta<br> Deslice hacia abajo", "<span>Help Center</span>We may have already answered your question<br> Scroll down to explore"},
		{"Si aun así no encuentra la respuesta que necesita, no dude en contactarnos,\n                    con gusto lo ayudaremos", "If you still cannot find what you need, feel free to contact us — we are delighted to help:"},
		{"Comprar Hosting", "Get Web Hosting"},
		{"Al confiar en nosotros con sus necesidades de negocio, le prometemos un\n                            99.9% de tiempo de actividad", "By trusting us with your online business, we guarantee a 99.9% network uptime SLA."},
		{"En el caso de que el dominio con la extensión que necesita no disponemos en\n                            el buscador.", "If the specific domain extension you require is not listed in our domain checker,"},
		{"No hay problema contáctanos que activaremos de forma manual.", "simply contact us and our team will activate and register it for you manually."},
		{"Soporte 24/7", "24/7 Support"},
		{"Nuestra dedicación al servicio de atención al cliente llega también a todo\n                            el mundo.", "Our world-class customer support team serves customers around the globe across multiple channels."},
		{"Abrir Ticket", "Open Ticket"},
		{"Realizar Pago", "Invoices & Billing"},
		{"Pagar Ahora", "Access Invoices"},
		{"placeholder=\"Busque su pregunta aquí..\"", "placeholder=\"Search your question here...\""},
		{"¿Quienes somos?", "Who is NETZ?"},
		{"¿Que es un dominio?", "What is a domain name?"},
		{"¿Como funciona un dominio?", "How does a domain name work?"},
		{"¿Migrar un dominio tiene algún costo?", "Does transferring a domain have any extra cost?"},
		{"¿Cómo migrar un dominio?", "How do I transfer my domain to NETZ?"},
		{"¿Que es un Hosting?", "What is Web Hosting?"},
		{"¿Como comprar mi plan de hosting?", "How do I purchase a web hosting plan?"},
		{"¿Se puede comprar hosting para juegos online?", "Can I use web hosting for online gaming servers?"},
		{"¿Qué son los correos profesionales?", "What are professional corporate emails?"},
		{"¿Los planes de Hosting son gestionados?", "Are your web hosting plans fully managed?"},
		{"¿Es necesario contratar un dominio al adquirir un plan?", "Do I have to register a new domain when ordering a plan?"},
		{"¿Como puedo cambiar los nameservers de mi dominio?", "How do I change the DNS nameservers for my domain?"},
		{"¿Que tipo de base de datos están incluidas?", "What types of databases are included?"},
		{"¿Los planes incluyen transferencia ilimitada?", "Do hosting plans feature unmetered bandwidth?"},
		{"¿Que contenido puedo alojar?", "What kind of content am I allowed to host?"},
		{"¿En que sistema operativo funcionan los servidores?", "What operating system runs on our hosting servers?"},
		{"¿Cuanto tarda en activarse mi cuenta?", "How long does it take for my account to activate after payment?"},
		{"¿Ofrecemos conexión SSH?", "Do you provide SSH shell access?"},
		{"¿Ofrecemos rubygems, Python y node.js?", "Do you natively support Ruby, Python, and Node.js?"},
		{"¿Puedo elegir un plan y cambiarlo por otro?", "Can I upgrade or downgrade my plan in the future?"},
		{"¿Cuantos correos puedo enviar como máximo por hora?", "What is the hourly outbound email sending limit?"},
	}
	return applyReplacements(c, pairs)
}

func translateTerminosEN(c string) string {
	pairs := [][2]string{
		{"content=\"Términos, condiciones de contratación, activación de servicios y políticas de reembolso de NETZ para todos los clientes.\"", "content=\"Terms of Service, service activation timelines, and refund policies for all NETZ global clients.\""},
		{"content=\"Términos del Servicio y Condiciones de Contratación de NETZ. Conoce nuestras políticas de uso, garantías y reembolsos.\"", "content=\"Terms of Service and General Contracting Conditions of NETZ. Learn about acceptable use, SLAs, and refund policies.\""},
		{"Términos del Servicio", "Terms of Service"},
		{"Términos de Servicio", "Terms of Service"},
		{"Condiciones Generales de Contratación", "General Service Agreement"},
		{"Términos del\n                        Servicio y Política de Reembolso", "Terms of Service & Refund Policy"},
		{"El presente contrato regula los términos, condiciones, modalidades de\n                        contratación y políticas de reembolso aplicables a todos los servicios provistos por NETZ", "This agreement governs the terms, conditions, contracting procedures, and refund policies applicable to all services provided by NETZ"},
		{"1. PROCESO DE CONTRATACIÓN Y COMPRA", "1. ORDERING & CONTRACTING PROCESS"},
		{"La contratación de los servicios de NETZ se realiza en forma directa y transparente a través de\n                        nuestra plataforma web:", "Ordering NETZ services is conducted directly and transparently through our official web platform:"},
		{"Selección del Plan:", "Plan Selection:"},
		{"Registro de Cuenta:", "Account Registration:"},
		{"Pago Seguro:", "Secure Payment:"},
		{"Confirmación de Orden:", "Order Confirmation:"},
		{"2. TIEMPOS Y POLÍTICA DE ACTIVACIÓN DE SERVICIOS", "2. SERVICE ACTIVATION TIMELINES"},
		{"NETZ implementa procesos de provisión según la naturaleza del servicio contratado:", "NETZ provisions services promptly according to the technical nature of each order:"},
		{"Servicios Estándar (Activación Instantánea):", "Standard Hosting & Services (Instant Activation):"},
		{"Servicios Personalizados o a Medida:", "Custom or Dedicated Deployments:"},
		{"3. GARANTÍA DE SATISFACCIÓN, POLÍTICA DE DEVOLUCIONES Y REEMBOLSOS", "3. 30-DAY MONEY-BACK GUARANTEE & REFUND POLICY"},
		{"En NETZ respaldamos la calidad de nuestra infraestructura y el compromiso con nuestros clientes:", "At NETZ, we stand firmly behind the performance of our global infrastructure and our client commitments:"},
		{"Garantía de 30 Días para Web Hosting:", "30-Day Money-Back Guarantee for Web Hosting:"},
		{"Plazo y Modalidad de Procesamiento:", "Refund Processing Timeframe:"},
		{"Excepciones y Servicios No Reembolsables:", "Non-Refundable Services & Exceptions:"},
		{"4. CANCELACIÓN VOLUNTARIA DE SERVICIOS", "4. VOLUNTARY SERVICE CANCELLATION"},
		{"El cliente tiene total libertad para solicitar la cancelación voluntaria", "Clients maintain complete freedom to request service cancellation at any time"},
		{"No existen contratos de permanencia forzosa ni penalizaciones por baja anticipada.", "There are no lock-in contracts or early termination penalties."},
		{"5. POLÍTICA DE USO ACEPTABLE Y CONTENIDOS", "5. ACCEPTABLE USE POLICY (AUP)"},
		{"Queda terminantemente prohibido alojar o transmitir:", "It is strictly forbidden to host or transmit:"},
		{"6. NIVELES DE SERVICIO Y SOPORTE TÉCNICO", "6. SERVICE LEVEL AGREEMENT (SLA) & SUPPORT"},
		{"7. COPIAS DE SEGURIDAD (BACKUPS)", "7. DATA BACKUPS & RESPONSIBILITY"},
		{"8. JURISDICCIÓN Y LEY APLICABLE", "8. GOVERNING LAW & JURISDICTION"},
		{"Última Actualización:", "Last Updated:"},
		{"Al utilizar nuestros servicios aceptas el", "By using our services you accept our"},
		{"Nuestro equipo de soporte está aquí para usted 24/7", "Our technical support team is here for you 24/7"},
	}
	return applyReplacements(c, pairs)
}

func translatePrivacidadEN(c string) string {
	pairs := [][2]string{
		{"content=\"Conoce nuestras estrictas políticas de protección de datos, confidencialidad y privacidad en el uso de los servicios de NETZ.\"", "content=\"Learn about our rigorous data protection, confidentiality, and privacy practices across all NETZ services.\""},
		{"content=\"Política de Privacidad y Tratamiento de Datos Personales de NETZ. Transparencia, seguridad y cumplimiento normativo.\"", "content=\"NETZ Privacy Policy and Personal Data Handling. Transparency, high security, and regulatory compliance.\""},
		{"Politica de Privacidad", "Privacy Policy"},
		{"Política de Privacidad", "Privacy Policy"},
		{"Compromiso con su Privacidad", "Our Commitment to Your Privacy"},
		{"Protección de Datos\n                        Personales", "Personal Data Protection"},
		{"NETZ garantiza el tratamiento seguro,\n                        confidencial y lícito de sus datos personales.", "NETZ guarantees the secure, lawful, and strictly confidential processing of your personal data."},
		{"1. RESPONSABLE DEL TRATAMIENTO", "1. DATA CONTROLLER & IDENTITY"},
		{"2. DATOS QUE RECOPILAMOS Y FINALIDAD", "2. DATA WE COLLECT & PURPOSES"},
		{"3. VERACIDAD Y EXACTITUD DE LOS DATOS", "3. ACCURACY & VERACITY OF DATA"},
		{"4. DERECHOS DEL TITULAR (DERECHOS ARCO)", "4. USER DATA RIGHTS & GDPR ALIGNMENT"},
		{"5. SEGURIDAD DE LA INFORMACIÓN Y CERTIFICADOS SSL", "5. INFORMATION SECURITY & SSL ENCRYPTION"},
		{"6. TRANSFERENCIA INTERNACIONAL Y ALMACENAMIENTO", "6. INTERNATIONAL DATA TRANSFERS & STORAGE"},
		{"7. CONSERVACIÓN DE LOS DATOS", "7. DATA RETENTION & CUSTODY"},
		{"8. USO DE COOKIES", "8. COOKIES POLICY"},
		{"Última Actualización:", "Last Updated:"},
		{"Al utilizar nuestros servicios aceptas el", "By using our services you accept our"},
		{"Nuestro equipo de soporte está aquí para usted 24/7", "Our technical support team is here for you 24/7"},
	}
	return applyReplacements(c, pairs)
}

func translateAvisoLegalEN(c string) string {
	pairs := [][2]string{
		{"content=\"Información legal, condiciones de uso y datos corporativos de la plataforma NETZ.\"", "content=\"Legal notice, terms of use, and corporate information for the NETZ cloud hosting platform.\""},
		{"content=\"Aviso Legal e Información General de NETZ. Datos identificatorios del prestador, condiciones de uso y propiedad intelectual.\"", "content=\"NETZ Legal Notice and Corporate Disclosure. Provider identification, website terms of use, and intellectual property rights.\""},
		{"Aviso Legal", "Legal Notice"},
		{"1. INFORMACIÓN GENERAL DEL PRESTADOR", "1. PROVIDER CORPORATE INFORMATION"},
		{"2. OBJETO Y ÁMBITO DE APLICACIÓN", "2. PURPOSE & SCOPE OF APPLICATION"},
		{"3. PROPIEDAD INTELECTUAL E INDUSTRIAL", "3. INTELLECTUAL & INDUSTRIAL PROPERTY"},
		{"4. CONDICIONES DE USO DEL PORTAL", "4. PORTAL TERMS OF USE"},
		{"5. EXENCIÓN DE RESPONSABILIDAD", "5. DISCLAIMER OF LIABILITY"},
		{"6. ENLACES A TERCEROS", "6. THIRD-PARTY HYPERLINKS"},
		{"7. COMUNICACIONES ELECTRÓNICAS", "7. ELECTRONIC COMMUNICATIONS"},
		{"8. LEGISLACIÓN APLICABLE Y JURISDICCIÓN", "8. APPLICABLE LAW & JURISDICTION"},
		{"Última Actualización:", "Last Updated:"},
		{"Al utilizar nuestros servicios aceptas el", "By using our services you accept our"},
		{"Nuestro equipo de soporte está aquí para usted 24/7", "Our technical support team is here for you 24/7"},
	}
	return applyReplacements(c, pairs)
}

func translate404EN(c string) string {
	pairs := [][2]string{
		{"content=\"La página que buscas no existe o ha sido movida.\"", "content=\"The page you are looking for does not exist or has been moved.\""},
		{"Oops! Lo siento, esta página no existe!<small>Si el problema persiste, por\n                        favor contacta con el administrador.</small>", "Oops! We could not find that page!<small>If the problem persists, please reach out to our support engineering team.</small>"},
		{"Oops! Lo siento, esta página no existe!<small>Si el problema persiste, por favor contacta con el administrador.</small>", "Oops! We could not find that page!<small>If the problem persists, please reach out to our support engineering team.</small>"},
		{"Volver al Inicio", "Back to Home"},
	}
	return applyReplacements(c, pairs)
}

func main() {
	start := time.Now()
	fmt.Println("🇺🇸 Generating English (locales/us/) templates from root pages...")

	localesUsDir := filepath.Join("locales", "us")
	if err := os.MkdirAll(localesUsDir, 0755); err != nil {
		fmt.Printf("❌ Error creating locales/us: %v\n", err)
		return
	}

	productionPages := []string{
		"404.html",
		"about.html",
		"audio-streaming.html",
		"aviso-legal.html",
		"buscar-dominios.html",
		"centro-de-ayuda.html",
		"contact.html",
		"hosting-exclusivo.html",
		"hosting-ilimitado.html",
		"index.html",
		"politica-de-privacidad.html",
		"reseller-cpanel.html",
		"reseller-directadmin.html",
		"terminos-del-servicio.html",
		"video-streaming.html",
		"vps-linux-administrado.html",
		"vps-linux-no-administrado.html",
		"vps-linux.html",
		"vps-windows-administrado.html",
		"vps-windows-no-administrado.html",
		"vps-windows.html",
	}

	successCount := 0

	for _, page := range productionPages {
		srcBytes, err := os.ReadFile(page)
		if err != nil {
			fmt.Printf("  ⚠️ Missing root page %s, skipping...\n", page)
			continue
		}

		content := string(srcBytes)

		// 1. Reemplazos globales para toda la web en EN
		content = applyReplacements(content, globalReplacementsEN)

		// 2. Reemplazos específicos por plantilla
		switch page {
		case "index.html":
			content = translateIndexEN(content)
		case "buscar-dominios.html":
			content = translateBuscarDominiosEN(content)
		case "hosting-ilimitado.html":
			content = translateHostingIlimitadoEN(content)
		case "hosting-exclusivo.html":
			content = translateHostingExclusivoEN(content)
		case "vps-linux.html", "vps-linux-administrado.html", "vps-linux-no-administrado.html":
			content = translateVpsLinuxEN(content)
		case "vps-windows.html", "vps-windows-administrado.html", "vps-windows-no-administrado.html":
			content = translateVpsWindowsEN(content)
		case "audio-streaming.html":
			content = translateAudioStreamingEN(content)
		case "video-streaming.html":
			content = translateVideoStreamingEN(content)
		case "reseller-cpanel.html":
			content = translateResellerCpanelEN(content)
		case "reseller-directadmin.html":
			content = translateResellerDirectAdminEN(content)
		case "about.html":
			content = translateAboutEN(content)
		case "contact.html":
			content = translateContactEN(content)
		case "centro-de-ayuda.html":
			content = translateCentroDeAyudaEN(content)
		case "terminos-del-servicio.html":
			content = translateTerminosEN(content)
		case "politica-de-privacidad.html":
			content = translatePrivacidadEN(content)
		case "aviso-legal.html":
			content = translateAvisoLegalEN(content)
		case "404.html":
			content = translate404EN(content)
		}

		dstPath := filepath.Join(localesUsDir, page)
		if err := os.WriteFile(dstPath, []byte(content), 0644); err != nil {
			fmt.Printf("  ❌ Error writing %s: %v\n", dstPath, err)
			continue
		}

		fmt.Printf("  ✅ Translated & saved: %s\n", dstPath)
		successCount++
	}

	fmt.Printf("\n✨ Successfully generated %d US English templates in %s in %v!\n", successCount, localesUsDir, time.Since(start))
}
