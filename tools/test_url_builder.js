const fs = require('fs');

const testPath1 = '/br/hosting-ilimitado';
const testPath2 = '/us/about.html';
const testPath3 = '/contact';
const testPath4 = '/';
const testPath5 = '/br/';

function getCleanSlug(path) {
    var clean = path.replace(/^\/+|\/+$/g, '');
    var parts = clean ? clean.split('/') : [];
    var known = ['br', 'us', 'ar', 'es', 'cl', 'co', 'mx', 'py'];
    if (parts.length > 0 && known.indexOf(parts[0].toLowerCase()) !== -1) {
        parts.shift();
    }
    return parts.join('/');
}

function getUrl(path, target) {
    var slug = getCleanSlug(path);
    if (target === 'py' || !target) {
        return '/' + (slug ? slug : '');
    }
    return '/' + target + '/' + (slug ? slug : '');
}

console.log('Test 1 (/br/hosting-ilimitado) -> py:', getUrl(testPath1, 'py'), 'us:', getUrl(testPath1, 'us'), 'br:', getUrl(testPath1, 'br'));
console.log('Test 2 (/us/about.html) -> py:', getUrl(testPath2, 'py'), 'br:', getUrl(testPath2, 'br'), 'ar:', getUrl(testPath2, 'ar'));
console.log('Test 3 (/contact) -> br:', getUrl(testPath3, 'br'), 'us:', getUrl(testPath3, 'us'), 'py:', getUrl(testPath3, 'py'));
console.log('Test 4 (/) -> br:', getUrl(testPath4, 'br'), 'us:', getUrl(testPath4, 'us'), 'py:', getUrl(testPath4, 'py'));
console.log('Test 5 (/br/) -> py:', getUrl(testPath5, 'py'), 'us:', getUrl(testPath5, 'us'), 'br:', getUrl(testPath5, 'br'));

