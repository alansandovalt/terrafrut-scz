/* ==========================================================================
   TERRAFRUT — Script principal
   Header con sombra al hacer scroll, menú móvil y animaciones de aparición.
   ========================================================================== */

(function () {
    'use strict';

    /* Año dinámico en el copyright */
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* Sombra del header al hacer scroll */
    var header = document.getElementById('header');
    var onScroll = function () {
        header.classList.toggle('is-scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* Menú móvil */
    var burger = document.getElementById('navBurger');
    var menu = document.getElementById('navMenu');

    if (burger && menu) {
        burger.addEventListener('click', function () {
            var open = menu.classList.toggle('is-open');
            header.classList.toggle('is-open', open);
            burger.setAttribute('aria-expanded', String(open));
            burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
        });

        menu.addEventListener('click', function (e) {
            if (e.target.matches('a')) {
                menu.classList.remove('is-open');
                header.classList.remove('is-open');
                burger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /* Animaciones de aparición con un leve escalonado por sección */
    var revealEls = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(function (el, i) {
            /* Escalonado dentro del mismo grupo de hermanos */
            var siblings = el.parentElement
                ? el.parentElement.querySelectorAll(':scope > .reveal')
                : [];
            var idx = Array.prototype.indexOf.call(siblings, el);
            el.style.setProperty('--reveal-delay', (Math.max(idx, 0) * 0.12) + 's');
            observer.observe(el);
        });
    } else {
        revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }
})();
