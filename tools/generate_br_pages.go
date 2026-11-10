package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"
)

// Definición de reemplazos comunes para toda la web en pt-BR
var globalReplacements = [][2]string{
	// Meta y cabecera general
	{"lang=\"es\"", "lang=\"pt-BR\""},
	{"data-country=\"py\"", "data-country=\"br\""},
	{"content=\"es_LA\"", "content=\"pt_BR\""},
	{"content=\"es_ES\"", "content=\"pt_BR\""},

	// Títulos exactos de todas las páginas
	{"<title>Página no encontrada (404) | NETZ</title>", "<title>Página não encontrada (404) | NETZ</title>"},
	{"<title>Sobre Nosotros | Infraestructura y Equipo NETZ</title>", "<title>Sobre Nós | Infraestrutura e Equipe NETZ</title>"},
	{"<title>Radio Streaming SSL con AutoDJ SonicPanel | NETZ</title>", "<title>Rádio Streaming SSL com AutoDJ SonicPanel | NETZ</title>"},
	{"<title>Aviso Legal e Información Corporativa | NETZ</title>", "<title>Aviso Legal e Informações Corporativas | NETZ</title>"},
	{"<title>Comprobador y Registro de Dominios Web | NETZ</title>", "<title>Verificador e Registro de Domínios Web | NETZ</title>"},
	{"<title>Centro de Ayuda y Base de Conocimientos | NETZ</title>", "<title>Central de Ajuda e Base de Conhecimento | NETZ</title>"},
	{"<title>Contacto y Soporte Técnico 24/7 | NETZ</title>", "<title>Contato e Suporte Técnico 24/7 | NETZ</title>"},
	{"<title>Hosting Exclusivo y Empresarial Dedicado | NETZ</title>", "<title>Hospedagem Exclusiva e Empresarial Dedicada | NETZ</title>"},
	{"<title>Hosting Ilimitado SSD NVMe con cPanel | NETZ</title>", "<title>Hospedagem Ilimitada SSD NVMe com cPanel | NETZ</title>"},
	{"<title>NETZ | Web Hosting Ilimitado, Servidores VPS, Streaming y Dominios</title>", "<title>NETZ | Hospedagem Ilimitada, Servidores VPS, Streaming e Domínios</title>"},
	{"<title>Política de Privacidad y Protección de Datos | NETZ</title>", "<title>Política de Privacidade e Proteção de Dados | NETZ</title>"},
	{"<title>Hosting Reseller cPanel & WHM Multicuenta | NETZ</title>", "<title>Revenda de Hospedagem cPanel & WHM Multicontas | NETZ</title>"},
	{"<title>Hosting Reseller DirectAdmin Económico | NETZ</title>", "<title>Revenda de Hospedagem DirectAdmin Econômica | NETZ</title>"},
	{"<title>Términos del Servicio y Política de Reembolso | NETZ</title>", "<title>Termos de Serviço e Política de Reembolso | NETZ</title>"},
	{"<title>Video Streaming en Vivo HD con SSL | NETZ</title>", "<title>Vídeo Streaming ao Vivo HD com SSL | NETZ</title>"},
	{"<title>Servidores VPS Linux Administrado 24/7 | NETZ</title>", "<title>Servidores VPS Linux Gerenciado 24/7 | NETZ</title>"},
	{"<title>Servidores VPS Linux No Administrado Root | NETZ</title>", "<title>Servidores VPS Linux Não Gerenciado Root | NETZ</title>"},
	{"<title>Servidores VPS Linux | NETZ</title>", "<title>Servidores VPS Linux de Alta Performance | NETZ</title>"},
	{"<title>Servidores VPS Windows Administrado | NETZ</title>", "<title>Servidores VPS Windows Gerenciado | NETZ</title>"},
	{"<title>Servidores VPS Windows No Administrado RDP | NETZ</title>", "<title>Servidores VPS Windows Não Gerenciado RDP | NETZ</title>"},
	{"<title>Servidores VPS Windows | NETZ</title>", "<title>Servidores VPS Windows com Licença Oficial | NETZ</title>"},

	// OpenGraph y Meta Descriptions globales
	{"content=\"Plataforma líder en Web Hosting Ilimitado de alto rendimiento, Servidores VPS Linux y Windows, Streaming de Radio y Video, y Registro de Dominios. Soporte 24/7 y activación inmediata a nivel mundial.\"", "content=\"Plataforma líder em Hospedagem Ilimitada de alta performance, Servidores VPS Linux e Windows, Streaming de Rádio e Vídeo, e Registro de Domínios. Suporte 24/7 e ativação imediata.\""},
	{"content=\"web hosting ilimitado, comprar hosting, servidores vps administrados, vps linux, vps windows, comprar dominios baratos, streaming radio sonicpanel, video streaming ssl, hosting revendedor, hosting cpanel, netz\"", "content=\"hospedagem de sites ilimitada, comprar hospedagem, servidores vps gerenciados, vps linux, vps windows, registrar dominios baratos, streaming de radio sonicpanel, video streaming ssl, revenda de hospedagem, hospedagem cpanel, netz brasil\""},

	// Barra de navegación fija
	{"<a class=\"nav-link\" href=\"index\">Inicio", "<a class=\"nav-link\" href=\"index\">Início"},
	{">Hosting<", ">Hospedagem<"},
	{">Hosting Ilimitado<", ">Hospedagem Ilimitada<"},
	{"<span class=\"nav-new-tag\">Servicio sin límites de recursos</span>", "<span class=\"nav-new-tag\">Serviço sem limites de recursos</span>"},
	{">Hosting Exclusivo<", ">Hospedagem Exclusiva<"},
	{"<span>Recursos exclusivos</span>", "<span>Recursos exclusivos</span>"},
	{">Vps<", ">VPS<"},
	{">Linux no administrado<", ">Linux não Gerenciado<"},
	{"<span>¡Administre usted mismo!</span>", "<span>Gerencie você mesmo!</span>"},
	{">Linux Administrado<", ">Linux Gerenciado<"},
	{"<span>Todo el poder <br>NINGUNO de los problemas</span>", "<span>Todo o poder <br>SEM complicações</span>"},
	{">Windows no Administrado<", ">Windows não Gerenciado<"},
	{">Windows Administrado<", ">Windows Gerenciado<"},
	{">Radio Streaming<", ">Rádio Streaming<"},
	{"<span>Sonido limpio y fluido <br>Sonido de Calidad</span>", "<span>Áudio limpo e fluido <br>Som de alta qualidade</span>"},
	{">Video Streaming<", ">Vídeo Streaming<"},
	{"<span>Calidad máxima 720p <br>Streaming SSL</span>", "<span>Qualidade máxima 720p <br>Streaming SSL</span>"},
	{">Reseller<", ">Revenda<"},
	{"<span>2 CPU - 2Gb Ram, por cPanel</span>", "<span>2 CPU - 2GB RAM por cPanel</span>"},
	{"<span>2 CPU - 2Gb Ram, por cuenta</span>", "<span>2 CPU - 2GB RAM por conta</span>"},
	{">Dominios<", ">Domínios<"},
	{">Comprobador de dominio<", ">Verificador de Domínio<"},
	{"<span class=\"nav-new-tag\">Consulta de disponibilidad</span>", "<span class=\"nav-new-tag\">Consulta de disponibilidade</span>"},
	{">Transferencia de dominio<", ">Transferência de Domínio<"},
	{"<span>Transfiera su dominio</span>", "<span>Transfira seu domínio</span>"},
	{">Empresa<", ">Empresa<"},
	{">Sobre Nosotros<", ">Sobre Nós<"},
	{">Términos de Servicio<", ">Termos de Serviço<"},
	{">Politica de Privacidad<", ">Política de Privacidade<"},
	{">Aviso Legal<", ">Aviso Legal<"},
	{">Cóntactenos<", ">Fale Conosco<"},
	{">Iniciar Sesión<", ">Área do Cliente<"},
	{"placeholder=\"Contraseña\"", "placeholder=\"Senha\""},
	{"title=\"login\"", "title=\"Entrar\""},

	// Selector de ciclo de facturación
	{"<span class=\"change-box-text\">Mensual</span>", "<span class=\"change-box-text\">Mensal</span>"},
	{"<span class=\"change-box-text\">Año</span>", "<span class=\"change-box-text\">Anual</span>"},
	{"<small> /Mensual</small>", "<small> /Mês</small>"},
	{"<small> /Año</small>", "<small> /Ano</small>"},
	{"<b>Mensual</b>", "<b>Mensal</b>"},
	{"<b>Año</b>", "<b>Anual</b>"},

	// Botones universales de acción
	{">Contratar<", ">Contratar<"},
	{">Comprar Ahora<", ">Contratar Agora<"},
	{">Comprar<", ">Contratar<"},
	{">Ver Planes<", ">Ver Planos<"},
	{">Volver al Inicio<", ">Voltar ao Início<"},
	{">Empieza con nosotros ahora<", ">Comece conosco agora<"},

	// Características de Hosting y Planes
	{"Plan Básico", "Plano Básico"},
	{"Plan Pro +", "Plano Pro +"},
	{"Plan Pro", "Plano Pro"},
	{"Principalmente para uso personal", "Ideal para uso pessoal e blogs"},
	{"Principalmente para uso empresarial", "Perfeito para empresas e lojas online"},
	{"Almacenamiento 30 Gb SSD", "Armazenamento 30 GB SSD"},
	{"Almacenamiento ilimitado SSD", "Armazenamento ilimitado SSD"},
	{"Almacenamiento ilimitado NVMe", "Armazenamento ilimitado NVMe"},
	{"Trafico ilimitado", "Tráfego ilimitado"},
	{"Cuentas de Email ilimitadas", "Contas de e-mail ilimitadas"},
	{"Soporte Node.js", "Suporte a Node.js"},
	{"Sistema WebMail", "Webmail Profissional"},
	{"Acceso FTP ilimitado", "Acesso FTP ilimitado"},
	{"Copias de seguridad diarias", "Backups diários automáticos"},
	{"Gestión centralizada", "Gerenciamento centralizado"},
	{"Protección DDoS de nivel empresarial", "Proteção DDoS de nível corporativo"},
	{"Protección DDoS", "Proteção DDoS"},
	{"Soporte técnico 24/7", "Suporte técnico 24/7"},
	{"Certificado SSL Gratis", "Certificado SSL Grátis"},
	{"Certificado SSL Gratuito", "Certificado SSL Grátis"},
	{"Subdominios ilimitados", "Subdomínios ilimitados"},
	{"MySQL ilimitado", "Bancos de dados MySQL ilimitados"},
	{"MagicSpam Protección", "Proteção MagicSpam anti-spam"},
	{"Dominio Gratis", "Domínio Grátis"},
	{"Firewall de aplicaciones web", "Firewall de Aplicações Web (WAF)"},

	// WhatsApp links
	{"text=Hola%20vengo%20desde%20la%20web,%20%C2%BFMe%20pueden%20dar%20m%C3%A1s%20informaci%C3%B3n?", "text=Ol%C3%A1%20vim%20pelo%20site,%20poderia%20me%20dar%20mais%20informa%C3%A7%C3%B5es?"},
}

func applyReplacements(content string, pairs [][2]string) string {
	res := content
	for _, p := range pairs {
		res = strings.ReplaceAll(res, p[0], p[1])
	}
	return res
}

func main() {
	start := time.Now()
	fmt.Println("🇧🇷 Generando plantillas en Portugués de Brasil (locales/br/)...")

	if err := os.MkdirAll("locales/br", 0755); err != nil {
		fmt.Printf("❌ Error creando locales/br: %v\n", err)
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
		data, err := os.ReadFile(p)
		if err != nil {
			fmt.Printf("⚠️ No se pudo leer %s: %v\n", p, err)
			continue
		}

		content := string(data)
		// Aplicar reemplazos globales
		content = applyReplacements(content, globalReplacements)

		// Aplicar lógica específica de la página
		switch p {
		case "index.html":
			content = translateIndex(content)
		case "buscar-dominios.html":
			content = translateBuscarDominios(content)
		case "hosting-ilimitado.html":
			content = translateHostingIlimitado(content)
		case "hosting-exclusivo.html":
			content = translateHostingExclusivo(content)
		case "vps-linux.html", "vps-linux-administrado.html", "vps-linux-no-administrado.html":
			content = translateVpsLinux(content)
		case "vps-windows.html", "vps-windows-administrado.html", "vps-windows-no-administrado.html":
			content = translateVpsWindows(content)
		case "audio-streaming.html":
			content = translateAudioStreaming(content)
		case "video-streaming.html":
			content = translateVideoStreaming(content)
		case "reseller-cpanel.html":
			content = translateResellerCpanel(content)
		case "reseller-directadmin.html":
			content = translateResellerDirectAdmin(content)
		case "about.html":
			content = translateAbout(content)
		case "contact.html":
			content = translateContact(content)
		case "centro-de-ayuda.html":
			content = translateCentroDeAyuda(content)
		case "terminos-del-servicio.html":
			content = translateTerminos(content)
		case "politica-de-privacidad.html":
			content = translatePrivacidad(content)
		case "aviso-legal.html":
			content = translateAvisoLegal(content)
		case "404.html":
			content = translate404(content)
		}

		outPath := filepath.Join("locales", "br", p)
		if err := os.WriteFile(outPath, []byte(content), 0644); err != nil {
			fmt.Printf("❌ Error guardando %s: %v\n", outPath, err)
			continue
		}
		fmt.Printf("  ✅ %s -> locales/br/%s\n", p, p)
	}

	fmt.Printf("✨ Finalizado con éxito en %v\n", time.Since(start))
}

func translateIndex(c string) string {
	pairs := [][2]string{
		{"<title>Mejor Servicio de Web Hosting, Dominios y Servidores VPS | NETZ</title>", "<title>Melhor Serviço de Hospedagem de Sites, Domínios e Servidores VPS | NETZ</title>"},
		{"content=\"Ofrecemos los mejores planes de hosting web, registro de dominios, radio streaming, VPS y servidores dedicados con alta velocidad, seguridad y soporte 24/7.\"", "content=\"Oferecemos os melhores planos de hospedagem de sites, registro de domínios, rádio streaming, VPS e servidores dedicados com alta velocidade, segurança e suporte 24/7.\""},
		{"content=\"hosting paraguay, web hosting, dominios py, servidores vps, hosting cpanel, streaming radio\"", "content=\"hospedagem brasil, web hosting brasil, dominios br, servidores vps brasil, hospedagem cpanel, radio streaming\""},
		{"content=\"Mejor Servicio de Web Hosting, Dominios y Servidores VPS | NETZ\"", "content=\"Melhor Serviço de Hospedagem de Sites, Domínios e Servidores VPS | NETZ\""},

		// Hero
		{"ENCUENTRA TU NOMBRE DE DOMINIO\n                            PERFECTO..", "ENCONTRE O NOME DE DOMÍNIO\n                            PERFEITO.."},
		{"<span>ENCUENTRA TU NOMBRE DE DOMINIO PERFECTO..</span>", "<span>ENCONTRE O NOME DE DOMÍNIO PERFEITO..</span>"},
		{"REGISTRO DE DOMINIOS<small>Al precio más accesible del mercado</small>", "REGISTRO DE DOMÍNIOS<small>Pelo preço mais acessível do mercado</small>"},
		{"REGISTRO DE DOMINIOS", "REGISTRO DE DOMÍNIOS"},
		{"Al precio más accesible del mercado", "Pelo preço mais acessível do mercado"},
		{"placeholder=\"Buscador de Dominios\"", "placeholder=\"Pesquisar Domínio\""},
		{"title=\"Buscar\"", "title=\"Pesquisar\""},
		{"value=\"Buscar\"", "value=\"Pesquisar\""},
		{"title=\"Transferir\"", "title=\"Transferir\""},
		{"value=\"Transferir\"", "value=\"Transferir\""},
		{"Precio Inicial desde USD 1.99/Año", "Preço inicial a partir de R$ 9,90/Ano"},
		{"title=\"Activación rápida\"", "title=\"Ativação rápida\""},
		{"title=\"Compra segura\"", "title=\"Compra segura\""},

		// Sección Hosting
		{"CHEQUEA NUESTROS PLANES DE HOSTING <br><span class=\"mr-tp-20\">Recursos\n                    exclusivos con mayor velocidad!</span>", "CONFIRA NOSSOS PLANOS DE HOSPEDAGEM <br><span class=\"mr-tp-20\">Recursos exclusivos com mais velocidade!</span>"},
		{"CHEQUEA NUESTROS PLANES DE HOSTING", "CONFIRA NOSSOS PLANOS DE HOSPEDAGEM"},
		{"Recursos exclusivos con mayor velocidad!", "Recursos exclusivos com mais velocidade!"},
		{"2 Meses Gratis con el pago anual", "2 Meses Grátis no pagamento anual"},
		{"Haga que su empresa este en línea hoy mismo con\n                    unidades SSD rápidas, creador de sitios web gratuito y almacenamiento web de correo ilimitado.\n                    <br>Certificados SSL gratuitos incluidos.", "Coloque sua empresa online hoje mesmo com discos SSD ultrarrápidos, criador de sites gratuito e armazenamento ilimitado de e-mails.<br>Certificados SSL gratuitos inclusos."},
		{"Haga que su empresa este en línea hoy mismo con unidades SSD rápidas", "Coloque sua empresa online hoje mesmo com discos SSD ultrarrápidos"},

		// SSL Boxes
		{"<h5>Cifrado de 256 bits</h5>", "<h5>Criptografia de 256 bits</h5>"},
		{"Nuestros SSL gratuitos con certificados cifrados de 256 bits totalmente validados.", "Nossos certificados SSL gratuitos contam com criptografia de 256 bits totalmente validada."},
		{"<h5>Certificados SSL comodín</h5>", "<h5>Certificados SSL Wildcard</h5>"},
		{"Instale un certificado SSL comodín totalmente validado de forma gratuita.", "Instale um certificado SSL wildcard gratuito para proteger o domínio e todos os seus subdomínios."},
		{"<h5>Auto renovación</h5>", "<h5>Renovação Automática</h5>"},
		{"Se instala una vez, se renueva automáticamente en la vida útil de la cuenta.", "Instalado uma vez, renova-se automaticamente durante todo o período ativo da conta."},

		// Características
		{"<h4>Servidores seguros</h4>", "<h4>Servidores Seguros</h4>"},
		{"Contamos con cortafuegos de seguridad BitNinja, Protección DDoS y certificados\n                                        SSL gratuitos", "Contamos com firewall de segurança BitNinja, Proteção DDoS e certificados SSL gratuitos"},
		{"<h4>99.9% de tiempo de actividad</h4>", "<h4>99.9% de Uptime Garantido</h4>"},
		{"Garantía de disponibilidad del 99.9% en nuestros servicios.", "Garantia de disponibilidade de 99.9% em todos os nossos serviços."},
		{"<h4>Grandes posibilidades</h4>", "<h4>Grandes Possibilidades</h4>"},
		{"2 núcleos de CPU y 2 GB de RAM estándar, ampliable x2 especial para sitios más\n                                        exigentes.", "2 núcleos de CPU e 2 GB de RAM padrão, expansíveis para sites e aplicações exigentes."},
		{"<h4>Ultra rápida</h4>", "<h4>Ultrarrápido</h4>"},
		{"Hasta 16 veces más rápida<br>Significa una experiencia más completa y atractiva\n                                        para los visitantes", "Até 16 vezes mais rápido.<br>Significa uma experiência muito mais rápida e fluida para seus visitantes"},

		{"¿Qué nos hace tan Grandes?", "O que nos torna diferentes?"},
		{"Nuestras Características", "Nossos Diferenciais"},
		{"¡Aquí hay algunas cosas que creemos que nos hacen el ajuste perfecto para usted!<br>¡Respaldamos\n                        nuestro alojamiento y nuestro servicio al cliente!<br>Ofrecemos una garantía de tiempo de\n                        actividad para cada plan de alojamiento que ofrecemos.", "Aqui estão os motivos que fazem da NETZ a parceira ideal para o seu projeto.<br>Garantimos infraestrutura de alta performance, estabilidade e atendimento dedicado 24 horas por dia."},

		// Radio Streaming
		{"<b>Radio<br>Streaming</b>", "<b>Rádio<br>Streaming</b>"},
		{"ShoutCast es una solución para la transmisión de audio en directo a través de Internet como una\n                        estación tradicional de radio.", "ShoutCast é a solução ideal para transmissão de áudio ao vivo pela internet, como uma estação tradicional de rádio."},
		{"Los usuarios pueden escuchar esta transmisión desde cualquier\n                        reproductor de medios.", "Seus ouvintes podem acompanhar a transmissão a partir de qualquer aplicativo, navegador ou dispositivo móvel."},
		{"Nuestra solución para Radio Streaming HD es SonicPanel", "Nossa solução para Rádio Streaming HD utiliza o moderno SonicPanel"},
		{"compatibles con Android e iOS, streaming seguro bajo protocolo HTTPS (SSL) y con transferencia\n                        ilimitada.", "compatível com Android e iOS, streaming 100% seguro com SSL (HTTPS) e tráfego ilimitado."},

		{"Stream Mini <span>Plan Inicial</span>", "Stream Mini <span>Plano Inicial</span>"},
		{"Stream Junior <span>Plan Especial</span>", "Stream Junior <span>Plano Especial</span>"},
		{"Stream Junior II <span>Plan Premium</span>", "Stream Junior II <span>Plano Premium</span>"},
		{"Cantidad de Oyentes en Simultáneo", "Ouvintes Simultâneos"},
		{"Calidad de audio", "Qualidade de áudio"},
		{"Transmisión con <b>Certificado SSL</b>", "Transmissão com <b>Certificado SSL</b>"},
		{"AutoDj <b>2 Gb Almacenamiento</b>", "AutoDJ <b>2 GB de Armazenamento</b>"},
		{"AutoDj <b>10 Gb Almacenamiento</b>", "AutoDJ <b>10 GB de Armazenamento</b>"},
		{"AutoDj <b>100 Gb Almacenamiento</b>", "AutoDJ <b>100 GB de Armazenamento</b>"},
		{"Reproductor <b>HTML5</b>", "Player <b>HTML5</b>"},
		{"Soporte <b>Incluye</b>", "Suporte <b>Incluso</b>"},

		// Panel de control
		{"<h2>Panel de control fácil de usar</h2>", "<h2>Painel de controle fácil de usar</h2>"},
		{"<h5 class=\"mt-0\">Fácil uso</h5>", "<h5 class=\"mt-0\">Fácil de usar</h5>"},
		{"Nuestro panel esta optimizado para su fácil uso, y puede ser\n                                        utilizado por personas con poca experiencia en desarrollo web.", "Nosso painel é intuitivo e otimizado para que qualquer pessoa gerencie seu site sem complicações."},
		{"<h5 class=\"mt-0\">Optimizado</h5>", "<h5 class=\"mt-0\">Otimizado</h5>"},
		{"Disponemos de una amplia variedad de herramientas para satisfacer\n                                        sus necesidades de usuario y desarrollador.", "Contamos com instalador de aplicativos em um clique, PHP configurável, bancos de dados e ferramentas completas para desenvolvedores."},
		{"<h5 class=\"mt-0\">Sencillo e intuitivo</h5>", "<h5 class=\"mt-0\">Simples e intuitivo</h5>"},
		{"Ofrecemos más velocidad y optimización en WP con cache LiteSpeed\n                                        para brindar un rendimiento de vanguardia.", "Acelere seu site WordPress com tecnologia de cache LiteSpeed para máxima performance e velocidade de carregamento."},

		// MailChannels
		{"<h2>Retransmisión de correo electrónico de MailChannels</h2>", "<h2>Entrega garantida de e-mails via MailChannels</h2>"},
		{"Entrega y Protección de correo electrónico de nivel empresarial<br>\n                            Utilizamos mailChannels Cloud para que todo el correo saliente se transmita a través de una\n                            red distribuida de direcciones IP dedicadas a entregar su correo.", "Proteção e entrega de e-mails em nível corporativo.<br>Utilizamos MailChannels Cloud para garantir que todas as mensagens enviadas cheguem diretamente à caixa de entrada, sem cair em listas de spam."},
		{"<b>Incluido GRATIS</b>", "<b>Incluso GRÁTIS</b>"},
		{"Nuestro servicio de retransmisión de correo se incluye de forma gratuita\n                                            con todos los buzones de correo.", "Nosso serviço de entrega de e-mails é fornecido gratuitamente em todos os planos de hospedagem."},
		{"<b>Bandeja no SPAM!</b>", "<b>Livre de SPAM!</b>"},
		{"MailChannels garantiza que sus correos electrónicos se entreguen\n                                            correctamente.", "O MailChannels analisa e assegura que seus e-mails legítimos sejam entregues de forma rápida e segura."},

		// Mapa mundial
		{"<h3>Estamos corriendo en todo el mundo.</h3>", "<h3>Operando com excelência em todo o mundo.</h3>"},
		{"Cada servicio que brindamos es una fuente de inteligencia en tiempo\n                    real sobre amenazas nuevas y actuales. Así es como ejecutamos nuestros servidores para hacer esta\n                    red aún más fuerte.", "Nossa infraestrutura global conta com redundância, proteção contra ameaças em tempo real e servidores de alto desempenho para manter seus projetos sempre no ar."},
	}
	return applyReplacements(c, pairs)
}

func translateBuscarDominios(c string) string {
	pairs := [][2]string{
		{"<title>Comprobador y Registro de Dominios Web | NETZ</title>", "<title>Verificador e Registro de Domínios Web | NETZ</title>"},
		{"content=\"Encuentra y registra tu nombre de dominio web (.com, .net, .org, .online, .app y más) al mejor precio global con activación instantánea.\"", "content=\"Encontre e registre seu nome de domínio web (.com, .net, .org, .online, .app e mais) pelo melhor preço global com ativação instantânea.\""},
		{"content=\"registro de dominios, comprar dominio web, transferir dominio, dominios baratos com net org\"", "content=\"registro de dominios, comprar dominio web, transferir dominio, dominios baratos com net org br\""},
		{"content=\"Comprobador y Registro de Dominios Web | NETZ\"", "content=\"Verificador e Registro de Domínios Web | NETZ\""},

		// Hero
		{"<span>ENCUENTRA TU NOMBRE DE DOMINIO PERFECTO..</span>REGISTRO DE DOMINIOS", "<span>ENCONTRE O NOME DE DOMÍNIO PERFEITO..</span>REGISTRO DE DOMÍNIOS"},
		{"placeholder=\"Buscador de Dominios\"", "placeholder=\"Pesquisar Domínio\""},
		{"title=\"Buscar\"", "title=\"Pesquisar\""},
		{"value=\"Buscar\"", "value=\"Pesquisar\""},
		{"title=\"Transferir\"", "title=\"Transferir\""},
		{"value=\"Transferir\"", "value=\"Transferir\""},

		// Bloque de 3 columnas
		{"<h5>Activación instantánea</h5>", "<h5>Ativação Instantânea</h5>"},
		{"<p>La activación es realizada en cuestión de minutos</p>", "<p>Seu domínio ativado em questão de minutos após a confirmação.</p>"},
		{"<h5>Personalización</h5>", "<h5>Personalização Completa</h5>"},
		{"<p>Personalice su dominio con la extensión de su preferencia</p>", "<p>Escolha a extensão ideal para dar autoridade à sua marca na internet.</p>"},
		{"<h5>Renovación</h5>", "<h5>Renovação Simplificada</h5>"},
		{"<p>Renovación automática de su dominio</p>", "<p>Renovação automática e transparente para proteger sua marca.</p>"},

		// Tablas de dominios
		{"Dominios de activación manual", "Domínios com Ativação Manual"},
		{"<span>Consultar disponibilidad</span>", "<span>Consultar Disponibilidade</span>"},
		{"<span>Dominio</span>", "<span>Domínio</span>"},
		{"<small class=\"ltd-name-small-phone\">Dominio</small>", "<small class=\"ltd-name-small-phone\">Domínio</small>"},
		{"<span>Registro en GS.</span>", "<span>Registro em GS.</span>"},
		{"<small class=\"ltd-name-small-phone\">Registro en GS.</small>", "<small class=\"ltd-name-small-phone\">Registro em GS.</small>"},
		{"<span>Registro en USD.</span>", "<span>Registro em USD</span>"},
		{"<small class=\"ltd-name-small-phone\">Registro en USD.</small>", "<small class=\"ltd-name-small-phone\">Registro em USD</small>"},
		{"<span>Renovación</span>", "<span>Renovação</span>"},
		{"<small class=\"ltd-name-small-phone\">Renovación</small>", "<small class=\"ltd-name-small-phone\">Renovação</small>"},
		{"<span>Acciones</span>", "<span>Ações</span>"},

		{"title=\"Consulta disponibilidad en NIC.PY\"", "title=\"Consultar disponibilidade no NIC.PY\""},

		{"Dominios de activación automatica", "Domínios com Ativação Automática"},
		{"<span>Activación en cuestion de minutos</span>", "<span>Ativação em questão de minutos</span>"},
		{"Cargando dominios...", "Carregando domínios..."},

		// Mensajes de JavaScript
		{"No se pudieron cargar los dominios en este momento.", "Não foi possível carregar os domínios neste momento."},
		{"No hay dominios de activación automática disponibles en este momento.", "Nenhum domínio com ativação automática disponível no momento."},
		{"Consultando disponibilidad…", "Consultando disponibilidade…"},
		{"¡Disponible!", "Disponível!"},
		{"Registrar", "Registrar"},
		{"No disponible", "Não disponível"},
		{"El dominio <strong style=\"color: #2b3940;\">", "O domínio <strong style=\"color: #2b3940;\">"},
		{"ya se encuentra registrado.", "já se encontra registrado."},
		{"No se pudo verificar el dominio, intente nuevamente", "Não foi possível verificar o domínio, tente novamente"},
	}
	return applyReplacements(c, pairs)
}

func translateHostingIlimitado(c string) string {
	pairs := [][2]string{
		{"<title>Hosting Ilimitado con cPanel | NETZ</title>", "<title>Hospedagem Ilimitada com cPanel | NETZ</title>"},
		{"content=\"Alojamiento web con recursos ilimitados, discos SSD, soporte 24/7 y panel de control cPanel para tu sitio o negocio.\"", "content=\"Hospedagem de sites com recursos ilimitados, discos SSD ultrarrápidos, suporte 24/7 e painel cPanel para o seu projeto.\""},
		{"<span>Mantenga el control total de su entorno <br>con", "<span>Mantenha o controle total do seu ambiente <br>com"},
		{"Recursos exclusivos con mayor velocidad!", "Recursos exclusivos com mais velocidade!"},
		{"2 Meses Gratis con el pago anual", "2 Meses Grátis no pagamento anual"},
		{"Haga que su empresa este en línea hoy mismo con", "Coloque sua empresa online hoje mesmo com"},
		{"Fácil de usar", "Fácil de usar"},
		{"Robusto", "Robusto"},
		{"Poderoso", "Poderoso"},
		{"Alojamiento web ilimitado", "Hospedagem de Sites Ilimitada"},
		{"Desarrollado por cPanel", "Desenvolvido com cPanel"},
		{"¡Disponemos de opciones de aumento de la CPU y la RAM!", "Opções de expansão de CPU e memória RAM sob demanda!"},
		{"Impulsa tu", "Potencialize sua"},
		{"Herramientas simples pero poderosas", "Ferramentas simples e altamente poderosas"},
		{"Todo lo que necesitas y mucho más", "Tudo o que você precisa em um só lugar"},
		{"A un solo lugar a un", "com excelente custo-benefício"},
		{"FUNCIONES DEL ALOJAMIENTO !", "RECURSOS E VANTAGENS INCLUSAS !"},
		{"Preguntas frecuentes", "Perguntas Frequentes"},
		{"En caso de que sus dudas no son aclaradas no dude en visitar nuestra", "Se tiver qualquer dúvida adicional, fale com a nossa equipe na"},
		{"¿Los planes de Hosting son gestionados?", "¿Os planos de Hospedagem são gerenciados?"},
		{"¿Es necesario comprar un dominio al adquirir un plan?", "¿É necessário comprar um domínio ao contratar o plano?"},
		{"¿Cuanto tiempo tarda en activarse mi cuenta?", "¿Quanto tempo leva para ativar a minha conta?"},
		{"¿Puedo elegir un plan y luego cambiarlo por otro?", "¿Posso mudar de plano a qualquer momento?"},
		{"¿Qué tipo de base de datos están incluidas?", "¿Quais tipos de bancos de dados estão inclusos?"},
		{"¿Cuál es la garantía de disponibilidad?", "¿Qual é a garantia de disponibilidade (uptime)?"},
		{"¿Qué contenido puedo alojar?", "¿Que tipo de conteúdo posso hospedar?"},
		{"¿Ofrecemos conexión SSH?", "¿O acesso SSH está disponível?"},
		{"¿Ofrecemos rubygems, Python y node.js?", "¿Há suporte a Ruby, Python e Node.js?"},
		{"¿Se permite el envió de Spam?", "¿O envio de SPAM é permitido?"},
		{"¿Puedo realizar copias de seguridad?", "¿Posso realizar backups dos meus dados?"},
		{"¿Cual es nuestro nivel de seguridad?", "¿Qual é o nível de segurança oferecido?"},
	}
	return applyReplacements(c, pairs)
}

func translateHostingExclusivo(c string) string {
	pairs := [][2]string{
		{"<title>Hosting Exclusivo de Alto Rendimiento | NETZ</title>", "<title>Hospedagem Exclusiva de Alta Performance | NETZ</title>"},
		{"content=\"Servicio de hosting exclusivo con recursos dedicados, discos NVMe y aislamiento total para proyectos de alto tráfico.\"", "content=\"Serviço de hospedagem exclusiva com recursos dedicados, discos NVMe e isolamento total para projetos de alto tráfego.\""},
		{"Hosting Exclusivo", "Hospedagem Exclusiva"},
		{"Recursos exclusivos con mayor velocidad!", "Recursos dedicados e máxima velocidade!"},
		{"Rendimiento garantizado con unidades NVMe", "Desempenho garantido com unidades SSD NVMe ultrarrápidas"},
		{"Aislamiento total de recursos", "Ambiente isolado com recursos dedicados garantidos"},
		{"Preguntas frecuentes", "Perguntas Frequentes"},
	}
	return applyReplacements(c, pairs)
}

func translateVpsLinux(c string) string {
	pairs := [][2]string{
		{"con menos de 60 segundos de respuesta en todo el", "com ativação instantânea em menos de 60 segundos"},
		{"Nuestro VPS - <strong>Linux NO ADMINISTRADO</strong>", "Nosso Servidor VPS - <strong>Linux NÃO GERENCIADO</strong>"},
		{"Nuestro VPS - <strong>Linux ADMINISTRADO</strong>", "Nosso Servidor VPS - <strong>Linux GERENCIADO</strong>"},
		{"Funciones incluidas en todos los planes", "Recursos inclusos em todos os planos"},
		{"Puertos de 1 Gbps", "Portas de rede de 1 Gbps"},
		{"Discos de estado sólido", "Armazenamento SSD NVMe Ultrarrápido"},
		{"Tiempo de actividad", "Garantia de 99.9% de Uptime"},
		{"ISO personalizados", "ISOs Personalizadas"},
		{"Firewall empresarial", "Firewall Corporativo Avançado"},
		{"Mejoramos el rendimiento y la seguridad de su VPS.", "Elevamos o desempenho e a segurança do seu servidor VPS."},
		{"Sistema de monitoreo", "Monitoramento em Tempo Real 24/7"},
		{"Escalabilidad instantánea", "Escalabilidade Instantânea sob Demanda"},
		{"Copias de seguridad nocturnas", "Backups Automáticos Diários"},
		{"¿Cuál es tu sistema favorito de Linux?", "¿Qual é a sua distribuição Linux preferida?"},
		{"Elija", "Escolha entre Ubuntu, Debian, AlmaLinux ou Rocky Linux"},
		{"Preguntas frecuentes", "Perguntas Frequentes"},
		{"¿Qué es un VPS linux administrado?", "¿O que é um servidor VPS Linux gerenciado?"},
		{"¿Me ayudaran a emigrar de mi antiguo proveedor a NETZ?", "¿A NETZ realiza a migração gratuita do meu provedor anterior?"},
		{"¿Qué se incluye en la gestión completa del servidor?", "¿O que está incluso no gerenciamento completo do servidor?"},
		{"¿Tengo el control total de mi VPS Linux?", "¿Tenho controle total (acesso root) ao meu VPS Linux?"},
		{"¿Puedo actualizar mi VPS de Linux más adelante?", "¿Posso fazer upgrade dos recursos do VPS quando precisar?"},
		{"¿Puedo cargar mi propia ISO para usar en mi VPS Linux?", "¿Posso carregar uma ISO personalizada no meu servidor?"},
		{"¿Ofrecen una solución de copias de seguridad en Linux VPS?", "¿Vocês oferecem rotinas de backup para o VPS Linux?"},
	}
	return applyReplacements(c, pairs)
}

func translateVpsWindows(c string) string {
	pairs := [][2]string{
		{"Mantenga el control total con nuestro VPS", "Controle total e estabilidade com nossos Servidores VPS"},
		{"Nuestro VPS - <strong>Windows ADMINISTRADO</strong>", "Nosso Servidor VPS - <strong>Windows GERENCIADO</strong>"},
		{"Nuestro VPS - <strong>Windows NO ADMINISTRADO</strong>", "Nosso Servidor VPS - <strong>Windows NÃO GERENCIADO</strong>"},
		{"Implemente su servidor Windows al instante", "Ative seu servidor Windows instantaneamente"},
		{"Inicie", "Acesse via Conexão de Área de Trabalho Remota (RDP) de forma rápida e segura"},
		{"Funciones incluidas en todos los planes", "Recursos inclusos em todos os planos"},
		{"Puertos de 1 Gbps", "Portas de rede de 1 Gbps"},
		{"Discos de estado sólido", "Armazenamento SSD NVMe Ultrarrápido"},
		{"Tiempo de actividad", "Garantia de 99.9% de Uptime"},
		{"Firewall empresarial", "Firewall Corporativo Avançado"},
		{"Mejoramos el rendimiento y la seguridad de su VPS.", "Elevamos o desempenho e a segurança do seu servidor VPS."},
		{"Sistema de monitoreo", "Monitoramento em Tempo Real 24/7"},
		{"Escalabilidad instantánea", "Escalabilidade Instantânea sob Demanda"},
		{"Copias de seguridad nocturnas", "Backups Automáticos Diários"},
		{"Preguntas frecuentes", "Perguntas Frequentes"},
		{"¿Qué es un VPS de Windows?", "¿O que é um servidor VPS Windows?"},
		{"¿Cómo accedo a mi VPS de Windows?", "¿Como posso acessar meu servidor VPS Windows?"},
		{"¿Puedo navegar por internet con mi VPS de Windows?", "¿Posso navegar na internet e instalar meus programas no VPS?"},
		{"¿Proporciona licencias de Microsoft SQL (MSSQL)?", "¿Vocês fornecem suporte a bancos de dados Microsoft SQL?"},
		{"¿Mi VPS de Windows tendrá licencia?", "¿O Windows Server já vem com licença oficial ativa?"},
		{"¿Puedo actualizar mi VPS de Windows más adelante?", "¿Posso fazer upgrade de CPU, memória e disco quando quiser?"},
		{"¿Ofrecen copias de seguridad en Windows VPS?", "¿Vocês oferecem sistema de backup para servidores Windows?"},
		{"¿Que se incluye en la gestión completa del servidor?", "¿O que contempla o gerenciamento completo do servidor?"},
		{"¿Mi VPS de Windows requerirá actualizaciones de Windows?", "¿Meu servidor Windows receberá as atualizações oficiais do sistema?"},
	}
	return applyReplacements(c, pairs)
}

func translateAudioStreaming(c string) string {
	pairs := [][2]string{
		{"<title>Radio Streaming Profesional | NETZ</title>", "<title>Rádio Streaming Profissional | NETZ</title>"},
		{"content=\"Servicio de streaming de audio en vivo con SonicPanel, AutoDJ, tráfico ilimitado y reproducción compatible con Android e iOS.\"", "content=\"Serviço de rádio streaming profissional com SonicPanel, AutoDJ, tráfego ilimitado e compatibilidade com Android e iOS.\""},
		{"¿Necesitas Una Forma De Realizar Streaming?", "¿Precisa de uma plataforma profissional de Streaming?"},
		{"AUDIO", "ÁUDIO"},
		{"Full Oyentes Ilimitados", "Ouvintes Ilimitados"},
		{"En NETZ te ofrecemos una nueva solución para tu radio online.", "Na NETZ oferecemos a solução definitiva com alta qualidade e estabilidade para a sua rádio online."},
		{"Herramientas Simples Y Potentes", "Ferramentas Simples e Extremamente Potentes"},
		{"Preguntas frecuentes", "Perguntas Frequentes"},
		{"¿Que es Radio Streaming?", "¿O que é Rádio Streaming?"},
		{"¿Los planes incluyen AutoDj?", "¿Os planos incluem sistema de AutoDJ?"},
		{"¿Los planes incluyen transferencia ilimitada?", "¿A transferência de dados (tráfego) é ilimitada?"},
		{"¿EL streaming se realiza bajo secure Streaming (https)?", "¿O streaming é transmitido com segurança via HTTPS (SSL)?"},
		{"¿Cuanto tiempo tarda en activarse mi cuenta?", "¿Quanto tempo leva para ativar minha rádio online?"},
		{"¿Puedo elegir un plan y luego cambiarlo por otro?", "¿Posso fazer upgrade de plano a qualquer momento?"},
		{"¿Qué sistemas operativos son compatibles con Radio Streaming?", "¿Quais sistemas operacionais e reprodutores são compatíveis?"},
		{"¿Cuál es la garantía de disponibilidad?", "¿Qual é a garantia de estabilidade e disponibilidade?"},
		{"¿Existe una política de devolución de dinero?", "¿Existe garantia e política de reembolso?"},
		{"¿Puedo cancelar mi servicio?", "¿Posso cancelar o serviço quando desejar?"},
	}
	return applyReplacements(c, pairs)
}

func translateVideoStreaming(c string) string {
	pairs := [][2]string{
		{"<title>Video Streaming en Vivo | NETZ</title>", "<title>Vídeo Streaming ao Vivo | NETZ</title>"},
		{"content=\"Transmisión de video en vivo HD 720p con SSL, reproductores HTML5 y soporte multiplataforma.\"", "content=\"Transmissão de vídeo ao vivo em HD com SSL, players HTML5 e suporte multiplataforma.\""},
		{"Video Streaming", "Vídeo Streaming"},
		{"Transmite tus eventos en vivo con la máxima calidad y sin interrupciones", "Transmita seus eventos ao vivo com máxima qualidade, baixa latência e sem interrupções"},
		{"Calidad máxima 720p", "Qualidade HD de alta definição"},
		{"Streaming seguro bajo protocolo HTTPS (SSL)", "Transmissão 100% segura sob protocolo HTTPS (SSL)"},
	}
	return applyReplacements(c, pairs)
}

func translateResellerCpanel(c string) string {
	pairs := [][2]string{
		{"<title>Revendedor de Hosting cPanel & WHM | NETZ</title>", "<title>Revenda de Hospedagem cPanel & WHM | NETZ</title>"},
		{"content=\"Inicia tu propio negocio de hosting con nuestra plataforma de revendedor cPanel & WHM de alta velocidad y recursos independientes.\"", "content=\"Inicie seu próprio negócio de hospedagem com nossa revenda cPanel & WHM de alta performance e recursos dedicados por conta.\""},
		{"Alojamiento de<br> revendedor", "Revenda de<br> Hospedagem"},
		{"Alojamiento de revendedor potente, rápido y", "Revenda de hospedagem potente, rápida e"},
		{"¡Disponemos del plan ideal para iniciar tu negocio!", "Temos o plano ideal para você começar ou expandir o seu negócio de hospedagem!"},
		{"Alojamiento de revendedor, ideal para alojar varios sitios o blogs.", "Hospedagem para revendedores, ideal para hospedar múltiplos sites e clientes com facilidade."},
		{"(por cuenta de cPanel)", "(por conta de cPanel)"},
		{"(Certificado SSL Gratis<br>en todas las cuentas)", "(Certificado SSL Grátis<br>em todas as contas criadas)"},
		{"PANEL DE CONTROL LÍDER EN LA INDUSTRIA Y GESTIÓN DE DISTRIBUIDORES", "PAINEL DE CONTROLE LÍDER MUNDIAL COM GERENCIAMENTO WHM COMPLETO"},
		{"Tu marca", "Sua Própria Marca (White-label)"},
		{"Migración", "Migração Gratuita"},
		{"¿Cómo funciona?", "¿Como funciona a revenda de hospedagem?"},
		{"Negocios de bajo costo", "Negócio com baixo custo inicial"},
		{"Ingresos fijos", "Receita recorrente e previsível"},
		{"Automatización", "Automação com WHMCS e cPanel"},
		{"<span>Nosotros nos encargamos de...</span>", "<span>Nós cuidamos de...</span>"},
		{"Gestionar la plataforma", "Manter os servidores e a rede operando 24 horas por dia"},
		{"Seguridad del servidor", "Segurança, firewall BitNinja, backups e proteção contra DDoS"},
		{"Aplicaciones y software", "Atualizações constantes de software, PHP e cPanel"},
		{"<span>Tú te encargas de...</span>", "<span>Você cuida de...</span>"},
		{"Apoyando a sus clientes", "Definir seus preços, planos e atender seus clientes"},
		{"Gestionar su negocio", "Gerenciar o crescimento da sua empresa"},
		{"Configurar cuentas de cliente", "Criar contas cPanel para seus clientes com um clique"},
	}
	return applyReplacements(c, pairs)
}

func translateResellerDirectAdmin(c string) string {
	pairs := [][2]string{
		{"<title>Revendedor de Hosting DirectAdmin | NETZ</title>", "<title>Revenda de Hospedagem DirectAdmin | NETZ</title>"},
		{"content=\"Servicio de revendedor económico y potente con panel DirectAdmin, soporte 24/7 y activación instantánea.\"", "content=\"Serviço de revenda econômico e potente com painel DirectAdmin, suporte 24/7 e ativação instantânea.\""},
		{"Alojamiento de revendedor", "Revenda de Hospedagem"},
		{"Desarrollado por DirectAdmin", "Painel DirectAdmin"},
		{"¡Disponemos del plan ideal para iniciar tu negocio!", "Temos o plano ideal para impulsionar o seu negócio de hospedagem!"},
	}
	return applyReplacements(c, pairs)
}

func translateAbout(c string) string {
	pairs := [][2]string{
		{"<title>Sobre Nosotros | NETZ</title>", "<title>Sobre a NETZ | Líder em Hospedagem e Domínios</title>"},
		{"content=\"Conoce la historia, misión, infraestructura y equipo detrás de NETZ, tu proveedor confiable de soluciones web.\"", "content=\"Conheça a história, missão, infraestrutura e o time por trás da NETZ, sua parceira de confiança em tecnologia web.\""},
		{"Mejor Proveedor De Alojamiento Web", "Líder em Infraestrutura Web e Conectividade"},
		{"SOBRE EL EQUIPO DE", "CONHEÇA A EQUIPE DA NETZ"},
		{"Estamos contigo en <br>cada paso del camino", "Estamos ao seu lado em <br>cada etapa do seu crescimento"},
		{"Nuestros clientes<br>son lo primero", "Nossos clientes<br>em primeiro lugar"},
		{"Información importante", "Informações Importantes"},
		{"Copias de seguridad diarias automáticas", "Backups automáticos diários em servidores externos redundantes"},
		{"Aumento de recursos", "Expansão de recursos imediata"},
		{"Modificación de plan", "Mudança flexível de planos sem interrupção de serviço"},
		{"Sobre Nosotros", "Sobre Nós"},
		{"Lo Que Dicen Nuestros Clientes<br>Sobre Nosotros", "O Que Nossos Clientes Dizem<br>Sobre a NETZ"},
		{"No llegue a tener problemas", "Nunca tive problemas com a estabilidade"},
		{"Rápida respuesta", "Suporte rápido e muito atencioso"},
		{"Muy accesibles", "Planos acessíveis com excelente qualidade"},
		{"Estoy muy contento", "Excelente atendimento e performance impecável"},
		{"Mi tienda online", "Minha loja online ficou muito mais rápida"},
		{"Buen servicio de VPS", "Servidores VPS estáveis e velozes"},
	}
	return applyReplacements(c, pairs)
}

func translateContact(c string) string {
	pairs := [][2]string{
		{"<title>Contacto y Soporte | NETZ</title>", "<title>Contato e Atendimento | NETZ</title>"},
		{"content=\"Ponte en contacto con el equipo de soporte técnico y comercial de NETZ. Estamos disponibles para ayudarte 24/7.\"", "content=\"Entre em contato com nossa equipe comercial e de suporte técnico. Estamos disponíveis 24 horas por dia, 7 dias por semana.\""},
		{"¿Todavía tienes preguntas?", "Ainda tem dúvidas?"},
		{"PUEDES\n                        HABLAR CON NOSOTROS.", "FALE CONOSCO DIRETAMENTE."},
		{"PUEDES HABLAR CON NOSOTROS.", "FALE CONOSCO DIRETAMENTE."},
		{"<a href=\"index\">Inicio</a> - Contactos", "<a href=\"index\">Início</a> - Contato"},
		{"Ponte en contacto<span>Cuentanos ¿Cómo pueden nuestros servicios hacer crecer su\n                                negocio?</span>", "Entre em contato<span>Conte-nos: como nossos serviços podem impulsionar o seu negócio?</span>"},
		{"placeholder=\"Nombre\"", "placeholder=\"Seu Nome Completo\""},
		{"placeholder=\"Correo electronico\"", "placeholder=\"Seu E-mail Corporativo\""},
		{"placeholder=\"Ingrese su mensaje\"", "placeholder=\"Digite sua mensagem detalhada...\""},
		{">Enviar<", ">Enviar Mensagem<"},
		{"¿Necesitas<br>ayuda inmediata?", "¿Precisa de<br>ajuda imediata?"},
		{"Nuestro equipo de apoyo está a su disposición<br>24 horas al\n                        día, 7 días a la semana.", "Nosso time de suporte especializado está disponível<br>24 horas por dia, 7 dias por semana."},
	}
	return applyReplacements(c, pairs)
}

func translateCentroDeAyuda(c string) string {
	pairs := [][2]string{
		{"<title>Centro de Ayuda y Preguntas Frecuentes | NETZ</title>", "<title>Central de Ajuda e Perguntas Frequentes | NETZ</title>"},
		{"content=\"Encuentra respuestas a preguntas comunes sobre hosting, dominios, streaming, servidores VPS y métodos de pago en NETZ.\"", "content=\"Encontre respostas imediatas sobre hospedagem, domínios, streaming, servidores VPS e pagamentos na NETZ.\""},
		{"<span>Centro de Ayuda</span>Es posible que hayamos respondido su\n                    pregunta<br> Deslice hacia abajo", "<span>Central de Ajuda</span>Tire suas dúvidas agora mesmo<br> Navegue pelos tópicos abaixo"},
		{"Si aun así no encuentra la respuesta que necesita, no dude en contactarnos,\n                    con gusto lo ayudaremos", "Se ainda assim precisar de orientação personalizada, nossa equipe terá o maior prazer em ajudar:"},
		{"Comprar Hosting", "Contratar Hospedagem"},
		{"Al confiar en nosotros con sus necesidades de negocio, le prometemos un\n                            99.9% de tiempo de actividad", "Ao confiar em nossa infraestrutura, garantimos 99.9% de disponibilidade em todos os serviços fornecidos."},
		{"En el caso de que el dominio con la extensión que necesita no disponemos en\n                            el buscador.", "Caso a extensão de domínio que você procura não apareça no verificador, fale conosco para ativação manual."},
		{"No hay problema contáctanos que activaremos de forma manual.", "Ativação rápida e transparente para qualquer extensão desejada."},
		{"Soporte 24/7", "Suporte 24/7"},
		{"Nuestra dedicación al servicio de atención al cliente llega también a todo\n                            el mundo.", "Atendimento humanizado e especializado disponível em múltiplos canais para apoiar seu crescimento online."},
		{"Abrir Ticket", "Abrir Chamado"},
		{"Realizar Pago", "Faturas e Pagamento"},
		{"Pagar Ahora", "Acessar Faturas"},
		{"placeholder=\"Busque su pregunta aquí..\"", "placeholder=\"Pesquise sua dúvida aqui...\""},
		{"¿Quienes somos?", "¿Quem é a NETZ?"},
		{"¿Que es un dominio?", "¿O que é um domínio na internet?"},
		{"¿Como funciona un dominio?", "¿Como funciona um nome de domínio?"},
		{"¿Migrar un dominio tiene algún costo?", "¿A migração de um domínio possui custos adicionais?"},
		{"¿Cómo migrar un dominio?", "¿Como migrar meu domínio para a NETZ?"},
		{"¿Que es un Hosting?", "¿O que é Hospedagem de Sites (Web Hosting)?"},
		{"¿Como comprar mi plan de hosting?", "¿Como contratar meu plano de hospedagem?"},
		{"¿Se puede comprar hosting para juegos online?", "¿Posso utilizar a hospedagem para servidores de jogos?"},
		{"¿Qué son los correos profesionales?", "¿O que são e-mails profissionais corporativos?"},
		{"¿Los planes de Hosting son gestionados?", "¿Os planos de hospedagem são gerenciados?"},
		{"¿Es necesario contratar un dominio al adquirir un plan?", "¿Preciso registrar um novo domínio ao adquirir um plano?"},
		{"¿Como puedo cambiar los nameservers de mi dominio?", "¿Como alterar os servidores DNS (Nameservers) do meu domínio?"},
		{"¿Que tipo de base de datos están incluidas?", "¿Quais tipos de bancos de dados estão inclusos?"},
		{"¿Los planes incluyen transferencia ilimitada?", "¿Os planos possuem transferência (tráfego) ilimitada?"},
		{"¿Que contenido puedo alojar?", "¿Que tipo de conteúdo é permitido hospedar?"},
		{"¿En que sistema operativo funcionan los servidores?", "¿Qual sistema operacional roda em nossos servidores de hospedagem?"},
		{"¿Cuanto tarda en activarse mi cuenta?", "¿Quanto tempo leva para ativar meu plano após o pagamento?"},
		{"¿Ofrecemos conexión SSH?", "¿O acesso SSH está disponível?"},
		{"¿Ofrecemos rubygems, Python y node.js?", "¿Há suporte nativo a Ruby, Python e Node.js?"},
		{"¿Puedo elegir un plan y cambiarlo por otro?", "¿Posso fazer upgrade ou alterar meu plano no futuro?"},
		{"¿Cuantos correos puedo enviar como máximo por hora?", "¿Qual é o limite de envio de e-mails por hora?"},
	}
	return applyReplacements(c, pairs)
}

func translateTerminos(c string) string {
	pairs := [][2]string{
		{"<title>Términos del Servicio | NETZ</title>", "<title>Termos de Serviço | NETZ</title>"},
		{"content=\"Términos del Servicio y Condiciones de Contratación de NETZ. Conoce nuestras políticas de uso, garantías y reembolsos.\"", "content=\"Termos de Serviço e Condições Gerais de Contratação da NETZ. Conheça nossas políticas de uso, garantias e reembolso.\""},
		{"Términos del Servicio", "Termos de Serviço"},
		{"Términos de Servicio", "Termos de Serviço"},
		{"Condiciones Generales de Contratación", "Condições Gerais de Contratação"},
		{"Términos del\n                        Servicio y Política de Reembolso", "Termos de Serviço e Política de Reembolso"},
		{"El presente contrato regula los términos, condiciones, modalidades de\n                        contratación y políticas de reembolso aplicables a todos los servicios provistos por NETZ", "O presente contrato regula os termos, condições, modalidades de contratação e políticas de reembolso aplicáveis a todos os serviços prestados pela NETZ"},
		{"1. PROCESO DE CONTRATACIÓN Y COMPRA", "1. PROCESSO DE CONTRATAÇÃO E COMPRA"},
		{"La contratación de los servicios de NETZ se realiza en forma directa y transparente a través de\n                        nuestra plataforma web:", "A contratação dos serviços da NETZ é realizada de forma direta e transparente através de nossa plataforma web:"},
		{"Selección del Plan:", "Seleção do Plano:"},
		{"Registro de Cuenta:", "Cadastro da Conta:"},
		{"Pago Seguro:", "Pagamento Seguro:"},
		{"Confirmación de Orden:", "Confirmação do Pedido:"},
		{"2. TIEMPOS Y POLÍTICA DE ACTIVACIÓN DE SERVICIOS", "2. PRAZOS E POLÍTICA DE ATIVAÇÃO DE SERVIÇOS"},
		{"NETZ implementa procesos de provisión según la naturaleza del servicio contratado:", "A NETZ adota processos de ativação ágeis de acordo com a natureza do serviço contratado:"},
		{"Servicios Estándar (Activación Instantánea):", "Serviços Padrão (Ativação Instantânea):"},
		{"Servicios Personalizados o a Medida:", "Serviços Customizados ou Sob Medida:"},
		{"3. GARANTÍA DE SATISFACCIÓN, POLÍTICA DE DEVOLUCIONES Y REEMBOLSOS", "3. GARANTIA DE SATISFAÇÃO, POLÍTICA DE DEVOLUÇÃO E REEMBOLSO"},
		{"En NETZ respaldamos la calidad de nuestra infraestructura y el compromiso con nuestros clientes:", "Na NETZ garantimos a qualidade da nossa infraestrutura e o compromisso permanente com nossos clientes:"},
		{"Garantía de 30 Días para Web Hosting:", "Garantia de 30 Dias para Hospedagem de Sites:"},
		{"Plazo y Modalidad de Procesamiento:", "Prazos e Modalidade de Processamento:"},
		{"Excepciones y Servicios No Reembolsables:", "Exceções e Serviços Não Reembolsáveis:"},
		{"4. CANCELACIÓN VOLUNTARIA DE SERVICIOS", "4. CANCELAMENTO VOLUNTÁRIO DE SERVIÇOS"},
		{"El cliente tiene total libertad para solicitar la cancelación voluntaria", "O cliente possui total liberdade para solicitar o cancelamento voluntário"},
		{"No existen contratos de permanencia forzosa ni penalizaciones por baja anticipada.", "Não existem contratos de fidelidade compulsória ou multas por cancelamento antecipado."},
		{"5. POLÍTICA DE USO ACEPTABLE Y CONTENIDOS", "5. POLÍTICA DE USO ACEITÁVEL E CONTEÚDOS"},
		{"Queda terminantemente prohibido alojar o transmitir:", "É estritamente proibido hospedar ou transmitir:"},
		{"6. NIVELES DE SERVICIO Y SOPORTE TÉCNICO", "6. NÍVEIS DE SERVIÇO E SUPORTE TÉCNICO"},
		{"7. COPIAS DE SEGURIDAD (BACKUPS)", "7. CÓPIAS DE SEGURANÇA (BACKUPS)"},
		{"8. JURISDICCIÓN Y LEY APLICABLE", "8. LEGISLAÇÃO APLICÁVEL E FORO"},
		{"Última Actualización:", "Última Atualização:"},
		{"Al utilizar nuestros servicios aceptas el", "Ao utilizar nossos serviços você aceita o"},
		{"Nuestro equipo de soporte está aquí para usted 24/7", "Nossa equipe de suporte está à sua disposição 24/7"},
	}
	return applyReplacements(c, pairs)
}

func translatePrivacidad(c string) string {
	pairs := [][2]string{
		{"<title>Política de Privacidad | NETZ</title>", "<title>Política de Privacidade | NETZ</title>"},
		{"content=\"Política de Privacidad y Tratamiento de Datos Personales de NETZ. Transparencia, seguridad y cumplimiento normativo.\"", "content=\"Política de Privacidade e Tratamento de Dados Pessoais da NETZ. Transparência, segurança e respeito aos seus dados.\""},
		{"Politica de Privacidad", "Política de Privacidade"},
		{"Política de Privacidad", "Política de Privacidade"},
		{"Compromiso con su Privacidad", "Compromisso com a sua Privacidade"},
		{"Protección de Datos\n                        Personales", "Proteção de Dados Pessoais"},
		{"NETZ garantiza el tratamiento seguro,\n                        confidencial y lícito de sus datos personales.", "A NETZ garante o tratamento seguro, confidencial e legítimo de todos os seus dados pessoais."},
		{"1. RESPONSABLE DEL TRATAMIENTO", "1. CONTROLADOR E RESPONSÁVEL PELO TRATAMENTO"},
		{"2. DATOS QUE RECOPILAMOS Y FINALIDAD", "2. DADOS COLETADOS E FINALIDADE DO TRATAMENTO"},
		{"3. VERACIDAD Y EXACTITUD DE LOS DATOS", "3. VERACIDADE E EXATIDÃO DOS DADOS"},
		{"4. DERECHOS DEL TITULAR (DERECHOS ARCO)", "4. DIREITOS DO TITULAR DOS DADOS"},
		{"5. SEGURIDAD DE LA INFORMACIÓN Y CERTIFICADOS SSL", "5. SEGURANÇA DA INFORMAÇÃO E CERTIFICADOS SSL"},
		{"6. TRANSFERENCIA INTERNACIONAL Y ALMACENAMIENTO", "6. TRANSFERÊNCIA INTERNACIONAL E ARMAZENAMENTO"},
		{"7. CONSERVACIÓN DE LOS DATOS", "7. RETENÇÃO E CONSERVAÇÃO DOS DADOS"},
		{"8. USO DE COOKIES", "8. POLÍTICA DE COOKIES"},
		{"Última Actualización:", "Última Atualização:"},
		{"Al utilizar nuestros servicios aceptas el", "Ao utilizar nossos serviços você aceita o"},
		{"Nuestro equipo de soporte está aquí para usted 24/7", "Nossa equipe de suporte está à sua disposição 24/7"},
	}
	return applyReplacements(c, pairs)
}

func translateAvisoLegal(c string) string {
	pairs := [][2]string{
		{"<title>Aviso Legal | NETZ</title>", "<title>Aviso Legal e Informações Regulatórias | NETZ</title>"},
		{"content=\"Aviso Legal e Información General de NETZ. Datos identificatorios del prestador, condiciones de uso y propiedad intelectual.\"", "content=\"Aviso Legal e Informações Gerais da NETZ. Dados identificatórios do provedor, termos de uso e propriedade intelectual.\""},
		{"Aviso Legal", "Aviso Legal"},
		{"1. INFORMACIÓN GENERAL DEL PRESTADOR", "1. INFORMAÇÕES GERAIS DO PROVEDOR"},
		{"2. OBJETO Y ÁMBITO DE APLICACIÓN", "2. OBJETO E ÂMBITO DE APLICAÇÃO"},
		{"3. PROPIEDAD INTELECTUAL E INDUSTRIAL", "3. PROPRIEDADE INTELECTUAL E INDUSTRIAL"},
		{"4. CONDICIONES DE USO DEL PORTAL", "4. CONDIÇÕES DE USO DO SITE"},
		{"5. EXENCIÓN DE RESPONSABILIDAD", "5. ISENÇÃO DE RESPONSABILIDADE"},
		{"6. ENLACES A TERCEROS", "6. LINKS PARA TERCEIROS"},
		{"7. COMUNICACIONES ELECTRÓNICAS", "7. COMUNICAÇÕES ELETRÔNICAS"},
		{"8. LEGISLACIÓN APLICABLE Y JURISDICCIÓN", "8. LEGISLAÇÃO APLICÁVEL E FORO"},
		{"Última Actualización:", "Última Atualização:"},
		{"Al utilizar nuestros servicios aceptas el", "Ao utilizar nossos serviços você aceita o"},
		{"Nuestro equipo de soporte está aquí para usted 24/7", "Nossa equipe de suporte está à sua disposição 24/7"},
	}
	return applyReplacements(c, pairs)
}

func translate404(c string) string {
	pairs := [][2]string{
		{"<title>Página no encontrada (404) | NETZ</title>", "<title>Página não encontrada (404) | NETZ</title>"},
		{"content=\"La página que buscas no existe o ha sido movida.\"", "content=\"A página que você procura não existe ou foi movida.\""},
		{"Oops! Lo siento, esta página no existe!<small>Si el problema persiste, por\n                        favor contacta con el administrador.</small>", "Ops! Desculpe, esta página não existe!<small>Se o problema persistir, entre em contato com a nossa equipe de suporte.</small>"},
		{"Volver al Inicio", "Voltar ao Início"},
	}
	return applyReplacements(c, pairs)
}
