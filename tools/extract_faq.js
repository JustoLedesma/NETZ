const fs = require('fs');

const content = fs.readFileSync('us/centro-de-ayuda.html', 'utf8');
const regex = /<li id="go-to-qst-(\d+)"><span>([\s\S]*?)<\/span>([\s\S]*?)<\/li>/g;
let match;
const qas = [];
while ((match = regex.exec(content)) !== null) {
    qas.push({
        num: match[1],
        q: match[2].trim().replace(/\s+/g, ' '),
        a: match[3].trim().replace(/\s+/g, ' ')
    });
}
console.log('Total extracted QA pairs:', qas.length);
fs.writeFileSync('tools/extracted_faq.json', JSON.stringify(qas, null, 2), 'utf8');
console.log('Saved to tools/extracted_faq.json');

