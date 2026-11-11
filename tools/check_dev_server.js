const fs = require('fs');

const ds = fs.readFileSync('dev_server.go', 'utf8');
const lines = ds.split('\n');
lines.forEach((l, i) => {
    if (l.includes('centro-de-ayuda') || l.includes('br') || l.includes('ServeFile') || l.includes('dist')) {
        console.log((i + 1) + ': ' + l.trim());
    }
});
