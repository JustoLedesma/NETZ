const fs = require('fs');

const folders = ['.', 'ar', 'br', 'cl', 'co', 'es', 'mx', 'us'];
const files = [
    '404.html', 'about.html', 'audio-streaming.html', 'aviso-legal.html',
    'buscar-dominios.html', 'centro-de-ayuda.html', 'contact.html',
    'hosting-exclusivo.html', 'hosting-ilimitado.html', 'index.html',
    'politica-de-privacidad.html', 'reseller-cpanel.html', 'reseller-directadmin.html',
    'terminos-del-servicio.html', 'video-streaming.html', 'vps-linux-administrado.html',
    'vps-linux-no-administrado.html', 'vps-linux.html', 'vps-windows-administrado.html',
    'vps-windows-no-administrado.html', 'vps-windows.html'
];

folders.forEach(dir => {
    let missingFooter = 0;
    let missingScript = 0;
    files.forEach(f => {
        const filePath = (dir === '.' ? f : dir + '/' + f);
        if (fs.existsSync(filePath)) {
            const c = fs.readFileSync(filePath, 'utf8');
            if (!c.includes('id="footer-container"') && !c.includes("id='footer-container'")) missingFooter++;
            if (!c.includes('/assets/js/footer.js') && !c.includes('js/footer.js')) missingScript++;
        }
    });
    console.log(`Folder [${dir}]: missing footer div = ${missingFooter}, missing footer.js = ${missingScript}`);
});
