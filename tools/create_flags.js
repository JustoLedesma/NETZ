const fs = require('fs');
const path = require('path');

const flagsDir = 'assets/img/flags';
if (!fs.existsSync(flagsDir)) fs.mkdirSync(flagsDir, { recursive: true });

// Clean SVG flag definitions (official standard aspect ratios and colors)
const flags = {
    // Brasil
    'br.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 504"><rect width="720" height="504" fill="#009b3a"/><polygon points="360,37.8 680.4,252 360,466.2 39.6,252" fill="#fedf00"/><circle cx="360" cy="252" r="126" fill="#002776"/><path d="M 235.4,260.6 A 151.2,151.2 0 0,0 484.5,248" fill="none" stroke="#fff" stroke-width="15.12"/></svg>`,

    // Argentina
    'ar.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"><rect width="800" height="500" fill="#74acdf"/><rect y="166.6" width="800" height="166.7" fill="#fff"/><circle cx="400" cy="250" r="40" fill="#f6b40e"/><circle cx="400" cy="250" r="30" fill="#853406"/></svg>`,

    // España
    'es.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 500"><rect width="750" height="500" fill="#c60b1e"/><rect y="125" width="750" height="250" fill="#ffc400"/><rect x="130" y="190" width="80" height="100" fill="#c60b1e" rx="10"/></svg>`,

    // United States (standard alias)
    'us.svg': fs.existsSync('assets/img/flags/usa.svg') ? fs.readFileSync('assets/img/flags/usa.svg', 'utf8') : '',

    // Chile
    'cl.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600"><rect width="900" height="600" fill="#d52b1e"/><rect width="900" height="300" fill="#fff"/><rect width="300" height="300" fill="#0039a6"/><polygon points="150,75 173,146 248,146 187,190 210,261 150,217 90,261 113,190 52,146 127,146" fill="#fff"/></svg>`,

    // Colombia
    'co.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600"><rect width="900" height="300" fill="#fcd116"/><rect y="300" width="900" height="150" fill="#003893"/><rect y="450" width="900" height="150" fill="#ce1126"/></svg>`,

    // México
    'mx.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 480"><rect width="280" height="480" fill="#006847"/><rect x="280" width="280" height="480" fill="#fff"/><rect x="560" width="280" height="480" fill="#ce1126"/><circle cx="420" cy="240" r="45" fill="#a06020"/></svg>`
};

for (const [name, content] of Object.entries(flags)) {
    if (content) {
        fs.writeFileSync(path.join(flagsDir, name), content, 'utf8');
        console.log('Created flag:', name);
    }
}
