/**
 * NETZ - Sistema de Precios Dinámicos por País
 * Carga el JSON de precios correspondiente al atributo data-country de <html>
 * y actualiza los marcadores data-pid, data-cycle, data-domain, data-price y data-whmcs-link.
 */
(function () {
    const htmlEl = document.documentElement;
    const country = (htmlEl.getAttribute('data-country') || 'py').toLowerCase();
    const version = '1';
    const jsonUrl = `/assets/data/prices/${country}.json?v=${version}`;

    // Quitar clase anti-parpadeo tras máximo 300ms
    const safetyTimeout = setTimeout(function () {
        htmlEl.classList.remove('prices-loading');
    }, 300);

    function formatNumber(val, locale, currency) {
        if (val === null || val === undefined || isNaN(val)) return null;
        if (currency === 'PYG') {
            const formatted = Math.round(val).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            return `Gs. ${formatted}`;
        }
        try {
            const noDecimals = (currency === 'CLP' || currency === 'COP');
            return new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: noDecimals ? 0 : 2,
                maximumFractionDigits: noDecimals ? 0 : 2
            }).format(val);
        } catch (e) {
            return `${val} ${currency}`;
        }
    }

    function updateElementPrice(el, formattedText) {
        if (!formattedText) return;
        const small = el.querySelector('small');
        const b = el.querySelector('b');
        if (small) {
            el.innerHTML = `${formattedText}<small>${small.innerHTML}</small>`;
        } else if (b) {
            el.innerHTML = `${formattedText}<b>${b.innerHTML}</b>`;
        } else {
            el.textContent = formattedText;
        }
    }

    function applyPrices(data) {
        if (!data) return;
        const locale = data.locale || 'es-PY';
        const currency = data.currency || 'USD';
        const whmcsCurrencyId = data.whmcsCurrencyId;

        // 1. Planes y Productos (data-pid + data-cycle)
        const products = data.products || {};
        document.querySelectorAll('[data-pid][data-cycle]').forEach(function (el) {
            const pid = el.getAttribute('data-pid');
            const cycle = el.getAttribute('data-cycle');
            const prod = products[pid];
            if (prod && prod[cycle] !== undefined && prod[cycle] !== null) {
                const formatted = formatNumber(prod[cycle], locale, currency);
                if (formatted) updateElementPrice(el, formatted);
            }
        });

        // 2. Enlaces de contratación (data-whmcs-link)
        const urlParams = new URLSearchParams(window.location.search);
        const urlDomain = urlParams.get('domain');
        let domainQuery = '';
        if (urlDomain) {
            const cleanDom = urlDomain.trim().toLowerCase();
            const pyMatch = cleanDom.match(/^(.+?)\.(com\.py|net\.py|org\.py|edu\.py|mil\.py|gov\.py|py)$/i);
            if (pyMatch) {
                domainQuery = `&domainoption=owndomain&sld=${encodeURIComponent(pyMatch[1])}&tld=${encodeURIComponent('.' + pyMatch[2])}`;
            } else {
                const parts = cleanDom.split('.');
                if (parts.length > 1) {
                    const sld = parts.slice(0, -1).join('.');
                    const tld = '.' + parts[parts.length - 1];
                    domainQuery = `&domainoption=register&sld=${encodeURIComponent(sld)}&tld=${encodeURIComponent(tld)}`;
                }
            }

            // Mostrar banner informativo si la página tiene tabla de planes de hosting
            if (!document.getElementById('domain-selected-alert')) {
                const pricingContainer = document.querySelector('.second-pricing-table-container');
                if (pricingContainer && pricingContainer.parentNode) {
                    const alertDiv = document.createElement('div');
                    alertDiv.id = 'domain-selected-alert';
                    alertDiv.style.cssText = 'position: relative; z-index: 20; background: linear-gradient(to bottom right, #5c6bd3, #a358e0); border-radius: 16px; padding: 18px 26px; margin: 0 auto 30px auto; max-width: 880px; box-shadow: 0 10px 30px rgba(92, 107, 211, 0.28); width: 100%; color: #ffffff; font-family: "Quicksand", sans-serif;';

                    const soloDominioLink = `https://client.netz.com.py/cart.php?a=add&domain=register&query=${encodeURIComponent(cleanDom)}&domains[]=${encodeURIComponent(cleanDom)}${whmcsCurrencyId ? '&currency=' + encodeURIComponent(whmcsCurrencyId) : ''}`;

                    let titleText = `Dominio seleccionado: <strong style="color: #ffffff; font-size: 17px; font-weight: 800;">${cleanDom}</strong>`;
                    let subText = `Seleccione su plan de hosting para continuar, o si lo prefiere contrate solo el dominio:`;
                    let btnText = `Contratar solo dominio &rarr;`;

                    if (country === 'br') {
                        titleText = `Domínio selecionado: <strong style="color: #ffffff; font-size: 17px; font-weight: 800;">${cleanDom}</strong>`;
                        subText = `Escolha seu plano de hospedagem para continuar, ou se preferir contrate apenas o domínio:`;
                        btnText = `Contratar apenas o domínio &rarr;`;
                    } else if (country === 'us') {
                        titleText = `Selected domain: <strong style="color: #ffffff; font-size: 17px; font-weight: 800;">${cleanDom}</strong>`;
                        subText = `Choose your hosting plan to continue, or purchase only the domain if preferred:`;
                        btnText = `Buy domain only &rarr;`;
                    }

                    alertDiv.innerHTML = `
                        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px; text-align: left;">
                            <div style="font-size: 15px; font-weight: 600; line-height: 1.4;">
                                <i class="fas fa-check-circle" style="color: #ffffff; margin-right: 8px; font-size: 18px;"></i>${titleText}
                                <span style="display: block; font-size: 13px; color: #e1e6e8; font-weight: 500; margin-top: 3px;">${subText}</span>
                            </div>
                            <div>
                                <a href="${soloDominioLink}" class="btn" style="background: transparent; border: 2px solid #ffffff; color: #ffffff; font-weight: 700; border-radius: 25px; padding: 9px 20px; font-size: 13px; text-transform: uppercase; white-space: nowrap; text-decoration: none; display: inline-block; transition: all 0.2s ease-in-out;" onmouseover="this.style.background='#ffffff'; this.style.color='#5c6bd3';" onmouseout="this.style.background='transparent'; this.style.color='#ffffff';">
                                    ${btnText}
                                </a>
                            </div>
                        </div>
                    `;
                    pricingContainer.parentNode.insertBefore(alertDiv, pricingContainer);

                    setTimeout(function () {
                        alertDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 300);
                }
            }
        }

        function updateWhmcsLinks() {
            const isYearly = document.querySelector('#monthly-yearly-chenge .yearli-price.active') !== null;
            const cycleParam = isYearly ? '&billingcycle=annually' : '&billingcycle=monthly';

            document.querySelectorAll('[data-whmcs-link][data-pid]').forEach(function (el) {
                const pid = el.getAttribute('data-pid');
                let link = `https://client.netz.com.py/cart.php?a=add&pid=${encodeURIComponent(pid)}${cycleParam}`;
                if (whmcsCurrencyId) {
                    link += `&currency=${encodeURIComponent(whmcsCurrencyId)}`;
                }
                if (domainQuery) {
                    link += domainQuery;
                }
                el.setAttribute('href', link);
            });
        }

        const switcher = document.getElementById('monthly-yearly-chenge');
        if (switcher) {
            switcher.querySelectorAll('a').forEach(function (a) {
                a.addEventListener('click', function () {
                    setTimeout(updateWhmcsLinks, 60);
                });
            });
        }
        updateWhmcsLinks();

        // 3. Dominios (data-domain)
        const domains = data.domains || {};
        document.querySelectorAll('[data-domain]').forEach(function (el) {
            const ext = el.getAttribute('data-domain').replace(/^\./, '');
            const action = el.getAttribute('data-domain-action') || 'register';
            const dom = domains[ext];
            if (dom && dom[action] !== undefined && dom[action] !== null) {
                const formatted = formatNumber(dom[action], locale, currency);
                if (formatted) updateElementPrice(el, formatted);
            }
        });

        // 4. Precios fijos / calculados (data-price)
        const startPriceEl = document.querySelector('[data-price="domain-starting-price"]');
        if (startPriceEl && data.domains) {
            let minPrice = Infinity;
            for (const key in data.domains) {
                const d = data.domains[key];
                if (d && typeof d.register === 'number' && d.register > 0) {
                    if (d.register < minPrice) minPrice = d.register;
                }
            }
            if (minPrice !== Infinity) {
                const formattedMin = formatNumber(minPrice, locale, currency);
                if (formattedMin) {
                    if (country === 'br') {
                        startPriceEl.textContent = `Preço inicial a partir de ${formattedMin}/Ano`;
                    } else if (country === 'us') {
                        startPriceEl.textContent = `Starting price from ${formattedMin}/Year`;
                    } else {
                        startPriceEl.textContent = `Precio Inicial desde ${formattedMin}/Año`;
                    }
                }
            }
        }
    }

    const extJsonUrl = `/assets/data/prices/domains_extended_${country}.json?v=${version}`;

    // Petición al JSON del país y al archivo extendido de dominios en paralelo
    Promise.all([
        fetch(jsonUrl).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }),
        fetch(extJsonUrl).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; })
    ]).then(function (results) {
        clearTimeout(safetyTimeout);
        const data = results[0] || {};
        const extData = results[1] || {};
        if (extData && extData.domains) {
            data.domains = Object.assign({}, extData.domains, data.domains || {});
        }
        applyPrices(data);
        htmlEl.classList.remove('prices-loading');
        if (typeof window.initDomainPricesCarousel === 'function') {
            window.initDomainPricesCarousel(true);
        } else if (window.jQuery && jQuery('.owl-domain-prices-previw').length) {
            var $owl = jQuery('.owl-domain-prices-previw');
            var owlData = $owl.data('owl.carousel');
            if (owlData) {
                owlData.invalidate('width');
                owlData.invalidate('settings');
                owlData.setup();
                owlData.refresh();
            } else {
                $owl.trigger('refresh.owl.carousel');
            }
        }
    }).catch(function () {
        // Si falla la carga, no se tocan los precios (queda el base)
        clearTimeout(safetyTimeout);
        htmlEl.classList.remove('prices-loading');
    });
})();

