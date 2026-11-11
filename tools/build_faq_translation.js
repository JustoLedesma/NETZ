const fs = require('fs');

const faqEnglishMap = [
    {
        num: "01",
        q_es: "¿Quienes somos?",
        q_en: "Who are we?",
        a_en: "<p>We are a specialized digital cloud provider offering Unlimited Web Hosting, VPS Cloud Servers, Audio & Video Streaming, and Domain Registration. With over 7 years in the market, our mission is to deliver enterprise-grade performance, high availability, and 24/7 dedicated support to clients worldwide.</p>"
    },
    {
        num: "02",
        q_es: "¿Que es un dominio?",
        q_en: "What is a domain name?",
        a_en: "<p>A domain name is the unique, exclusive digital address that identifies your website on the Internet (such as netz.com.py or yourbrand.com). It allows visitors to access your online presence easily without having to memorize complex numerical IP addresses.</p>"
    },
    {
        num: "03",
        q_es: "¿Como funciona un dominio?",
        q_en: "How does a domain name work?",
        a_en: "<p>A domain acts as a pointer directed to the web server that hosts your website files and databases. When a visitor types your domain into a browser, global Domain Name Servers (DNS) translate the name into your server's IP address and deliver the webpage immediately.</p>"
    },
    {
        num: "04",
        q_es: "Busco dominios de Paraguay! com.py net.py coop.py edu.py gov.py mil.py org.py",
        q_en: "Looking for regional Paraguay (.py) domains? (.com.py, .net.py, .org.py)",
        a_en: "<p>Yes! We register and manage regional ccTLDs including .com.py, .net.py, and .org.py. If you need specialized documentation assistance for institutional extensions (.edu.py, .gov.py), our support team will handle manual verification and setup on your behalf.</p>"
    },
    {
        num: "05",
        q_es: "¿Migrar un dominio tiene algún costo?",
        q_en: "Does migrating or transferring a domain have any cost?",
        a_en: "<p>Pointing your existing domain nameservers to our hosting platform is 100% free. For registrar transfers (gTLDs like .com, .net), standard ICANN renewal fees apply, which extends your domain expiration date by one full additional year.</p>"
    },
    {
        num: "06",
        q_es: "¿Cómo migrar un dominio?",
        q_en: "How do I migrate my domain to NETZ?",
        a_en: "<p>To migrate your domain, simply update its nameservers (DNS) at your current registrar to our high-speed nameservers: <code>ns1.netz.com.py</code> and <code>ns2.netz.com.py</code>. DNS propagation typically completes across worldwide networks within 2 to 24 hours.</p>"
    },
    {
        num: "07",
        q_es: "¿Que es un Hosting?",
        q_en: "What is Web Hosting?",
        a_en: "<p>Web Hosting is the physical and virtual server infrastructure where your website’s files, code, databases, images, and email accounts reside. When someone enters your domain name, the hosting server delivers those files to the user's browser securely and instantly.</p>"
    },
    {
        num: "08",
        q_es: "¿Como comprar mi plan de hosting?",
        q_en: "How do I purchase a web hosting plan?",
        a_en: "<p>Choose the hosting plan that matches your project needs on our website, select whether you need a new domain or want to connect an existing one, choose your billing cycle, and complete secure checkout. Your account credentials will be provisioned instantly.</p>"
    },
    {
        num: "09",
        q_es: "¿Se puede comprar hosting para juegos online?",
        q_en: "Can I use web hosting for online gaming servers?",
        a_en: "<p>Shared Web Hosting is optimized specifically for websites, databases, and emails. For running game servers (such as Minecraft, CS:GO, or Rust), we recommend our high-performance Linux VPS or Windows VPS servers, which provide dedicated CPU cores, full root access, and unmetered UDP traffic.</p>"
    },
    {
        num: "10",
        q_es: "¿Qué son los correos profesionales?",
        q_en: "What are professional corporate emails?",
        a_en: "<p>Professional corporate emails are email addresses that utilize your own custom domain (such as <code>contact@yourcompany.com</code>) instead of generic providers like Gmail or Yahoo. They reinforce brand credibility, include webmail access, spam protection, and sync seamlessly with mobile devices and desktop mail clients.</p>"
    },
    {
        num: "11",
        q_es: "¿Los planes de Hosting son gestionados?",
        q_en: "Are web hosting plans managed?",
        a_en: "<p>Yes, all NETZ web hosting plans are fully managed at the server level. We oversee hardware health, OS updates, firewall security, server patches, and network uptime so you can focus on building your website via the intuitive cPanel interface.</p>"
    },
    {
        num: "12",
        q_es: "¿Es necesario contratar un dominio al adquirir un plan?",
        q_en: "Do I need to purchase a domain when ordering a plan?",
        a_en: "<p>No. You can use an existing domain you already own and point its DNS to our servers. Alternatively, you can register a new domain name during the checkout process.</p>"
    },
    {
        num: "13",
        q_es: "¿Como puedo cambiar los nameservers de mi dominio?",
        q_en: "How do I change my domain nameservers?",
        a_en: "<p>Log in to the management dashboard where your domain is registered and locate the DNS/Nameservers section. Replace the current records with our nameservers: <code>ns1.netz.com.py</code> and <code>ns2.netz.com.py</code> and save changes.</p>"
    },
    {
        num: "14",
        q_es: "¿Que tipo de base de datos están incluidas?",
        q_en: "What database types are included?",
        a_en: "<p>All hosting plans include unlimited high-performance MySQL and MariaDB databases powered by phpMyAdmin for easy table creation, backup exports, and optimization.</p>"
    },
    {
        num: "15",
        q_es: "¿Los planes incluyen transferencia ilimitada?",
        q_en: "Do plans include unmetered bandwidth?",
        a_en: "<p>Yes. Our shared and dedicated web hosting plans include unmetered bandwidth, allowing your website to handle high traffic spikes without overage charges, subject to fair acceptable use terms.</p>"
    },
    {
        num: "16",
        q_es: "¿Que contenido puedo alojar?",
        q_en: "What content is permitted on NETZ servers?",
        a_en: "<p>You may host any legitimate personal, commercial, or institutional content. In compliance with international law and our Terms of Service, hosting malware, phishing pages, copyrighted material without authorization, spam scripts, or illicit content is strictly prohibited.</p>"
    },
    {
        num: "17",
        q_es: "¿En que sistema operativo funcionan los servidores?",
        q_en: "What operating systems power your hosting servers?",
        a_en: "<p>Our web hosting infrastructure runs on enterprise CloudLinux OS paired with LiteSpeed Web Server, ensuring high stability, account isolation, and multi-version PHP support.</p>"
    },
    {
        num: "18",
        q_es: "¿Cuanto tarda en activarse mi cuenta?",
        q_en: "How long does account activation take?",
        a_en: "<p>Web hosting, preconfigured VPS, and streaming accounts are provisioned automatically and instantly as soon as payment is confirmed by our gateway.</p>"
    },
    {
        num: "19",
        q_es: "¿Ofrecemos conexión SSH?",
        q_en: "Do you provide SSH access?",
        a_en: "<p>Yes, secure jailed SSH access can be activated for verified accounts upon request via our customer support portal.</p>"
    },
    {
        num: "20",
        q_es: "¿Ofrecemos rubygems, Python y node.js?",
        q_en: "Do you support Ruby, Python, and Node.js?",
        a_en: "<p>Yes. Through CloudLinux App Selector inside cPanel, you can select and deploy various versions of Node.js, Python, and Ruby applications with one click.</p>"
    },
    {
        num: "21",
        q_es: "¿Puedo elegir un plan y cambiarlo por otro?",
        q_en: "Can I upgrade or downgrade my plan later?",
        a_en: "<p>Yes, you can scale your hosting or VPS plan up or down at any time from your client area. Upgrades are prorated and executed seamlessly without website downtime.</p>"
    },
    {
        num: "22",
        q_es: "¿Cuantos correos puedo enviar como máximo por hora?",
        q_en: "What is the maximum hourly email sending limit?",
        a_en: "<p>To protect server IP reputation and maintain 100% inbox delivery via MailChannels Cloud, shared hosting accounts have a default limit of 200 emails per hour per domain.</p>"
    },
    {
        num: "23",
        q_es: "¿Ofrecemos promociones y descuentos generales?",
        q_en: "Do you offer promotional discounts or seasonal deals?",
        a_en: "<p>Yes! We offer 2 months free when choosing annual billing cycles, as well as periodic seasonal discounts published on our homepage and newsletter.</p>"
    },
    {
        num: "24",
        q_es: "¿Cuales son los métodos de pagos?",
        q_en: "What payment methods are accepted?",
        a_en: "<p>We accept major credit and debit cards (Visa, MasterCard, American Express), PayPal, electronic bank transfers, and local electronic payment options.</p>"
    },
    {
        num: "25",
        q_es: "Ya pagué. ¿Cuanto tardan en darme de alta?",
        q_en: "Payment completed. How long until my service is active?",
        a_en: "<p>Credit card and PayPal transactions activate instantly. Bank transfers and manual payments are validated by our accounting desk within business hours promptly upon receipt of the payment voucher.</p>"
    },
    {
        num: "26",
        q_es: "¿Puede haber alguna alteración precios?",
        q_en: "Can renewal prices change?",
        a_en: "<p>We pride ourselves on transparent pricing with no hidden renewal markups. Any industry-wide licensing price adjustments (e.g., from cPanel or ICANN) are communicated well in advance.</p>"
    },
    {
        num: "27",
        q_es: "¿Ofrecemos alguna garantía de devolución?",
        q_en: "Do you offer a money-back guarantee?",
        a_en: "<p>Yes, we provide an unconditional 30-day money-back guarantee on all shared and reseller web hosting plans if you are not completely satisfied with our performance.</p>"
    },
    {
        num: "28",
        q_es: "¿Puedo cancelar mi servicio?",
        q_en: "Can I cancel my service at any time?",
        a_en: "<p>Yes. You have complete freedom to cancel your subscription at any time directly through the client area with no cancellation penalties or lock-in contracts.</p>"
    },
    {
        num: "29",
        q_es: "No he pagado mi factura, ¿mi servicio será suspendido?",
        q_en: "My invoice is overdue. Will my service be suspended?",
        a_en: "<p>We offer a grace period following invoice due dates. If payment is not recorded after several automatic reminder notices, services are temporarily suspended to protect resources, with automatic reactivation upon invoice settlement.</p>"
    },
    {
        num: "30",
        q_es: "¿Tienen tutoriales o guías de ayuda?",
        q_en: "Do you provide tutorials or technical guides?",
        a_en: "<p>Yes, our comprehensive Knowledgebase and Help Center feature step-by-step guides covering DNS setup, email configuration on mobile/Outlook, cPanel navigation, and CMS installation.</p>"
    },
    {
        num: "31",
        q_es: "He transferido mi dominio con NETZ, ¿Cuanto tardara en completarse la transferencia?",
        q_en: "I initiated a domain transfer to NETZ. How long does it take?",
        a_en: "<p>Standard gTLD domain transfers (.com, .net, .org) typically complete within 5 to 7 days once authorized by the domain owner and released by the losing registrar.</p>"
    },
    {
        num: "32",
        q_es: "¿Puedo programar trabajos cron (Cron Jobs)?",
        q_en: "Can I schedule automated Cron Jobs?",
        a_en: "<p>Yes. Full Cron Job scheduling is supported directly through cPanel, allowing you to automate repetitive tasks, maintenance scripts, and database backups.</p>"
    },
    {
        num: "33",
        q_es: "¿Se permite el envió de Spam?",
        q_en: "Is spam or bulk unsolicited mailing permitted?",
        a_en: "<p>Strictly no. Sending unsolicited bulk email (SPAM) is a zero-tolerance violation resulting in immediate account suspension and termination to protect server reputation.</p>"
    },
    {
        num: "34",
        q_es: "¿El servicio es compatible con CloudFlare?",
        q_en: "Is your platform compatible with Cloudflare CDN?",
        a_en: "<p>Yes, our infrastructure is 100% compatible with Cloudflare CDN and security proxies. You can integrate your domain seamlessly by pointing DNS records or using our built-in tools.</p>"
    },
    {
        num: "35",
        q_es: "¿Puedo realizar copias de seguridad?",
        q_en: "Can I create and download backups?",
        a_en: "<p>Yes, you can generate full or partial website, database, and email backups anytime via cPanel and download them to your local storage for complete safety.</p>"
    },
    {
        num: "36",
        q_es: "¿Cual es nuestro nivel de seguridad?",
        q_en: "What security measures are implemented?",
        a_en: "<p>We deploy enterprise-grade security including BitNinja Web Application Firewall (WAF), real-time malware scanners, multi-layer DDoS mitigation, and CageFS account virtualization.</p>"
    },
    {
        num: "37",
        q_es: "¿Cual es nuestra garantía de disponibilidad?",
        q_en: "What is your service uptime SLA?",
        a_en: "<p>We guarantee a 99.9% uptime SLA across all web hosting, cloud VPS, and streaming infrastructure, backed by redundant power grids and multi-homed BGP network routing.</p>"
    },
    {
        num: "38",
        q_es: "¿Puedo instalar aplicaciones en 1 clic?",
        q_en: "Can I install web applications with 1 click?",
        a_en: "<p>Yes! With our Softaculous 1-click app installer, you can automatically install WordPress, Joomla, PrestaShop, Drupal, and over 400 popular scripts in seconds.</p>"
    },
    {
        num: "39",
        q_es: "¿Hacen diseño web?",
        q_en: "Do you provide custom web design services?",
        a_en: "<p>Our primary focus is cloud hosting and infrastructure engineering. However, all plans include our drag-and-drop SitePro website builder so you can build stunning, mobile-responsive websites effortlessly.</p>"
    },
    {
        num: "40",
        q_es: "¿Que es HTTPS y por que es tan importante?",
        q_en: "What is HTTPS and why is it essential?",
        a_en: "<p>HTTPS encrypts data transmitted between a visitor's web browser and your server, ensuring privacy and protecting passwords and transactions against interception. It also improves search engine rankings on Google and builds customer trust.</p>"
    },
    {
        num: "41",
        q_es: "¿Por qué necesito un certificado SSL en mi sitio web?",
        q_en: "Why do I need an SSL certificate on my website?",
        a_en: "<p>An SSL certificate prevents browsers from marking your site as 'Not Secure', boosts conversion rates on eCommerce stores, and safeguards sensitive client information. We include free automated SSL on all hosted domains.</p>"
    },
    {
        num: "42",
        q_es: "¿Qué es un VPS linux no administrado?",
        q_en: "What is an Unmanaged Linux VPS?",
        a_en: "<p>An Unmanaged Linux VPS gives you isolated virtual hardware and full root SSH access. You are fully responsible for installing, configuring, and updating your operating system and web server environment.</p>"
    },
    {
        num: "43",
        q_es: "¿Los VPS linux no administrados incluye soporte?",
        q_en: "Does an Unmanaged Linux VPS include technical support?",
        a_en: "<p>Unmanaged VPS support covers hardware health, power redundancy, and network routing. Configuration of operating systems, third-party software, and scripts is managed by the client.</p>"
    },
    {
        num: "44",
        q_es: "¿Puedo actualizar mi servidor no administrado a administrado?",
        q_en: "Can I upgrade an unmanaged server to fully managed?",
        a_en: "<p>Yes. You can add our Full Server Management package to your unmanaged VPS at any time to have our engineering team manage maintenance, security, and updates.</p>"
    },
    {
        num: "45",
        q_es: "¿Cúal es la diferencia entre los servidores Unmanaged Linuxs y los servidores Linux completamente administrados?",
        q_en: "What is the difference between Unmanaged and Fully Managed Linux VPS?",
        a_en: "<p>With Unmanaged Linux VPS, you retain full root access and manage software configurations independently. With Managed Linux VPS, our team monitors server health, applies security patches, configures backups, and resolves technical issues 24/7 on your behalf.</p>"
    },
    {
        num: "46",
        q_es: "¿Existe algún beneficio al solicitar un VPS Unmanaged Linux?",
        q_en: "What are the benefits of choosing an Unmanaged Linux VPS?",
        a_en: "<p>Unmanaged VPS plans offer maximum cost efficiency and complete architectural freedom. Developers and system administrators have full authority to install custom kernels, libraries, and bespoke server software.</p>"
    },
    {
        num: "47",
        q_es: "¿Debo comprar un VPS Linux administrado o no administrado?",
        q_en: "Should I choose a Managed or Unmanaged Linux VPS?",
        a_en: "<p>If you have system administration experience and wish to customize every aspect of your OS, choose Unmanaged. If you prefer our certified engineers to handle maintenance, security, and troubleshooting, choose Managed.</p>"
    },
    {
        num: "48",
        q_es: "¿La utilización de recursos están limitados?",
        q_en: "Are VPS resources shared or limited?",
        a_en: "<p>No. VPS resources (CPU cores, dedicated RAM, NVMe storage) are dedicated to your virtual instance via KVM hypervisors with no resource contention from neighbors.</p>"
    },
    {
        num: "49",
        q_es: "¿Qué es un VPS de Windows?",
        q_en: "What is a Windows VPS Server?",
        a_en: "<p>A Windows VPS is a virtual server running licensed Windows Server with dedicated resources, accessible anywhere in the world via Remote Desktop Protocol (RDP).</p>"
    },
    {
        num: "50",
        q_es: "¿Cómo accedo a mi VPS de Windows?",
        q_en: "How do I connect to my Windows VPS?",
        a_en: "<p>You can connect to your Windows VPS using the native Remote Desktop Connection (RDP) client pre-installed on Windows, Mac, iOS, or Android devices using your server IP and Administrator password.</p>"
    },
    {
        num: "51",
        q_es: "¿Puedo navegar por internet con mi VPS de Windows?",
        q_en: "Can I browse the web using my Windows VPS?",
        a_en: "<p>Yes. Your Windows VPS functions exactly like a remote desktop computer. You can browse websites, download files, and run automated desktop applications smoothly.</p>"
    },
    {
        num: "52",
        q_es: "¿Proporciona licencias de Microsoft SQL (MSSQL)?",
        q_en: "Do you provide Microsoft SQL Server (MSSQL) licenses?",
        a_en: "<p>Yes. Official Microsoft SQL Server Web editions can be provisioned and attached to your Windows VPS directly through our client area.</p>"
    },
    {
        num: "53",
        q_es: "¿Mi VPS de Windows tendrá licencia?",
        q_en: "Will my Windows VPS include an official license?",
        a_en: "<p>Yes, all NETZ Windows VPS servers come with authentic, pre-activated Windows Server licenses through Microsoft SPLA compliance.</p>"
    },
    {
        num: "54",
        q_es: "¿Puedo actualizar mi VPS de Windows más adelante?",
        q_en: "Can I upgrade my Windows VPS resources later?",
        a_en: "<p>Yes. You can scale CPU cores, RAM, and SSD storage at any time with minimal reboot time directly via your dashboard.</p>"
    },
    {
        num: "55",
        q_es: "¿Ofrecen copias de seguridad en Windows VPS?",
        q_en: "Do you offer backup solutions for Windows VPS?",
        a_en: "<p>Yes, automated daily snapshot backups can be attached during checkout or enabled at any time to protect your critical data.</p>"
    },
    {
        num: "56",
        q_es: "¿Que se incluye en la gestión completa del servidor?",
        q_en: "What is included in Full Server Management?",
        a_en: "<p>Full Server Management includes 24/7 proactive monitoring, OS updates, security hardening, firewall configuration, DNS setup, troubleshooting, and hardware replacement guarantee.</p>"
    },
    {
        num: "57",
        q_es: "¿Mi VPS de Windows requerirá actualizaciones de Windows?",
        q_en: "Does my Windows VPS require Windows Updates?",
        a_en: "<p>Yes, periodic Windows Updates are essential for security and stability. You can schedule update cycles or have our team manage them seamlessly.</p>"
    },
    {
        num: "58",
        q_es: "¿Qué es un VPS Linux administrado?",
        q_en: "What is a Managed Linux VPS?",
        a_en: "<p>A Managed Linux VPS gives you dedicated cloud performance while our team handles server setup, software installations, security patches, and 24/7 technical troubleshooting.</p>"
    },
    {
        num: "59",
        q_es: "¿Me ayudan a emigrar de mi antiguo proveedor a NETZ?",
        q_en: "Will you help migrate my data from my previous host?",
        a_en: "<p>Yes! We offer free professional data migration for websites and cPanel accounts, ensuring zero downtime and complete data integrity.</p>"
    },
    {
        num: "60",
        q_es: "¿Qué se incluye en la gestión completa del servidor?",
        q_en: "What is covered under Full Management?",
        a_en: "<p>Our managed support team handles kernel updates, database tuning, web server optimization, real-time security alerts, and custom configuration assistance 24/7.</p>"
    },
    {
        num: "61",
        q_es: "¿Tengo el control total de mi VPS Linux?",
        q_en: "Do I have complete control of my Linux VPS?",
        a_en: "<p>Yes. Even on managed servers, you have full administrative root access and web control panel tools to manage your applications as you see fit.</p>"
    },
    {
        num: "62",
        q_es: "¿Puedo actualizar mi VPS de Linux más adelante?",
        q_en: "Can I scale my Linux VPS in the future?",
        a_en: "<p>Yes. You can instantly upgrade CPU, RAM, and NVMe disk space with zero data migration or IP address changes required.</p>"
    },
    {
        num: "63",
        q_es: "¿Puedo cargar mi propia ISO para usar en mi VPS Linux?",
        q_en: "Can I mount custom ISO images on my Linux VPS?",
        a_en: "<p>Yes. Our cloud control panel allows you to mount custom ISO images to install specialized operating systems or recovery utilities.</p>"
    },
    {
        num: "64",
        q_es: "¿Ofrecen una solución de copias de seguridad en Linux VPS?",
        q_en: "Do you offer backup solutions for Linux VPS?",
        a_en: "<p>Yes, automated daily snapshot backups are available to ensure rapid disaster recovery and point-in-time rollbacks.</p>"
    },
    {
        num: "65",
        q_es: "¿Como activo el certificado SSL en mi cuenta de Hosting?",
        q_en: "How do I activate the free SSL certificate on my hosting account?",
        a_en: "<p>Free 256-bit SSL certificates are provisioned and installed automatically via AutoSSL within minutes of pointing your domain to our servers. No manual configuration is required.</p>"
    }
];

fs.writeFileSync('tools/faq_english_map.json', JSON.stringify(faqEnglishMap, null, 2), 'utf8');
console.log('Saved 65 FAQ translations to tools/faq_english_map.json');

