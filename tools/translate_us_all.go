package main

import (
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"
)

// normalizeWhitespace replaces sequences of whitespace with a single space
func normalizeWhitespace(s string) string {
	return strings.Join(strings.Fields(s), " ")
}

func replaceFuzzy(content, search, replace string) string {
	if strings.Contains(content, search) {
		return strings.ReplaceAll(content, search, replace)
	}
	// Try normalized whitespace regex
	words := strings.Fields(search)
	if len(words) == 0 {
		return content
	}
	pattern := ""
	for i, w := range words {
		if i > 0 {
			pattern += `\s+`
		}
		pattern += regexp.QuoteMeta(w)
	}
	re, err := regexp.Compile(pattern)
	if err != nil {
		return content
	}
	return re.ReplaceAllString(content, replace)
}

func applyReplacements(content string, pairs [][2]string) string {
	res := content
	for _, p := range pairs {
		res = replaceFuzzy(res, p[0], p[1])
	}
	return res
}

func main() {
	start := time.Now()
	fmt.Println("==================================================")
	fmt.Println("🚀 TRADUCTOR COMPLETO US (ENGLISH - en-US)")
	fmt.Println("==================================================")

	localesUsDir := filepath.Join("locales", "us")
	if err := os.MkdirAll(localesUsDir, 0755); err != nil {
		fmt.Printf("Error creating dir: %v\n", err)
		return
	}

	pages := []string{
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

	for _, p := range pages {
		srcBytes, err := os.ReadFile(p)
		if err != nil {
			fmt.Printf("⚠️ No se pudo leer %s: %v\n", p, err)
			continue
		}
		c := string(srcBytes)

		// 1. Reemplazos comunes de cabecera, meta y navbar estático
		c = applyGlobal(c)

		// 2. Reemplazos específicos por página
		switch p {
		case "index.html":
			c = translateIndex(c)
		case "hosting-ilimitado.html":
			c = translateHostingIlimitado(c)
		case "hosting-exclusivo.html":
			c = translateHostingExclusivo(c)
		case "audio-streaming.html":
			c = translateAudioStreaming(c)
		case "video-streaming.html":
			c = translateVideoStreaming(c)
		case "reseller-cpanel.html":
			c = translateResellerCpanel(c)
		case "reseller-directadmin.html":
			c = translateResellerDirectAdmin(c)
		case "about.html":
			c = translateAbout(c)
		case "contact.html":
			c = translateContact(c)
		case "buscar-dominios.html":
			c = translateBuscarDominios(c)
		case "centro-de-ayuda.html":
			c = translateCentroDeAyuda(c)
		case "terminos-del-servicio.html":
			c = translateTerminos(c)
		case "politica-de-privacidad.html":
			c = translatePrivacidad(c)
		case "aviso-legal.html":
			c = translateAvisoLegal(c)
		case "vps-linux.html", "vps-linux-administrado.html", "vps-linux-no-administrado.html":
			c = translateVpsLinux(c)
		case "vps-windows.html", "vps-windows-administrado.html", "vps-windows-no-administrado.html":
			c = translateVpsWindows(c)
		case "404.html":
			c = translate404(c)
		}

		dst := filepath.Join(localesUsDir, p)
		if err := os.WriteFile(dst, []byte(c), 0644); err != nil {
			fmt.Printf("❌ Error guardando %s: %v\n", dst, err)
			continue
		}
		fmt.Printf("✅ %s traducido con éxito\n", p)
	}

	fmt.Printf("\n✨ Proceso completado en %v\n", time.Since(start))
}

func applyGlobal(c string) string {
	pairs := [][2]string{
		{`lang="es"`, `lang="en-US"`},
		{`data-country="py"`, `data-country="us"`},
		{`content="es_LA"`, `content="en_US"`},
		{`content="es_ES"`, `content="en_US"`},
		{`inLanguage": "es"`, `inLanguage": "en"`},
		{`"knowsLanguage": ["es", "Spanish"]`, `"knowsLanguage": ["en", "English"]`},

		// Navbar estático
		{`>Inicio<`, `>Home<`},
		{`>Inicio <`, `>Home <`},
		{`Hosting Ilimitado<span class="nav-new-tag">Servicio sin límites de recursos</span>`, `Unlimited Hosting<span class="nav-new-tag">Unmetered Resources</span>`},
		{`Hosting Exclusivo<span>Recursos exclusivos <br>con mayor velocidad!</span>`, `Dedicated Hosting<span>Exclusive Resources <br>with Higher Speed!</span>`},
		{`Linux no administrado<span>¡Administre usted mismo!</span>`, `Unmanaged Linux<span>Full Root Access!</span>`},
		{`Linux Administrado<span>Todo el poder <br>NINGUNO de los problemas</span>`, `Managed Linux<span>All the Power <br>NONE of the Hassle</span>`},
		{`Windows no Administrado<span>¡Control Total por RDP!</span>`, `Unmanaged Windows<span>Full RDP Access!</span>`},
		{`Windows Administrado<span>Servidor Administrado</span>`, `Managed Windows<span>Fully Managed Server</span>`},
		{`Radio Streaming<span>Sonido limpio y fluido <br>Sonido de Calidad</span>`, `Radio Streaming<span>Crystal Clear Audio <br>HD Quality</span>`},
		{`Video Streaming<span>Calidad máxima 720p <br>Streaming SSL</span>`, `Video Streaming<span>Max 720p Quality <br>SSL Streaming</span>`},
		{`Reseller cPanel & WHM<span>2 CPU - 2Gb Ram, por cPanel</span>`, `Reseller cPanel & WHM<span>2 CPU - 2GB RAM per account</span>`},
		{`Reseller DirectAdmin<span>2 CPU - 2Gb Ram, por cuenta</span>`, `Reseller DirectAdmin<span>2 CPU - 2GB RAM per account</span>`},
		{`Comprobador de dominio<span class="nav-new-tag">Consulta de disponibilidad</span>`, `Domain Checker<span class="nav-new-tag">Check Availability</span>`},
		{`Transferencia de dominio<span>Transfiera su dominio</span>`, `Domain Transfer<span>Transfer your domain</span>`},
		{`>Empresa<`, `>Company<`},
		{`>Sobre Nosotros<`, `>About Us<`},
		{`>Términos de Servicio<`, `>Terms of Service<`},
		{`>Politica de Privacidad<`, `>Privacy Policy<`},
		{`>Aviso Legal<`, `>Legal Notice<`},
		{`>Cóntactenos<`, `>Contact Us<`},
		{`>Iniciar Sesión</a> <span>+595 973 136 822</span>`, `>Sign In</a> <span>+595 973 136 822</span>`},
		{`>Iniciar Sesión<`, `>Sign In<`},
		{`placeholder="Contraseña"`, `placeholder="Password"`},
		{`placeholder="E-mail"`, `placeholder="Email Address"`},
		{`placeholder="Buscador de Dominios"`, `placeholder="Search domain name here..."`},
		{`title="login"`, `title="Sign In"`},
		{`title="Buscar"`, `title="Search"`},
		{`value="Buscar"`, `value="Search"`},
		{`title="Transferir"`, `title="Transfer"`},
		{`value="Transferir"`, `value="Transfer"`},

		// Botones y selectores de ciclo
		{`>Mensual<`, `>Monthly<`},
		{`>Anual<`, `>Yearly<`},
		{`>Año<`, `>Yearly<`},
		{`<span class="change-box-text">Mensual</span>`, `<span class="change-box-text">Monthly</span>`},
		{`<span class="change-box-text">Anual</span>`, `<span class="change-box-text">Yearly</span>`},
		{`<span class="change-box-text">Año</span>`, `<span class="change-box-text">Yearly</span>`},
		{`>Contratar<`, `>Order Now<`},
		{`>Ver Planes<`, `>View Plans<`},
		{`>Ver planes<`, `>View Plans<`},
		{`>Más Información<`, `>More Info<`},
		{`>Saber más<`, `>Learn More<`},
		{`>Comprar Ahora<`, `>Buy Now<`},

		// Títulos y badges comunes
		{`2 Meses Gratis con el pago anual`, `2 Months Free with Annual Billing`},
		{`2 Meses Gratis con el pago Anual`, `2 Months Free with Annual Billing`},
		{`2 meses gratis con el pago anual`, `2 Months Free with Annual Billing`},
		{`Recursos exclusivos con mayor velocidad!`, `Exclusive resources with higher speed!`},
		{`CHEQUEA NUESTROS PLANES DE HOSTING`, `EXPLORE OUR WEB HOSTING PLANS`},
		{`Chequea nuestros planes de hosting`, `Explore our web hosting plans`},
		{`Preguntas frecuentes`, `Frequently Asked Questions`},
		{`En caso de que sus dudas no son aclaradas no dude en visitar nuestra`, `If your questions are not answered here, feel free to visit our`},
		{`base de conocimientos`, `Knowledgebase`},
		{`¿Qué nos hace tan Grandes?`, `What Makes Us Stand Out?`},
		{`Nuestras Características`, `Our Key Features`},
		{`Herramientas simples pero poderosas`, `Simple yet powerful tools`},
		{`Todo lo que necesitas y mucho más`, `Everything you need and much more`},
		{`A un solo lugar a un solo clic de distancia`, `In one place, just a single click away`},
		{`A un solo lugar a un solo click de distancia.`, `In one place, just a single click away.`},
		{`In one place at an solo click de distancia.`, `In one place, just a single click away.`},
		{`In one place at an solo clic de distancia.`, `In one place, just a single click away.`},

		// Footer estático en caso de que esté presente
		{`Únete ahora y disfruta de los mejores precios de`, `Join now and enjoy the best prices for`},
		{`Únete Ahora Y Disfruta De Los Mejores Precios De`, `Join now and enjoy the best prices for`},
		{`Alojamiento Web Y Dominios`, `Web Hosting and Domains`},
		{`Ofrecemos servicios de Radio Streaming, Video Streaming, Hosting con recurso Ilimitado, Hosting exclusivos, Dominios.`, `We provide high-performance Radio Streaming, Video Streaming, Unlimited Web Hosting, Dedicated Hosting, and Domain Registration.`},
		{`Ofrecemos servicios de Radio Streaming, Video Streaming, Hosting con recurso ilimitado, Hosting exclusivos, Dominios.`, `We provide high-performance Radio Streaming, Video Streaming, Unlimited Web Hosting, Dedicated Hosting, and Domain Registration.`},
		{`Regístrate`, `Register`},
		{`REGÍSTRATE`, `REGISTER`},
		{`INICIAR SESIÓN`, `SIGN IN`},
		{`Gestiones de Usuario`, `Client Area`},
		{`Preguntas y Respuestas`, `Help Center & FAQ`},
		{`Preguntas Y Respuestas`, `Help Center & FAQ`},
		{`Contáctenos`, `Contact Us`},
		{`Cóntactenos`, `Contact Us`},
		{`¿Olvidó su Contraseña?`, `Forgot Password?`},
		{`¿Olvidó Su Contraseña?`, `Forgot Password?`},
		{`Revisión Y Pago`, `Billing & Invoices`},
		{`Área De Clientes`, `Client Area`},
		{`Gestiona Tu Cuenta`, `Manage Account`},
		{`Servicios`, `Services`},
		{`Comprobador de dominio`, `Domain Checker`},
		{`Comprobador De Dominio`, `Domain Checker`},
		{`Métodos de pagos`, `Payment Methods`},
		{`Contactos Rápido`, `Quick Contacts`},
		{`SOPORTE`, `SUPPORT`},
		{`SOBRE NOSOTROS`, `ABOUT US`},
		{`POLITICA DE PRIVACIDAD`, `PRIVACY POLICY`},
		{`AVISO LEGAL`, `LEGAL NOTICE`},
		{`TÉRMINOS DE SERVICIO`, `TERMS OF SERVICE`},
		{`Todos los derechos reservados.`, `All rights reserved.`},
		{`Hecho con amor en Paraguay por NETZ`, `Crafted with care by NETZ`},
	}
	return applyReplacements(c, pairs)
}

func translateHostingIlimitado(c string) string {
	pairs := [][2]string{
		{`<title>Hosting Ilimitado SSD NVMe con cPanel | NETZ</title>`, `<title>Unlimited NVMe SSD Web Hosting with cPanel | NETZ</title>`},
		{`<title>Hosting Ilimitado con cPanel | NETZ</title>`, `<title>Unlimited Web Hosting with cPanel | NETZ</title>`},
		{`content="Planes de Web Hosting Ilimitado con almacenamiento SSD NVMe ultra rápido, panel cPanel, cuentas de correo corporativas ilimitadas y soporte 24/7."`, `content="High-performance Unlimited Web Hosting plans with ultra-fast NVMe SSD storage, cPanel control panel, unlimited corporate emails, and 24/7 support."`},
		{`content="Alojamiento web con recursos ilimitados, discos SSD, soporte 24/7 y panel de control cPanel para tu sitio o negocio."`, `content="Unlimited web hosting with NVMe SSD drives, 24/7 technical support, and cPanel control panel for your website or business."`},

		// Hero y 3 pilares
		{`<span>Mantenga el control total de su entorno <br>con nuestro alojamiento web</span>`, `<span>Maintain full control of your environment <br>with our web hosting</span>`},
		{`HOSTING ILIMITADO`, `UNLIMITED WEB HOSTING`},
		{`Fácil de usar`, `Easy To Use`},
		{`cPanel ha sido diseñado para ser fácil de usar e intuitivo.`, `cPanel has been engineered for effortless, intuitive management.`},
		{`Robusto`, `Robust`},
		{`cPanel ha sido desarrollado por un equipo dedicado que abarca más de 20 años.`, `cPanel has been developed and perfected by a world-class team over 20+ years.`},
		{`Poderoso`, `Powerful`},
		{`Potentes funciones de alojamiento para nuevos sitios web y aplicaciones avanzadas`, `High-powered hosting capabilities for modern websites and advanced web apps.`},

		// Sección del medio cPanel
		{`Alojamiento web ilimitado`, `Unlimited Web Hosting`},
		{`Desarrollado por cPanel`, `Powered by cPanel`},
		{`Potente alojamiento cPanel diseñado para sitios web o comercio electrónico más grandes y exigentes`, `High-performance cPanel hosting engineered for high-traffic websites and demanding eCommerce stores.`},
		{`Nuestro alojamiento web ilimitado ha sido diseñado desde cero para brindar un rendimiento constante y de vanguardia.`, `Our unlimited web hosting platform is built from the ground up to deliver consistent, cutting-edge speed and reliability.`},
		{`Alojamiento web con almacenamiento ilimitado, ancho de banda ilimitado, certificados SSL gratuitos y copias de seguridad diarias incluidas sin cargo.`, `Web hosting featuring unmetered NVMe SSD storage, unlimited bandwidth, free automated SSL certificates, and complimentary daily backups.`},
		{`¡Disponemos de opciones de aumento de la CPU y la RAM!`, `CPU and RAM scaling options available on demand!`},
		{`Impulsa tu`, `Boost your`},
		{`presencia web con almacenamiento SSD ilimitado`, `web presence with unlimited SSD storage`},

		// Herramientas (Cloudflare, LiteSpeed, BitNinja, CrossBox, WordPress, SitePro)
		{`Asegura y garantiza la fiabilidad de tus recursos dirigidos al público como sitios web, API y aplicaciones.`, `Guarantees high reliability and global DDoS protection for your public web applications and APIs.`},
		{`Con este plugin que se conecta directamente con el servidor y utiliza la tecnología y desde servidor para acelerar WordPress.`, `Integrates directly with server cache layers to deliver lightning-fast WordPress load times.`},
		{`Es prioridad máxima en nuestro servicio. BitNinja protege tanto de ataques únicos como de multitud de ataques simultáneos.`, `Top security priority. BitNinja shields your server from zero-day exploits, botnets, and multi-vector cyber attacks.`},
		{`Es hermoso, increíblemente rápido y viene con características avanzadas que le brindan a usted y a su equipo tecnologías de comunicación de vanguardia.`, `Modern, ultra-fast webmail client equipped with team collaboration tools and cutting-edge communication tech.`},
		{`Es un sistema de gestión de contenidos, Es la forma más simple y popular para crear su propio sitio o blog, es el manejador de contenidos más grande del mundo.`, `The world's leading CMS. The easiest, most powerful way to launch blogs, portals, and robust eCommerce stores.`},
		{`Es constructor de sitios web profesional y muy fácil de utilizar. No se necesitas tener conocimientos en programación o configuraciones complejas.`, `Professional visual site builder with intuitive drag-and-drop design. No coding or complex configuration required.`},

		// Aplicaciones y Softaculous
		{`Sus aplicaciones favoritas`, `Your Favorite Applications`},
		{`Nuestro alojamiento compartido viene optimizado`, `Our shared hosting platform comes optimized`},
		{`Con la aplicación más popular`, `With the most popular applications`},
		{`Con instalación de un clic`, `With 1-click automated installation`},

		// Grid de Características
		{`FUNCIONES DEL ALOJAMIENTO !`, `HOSTING FEATURES & BENEFITS !`},
		{`¡Herramientas simples y potentes, a su entera disposición en todos los planes!`, `Simple yet powerful tools, fully included across all hosting plans!`},
		{`Seguridad y malware`, `Security & Malware`},
		{`Seguridad a prueba de balas`, `Bulletproof Protection`},
		{`Alojamiento en la nube`, `Cloud Architecture`},
		{`Ultrarrápido Bolt-Cache`, `Ultra-Fast Bolt-Cache`},
		{`Copias de seguridad`, `Automated Backups`},
		{`Diarias y gratuitas`, `Daily & Free of Charge`},
		{`Certificados SSL completos`, `Full SSL Certificates`},
		{`de 256 bits. Gratis`, `256-bit encryption. Free`},
		{`MailChannels - ¡No más`, `MailChannels - Zero`},
		{`problemas de listas negras!`, `Blacklist Issues!`},
		{`Almacenamiento en`, `High-Performance`},
		{`caché de proxy NGINX`, `NGINX Proxy Cache`},
		{`Instalación de`, `1-Click App`},
		{`aplicaciones simplificado`, `Installer (Softaculous)`},
		{`99,9% de tiempo de`, `99.9% Verified`},
		{`Actividad garantizado`, `Uptime Guarantee`},

		// Planes
		{`Sitio Web Único`, `Single Website`},
		{`Sitios Ilimitados`, `Unlimited Websites`},
		{`Almacenamiento SSD Ilimitado`, `Unlimited SSD Storage`},
		{`Ancho de Banda Ilimitado`, `Unlimited Bandwidth`},
		{`Bases de Datos Ilimitadas`, `Unlimited Databases`},
		{`Cuentas de Correo Ilimitadas`, `Unlimited Email Accounts`},
		{`Certificado SSL Gratis`, `Free SSL Certificate`},
		{`Subdominios Ilimitados`, `Unlimited Subdomains`},
		{`Panel de Control cPanel`, `cPanel Control Panel`},
		{`Softaculous 1-Click`, `Softaculous 1-Click Installer`},

		// FAQs
		{`¿Los planes de Hosting son gestionados?`, `Are the hosting plans fully managed?`},
		{`Sí, todos nuestros planes de hosting compartido están totalmente gestionados por nuestro equipo técnico 24/7.`, `Yes, all our shared hosting plans are fully managed 24/7 by our expert technical support team.`},
		{`¿Es necesario comprar un dominio al adquirir un plan?`, `Do I need to purchase a domain when signing up?`},
		{`No es obligatorio. Puedes registrar un nuevo dominio con nosotros, transferir uno existente o utilizar un dominio que ya tengas apuntando los DNS.`, `No. You can register a new domain with us, transfer an existing one, or simply point your current domain via DNS.`},
		{`¿Cuanto tiempo tarda en activarse mi cuenta?`, `How long does it take for my account to activate?`},
		{`La activación es inmediata y automática una vez confirmado el pago del servicio.`, `Activation is instant and fully automated immediately after payment confirmation.`},
		{`¿Puedo elegir un plan y luego cambiarlo por otro?`, `Can I upgrade or change my plan later?`},
		{`Sí, puedes actualizar tu plan en cualquier momento desde tu Área de Clientes pagando solo la diferencia prorrateada.`, `Yes, you can upgrade your plan at any time from your Client Area, paying only the prorated difference.`},
		{`¿Qué tipo de base de datos están incluidas?`, `What database engines are supported?`},
		{`Incluimos bases de datos MySQL y MariaDB ilimitadas con soporte phpMyAdmin y alta velocidad NVMe.`, `We provide unlimited MySQL and MariaDB databases powered by phpMyAdmin and ultra-fast NVMe storage.`},
		{`¿Cuál es la garantía de disponibilidad?`, `What is the service uptime guarantee?`},
		{`Garantizamos un 99.9% de disponibilidad mensual en toda nuestra infraestructura de servidores de hosting.`, `We guarantee 99.9% monthly uptime across our entire hosting server infrastructure.`},
		{`¿Qué contenido puedo alojar?`, `What kind of content can I host?`},
		{`Puedes alojar cualquier sitio web o aplicación legal (blogs, tiendas online, portales corporativos, APIs) que cumpla con nuestros Términos de Servicio.`, `You can host any legal website or web app (blogs, eCommerce, corporate portals, APIs) complying with our Terms of Service.`},
		{`¿Ofrecemos conexión SSH?`, `Do you provide SSH terminal access?`},
		{`Sí, el acceso SSH enjaulado (Chrooted SSH) está disponible a solicitud mediante ticket de soporte.`, `Yes, caged SSH access (Chrooted SSH) is available upon request via support ticket.`},
		{`¿Ofrecemos rubygems, Python y node.js?`, `Do you support RubyGems, Python, and Node.js?`},
		{`Sí, nuestro panel cPanel incluye selector de versiones de PHP, Node.js y Python a través de CloudLinux.`, `Yes, our cPanel includes multiple version selectors for PHP, Node.js, and Python powered by CloudLinux.`},
		{`¿Se permite el envió de Spam?`, `Is sending SPAM allowed?`},
		{`No. Mantenemos una política de tolerancia cero frente al SPAM o correo no solicitado para proteger la reputación de las IPs.`, `No. We maintain a strict zero-tolerance policy against SPAM to protect IP reputation and delivery rates.`},
		{`¿Puedo realizar copias de seguridad?`, `Can I create and download backups?`},
		{`Sí, además de nuestras copias de seguridad diarias automatizadas, puedes generar y descargar respaldos completos desde cPanel en cualquier momento.`, `Yes. In addition to our automated daily backups, you can generate and download full backups from cPanel at any time.`},
		{`¿Cual es nuestro nivel de seguridad?`, `What security measures are implemented?`},
		{`Contamos con protección perimetral BitNinja, aislamiento CloudLinux CageFS, firewall WAF, escaneo antimalware en tiempo real y SSL gratuito.`, `We employ BitNinja perimeter shielding, CloudLinux CageFS isolation, WAF firewalls, real-time antimalware, and free SSL.`},
	}
	return applyReplacements(c, pairs)
}

func translateHostingExclusivo(c string) string {
	pairs := [][2]string{
		{`<title>Hosting Exclusivo y Empresarial Dedicado | NETZ</title>`, `<title>Dedicated Enterprise Web Hosting | NETZ</title>`},
		{`<title>Hosting Exclusivo de Alto Rendimiento | NETZ</title>`, `<title>High-Performance Dedicated Hosting | NETZ</title>`},
		{`content="Servicio de hosting exclusivo con recursos dedicados, discos NVMe y aislamiento total para proyectos de alto tráfico."`, `content="Enterprise dedicated web hosting with isolated resources, pure NVMe storage, and maximum speed for high-traffic operations."`},
		{`content="Web Hosting con recursos de CPU y memoria RAM 100% exclusivos para proyectos de alto rendimiento. Máxima velocidad y aislamiento total."`, `content="Web Hosting featuring 100% dedicated CPU and RAM resources for mission-critical projects. Unmatched speed and full isolation."`},

		{`Mantenga El Control Total De Su Entorno <br>Con Nuestro Alojamiento Web`, `Maintain Full Control Of Your Environment <br>With Dedicated Power`},
		{`Mantenga El Control Total De Su Entorno Con Nuestro Alojamiento Web`, `Maintain Full Control Of Your Environment With Dedicated Power`},
		{`HOSTING EMPRESARIAL`, `ENTERPRISE DEDICATED HOSTING`},
		{`Alojamiento Empresarial`, `Enterprise Dedicated Hosting`},
		{`Potente alojamiento cPanel diseñado para sitios web o comercio electrónico más grandes y exigentes`, `High-performance cPanel hosting engineered for demanding eCommerce and high-traffic operations.`},
		{`Alojamiento compatible con PCI diseñado para proporcionar un rendimiento líder en la industria con grandes límites de recursos en unidades NVMe puras.`, `PCI-compliant hosting infrastructure engineered for enterprise workloads with high resource caps on pure NVMe storage.`},
		{`Nuestro alojamiento empresarial es ideal para empresas en crecimiento, blogs o sitios web de comercio electrónico para un rendimiento líder en la industria.`, `Our enterprise hosting is designed for scaling organizations, high-volume blogs, and high-traffic online stores.`},
		{`Rendimiento garantizado con unidades NVMe`, `Guaranteed performance with ultra-fast NVMe storage`},
		{`Aislamiento total de recursos`, `Complete physical & logical resource isolation`},
	}
	return applyReplacements(c, pairs)
}

func translateAudioStreaming(c string) string {
	pairs := [][2]string{
		{`<title>Radio Streaming SSL con AutoDJ SonicPanel | NETZ</title>`, `<title>HD Radio Streaming with AutoDJ & SonicPanel | NETZ</title>`},
		{`<title>Radio Streaming Profesional | NETZ</title>`, `<title>Professional Online Radio Streaming | NETZ</title>`},
		{`content="Servicio de streaming de audio en vivo con SonicPanel, AutoDJ, tráfico ilimitado y reproducción compatible con Android e iOS."`, `content="Live HD audio streaming with SonicPanel, cloud AutoDJ, unlimited bandwidth, and HTML5 players for Android & iOS."`},

		{`<span>¿Necesitas Una Forma De Realizar Streaming?</span>AUDIO`, `<span>Need A Professional Streaming Platform?</span>AUDIO`},
		{`<span>¿Necesitas Una Forma De Realizar Streaming?</span>`, `<span>Need A Professional Streaming Platform?</span>`},
		{`Full Oyentes Ilimitados`, `Unlimited Simultaneous Listeners`},
		{`En NETZ te ofrecemos una nueva solución para tu radio online.`, `At NETZ, we provide the ultimate high-fidelity streaming solution for your online radio station.`},
		{`Herramientas Simples Y Potentes`, `Simple Yet Powerful Tools`},

		// Planes
		{`Stream Mini <span>Plan Inicial</span>`, `Stream Mini <span>Starter Plan</span>`},
		{`Stream Junior <span>Plan Especial</span>`, `Stream Junior <span>Special Plan</span>`},
		{`Stream Junior II <span>Plan Premium</span>`, `Stream Junior II <span>Premium Plan</span>`},
		{`Cantidad de Oyentes en Simultáneo`, `Simultaneous Listeners`},
		{`Calidad de audio`, `Audio Bitrate Quality`},
		{`Transmisión con <b>Certificado SSL</b>`, `Broadcast with <b>SSL Certificate</b>`},
		{`AutoDj <b>2 Gb Almacenamiento</b>`, `AutoDJ <b>2 GB Storage</b>`},
		{`AutoDj <b>10 Gb Almacenamiento</b>`, `AutoDJ <b>10 GB Storage</b>`},
		{`AutoDj <b>100 Gb Almacenamiento</b>`, `AutoDJ <b>100 GB Storage</b>`},
		{`Reproductor <b>HTML5</b>`, `Player <b>HTML5 HD</b>`},
		{`Soporte <b>Incluye</b>`, `Support <b>Included 24/7</b>`},

		// Respuestas FAQ
		{`¿Que es Radio Streaming?`, `What is Radio Streaming?`},
		{`Radio Streaming es un servicio para emisiones de audio en directo a través de Internet. NETZ distribuye la señal de streaming y tus oyentes conectándose a internet, pueden escuchar la señal de audio en directo a través de una página web en la cual se incluya el reproductor de audio o directamente desde Windows Media Player, Winamp o cualquier otro reproductor de medios.`, `Radio Streaming is a digital broadcasting service that delivers live audio over the Internet. NETZ distributes your audio signal worldwide so listeners can tune in via web players, mobile apps, or desktop media players.`},
		{`¿Los planes incluyen AutoDj?`, `Do plans include cloud AutoDJ?`},
		{`Sí. A partir del plan Junior incluye la función de AutoDJ y PlayList.`, `Yes. Starting from the Junior plan, automated 24/7 cloud AutoDJ and custom playlist scheduling are fully included.`},
		{`¿Los planes incluyen transferencia ilimitada?`, `Do plans include unmetered bandwidth?`},
		{`Sí. Todos los planes incluyen transferencia ilimitada.`, `Yes. All radio streaming plans feature 100% unmetered bandwidth without data caps.`},
		{`¿EL streaming se realiza bajo secure Streaming (https)?`, `Is the stream broadcasted over secure HTTPS (SSL)?`},
		{`Sí. Todos los planes incluyen la transmisión bajo secure streaming (https). Solamente tienes que indicarnos los datos de tu streaming para activar el protocolo SSL.`, `Yes. All streaming plans broadcast via secure HTTPS (SSL), ensuring total compatibility with modern browsers and mobile platforms.`},
		{`¿Cuanto tiempo tarda en activarse mi cuenta?`, `How long does it take for my account to activate?`},
		{`La activación de los planes se realiza una vez recibamos el pago por el servicio contratado.`, `Activation is instantaneous and automated as soon as your payment is confirmed.`},
		{`¿Puedo elegir un plan y luego cambiarlo por otro?`, `Can I upgrade my streaming plan later?`},
		{`Sí. Puedes cambiar de plan en cualquier momento.`, `Yes. You can upgrade your listener capacity or AutoDJ storage at any time from your Client Area.`},
		{`¿Qué sistemas operativos son compatibles con Radio Streaming?`, `What operating systems and media players are supported?`},
		{`Todos nuestros planes de radio, así como los reproductores HD HTML5 son compatibles con los sistemas operativos Windows, MacOS y Linux. Para smartphones y tabletas, la compatibilidad es total con Android e iOS.`, `Our radio streams and HTML5 HD players work seamlessly across Windows, macOS, Linux, iOS, and Android mobile devices.`},
		{`¿Cuál es la garantía de disponibilidad?`, `What is the uptime and reliability guarantee?`},
		{`Nuestra garantía de disponibilidad del servicio es del 99%.`, `We guarantee 99.9% service uptime backed by our redundant low-latency network.`},
		{`¿Existe una política de devolución de dinero?`, `Do you offer a refund policy for streaming?`},
		{`No hay devolución alguna sobre los servicios de Radio streaming.`, `Radio streaming setups involve immediate dedicated resource reservation, so fees are non-refundable.`},
		{`¿Puedo cancelar mi servicio?`, `Can I cancel my service at any time?`},
		{`Sí. Puedes cancelar el servicio en cualquier momento desde el Área de Clientes sin ningún tipo de problema.`, `Yes. You can cancel your subscription at any time directly from your Client Area without penalties.`},
	}
	return applyReplacements(c, pairs)
}

func translateVideoStreaming(c string) string {
	pairs := [][2]string{
		{`<title>Video Streaming en Vivo HD con SSL | NETZ</title>`, `<title>Live HD Video Streaming with SSL | NETZ</title>`},
		{`<title>Video Streaming en Vivo | NETZ</title>`, `<title>Live Video Streaming Platform | NETZ</title>`},
		{`content="Transmisión de video streaming en vivo con calidad HD, soporte multidispositivo y reproductores HTML5 compatibles con SSL."`, `content="Live HD video streaming with multi-device support, HTML5 players, low latency, and secure SSL encryption."`},
		{`content="Transmisión de video en vivo HD 720p con SSL, reproductores HTML5 y soporte multiplataforma."`, `content="Live HD 720p video streaming with SSL, HTML5 players, and cross-platform mobile compatibility."`},

		{`<span>¿Necesitas Una Forma De Realizar Streaming?</span>VIDEO STREAMING`, `<span>Need A Professional Streaming Platform?</span>LIVE VIDEO STREAMING`},
		{`Selecciona el plan de streaming tv y comienza a transmitir.`, `Select your TV streaming plan and start broadcasting live today.`},
		{`Streaming TV Basico`, `Basic TV Streaming`},
		{`Streaming TV Estándar`, `Standard TV Streaming`},
		{`Streaming TV Avanzado`, `Advanced TV Streaming`},
		{`Streaming TV Premium`, `Premium TV Streaming`},

		{`<b>50 Espectadores</b>`, `<b>50 Viewers</b>`},
		{`<b>100 Espectadores</b>`, `<b>100 Viewers</b>`},
		{`<b>500 Espectadores</b>`, `<b>500 Viewers</b>`},
		{`<b>1000 Espectadores</b>`, `<b>1,000 Viewers</b>`},
		{`Bitrate Video hasta 720 Kbps`, `Video Bitrate up to 720 Kbps`},
		{`Bitrate Video hasta 1280 Kbps`, `Video Bitrate up to 1280 Kbps`},
		{`Codec video H.264`, `H.264 Video Codec`},
		{`Calidad máxima. 480P`, `Max Resolution 480p SD`},
		{`Calidad máxima. 720P`, `Max Resolution 720p HD`},
		{`Formato MP4`, `MP4 Format Support`},
		{`Players HTML5`, `HTML5 Responsive Players`},
		{`Streaming SSLL`, `SSL Encrypted Streaming`},
		{`Streaming SSL`, `SSL Encrypted Streaming`},
		{`Soporte para moviles`, `Mobile & Tablet Support`},
		{`Wowza Media Server`, `Wowza Media Engine`},
		{`Panel MediaCP (Cast Control)`, `MediaCP Control Panel`},
		{`Estadisticas/GeoMap`, `Real-Time GeoMap & Stats`},
		{`Trafico ilimitado`, `Unlimited Bandwidth`},
		{`Compatible con Smartphone`, `Smartphone Compatible`},
		{`Transmite tus eventos en vivo con la máxima calidad y sin interrupciones`, `Broadcast live events with maximum HD quality, low latency, and zero buffering.`},
		{`Calidad máxima 720p`, `High-Definition 720p Video Quality`},
		{`Streaming seguro bajo protocolo HTTPS (SSL)`, `100% Secure HTTPS (SSL) Protocol`},
	}
	return applyReplacements(c, pairs)
}

func translateResellerCpanel(c string) string {
	pairs := [][2]string{
		{`<title>Hosting Reseller cPanel & WHM Multicuenta | NETZ</title>`, `<title>cPanel & WHM Reseller Hosting Multi-Account | NETZ</title>`},
		{`<title>Revendedor de Hosting cPanel & WHM | NETZ</title>`, `<title>cPanel & WHM Reseller Hosting | NETZ</title>`},
		{`content="Inicia tu propio negocio de hosting con nuestra plataforma de revendedor cPanel & WHM de alta velocidad y recursos independientes."`, `content="Launch your web hosting business with our high-speed cPanel & WHM reseller platform with isolated resources."`},
		{`content="Inicia o expande tu negocio de hosting con planes Reseller cPanel y WHM. Servidores ultrarrápidos NVMe, cuentas independientes y marca blanca."`, `content="Launch or grow your hosting company with cPanel & WHM Reseller plans. Pure NVMe storage, white-label branding, and 24/7 care."`},

		{`Alojamiento de<br> revendedor`, `Reseller<br> Web Hosting`},
		{`Alojamiento de revendedor`, `Reseller Web Hosting`},
		{`Desarrollado por cPanel`, `Powered by cPanel & WHM`},
		{`Nuestro alojamiento para revendedores ha sido diseñado desde cero para proporcionar un rendimiento constante y de vanguardia.`, `Our reseller hosting platform is engineered from the ground up to deliver consistent, enterprise-grade speed and reliability.`},
		{`Inicie su negocio de alojamiento hoy en la plataforma de alojamiento para revendedores más poderosa del mundo.`, `Start your hosting company today on the world's most powerful, developer-trusted reseller platform.`},
		{`Ver DirectAdmin para revendedor`, `View DirectAdmin Reseller Plans`},
		{`¡Disponemos del plan ideal para iniciar tu negocio!`, `We have the perfect plan to kickstart your hosting business!`},
		{`Alojamiento de revendedor potente, rápido y seguro`, `High-performance, secure, and lightning-fast reseller hosting`},

		{`Alojamiento de revendedor, ideal para alojar varios sitios o blogs.`, `Reseller hosting, perfect for hosting multiple client websites or blogs.`},
		{`Alojamiento de revendedor rápido, confiable y seguro impulsado por cPanel.`, `Fast, reliable, and secure reseller web hosting powered by cPanel.`},
		{`cuentas de cPanel`, `cPanel Accounts`},
		{`almacenamiento SSD`, `SSD Storage`},
		{`Almacenamiento SSD <br>ilimitado`, `Unlimited SSD <br>Storage`},
		{`Almacenamiento SSD ilimitado`, `Unlimited SSD Storage`},
		{`2 núcleos de CPU / 2 GB de RAM`, `2 CPU Cores / 2 GB RAM`},
		{`(por cuenta de cPanel)`, `(per cPanel account)`},
		{`Bolt-Cache incluido`, `Bolt-Cache Included`},
		{`Litespeed Enterprise`, `LiteSpeed Enterprise Web Server`},
		{`Suite de correo CrossBox`, `CrossBox Modern Webmail Suite`},
		{`Ancho de banda ilimitado`, `Unlimited Bandwidth`},
		{`Servidores de nombres personalizados gratuitos`, `Free Private Name Servers (DNS)`},
		{`Paquetes ilimitados`, `Unlimited Hosting Packages`},
		{`Gestión centralizada`, `Centralized WHM Management`},
		{`Protección DDoS`, `DDoS Shield Protection`},
		{`Soporte técnico 24/7`, `24/7 Technical Support`},
		{`(Certificado SSL Gratis<br>en todas las cuentas)`, `(Free SSL Certificate<br>on all created accounts)`},

		{`PANEL DE CONTROL LÍDER EN LA INDUSTRIA Y GESTIÓN DE DISTRIBUIDORES`, `INDUSTRY-LEADING CONTROL PANEL & WHM RESELLER MANAGEMENT`},
		{`Tu marca`, `100% White-Label (Your Brand)`},
		{`Migración`, `Free Client Migration`},
		{`¿Cómo funciona?`, `How Does Reseller Hosting Work?`},
		{`Negocios de bajo costo`, `Low Startup Cost`},
		{`Ingresos fijos`, `Predictable Recurring Revenue`},
		{`Automatización`, `Automated WHMCS & cPanel Sync`},
		{`<span>Nosotros nos encargamos de...</span>`, `<span>We take care of...</span>`},
		{`Gestionar la plataforma`, `Maintaining server hardware, network uptime, and 24/7 reliability`},
		{`Seguridad del servidor`, `BitNinja security, WAF firewalls, automated backups, and DDoS mitigation`},
		{`Aplicaciones y software`, `Constant software updates, PHP security patches, and cPanel licenses`},
		{`<span>Tú te encargas de...</span>`, `<span>You take care of...</span>`},
		{`Apoyando a sus clientes`, `Setting your own prices, packaging plans, and servicing clients`},
		{`Gestionar su negocio`, `Scaling your brand and growing your business profits`},
		{`Configurar cuentas de cliente`, `Creating customer cPanel accounts with a single click in WHM`},
	}
	return applyReplacements(c, pairs)
}

func translateResellerDirectAdmin(c string) string {
	pairs := [][2]string{
		{`<title>Hosting Reseller DirectAdmin Económico | NETZ</title>`, `<title>Cost-Effective DirectAdmin Reseller Hosting | NETZ</title>`},
		{`<title>Revendedor de Hosting DirectAdmin | NETZ</title>`, `<title>DirectAdmin Reseller Hosting | NETZ</title>`},
		{`content="Planes Reseller de alto rendimiento con panel DirectAdmin, cuentas ilimitadas, almacenamiento NVMe y el mejor precio del mercado."`, `content="High-performance DirectAdmin Reseller plans with unlimited accounts, NVMe storage, and competitive pricing."`},
		{`content="Servicio de revendedor económico y potente con panel DirectAdmin, soporte 24/7 y activación instantánea."`, `content="Affordable, high-speed reseller hosting powered by DirectAdmin, 24/7 support, and instant activation."`},

		{`Alojamiento de revendedor`, `Reseller Web Hosting`},
		{`Desarrollado por DirectAdmin`, `Powered by DirectAdmin`},
		{`Ver cPanel para revendedor`, `View cPanel Reseller Plans`},
		{`cuentas de DirectAdmin`, `DirectAdmin Accounts`},
	}
	return applyReplacements(c, pairs)
}

func translateAbout(c string) string {
	pairs := [][2]string{
		{`<title>Sobre Nosotros | Infraestructura y Equipo NETZ</title>`, `<title>About Us | Infrastructure & Engineering Team | NETZ</title>`},
		{`<title>Sobre Nosotros | NETZ</title>`, `<title>About Us | High-Performance Hosting & Infrastructure | NETZ</title>`},
		{`content="Conoce la visión, tecnología y servidores de última generación que hacen de NETZ el proveedor líder en Web Hosting, VPS y Streaming."`, `content="Discover our mission, global cloud infrastructure, and 24/7 support engineering team delivering high-performance hosting solutions."`},

		{`Estamos contigo en <br>cada paso del camino`, `We are with you at <br>every step of the way`},
		{`Estamos contigo en cada paso del camino`, `We are with you at every step of the way`},
		{`Ya sea que esté buscando un plan de alojamiento de sitios web <b>personales</b> o un plan de alojamiento de sitios web <b>comerciales</b>, somos la solución perfecta para usted. Nuestros poderosos servicios de alojamiento de sitios web no solo lo ayudarán a lograr sus objetivos generales de sitios web, sino que también le brindarán la confianza que necesita al saber que está asociado con una plataforma de alojamiento de sitios web <b>confiable</b> y <b>segura</b>.`, `Whether you are launching a personal blog or scaling an enterprise eCommerce platform, NETZ provides the perfect infrastructure. Our high-performance hosting services deliver speed, security, and the peace of mind that comes with enterprise-grade reliability.`},
		{`Empieza con nosotros ahora`, `Get Started With Us Today`},

		{`Encontrará una gran variedad de dominios, al mejor precio del mercado contratando nuestros servicios de hosting, en el caso que no encuentre en nuestra lista, <br>¡Ponte en contacto con nosotros lo gestionamos!`, `Explore a wide catalog of top-level domains at competitive rates. If you need a specialized TLD, contact us and our team will register it for you promptly!`},
		{`Al confiar en nosotros con sus necesidades de negocio, le prometemos un 99.9% de tiempo de actividad en cualquier servicio que ofrecemos, fuera de cualquier mantenimiento estándar que podamos proporcionar.`, `By entrusting us with your digital business, we guarantee 99.9% network and service uptime across all our hosting solutions.`},
		{`Ofrecemos servicios exclusivos de hospedaje web con recursos mejorados ideales para negocio que requieran un tráfico más elevado, le prometemos un 99.9% de tiempo de actividad en cualquier servicio que ofrecemos..`, `Dedicated hosting services with isolated CPU and RAM resources, engineered for mission-critical operations and high-traffic portals.`},
		{`Disponemos de servicios de VPS administrado y no administrado (Linux – Windows), Podrá administrar Ud. mismo, <br>Disponibilidad de un 99.9%, fuera de cualquier mantenimiento estándar que podamos proporcionar.`, `High-speed Linux and Windows VPS servers available with full root/RDP control or 24/7 managed administration.`},
		{`Estamos preparados para cualquier desafío, habilitamos el servicio de streaming de Audio y TV con la mejor calidad y alto rendimiento al mejor precio del mercado<br>Disponibilidad de un 99.9%, fuera de cualquier mantenimiento estándar que podamos proporcionar.`, `Ready for any audience size. HD audio and live video streaming with unmetered bandwidth, HTML5 players, and AutoDJ automation.`},
		{`Aumente sus ingresos con nuestro plan para revendedores. <br> Podrá revender nuestros productos de hosting con su propia marca, nos encargamos del mantenimiento del servidor y Ud. de sus clientes. <br> Podrá color sus propios precios a sus servicios.`, `Grow your agency revenue with white-label reseller hosting. Package custom plans, set your profit margins, and manage accounts with WHM or DirectAdmin.`},

		{`Nuestros clientes<br>son lo primero`, `Our Customers<br>Come First`},
		{`Nuestros clientes son lo primero`, `Our Customers Come First`},
		{`Fundada en 2019, NETZ comenzó a cambiar el rostro de la industria del alojamiento desde el principio con un conjunto de nuevos estándares: ofrecer <b>servicios de alojamiento de calidad a un precio razonable.</b> Nuestro personal dedicado asegura que nuestros clientes se sientan respetados, satisfechos y cuidados en todo momento.<br>Aunque nuestro hardware de última generación y nuestro alojamiento confiable no tienen comparación, es realmente nuestro extraordinario servicio al cliente lo que nos distingue en un mar de competidores.<br> Prometemos prepararlo para el éxito con el soporte y el alojamiento líderes en la industria.<br> <b>Puedes confiar en nosotros!</b>`, `Founded in 2019, NETZ set out to elevate hosting industry standards: delivering <b>enterprise-grade performance at transparent, accessible pricing.</b> Our dedicated engineering team ensures every client receives attentive, 24/7 technical assistance.<br>While our pure NVMe hardware and multi-gigabit network are second to none, our genuine commitment to client success is what truly sets us apart.<br><b>You can count on us!</b>`},
		{`Información importante`, `Key Advantages`},
		{`Copias de seguridad diarias automáticas GRATIS. También disponemos de recursos exclusivos para cada cuenta de hosting ya cPanel o DirectAdmin, es posible duplicar estos recursos con un pago adicional.`, `Free automated daily backups. Every cPanel and DirectAdmin account operates with dedicated memory and compute boundaries, expandable on demand.`},
	}
	return applyReplacements(c, pairs)
}

func translateContact(c string) string {
	pairs := [][2]string{
		{`<title>Contacto y Soporte Técnico 24/7 | NETZ</title>`, `<title>Contact Us & 24/7 Technical Support | NETZ</title>`},
		{`<title>Contacto y Soporte | NETZ</title>`, `<title>Contact & Support | NETZ</title>`},
		{`content="Comunícate con nuestro equipo de atención y soporte técnico internacional. Estamos disponibles 24/7 vía WhatsApp, correo y ticket de soporte."`, `content="Get in touch with our international technical support team. Available 24/7 via WhatsApp, email, and live ticket system."`},
		{`¿Tienes alguna pregunta?`, `Have A Question?`},
		{`Estamos aquí para ayudarte 24 horas al día, 7 días a la semana.`, `We are here to assist you 24 hours a day, 7 days a week.`},
		{`Envíanos un mensaje`, `Send Us A Message`},
		{`Nombre Completo`, `Full Name`},
		{`Correo Electrónico`, `Email Address`},
		{`Asunto`, `Subject`},
		{`Mensaje`, `Message`},
		{`Enviar Mensaje`, `Send Message`},
		{`Canales de Atención Directa`, `Direct Support Channels`},
		{`Ventas y Consultas Generales`, `Sales & General Inquiries`},
		{`Soporte Técnico y Emergencias`, `Technical Support & Operations`},
		{`Atención Inmediata por WhatsApp`, `Instant WhatsApp Care`},
	}
	return applyReplacements(c, pairs)
}

func translateBuscarDominios(c string) string {
	pairs := [][2]string{
		{`<title>Comprobador y Registro de Dominios Web | NETZ</title>`, `<title>Domain Name Search & Instant Registration | NETZ</title>`},
		{`content="Encuentra y registra tu nombre de dominio web (.com, .net, .org, .online, .app y más) al mejor precio global con activación instantánea."`, `content="Search and register your domain name (.com, .net, .org, .online, .app, and more) with instant global activation."`},
		{`<span>ENCUENTRA TU NOMBRE DE DOMINIO PERFECTO..</span>REGISTRO DE DOMINIOS`, `<span>FIND YOUR PERFECT DOMAIN NAME..</span>DOMAIN REGISTRATION`},
		{`Al precio más accesible del mercado`, `At competitive global pricing`},
		{`<h5>Activación instantánea</h5>`, `<h5>Instant Activation</h5>`},
		{`<p>La activación es realizada en cuestión de minutos</p>`, `<p>Your domain is provisioned within minutes of payment.</p>`},
		{`<h5>Personalización</h5>`, `<h5>Full Customization</h5>`},
		{`<p>Personalice su dominio con la extensión de su preferencia</p>`, `<p>Choose the extension that best matches your digital brand.</p>`},
		{`<h5>Renovación</h5>`, `<h5>Hassle-Free Renewals</h5>`},
		{`<p>Renovación automática de su dominio</p>`, `<p>Automated renewals keep your online brand continuously protected.</p>`},
		{`Dominios de activación manual`, `Country-Code & Manual TLDs`},
		{`Dominios de activación automatica`, `Instant Automated Activation TLDs`},
		{`<span>Consultar disponibilidad</span>`, `<span>Check Availability</span>`},
		{`<span>Activación en cuestion de minutos</span>`, `<span>Active within minutes</span>`},
		{`<span>Dominio</span>`, `<span>Domain</span>`},
		{`<span>Renovación</span>`, `<span>Renewal</span>`},
		{`<span>Acciones</span>`, `<span>Actions</span>`},
	}
	return applyReplacements(c, pairs)
}

func translateCentroDeAyuda(c string) string {
	pairs := [][2]string{
		{`<title>Centro de Ayuda y Base de Conocimientos | NETZ</title>`, `<title>Help Center & Knowledgebase | NETZ</title>`},
		{`<title>Centro de Ayuda y Preguntas Frecuentes | NETZ</title>`, `<title>Help Center & Frequently Asked Questions | NETZ</title>`},
		{`content="Guías paso a paso, tutoriales de configuración y preguntas frecuentes sobre Web Hosting, Dominios, Servidores VPS y Streaming en NETZ."`, `content="Step-by-step guides, tutorials, and frequently asked questions about Web Hosting, Domains, VPS Servers, and Streaming at NETZ."`},
		{`¿Cómo podemos ayudarte hoy?`, `How Can We Help You Today?`},
		{`Escribe tu duda o busca por categoría`, `Type your question or browse by category below`},
		{`Centro de Ayuda`, `Help Center`},
		{`Base de Conocimientos`, `Knowledgebase`},
		{`Preguntas Frecuentes`, `Frequently Asked Questions`},
	}
	return applyReplacements(c, pairs)
}

func translateTerminos(c string) string {
	pairs := [][2]string{
		{`<title>Términos del Servicio y Política de Reembolso | NETZ</title>`, `<title>Terms of Service & Refund Policy | NETZ</title>`},
		{`<title>Términos del Servicio | NETZ</title>`, `<title>Terms of Service | NETZ</title>`},
		{`content="Términos, condiciones de contratación, activación de servicios y política de reembolsos transparente para clientes de NETZ a nivel global."`, `content="Terms, service conditions, provisioning policies, and transparent refund terms for NETZ clients worldwide."`},

		{`1. PROCESO DE CONTRATACIÓN Y COMPRA`, `1. ORDERING PROCESS AND SERVICE AGREEMENT`},
		{`La contratación de los servicios de NETZ se realiza en forma directa y transparente a través de nuestra plataforma web:`, `Ordering NETZ services is conducted directly, transparently, and securely through our digital platform:`},
		{`Selección del Plan:`, `Plan Selection:`},
		{`El cliente selecciona el servicio deseado (Hosting Compartido, Hosting Exclusivo, Servidores VPS Linux o Windows, Streaming de Radio/Video, Revendedor o Registro de Dominio) y el ciclo de facturación preferido.`, `The customer chooses the desired plan (Shared Hosting, Dedicated Hosting, Linux/Windows VPS, Streaming, Reseller, or Domain) and preferred billing cycle.`},
		{`Registro de Cuenta:`, `Account Registration:`},
		{`El cliente completa sus datos de contacto y facturación en el portal de clientes`, `The customer enters verified billing and contact details in the client portal`},
		{`declarando que la información suministrada es veraz y actualizada.`, `confirming that all submitted information is accurate and up to date.`},
		{`Pago Seguro:`, `Secure Payment:`},
		{`El cliente efectúa el abono a través de los métodos de pago electrónicos habilitados en la plataforma (incluyendo pasarelas autorizadas como dLocal Go, tarjetas de crédito/débito internacionales y locales, transferencias y billeteras digitales).`, `Payment is completed through authorized gateways, international/local credit and debit cards, wire transfers, or digital wallets.`},
		{`Confirmación de Orden:`, `Order Confirmation:`},
		{`Una vez procesado el pago, el sistema genera de forma automática la factura electrónica y envía los datos de acceso y bienvenida al correo electrónico del titular.`, `Once payment clears, electronic invoices and provisioning credentials are automatically emailed to the account holder.`},

		{`2. TIEMPOS Y POLÍTICA DE ACTIVACIÓN DE SERVICIOS`, `2. SERVICE PROVISIONING AND ACTIVATION POLICY`},
		{`NETZ implementa procesos de provisión según la naturaleza del servicio contratado:`, `NETZ utilizes automated deployment routines tailored to the nature of each service:`},
		{`Servicios Estándar (Activación Instantánea):`, `Standard Services (Instant Provisioning):`},
		{`Los planes estándar de Web Hosting (Ilimitado y Exclusivo), Servidores VPS preconfigurados y cuentas de Radio / Video Streaming cuentan con aprovisionamiento y activación inmediata una vez confirmado el pago.`, `Standard Web Hosting, preconfigured VPS servers, and Radio/Video streaming accounts are provisioned immediately upon verified payment.`},
		{`Servicios Personalizados o a Medida:`, `Custom & Enterprise Configurations:`},
		{`Aquellos requerimientos especiales, configuraciones a medida de servidores dedicados, arquitecturas complejas de red o migraciones avanzadas de datos se coordinan directamente con el equipo de ingeniería y se entregan en un plazo de <b>24 a 48 horas hábiles</b> tras la validación y acuerdo técnico con el cliente.`, `Custom server architecture, high-availability clusters, and advanced data migrations are coordinated with engineering and delivered within <b>24 to 48 business hours</b>.`},

		{`3. GARANTÍA DE SATISFACCIÓN, POLÍTICA DE DEVOLUCIONES Y REEMBOLSOS`, `3. SATISFACTION GUARANTEE AND REFUND POLICY`},
		{`En NETZ respaldamos la calidad de nuestra infraestructura y el compromiso con nuestros clientes:`, `At NETZ, we stand firmly behind our global infrastructure and customer satisfaction:`},
		{`Garantía de 30 Días para Web Hosting:`, `30-Day Money-Back Guarantee for Web Hosting:`},
		{`Ofrecemos una garantía de satisfacción de <b>30 días corridos</b> para todos los planes de Web Hosting compartido (Hosting Ilimitado y Hosting Exclusivo). Si el cliente no queda satisfecho con el rendimiento del servicio dentro de este período, podrá solicitar el reembolso total del importe abonado por dicho concepto.`, `We provide an unconditional <b>30-day money-back guarantee</b> for all shared hosting plans. If you are not satisfied with performance, you may request a full refund of hosting fees.`},
		{`Plazo y Modalidad de Procesamiento:`, `Refund Processing Window:`},
		{`Las solicitudes de reembolso aprobadas se procesan en un plazo de <b>3 a 5 días hábiles</b> a través del mismo método de pago utilizado originalmente por el cliente.`, `Approved refunds are processed within <b>3 to 5 business days</b> through the original payment method.`},
		{`Excepciones y Servicios No Reembolsables:`, `Non-Refundable Services:`},
		{`No aplican para reembolso los importes correspondientes a registros, renovaciones o transferencias de nombres de dominio (debido a que su gestión y arancel ante registradores internacionales ICANN y NIC-PY es irrevocable e intransferible una vez emitido), ni las licencias de software de terceros emitidas expresamente a nombre del cliente (cPanel, CloudLinux, LiteSpeed, Softaculous, etc.).`, `Domain registration, renewal, and transfer fees are non-refundable once registered with ICANN/registries. Third-party licenses (cPanel, LiteSpeed, CloudLinux) are also strictly non-refundable.`},

		{`4. CANCELACIÓN VOLUNTARIA DE SERVICIOS`, `4. VOLUNTARY SERVICE CANCELLATION`},
		{`El cliente tiene total libertad para solicitar la cancelación voluntaria de cualquiera de sus servicios en cualquier momento, gestionándola de forma autónoma desde su área de clientes (<a href="https://client.netz.com.py" target="_blank">client.netz.com.py</a>) o mediante ticket de soporte. No existen contratos de permanencia forzosa ni penalizaciones por baja anticipada.`, `Clients may cancel any service at any time directly through the Client Area (<a href="https://client.netz.com.py" target="_blank">client.netz.com.py</a>) or by submitting a support ticket. There are no lock-in contracts or early termination fees.`},

		{`5. POLÍTICA DE USO ACEPTABLE Y CONTENIDOS`, `5. ACCEPTABLE USE POLICY (AUP) AND CONTENT STANDARDS`},
		{`Todos los servicios provistos por <b>NETZ</b> deben utilizarse exclusivamente para fines lícitos en concordancia con las leyes de la República del Paraguay y tratados internacionales.`, `All services provided by <b>NETZ</b> must be used exclusively for lawful purposes in accordance with international treaties and applicable telecommunications regulations.`},
		{`Queda terminantemente prohibido alojar o transmitir:`, `The following activities and contents are strictly prohibited:`},
		{`Contenido que infrinja la <b>Ley N° 1328/1998 de Derecho de Autor</b> (piratería, software ilegal, copias no autorizadas).`, `Unauthorized distribution of copyrighted materials, intellectual property infringement, or pirated software.`},
		{`Material de pornografía o explotación sexual infantil, tipificado y sancionado severamente por la <b>Ley N° 5653/2016 y el Código Penal Paraguayo</b> (cancelación inmediata y denuncia penal).`, `Child sexual abuse material (CSAM) or any form of exploitation (results in immediate account termination and reporting to international law enforcement).`},
		{`Actividades tipificadas en la <b>Ley N° 4439/2011 de Delitos Informáticos</b>: phishing, malware, ransomware, botnets, scripts de ataque o denegación de servicio (DDoS).`, `Cybercrime activities: phishing pages, malware distribution, botnets, port scanning, ransomware, and denial-of-service (DDoS) scripts.`},
		{`Envío masivo de correo no solicitado (SPAM) o listas de distribución no verificadas.`, `Unsolicited bulk email (SPAM), unverified email scraping lists, or email sender abuse.`},

		{`6. NIVELES DE SERVICIO Y SOPORTE TÉCNICO`, `6. SERVICE LEVEL AGREEMENT (SLA) AND TECHNICAL SUPPORT`},
		{`NETZ garantiza asistencia técnica continua 24/7 en incidencias vinculadas con la infraestructura del servidor (conectividad de red, hardware, operatividad de servicios web, bases de datos y correo).`, `NETZ guarantees continuous 24/7 technical assistance for server infrastructure, network routing, hardware health, and core hosting stack availability.`},
		{`Para servidores VPS no administrados, la configuración del sistema operativo y aplicaciones internas corre por cuenta del cliente.`, `For unmanaged VPS servers, the internal configuration of the operating system and third-party software is the sole responsibility of the customer.`},

		{`7. COPIAS DE SEGURIDAD (BACKUPS)`, `7. BACKUPS AND DATA RESPONSIBILITY`},
		{`NETZ efectúa respaldos periódicos para fines de contingencia del centro de datos. No obstante, se recomienda a cada usuario mantener copias de seguridad locales actualizadas de sus sitios web y bases de datos.`, `NETZ performs periodic system backups for datacenter disaster recovery. However, users are strongly advised to maintain offsite backups of their web files and databases.`},

		{`8. JURISDICCIÓN Y LEY APLICABLE`, `8. GOVERNING LAW AND DISPUTE RESOLUTION`},
		{`El presente contrato se rige íntegramente por las leyes de la <b>República del Paraguay</b>. Para cualquier controversia legal, las partes se someten a los <b>Juzgados y Tribunales de la República del Paraguay</b>.`, `This agreement is governed by the laws applicable to international electronic commerce and digital hosting services, submitting any dispute to competent judicial jurisdictions.`},

		{`Última Actualización: 2026`, `Last Updated: 2026`},
		{`Al utilizar nuestros servicios aceptas el <a href="aviso-legal">Aviso Legal</a> - <a href="politica-de-privacidad">Política de Privacidad</a> - <a href="terminos-del-servicio">Términos del Servicio</a>`, `By using our platform you accept the <a href="aviso-legal">Legal Notice</a> - <a href="politica-de-privacidad">Privacy Policy</a> - <a href="terminos-del-servicio">Terms of Service</a>`},
		{`Nuestro equipo de soporte está aquí para usted 24/7`, `Our expert support team is here for you 24/7`},
		{`Abrir un ticket`, `Open a Ticket`},
	}
	return applyReplacements(c, pairs)
}

func translatePrivacidad(c string) string {
	pairs := [][2]string{
		{`<title>Política de Privacidad y Protección de Datos | NETZ</title>`, `<title>Privacy Policy & Data Protection | NETZ</title>`},
		{`<title>Política de Privacidad | NETZ</title>`, `<title>Privacy Policy | NETZ</title>`},
		{`content="Conoce nuestras estrictas políticas de protección de datos, confidencialidad, uso de cookies y seguridad de la información en NETZ."`, `content="Learn about our data protection standards, client confidentiality, cookie policy, and information security at NETZ."`},

		{`1. CONTROLADOR Y RESPONSABLE DEL TRATAMIENTO`, `1. DATA CONTROLLER AND IDENTITY`},
		{`El responsable del tratamiento de los datos personales recogidos a través de este portal, panel de control y formularios de contratación es <b>NETZ</b>.`, `The data controller responsible for the processing of personal data collected through this website, client portal, and order forms is <b>NETZ</b>.`},
		{`Para dudas, consultas o el ejercicio de derechos sobre sus datos personales, puede contactar directamente al correo:`, `For inquiries, updates, or to exercise your data privacy rights, you may contact our privacy desk directly at:`},

		{`2. DATOS RECOGIDOS Y FINALIDAD DEL TRATAMIENTO`, `2. DATA COLLECTED AND PURPOSE OF PROCESSING`},
		{`NETZ recoge exclusivamente los datos estrictamente necesarios para la formalización, facturación y prestación de los servicios contratados:`, `NETZ collects only the data strictly necessary to provision, invoice, and deliver contracted digital services:`},
		{`Datos de Identificación y Contacto:`, `Identification & Contact Details:`},
		{`Nombre, apellido, documento de identidad o RUC/tax ID, dirección física, país, número telefónico y dirección de correo electrónico.`, `Full name, organization name, tax ID, physical address, country, telephone number, and email address.`},
		{`Datos de Facturación y Pago:`, `Billing & Payment Information:`},
		{`Historial de transacciones, facturas emitidas y método de pago utilizado (no almacenamos números completos de tarjetas de crédito; las transacciones son gestionadas de forma segura y encriptada por pasarelas certificadas PCI-DSS).`, `Transaction history, generated invoices, and payment tokens (we never store raw credit card numbers; all processing is secured by PCI-DSS compliant payment gateways).`},
		{`Datos Técnicos de Navegación:`, `Technical Connection Data:`},
		{`Direcciones IP de acceso, registros de conexión y metadatos técnicos empleados para auditoría, prevención de fraudes y seguridad perimetral.`, `IP addresses, connection timestamps, and technical metadata used for fraud prevention, server security, and access audits.`},

		{`3. VERACIDAD Y EXACTITUD DE LOS DATOS`, `3. ACCURACY AND TRUTHFULNESS OF DATA`},
		{`El usuario garantiza que los datos personales facilitados son veraces, exactos y completos, comprometiéndose a mantenerlos actualizados a través de su Área de Clientes. El usuario es el único responsable de cualquier daño o perjuicio derivado de la aportación de datos falsos o inexactos.`, `Users guarantee that submitted personal information is true, accurate, and complete, undertaking to keep details updated in the Client Area. Users remain solely responsible for any damages resulting from inaccurate data.`},

		{`4. DERECHOS DEL TITULAR DE LOS DATOS`, `4. USER DATA RIGHTS`},
		{`En conformidad con las normativas internacionales de protección de datos personales, el usuario tiene derecho a solicitar en cualquier momento:`, `In accordance with international data privacy principles (including GDPR benchmarks), users may at any time request:`},
		{`Acceso:`, `Access:`},
		{`Conocer qué datos personales suyos están siendo tratados por NETZ.`, `Know what personal data is being held and processed by NETZ.`},
		{`Rectificación:`, `Rectification:`},
		{`Modificar o actualizar datos que resulten inexactos o incompletos.`, `Modify or update any inaccurate or outdated information.`},
		{`Cancelación o Supresión:`, `Erasure & Deletion:`},
		{`Solicitar el borrado de sus datos cuando ya no sean necesarios para la finalidad con la que fueron recabados y no exista obligación legal de conservarlos.`, `Request deletion of personal data when no longer needed for service delivery and not barred by statutory accounting requirements.`},

		{`5. SEGURIDAD DE LA INFORMACIÓN Y CERTIFICADOS SSL`, `5. INFORMATION SECURITY AND ENCRYPTION`},
		{`NETZ adopta rigurosas medidas técnicas y organizativas para evitar la alteración, pérdida, mal uso o acceso no autorizado a los datos personales. Toda la comunicación entre el navegador del usuario y nuestros servidores viaja cifrada mediante protocolo seguro <b>HTTPS con certificados SSL/TLS</b> de 256 bits.`, `NETZ employs robust technical and organizational security controls to prevent unauthorized access, loss, or alteration. All communication between client browsers and our platform is encrypted via 256-bit <b>HTTPS with modern SSL/TLS</b>.`},

		{`6. TRANSFERENCIA INTERNACIONAL Y ALOJAMIENTO`, `6. INTERNATIONAL DATA TRANSFER AND HOSTING`},
		{`Para asegurar alta disponibilidad y redundancia técnica, los datos y servicios pueden ser alojados en centros de datos seguros de nivel Tier III/IV ubicados estratégicamente con estrictos controles de seguridad física y lógica.`, `To ensure high availability and hardware redundancy, services and data are hosted in Tier III/IV datacenters operating under strict physical and cybersecurity protocols.`},

		{`7. RETENCIÓN Y CONSERVACIÓN DE DATOS`, `7. DATA RETENTION`},
		{`Los datos personales serán conservados durante la vigencia de la relación contractual y, posteriormente, durante los plazos legalmente exigidos por las normativas fiscales, contables y de prescripción civil aplicables.`, `Personal data is retained for the duration of the active contractual relationship and thereafter as required by commercial, accounting, and tax retention laws.`},

		{`8. POLÍTICA DE COOKIES`, `8. COOKIE POLICY`},
		{`Nuestro sitio web utiliza cookies técnicas indispensables para permitir la navegación, mantener activa la sesión en el Área de Clientes y garantizar la seguridad transaccional. El usuario puede configurar su navegador para bloquearlas o eliminarlas en cualquier momento.`, `Our platform uses essential technical cookies required for navigation, secure session management in the Client Area, and transaction safety. You can configure your browser to manage cookies at any time.`},
	}
	return applyReplacements(c, pairs)
}

func translateAvisoLegal(c string) string {
	pairs := [][2]string{
		{`<title>Aviso Legal e Información Corporativa | NETZ</title>`, `<title>Legal Notice & Corporate Information | NETZ</title>`},
		{`<title>Aviso Legal | NETZ</title>`, `<title>Legal Notice & Regulatory Information | NETZ</title>`},
		{`content="Información legal, titularidad, términos de uso y datos corporativos de la plataforma de servicios en la nube NETZ."`, `content="Legal notice, terms of use, and corporate information for the NETZ cloud and web hosting platform."`},

		{`1. INFORMACIÓN GENERAL DEL TITULAR`, `1. GENERAL CORPORATE INFORMATION`},
		{`El presente portal web y todos los servicios de tecnología, hosting, streaming, dominios y servidores vinculados son titularidad y operados comercialmente bajo la marca <b>NETZ</b>.`, `This website and all associated cloud hosting, streaming, domain registration, and server solutions are owned and commercially operated under the <b>NETZ</b> brand.`},
		{`En cumplimiento de los estándares de transparencia y comercio electrónico, se informan los datos identificatorios del titular y administrador responsable:`, `In compliance with international transparency and electronic commerce standards, corporate details are set out below:`},
		{`Responsable legal:`, `Legal Representative:`},
		{`Identificación fiscal / Registro:`, `Tax Registration ID:`},
		{`País de Origen:`, `Headquarters & Jurisdiction:`},
		{`República del Paraguay (Operaciones e Infraestructura Global)`, `Republic of Paraguay (Global Infrastructure & Datacenters)`},
		{`Sitio oficial:`, `Official Website:`},
		{`Teléfono / WhatsApp:`, `Telephone / WhatsApp:`},
		{`E-mail institucional general:`, `General Corporate Email:`},
		{`E-mail de soporte técnico:`, `Technical Support Email:`},
		{`Área de Clientes y Tickets:`, `Client Area & Support Desk:`},

		{`2. OBJETO Y ÁMBITO DE APLICACIÓN`, `2. SCOPE AND ACCEPTANCE`},
		{`El presente Aviso Legal regula el acceso, navegación y uso del sitio web, así como las responsabilidades derivadas de la utilización de sus contenidos y servicios. El acceso o utilización del sitio implica la adhesión y aceptación plena y sin reservas de todas las condiciones aquí publicadas.`, `This Legal Notice governs access, navigation, and usage of this website and related digital services. Using this website implies full, unreserved acceptance of all published terms.`},

		{`3. PROPIEDAD INTELECTUAL E INDUSTRIAL`, `3. INTELLECTUAL PROPERTY RIGHTS`},
		{`Todos los contenidos de este portal, incluyendo a título enunciativo pero no limitativo: textos, código fuente, diseños, interfaces, marcas, logotipos, elementos gráficos e imágenes, son propiedad exclusiva de <b>NETZ</b> o de terceros que han autorizado expresamente su uso, estando protegidos por las leyes de Propiedad Intelectual y Marcas aplicables.`, `All contents of this portal (including text, UI layouts, source code, graphics, branding, and images) are the exclusive property of <b>NETZ</b> or authorized third-party licensors, protected under applicable intellectual property laws.`},
		{`Queda expresamente prohibida la reproducción total o parcial, distribución, comunicación pública o transformación de los contenidos sin la previa autorización expresa y por escrito de NETZ.`, `Total or partial reproduction, public distribution, or commercial exploitation without prior written consent from NETZ is strictly prohibited.`},

		{`4. CONDICIONES DE USO DEL SITIO`, `4. CONDITIONS OF PLATFORM USE`},
		{`El usuario se compromete a hacer un uso diligente, correcto y lícito del sitio web y de los servicios contratados, obligándose expresamente a:`, `Users agree to utilize this platform and contracted services in a diligent, lawful manner, committing specifically to:`},
		{`No emplear los servicios para fines ilícitos, lesivos de los derechos e intereses de terceros o contrarios al ordenamiento jurídico vigente.`, `Refrain from unlawful activities that infringe third-party rights or breach international cyber-security regulations.`},
		{`No dañar los sistemas físicos y lógicos de NETZ, de sus proveedores o de terceros (incluyendo introducción de virus, malware, scripts maliciosos o ataques de denegación de servicio).`, `Never damage, overload, or compromise physical and virtual infrastructure (including malware distribution or denial-of-service attacks).`},
		{`Custodiar con debida confidencialidad sus credenciales de acceso (usuario y contraseña) a los paneles de control y Área de Clientes, siendo el único responsable del uso de las mismas.`, `Safeguard authentication credentials (passwords, API tokens) and maintain sole responsibility for account actions.`},

		{`5. EXCLUSIÓN DE RESPONSABILIDAD`, `5. LIMITATION OF LIABILITY`},
		{`La <b>NETZ</b> actúa como proveedora de servicios de intermediación técnica y alojamiento en internet. En los términos de la legislación aplicable:`, `<b>NETZ</b> acts as an infrastructure service provider and hosting intermediary. Under applicable law:`},
		{`NETZ no se responsabiliza de la información, contenidos, archivos o datos almacenados o transmitidos por los clientes a través de sus servicios de Hosting, Servidores VPS o Streaming.`, `NETZ is not liable for user-generated content, web applications, or data stored/transmitted through hosting or VPS servers.`},
		{`NETZ no garantiza la inexistencia de interrupciones temporales por causas de fuerza mayor, mantenimientos programados o incidencias en redes de telecomunicaciones ajenas a su control.`, `NETZ does not guarantee uninterrupted service in events of force majeure, scheduled maintenance, or external carrier failures.`},

		{`6. ENLACES A TERCEROS`, `6. THIRD-PARTY LINKS`},
		{`En el caso de que en el portal existieran enlaces o hipervínculos hacia otros sitios de Internet, NETZ no ejercerá ningún tipo de control sobre dichos sitios y contenidos, no asumiendo responsabilidad alguna por daños derivados de su acceso o uso.`, `Any external links provided on this portal are for convenience; NETZ exercises no control over third-party platforms and assumes no liability for their contents.`},

		{`7. COMUNICACIONES ELECTRÓNICAS`, `7. ELECTRONIC NOTICES`},
		{`Todas las notificaciones y comunicaciones efectuadas por NETZ al correo electrónico provisto por el cliente en su registro se considerarán válidas y plenamente eficaces a todos los efectos contractuales.`, `All communications sent to the client's registered email address are considered valid and legally effective for all contractual purposes.`},

		{`8. LEY APLICABLE Y JURISDICCIÓN`, `8. APPLICABLE LAW`},
		{`Para la resolución de cualquier conflicto o discrepancia relacionada con el presente sitio web o con los servicios prestados por NETZ, se aplicará la legislación vigente en la materia, sometiéndose las partes a los juzgados y tribunales competentes.`, `Any dispute regarding this website or services provided by NETZ shall be governed by applicable commercial laws and submitted to competent judicial courts.`},
	}
	return applyReplacements(c, pairs)
}

func translateIndex(c string) string {
	pairs := [][2]string{
		{`<title>NETZ | Web Hosting Ilimitado, Servidores VPS, Streaming y Dominios</title>`, `<title>NETZ | Unlimited Web Hosting, VPS Servers, Streaming & Domains</title>`},
		{`content="Plataforma líder en Web Hosting Ilimitado de alto rendimiento, Servidores VPS Linux y Windows, Streaming de Radio y Video, y Registro de Dominios. Soporte 24/7 y activación inmediata a nivel mundial."`, `content="Leading platform for high-performance Unlimited Web Hosting, Linux & Windows VPS Servers, Radio & Video Streaming, and Domain Registration. 24/7 support and instant activation worldwide."`},

		{`<span>ENCUENTRA TU NOMBRE DE DOMINIO PERFECTO..</span>REGISTRO DE DOMINIOS<small>Al precio más accesible del mercado</small>`, `<span>FIND YOUR PERFECT DOMAIN NAME..</span>DOMAIN REGISTRATION<small>At the most competitive global rates</small>`},
		{`Precio Inicial desde`, `Starting price from`},
		{`Activación rápida`, `Instant Activation`},
		{`Compra segura`, `Secure Checkout`},

		{`CHEQUEA NUESTROS PLANES DE HOSTING<br>Recursos exclusivos con mayor velocidad!`, `EXPLORE OUR WEB HOSTING PLANS<br>Exclusive resources with lightning speed!`},
		{`Haga Que Su Empresa Este En Línea Hoy Mismo Con Unidades SSD Rápidas, Creador De Sitios Web Gratuito * Almacenamiento Web De Correo Ilimitado<br>Certificados SSL Gratuitos Incluidos`, `Get Your Business Online Today With Ultra-Fast SSD Drives, Free Site Builder * Unlimited Business Email Storage<br>Free Automated SSL Certificates Included`},

		{`Nuestras Características`, `Our Core Infrastructure`},
		{`¡Aquí hay algunas cosas que creemos que nos hacen el ajuste perfecto para usted!<br>¡Respaldamos nuestro alojamiento y nuestro servicio al cliente!<br>Ofrecemos una garantía de tiempo de actividad para cada plan de alojamiento que ofrecemos.`, `Here is why NETZ is the perfect partner for your digital projects!<br>We stand firmly behind our hosting infrastructure and 24/7 customer care!<br>Backed by a verified uptime guarantee on every plan.`},

		{`Grandes posibilidades`, `High Scalability`},
		{`2 núcleos de CPU y 2 GB de RAM estándar, ampliable x2 especial para sitios más exigentes.`, `2 CPU cores and 2 GB RAM standard per account, 2x expandable for high-traffic operations.`},
		{`Ultra rápida`, `Ultra-Fast Speed`},
		{`Hasta 16 veces más rápida<br>Significa una experiencia más completa y atractiva para los visitantes`, `Up to 16x faster page loads<br>Delivering an engaging, seamless experience for your visitors.`},
		{`Garantía de disponibilidad del 99.9% en nuestros servicios.`, `99.9% service availability guarantee across our global network.`},

		{`Panel de control fácil de usar`, `Easy-to-Use Control Panel`},
		{`Fácil uso`, `Intuitive Interface`},
		{`Nuestro panel esta optimizado para su fácil uso, y puede ser utilizado por personas con poca experiencia en desarrollo web.`, `Our control panel is streamlined for effortless management, perfect for beginners and pros alike.`},
		{`Optimizado`, `Highly Optimized`},
		{`Disponemos de una amplia variedad de herramientas para satisfacer sus necesidades de usuario y desarrollador.`, `Equipped with comprehensive developer tools and modules to meet every technical requirement.`},
		{`Sencillo e intuitivo`, `Fast & Reliable`},
		{`Ofrecemos más velocidad y optimización en WP con cache LiteSpeed para brindar un rendimiento de vanguardia.`, `Boost WordPress performance with LiteSpeed server-level caching for instantaneous page loads.`},

		{`Retransmisión de correo electrónico de MailChannels`, `MailChannels Outbound Email Relay`},
		{`Entrega y Protección de correo electrónico de nivel empresarial<br> Utilizamos mailChannels Cloud para que todo el correo saliente se transmita a través de una red distribuida de direcciones IP dedicadas a entregar su correo.`, `Enterprise-grade email delivery and inbox protection.<br>We route all outbound email through MailChannels Cloud's distributed network of trusted IPs, guaranteeing inbox placement.`},
		{`Incluido GRATIS`, `Included FREE`},
		{`Nuestro servicio de retransmisión de correo se incluye de forma gratuita con todos los buzones de correo.`, `Our premium outbound email relay service is included completely free with all mailboxes.`},
		{`Bandeja no SPAM!`, `Inbox Delivery, No SPAM!`},
		{`MailChannels garantiza que sus correos electrónicos se entreguen correctamente.`, `MailChannels ensures your critical business emails reach the recipient's primary inbox reliably.`},

		{`Estamos corriendo en todo el mundo.`, `Global Network Infrastructure.`},
		{`Cada servicio que brindamos es una fuente de inteligencia en tiempo real sobre amenazas nuevas y actuales. Así es como ejecutamos nuestros servidores para hacer esta red aún más fuerte.`, `Every service we provide leverages real-time global threat intelligence. That is how our infrastructure keeps your data fast, resilient, and secure.`},
		{`E.E.U.U.`, `U.S.A.`},
	}
	return applyReplacements(c, pairs)
}

func translateVpsLinux(c string) string {
	pairs := [][2]string{
		{`<title>Servidores VPS Linux Administrado 24/7 | NETZ</title>`, `<title>Managed Linux VPS Servers 24/7 | NETZ</title>`},
		{`<title>Servidores VPS Linux No Administrado Root | NETZ</title>`, `<title>Unmanaged Linux VPS Servers Root | NETZ</title>`},
		{`<title>Servidores VPS Linux | NETZ</title>`, `<title>High-Performance Linux VPS Servers | NETZ</title>`},
		{`content="Servidores VPS Linux de alta velocidad con administración completa incluida, discos NVMe, soporte 24/7 y monitoreo proactivo."`, `content="High-speed Linux VPS servers with full management included, NVMe storage, 24/7 support, and proactive monitoring."`},
		{`content="Servidores VPS Linux con acceso root completo, procesadores de última generación y discos NVMe para desarrolladores y empresas."`, `content="Linux VPS servers with full root access, modern generation CPUs, and NVMe drives for developers and enterprises."`},
		{`content="Toda la potencia y escalabilidad de servidores VPS Linux para tus aplicaciones web, bases de datos y proyectos de alta demanda."`, `content="All the power and scalability of Linux VPS servers for your web applications, databases, and demanding projects."`},

		{`con menos de 60 segundos de respuesta en todo el`, `with sub-60 second automated deployment worldwide`},
		{`Nuestro VPS - <strong>Linux NO ADMINISTRADO</strong>`, `Our VPS - <strong>Unmanaged Linux</strong>`},
		{`Nuestro VPS - <strong>Linux ADMINISTRADO</strong>`, `Our VPS - <strong>Managed Linux</strong>`},
		{`Funciones incluidas en todos los planes`, `Features included across all plans`},
		{`Puertos de 1 Gbps`, `1 Gbps Network Ports`},
		{`Discos de estado sólido`, `NVMe Solid State Drives`},
		{`Tiempo de actividad`, `99.9% Uptime Guarantee`},
		{`ISO personalizados`, `Custom ISO Uploads`},
		{`Firewall empresarial`, `Enterprise-Grade Firewall`},
		{`Mejoramos el rendimiento y la seguridad de su VPS.`, `We enhance the performance and security of your VPS.`},
		{`Sistema de monitoreo`, `24/7 Real-Time Monitoring`},
		{`Escalabilidad instantánea`, `Instant On-Demand Scalability`},
		{`Copias de seguridad nocturnas`, `Automated Daily Backups`},
		{`¿Cuál es tu sistema favorito de Linux?`, `What is your preferred Linux distribution?`},
		{`¿Qué es un VPS linux administrado?`, `What is a managed Linux VPS?`},
		{`¿Me ayudaran a emigrar de mi antiguo proveedor a NETZ?`, `Will you help me migrate from my previous hosting provider to NETZ?`},
		{`¿Qué se incluye en la gestión completa del servidor?`, `What is included in fully managed server support?`},
		{`¿Tengo el control total de mi VPS Linux?`, `Do I have full root control of my Linux VPS?`},
		{`¿Puedo actualizar mi VPS de Linux más adelante?`, `Can I upgrade my Linux VPS resources later?`},
		{`¿Puedo cargar mi propia ISO para usar en mi VPS Linux?`, `Can I upload my own custom ISO to install on my Linux VPS?`},
		{`¿Ofrecen una solución de copias de seguridad en Linux VPS?`, `Do you provide automated backup solutions for Linux VPS?`},
	}
	return applyReplacements(c, pairs)
}

func translateVpsWindows(c string) string {
	pairs := [][2]string{
		{`<title>Servidores VPS Windows Administrado | NETZ</title>`, `<title>Managed Windows VPS Servers | NETZ</title>`},
		{`<title>Servidores VPS Windows No Administrado RDP | NETZ</title>`, `<title>Unmanaged Windows VPS Servers RDP | NETZ</title>`},
		{`<title>Servidores VPS Windows | NETZ</title>`, `<title>Windows VPS Servers with Official License | NETZ</title>`},
		{`content="Servidores VPS con Windows Server oficial, administración profesional 24/7 y hardware de alta gama para empresas."`, `content="VPS servers with licensed Windows Server, 24/7 managed support, and enterprise-grade hardware for businesses."`},
		{`content="Servidores virtuales VPS Windows Server con almacenamiento SSD ultrarrápido y acceso RDP para aplicaciones empresariales."`, `content="Virtual Windows Server VPS with ultra-fast SSD storage and full RDP access for enterprise applications."`},

		{`Mantenga el control total con nuestro VPS`, `Maintain full control and reliability with our VPS Servers`},
		{`Nuestro VPS - <strong>Windows ADMINISTRADO</strong>`, `Our VPS - <strong>Managed Windows</strong>`},
		{`Nuestro VPS - <strong>Windows NO ADMINISTRADO</strong>`, `Our VPS - <strong>Unmanaged Windows</strong>`},
		{`Implemente su servidor Windows al instante`, `Deploy your Windows server instantly`},
		{`¿Qué es un VPS de Windows?`, `What is a Windows VPS?`},
		{`¿Cómo accedo a mi VPS de Windows?`, `How do I access my Windows VPS?`},
		{`¿Puedo navegar por internet con mi VPS de Windows?`, `Can I browse the internet and run custom software on my Windows VPS?`},
		{`¿Proporciona licencias de Microsoft SQL (MSSQL)?`, `Do you support Microsoft SQL Server (MSSQL) databases?`},
		{`¿Mi VPS de Windows tendrá licencia?`, `Does my Windows VPS include an official genuine license?`},
		{`¿Puedo actualizar mi VPS de Windows más adelante?`, `Can I upgrade my Windows VPS CPU, RAM, or storage later?`},
		{`¿Ofrecen copias de seguridad en Windows VPS?`, `Do you provide automated backups for Windows VPS?`},
		{`¿Que se incluye en la gestión completa del servidor?`, `What is included in fully managed Windows server support?`},
		{`¿Mi VPS de Windows requerirá actualizaciones de Windows?`, `Will my Windows VPS receive official system updates?`},
	}
	return applyReplacements(c, pairs)
}

func translate404(c string) string {
	pairs := [][2]string{
		{`<title>Página no encontrada (404) | NETZ</title>`, `<title>Page Not Found (404) | NETZ</title>`},
		{`Página no encontrada`, `Page Not Found`},
		{`Lo sentimos, la página que buscas no existe o ha sido movida.`, `Sorry, the page you are looking for does not exist or has been moved.`},
		{`Volver al Inicio`, `Back to Home`},
		{`Volver al inicio`, `Back to Home`},
	}
	return applyReplacements(c, pairs)
}
