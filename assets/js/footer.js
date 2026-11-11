// Componente modular Footer para HTML 00
(function () {
    const currentYear = new Date().getFullYear();
    const footerHTML = `
        <section class="footer-section-banner">
            <div class="container">
                <div class="row free-trial-footer-banner">
                    <div class="col-md-8">
                        <h5 class="free-trial-footer-banner-title">Únete ahora y disfruta de los mejores precios de <br>Alojamiento Web Y Dominios</h5>
                        <p class="free-trial-footer-banner-text">Ofrecemos servicios de Radio Streaming, Video Streaming, Hosting con recurso Ilimitado, Hosting exclusivos, Dominios.</p>
                    </div>
                    <div class="col-md-4 free-trial-footer-links d-flex mx-auto flex-column">
                        <div class="mb-auto"></div>
                        <div class="mb-auto">
                            <a class="sign-btn" href="https://client.netz.com.py/register.php">Regístrate</a>
                            <a class="log-btn" href="https://client.netz.com.py/login.php">Iniciar Sesión</a>
                        </div>
                        <div class="mt-auto"></div>
                    </div>
                </div>
            </div>
        </section>
        <section class="footer-section">
            <div class="container">
                <div class="row">
                    <div class="col-md-9 quiq-links-footer">
                        <div class="row">
                            <ul class="col-md-6 quiq-links-footer-ul">
                                <h5 class="quiq-links-footer-title">Gestiones de Usuario</h5>
                                <li><a href="centro-de-ayuda">Preguntas y Respuestas</a></li>
                                <li><a href="https://client.netz.com.py/register.php">Regístrate</a></li>
                                <li><a href="contact">Cóntactenos</a></li>
                                <li><a href="https://client.netz.com.py/password/reset/begin">¿Olvidó su Contraseña?</a></li>
                                <li><a href="https://client.netz.com.py/clientarea.php?action=invoices">Revisión Y Pago</a></li>
                                <li><a href="https://client.netz.com.py/clientarea.php">Área De Clientes</a></li>
                                <li><a href="https://client.netz.com.py/clientarea.php?action=details">Gestiona Tu Cuenta</a></li>
                            </ul>
                            <ul class="col-md-6 quiq-links-footer-ul">
                                <h6 class="quiq-links-footer-title">Servicios</h6>
                                <li><a href="buscar-dominios">Comprobador de dominio</a></li>
                                <li><a href="hosting-ilimitado">Hosting Ilimitado</a></li>
                                <li><a href="hosting-exclusivo">Hosting Exclusivo</a></li>
                                <li><a href="audio-streaming">Radio Streaming</a></li>
                                <li><a href="video-streaming">Video Streaming</a></li>
                                <li><a href="vps-linux-no-administrado">Linux no administrado</a></li>
                                <li><a href="vps-linux-administrado">Linux Administrado</a></li>
                                <li><a href="vps-windows-no-administrado">Windows no Administrado</a></li>
                                <li><a href="vps-windows-administrado">Windows Administrado</a></li>
                                <li><a href="reseller-cpanel">Reseller cPanel & WHM</a></li>
                                <li><a href="reseller-directadmin">Reseller DirectAdmin</a></li>
                                <li><a href="desarrollo-software">Desarrollo de Software</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <h5 class="quiq-links-footer-title">Métodos de pagos</h5>
                        <p class="secure-img-footer-area">
                            <img src="/assets/img/footer/secure3.png" alt="" />
                        </p><br>
                        <h5 class="quiq-links-footer-title">Contactos Rápido</h5>
                        <div class="footer-contact-method">
                            <a href="mailto:info@netz.com.py">
                                <span>E-mail:</span>
                                <b>info@netz.com.py</b>
                                <i class="fas fa-at"></i>
                            </a>
                            <a href="mailto:support@netz.com.py">
                                <span>Soporte:</span>
                                <b>support@netz.com.py</b>
                                <i class="fas fa-headset"></i>
                            </a>
                            <a href="https://wa.link/i2ydne" target="_blank">
                                <span>WhatsApp:</span>
                                <b>+595 973 136 822</b>
                                <i class="fab fa-whatsapp"></i>
                            </a>
                            <a href="https://t.me/netzpy" target="_blank">
                                <span>Telegram:</span>
                                <b>@NETZ</b>
                                <i class="fab fa-telegram"></i>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="mr-tp-40 row justify-content-between footer-area-under">
                    <div class="col-md-4">
                        <a href="#"><img class="footer-logo-blue" src="/assets/img/header/NETZ-BLANCO.svg" width="160px" alt="" /></a><br><br>
                        <div class="contact-us-social-icons">
                            <a class="fb" href="https://www.facebook.com/netzpy" target="_blank"><i class="fab fa-facebook-f"></i></a>
                            <a class="tw" href="https://x.com/netzpy" target="_blank" aria-label="X" style="background:#000000;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="13" height="13" fill="#ffffff" style="vertical-align: -2px;"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg></a>
                            <a class="in" href="https://www.instagram.com/netz.com.py/" target="_blank"><i class="fab fa-instagram"></i></a>
                            <a class="yb" href="https://www.youtube.com/@netzpy" target="_blank"><i class="fab fa-youtube"></i></a>
                            <a class="wt" href="https://wa.link/i2ydne" target="_blank"><i class="fab fa-whatsapp"></i></a>
                            <a class="yb" href="https://t.me/netzpy" target="_blank"><i class="fab fa-telegram"></i></a>
                        </div>
                    </div>
                    <div class="col-md-4 row">
                        <ul class="col-md-6 under-footer-ullist">
                            <li><a href="about">Sobre Nosotros</a></li>
                            <li><a href="aviso-legal">Aviso Legal</a></li>
                        </ul>
                        <ul class="col-md-6 under-footer-ullist text-right">
                            <li><a href="politica-de-privacidad">Politica de Privacidad</a></li>
                            <li><a href="terminos-del-servicio">Términos de Servicio</a></li>
                        </ul>
                    </div>
                </div>
                <div class="row justify-content-between final-footer-area mr-tp-40">
                    <div class="final-footer-area-text">
                        <p class="p-small">&copy; Copyright 2019 - ${currentYear} Todos los derechos reservados. <br>Hecho con amor en Paraguay por <a href="index" style="color:#FEFEFE;">NETZ</a></p>
                    </div>
                    {{FOOTER_LANG_CHANGER}}
                    </div>
                </div>
            </div>
        </section>
        <a href="https://api.whatsapp.com/send?phone=595973136822&text=Hola%20vengo%20desde%20la%20web,%20%C2%BFMe%20pueden%20dar%20m%C3%A1s%20informaci%C3%B3n?" class="float" target="_blank" aria-label="WhatsApp">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="32" height="32" fill="currentColor">
                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
            </svg>
        </a>
    `;

        function getCountryPrefix() {
        var country = (document.documentElement.getAttribute('data-country') || '').toLowerCase();
        var path = (window.location.pathname || '').toLowerCase();
        var match = path.match(/^\/(ar|br|cl|co|es|mx|us)\b/);
        if (match) return '/' + match[1];
        if (country && country !== 'py') return '/' + country;
        return '';
    }

    const footerHTML_pt = `
        <section class="footer-section-banner">
            <div class="container">
                <div class="row free-trial-footer-banner">
                    <div class="col-md-8">
                        <h5 class="free-trial-footer-banner-title">Junte-se agora e aproveite os melhores preços de <br>Hospedagem Web e Domínios</h5>
                        <p class="free-trial-footer-banner-text">Oferecemos serviços de Rádio Streaming, Vídeo Streaming, Hospedagem com recursos ilimitados, Hospedagem Exclusiva e Domínios.</p>
                    </div>
                    <div class="col-md-4 free-trial-footer-links d-flex mx-auto flex-column">
                        <div class="mb-auto"></div>
                        <div class="mb-auto">
                            <a class="sign-btn" href="https://client.netz.com.py/register.php">Cadastre-se</a>
                            <a class="log-btn" href="https://client.netz.com.py/login.php">Entrar</a>
                        </div>
                        <div class="mt-auto"></div>
                    </div>
                </div>
            </div>
        </section>
        <section class="footer-section">
            <div class="container">
                <div class="row">
                    <div class="col-md-9 quiq-links-footer">
                        <div class="row">
                            <ul class="col-md-6 quiq-links-footer-ul">
                                <h5 class="quiq-links-footer-title">Gestão do Usuário</h5>
                                <li><a href="centro-de-ayuda">Perguntas e Respostas</a></li>
                                <li><a href="https://client.netz.com.py/register.php">Cadastre-se</a></li>
                                <li><a href="contact">Fale Conosco</a></li>
                                <li><a href="https://client.netz.com.py/password/reset/begin">Esqueceu sua Senha?</a></li>
                                <li><a href="https://client.netz.com.py/clientarea.php?action=invoices">Faturas e Pagamentos</a></li>
                                <li><a href="https://client.netz.com.py/clientarea.php">Área do Cliente</a></li>
                                <li><a href="https://client.netz.com.py/clientarea.php?action=details">Gerenciar Conta</a></li>
                            </ul>
                            <ul class="col-md-6 quiq-links-footer-ul">
                                <h6 class="quiq-links-footer-title">Serviços</h6>
                                <li><a href="buscar-dominios">Verificador de Domínio</a></li>
                                <li><a href="hosting-ilimitado">Hospedagem Ilimitada</a></li>
                                <li><a href="hosting-exclusivo">Hospedagem Exclusiva</a></li>
                                <li><a href="audio-streaming">Rádio Streaming</a></li>
                                <li><a href="video-streaming">Vídeo Streaming</a></li>
                                <li><a href="vps-linux-no-administrado">Linux não Gerenciado</a></li>
                                <li><a href="vps-linux-administrado">Linux Gerenciado</a></li>
                                <li><a href="vps-windows-no-administrado">Windows não Gerenciado</a></li>
                                <li><a href="vps-windows-administrado">Windows Gerenciado</a></li>
                                <li><a href="reseller-cpanel">Revenda cPanel & WHM</a></li>
                                <li><a href="reseller-directadmin">Revenda DirectAdmin</a></li>
                                <li><a href="desarrollo-software">Desenvolvimento de Software</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <h5 class="quiq-links-footer-title">Formas de Pagamento</h5>
                        <p class="secure-img-footer-area">
                            <img src="/assets/img/footer/secure3.png" alt="" />
                        </p><br>
                        <h5 class="quiq-links-footer-title">Atendimento Rápido</h5>
                        <div class="footer-contact-method">
                            <a href="mailto:info@netz.com.py">
                                <span>E-mail:</span>
                                <b>info@netz.com.py</b>
                                <i class="fas fa-at"></i>
                            </a>
                            <a href="mailto:support@netz.com.py">
                                <span>Suporte:</span>
                                <b>support@netz.com.py</b>
                                <i class="fas fa-headset"></i>
                            </a>
                            <a href="https://wa.link/i2ydne" target="_blank">
                                <span>WhatsApp:</span>
                                <b>+595 973 136 822</b>
                                <i class="fab fa-whatsapp"></i>
                            </a>
                            <a href="https://t.me/netzpy" target="_blank">
                                <span>Telegram:</span>
                                <b>@NETZ</b>
                                <i class="fab fa-telegram"></i>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="mr-tp-40 row justify-content-between footer-area-under">
                    <div class="col-md-4">
                        <a href="#"><img class="footer-logo-blue" src="/assets/img/header/NETZ-BLANCO.svg" width="160px" alt="" /></a><br><br>
                        <div class="contact-us-social-icons">
                            <a class="fb" href="https://www.facebook.com/netzpy" target="_blank"><i class="fab fa-facebook-f"></i></a>
                            <a class="tw" href="https://x.com/netzpy" target="_blank" aria-label="X" style="background:#000000;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="13" height="13" fill="#ffffff" style="vertical-align: -2px;"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg></a>
                            <a class="in" href="https://www.instagram.com/netz.com.py/" target="_blank"><i class="fab fa-instagram"></i></a>
                            <a class="yb" href="https://www.youtube.com/@netzpy" target="_blank"><i class="fab fa-youtube"></i></a>
                            <a class="wt" href="https://wa.link/i2ydne" target="_blank"><i class="fab fa-whatsapp"></i></a>
                            <a class="yb" href="https://t.me/netzpy" target="_blank"><i class="fab fa-telegram"></i></a>
                        </div>
                    </div>
                    <div class="col-md-4 row">
                        <ul class="col-md-6 under-footer-ullist">
                            <li><a href="about">Sobre Nós</a></li>
                            <li><a href="aviso-legal">Aviso Legal</a></li>
                        </ul>
                        <ul class="col-md-6 under-footer-ullist text-right">
                            <li><a href="politica-de-privacidad">Política de Privacidade</a></li>
                            <li><a href="terminos-del-servicio">Termos de Serviço</a></li>
                        </ul>
                    </div>
                </div>
                <div class="row justify-content-between final-footer-area mr-tp-40">
                    <div class="final-footer-area-text">
                        <p class="p-small">&copy; Copyright 2019 - ${currentYear} Todos os direitos reservados. <br>Feito com amor por <a href="index" style="color:#FEFEFE;">NETZ</a></p>
                    </div>
                    {{FOOTER_LANG_CHANGER}}
                    </div>
                </div>
            </div>
        </section>
        <a href="https://api.whatsapp.com/send?phone=595973136822&text=Ol%C3%A1%20vim%20pelo%20site,%20poderia%20me%20dar%20mais%20informa%C3%A7%C3%B5es?" class="float" target="_blank" aria-label="WhatsApp">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="32" height="32" fill="currentColor">
                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
            </svg>
        </a>
    `;

    const footerHTML_en = `
        <section class="footer-section-banner">
            <div class="container">
                <div class="row free-trial-footer-banner">
                    <div class="col-md-8">
                        <h5 class="free-trial-footer-banner-title">Join now and enjoy the best prices on <br>Web Hosting and Domains</h5>
                        <p class="free-trial-footer-banner-text">We offer Radio Streaming, Video Streaming, Unlimited Hosting, Dedicated Hosting, and Domains.</p>
                    </div>
                    <div class="col-md-4 free-trial-footer-links d-flex mx-auto flex-column">
                        <div class="mb-auto"></div>
                        <div class="mb-auto">
                            <a class="sign-btn" href="https://client.netz.com.py/register.php">Sign Up</a>
                            <a class="log-btn" href="https://client.netz.com.py/login.php">Sign In</a>
                        </div>
                        <div class="mt-auto"></div>
                    </div>
                </div>
            </div>
        </section>
        <section class="footer-section">
            <div class="container">
                <div class="row">
                    <div class="col-md-9 quiq-links-footer">
                        <div class="row">
                            <ul class="col-md-6 quiq-links-footer-ul">
                                <h5 class="quiq-links-footer-title">User Management</h5>
                                <li><a href="centro-de-ayuda">Knowledgebase & FAQs</a></li>
                                <li><a href="https://client.netz.com.py/register.php">Sign Up</a></li>
                                <li><a href="contact">Contact Us</a></li>
                                <li><a href="https://client.netz.com.py/password/reset/begin">Forgot Password?</a></li>
                                <li><a href="https://client.netz.com.py/clientarea.php?action=invoices">Invoices & Payments</a></li>
                                <li><a href="https://client.netz.com.py/clientarea.php">Client Area</a></li>
                                <li><a href="https://client.netz.com.py/clientarea.php?action=details">Manage Account</a></li>
                            </ul>
                            <ul class="col-md-6 quiq-links-footer-ul">
                                <h6 class="quiq-links-footer-title">Services</h6>
                                <li><a href="buscar-dominios">Domain Checker</a></li>
                                <li><a href="hosting-ilimitado">Unlimited Hosting</a></li>
                                <li><a href="hosting-exclusivo">Dedicated Hosting</a></li>
                                <li><a href="audio-streaming">Radio Streaming</a></li>
                                <li><a href="video-streaming">Video Streaming</a></li>
                                <li><a href="vps-linux-no-administrado">Unmanaged Linux VPS</a></li>
                                <li><a href="vps-linux-administrado">Managed Linux VPS</a></li>
                                <li><a href="vps-windows-no-administrado">Unmanaged Windows VPS</a></li>
                                <li><a href="vps-windows-administrado">Managed Windows VPS</a></li>
                                <li><a href="reseller-cpanel">cPanel & WHM Reseller</a></li>
                                <li><a href="reseller-directadmin">DirectAdmin Reseller</a></li>
                                <li><a href="desarrollo-software">Software Development</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <h5 class="quiq-links-footer-title">Payment Methods</h5>
                        <p class="secure-img-footer-area">
                            <img src="/assets/img/footer/secure3.png" alt="" />
                        </p><br>
                        <h5 class="quiq-links-footer-title">Quick Contact</h5>
                        <div class="footer-contact-method">
                            <a href="mailto:info@netz.com.py">
                                <span>Email:</span>
                                <b>info@netz.com.py</b>
                                <i class="fas fa-at"></i>
                            </a>
                            <a href="mailto:support@netz.com.py">
                                <span>Support:</span>
                                <b>support@netz.com.py</b>
                                <i class="fas fa-headset"></i>
                            </a>
                            <a href="https://wa.link/i2ydne" target="_blank">
                                <span>WhatsApp:</span>
                                <b>+595 973 136 822</b>
                                <i class="fab fa-whatsapp"></i>
                            </a>
                            <a href="https://t.me/netzpy" target="_blank">
                                <span>Telegram:</span>
                                <b>@NETZ</b>
                                <i class="fab fa-telegram"></i>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="mr-tp-40 row justify-content-between footer-area-under">
                    <div class="col-md-4">
                        <a href="#"><img class="footer-logo-blue" src="/assets/img/header/NETZ-BLANCO.svg" width="160px" alt="" /></a><br><br>
                        <div class="contact-us-social-icons">
                            <a class="fb" href="https://www.facebook.com/netzpy" target="_blank"><i class="fab fa-facebook-f"></i></a>
                            <a class="tw" href="https://x.com/netzpy" target="_blank" aria-label="X" style="background:#000000;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="13" height="13" fill="#ffffff" style="vertical-align: -2px;"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg></a>
                            <a class="in" href="https://www.instagram.com/netz.com.py/" target="_blank"><i class="fab fa-instagram"></i></a>
                            <a class="yb" href="https://www.youtube.com/@netzpy" target="_blank"><i class="fab fa-youtube"></i></a>
                            <a class="wt" href="https://wa.link/i2ydne" target="_blank"><i class="fab fa-whatsapp"></i></a>
                            <a class="yb" href="https://t.me/netzpy" target="_blank"><i class="fab fa-telegram"></i></a>
                        </div>
                    </div>
                    <div class="col-md-4 row">
                        <ul class="col-md-6 under-footer-ullist">
                            <li><a href="about">About Us</a></li>
                            <li><a href="aviso-legal">Legal Notice</a></li>
                        </ul>
                        <ul class="col-md-6 under-footer-ullist text-right">
                            <li><a href="politica-de-privacidad">Privacy Policy</a></li>
                            <li><a href="terminos-del-servicio">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
                <div class="row justify-content-between final-footer-area mr-tp-40">
                    <div class="final-footer-area-text">
                        <p class="p-small">&copy; Copyright 2019 - ${currentYear} All rights reserved. <br>Crafted with care by <a href="index" style="color:#FEFEFE;">NETZ</a></p>
                    </div>
                    {{FOOTER_LANG_CHANGER}}
                    </div>
                </div>
            </div>
        </section>
        <a href="https://api.whatsapp.com/send?phone=595973136822&text=Hello,%20I%20am%20visiting%20from%20the%20website,%20could%20you%20give%20me%20more%20information?" class="float" target="_blank" aria-label="WhatsApp">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="32" height="32" fill="currentColor">
                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
            </svg>
        </a>
    `;

    function prefixFooterLinks(html) {
        var prefix = getCountryPrefix();
        if (!prefix) return html;
        var slugs = [
            'index', 'hosting-ilimitado', 'hosting-exclusivo',
            'vps-linux-no-administrado', 'vps-linux-administrado',
            'vps-windows-no-administrado', 'vps-windows-administrado',
            'vps-linux', 'vps-windows',
            'audio-streaming', 'video-streaming',
            'reseller-cpanel', 'reseller-directadmin',
            'desarrollo-software',
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

    
    function getCurrentPageSlug() {
        var path = window.location.pathname || '/';
        var clean = path.replace(/^\/+|\/+$/g, '');
        var parts = clean ? clean.split('/') : [];
        var known = ['br', 'us', 'ar', 'es', 'cl', 'co', 'mx', 'py'];
        if (parts.length > 0 && known.indexOf(parts[0].toLowerCase()) !== -1) {
            parts.shift();
        }
        return parts.join('/');
    }

    function getTargetUrl(targetCountry) {
        var slug = getCurrentPageSlug();
        if (targetCountry === 'py' || !targetCountry) {
            return '/' + (slug ? slug : '');
        }
        return '/' + targetCountry + '/' + (slug ? slug : '');
    }

    function buildFooterLangChanger(activeCountry, isBr, isUs) {
        var currentLangCode = isBr ? 'pt' : (isUs ? 'en' : 'es');
        var currentLangName = isBr ? 'Português' : (isUs ? 'English' : 'Español');

        var countryNames = {
            py: 'Paraguay',
            br: 'Brasil',
            us: isUs ? 'United States' : 'Estados Unidos',
            ar: 'Argentina',
            es: 'España',
            cl: 'Chile',
            co: 'Colombia',
            mx: 'México'
        };

        var currentCountryCode = (activeCountry || 'py').toLowerCase();
        var currentCountryName = countryNames[currentCountryCode] || 'Paraguay';
        var currentCountryFlag = '/assets/img/flags/' + (currentCountryCode === 'py' ? 'py3.svg' : currentCountryCode + '.svg');

        var countriesList = [
            { code: 'py', name: 'Paraguay', flag: '/assets/img/flags/py3.svg' },
            { code: 'br', name: 'Brasil', flag: '/assets/img/flags/br.svg' },
            { code: 'us', name: isUs ? 'United States' : 'Estados Unidos', flag: '/assets/img/flags/us.svg' },
            { code: 'ar', name: 'Argentina', flag: '/assets/img/flags/ar.svg' },
            { code: 'es', name: 'España', flag: '/assets/img/flags/es.svg' },
            { code: 'cl', name: 'Chile', flag: '/assets/img/flags/cl.svg' },
            { code: 'co', name: 'Colombia', flag: '/assets/img/flags/co.svg' },
            { code: 'mx', name: 'México', flag: '/assets/img/flags/mx.svg' }
        ];

        var languagesList = [
            { code: 'es', name: 'Español', flag: '/assets/img/flags/es.svg', target: 'py' },
            { code: 'en', name: 'English', flag: '/assets/img/flags/us.svg', target: 'us' },
            { code: 'pt', name: 'Português', flag: '/assets/img/flags/br.svg', target: 'br' }
        ];

        var langItemsHtml = languagesList.map(function (item) {
            var activeClass = item.code === currentLangCode ? ' active' : '';
            return '<a class="dropdown-item' + activeClass + '" href="' + getTargetUrl(item.target) + '">' +
                   '<img src="' + item.flag + '" alt="" />' + item.name + '</a>';
        }).join('');

        var countryItemsHtml = countriesList.map(function (item) {
            var activeClass = item.code === currentCountryCode ? ' active' : '';
            return '<a class="dropdown-item' + activeClass + '" href="' + getTargetUrl(item.code) + '">' +
                   '<img src="' + item.flag + '" alt="" />' + item.name + '</a>';
        }).join('');

        var styles = '<style>' +
            '.footer-lang-changer { display: flex; align-items: center; gap: 15px; }' +
            '.lang-changer-drop-up { position: relative; float: left; }' +
            '.footer-lang-changer .menu-btn-changer { color: #969cc1; font-weight: 500; font-size: 13px; text-decoration: none; text-transform: capitalize; display: inline-flex; align-items: center; padding: 4px 8px; border-radius: 4px; transition: all 0.2s ease; cursor: pointer; }' +
            '.footer-lang-changer .menu-btn-changer:hover, .lang-changer-drop-up:hover .menu-btn-changer { color: #ffffff; background: rgba(255, 255, 255, 0.08); text-decoration: none; }' +
            '.footer-lang-changer .menu-btn-changer i { font-size: 14px; margin-right: 6px; }' +
            '.footer-lang-changer .menu-btn-changer img { width: 18px; height: 12px; object-fit: cover; border-radius: 2px; margin-right: 6px; }' +
            '.dropupmenulagchanger.dropdown-menu { position: absolute !important; bottom: 100% !important; top: auto !important; left: 0 !important; margin-bottom: 8px !important; z-index: 9999 !important; min-width: 175px; background: #ffffff !important; border-radius: 10px !important; border: 1px solid rgba(0, 0, 0, 0.08) !important; box-shadow: 0 12px 32px rgba(15, 23, 42, 0.22) !important; padding: 6px 0 !important; display: none; }' +
            '.dropupmenulagchanger.dropdown-menu:before { content: \'\'; position: absolute; left: 0; right: 0; bottom: -12px; height: 12px; background: transparent; }' +
            '.lang-changer-drop-up:hover > .dropupmenulagchanger.dropdown-menu, .dropupmenulagchanger.dropdown-menu.show { display: block !important; }' +
            '.dropupmenulagchanger.dropdown-menu.country-changer-menu { max-height: 270px; overflow-y: auto; min-width: 190px; }' +
            '.dropupmenulagchanger.dropdown-menu:after { content: \'\'; position: absolute; left: 20px; bottom: -6px; width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid #ffffff; }' +
            '.dropupmenulagchanger.dropdown-menu .dropdown-item { display: flex !important; align-items: center !important; padding: 8px 16px !important; color: #334155 !important; font-size: 13px !important; font-weight: 500 !important; text-decoration: none !important; transition: background 0.15s ease, color 0.15s ease !important; cursor: pointer !important; }' +
            '.dropupmenulagchanger.dropdown-menu .dropdown-item:hover { background: #f1f5f9 !important; color: #4f46e5 !important; }' +
            '.dropupmenulagchanger.dropdown-menu .dropdown-item.active { background: #eef2ff !important; color: #4f46e5 !important; font-weight: 600 !important; }' +
            '.dropupmenulagchanger.dropdown-menu .dropdown-item img { width: 18px !important; height: 12px !important; object-fit: cover !important; border-radius: 2px !important; margin-right: 10px !important; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12) !important; }' +
            '@media (max-width: 767px) { .footer-lang-changer { justify-content: center; margin-top: 15px; } }' +
            '</style>';

        return styles +
               '<div class="footer-lang-changer">' +
               '    <!-- Selector de Idioma -->' +
               '    <div class="dropdown dropup lang-changer-drop-up">' +
               '        <a class="menu-btn-changer" role="button" id="dropupmenulagchanger" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" href="#">' +
               '            <i class="fas fa-globe-americas"></i>' + currentLangName +
               '        </a>' +
               '        <div class="dropdown-menu dropupmenulagchanger" aria-labelledby="dropupmenulagchanger">' +
                            langItemsHtml +
               '        </div>' +
               '    </div>' +
               '    <!-- Selector de País -->' +
               '    <div class="dropdown dropup lang-changer-drop-up">' +
               '        <a class="menu-btn-changer" role="button" id="dropupmenucountrychanger" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" href="#">' +
               '            <img src="' + currentCountryFlag + '" alt="" />' + currentCountryName +
               '        </a>' +
               '        <div class="dropdown-menu dropupmenulagchanger country-changer-menu" aria-labelledby="dropupmenucountrychanger">' +
                            countryItemsHtml +
               '        </div>' +
               '    </div>' +
               '</div>';
    }

    function initFooterDropdowns() {
        var changer = document.querySelector('.footer-lang-changer');
        if (!changer) return;

        var dropUps = changer.querySelectorAll('.lang-changer-drop-up');
        dropUps.forEach(function (dropUp) {
            var menu = dropUp.querySelector('.dropdown-menu');
            var btn = dropUp.querySelector('.menu-btn-changer');
            if (!menu) return;
            var hideTimer = null;

            // Despliegue al pasar el mouse (hover)
            dropUp.addEventListener('mouseenter', function () {
                if (hideTimer) {
                    clearTimeout(hideTimer);
                    hideTimer = null;
                }
                changer.querySelectorAll('.dropdown-menu').forEach(function (m) {
                    if (m !== menu) m.classList.remove('show');
                });
                changer.querySelectorAll('.lang-changer-drop-up').forEach(function (p) {
                    if (p !== dropUp) p.classList.remove('show');
                });
                menu.classList.add('show');
                dropUp.classList.add('show');
            });

            dropUp.addEventListener('mouseleave', function () {
                hideTimer = setTimeout(function () {
                    menu.classList.remove('show');
                    dropUp.classList.remove('show');
                }, 150);
            });

            // Compatibilidad para clic o pantallas táctiles
            if (btn) {
                btn.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var isShown = menu.classList.contains('show');
                    changer.querySelectorAll('.dropdown-menu').forEach(function (m) {
                        m.classList.remove('show');
                    });
                    changer.querySelectorAll('.lang-changer-drop-up').forEach(function (p) {
                        p.classList.remove('show');
                    });
                    if (!isShown) {
                        menu.classList.add('show');
                        dropUp.classList.add('show');
                    }
                });
            }
        });

        document.addEventListener('click', function (e) {
            if (!changer.contains(e.target)) {
                changer.querySelectorAll('.dropdown-menu').forEach(function (m) {
                    m.classList.remove('show');
                });
                changer.querySelectorAll('.lang-changer-drop-up').forEach(function (p) {
                    p.classList.remove('show');
                });
            }
        });
    }

    function renderFooter() {
        var country = (document.documentElement.getAttribute('data-country') || '').toLowerCase();
        var path = (window.location.pathname || '').toLowerCase();
        if (!country) {
            var match = path.match(/^\/(ar|br|cl|co|es|mx|us)\b/);
            if (match) country = match[1];
            else country = 'py';
        }
        var isUs = country === 'us' || path.startsWith('/us') || path.includes('/us/');
        var isBr = country === 'br' || path.startsWith('/br') || path.includes('/br/');
        var template = isBr ? footerHTML_pt : (isUs ? footerHTML_en : footerHTML);
        var finalFooterHTML = prefixFooterLinks(template);
        finalFooterHTML = finalFooterHTML.replace('{{FOOTER_LANG_CHANGER}}', buildFooterLangChanger(country, isBr, isUs));
        const footerContainer = document.getElementById('footer-container');
        if (footerContainer) {
            footerContainer.innerHTML = finalFooterHTML;
        } else {
            document.body.insertAdjacentHTML('beforeend', finalFooterHTML);
        }
        initFooterDropdowns();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderFooter);
    } else {
        renderFooter();
    }
})();
