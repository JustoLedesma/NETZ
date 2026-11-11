/*------------------------------------------------------------------
 * coodiv team
 -------------------------------------------------------------------*/
	// display on hover box //
	$(".display-on-hover-box-container a.display-on-hover-box-items").on("mouseenter",function() {
		$(".tab-content-hover").hide();
		$(".display-on-hover-box-container a.display-on-hover-box-items").removeClass('ctive-clod-sr');					
		$(this).addClass("ctive-clod-sr");					
		var selected_tab = $(this).attr("href");
		$(selected_tab).stop().fadeIn();
		return false;
	});
	$(".display-on-hover-box-items").on({
    mouseenter: function () {
    $(this).addClass("active");
    $('.display-on-hover-box-items').addClass("itsnot");
    },

    mouseleave: function () {
    $('.display-on-hover-box-items').removeClass("itsnot");
    $(this).removeClass("active");
    }
    });


	
	// header resize//
	(function () {
	var coodivheadertest = document.getElementById("coodiv-header");
    if(coodivheadertest){
	function resize()
    {
    var heights = window.innerHeight;
    document.getElementById("coodiv-header").style.height = heights + "px";
    }
    resize();
    window.addEventListener('resize', resize);
	}
	}());
	
	// page loader //	
	(function () {
        // Manejado de forma ultrarrápida por loader.js
    }());
	
	// tooltips //	
	$(function () {
	$('[data-toggle="tooltip"]').tooltip()
	});
	
	// header slider carousel //
	$(function () {
		var $carouselMain = $('.carousel-main');
		if ($carouselMain.length && typeof $carouselMain.flickity === 'function' && $carouselMain.children('.carousel-cell').length > 1) {
			$carouselMain.flickity({
				prevNextButtons: false,
				pageDots: false,
			});
			// Sincronizar recálculo de Owl Carousel cuando Flickity termine su layout o cambie
			$carouselMain.on('ready.flickity select.flickity settle.flickity', function () {
				var $owl = $('.owl-domain-prices-previw');
				if ($owl.length && $owl.hasClass('owl-loaded')) {
					$owl.trigger('refresh.owl.carousel');
				}
			});
		}

		// 2nd carousel, navigation
		var $carouselNav = $('.carousel-nav');
		if ($carouselNav.length && typeof $carouselNav.flickity === 'function' && $carouselNav.children().length > 1) {
			$carouselNav.flickity({
				asNavFor: '.carousel-main',
				contain: true,
				pageDots: false,
				prevNextButtons: false
			});
		}
	});

		function getTargetDomainItems(winW) {
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
	}

	// Exponer globalmente para que prices.js y eventos externos puedan invocarlo
	window.initDomainPricesCarousel = initDomainPricesCarousel;

	$(document).ready(function () {
		initDomainPricesCarousel();

		// Observar cambios de dimensiones en tiempo real (cold start de navegador, layout tardío de estilos, etc.)
		if (window.ResizeObserver) {
			var domainObserver = new ResizeObserver(function (entries) {
				for (var i = 0; i < entries.length; i++) {
					if (entries[i].contentRect.width > 0) {
						initDomainPricesCarousel();
					}
				}
			});
			$('.owl-domain-prices-previw').each(function () {
				domainObserver.observe(this);
			});
		}

		// Si el navegador restauró la pestaña en segundo plano y luego pasa a primer plano
		document.addEventListener('visibilitychange', function () {
			if (document.visibilityState === 'visible') {
				initDomainPricesCarousel();
			}
		});
	});

	// Asegurar recálculo cuando carguen completamente imágenes, estilos, fuentes o restore de pestaña (pageshow)
	$(window).on('load resize orientationchange pageshow focus', function () {
		initDomainPricesCarousel(true);
		initDomainPricesCarousel();
		setTimeout(initDomainPricesCarousel, 80);
		setTimeout(initDomainPricesCarousel, 300);
		setTimeout(initDomainPricesCarousel, 800);
	});

	// hosting plans with chekout price yearly and monthly //
	$('#monthly-yearly-chenge a').on('click', function() {
    $(this).addClass('active').siblings().removeClass('active');
	
	if (jQuery('.monthly-price').hasClass('active')) {
	$('.second-pricing-table-price').addClass('monthly');
	$('.second-pricing-table-price').removeClass('yearly');
	}
	
	if (jQuery('.yearli-price').hasClass('active')) {
	$('.second-pricing-table-price').addClass('yearly');
	$('.second-pricing-table-price').removeClass('monthly');
	}
    });
	
	// pertners carousel //
	$(document).ready(function() {
	$('.pertners-carousel').owlCarousel({
    loop: false,
    nav: false,
	dots: false,
	autoplay: false,
    responsive:{
        0:{
            items:2
        },
        600:{
            items:3
        },
        1000:{
            items:5
        }
    }
    });
	});
	
	 $(document).ready(function() {
    $('.owl-carousel').owlCarousel({
    loop: true,
    margin: 10,
    responsiveClass: true,
	items: 3,
	nav: false,
    })
    });
	
	// support carousel //
	$(document).ready(function() {
	$('.support-carousel').owlCarousel({
    loop: false,
    nav: false,
	dots: false,
	autoplay: false,
    responsive:{
        0:{
            items:2
        },
        600:{
            items:3
        },
        1000:{
            items:4
        }
    }
    });
	});
	
		
	// fixed header layout //	
	$(function(){
	$(window).scroll(function() {
    var scroll = $(window).scrollTop();
    if (scroll >= 50) {
    $(".fixed-header-layout").addClass("top-header-fixed");
    } else {
    $(".fixed-header-layout").removeClass("top-header-fixed");
    };
    });
	});


	//-- responsive menu swipe -- //
	if (document.documentElement.clientWidth < 768) {
	$(function() {      
	$("body").swipe( {
    swipe:function(event, direction) {
	if (direction =="right" && !$('#offcanvas-menu-home').hasClass("in")) {
   	$('#offcanvas-menu-home').addClass('in');
    $('.offcanvas-toggle.menu-btn-span-bar').addClass('is-open');
	$('body').addClass('offcanvas-stop-scrolling');
	}
	
	
	if (direction =="left") {
    $('#offcanvas-menu-home').removeClass('in');
	$('body').removeClass('offcanvas-stop-scrolling');
    $('.offcanvas-toggle.menu-btn-span-bar').removeClass('is-open');
    }
    },
    threshold: 100,
	excludedElements: "label,pre , button, input, select, textarea, table,.owl-carousel,.carousel-main,.flickity-enabled",
    });
  	});
	};
	
	//-- go to top button -- // 
	//   $(document).ready(function() {
	//   $('body').append('<div id="toTop" class="btn"><span class="fa fa-chevron-up"></span></div>');
    //   $(window).scroll(function() {
    //   if ($(this).scrollTop() != 0) {
    //   $('#toTop').fadeIn();
    //   } else {
    //   $('#toTop').fadeOut();
    //   }
    //   });
   //    $('#toTop').click(function() {
    //   $("html, body").animate({
    //   scrollTop: 0
    //   }, 600);
    //   return false;
    //   });
	//   });
	
	// video model //	
	$(document).ready(function() {
	var ifcontactformexist = document.getElementById("videomodal");
    if(ifcontactformexist){
	var $videoSrc;  
	$('.video-btn').on('click', function() {
    $videoSrc = $(this).data( "src" );
	});
	console.log($videoSrc);
	$('#videomodal').on('shown.bs.modal', function (e) {
    $("#video").attr('src',$videoSrc + "?rel=0&amp;showinfo=0&amp;modestbranding=1&amp;autoplay=1" ); 
	})
  	$('#videomodal').on('hide.bs.modal', function (e) {
    $("#video").attr('src',$videoSrc); 
	}) 
	}
	});
	
	// slider plans //	
	$(document).ready(function() {
	var slider = $("#calculatorSlider");
	var privateBtn = $("#privateBtn");
	var reseller = $("#resellerEarnings");
	var client = $("#clientPrice");
	var license = {
	priv: {
	active: false,
	price: 675,
	}
	}

	function calculate(price, value) {
	client.text( (Math.round(value / 100 * price)));
	reseller.text((Math.round(value * 10)))
	}

	privateBtn.on('click', function(e) {
	license.priv.active = true;
	reset(license.priv.price);
	});

	
	slider.on("input change", function(e) {
	calculate(license.priv.price, $(this).val());
	})
	});
	
	//-- Filter List -- //
	function FilterListSection() {
    var input, filter, ul, li, a, i;
    input = document.getElementById('nuhost-filter-input');
    filter = input.value.toUpperCase();
    ul = document.getElementById("nuhost-filter-list");
    li = ul.getElementsByTagName('li');
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
    };   
	jQuery('#nuhost-filter-list li a').on('click', function() {
	$(this).addClass("filter-item-open");
	$('.nuhost-filter-list-container').addClass("nuhost-filter-min-height");
	$('#' + this.id + '-content').delay(200).fadeIn(300);
	});
	
	jQuery('.filter-content-close').on('click', function() {
	$(this).addClass("filter-item-open");
	$('.nuhost-filter-list-container').removeClass("nuhost-filter-min-height");
	$('.filter-content-box').delay(200).fadeOut(300);
	});
	
	//-- animated scroll -- //
	$(document).on('click', 'a[href^="#"]', function (event) {
		event.preventDefault();
		var nav_height = 110;		
		if ($($.attr(this, 'href')).offset())
		{
			$('html, body').animate({			
				scrollTop: $($.attr(this, 'href')).offset().top - nav_height
			}, 500);
		}
  	});
	
	
	//-- about us services carousel -- //
	$(document).ready(function() {
	$('.our-services-carousel').flickity({
	cellAlign: 'left',
    contain: true,
	pageDots: false
    });
	});
	
	//-- about us customers carousel -- //
	$(document).ready(function() {
	 $('.carousel-main-customers-text').flickity({
    pageDots: false,
	prevNextButtons: false,
	fade: true
    });
    $('.carousel-nav-customers-text').flickity({
    asNavFor: '.carousel-main-customers-text',
    contain: true,
    pageDots: false,
	prevNextButtons: false,
	draggable: false,
    });
	});
	
	//-- contact form height for mobile devices -- //
	$(document).ready(function() {
	var ifcontactformexist = document.getElementById("ajax-contact");
    if(ifcontactformexist){
	var offsetHeight = document.getElementById('ajax-contact').offsetHeight;
	document.getElementById('mobile-form-contact-height').style.height = offsetHeight+'px';
	}
	});
	
	//-- import loop files -- //
    $(function(){
      var includes = $('[data-include]');
      jQuery.each(includes, function(){
      var file = 'loop-templates/' + $(this).data('include') + '.html';
      $(this).load(file);
      });
    });
	