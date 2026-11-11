const fs = require('fs');

const nbFiles = ['assets/js/navbar.js', 'dist/assets/js/navbar.js'];

nbFiles.forEach(p => {
    if (fs.existsSync(p)) {
        let content = fs.readFileSync(p, 'utf8');
        const oldPrefixCode = `    function getCountryPrefix() {
        var country = (document.documentElement.getAttribute('data-country') || '').toLowerCase();
        var path = (window.location.pathname || '').toLowerCase();
        if (country === 'us' || path.startsWith('/us') || path.includes('/us/')) return '/us';
        if (country === 'br' || path.startsWith('/br') || path.includes('/br/')) return '/br';
        return (country === 'py') ? '' : (country ? '/' + country : '');
    }`;

        const newPrefixCode = `    function getCountryPrefix() {
        var country = (document.documentElement.getAttribute('data-country') || '').toLowerCase();
        var path = (window.location.pathname || '').toLowerCase();
        var match = path.match(/^\\/(ar|br|cl|co|es|mx|us)\\b/);
        if (match) return '/' + match[1];
        if (country && country !== 'py') return '/' + country;
        return '';
    }`;

        if (content.includes(oldPrefixCode)) {
            content = content.replace(oldPrefixCode, newPrefixCode);
            fs.writeFileSync(p, content, 'utf8');
            console.log('✅ Updated getCountryPrefix in:', p);
        } else {
            console.log('Pattern not matched in:', p);
        }
    }
});
