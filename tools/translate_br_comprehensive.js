const fs = require('fs');
const path = require('path');

const localesBrDir = path.join(__dirname, '..', 'locales', 'br');
const brDir = path.join(__dirname, '..', 'br');
const distBrDir = path.join(__dirname, '..', 'dist', 'br');

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceFlexible(content, searchStr, replaceStr) {
    if (searchStr instanceof RegExp) {
        return content.replace(searchStr, replaceStr);
    }
    const escaped = escapeRegex(searchStr);
    const pattern = escaped.replace(/\s+/g, '\\s+');
    const regex = new RegExp(pattern, 'g');
    return content.replace(regex, replaceStr);
}

function safeReplace(content, pairs) {
    let res = content;
    for (const [from, to] of pairs) {
        res = replaceFlexible(res, from, to);
    }
    return res;
}

// Global replacements across all Brazilian pages
const globalBrReplacements = [
    // Navbar dropdown texts & labels
    ['Hosting Ilimitado<span class="nav-new-tag">Servicio sin límites de recursos</span>', 'Hospedagem Ilimitada<span class="nav-new-tag">Recursos Ilimitados</span>'],
    ['Hosting Ilimitado<span class="nav-new-tag">Servicio sin límites de\n                        recursos</span>', 'Hospedagem Ilimitada<span class="nav-new-tag">Recursos Ilimitados</span>'],
    ['Hosting Ilimitado<span class="nav-new-tag">Servicio sin límites de\r\n                        recursos</span>', 'Hospedagem Ilimitada<span class="nav-new-tag">Recursos Ilimitados</span>'],
    ['Hosting Exclusivo<span class="nav-new-tag">Recursos exclusivos <br>con mayor velocidad!</span>', 'Hospedagem Exclusiva<span class="nav-new-tag">Recursos Dedicados <br>com Maior Velocidade!</span>'],
    ['Linux no administrado<span>¡Administre usted mismo!</span>', 'Linux Não Gerenciado<span>Acesso Root Completo!</span>'],
    ['Linux no administrado<span>¡Administre usted mismo!</span>', 'Linux Não Gerenciado<span>Acesso Root Completo!</span>'],
    ['Linux Administrado<span>Todo el poder <br>NINGUNO de los problemas</span>', 'Linux Gerenciado<span>Todo o Poder <br>SEM Complicações</span>'],
    ['Windows no Administrado<span>¡Control Total por RDP!</span>', 'Windows Não Gerenciado<span>Controle Total via RDP!</span>'],
    ['Windows Administrado<span>Servidor Administrado</span>', 'Windows Gerenciado<span>Servidor Totalmente Gerenciado</span>'],
    ['Radio Streaming<span>Sonido limpio y fluido <br>Sonido de Calidad</span>', 'Rádio Streaming<span>Áudio HD Cristalino <br>Sem Travamentos</span>'],
    ['Video Streaming<span>Calidad máxima 720p <br>Streaming SSL</span>', 'Vídeo Streaming<span>Qualidade HD 720p <br>Transmissão SSL</span>'],
    ['Reseller cPanel & WHM<span>2 CPU - 2Gb Ram, por cPanel</span>', 'Revenda cPanel & WHM<span>2 CPU - 2GB RAM por conta</span>'],
    ['Reseller DirectAdmin<span>2 CPU - 2Gb Ram, por cuenta</span>', 'Revenda DirectAdmin<span>2 CPU - 2GB RAM por conta</span>'],
    ['Comprobador de dominio<span class="nav-new-tag">Consulta de disponibilidad</span>', 'Verificador de Domínio<span class="nav-new-tag">Consulta de Disponibilidade</span>'],
    ['Transferencia de dominio<span>Transfiera su dominio</span>', 'Transferência de Domínio<span>Transfira seu Domínio</span>'],

    // Common nav items
    [/>Hosting</g, '>Hospedagem<'],
    [/>Dominios</g, '>Domínios<'],
    [/>Inicio</g, '>Início<'],
    [/>Contacto</g, '>Contato<'],
    [/>Contáctenos</g, '>Fale Conosco<'],
    [/>Iniciar Sesión</g, '>Área do Cliente<'],
    [/>Regístrate</g, '>Cadastre-se<'],
    [/>¿Olvidó Su Contraseña\?</g, '>Esqueceu sua Senha?<'],
    [/>Revisión Y Pago</g, '>Faturas e Pagamento<'],
    [/>Área De Clientes</g, '>Área do Cliente<'],
    [/>Gestiona Tu Cuenta</g, '>Gerenciar Conta<'],
    [/>Preguntas Y Respuestas</g, '>Perguntas e Respostas<'],
    [/>Comprobador De Dominio</g, '>Verificador de Domínio<'],
    [/>Hosting Ilimitado</g, '>Hospedagem Ilimitada<'],
    [/>Hosting Exclusivo</g, '>Hospedagem Exclusiva<'],
    [/>Radio Streaming</g, '>Rádio Streaming<'],
    [/>Video Streaming</g, '>Vídeo Streaming<'],
    [/>Linux No Administrado</g, '>Linux Não Gerenciado<'],
    [/>Linux Administrado</g, '>Linux Gerenciado<'],
    [/>Windows No Administrado</g, '>Windows Não Gerenciado<'],
    [/>Windows Administrado</g, '>Windows Gerenciado<'],
    [/>Reseller CPanel & WHM</g, '>Revenda cPanel & WHM<'],
    [/>Reseller DirectAdmin</g, '>Revenda DirectAdmin<'],
    [/>Sobre Nosotros</g, '>Sobre a NETZ<'],
    [/>Aviso Legal</g, '>Aviso Legal<'],
    [/>Política de Privacidad</g, '>Política de Privacidade<'],
    [/>Términos de Servicio</g, '>Termos de Serviço<'],
    [/>Términos del Servicio</g, '>Termos de Serviço<'],
    [/>Gestiones de Usuario</g, '>Gestão do Usuário<'],
    [/>Métodos de pagos</g, '>Métodos de Pagamento<'],
    [/>Contactos Rápido</g, '>Contato Rápido<'],

    // Badges, Buttons, Footers
    ['Hecho con amor en Paraguay por NETZ', 'Desenvolvido com excelência pela NETZ'],
    ['Español - Paraguay', 'Português - Brasil'],
    ['Última Actualización: 2026', 'Última Atualização: 2026'],
    ['Al utilizar nuestros servicios aceptas el', 'Ao utilizar nossos serviços você aceita o'],
    ['Nuestro equipo de soporte está aquí para usted 24/7', 'Nossa equipe de suporte está à sua disposição 24/7'],
    [/de nuestra sección de atención al cliente\./g, 'através de nossos canais de atendimento ao cliente.'],
    [/sección de <a href="centro-de-ayuda">preguntas y respuestas<\/a>/g, '<a href="centro-de-ayuda">Perguntas e Respostas</a>'],
    [/seccion de <a href="centro-de-ayuda">preguntas y respuestas<\/a>/g, '<a href="centro-de-ayuda">Perguntas e Respostas</a>'],
    ['¿Todavía tienes preguntas?', 'Ainda tem dúvidas?'],
    ['PUEDES HABLAR CON NOSOTROS.', 'FALE CONOSCO DIRETAMENTE.'],
    ['PUEDES\n                        HABLAR CON NOSOTROS.', 'FALE CONOSCO DIRETAMENTE.'],
    ['¿Necesitas<br>ayuda inmediata?', 'Precisa de<br>ajuda imediata?'],
    ['¿Necesitas ayuda inmediata?', 'Precisa de ajuda imediata?'],
    ['Nuestro equipo de apoyo está a su disposición<br>24 horas al\n                        día, 7 días a la semana.', 'Nossa equipe de suporte especializado está disponível<br>24 horas por dia, 7 dias por semana.'],
    ['Nuestro equipo de apoyo está a su disposición<br>24 horas al día, 7 días a la semana.', 'Nossa equipe de suporte especializado está disponível<br>24 horas por dia, 7 dias por semana.'],
    ['Abrir Ticket', 'Abrir Chamado'],
    ['Realizar Pago', 'Faturas e Pagamento'],
    ['Pagar Ahora', 'Pagar Fatura'],
    ['Comprar Hosting', 'Contratar Hospedagem'],
    ['Soporte 24/7', 'Suporte Técnico 24/7'],
    ['¡Empieza ahora!', 'Comece Agora!'],
    ['Empieza ahora', 'Comece Agora'],
    ['Empieza con nosotros ahora', 'Comece conosco agora'],
    ['Comenzar ahora', 'Começar Agora'],
    ['Contratar ahora', 'Contratar Agora'],
    ['Comprar ahora', 'Contratar Agora'],
    ['Ver Planes', 'Ver Planos'],
    ['Ver planes', 'Ver Planos'],
    ['Mes', 'Mês'],
    ['/mes', '/mês'],
    ['Año', 'Ano'],
    ['/año', '/ano'],
    ['Mensual', 'Mensal'],
    ['Anual', 'Anual'],
    ['2 MESES GRATIS CON EL PAGO ANUAL', '2 MESES GRÁTIS NO PAGAMENTO ANUAL'],
    ['CHEQUEA NUESTROS PLANES DE HOSTING', 'CONHEÇA NOSSOS PLANOS DE HOSPEDAGEM'],
    ['Recursos exclusivos con mayor velocidad!', 'Recursos Exclusivos com Máxima Velocidade!'],
    ['Haga Que Su Empresa Este En Línea Hoy Mismo Con Unidades SSD Rápidas, Creador De Sitios Web Gratuito *', 'Coloque Sua Empresa Online Hoje Mesmo com Unidades SSD Rápidas e Criador de Sites Grátis *'],
    ['Almacenamiento Web De Correo Ilimitado', 'Armazenamento de E-mails Corporativos Ilimitado'],
    ['Certificados SSL Gratuitos Incluidos', 'Certificados SSL Gratuitos Inclusos'],
    ['Servicio sin límites de<br>recursos', 'Recursos Ilimitados'],
    ['Recursos exclusivos <br>con mayor velocidad!', 'Recursos Dedicados <br>com Máxima Velocidade!'],
    ['¡Administre usted mismo!', 'Acesso Root Completo!'],
    ['Todo el poder <br>NINGUNO de los problemas', 'Todo o Poder <br>SEM Complicações'],
    ['Todo el poder <br>SEM complicações', 'Todo o Poder <br>SEM Complicações'],
    ['¡Control Total por RDP!', 'Controle Total via RDP!'],
    ['Servidor Administrado', 'Servidor Totalmente Gerenciado'],
    ['Sonido limpio y fluido <br>Sonido de Calidad', 'Áudio HD Cristalino <br>Sem Travamentos'],
    ['Calidad máxima 720p <br>Streaming SSL', 'Qualidade HD 720p <br>Transmissão SSL'],
    ['2 CPU - 2Gb Ram, por cPanel', '2 CPU - 2GB RAM por conta cPanel'],
    ['2 CPU - 2Gb Ram, por cuenta', '2 CPU - 2GB RAM por conta'],
    ['Consulta de disponibilidad', 'Consulta de Disponibilidade'],
    ['Transfiera su dominio', 'Transfira seu Domínio'],
    ['Dominio Gratis', 'Domínio Grátis'],
    ['(por cuenta de cPanel)', '(por conta de cPanel)'],
    ['(por cuenta de alojamiento)', '(por conta de hospedagem)'],
    ['(Certificado SSL Gratis<br>en todas las cuentas)', '(Certificado SSL Grátis<br>em todas as contas)'],
    ['(Certificado SSL Gratis en todas las cuentas)', '(Certificado SSL Grátis em todas as contas)'],
    ['Gestión centralizada', 'Gerenciamento Centralizado'],
    ['Protección DDoS', 'Proteção DDoS'],
    ['Protección DDoS de nivel empresarial', 'Proteção DDoS de Nível Empresarial'],
    ['Soporte técnico 24/7', 'Suporte Técnico 24/7'],
    ['MagicSpam Protección', 'Proteção Anti-Spam MagicSpam'],
    ['99,99% de garantía de tiempo de actividad', '99.99% de Garantia de Uptime'],
    ['99,9% de tiempo de <br>Actividad garantizado', '99.9% de Disponibilidade<br>Garantida'],
    ['99,9% de tiempo de<br>Actividad garantizado', '99.9% de Disponibilidade<br>Garantida'],
    ['99.9% de garantía de tiempo de actividad', '99.9% de Garantia de Uptime'],
    ['Migración libre', 'Migração Gratuita'],
    ['Migración', 'Migração Gratuita'],
    ['Simultaneous Listeners <b>Ilimitado</b>', 'Ouvintes Simultâneos <b>Ilimitados</b>'],
    ['Transferencia <b>Ilimitada</b>', 'Tráfego <b>Ilimitado</b>'],
    ['Calidad <b>HD</b>', 'Qualidade <b>HD</b>'],
    ['AutoDJ <b>Incluido</b>', 'AutoDJ <b>Incluso</b>'],
    ['Panel <b>SonicPanel</b>', 'Painel <b>SonicPanel</b>']
];

module.exports = {
    safeReplace,
    replaceFlexible,
    globalBrReplacements,
    localesBrDir,
    brDir,
    distBrDir
};
