const fs = require('fs');

const footerJsPath = 'assets/js/footer.js';
const distFooterJsPath = 'dist/assets/js/footer.js';

let footerContent = fs.readFileSync(footerJsPath, 'utf8');

// The new dynamic footer lang/country changer generator
const newHelperCode = `
    function getCurrentPageSlug() {
        var path = window.location.pathname || '/';
        var clean = path.replace(/^\\/+|\\/+$/g, '');
        var parts = clean ? clean.split('/') : [];
        var known = ['br', 'us', 'ar', 'es', 'cl', 'co', 'mx', 'py'];
        if (parts.length > 0 && known.indexOf(parts[0].toLowerCase()) !== -1) {
            parts.shift();
        }
        return parts.join('/');
    }

    function getTargetUrl(targetCountry) {
        var slug = getCurrentPageSlug();
        if (targetCountry === 'py' || !targetCountry) {
            return '/' + (slug ? slug : '');
        }
        return '/' + targetCountry + '/' + (slug ? slug : '');
    }

    function buildFooterLangChanger(activeCountry, isBr, isUs) {
        var currentLangCode = isBr ? 'pt' : (isUs ? 'en' : 'es');
        var currentLangName = isBr ? 'Português' : (isUs ? 'English' : 'Español');
        var globeIcon = isUs ? 'fa-globe-americas' : (isBr ? 'fa-globe-americas' : 'fa-globe-americas');

        var countryNames = {
            py: 'Paraguay',
            br: 'Brasil',
            us: isUs ? 'United States' : 'Estados Unidos',
            ar: 'Argentina',
            es: 'España',
            cl: 'Chile',
            co: 'Colombia',
            mx: 'México'
        };

        var currentCountryCode = activeCountry || 'py';
        var currentCountryName = countryNames[currentCountryCode] || 'Paraguay';
        var currentCountryFlag = '/assets/img/flags/' + (currentCountryCode === 'py' ? 'py3.svg' : currentCountryCode + '.svg');

        var countriesList = [
            { code: 'py', name: 'Paraguay', flag: '/assets/img/flags/py3.svg' },
            { code: 'br', name: 'Brasil', flag: '/assets/img/flags/br.svg' },
            { code: 'us', name: isUs ? 'United States' : 'Estados Unidos', flag: '/assets/img/flags/us.svg' },
            { code: 'ar', name: 'Argentina', flag: '/assets/img/flags/ar.svg' },
            { code: 'es', name: 'España', flag: '/assets/img/flags/es.svg' },
            { code: 'cl', name: 'Chile', flag: '/assets/img/flags/cl.svg' },
            { code: 'co', name: 'Colombia', flag: '/assets/img/flags/co.svg' },
            { code: 'mx', name: 'México', flag: '/assets/img/flags/mx.svg' }
        ];

        var languagesList = [
            { code: 'es', name: 'Español', flag: '/assets/img/flags/es.svg', target: 'py' },
            { code: 'en', name: 'English', flag: '/assets/img/flags/us.svg', target: 'us' },
            { code: 'pt', name: 'Português', flag: '/assets/img/flags/br.svg', target: 'br' }
        ];

        var langItemsHtml = languagesList.map(function (item) {
            var activeClass = item.code === currentLangCode ? ' active' : '';
            return '<a class="dropdown-item' + activeClass + '" href="' + getTargetUrl(item.target) + '">' +
                   '<img src="' + item.flag + '" alt="" />' + item.name + '</a>';
        }).join('');

        var countryItemsHtml = countriesList.map(function (item) {
            var activeClass = item.code === currentCountryCode ? ' active' : '';
            return '<a class="dropdown-item' + activeClass + '" href="' + getTargetUrl(item.code) + '">' +
                   '<img src="' + item.flag + '" alt="" />' + item.name + '</a>';
        }).join('');

        return '<div class="footer-lang-changer">' +
               '    <!-- Selector de Idioma -->' +
               '    <div class="dropdown dropup lang-changer-drop-up">' +
               '        <a class="menu-btn-changer" role="button" id="dropupmenulagchanger" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" href="#">' +
               '            <i class="fas ' + globeIcon + '"></i>' + currentLangName +
               '        </a>' +
               '        <div class="dropdown-menu dropupmenulagchanger" aria-labelledby="dropupmenulagchanger">' +
                            langItemsHtml +
               '        </div>' +
               '    </div>' +
               '    <!-- Selector de País -->' +
               '    <div class="dropdown dropup lang-changer-drop-up">' +
               '        <a class="menu-btn-changer" role="button" id="dropupmenucountrychanger" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" href="#">' +
               '            <img src="' + currentCountryFlag + '" alt="" />' + currentCountryName +
               '        </a>' +
               '        <div class="dropdown-menu dropupmenulagchanger country-changer-menu" aria-labelledby="dropupmenucountrychanger">' +
                            countryItemsHtml +
               '        </div>' +
               '    </div>' +
               '</div>';
    }

    function initFooterDropdowns() {
        var changer = document.querySelector('.footer-lang-changer');
        if (!changer) return;

        var toggles = changer.querySelectorAll('.menu-btn-changer[data-toggle="dropdown"]');
        toggles.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var parent = btn.closest('.lang-changer-drop-up');
                var menu = parent ? parent.querySelector('.dropdown-menu') : null;
                if (!menu) return;

                var isShown = menu.classList.contains('show');
                changer.querySelectorAll('.dropdown-menu').forEach(function (m) {
                    m.classList.remove('show');
                });
                changer.querySelectorAll('.lang-changer-drop-up').forEach(function (p) {
                    p.classList.remove('show');
                });

                if (!isShown) {
                    menu.classList.add('show');
                    parent.classList.add('show');
                }
            });
        });

        document.addEventListener('click', function (e) {
            if (!changer.contains(e.target)) {
                changer.querySelectorAll('.dropdown-menu').forEach(function (m) {
                    m.classList.remove('show');
                });
                changer.querySelectorAll('.lang-changer-drop-up').forEach(function (p) {
                    p.classList.remove('show');
                });
            }
        });
    }
`;

console.log('Script written.');
