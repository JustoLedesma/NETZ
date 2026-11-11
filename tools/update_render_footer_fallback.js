const fs = require('fs');

const fFiles = ['assets/js/footer.js', 'dist/assets/js/footer.js'];

fFiles.forEach(p => {
    if (fs.existsSync(p)) {
        let content = fs.readFileSync(p, 'utf8');
        const oldCode = `    function renderFooter() {
        var country = (document.documentElement.getAttribute('data-country') || '').toLowerCase();
        var path = (window.location.pathname || '').toLowerCase();
        var isUs = country === 'us' || path.startsWith('/us') || path.includes('/us/');
        var isBr = country === 'br' || path.startsWith('/br') || path.includes('/br/');`;

        const newCode = `    function renderFooter() {
        var country = (document.documentElement.getAttribute('data-country') || '').toLowerCase();
        var path = (window.location.pathname || '').toLowerCase();
        if (!country) {
            var match = path.match(/^\\/(ar|br|cl|co|es|mx|us)\\b/);
            if (match) country = match[1];
            else country = 'py';
        }
        var isUs = country === 'us' || path.startsWith('/us') || path.includes('/us/');
        var isBr = country === 'br' || path.startsWith('/br') || path.includes('/br/');`;

        if (content.includes(oldCode)) {
            content = content.replace(oldCode, newCode);
            fs.writeFileSync(p, content, 'utf8');
            console.log('✅ Updated renderFooter country fallback in:', p);
        } else {
            console.log('Old code not matched in:', p);
        }
    }
});

