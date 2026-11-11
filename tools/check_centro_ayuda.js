const fs = require('fs');

const paths = [
    'locales/br/centro-de-ayuda.html',
    'br/centro-de-ayuda.html',
    'dist/br/centro-de-ayuda.html'
];

paths.forEach(p => {
    if (fs.existsSync(p)) {
        const c = fs.readFileSync(p, 'utf8');
        console.log('=== ' + p + ' ===');
        console.log('size:', c.length);
        console.log('has ¿:', c.includes('¿'));
        console.log('has Central de Ajuda:', c.includes('Central de Ajuda'));
        console.log('has Centro de Ayuda:', c.includes('Centro de Ayuda'));
        
        // Find TOC links
        const tocMatches = c.match(/<a href="#go-to-qst-\d+">[\s\S]*?<\/a>/g) || [];
        console.log('TOC links count:', tocMatches.length);
        if (tocMatches.length > 0) {
            console.log('TOC[0]:', tocMatches[0].trim());
            console.log('TOC[1]:', tocMatches[1].trim());
        }

        // Find main question list items
        const qMatches = c.match(/<li id="go-to-qst-\d+">[\s\S]*?<\/li>/g) || [];
        console.log('Main question items count:', qMatches.length);
        if (qMatches.length > 0) {
            console.log('Q[0]:', qMatches[0].substring(0, 150).replace(/\s+/g, ' '));
        }
    } else {
        console.log(p + ' NOT FOUND');
    }
});

