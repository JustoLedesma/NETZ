const fs = require('fs');

const targetFiles = [
    'assets/js/footer.js',
    'dist/assets/js/footer.js'
];

targetFiles.forEach(targetPath => {
    if (!fs.existsSync(targetPath)) return;
    let content = fs.readFileSync(targetPath, 'utf8');

    // 1. Replace the 3 static .footer-lang-changer blocks with {{FOOTER_LANG_CHANGER}}
    const regex = /<div class="footer-lang-changer">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/g;
    content = content.replace(regex, '{{FOOTER_LANG_CHANGER}}\n                    </div>\n                </div>\n            </div>\n        </section>');

    // 2. Add the dynamic helpers, styles, and event handlers
    const injectionPoint = 'function renderFooter() {';
    const newHelpers = `
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

        var currentCountryCode = (activeCountry || 'py').toLowerCase();
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

        var styles = '<style>' +
            '.footer-lang-changer { display: flex; align-items: center; gap: 15px; }' +
            '.lang-changer-drop-up { position: relative; float: left; }' +
            '.footer-lang-changer .menu-btn-changer { color: #969cc1; font-weight: 500; font-size: 13px; text-decoration: none; text-transform: capitalize; display: inline-flex; align-items: center; padding: 4px 8px; border-radius: 4px; transition: all 0.2s ease; cursor: pointer; }' +
            '.footer-lang-changer .menu-btn-changer:hover { color: #ffffff; background: rgba(255, 255, 255, 0.08); text-decoration: none; }' +
            '.footer-lang-changer .menu-btn-changer i { font-size: 14px; margin-right: 6px; }' +
            '.footer-lang-changer .menu-btn-changer img { width: 18px; height: 12px; object-fit: cover; border-radius: 2px; margin-right: 6px; }' +
            '.dropupmenulagchanger.dropdown-menu { position: absolute !important; bottom: 100% !important; top: auto !important; left: 0 !important; margin-bottom: 12px !important; z-index: 9999 !important; min-width: 175px; background: #ffffff !important; border-radius: 10px !important; border: 1px solid rgba(0, 0, 0, 0.08) !important; box-shadow: 0 12px 32px rgba(15, 23, 42, 0.22) !important; padding: 6px 0 !important; display: none; }' +
            '.dropupmenulagchanger.dropdown-menu.show { display: block !important; }' +
            '.dropupmenulagchanger.dropdown-menu.country-changer-menu { max-height: 270px; overflow-y: auto; min-width: 190px; }' +
            '.dropupmenulagchanger.dropdown-menu:after { content: \\'\\'; position: absolute; left: 20px; bottom: -6px; width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid #ffffff; }' +
            '.dropupmenulagchanger.dropdown-menu .dropdown-item { display: flex !important; align-items: center !important; padding: 8px 16px !important; color: #334155 !important; font-size: 13px !important; font-weight: 500 !important; text-decoration: none !important; transition: background 0.15s ease, color 0.15s ease !important; cursor: pointer !important; }' +
            '.dropupmenulagchanger.dropdown-menu .dropdown-item:hover { background: #f1f5f9 !important; color: #4f46e5 !important; }' +
            '.dropupmenulagchanger.dropdown-menu .dropdown-item.active { background: #eef2ff !important; color: #4f46e5 !important; font-weight: 600 !important; }' +
            '.dropupmenulagchanger.dropdown-menu .dropdown-item img { width: 18px !important; height: 12px !important; object-fit: cover !important; border-radius: 2px !important; margin-right: 10px !important; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12) !important; }' +
            '@media (max-width: 767px) { .footer-lang-changer { justify-content: center; margin-top: 15px; } }' +
            '</style>';

        return styles +
               '<div class="footer-lang-changer">' +
               '    <!-- Selector de Idioma -->' +
               '    <div class="dropdown dropup lang-changer-drop-up">' +
               '        <a class="menu-btn-changer" role="button" id="dropupmenulagchanger" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" href="#">' +
               '            <i class="fas fa-globe-americas"></i>' + currentLangName +
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

    function renderFooter() {`;

    content = content.replace(injectionPoint, newHelpers);

    // 3. Update renderFooter implementation to inject the changer and call initFooterDropdowns
    const oldRenderBody = `var finalFooterHTML = prefixFooterLinks(template);
        const footerContainer = document.getElementById('footer-container');
        if (footerContainer) {
            footerContainer.innerHTML = finalFooterHTML;
        } else {
            document.body.insertAdjacentHTML('beforeend', finalFooterHTML);
        }`;

    const newRenderBody = `var finalFooterHTML = prefixFooterLinks(template);
        finalFooterHTML = finalFooterHTML.replace('{{FOOTER_LANG_CHANGER}}', buildFooterLangChanger(country, isBr, isUs));
        const footerContainer = document.getElementById('footer-container');
        if (footerContainer) {
            footerContainer.innerHTML = finalFooterHTML;
        } else {
            document.body.insertAdjacentHTML('beforeend', finalFooterHTML);
        }
        initFooterDropdowns();`;

    content = content.replace(oldRenderBody, newRenderBody);

    fs.writeFileSync(targetPath, content, 'utf8');
    console.log('✅ Updated:', targetPath);
});

console.log('🎉 Done updating footer.js');

