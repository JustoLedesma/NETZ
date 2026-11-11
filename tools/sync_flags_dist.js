const fs = require('fs');
const path = require('path');

const srcDir = 'assets/img/flags';
const dstDir = 'dist/assets/img/flags';

if (!fs.existsSync(dstDir)) fs.mkdirSync(dstDir, { recursive: true });

fs.readdirSync(srcDir).forEach(f => {
    fs.copyFileSync(path.join(srcDir, f), path.join(dstDir, f));
    console.log('Copied flag to dist:', f);
});

