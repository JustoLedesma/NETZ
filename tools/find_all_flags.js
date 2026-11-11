const fs = require('fs');
const path = require('path');

function findFiles(dir, filter) {
    let results = [];
    fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory() && entry.name !== '.git' && entry.name !== 'node_modules') {
            results = results.concat(findFiles(full, filter));
        } else if (entry.isFile() && filter(entry.name)) {
            results.push(full);
        }
    });
    return results;
}

console.log(findFiles('assets', name => name.endsWith('.svg') || name.includes('flag') || name.includes('py') || name.includes('br') || name.includes('us') || name.includes('es') || name.includes('ar')));

