document.addEventListener('DOMContentLoaded', () => {
    // Плавная анимация появления блоков при скролле (IntersectionObserver)
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15
        });

        revealElements.forEach(el => observer.observe(el));
    } else {
        // Fallback, если IntersectionObserver недоступен
        revealElements.forEach(el => el.classList.add('visible'));
    }

    // Плавный скролл по якорным ссылкам меню (для старых браузеров)
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href');

            // Игнорируем пустой или "#"
            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            event.preventDefault();

            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Закрываем мобильное меню после клика
            const navbarToggler = document.querySelector('.navbar-toggler');
            const navbarCollapse = document.querySelector('#navbarSupportedContent');
            if (navbarToggler && navbarCollapse && navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    });

    // Copy WeChat ID button
    const copyWeChatBtn = document.querySelector('.copy-wechat');
    if (copyWeChatBtn) {
        copyWeChatBtn.addEventListener('click', async (event) => {
            event.preventDefault();
            const id = copyWeChatBtn.getAttribute('data-wechat-id') || '';
            if (!id) return;

            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(id);
                    alert(`WeChat ID copied: ${id}`);
                } else {
                    const ta = document.createElement('textarea');
                    ta.value = id;
                    ta.style.position = 'fixed';
                    ta.style.left = '-9999px';
                    document.body.appendChild(ta);
                    ta.focus();
                    ta.select();
                    document.execCommand('copy');
                    ta.remove();
                    alert(`WeChat ID copied: ${id}`);
                }
            } catch (_) {
                alert(`WeChat ID: ${id}`);
            }
        });
    }
});
