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
        document.querySelectorAll('[data-whmcs-link][data-pid]').forEach(function (el) {
            const pid = el.getAttribute('data-pid');
            let link = `https://client.netz.com.py/cart.php?a=add&pid=${encodeURIComponent(pid)}`;
            if (whmcsCurrencyId) {
                link += `&currency=${encodeURIComponent(whmcsCurrencyId)}`;
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
                    startPriceEl.textContent = `Precio Inicial desde ${formattedMin}/Año`;
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
        })
        .catch(function () {
            // Si falla la carga, no se tocan los precios (queda el base en USD)
            clearTimeout(safetyTimeout);
            htmlEl.classList.remove('prices-loading');
        });
})();

