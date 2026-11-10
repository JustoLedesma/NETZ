// Componente modular Navbar para HTML 00
(function () {
    window._navbarOffcanvasLoaded = true;

    const navbarHTML = `
        <nav id="coodiv-navbar-header" class="navbar navbar-expand-md fixed-header-layout">
            <div class="container main-header-coodiv-s">
                <a class="navbar-brand" href="index"><img src="/assets/img/header/NETZ-IA.svg" width="100px" alt="Logo" /></a>
                <button class="navbar-toggle offcanvas-toggle menu-btn-span-bar ml-auto" data-toggle="offcanvas" data-target="#offcanvas-menu-home">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <div class="collapse navbar-collapse navbar-offcanvas" id="offcanvas-menu-home">
                    <ul class="navbar-nav ml-auto">
                        <li class="nav-item dropdown">
                            <a class="nav-link" href="index">Inicio<span class="sr-only">(current)</span> </a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link" role="button" id="webhosting-megamenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" href="#">Hosting</a>
                            <div class="dropdown-menu coodiv-dropdown-header web-menu" aria-labelledby="webhosting-megamenu">
                                <ul class="web-hosting-menu-header">
                                    <li><i class="fas fa-infinity"></i> <a href="hosting-ilimitado">Hosting Ilimitado<span class="nav-new-tag">Servicio sin límites de recursos</span></a></li>
                                    <li><i class="fas fa-server"></i> <a href="hosting-exclusivo">Hosting Exclusivo<span>Recursos exclusivos</span></a></li>
                                </ul>
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link" role="button" id="vps-megamenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" href="#">Vps<span class="nav-new-tag">Nuevo</span></a>
                            <div class="dropdown-menu coodiv-dropdown-header web-menu" aria-labelledby="vps-megamenu">
                                <ul class="web-hosting-menu-header">
                                    <li><i class="fab fa-linux"></i> <a href="vps-linux-no-administrado">Linux no administrado<span>¡Administre usted mismo!</span></a></li>
                                    <li><i class="fab fa-linux"></i> <a href="vps-linux-administrado">Linux Administrado<span>Todo el poder <br>NINGUNO de los problemas</span></a></li>
                                    <li><i class="fab fa-windows"></i> <a href="vps-windows-no-administrado">Windows no Administrado<span>¡Administre usted mismo!</span></a></li>
                                    <li><i class="fab fa-windows"></i> <a href="vps-windows-administrado">Windows Administrado<span>Todo el poder <br>NINGUNO de los problemas</span></a></li>
                                </ul>
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link" role="button" id="streaming-megamenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" href="#">Streaming<span class="nav-new-tag">Nuevo</span></a>
                            <div class="dropdown-menu coodiv-dropdown-header web-menu" aria-labelledby="streaming-megamenu">
                                <ul class="web-hosting-menu-header">
                                    <li><i class="fas fa-microphone"></i> <a href="audio-streaming">Radio Streaming<span>Sonido limpio y fluido <br>Sonido de Calidad</span></a></li>
                                    <li><i class="fab fas fa-video"></i> <a href="video-streaming">Video Streaming<span>Calidad máxima 720p <br>Streaming SSL</span></a></li>
                                </ul>
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link" role="button" id="reseller-megamenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" href="#">Reseller<span class="nav-new-tag">Nuevo</span></a>
                            <div class="dropdown-menu coodiv-dropdown-header web-menu" aria-labelledby="reseller-megamenu">
                                <ul class="web-hosting-menu-header">
                                    <li><i class="fab fa-cpanel"></i> <a href="reseller-cpanel">cPanel & WHM<span>2 CPU - 2Gb Ram, por cPanel</span></a></li>
                                    <li><i class="fas fa-sign"></i> <a href="reseller-directadmin">DirectAdmin<span>2 CPU - 2Gb Ram, por cuenta</span></a></li>
                                </ul>
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link" role="button" id="dominios-megamenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" href="#">Dominios</a>
                            <div class="dropdown-menu coodiv-dropdown-header web-menu" aria-labelledby="dominios-megamenu">
                                <ul class="web-hosting-menu-header">
                                    <li><i class="fas fa-globe-americas"></i> <a href="buscar-dominios">Comprobador de dominio<span class="nav-new-tag">Consulta de disponibilidad</span></a></li>
                                    <li><i class="fas fa-random"></i> <a href="https://client.netz.com.py/cart.php?a=add&domain=transfer">Transferencia de dominio<span>Transfiera su dominio</span></a></li>
                                </ul>
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link" href="#" role="button" id="header-pages-drop-down" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Empresa<span class="sr-only">(current)</span></a>
                            <ul class="dropdown-menu coodiv-dropdown-header" aria-labelledby="header-pages-drop-down">
                                <li><a class="dropdown-item" href="about">Sobre Nosotros</a></li>
                                <li><a class="dropdown-item" href="terminos-del-servicio">Términos de Servicio</a></li>
                                <li><a class="dropdown-item" href="politica-de-privacidad">Politica de Privacidad</a></li>
                                <li><a class="dropdown-item" href="aviso-legal">Aviso Legal</a></li>
                                <li><a class="dropdown-item" href="contact">Cóntactenos</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>

                <ul class="header-user-info-coodiv">
                    <li class="dropdown"><a role="button" id="header-login-dropdown" href="https://client.netz.com.py/login.php">Iniciar Sesión</a> <span>+595 973 136 822</span>
                        <div class="dropdown-menu coodiv-dropdown-header user-login-dropdown" aria-labelledby="header-login-dropdown">
                            <form class="user-login-dropdown-form" action="https://client.netz.com.py/login.php" data-form="validate">
                                <div class="form-group username">
                                    <input type="email" name="username" id="inputEmail" placeholder="E-mail" class="form-control" autofocus><i class="fas fa-at"></i>
                                </div>
                                <div class="form-group password">
                                    <input type="password" name="password" id="inputPassword" placeholder="Contraseña" class="form-control"><i class="fas fa-lock"></i>
                                </div>
                                <button data-toggle="tooltip" data-placement="left" title="login" class="user-login-dropdown-form-button" type="submit"><i class="fas fa-angle-right"></i></button>
                            </form>
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
    `;

    const navbarHTML_pt = `
        <nav id="coodiv-navbar-header" class="navbar navbar-expand-md fixed-header-layout">
            <div class="container main-header-coodiv-s">
                <a class="navbar-brand" href="index"><img src="/assets/img/header/NETZ-IA.svg" width="100px" alt="Logo" /></a>
                <button class="navbar-toggle offcanvas-toggle menu-btn-span-bar ml-auto" data-toggle="offcanvas" data-target="#offcanvas-menu-home">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <div class="collapse navbar-collapse navbar-offcanvas" id="offcanvas-menu-home">
                    <ul class="navbar-nav ml-auto">
                        <li class="nav-item dropdown">
                            <a class="nav-link" href="index">Início<span class="sr-only">(current)</span> </a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link" role="button" id="webhosting-megamenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" href="#">Hospedagem</a>
                            <div class="dropdown-menu coodiv-dropdown-header web-menu" aria-labelledby="webhosting-megamenu">
                                <ul class="web-hosting-menu-header">
                                    <li><i class="fas fa-infinity"></i> <a href="hosting-ilimitado">Hospedagem Ilimitada<span class="nav-new-tag">Serviço sem limites de recursos</span></a></li>
                                    <li><i class="fas fa-server"></i> <a href="hosting-exclusivo">Hospedagem Exclusiva<span>Recursos exclusivos</span></a></li>
                                </ul>
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link" role="button" id="vps-megamenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" href="#">VPS<span class="nav-new-tag">Novo</span></a>
                            <div class="dropdown-menu coodiv-dropdown-header web-menu" aria-labelledby="vps-megamenu">
                                <ul class="web-hosting-menu-header">
                                    <li><i class="fab fa-linux"></i> <a href="vps-linux-no-administrado">Linux não Gerenciado<span>Gerencie você mesmo!</span></a></li>
                                    <li><i class="fab fa-linux"></i> <a href="vps-linux-administrado">Linux Gerenciado<span>Todo o poder <br>SEM complicações</span></a></li>
                                    <li><i class="fab fa-windows"></i> <a href="vps-windows-no-administrado">Windows não Gerenciado<span>Gerencie você mesmo!</span></a></li>
                                    <li><i class="fab fa-windows"></i> <a href="vps-windows-administrado">Windows Gerenciado<span>Todo o poder <br>SEM complicações</span></a></li>
                                </ul>
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link" role="button" id="streaming-megamenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" href="#">Streaming<span class="nav-new-tag">Novo</span></a>
                            <div class="dropdown-menu coodiv-dropdown-header web-menu" aria-labelledby="streaming-megamenu">
                                <ul class="web-hosting-menu-header">
                                    <li><i class="fas fa-microphone"></i> <a href="audio-streaming">Rádio Streaming<span>Áudio limpo e fluido <br>Som de alta qualidade</span></a></li>
                                    <li><i class="fab fas fa-video"></i> <a href="video-streaming">Vídeo Streaming<span>Qualidade máxima 720p <br>Streaming SSL</span></a></li>
                                </ul>
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link" role="button" id="reseller-megamenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" href="#">Revenda<span class="nav-new-tag">Novo</span></a>
                            <div class="dropdown-menu coodiv-dropdown-header web-menu" aria-labelledby="reseller-megamenu">
                                <ul class="web-hosting-menu-header">
                                    <li><i class="fab fa-cpanel"></i> <a href="reseller-cpanel">cPanel & WHM<span>2 CPU - 2Gb RAM por cPanel</span></a></li>
                                    <li><i class="fas fa-sign"></i> <a href="reseller-directadmin">DirectAdmin<span>2 CPU - 2Gb RAM por conta</span></a></li>
                                </ul>
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link" role="button" id="dominios-megamenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" href="#">Domínios</a>
                            <div class="dropdown-menu coodiv-dropdown-header web-menu" aria-labelledby="dominios-megamenu">
                                <ul class="web-hosting-menu-header">
                                    <li><i class="fas fa-globe-americas"></i> <a href="buscar-dominios">Verificador de Domínio<span class="nav-new-tag">Consulta de disponibilidade</span></a></li>
                                    <li><i class="fas fa-random"></i> <a href="https://client.netz.com.py/cart.php?a=add&domain=transfer">Transferência de Domínio<span>Transfira seu domínio</span></a></li>
                                </ul>
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link" href="#" role="button" id="header-pages-drop-down" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Empresa<span class="sr-only">(current)</span></a>
                            <ul class="dropdown-menu coodiv-dropdown-header" aria-labelledby="header-pages-drop-down">
                                <li><a class="dropdown-item" href="about">Sobre Nós</a></li>
                                <li><a class="dropdown-item" href="terminos-del-servicio">Termos de Serviço</a></li>
                                <li><a class="dropdown-item" href="politica-de-privacidad">Política de Privacidade</a></li>
                                <li><a class="dropdown-item" href="aviso-legal">Aviso Legal</a></li>
                                <li><a class="dropdown-item" href="contact">Fale Conosco</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>

                <ul class="header-user-info-coodiv">
                    <li class="dropdown"><a role="button" id="header-login-dropdown" href="https://client.netz.com.py/login.php">Área do Cliente</a> <span>+595 973 136 822</span>
                        <div class="dropdown-menu coodiv-dropdown-header user-login-dropdown" aria-labelledby="header-login-dropdown">
                            <form class="user-login-dropdown-form" action="https://client.netz.com.py/login.php" data-form="validate">
                                <div class="form-group username">
                                    <input type="email" name="username" id="inputEmail" placeholder="E-mail" class="form-control" autofocus><i class="fas fa-at"></i>
                                </div>
                                <div class="form-group password">
                                    <input type="password" name="password" id="inputPassword" placeholder="Senha" class="form-control"><i class="fas fa-lock"></i>
                                </div>
                                <button data-toggle="tooltip" data-placement="left" title="login" class="user-login-dropdown-form-button" type="submit"><i class="fas fa-angle-right"></i></button>
                            </form>
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
    `;

    const navbarHTML_en = `
        <nav id="coodiv-navbar-header" class="navbar navbar-expand-md fixed-header-layout">
            <div class="container main-header-coodiv-s">
                <a class="navbar-brand" href="index"><img src="/assets/img/header/NETZ-IA.svg" width="100px" alt="Logo" /></a>
                <button class="navbar-toggle offcanvas-toggle menu-btn-span-bar ml-auto" data-toggle="offcanvas" data-target="#offcanvas-menu-home">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <div class="collapse navbar-collapse navbar-offcanvas" id="offcanvas-menu-home">
                    <ul class="navbar-nav ml-auto">
                        <li class="nav-item dropdown">
                            <a class="nav-link" href="index">Home<span class="sr-only">(current)</span> </a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link" role="button" id="webhosting-megamenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" href="#">Hosting</a>
                            <div class="dropdown-menu coodiv-dropdown-header web-menu" aria-labelledby="webhosting-megamenu">
                                <ul class="web-hosting-menu-header">
                                    <li><i class="fas fa-infinity"></i> <a href="hosting-ilimitado">Unlimited Hosting<span class="nav-new-tag">Unmetered Resources</span></a></li>
                                    <li><i class="fas fa-server"></i> <a href="hosting-exclusivo">Dedicated Hosting<span>Exclusive Resources</span></a></li>
                                </ul>
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link" role="button" id="vps-megamenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" href="#">VPS<span class="nav-new-tag">New</span></a>
                            <div class="dropdown-menu coodiv-dropdown-header web-menu" aria-labelledby="vps-megamenu">
                                <ul class="web-hosting-menu-header">
                                    <li><i class="fab fa-linux"></i> <a href="vps-linux-no-administrado">Unmanaged Linux<span>Full Root Access!</span></a></li>
                                    <li><i class="fab fa-linux"></i> <a href="vps-linux-administrado">Managed Linux<span>All the power <br>NONE of the hassle</span></a></li>
                                    <li><i class="fab fa-windows"></i> <a href="vps-windows-no-administrado">Unmanaged Windows<span>Full RDP Control!</span></a></li>
                                    <li><i class="fab fa-windows"></i> <a href="vps-windows-administrado">Managed Windows<span>All the power <br>NONE of the hassle</span></a></li>
                                </ul>
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link" role="button" id="streaming-megamenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" href="#">Streaming<span class="nav-new-tag">New</span></a>
                            <div class="dropdown-menu coodiv-dropdown-header web-menu" aria-labelledby="streaming-megamenu">
                                <ul class="web-hosting-menu-header">
                                    <li><i class="fas fa-microphone"></i> <a href="audio-streaming">Radio Streaming<span>Crystal Clear Audio <br>HD Quality</span></a></li>
                                    <li><i class="fab fas fa-video"></i> <a href="video-streaming">Video Streaming<span>Max Quality 720p <br>SSL Streaming</span></a></li>
                                </ul>
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link" role="button" id="reseller-megamenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" href="#">Reseller<span class="nav-new-tag">New</span></a>
                            <div class="dropdown-menu coodiv-dropdown-header web-menu" aria-labelledby="reseller-megamenu">
                                <ul class="web-hosting-menu-header">
                                    <li><i class="fab fa-cpanel"></i> <a href="reseller-cpanel">cPanel & WHM<span>2 CPU - 2GB RAM per account</span></a></li>
                                    <li><i class="fas fa-sign"></i> <a href="reseller-directadmin">DirectAdmin<span>2 CPU - 2GB RAM per account</span></a></li>
                                </ul>
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link" role="button" id="dominios-megamenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" href="#">Domains</a>
                            <div class="dropdown-menu coodiv-dropdown-header web-menu" aria-labelledby="dominios-megamenu">
                                <ul class="web-hosting-menu-header">
                                    <li><i class="fas fa-globe-americas"></i> <a href="buscar-dominios">Domain Checker<span class="nav-new-tag">Check Availability</span></a></li>
                                    <li><i class="fas fa-random"></i> <a href="https://client.netz.com.py/cart.php?a=add&domain=transfer">Domain Transfer<span>Transfer your domain</span></a></li>
                                </ul>
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link" href="#" role="button" id="header-pages-drop-down" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Company<span class="sr-only">(current)</span></a>
                            <ul class="dropdown-menu coodiv-dropdown-header" aria-labelledby="header-pages-drop-down">
                                <li><a class="dropdown-item" href="about">About Us</a></li>
                                <li><a class="dropdown-item" href="terminos-del-servicio">Terms of Service</a></li>
                                <li><a class="dropdown-item" href="politica-de-privacidad">Privacy Policy</a></li>
                                <li><a class="dropdown-item" href="aviso-legal">Legal Notice</a></li>
                                <li><a class="dropdown-item" href="contact">Contact Us</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>

                <ul class="header-user-info-coodiv">
                    <li class="dropdown"><a role="button" id="header-login-dropdown" href="https://client.netz.com.py/login.php">Sign In</a> <span>+595 973 136 822</span>
                        <div class="dropdown-menu coodiv-dropdown-header user-login-dropdown" aria-labelledby="header-login-dropdown">
                            <form class="user-login-dropdown-form" action="https://client.netz.com.py/login.php" data-form="validate">
                                <div class="form-group username">
                                    <input type="email" name="username" id="inputEmail" placeholder="E-mail" class="form-control" autofocus><i class="fas fa-at"></i>
                                </div>
                                <div class="form-group password">
                                    <input type="password" name="password" id="inputPassword" placeholder="Password" class="form-control"><i class="fas fa-lock"></i>
                                </div>
                                <button data-toggle="tooltip" data-placement="left" title="Sign In" class="user-login-dropdown-form-button" type="submit"><i class="fas fa-angle-right"></i></button>
                            </form>
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
    `;

    function initOffcanvas() {
        const offcanvas = document.getElementById('offcanvas-menu-home');
        if (offcanvas) {
            if (!offcanvas.classList.contains('offcanvas-transform')) {
                offcanvas.classList.add('offcanvas-transform');
            }
            if (!offcanvas.classList.contains('js-offcanvas-done')) {
                offcanvas.classList.add('js-offcanvas-done');
            }
        }
        document.querySelectorAll('.offcanvas-toggle, [data-toggle="offcanvas"], .menu-btn-span-bar').forEach(function (btn) {
            btn.classList.add('js-offcanvas-has-events');
        });
        if (typeof window.jQuery !== 'undefined') {
            try {
                window.jQuery('.offcanvas-toggle, [data-toggle="offcanvas"], .menu-btn-span-bar').off('click');
                window.jQuery(document).off('click.bs.offcanvas');
            } catch (e) { }
        }
    }

    function closeOffcanvas() {
        const offcanvas = document.getElementById('offcanvas-menu-home');
        if (offcanvas) {
            offcanvas.classList.remove('in');
        }
        document.querySelectorAll('.offcanvas-toggle, .menu-btn-span-bar').forEach(function (btn) {
            btn.classList.remove('is-open');
        });
        document.body.classList.remove('offcanvas-stop-scrolling');
    }

    function getCountryPrefix() {
        var country = (document.documentElement.getAttribute('data-country') || '').toLowerCase();
        var path = (window.location.pathname || '').toLowerCase();
        if (country === 'us' || path.startsWith('/us') || path.includes('/us/')) return '/us';
        if (country === 'br' || path.startsWith('/br') || path.includes('/br/')) return '/br';
        return (country === 'py') ? '' : (country ? '/' + country : '');
    }

    function prefixNavbarLinks(html) {
        var prefix = getCountryPrefix();
        if (!prefix) return html;
        var slugs = [
            'index', 'hosting-ilimitado', 'hosting-exclusivo',
            'vps-linux-no-administrado', 'vps-linux-administrado',
            'vps-windows-no-administrado', 'vps-windows-administrado',
            'vps-linux', 'vps-windows',
            'audio-streaming', 'video-streaming',
            'reseller-cpanel', 'reseller-directadmin',
            'buscar-dominios', 'about', 'contact',
            'centro-de-ayuda', 'terminos-del-servicio',
            'politica-de-privacidad', 'aviso-legal', '404'
        ];
        var res = html;
        slugs.forEach(function (s) {
            var re = new RegExp('href="' + s + '(#|")', 'g');
            res = res.replace(re, function (match, p1) {
                return 'href="' + prefix + '/' + (s === 'index' ? '' : s) + p1;
            });
        });
        return res;
    }

    function renderNavbar() {
        var country = (document.documentElement.getAttribute('data-country') || '').toLowerCase();
        var path = (window.location.pathname || '').toLowerCase();
        var isUs = country === 'us' || path.startsWith('/us') || path.includes('/us/');
        var isBr = country === 'br' || path.startsWith('/br') || path.includes('/br/');
        var template = isBr ? navbarHTML_pt : (isUs ? navbarHTML_en : navbarHTML);
        var finalNavbarHTML = prefixNavbarLinks(template);
        const headerContainer = document.getElementById('navbar-container') || document.getElementById('header-navbar-container');
        if (headerContainer) {
            if (headerContainer.children.length === 0 || isBr || isUs) {
                headerContainer.innerHTML = finalNavbarHTML;
            }
        } else {
            const coodivHeader = document.getElementById('coodiv-header');
            if (coodivHeader) {
                const overlay = coodivHeader.querySelector('.bg_overlay_header');
                if (overlay && overlay.nextSibling) {
                    overlay.insertAdjacentHTML('afterend', finalNavbarHTML);
                } else {
                    coodivHeader.insertAdjacentHTML('afterbegin', finalNavbarHTML);
                }
            }
        }
        initOffcanvas();
        initDropdownHover();
    }

    // Inicializar inmediatamente
    initOffcanvas();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderNavbar);
    } else {
        renderNavbar();
    }

    if (typeof window.jQuery !== 'undefined') {
        window.jQuery(function () {
            initOffcanvas();
        });
    }

    // Manejo de Hover con apertura fluida en Desktop
    function initDropdownHover() {
        const dropdownItems = document.querySelectorAll('#coodiv-navbar-header .nav-item.dropdown, .header-user-info-coodiv .dropdown');

        dropdownItems.forEach(function (drop) {
            let closeTimer = null;
            const menu = drop.querySelector('.dropdown-menu');
            const toggle = drop.querySelector('[data-toggle="dropdown"], #header-login-dropdown');

            function open() {
                if (window.innerWidth < 768) return;
                if (closeTimer) {
                    clearTimeout(closeTimer);
                    closeTimer = null;
                }
                drop.classList.add('show');
                if (menu) menu.classList.add('show');
                if (toggle) toggle.setAttribute('aria-expanded', 'true');
            }

            function close() {
                if (window.innerWidth < 768) return;
                closeTimer = setTimeout(function () {
                    drop.classList.remove('show');
                    if (menu) menu.classList.remove('show');
                    if (toggle) toggle.setAttribute('aria-expanded', 'false');
                }, 90);
            }

            drop.addEventListener('mouseenter', open);
            drop.addEventListener('mouseleave', close);

            if (menu) {
                menu.addEventListener('mouseenter', open);
                menu.addEventListener('mouseleave', close);
            }
        });
    }

    // Delegación universal de eventos para Navbar y Menú Móvil
    document.addEventListener('click', function (e) {
        const toggleBtn = e.target.closest('.offcanvas-toggle, [data-toggle="offcanvas"], .menu-btn-span-bar');
        const offcanvas = document.getElementById('offcanvas-menu-home');

        // 1. Clic en botón hamburguesa móvil
        if (toggleBtn) {
            e.preventDefault();
            e.stopPropagation();
            if (offcanvas) {
                initOffcanvas();
                const isOpen = offcanvas.classList.toggle('in');
                document.querySelectorAll('.offcanvas-toggle, .menu-btn-span-bar').forEach(function (btn) {
                    btn.classList.toggle('is-open', isOpen);
                });
                if (isOpen) {
                    document.body.classList.add('offcanvas-stop-scrolling');
                } else {
                    document.body.classList.remove('offcanvas-stop-scrolling');
                }
            }
            return;
        }

        // 2. Clic en enlaces dropdown (Desktop vs Móvil)
        const dropdownLink = e.target.closest('#coodiv-navbar-header [data-toggle="dropdown"], .header-user-info-coodiv [data-toggle="dropdown"], #header-login-dropdown');
        if (dropdownLink) {
            const isDesktop = window.innerWidth >= 768;
            if (isDesktop) {
                // En desktop el hover ya lo abre; prevenir salto '#' y alternar limpiamente
                e.preventDefault();
                const dropdownParent = dropdownLink.closest('.dropdown');
                const dropdownMenu = dropdownParent ? dropdownParent.querySelector('.dropdown-menu') : null;
                if (dropdownParent && dropdownMenu) {
                    const isOpen = dropdownParent.classList.contains('show');
                    if (!isOpen) {
                        dropdownParent.classList.add('show');
                        dropdownMenu.classList.add('show');
                        dropdownLink.setAttribute('aria-expanded', 'true');
                    }
                }
                return;
            }

            // En móvil (offcanvas lateral): un solo toque abre/cierra
            e.preventDefault();
            e.stopPropagation();
            const dropdownParent = dropdownLink.closest('.dropdown');
            const dropdownMenu = dropdownParent ? dropdownParent.querySelector('.dropdown-menu') : null;
            if (dropdownMenu) {
                const allMenus = document.querySelectorAll('#offcanvas-menu-home .dropdown-menu');
                for (let i = 0; i < allMenus.length; i++) {
                    if (allMenus[i] !== dropdownMenu) {
                        allMenus[i].classList.remove('show');
                        if (allMenus[i].parentElement) {
                            allMenus[i].parentElement.classList.remove('show');
                        }
                    }
                }
                const isShown = dropdownMenu.classList.toggle('show');
                if (dropdownParent) dropdownParent.classList.toggle('show', isShown);
                dropdownLink.setAttribute('aria-expanded', isShown ? 'true' : 'false');
            }
            return;
        }

        // 3. Clic fuera de dropdowns en Desktop: cerrar cualquier menú abierto
        if (window.innerWidth >= 768 && !e.target.closest('.dropdown')) {
            document.querySelectorAll('#coodiv-navbar-header .dropdown.show, .header-user-info-coodiv .dropdown.show').forEach(function (d) {
                d.classList.remove('show');
                const m = d.querySelector('.dropdown-menu');
                if (m) m.classList.remove('show');
                const t = d.querySelector('[data-toggle="dropdown"], #header-login-dropdown');
                if (t) t.setAttribute('aria-expanded', 'false');
            });
        }

        // 4. Clic en enlace normal dentro del offcanvas móvil
        const navLink = e.target.closest('#offcanvas-menu-home a:not([data-toggle="dropdown"])');
        if (navLink) {
            closeOffcanvas();
            return;
        }

        // 5. Clic fuera del menú móvil cuando está abierto: cerrar offcanvas
        if (offcanvas && offcanvas.classList.contains('in')) {
            if (!e.target.closest('#offcanvas-menu-home')) {
                closeOffcanvas();
            }
        }
    });

    // Inicializar hover tras renderizar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            initDropdownHover();
        });
    } else {
        initDropdownHover();
    }
})();