const fs = require('fs');

const dirs = fs.readdirSync('.', { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

console.log('Workspace root directories:', dirs);

const countryDirs = ['ar', 'br', 'cl', 'co', 'es', 'mx', 'us'];
countryDirs.forEach(c => {
    if (fs.existsSync(c)) {
        console.log(c, 'exists, files count:', fs.readdirSync(c).length);
    } else {
        console.log(c, 'DOES NOT EXIST');
    }
});
