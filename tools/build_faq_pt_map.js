const fs = require('fs');

const faqPtMap = [
    {
        num: "01",
        q_pt: "Quem somos nós?",
        a_pt: "<p>Somos uma empresa especializada em Hospedagem de Sites Ilimitada, Servidores Cloud VPS, Streaming de Áudio e Vídeo e Registro de Domínios. Com mais de 7 anos de experiência, nossa missão é entregar alta performance, estabilidade e atendimento especializado 24 horas por dia.</p>"
    },
    {
        num: "02",
        q_pt: "O que é um domínio?",
        a_pt: "<p>Um domínio é o endereço exclusivo que identifica seu site na internet (como seunome.com.br ou netz.com.py). Ele permite que seus clientes acessem suas páginas facilmente sem precisarem memorizar endereços IP complexos.</p>"
    },
    {
        num: "03",
        q_pt: "Como funciona um domínio?",
        a_pt: "<p>O domínio funciona como um atalho que direciona o visitante ao servidor onde os arquivos e bancos de dados do seu site estão hospedados. Servidores DNS globais traduzem o nome do domínio no IP correto instantaneamente.</p>"
    },
    {
        num: "04",
        q_pt: "Vocês registram domínios com extensão .py ou regionais?",
        a_pt: "<p>Sim! Registramos domínios internacionais (.com, .net, .org, .online) e também gerenciamos extensões regionais. Se você precisar de ativação de domínios específicos, nossa equipe realiza a liberação manual rapidamente.</p>"
    },
    {
        num: "05",
        q_pt: "A migração ou transferência de um domínio possui custos adicionais?",
        a_pt: "<p>Apontar um domínio existente para os nossos servidores de hospedagem é 100% gratuito. Para transferências completas de registrador (.com, .net), você paga apenas a taxa padrão de renovação, que estende a validade do domínio por mais 1 ano adicional.</p>"
    },
    {
        num: "06",
        q_pt: "Como migrar meu domínio para a NETZ?",
        a_pt: "<p>Basta acessar o painel onde seu domínio foi registrado e alterar os servidores DNS (Nameservers) para os servidores da NETZ: <code>ns1.netz.com.py</code> e <code>ns2.netz.com.py</code>. O prazo de propagação na internet é de 2 a 24 horas.</p>"
    },
    {
        num: "07",
        q_pt: "O que é Hospedagem de Sites (Web Hosting)?",
        a_pt: "<p>A hospedagem de sites é o serviço de infraestrutura e espaço em disco onde todos os arquivos, páginas, imagens, bancos de dados e e-mails do seu site ficam armazenados para ficarem acessíveis online na internet 24 horas por dia.</p>"
    },
    {
        num: "08",
        q_pt: "Como contratar meu plano de hospedagem?",
        a_pt: "<p>Basta escolher o plano ideal para suas necessidades em nosso site, definir se deseja usar um domínio que já possui ou registrar um novo, escolher o ciclo de pagamento (mensal ou anual) e concluir o pedido seguro. A ativação é automática e imediata.</p>"
    },
    {
        num: "09",
        q_pt: "Posso utilizar a hospedagem para servidores de jogos online?",
        a_pt: "<p>A hospedagem compartilhada é otimizada exclusivamente para sites, bancos de dados e e-mails. Para rodar servidores de jogos online, recomendamos nossos servidores Cloud VPS Linux ou Windows, que fornecem acesso root/administrador e recursos dedicados.</p>"
    },
    {
        num: "10",
        q_pt: "O que são e-mails profissionais corporativos?",
        a_pt: "<p>São contas de e-mail que utilizam o seu próprio domínio (como <code>contato@suaempresa.com.br</code>) em vez de provedores genéricos. Elas transmitem credibilidade profissional, contam com webmail moderno, filtros anti-spam e sincronizam no celular e Outlook.</p>"
    },
    {
        num: "11",
        q_pt: "Os planos de hospedagem são gerenciados?",
        a_pt: "<p>Sim, nossa hospedagem é semi-gerenciada pela nossa equipe de infraestrutura. Cuidamos da estabilidade física do servidor, segurança contra ataques, atualizações do sistema e rede, enquanto você administra seus sites facilmente pelo cPanel.</p>"
    },
    {
        num: "12",
        q_pt: "Preciso registrar um novo domínio ao adquirir um plano?",
        a_pt: "<p>Não é obrigatório. Você pode conectar um domínio que já possua em qualquer outro registrador ou adquirir um novo diretamente durante o processo de compra.</p>"
    },
    {
        num: "13",
        q_pt: "Como posso alterar os nameservers do meu domínio?",
        a_pt: "<p>No painel do registrador onde comprou o domínio, acesse a opção de Gerenciamento DNS / Nameservers e insira os servidores da NETZ: <code>ns1.netz.com.py</code> e <code>ns2.netz.com.py</code>.</p>"
    },
    {
        num: "14",
        q_pt: "Quais tipos de bancos de dados estão inclusos?",
        a_pt: "<p>Todos os planos de hospedagem acompanham bancos de dados MySQL e MariaDB ilimitados e otimizados, gerenciáveis através da interface phpMyAdmin.</p>"
    },
    {
        num: "15",
        q_pt: "Os planos possuem transferência (tráfego) ilimitada?",
        a_pt: "<p>Sim! Nossos planos contam com tráfego ilimitado para que o seu site suporte picos de visitas sem cobranças extras ou interrupções inesperadas, respeitando nossa política de uso aceitável.</p>"
    },
    {
        num: "16",
        q_pt: "Que tipo de conteúdo é permitido hospedar?",
        a_pt: "<p>Você pode hospedar sites pessoais, corporativos, blogs e e-commerces legítimos. É estritamente proibido hospedar malware, páginas de phishing, pirataria, scripts de ataque ou conteúdos que violem direitos autorais e legislações vigentes.</p>"
    },
    {
        num: "17",
        q_pt: "Qual sistema operacional roda em nossos servidores?",
        a_pt: "<p>Nossa plataforma roda sobre CloudLinux OS corporativo com servidor web LiteSpeed, proporcionando estabilidade incomparável, isolamento térmico de contas e suporte a múltiplas versões de PHP.</p>"
    },
    {
        num: "18",
        q_pt: "Quanto tempo leva para ativar meu plano?",
        a_pt: "<p>A ativação de planos de hospedagem, servidores VPS pré-configurados e streaming é realizada de forma automática e instantânea assim que o pagamento é identificado pelo sistema.</p>"
    },
    {
        num: "19",
        q_pt: "Vocês disponibilizam acesso via SSH?",
        a_pt: "<p>Sim, disponibilizamos acesso SSH enjaulado e seguro para usuários e desenvolvedores que necessitarem, mediante solicitação à nossa equipe de suporte.</p>"
    },
    {
        num: "20",
        q_pt: "Há suporte nativo para Ruby, Python e Node.js?",
        a_pt: "<p>Sim! Através do CloudLinux App Selector dentro do cPanel, você pode criar ambientes virtuais e selecionar versões estáveis de Node.js, Python e Ruby com um clique.</p>"
    },
    {
        num: "21",
        q_pt: "Posso fazer upgrade ou alterar meu plano no futuro?",
        a_pt: "<p>Sim. Você pode mudar para um plano superior ou ajustar recursos a qualquer momento diretamente pela Área do Cliente, sem que seu site fique fora do ar.</p>"
    },
    {
        num: "22",
        q_pt: "Qual é o limite de envio de e-mails por hora?",
        a_pt: "<p>Para proteger a reputação do servidor e garantir que suas mensagens corporativas não caiam na caixa de spam, nossos planos possuem limite padrão de 200 e-mails por hora por domínio via MailChannels.</p>"
    },
    {
        num: "23",
        q_pt: "A NETZ oferece promoções e descontos em pagamentos anuais?",
        a_pt: "<p>Sim! Oferecemos 2 meses grátis para todos os planos contratados no ciclo de faturamento anual, além de promoções sazonais divulgadas em nosso site.</p>"
    },
    {
        num: "24",
        q_pt: "Quais são os métodos de pagamento aceitos?",
        a_pt: "<p>Aceitamos cartões de crédito e débito internacionais e nacionais (Visa, Mastercard, Amex), PayPal, transferências bancárias e pagamentos eletrônicos seguros.</p>"
    },
    {
        num: "25",
        q_pt: "Já realizei o pagamento. Quanto tempo leva para liberar?",
        a_pt: "<p>Pagamentos via cartão de crédito e PayPal são liberados na mesma hora. Pagamentos manuais ou por transferência bancária são compensados rapidamente após o envio do comprovante.</p>"
    },
    {
        num: "26",
        q_pt: "Pode haver reajuste de preços na renovação?",
        a_pt: "<p>Praticamos preços transparentes sem cobranças ocultas na renovação. Ajustes só ocorrem em caso de reajustes oficiais das licenças globais (como cPanel ou ICANN), avisados com ampla antecedência.</p>"
    },
    {
        num: "27",
        q_pt: "Existe garantia e política de reembolso?",
        a_pt: "<p>Sim! Oferecemos garantia incondicional de reembolso de 30 dias para todos os planos de hospedagem compartilhada e revenda, caso você não fique 100% satisfeito com nossos serviços.</p>"
    },
    {
        num: "28",
        q_pt: "Posso cancelar o serviço quando desejar?",
        a_pt: "<p>Sim, você possui total liberdade para cancelar qualquer serviço a qualquer momento pela Área do Cliente. Não existem contratos de fidelidade ou taxas de cancelamento.</p>"
    },
    {
        num: "29",
        q_pt: "Se eu esquecer de pagar uma fatura, meu site será cancelado imediatamente?",
        a_pt: "<p>Não. Concedemos um período de carência após o vencimento e enviamos lembretes por e-mail antes de qualquer suspensão temporária, que é revertida assim que a fatura é quitada.</p>"
    },
    {
        num: "30",
        q_pt: "Vocês possuem tutoriais e base de conhecimento?",
        a_pt: "<p>Sim! Nossa Central de Ajuda conta com tutoriais passo a passo ensinando a configurar contas no Outlook, alterar DNS, gerenciar o cPanel e instalar plataformas CMS.</p>"
    },
    {
        num: "31",
        q_pt: "Solicitei a transferência de domínio. Quanto tempo demora?",
        a_pt: "<p>A transferência de domínios internacionais (.com, .net, etc.) costuma levar entre 5 e 7 dias para ser concluída pelos órgãos de registro após a aprovação no e-mail do titular.</p>"
    },
    {
        num: "32",
        q_pt: "Posso agendar tarefas automáticas (Cron Jobs)?",
        a_pt: "<p>Sim, você pode criar e gerenciar rotinas agendadas (Cron Jobs) livremente através do cPanel para executar scripts PHP, rotinas de banco de dados e limpezas automáticas.</p>"
    },
    {
        num: "33",
        q_pt: "É permitido o envio de Spam?",
        a_pt: "<p>Não. O envio de e-mails em massa não solicitados (SPAM) é expressamente proibido e resulta na suspensão imediata da conta para preservar a entregabilidade de toda a rede.</p>"
    },
    {
        num: "34",
        q_pt: "A hospedagem é compatível com Cloudflare?",
        a_pt: "<p>Sim, nossa infraestrutura é 100% compatível com a CDN e recursos de proteção da Cloudflare. Você pode apontar seu domínio via DNS facilmente.</p>"
    },
    {
        num: "35",
        q_pt: "Posso gerar e baixar backups do meu site?",
        a_pt: "<p>Sim, você pode gerar cópias de segurança completas ou parciais dos seus arquivos, e-mails e bancos de dados diretamente pelo cPanel e baixar para o seu computador.</p>"
    },
    {
        num: "36",
        q_pt: "Qual é o nível de segurança dos servidores?",
        a_pt: "<p>Nossa infraestrutura conta com firewall de aplicação web BitNinja, varredura antivírus em tempo real, mitigação automática de DDoS e isolamento de contas em nível de sistema operacional.</p>"
    },
    {
        num: "37",
        q_pt: "Qual é a garantia de disponibilidade da rede?",
        a_pt: "<p>Garantimos 99.9% de uptime contratual para servidores e conexões de rede, respaldados por datacenters com redundância energética e conectividade multicarrier de alta velocidade.</p>"
    },
    {
        num: "38",
        q_pt: "Posso instalar o WordPress e outros aplicativos com 1 clique?",
        a_pt: "<p>Sim! Através do instalador automático Softaculous no cPanel, você instala WordPress, WooCommerce, Joomla, PrestaShop e mais de 400 scripts em questão de segundos.</p>"
    },
    {
        num: "39",
        q_pt: "A NETZ oferece criador de sites gratuito?",
        a_pt: "<p>Sim! Todos os nossos planos de hospedagem incluem o criador de sites SitePro no formato arraste-e-solte, permitindo montar páginas profissionais e responsivas sem programar.</p>"
    },
    {
        num: "40",
        q_pt: "O que é HTTPS e por que ele é indispensável?",
        a_pt: "<p>O protocolo HTTPS criptografa todas as informações trocadas entre os visitantes e o seu servidor, evitando interceptação de senhas e dados bancários, além de ser essencial para um bom ranqueamento no Google.</p>"
    },
    {
        num: "41",
        q_pt: "Por que preciso de um certificado SSL no meu site?",
        a_pt: "<p>O certificado SSL evita que navegadores como Google Chrome exibam a mensagem de 'Site Não Seguro', aumentando a confiança dos seus clientes e as conversões do seu negócio. Ele é gratuito na NETZ.</p>"
    },
    {
        num: "42",
        q_pt: "O que é um servidor VPS Linux Não Gerenciado?",
        a_pt: "<p>Um VPS Não Gerenciado oferece hardware virtual dedicado com acesso root completo via SSH. Você é o administrador total do sistema e fica responsável pela instalação e configuração de softwares.</p>"
    },
    {
        num: "43",
        q_pt: "Os planos de VPS Não Gerenciado incluem suporte técnico?",
        a_pt: "<p>O suporte cobre a disponibilidade física do servidor, estabilidade da rede, energia e inicialização de hardware. A configuração interna de pacotes e scripts é de responsabilidade do cliente.</p>"
    },
    {
        num: "44",
        q_pt: "Posso migrar meu servidor não gerenciado para gerenciado?",
        a_pt: "<p>Sim! Você pode contratar nosso pacote de gerenciamento completo a qualquer momento e nossa equipe especializada passará a cuidar de toda a manutenção e suporte do seu servidor.</p>"
    },
    {
        num: "45",
        q_pt: "Qual é a diferença entre servidores Linux gerenciados e não gerenciados?",
        a_pt: "<p>Nos servidores não gerenciados o cliente possui autonomia total e gerencia o sistema de forma independente. Nos servidores gerenciados nossa equipe cuida de atualizações, segurança e resolução de problemas técnicos.</p>"
    },
    {
        num: "46",
        q_pt: "Quais são os benefícios de solicitar um VPS Linux Não Gerenciado?",
        a_pt: "<p>Os planos não gerenciados oferecem o menor custo por recurso dedicado, concedendo aos desenvolvedores e equipes de TI total liberdade para rodar kernels personalizados e aplicações sob medida.</p>"
    },
    {
        num: "47",
        q_pt: "Devo escolher um VPS Linux gerenciado ou não gerenciado?",
        a_pt: "<p>Se você domina o terminal Linux e quer total controle e economia, escolha o Não Gerenciado. Se prefere que nossos especialistas cuidem da estabilidade e segurança da sua infraestrutura, escolha o Gerenciado.</p>"
    },
    {
        num: "48",
        q_pt: "A utilização de recursos do VPS é dedicada?",
        a_pt: "<p>Sim. Os recursos contratados (núcleos de CPU, memória RAM e disco NVMe) são virtualizados via KVM para o seu servidor, garantindo performance exclusiva e sem concorrência de vizinhos.</p>"
    },
    {
        num: "49",
        q_pt: "O que é um servidor VPS Windows?",
        a_pt: "<p>É uma máquina virtual rodando Windows Server com recursos dedicados, que você pode acessar de qualquer lugar do mundo como se estivesse diante da sua própria área de trabalho remota.</p>"
    },
    {
        num: "50",
        q_pt: "Como posso acessar meu servidor VPS Windows?",
        a_pt: "<p>Basta abrir o aplicativo Conexão de Área de Trabalho Remota (RDP) no seu computador Windows, Mac ou celular e inserir o endereço IP e a senha de Administrador fornecida.</p>"
    },
    {
        num: "51",
        q_pt: "Posso navegar na internet e instalar programas no VPS Windows?",
        a_pt: "<p>Sim! O VPS funciona como um computador completo. Você pode navegar em qualquer site, baixar arquivos, executar programas de automação e instalar bancos de dados livremente.</p>"
    },
    {
        num: "52",
        q_pt: "Vocês fornecem licenças de bancos de dados Microsoft SQL (MSSQL)?",
        a_pt: "<p>Sim, licenças oficiais do Microsoft SQL Server Web podem ser contratadas e vinculadas ao seu servidor diretamente através do portal do cliente.</p>"
    },
    {
        num: "53",
        q_pt: "O Windows Server já vem com licença oficial ativa?",
        a_pt: "<p>Sim! Todos os nossos servidores VPS Windows contam com licença oficial autêntica ativada via parceria Microsoft SPLA, prontos para produção imediata.</p>"
    },
    {
        num: "54",
        q_pt: "Posso fazer upgrade de CPU, memória e disco quando quiser?",
        a_pt: "<p>Sim. Você pode aumentar núcleos de processamento, memória RAM e capacidade de disco SSD a qualquer momento pela Área do Cliente sem necessidade de reinstalar o servidor.</p>"
    },
    {
        num: "55",
        q_pt: "Vocês oferecem sistema de backup para servidores Windows?",
        a_pt: "<p>Sim, oferecemos opções de snapshots em nuvem e backups incrementais automatizados para garantir que seus arquivos corporativos estejam sempre protegidos.</p>"
    },
    {
        num: "56",
        q_pt: "O que contempla o gerenciamento completo do servidor Windows?",
        a_pt: "<p>Nosso gerenciamento inclui monitoramento 24/7, atualizações de segurança do Windows, auxílio em configurações de rede, firewall e substituição rápida de hardware em caso de falhas.</p>"
    },
    {
        num: "57",
        q_pt: "Meu servidor Windows receberá as atualizações oficiais do sistema?",
        a_pt: "<p>Sim, o Windows Update permanece ativo para que você possa receber e aplicar correções de segurança críticas diretamente da Microsoft.</p>"
    },
    {
        num: "58",
        q_pt: "O que é um servidor VPS Linux Gerenciado?",
        a_pt: "<p>É uma solução cloud corporativa onde entregamos o servidor pronto e nossa equipe de engenharia assume a responsabilidade pelas atualizações, segurança e monitoramento contínuo.</p>"
    },
    {
        num: "59",
        q_pt: "Vocês auxiliam na migração do meu provedor antigo para a NETZ?",
        a_pt: "<p>Sim! Oferecemos migração profissional gratuita para contas cPanel e sites, transferindo bancos de dados e arquivos com total segurança e sem instabilidades.</p>"
    },
    {
        num: "60",
        q_pt: "Como funciona o suporte técnico avançado?",
        a_pt: "<p>Nosso suporte avançado opera 24 horas por dia, 7 dias por semana, com técnicos qualificados prontos para resolver dúvidas de DNS, correio corporativo e performance de servidores.</p>"
    },
    {
        num: "61",
        q_pt: "Tenho controle total do meu VPS Linux?",
        a_pt: "<p>Sim. Mesmo nos planos gerenciados, você mantém acesso administrativo completo para instalar e rodar suas aplicações conforme sua necessidade.</p>"
    },
    {
        num: "62",
        q_pt: "Posso fazer upgrade do meu VPS Linux futuramente?",
        a_pt: "<p>Sim, upgrades de CPU, memória RAM e armazenamento SSD NVMe podem ser solicitados em tempo real sem alteração do seu endereço IP.</p>"
    },
    {
        num: "63",
        q_pt: "Posso utilizar minha própria ISO no VPS Linux?",
        a_pt: "<p>Sim! Nosso painel em nuvem permite acoplar imagens ISO personalizadas para instalar sistemas operacionais específicos ou ferramentas de recuperação.</p>"
    },
    {
        num: "64",
        q_pt: "Vocês oferecem sistema de backup para VPS Linux?",
        a_pt: "<p>Sim, disponibilizamos snapshots automatizados diários e pontos de restauração rápidos para garantir total tranquilidade na operação do seu negócio.</p>"
    },
    {
        num: "65",
        q_pt: "Como ativar o certificado SSL gratuito na minha conta de Hospedagem?",
        a_pt: "<p>O certificado SSL gratuito de 256 bits é ativado e instalado de forma automática pelo nosso sistema AutoSSL logo após os DNS do seu domínio apontarem para a NETZ. Não requer nenhuma configuração manual.</p>"
    }
];

fs.writeFileSync('tools/faq_pt_map.json', JSON.stringify(faqPtMap, null, 2), 'utf8');
console.log('Salvos 65 itens de FAQ em português para tools/faq_pt_map.json');
