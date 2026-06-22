(() => {
    const body = document.body;
    const navToggle = document.querySelector('[data-nav-toggle]');
    const nav = document.querySelector('[data-nav]');

    if (navToggle && nav) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            const label = navToggle.querySelector('.sr-only');
            navToggle.setAttribute('aria-expanded', String(!isOpen));
            body.classList.toggle('nav-open', !isOpen);
            if (label) {
                label.textContent = isOpen ? 'Открыть меню' : 'Закрыть меню';
            }
        });

        nav.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                const label = navToggle.querySelector('.sr-only');
                navToggle.setAttribute('aria-expanded', 'false');
                body.classList.remove('nav-open');
                if (label) {
                    label.textContent = 'Открыть меню';
                }
            });
        });
    }

    document.querySelectorAll('.faq-item button').forEach((button) => {
        button.addEventListener('click', () => {
            const expanded = button.getAttribute('aria-expanded') === 'true';
            const answer = document.getElementById(button.getAttribute('aria-controls'));

            button.setAttribute('aria-expanded', String(!expanded));
            if (answer) {
                answer.hidden = expanded;
            }
        });
    });

    document.querySelectorAll('.js-call-track').forEach((link) => {
        link.addEventListener('click', () => {
            if (window.location.hostname.endsWith('github.io')) {
                return;
            }

            const place = link.dataset.callPlace || 'unknown';
            const payload = JSON.stringify({
                place,
                href: link.getAttribute('href'),
                path: window.location.pathname,
                timestamp: new Date().toISOString()
            });

            if (navigator.sendBeacon) {
                navigator.sendBeacon('track-call.php', new Blob([payload], { type: 'application/json' }));
                return;
            }

            fetch('track-call.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: payload,
                keepalive: true
            }).catch(() => {});
        });
    });

    const mobileCta = document.querySelector('.mobile-cta');
    if (mobileCta) {
        const toggleMobileCta = () => {
            mobileCta.classList.toggle('is-visible', window.scrollY > 360);
        };

        toggleMobileCta();
        window.addEventListener('scroll', toggleMobileCta, { passive: true });
        window.addEventListener('resize', toggleMobileCta);
        window.setInterval(toggleMobileCta, 500);
    }
})();
