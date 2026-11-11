const fs = require('fs');

const newCode = `	function getTargetDomainItems(winW) {
		if (winW >= 992) return 4;
		if (winW >= 768) return 3;
		if (winW >= 480) return 2;
		return 1;
	}

	// header slider domains carousel //
	function initDomainPricesCarousel(forceReinit) {
		var $owl = $('.owl-domain-prices-previw');
		if (!$owl.length) return;

		// Si owlCarousel aún no está cargado en memoria, reintentar cada 30ms
		if (typeof $owl.owlCarousel !== 'function') {
			setTimeout(function () { initDomainPricesCarousel(forceReinit); }, 30);
			return;
		}

		var winW = window.innerWidth || $(window).width() || (document.documentElement ? document.documentElement.clientWidth : 0) || (window.screen ? window.screen.width : 0);
		var currentWidth = $owl.width();

		// Si la ventana o el contenedor aún no tienen ancho medible (cold-start / restore / pestaña oculta)
		if (winW <= 0 || currentWidth <= 0) {
			setTimeout(function () { initDomainPricesCarousel(forceReinit); }, 40);
			return;
		}

		// En desktop (>= 992px), el contenedor col-md-7 debe tener al menos 400px antes de inicializar
		if (winW >= 992 && currentWidth < 400) {
			setTimeout(function () { initDomainPricesCarousel(forceReinit); }, 40);
			return;
		}

		var owl = $owl.data('owl.carousel');
		var targetItems = getTargetDomainItems(winW);

		// Si ya está inicializado
		if (owl) {
			var currentItems = (owl.settings && owl.settings.items) ? owl.settings.items : 0;
			var clonesCount = $owl.find('.owl-item.cloned').length;

			// Si la cantidad de items activos no coincide con el breakpoint o faltan clones por cold-start
			if (forceReinit || currentItems !== targetItems || clonesCount < (targetItems * 2)) {
				// Destrucción limpia y completa para regenerar clones exactos
				$owl.trigger('destroy.owl.carousel');
				$owl.removeClass('owl-loaded owl-hidden owl-drag');
				$owl.find('.owl-stage-outer').children().unwrap();
				owl = null;
			} else {
				// Mismo breakpoint: ajuste de coordenadas suave
				owl.invalidate('width');
				owl.invalidate('settings');
				owl.setup();
				owl.refresh();
				return;
			}
		}

		$owl.owlCarousel({
			loop: true,
			margin: 20,
			autoplay: true,
			autoplayTimeout: 3000,
			autoplayHoverPause: true,
			responsiveClass: true,
			responsiveBaseElement: window,
			dots: false,
			nav: true,
			navText: ['', ''],
			responsive: {
				0: {
					items: 1,
					margin: 10
				},
				480: {
					items: 2,
					margin: 15
				},
				768: {
					items: 3,
					margin: 20
				},
				992: {
					items: 4,
					margin: 20
				}
			}
		});
	}`;

const targetFiles = [
    'assets/js/template-scripts.js',
    'dist/assets/js/template-scripts.js',
    'js/template-scripts.js'
];

targetFiles.forEach(p => {
    if (fs.existsSync(p)) {
        let content = fs.readFileSync(p, 'utf8');
        const startIdx = content.indexOf('// header slider domains carousel //');
        const endIdx = content.indexOf('\t// Exponer globalmente para que prices.js', startIdx);
        if (startIdx !== -1 && endIdx !== -1) {
            content = content.substring(0, startIdx) + newCode + '\n\n' + content.substring(endIdx);
            
            // Also ensure pageshow and load use forceReinit
            content = content.replace(
                "$(window).on('load resize orientationchange pageshow', function () {",
                "$(window).on('load resize orientationchange pageshow focus', function () {\n\t\tinitDomainPricesCarousel(true);"
            );

            fs.writeFileSync(p, content, 'utf8');
            console.log('✅ Updated:', p);
        } else {
            console.warn('Could not find slice in:', p);
        }
    }
});

// Also update prices.js to call initDomainPricesCarousel(true)
const priceFiles = [
    'assets/js/prices.js',
    'dist/assets/js/prices.js'
];

priceFiles.forEach(p => {
    if (fs.existsSync(p)) {
        let content = fs.readFileSync(p, 'utf8');
        content = content.replace(
            'window.initDomainPricesCarousel();',
            'window.initDomainPricesCarousel(true);'
        );
        fs.writeFileSync(p, content, 'utf8');
        console.log('✅ Updated prices.js:', p);
    }
});
