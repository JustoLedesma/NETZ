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
	{"<title>Radio Streaming SSL con AutoDJ SonicPanel | NETZ</title>", "<title>Radio Streaming SSL with AutoDJ SonicPanel | NETZ</title>"},
	{"<title>Aviso Legal e Información Corporativa | NETZ</title>", "<title>Legal Notice & Corporate Information | NETZ</title>"},
	{"<title>Comprobador y Registro de Dominios Web | NETZ</title>", "<title>Domain Checker & Web Domain Registration | NETZ</title>"},
	{"<title>Centro de Ayuda y Base de Conocimientos | NETZ</title>", "<title>Help Center & Knowledgebase | NETZ</title>"},
	{"<title>Contacto y Soporte Técnico 24/7 | NETZ</title>", "<title>Contact Us & 24/7 Technical Support | NETZ</title>"},
	{"<title>Hosting Exclusivo y Empresarial Dedicado | NETZ</title>", "<title>Dedicated Business & Enterprise Hosting | NETZ</title>"},
	{"<title>Hosting Ilimitado SSD NVMe con cPanel | NETZ</title>", "<title>Unlimited Hosting SSD NVMe with cPanel | NETZ</title>"},
	{"<title>NETZ | Web Hosting Ilimitado, Servidores VPS, Streaming y Dominios</title>", "<title>NETZ | Unlimited Web Hosting, VPS Servers, Streaming & Domains</title>"},
	{"<title>Política de Privacidad y Protección de Datos | NETZ</title>", "<title>Privacy Policy & Data Protection | NETZ</title>"},
	{"<title>Hosting Reseller cPanel & WHM Multicuenta | NETZ</title>", "<title>cPanel & WHM Reseller Hosting Multi-Account | NETZ</title>"},
	{"<title>Hosting Reseller DirectAdmin Económico | NETZ</title>", "<title>Cost-Effective DirectAdmin Reseller Hosting | NETZ</title>"},
	{"<title>Términos del Servicio y Política de Reembolso | NETZ</title>", "<title>Terms of Service & Refund Policy | NETZ</title>"},
	{"<title>Video Streaming en Vivo HD con SSL | NETZ</title>", "<title>Live HD Video Streaming with SSL | NETZ</title>"},
	{"<title>Servidores VPS Linux Administrado 24/7 | NETZ</title>", "<title>Managed Linux VPS Servers 24/7 | NETZ</title>"},
	{"<title>Servidores VPS Linux No Administrado Root | NETZ</title>", "<title>Unmanaged Linux VPS Servers Root | NETZ</title>"},
	{"<title>Servidores VPS Linux | NETZ</title>", "<title>High-Performance Linux VPS Servers | NETZ</title>"},
	{"<title>Servidores VPS Windows Administrado | NETZ</title>", "<title>Managed Windows VPS Servers | NETZ</title>"},
	{"<title>Servidores VPS Windows No Administrado RDP | NETZ</title>", "<title>Unmanaged Windows VPS Servers RDP | NETZ</title>"},
	{"<title>Servidores VPS Windows | NETZ</title>", "<title>Windows VPS Servers with Official License | NETZ</title>"},

	// OpenGraph y Meta Descriptions globales
	{"content=\"Plataforma líder en Web Hosting Ilimitado de alto rendimiento, Servidores VPS Linux y Windows, Streaming de Radio y Video, y Registro de Dominios. Soporte 24/7 y activación inmediata a nivel mundial.\"", "content=\"Leading platform for high-performance Unlimited Web Hosting, Linux & Windows VPS Servers, Radio & Video Streaming, and Domain Registration. 24/7 support and instant activation worldwide.\""},
	{"content=\"web hosting ilimitado, comprar hosting, servidores vps administrados, vps linux, vps windows, comprar dominios baratos, streaming radio sonicpanel, video streaming ssl, hosting revendedor, hosting cpanel, netz\"", "content=\"unlimited web hosting, buy hosting, managed vps servers, linux vps, windows vps, cheap domains, radio streaming sonicpanel, video streaming ssl, reseller hosting, cpanel hosting, netz\""},

	// Barra de navegación fija
	{"<a class=\"nav-link\" href=\"index\">Inicio", "<a class=\"nav-link\" href=\"index\">Home"},
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

	// Características de Hosting y Planes
	{"Plan Básico", "Basic Plan"},
	{"Plan Pro +", "Pro+ Plan"},
	{"Plan Pro", "Pro Plan"},
	{"Principalmente para uso personal", "Ideal for personal projects and blogs"},
	{"Principalmente para uso empresarial", "Perfect for businesses and online stores"},
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
		{"<span>ENCUENTRA TU NOMBRE DE DOMINIO\n                            PERFECTO..</span>REGISTRO DE DOMINIOS<small>Al precio más accesible del mercado</small>", "<span>FIND YOUR PERFECT DOMAIN\n                            NAME..</span>DOMAIN REGISTRATION<small>At the most affordable price on the market</small>"},
		{"<span>ENCUENTRA TU NOMBRE DE DOMINIO PERFECTO..</span>REGISTRO DE DOMINIOS<small>Al precio más accesible del mercado</small>", "<span>FIND YOUR PERFECT DOMAIN NAME..</span>DOMAIN REGISTRATION<small>At the most affordable price on the market</small>"},
		{"placeholder=\"Buscador de Dominios\"", "placeholder=\"Search domain name here...\""},
		{"title=\"Buscar\"", "title=\"Search\""},
		{"title=\"Transferir\"", "title=\"Transfer\""},
		{"value=\"Buscar\"", "value=\"Search\""},
		{"value=\"Transferir\"", "value=\"Transfer\""},
		{"Precio Inicial desde USD 1.99/Año", "Starting price from USD 1.99/Year"},
		{"CHEQUEA NUESTROS PLANES DE HOSTING <br><span class=\"mr-tp-20\">Recursos\n                    exclusivos con mayor velocidad!</span>", "CHECK OUR HOSTING PLANS <br><span class=\"mr-tp-20\">Dedicated resources with lightning speed!</span>"},
		{"CHEQUEA NUESTROS PLANES DE HOSTING <br><span class=\"mr-tp-20\">Recursos exclusivos con mayor velocidad!</span>", "CHECK OUR HOSTING PLANS <br><span class=\"mr-tp-20\">Dedicated resources with lightning speed!</span>"},
		{"2 Meses Gratis con el pago anual", "2 Months Free with Annual Billing"},
		{"Haga que su empresa este en línea hoy mismo con\n                    unidades SSD rápidas, creador de sitios web gratuito y almacenamiento web de correo ilimitado.\n                    <br>Certificados SSL gratuitos incluidos.", "Get your business online today with fast SSD drives, free website builder, and unlimited email web storage.<br>Free SSL Certificates included."},
		{"Haga que su empresa este en línea hoy mismo con unidades SSD rápidas, creador de sitios web gratuito y almacenamiento web de correo ilimitado. <br>Certificados SSL gratuitos incluidos.", "Get your business online today with fast SSD drives, free website builder, and unlimited email web storage. <br>Free SSL Certificates included."},
		{"TODOS NUESTROS PLANES INCLUYEN", "ALL OUR PLANS INCLUDE"},
		{"Las mejores características del mercado", "The best features on the market"},
		{"Discos SSD y NVMe", "SSD & NVMe Drives"},
		{"Almacenamiento de estado sólido ultrarrápido para una carga inmediata.", "Ultra-fast solid-state storage for instant website loading."},
		{"Panel de Control cPanel", "cPanel Control Panel"},
		{"La herramienta líder para gestionar correos, archivos y bases de datos con facilidad.", "The industry-standard tool to manage email, files, and databases with ease."},
		{"Copias de Seguridad", "Automated Backups"},
		{"Respaldos periódicos de tu información para total tranquilidad ante cualquier eventualidad.", "Regular snapshots of your data for total peace of mind in any scenario."},
		{"Seguridad y SSL", "Security & Free SSL"},
		{"Certificados SSL gratuitos para cifrar las comunicaciones y mejorar el posicionamiento en Google.", "Free SSL certificates to encrypt communications and boost SEO rankings."},
		{"Activación Inmediata", "Instant Activation"},
		{"Tu servicio se activa de manera automatizada tras la confirmación del pago.", "Your service activates automatically right after payment confirmation."},
		{"Soporte 24/7", "24/7 Technical Support"},
		{"Equipo de profesionales disponible para ayudarte por ticket o chat cuando lo necesites.", "Dedicated engineering team ready to assist you via ticket or chat anytime."},
		{"¿POR QUÉ ELEGIR NUESTROS SERVIDORES?", "WHY CHOOSE OUR SERVERS?"},
		{"Máximo Rendimiento", "Maximum Performance"},
		{"Nuestra infraestructura está optimizada con hardware de última generación para garantizar tiempos de respuesta mínimos.", "Our infrastructure is powered by cutting-edge hardware to guarantee minimal response times."},
		{"Disponibilidad 99.9%", "99.9% Uptime Guarantee"},
		{"Monitoreo constante de servidores y redes redundantes para mantener tus proyectos siempre en línea.", "Continuous server monitoring and redundant networks keep your services always online."},
		{"PREGUNTAS FRECUENTES", "FREQUENTLY ASKED QUESTIONS"},
		{"Resolvemos tus dudas sobre nuestros servicios de hosting.", "Find answers to common questions about our web hosting services."},
		{"¿Cuánto tarda en activarse mi cuenta de hosting?", "How long does it take for my hosting account to activate?"},
		{"La activación es automática e inmediata una vez confirmado el pago. Recibirás un correo de bienvenida con los datos de acceso a cPanel.", "Activation is automatic and immediate once payment is confirmed. You will receive a welcome email with your cPanel credentials."},
		{"¿Puedo migrar mi sitio web desde otro proveedor?", "Can I migrate my website from another provider?"},
		{"Sí, nuestro equipo técnico puede ayudarte a migrar tu cuenta de cPanel de forma gratuita y sin interrupciones en el servicio.", "Yes! Our technical team can assist you with migrating your cPanel account for free with zero downtime."},
		{"¿Qué métodos de pago aceptan?", "What payment methods do you accept?"},
		{"Aceptamos tarjetas de crédito y débito (Visa, MasterCard), transferencias bancarias, PayPal y criptomonedas.", "We accept credit and debit cards (Visa, MasterCard), bank transfers, PayPal, and cryptocurrency."},
		{"¿Qué panel de control utilizan?", "Which control panel do you provide?"},
		{"Todos nuestros planes de Web Hosting incluyen cPanel en español, la herramienta más intuitiva y potente del mercado.", "All our Web Hosting plans include cPanel, the most intuitive and powerful hosting control panel on the market."},
		{"¿Incluyen certificado de seguridad SSL?", "Do your plans include an SSL security certificate?"},
		{"Sí, todos los dominios y subdominios alojados en nuestros servidores cuentan con certificados SSL gratuitos de Let's Encrypt con renovación automática.", "Yes, all domains and subdomains hosted on our servers include free Let's Encrypt SSL certificates with automatic renewal."},
		{"¿Tienen garantía de reembolso?", "Do you offer a money-back guarantee?"},
		{"Ofrecemos una garantía de satisfacción de 30 días en planes de hosting. Si el servicio no cumple con tus expectativas, te reembolsamos tu dinero.", "We offer a 30-day money-back satisfaction guarantee on web hosting plans. If you are not satisfied, we will refund your purchase."},
	}
	return applyReplacements(c, pairs)
}

func translateBuscarDominiosEN(c string) string {
	pairs := [][2]string{
		{"<title>Comprobador y Registro de Dominios Web | NETZ</title>", "<title>Domain Checker & Registration | NETZ</title>"},
		{"BUSCADOR Y REGISTRO DE DOMINIOS", "DOMAIN CHECKER & REGISTRATION"},
		{"Verifica la disponibilidad de tu dominio y regístralo al mejor precio del mercado.", "Search domain availability and register your ideal web domain at the best prices."},
		{"placeholder=\"Escribe el dominio que buscas... (ej: miempresa.com)\"", "placeholder=\"Search the domain you want... (e.g., mybusiness.com)\""},
		{"placeholder=\"Buscar dominio...\"", "placeholder=\"Search domain...\""},
		{">Buscar Dominio<", ">Search Domain<"},
		{">Consultar Disponibilidad<", ">Check Availability<"},
		{"<th style=\"width: 35%;\">Dominio</th>", "<th style=\"width: 35%;\">Domain</th>"},
		{"<th style=\"width: 25%;\">Registro</th>", "<th style=\"width: 25%;\">Registration</th>"},
		{"<th style=\"width: 25%;\">Renovación</th>", "<th style=\"width: 25%;\">Renewal</th>"},
		{"<th style=\"width: 15%;\">Acción</th>", "<th style=\"width: 15%;\">Action</th>"},
		{"Consultando disponibilidad...", "Checking availability..."},
		{"¡Disponible!", "Available!"},
		{"¡Ya registrado!", "Already registered!"},
		{"El dominio ya se encuentra registrado.", "This domain is already registered."},
		{"El dominio está disponible para registro inmediato.", "This domain is available for immediate registration."},
		{"Registrar ahora", "Register now"},
		{"Transferir", "Transfer"},
		{"Cargando extensiones de dominios...", "Loading domain extensions..."},
		{"No se encontraron extensiones disponibles.", "No domain extensions found."},
		{"¿POR QUÉ REGISTRAR TU DOMINIO CON NOSOTROS?", "WHY REGISTER YOUR DOMAIN WITH US?"},
		{"Gestión DNS Completa", "Full DNS Management"},
		{"Control total de tus zonas DNS: registros A, CNAME, MX, TXT y más desde un panel intuitivo.", "Full control of your DNS zone: A, CNAME, MX, TXT records and more from an intuitive panel."},
		{"Protección Whois Privacy", "Whois Privacy Protection"},
		{"Mantén tus datos personales y de contacto protegidos contra spam y recopiladores automáticos.", "Protect your personal contact data from spam and identity theft."},
		{"Bloqueo de Transferencia", "Transfer Lock"},
		{"Evita transferencias no autorizadas de tu dominio con un clic.", "Prevent unauthorized domain transfers with one click."},
		{"Renovación Automática", "Auto-Renewal"},
		{"Nunca pierdas tu dominio. Te notificamos con antelación y puedes activar el cobro automático.", "Never lose your domain name. We notify you in advance and offer automatic renewal."},
	}
	return applyReplacements(c, pairs)
}

func translateContactEN(c string) string {
	pairs := [][2]string{
		{"<title>Contacto y Soporte Técnico 24/7 | NETZ</title>", "<title>Contact Us & 24/7 Technical Support | NETZ</title>"},
		{"CONTÁCTENOS", "CONTACT US"},
		{"Estamos aquí para ayudarte. Ponte en contacto con nuestro equipo técnico y comercial.", "We are here to help. Reach out to our technical and sales team anytime."},
		{"Envíanos un Mensaje", "Send Us a Message"},
		{"Nombre Completo", "Full Name"},
		{"placeholder=\"Tu nombre y apellido\"", "placeholder=\"Your full name\""},
		{"Correo Electrónico", "Email Address"},
		{"placeholder=\"tucorreo@dominio.com\"", "placeholder=\"yourname@domain.com\""},
		{"Asunto", "Subject"},
		{"placeholder=\"¿En qué podemos ayudarte?\"", "placeholder=\"How can we help you?\""},
		{"Mensaje", "Message"},
		{"placeholder=\"Escribe tu consulta o requerimiento con el mayor detalle posible...\"", "placeholder=\"Write your inquiry or question with as much detail as possible...\""},
		{">Enviar Mensaje<", ">Send Message<"},
		{"Canales de Atención Directa", "Direct Communication Channels"},
		{"Atención Rápida por WhatsApp", "Instant Assistance via WhatsApp"},
		{"Soporte por Ticket y Correo", "Ticket & Email Support"},
		{"Nuestras Oficinas", "Headquarters"},
		{"Horario de Atención", "Business Hours"},
		{"Soporte Técnico: 24 horas al día, 7 días a la semana, los 365 días del año.", "Technical Support: 24/7/365 continuous assistance."},
		{"Atención Comercial y Facturación: Lunes a Viernes de 08:00 a 18:00 (GMT-4).", "Sales & Billing: Monday to Friday from 08:00 to 18:00 (GMT-4)."},
	}
	return applyReplacements(c, pairs)
}

func translateAboutEN(c string) string {
	pairs := [][2]string{
		{"<title>Sobre Nosotros | Infraestructura y Equipo NETZ</title>", "<title>About Us | Infrastructure & Engineering Team | NETZ</title>"},
		{"SOBRE NOSOTROS", "ABOUT US"},
		{"Infraestructura de Clase Mundial, Rendimiento Garantizado", "World-Class Infrastructure, Guaranteed Performance"},
		{"En NETZ nos dedicamos a ofrecer soluciones de hosting de alto rendimiento, servidores VPS, streaming y registro de dominios.", "At NETZ, we provide high-performance web hosting solutions, VPS servers, streaming, and domain registration."},
		{"Nuestra Misión", "Our Mission"},
		{"Nuestra Visión", "Our Vision"},
		{"Nuestros Valores", "Our Core Values"},
		{"Centros de Datos de Última Generación", "Next-Generation Data Centers"},
		{"Conectividad Global Redundante", "Redundant Global Connectivity"},
		{"Hardware Empresarial de Primer Nivel", "Enterprise-Grade Hardware"},
		{"Seguridad y Protección DDoS Avanzada", "Advanced Security & DDoS Mitigation"},
		{"Años de Experiencia", "Years of Experience"},
		{"Clientes Satisfechos", "Satisfied Clients"},
		{"Disponibilidad Garantizada", "Guaranteed Uptime"},
		{"Soporte Técnico Continuo", "Continuous Support"},
	}
	return applyReplacements(c, pairs)
}

func translateHelpCenterEN(c string) string {
	pairs := [][2]string{
		{"<title>Centro de Ayuda y Base de Conocimientos | NETZ</title>", "<title>Help Center & Knowledgebase | NETZ</title>"},
		{"CENTRO DE AYUDA", "HELP CENTER"},
		{"Base de Conocimientos y Respuestas Rápidas", "Knowledgebase & Fast Answers"},
		{"placeholder=\"¿Qué necesitas solucionar hoy? (ej: configurar correo, DNS, cPanel)\"", "placeholder=\"What do you need help with? (e.g., email setup, DNS, cPanel)\""},
		{"Configuración de Correo Electrónico", "Email Configuration"},
		{"Guías para configurar Outlook, Thunderbird, iOS y Android con IMAP/POP3 seguro.", "Step-by-step guides for Outlook, Thunderbird, iOS, and Android with secure IMAP/POP3."},
		{"Gestión de Dominios y DNS", "Domain & DNS Management"},
		{"Aprende a apuntar tus DNS, configurar registros A, MX, CNAME y SPF/DKIM.", "Learn how to manage nameservers, configure A, MX, CNAME, and SPF/DKIM records."},
		{"Uso y Trucos de cPanel", "cPanel Guides & Tutorials"},
		{"Cómo crear cuentas de correo, administrar bases de datos MySQL y subir archivos por FTP.", "How to create email accounts, manage MySQL databases, and upload files via FTP."},
		{"Servidores VPS y SSH", "VPS Servers & SSH"},
		{"Instalación de paneles de control, accesos SSH, cortafuegos y optimización de servidores.", "Control panel installation, SSH root access, firewalls, and server optimization."},
		{"Facturación y Pagos", "Billing & Payments"},
		{"Métodos de pago aceptados, descarga de facturas y renovación automática de servicios.", "Accepted payment methods, invoice downloads, and automatic renewals."},
		{"¿No encontraste lo que buscabas?", "Didn't find what you were looking for?"},
		{"Abre un ticket con nuestro soporte técnico y te responderemos en minutos.", "Open a ticket with our technical support team and we will respond in minutes."},
		{">Abrir Ticket de Soporte<", ">Open Support Ticket<"},
	}
	return applyReplacements(c, pairs)
}

func translateLegalPagesEN(c string) string {
	pairs := [][2]string{
		{"TÉRMINOS DEL SERVICIO", "TERMS OF SERVICE"},
		{"POLÍTICA DE PRIVACIDAD", "PRIVACY POLICY"},
		{"AVISO LEGAL", "LEGAL NOTICE"},
		{"Última Actualización:", "Last Updated:"},
		{"1. ACEPTACIÓN DE LOS TÉRMINOS", "1. ACCEPTANCE OF TERMS"},
		{"2. DESCRIPCIÓN DEL SERVICIO", "2. SERVICE DESCRIPTION"},
		{"3. USO ACEPTABLE Y PROHIBICIONES", "3. ACCEPTABLE USE POLICY"},
		{"4. PAGOS, RENOVACIONES Y FACTURACIÓN", "4. PAYMENTS, RENEWALS & BILLING"},
		{"5. POLÍTICA DE REEMBOLSO Y GARANTÍA", "5. REFUND POLICY & GUARANTEE"},
		{"6. DISPONIBILIDAD DEL SERVICIO (SLA)", "6. SERVICE LEVEL AGREEMENT (SLA)"},
		{"7. LIMITACIÓN DE RESPONSABILIDAD", "7. LIMITATION OF LIABILITY"},
		{"8. LEY APLICABLE Y JURISDICCIÓN", "8. APPLICABLE LAW & JURISDICTION"},
		{"1. RESPONSABLE DEL TRATAMIENTO", "1. DATA CONTROLLER"},
		{"2. DATOS QUE RECOPILAMOS", "2. INFORMATION WE COLLECT"},
		{"3. FINALIDAD DEL TRATAMIENTO", "3. PURPOSE OF DATA PROCESSING"},
		{"4. DERECHOS DEL USUARIO", "4. USER DATA RIGHTS"},
		{"5. SEGURIDAD DE LA INFORMACIÓN", "5. INFORMATION SECURITY"},
		{"6. TRANSFERENCIA DE DATOS", "6. INTERNATIONAL DATA TRANSFERS"},
		{"7. POLÍTICA DE COOKIES", "7. COOKIES POLICY"},
		{"1. INFORMACIÓN GENERAL DEL PRESTADOR", "1. CORPORATE & PROVIDER INFORMATION"},
		{"2. OBJETO Y ÁMBITO DE APLICACIÓN", "2. PURPOSE & SCOPE OF APPLICATION"},
		{"3. PROPIEDAD INTELECTUAL E INDUSTRIAL", "3. INTELLECTUAL PROPERTY RIGHTS"},
		{"4. CONDICIONES DE USO DEL PORTAL", "4. WEBSITE TERMS OF USE"},
		{"5. EXENCIÓN DE RESPONSABILIDAD", "5. DISCLAIMER OF LIABILITY"},
		{"6. ENLACES A TERCEROS", "6. THIRD-PARTY LINKS"},
		{"7. COMUNICACIONES ELECTRÓNICAS", "7. ELECTRONIC COMMUNICATIONS"},
		{"8. LEGISLACIÓN APLICABLE Y JURISDICCIÓN", "8. APPLICABLE LAW & JURISDICTION"},
		{"Al utilizar nuestros servicios aceptas el", "By using our services you accept our"},
		{"Nuestro equipo de soporte está aquí para usted 24/7", "Our support engineering team is here for you 24/7"},
	}
	return applyReplacements(c, pairs)
}

func translateVPSEN(c string) string {
	pairs := [][2]string{
		{"SERVIDORES VPS LINUX", "LINUX VPS SERVERS"},
		{"SERVIDORES VPS WINDOWS", "WINDOWS VPS SERVERS"},
		{"Control total, recursos dedicados y escalabilidad para tus proyectos más exigentes.", "Full root control, dedicated resources, and high scalability for demanding projects."},
		{"Rendimiento garantizado con discos NVMe ultrarrápidos.", "Guaranteed performance with ultra-fast NVMe enterprise drives."},
		{"Acceso Root Completo", "Full Root Access"},
		{"Control RDP Total", "Full RDP Remote Desktop Control"},
		{"Virtualización KVM dedicada", "Dedicated KVM Virtualization"},
		{"Dirección IP dedicada IPv4", "Dedicated IPv4 Address"},
		{"Soporte para múltiples distribuciones Linux (Ubuntu, Debian, AlmaLinux, Rocky Linux)", "Support for multiple Linux distributions (Ubuntu, Debian, AlmaLinux, Rocky Linux)"},
		{"Windows Server con licencia oficial", "Windows Server with official license"},
		{"Panel de control de reinicio y reinstalación", "Reboot, rescue, and OS reinstall control panel"},
		{"Tráfico mensual de alta velocidad", "High-speed monthly bandwidth"},
		{"Protección Anti-DDoS incluida", "Enterprise Anti-DDoS protection included"},
		{"Soporte Técnico Administrado 24/7", "24/7 Managed Technical Support"},
		{"Administración Completa del Sistema Operativo", "Full Operating System Management"},
		{"Instalación y actualización de parches de seguridad", "Installation and security patching"},
		{"Monitoreo proactivo de uptime y rendimiento", "Proactive uptime and performance monitoring"},
		{"Configuración de cortafuegos y seguridad avanzada", "Advanced firewall and hardening setup"},
		{"Asistencia técnica prioritaria", "Priority technical assistance"},
	}
	return applyReplacements(c, pairs)
}

func translateStreamingEN(c string) string {
	pairs := [][2]string{
		{"RADIO STREAMING PROFESIONAL", "PROFESSIONAL RADIO STREAMING"},
		{"Transmite tu emisora o podcast en vivo con la más alta fidelidad y sin interrupciones.", "Broadcast your radio station or podcast live with crystal-clear audio and zero interruptions."},
		{"Panel de Control SonicPanel", "SonicPanel Control Panel"},
		{"El panel más moderno e intuitivo para radio por internet con AutoDJ integrado.", "The most advanced and user-friendly internet radio panel with built-in AutoDJ."},
		{"Streaming con Certificado SSL", "SSL Encrypted Streaming"},
		{"Tu señal compatible con reproductores web modernos y sitios con candado verde https://.", "Fully compatible with modern browsers and HTTPS secure players."},
		{"Calidad de Audio HD hasta 320 Kbps", "HD Audio Quality up to 320 Kbps"},
		{"Oyentes simultáneos sin cortes", "Simultaneous listeners without buffering"},
		{"AutoDJ con almacenamiento en la nube", "AutoDJ with cloud audio storage"},
		{"VIDEO STREAMING EN VIVO", "LIVE VIDEO STREAMING"},
		{"Transmite eventos, cultos, conferencias o canales de TV con calidad HD y enlace HTTPS.", "Stream live events, conferences, worship services, or TV channels with HD quality and HTTPS."},
		{"Reproductor HTML5 Multiplataforma", "Multiplatform HTML5 Player"},
		{"Compatible con computadoras, smartphones Android, iPhone, iPad y Smart TV.", "Compatible with desktop computers, Android, iPhone, iPad, and Smart TVs."},
		{"Compatibilidad con OBS Studio y vMix", "Full compatibility with OBS Studio & vMix"},
		{"Servidores de baja latencia", "Low-latency streaming network"},
	}
	return applyReplacements(c, pairs)
}

func translateResellerEN(c string) string {
	pairs := [][2]string{
		{"HOSTING RESELLER CPANEL & WHM", "CPANEL & WHM RESELLER HOSTING"},
		{"HOSTING RESELLER DIRECTADMIN", "DIRECTADMIN RESELLER HOSTING"},
		{"Inicia tu propia empresa de hosting con nuestra plataforma de revendedor de alta potencia.", "Start your own web hosting business with our high-performance reseller platform."},
		{"Crea y gestiona cuentas de hosting independientes para tus clientes con marca blanca.", "Create and manage independent white-label hosting accounts for your clients."},
		{"Panel WHM en español", "WHM Multi-account Panel"},
		{"DNS Personalizados con tu dominio", "Private Nameservers with your domain"},
		{"Marca blanca total", "100% White-Label Experience"},
		{"Migración gratuita de cuentas cPanel", "Free cPanel account migrations"},
		{"Discos SSD y NVMe de alta velocidad", "High-speed SSD & NVMe storage"},
		{"Certificados SSL automáticos para cada cliente", "Automated SSL certificates for every client"},
		{"Protección DDoS y WAF activa", "Active WAF & DDoS mitigation"},
	}
	return applyReplacements(c, pairs)
}

func translate404EN(c string) string {
	pairs := [][2]string{
		{"<title>Página no encontrada (404) | NETZ</title>", "<title>Page Not Found (404) | NETZ</title>"},
		{"content=\"La página que buscas no existe o ha sido movida.\"", "content=\"The page you are looking for does not exist or has been moved.\""},
		{"Oops! Lo siento, esta página no existe!<small>Si el problema persiste, por\n                        favor contacta con el administrador.</small>", "Oops! We couldn't find that page!<small>If the problem persists, please reach out to our support team.</small>"},
		{"Oops! Lo siento, esta página no existe!<small>Si el problema persiste, por favor contacta con el administrador.</small>", "Oops! We couldn't find that page!<small>If the problem persists, please reach out to our support team.</small>"},
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
		case "contact.html":
			content = translateContactEN(content)
		case "about.html":
			content = translateAboutEN(content)
		case "centro-de-ayuda.html":
			content = translateHelpCenterEN(content)
		case "terminos-del-servicio.html", "politica-de-privacidad.html", "aviso-legal.html":
			content = translateLegalPagesEN(content)
		case "vps-linux.html", "vps-linux-administrado.html", "vps-linux-no-administrado.html",
			"vps-windows.html", "vps-windows-administrado.html", "vps-windows-no-administrado.html":
			content = translateVPSEN(content)
		case "audio-streaming.html", "video-streaming.html":
			content = translateStreamingEN(content)
		case "reseller-cpanel.html", "reseller-directadmin.html":
			content = translateResellerEN(content)
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

