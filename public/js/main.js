// =========================================
// 1. Efek "membesar" + tooltip persentase keahlian
// =========================================
var LEVEL_DELAY = 650; // hover harus bertahan 650ms sebelum bar muncul

document.querySelectorAll('.skill-card').forEach(function (card) {
    function pop() {
        card.classList.remove('pop');
        void card.offsetWidth; // memaksa animasi ulang
        card.classList.add('pop');
    }
    card.addEventListener('click', pop);
    card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            pop();
        }
    });
    card.addEventListener('animationend', function () {
        card.classList.remove('pop');
    });

    // Tooltip persentase dibuat otomatis dari atribut data-skill / data-level
    var level = Number(card.dataset.level);
    if (isNaN(level)) return;

    level = Math.min(100, Math.max(0, level));

    var tooltip = document.createElement('div');
    tooltip.className = 'skill-level';
    tooltip.innerHTML =
        '<div class="skill-level-head"><span></span><strong></strong></div>' +
        '<div class="skill-level-track"><div class="skill-level-fill"></div></div>';
    tooltip.querySelector('span').textContent = card.dataset.skill || card.querySelector('h6').textContent.trim();
    tooltip.querySelector('strong').textContent = level + '%';
    tooltip.style.setProperty('--level', level + '%');
    card.appendChild(tooltip);

    var timer, clickTimer;

    function showAfterDelay() {
        clearTimeout(timer);
        timer = setTimeout(function () {
            card.classList.add('is-showing-level');
        }, LEVEL_DELAY);
    }

    function hideNow() {
        clearTimeout(timer);
        card.classList.remove('is-showing-level');
    }

    card.addEventListener('mouseenter', showAfterDelay);
    card.addEventListener('mouseleave', hideNow);
    card.addEventListener('focus', showAfterDelay);
    card.addEventListener('blur', hideNow);

    // Tap di layar sentuh langsung menampilkan bar, lalu auto-hide
    card.addEventListener('click', function () {
        clearTimeout(timer);
        clearTimeout(clickTimer);
        card.classList.add('is-showing-level');
        clickTimer = setTimeout(hideNow, 2200);
    });
});

// =========================================
// 2. Animasi muncul saat elemen masuk ke layar (scroll)
// =========================================
var revealElements = document.querySelectorAll('.reveal');

// Jika browser tidak mendukung IntersectionObserver, tampilkan semua saja
if (!('IntersectionObserver' in window)) {
    revealElements.forEach(function (el) { el.classList.add('is-visible'); });
} else {
    // Delay otomatis untuk anak-anak di dalam wadah [data-stagger]
    document.querySelectorAll('[data-stagger]').forEach(function (wrapper) {
        wrapper.querySelectorAll(':scope > div > .reveal').forEach(function (el, index) {
            if (!el.dataset.delay) el.style.transitionDelay = (index * 90) + 'ms';
        });
    });

    // Delay manual dari atribut data-delay
    revealElements.forEach(function (el) {
        if (el.dataset.delay && !el.style.transitionDelay) {
            el.style.transitionDelay = el.dataset.delay + 'ms';
        }
    });

    var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            var el = entry.target;

            if (entry.isIntersecting) {
                // Pastikan transisi aktif dulu sebelum elemen muncul lagi
                el.classList.remove('is-resetting');
                void el.offsetWidth;
                el.classList.add('is-visible');
            } else {
                // Keluar layar: reset tanpa animasi, jadi saat masuk lagi animasinya ulang
                el.classList.add('is-resetting');
                el.classList.remove('is-visible');
                requestAnimationFrame(function () {
                    el.classList.remove('is-resetting');
                });
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(function (el) { revealObserver.observe(el); });
}

// =========================================
// 3. Progress bar mengikuti posisi scroll
// =========================================
var progressBar = document.getElementById('scrollProgress');

function updateProgress() {
    var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    var percent = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    progressBar.style.width = Math.min(100, Math.max(0, percent)) + '%';
}

window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

// =========================================
// 4. Navbar: menyusut saat scroll + menu aktif mengikuti section
// =========================================
var navbar = document.querySelector('.navbar');
var navTargets = [];

document.querySelectorAll('.navbar .nav-link').forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href || href.charAt(0) !== '#') return;

    var section = document.querySelector(href);
    if (section) navTargets.push({ link: link, section: section });
});

function updateNavbar() {
    if (navbar) {
        navbar.classList.toggle('is-scrolled', window.scrollY > 40);
    }

    if (!navTargets.length) return;

    var probe = window.scrollY + window.innerHeight * 0.35;
    var active = navTargets[0];

    navTargets.forEach(function (item) {
        var top = item.section.getBoundingClientRect().top + window.scrollY;
        if (top <= probe) active = item;
    });

    navTargets.forEach(function (item) {
        item.link.classList.toggle('active', item === active);
    });
}

window.addEventListener('scroll', updateNavbar, { passive: true });
window.addEventListener('resize', updateNavbar);
updateNavbar();
