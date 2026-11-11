const fs = require('fs');

const countryDirs = ['ar', 'br', 'cl', 'co', 'es', 'mx', 'us'];
countryDirs.forEach(c => {
    const p = c + '/index.html';
    if (fs.existsSync(p)) {
        const firstLines = fs.readFileSync(p, 'utf8').split('\n').slice(0, 5).join(' ');
        const match = firstLines.match(/data-country="[^"]*"/);
        console.log(p, '->', match ? match[0] : 'NO data-country');
    }
});
