document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('site-header');
    const navToggle = document.getElementById('nav-toggle');
    const headerNav = document.getElementById('header-nav');
    const i18nEl = document.getElementById('profit-i18n');
    const bundle = i18nEl ? JSON.parse(i18nEl.textContent) : null;

    let profitMarker = null;

    const getBasePath = () => {
        const meta = document.querySelector('meta[name="profit-base-path"]');
        return (meta?.getAttribute('content') || '').replace(/\/$/, '');
    };

    const normalizePath = (path) => {
        const trimmed = path.replace(/\/+$/, '');
        return trimmed || '/';
    };

    const getPathWithoutBase = () => {
        let path = window.location.pathname;
        const base = getBasePath();
        if (base && path.startsWith(base)) {
            path = path.slice(base.length) || '/';
        }
        return path;
    };

    const buildLangPath = (lang) => {
        const base = getBasePath();
        return lang === 'ru' ? `${base}/` : `${base}/${lang}/`;
    };

    const getLangFromPath = () => {
        const segment = getPathWithoutBase().replace(/\/$/, '').split('/').filter(Boolean)[0];
        if (!segment) return null;
        return bundle?.translations[segment] ? segment : null;
    };

    const getMapPopupHtml = (tr) => (
        `<div class="custom-popup"><h4>PROFIT</h4><p><strong>${tr.label_address}:</strong> ${tr.value_address}</p><p>${tr.map_popup_office}</p></div>`
    );

    const updateMapPopup = (lang) => {
        if (!profitMarker || !bundle) return;
        const tr = bundle.translations[lang];
        if (!tr) return;
        profitMarker.bindPopup(getMapPopupHtml(tr));
    };

    const applyLang = (lang) => {
        if (!bundle || !bundle.translations[lang]) return;

        const tr = bundle.translations[lang];
        bundle.current = lang;

        document.documentElement.lang = bundle.htmlLang[lang] || lang;
        document.title = tr.meta_title;

        const setMeta = (selector, value) => {
            const el = document.querySelector(selector);
            if (el) el.setAttribute('content', value);
        };
        setMeta('meta[name="description"]', tr.meta_description);
        setMeta('meta[name="keywords"]', tr.meta_keywords);
        setMeta('meta[property="og:title"]', tr.og_title);
        setMeta('meta[property="og:description"]', tr.og_description);
        setMeta('meta[property="og:locale"]', bundle.ogLocale[lang] || 'ru_RU');

        document.querySelectorAll('[data-i18n]').forEach((el) => {
            const key = el.dataset.i18n;
            const text = tr[key];
            if (text === undefined) return;
            if (el.dataset.i18nHtml === 'true') {
                el.innerHTML = text;
            } else {
                el.textContent = text;
            }
        });

        document.querySelectorAll('.lang-pill').forEach((btn) => {
            const isActive = btn.dataset.lang === lang;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-current', isActive ? 'true' : 'false');
        });

        const langPills = document.getElementById('lang-pills');
        if (langPills) langPills.setAttribute('aria-label', tr.lang_label);

        updateMapPopup(lang);

        try {
            localStorage.setItem('profit_lang', lang);
        } catch (_) {
            /* ignore */
        }

        const newPath = buildLangPath(lang);
        if (normalizePath(window.location.pathname) !== normalizePath(newPath)) {
            history.replaceState({ lang }, '', newPath);
        }
    };

    if (bundle) {
        document.querySelectorAll('.lang-pill').forEach((btn) => {
            btn.addEventListener('click', () => {
                const lang = btn.dataset.lang;
                if (lang && lang !== bundle.current) {
                    applyLang(lang);
                }
            });
        });

        window.addEventListener('popstate', () => {
            const pathLang = getLangFromPath();
            const lang = pathLang ?? bundle.current;
            if (lang !== bundle.current) {
                applyLang(lang);
            }
        });

        const pathLang = getLangFromPath();
        let storedLang = null;
        try {
            storedLang = localStorage.getItem('profit_lang');
        } catch (_) {
            /* ignore */
        }
        const initialLang = pathLang ?? (storedLang && bundle.translations[storedLang] ? storedLang : bundle.current);
        if (initialLang !== bundle.current) {
            applyLang(initialLang);
        }
    }

    const initMap = () => {
        if (typeof DG === 'undefined') return;
        DG.then(() => {
            const map = DG.map('map-2gis', {
                center: [51.184923, 71.471277],
                zoom: 17,
            });
            profitMarker = DG.marker([51.184923, 71.471277]).addTo(map);
            if (bundle) {
                updateMapPopup(bundle.current);
            }
        });
    };
    initMap();

    const onScroll = () => {
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 20);
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (navToggle && headerNav) {
        navToggle.addEventListener('click', () => {
            const open = headerNav.classList.toggle('open');
            navToggle.classList.toggle('open', open);
            navToggle.setAttribute('aria-expanded', open);
        });
    }

    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealElements.forEach((el) => observer.observe(el));
    } else {
        revealElements.forEach((el) => el.classList.add('visible'));
    }

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();

            const offset = header ? header.offsetHeight + 16 : 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;

            window.scrollTo({ top, behavior: 'smooth' });

            if (headerNav && headerNav.classList.contains('open')) {
                headerNav.classList.remove('open');
                navToggle?.classList.remove('open');
                navToggle?.setAttribute('aria-expanded', 'false');
            }
        });
    });
});
