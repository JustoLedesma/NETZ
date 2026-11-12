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
        try {
            const noDecimals = (currency === 'CLP' || currency === 'COP' || currency === 'PYG');
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
                    domainQuery = `&domainoption=owndomain&sld=${encodeURIComponent(sld)}&tld=${encodeURIComponent(tld)}`;
                }
            }

            // Mostrar banner informativo si la página tiene tabla de planes de hosting
            if (!document.getElementById('domain-selected-alert')) {
                const pricingContainer = document.querySelector('.second-pricing-table-container');
                if (pricingContainer && pricingContainer.parentNode) {
                    const alertDiv = document.createElement('div');
                    alertDiv.id = 'domain-selected-alert';
                    alertDiv.style.cssText = 'background: #e8f5e9; border: 2px solid #28a745; color: #1e7e34; border-radius: 12px; padding: 14px 20px; margin: 0 auto 30px auto; max-width: 800px; text-align: center; font-size: 15px; font-weight: 600; box-shadow: 0 4px 15px rgba(40,167,69,0.1); width: 100%;';

                    let alertText = `Dominio seleccionado: <strong style="color: #155724; font-size: 16px;">${cleanDom}</strong> — Seleccione su plan de hosting para continuar.`;
                    if (country === 'br') {
                        alertText = `Domínio selecionado: <strong style="color: #155724; font-size: 16px;">${cleanDom}</strong> — Escolha o seu plano de hospedagem para continuar.`;
                    } else if (country === 'us') {
                        alertText = `Selected domain: <strong style="color: #155724; font-size: 16px;">${cleanDom}</strong> — Choose your hosting plan to continue.`;
                    }

                    alertDiv.innerHTML = `<i class="fas fa-check-circle" style="color: #28a745; margin-right: 8px; font-size: 18px;"></i>${alertText}`;
                    pricingContainer.parentNode.insertBefore(alertDiv, pricingContainer);

                    setTimeout(function () {
                        alertDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 300);
                }
            }
        }

        document.querySelectorAll('[data-whmcs-link][data-pid]').forEach(function (el) {
            const pid = el.getAttribute('data-pid');
            let link = `https://client.netz.com.py/cart.php?a=add&pid=${encodeURIComponent(pid)}`;
            if (whmcsCurrencyId) {
                link += `&currency=${encodeURIComponent(whmcsCurrencyId)}`;
            }
            if (domainQuery) {
                link += domainQuery;
            }
            el.setAttribute('href', link);
        });

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

    // Petición al JSON del país
    fetch(jsonUrl)
        .then(function (res) {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .then(function (data) {
            clearTimeout(safetyTimeout);
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
        })
        .catch(function () {
            // Si falla la carga, no se tocan los precios (queda el base en USD)
            clearTimeout(safetyTimeout);
            htmlEl.classList.remove('prices-loading');
        });
})();

