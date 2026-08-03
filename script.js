/* ==========================================================================
   TERRAFRUT — Script principal
   Header al hacer scroll, menú móvil, aparición al scroll y mapas diferidos.
   ========================================================================== */

(function () {
    'use strict';

    var reduceMotion = window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;

    /* ---------------------------------------------------------------
       Año dinámico en el copyright
       --------------------------------------------------------------- */
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------------------------------------------------------------
       Header: gana fondo al separarse del hero
       --------------------------------------------------------------- */
    var header = document.getElementById('header');

    if (header) {
        var onScroll = function () {
            header.classList.toggle('is-scrolled', window.scrollY > 10);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ---------------------------------------------------------------
       Menú móvil
       --------------------------------------------------------------- */
    var burger = document.getElementById('navBurger');
    var menu = document.getElementById('navMenu');

    if (burger && menu && header) {
        var closeMenu = function () {
            menu.classList.remove('is-open');
            header.classList.remove('is-open');
            burger.setAttribute('aria-expanded', 'false');
            burger.setAttribute('aria-label', 'Abrir menú');
        };

        burger.addEventListener('click', function () {
            var open = menu.classList.toggle('is-open');
            header.classList.toggle('is-open', open);
            burger.setAttribute('aria-expanded', String(open));
            burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
        });

        /* Cerrar al elegir un destino */
        menu.addEventListener('click', function (e) {
            if (e.target.closest('a')) closeMenu();
        });

        /* Cerrar con Escape, devolviendo el foco al botón */
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && menu.classList.contains('is-open')) {
                closeMenu();
                burger.focus();
            }
        });
    }

    /* ---------------------------------------------------------------
       Aparición al hacer scroll, con leve escalonado entre hermanos
       --------------------------------------------------------------- */
    var revealEls = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window && !reduceMotion) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(function (el) {
            var siblings = el.parentElement
                ? el.parentElement.querySelectorAll(':scope > .reveal')
                : [];
            var idx = Array.prototype.indexOf.call(siblings, el);
            el.style.setProperty('--reveal-delay', (Math.max(idx, 0) * 0.1) + 's');
            revealObserver.observe(el);
        });
    } else {
        revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }

    /* ---------------------------------------------------------------
       Mapas: se insertan solo al acercarse a la pantalla.
       Evita cargar dos iframes de Google Maps en redes móviles.
       --------------------------------------------------------------- */
    var mapFrames = document.querySelectorAll('.map__frame[data-map-src]');

    var buildMap = function (holder) {
        if (holder.dataset.mapLoaded) return;
        holder.dataset.mapLoaded = 'true';

        var iframe = document.createElement('iframe');
        iframe.src = holder.dataset.mapSrc;
        iframe.title = holder.dataset.mapTitle || 'Mapa de la tienda';
        iframe.loading = 'lazy';
        iframe.allowFullscreen = true;
        iframe.referrerPolicy = 'no-referrer-when-downgrade';
        holder.appendChild(iframe);
    };

    if ('IntersectionObserver' in window) {
        var mapObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    buildMap(entry.target);
                    mapObserver.unobserve(entry.target);
                }
            });
        }, { rootMargin: '350px 0px' });

        mapFrames.forEach(function (holder) { mapObserver.observe(holder); });
    } else {
        mapFrames.forEach(buildMap);
    }
})();
