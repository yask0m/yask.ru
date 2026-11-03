// Скрытое состояние для анимаций включаем только если пользователь
// не просил уменьшить движение. Иначе всё сразу видно.
const motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (motionOK) {
    document.documentElement.classList.add('js');
}

document.addEventListener('DOMContentLoaded', () => {
    const root = document.body;

    // --- ТЕМА ---
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');

    function applyTheme(theme) {
        if (theme === 'light') {
            root.setAttribute('data-theme', 'light');
            themeIcon.className = 'fa-solid fa-sun';
        } else {
            root.removeAttribute('data-theme');
            themeIcon.className = 'fa-solid fa-moon';
        }
    }

    try {
        applyTheme(localStorage.getItem('yask-theme') || '');
    } catch (e) {
        applyTheme('');
    }

    themeToggle.addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        applyTheme(next);
        try { localStorage.setItem('yask-theme', next); } catch (e) {}
    });

    // --- ПОЯВЛЕНИЕ НАВИГАЦИИ, КНОПКА НАВЕРХ, ПОЛОСКА ПРОГРЕССА ---
    const topNav = document.getElementById('topNav');
    const scrollTop = document.getElementById('scrollTop');
    const intro = document.getElementById('top');

    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    progress.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progress);

    function onScroll() {
        const past = window.scrollY > intro.offsetHeight - 120;
        topNav.classList.toggle('visible', past);
        scrollTop.classList.toggle('visible', window.scrollY > 300);

        const max = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = max > 0 ? window.scrollY / max : 0;
        progress.style.transform = `scaleX(${ratio})`;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    scrollTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- ПЛЕЙЛИСТ: задержка каждому имени для каскадного появления ---
    document.querySelectorAll('.names span').forEach((span, i) => {
        span.style.setProperty('--i', i);
    });

    // --- ПОЯВЛЕНИЕ СЕКЦИЙ: линия-переход и анимация содержимого ---
    const reveals = document.querySelectorAll('.block, .quote');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        reveals.forEach((el) => io.observe(el));
    } else {
        reveals.forEach((el) => el.classList.add('in'));
    }
});
