// =========================================
// 1. Reveal: muncul lagi tiap kali masuk layar, dua arah
// =========================================
var revealElements = document.querySelectorAll('.reveal');
var lastScrollY = window.scrollY;

// Jika browser tidak mendukung IntersectionObserver, tampilkan semua saja
if (!('IntersectionObserver' in window)) {
    revealElements.forEach(function (el) { el.classList.add('is-visible'); });
} else {
    // Jedakan kecil antar baris supaya tidak semua bergerak bersamaan
    document.querySelectorAll('[data-stagger]').forEach(function (wrapper) {
        wrapper.querySelectorAll(':scope > .reveal').forEach(function (el, index) {
            el.style.transitionDelay = Math.min(index * 60, 240) + 'ms';
        });
    });

    var revealObserver = new IntersectionObserver(function (entries) {
        var goingUp = window.scrollY < lastScrollY;

        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                // Dari bawah saat scroll turun, dari atas saat scroll naik
                entry.target.classList.toggle('is-from-top', goingUp);
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible', 'is-from-top');
            }
        });

        lastScrollY = window.scrollY;
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(function (el) { revealObserver.observe(el); });
}

// =========================================
// 1b. Garis aksen tiap section ikut masuk/keluar layar
// =========================================
var animatedSections = document.querySelectorAll('.section');

if (!('IntersectionObserver' in window)) {
    animatedSections.forEach(function (el) { el.classList.add('is-inview'); });
} else {
    var sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            entry.target.classList.toggle('is-inview', entry.isIntersecting);
        });
    }, {
        threshold: 0.06,
        rootMargin: '0px 0px -10% 0px'
    });

    animatedSections.forEach(function (el) { sectionObserver.observe(el); });
}

// =========================================
// 2. Progress bar mengikuti posisi scroll
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
// 3. Navbar: menyusut saat scroll + menu aktif mengikuti section
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

// =========================================
// 4. Tutup menu navbar di HP setelah link diklik
// =========================================
var mobileMenu = document.getElementById('menu');

if (mobileMenu) {
    document.querySelectorAll('.navbar .nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            if (window.innerWidth >= 992) return;
            if (!mobileMenu.classList.contains('show')) return;

            if (window.bootstrap && bootstrap.Collapse) {
                bootstrap.Collapse.getOrCreateInstance(mobileMenu).hide();
            } else {
                mobileMenu.classList.remove('show');
            }
        });
    });
}

// =========================================
// 5. Project Python: jalankan kode -> audio + lirik sinkron di CMD
// =========================================
(function () {
    var demo = document.querySelector('[data-lyric-demo]');
    if (!demo) return;

    var codeView = demo.querySelector('[data-code-view]');
    var cmdView = demo.querySelector('[data-cmd-view]');
    var output = demo.querySelector('[data-output]');
    var statusEl = demo.querySelector('[data-status]');
    var playBtn = demo.querySelector('[data-play]');
    var playIcon = demo.querySelector('[data-play-icon]');
    var playLabel = demo.querySelector('[data-play-label]');
    var resetBtn = demo.querySelector('[data-reset]');
    var skipBtn = demo.querySelector('[data-skip]');
    var timeEl = demo.querySelector('[data-time]');
    var titleEl = demo.querySelector('[data-title]');
    var audio = demo.querySelector('[data-audio]');

    var AUDIO_VOLUME = 0.10; // 10% — biar tidak terlalu kencang
    audio.volume = AUDIO_VOLUME;

    var raf = window.requestAnimationFrame || function (cb) { return window.setTimeout(cb, 33); };
    var caf = window.cancelAnimationFrame || function (id) { window.clearTimeout(id); };

    // Timing persis dari D:\Python\Lagu.py (relatif terhadap play(start=143))
    var AUDIO_START = 143;
    var SHOW_END = 85.6; // 74.4 + 5.2 detik lirik terakhir + 6 detik outro di script asli

    var lyricLines = [
        { text: "I'm lookin' back on things I've done",    start: 14.9, duration: 3.5 },
        { text: "I never wanna play the same old part",    start: 20.3, duration: 3.8 },
        { text: "I'll keep you in the dark",               start: 25.7, duration: 2.8 },
        { text: "Now let me show you the shape of my heart", start: 29.9, duration: 3.5 },
        { text: "",                                        start: 33.8, duration: 0 },
        { text: "Looking back on the things I've done",    start: 34.3, duration: 3.0 },
        { text: "I was trying to be someone",              start: 38.5, duration: 3.1 },
        { text: "I played my part, kept you in the dark",  start: 43.0, duration: 3.8 },
        { text: "Now let me show you the shape of my heart", start: 48.5, duration: 4.6 },
        { text: "",                                        start: 53.8, duration: 0 },
        { text: "Looking back on the things I've done",    start: 54.6, duration: 2.8 },
        { text: "I was trying to be someone",              start: 58.3, duration: 3.1 },
        { text: "I played my part, kept you in the dark",  start: 62.9, duration: 3.9 },
        { text: "Now let me show you the shape of my heart", start: 68.5, duration: 4.7 },
        { text: "Show you the shape of my heart...",       start: 74.4, duration: 5.2 }
    ];

    var FIRST_LYRIC = lyricLines[0].start;

    function repeat(char, count) {
        return new Array(count + 1).join(char);
    }

    function center(text, width) {
        var left = Math.floor((width - text.length) / 2);
        return repeat(' ', left) + text + repeat(' ', width - text.length - left);
    }

    var boxWidth = 36; // muat di kartu selebar project lain
    var intro = [
        '╔' + repeat('═', boxWidth) + '╗',
        '║' + center('SHAPE OF MY HEART', boxWidth) + '║',
        '║' + center('Backstreet Boys - Climax', boxWidth) + '║',
        '║' + center('NOW PLAYING', boxWidth) + '║',
        '╚' + repeat('═', boxWidth) + '╝',
        '',
        'Musik dimulai. Menunggu lirik masuk...',
        '♪ ♫ ♪ ♫ ♪ ♫ ♪ ♫ ♪ ♫ ♪ ♫ ♪ ♫ ♪ ♫ ♪ ♫ ♪',
        ''
    ].join('\n');

    var reduceMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var runId = 0;
    var running = false;
    var nextIndex = 0;
    var active = null;
    var frameId = null;

    function setButton(label, icon) {
        playLabel.textContent = label;
        playIcon.className = icon;
    }

    function showCmdView(show) {
        codeView.hidden = show;
        cmdView.hidden = !show;
        resetBtn.hidden = !show;
        skipBtn.hidden = true;
        titleEl.textContent = show
            ? 'C:\\WINDOWS\\system32\\cmd.exe'
            : 'Lagu.py - Visual Studio Code';
        running = show;
    }

    function appendLine(text, className) {
        var line = document.createElement('div');
        line.className = 'cmd-line' + (className ? ' ' + className : '');
        line.textContent = text;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
        return line;
    }

    function finishActive() {
        if (!active) return;
        active.el.textContent = active.text;
        active.el.classList.remove('cmd-line--typing');
        active = null;
    }

    function beginLine(item) {
        var line = appendLine('', 'cmd-line--typing');

        if (!item.text) {
            line.innerHTML = '&nbsp;';
            line.classList.remove('cmd-line--typing');
            active = null;
            return;
        }

        if (reduceMotion) {
            line.textContent = item.text;
            line.classList.remove('cmd-line--typing');
            active = null;
            return;
        }

        active = {
            el: line,
            text: item.text,
            start: item.start,
            charDelay: item.duration / item.text.length
        };
    }

    // Jumlah karakter dihitung dari posisi audio, bukan timer, supaya tetap sinkron
    function updateTyping(elapsed) {
        if (!active) return;

        var count = Math.floor((elapsed - active.start) / active.charDelay) + 1;
        if (count < 0) count = 0;
        if (count > active.text.length) count = active.text.length;

        active.el.textContent = active.text.slice(0, count);
        output.scrollTop = output.scrollHeight;

        if (count === active.text.length) {
            active.el.classList.remove('cmd-line--typing');
            active = null;
        }
    }

    function formatTime(seconds) {
        var total = Math.max(0, Math.floor(seconds));
        var minutes = Math.floor(total / 60);
        var rest = total % 60;
        return (minutes < 10 ? '0' : '') + minutes + ':' + (rest < 10 ? '0' : '') + rest;
    }

    function updateInfo(elapsed) {
        var wait = FIRST_LYRIC - elapsed;

        if (wait > 0) {
            skipBtn.hidden = false;
            timeEl.textContent = 'lirik ' + wait.toFixed(1).replace('.', ',') + 's';
        } else {
            skipBtn.hidden = true;
            timeEl.textContent = formatTime(elapsed);
        }
    }

    function finish(token) {
        if (token !== runId) return;

        finishActive();
        appendLine('');
        appendLine('Terima kasih telah mendengarkan.', 'cmd-line--end');
        statusEl.textContent = 'Selesai';
        running = false;
        skipBtn.hidden = true;
        setButton('Ulangi', 'bi bi-arrow-repeat me-1');

        if (frameId) caf(frameId);
        frameId = null;
    }

    function tick(token) {
        if (token !== runId) return;

        var elapsed = audio.currentTime - AUDIO_START;
        if (elapsed < 0) elapsed = 0;

        while (nextIndex < lyricLines.length && elapsed >= lyricLines[nextIndex].start) {
            finishActive();
            beginLine(lyricLines[nextIndex]);
            nextIndex++;
        }

        updateTyping(elapsed);
        updateInfo(elapsed);

        if (elapsed >= SHOW_END || audio.ended) {
            finish(token);
            return;
        }

        frameId = raf(function () { tick(token); });
    }

    function fail(token, message) {
        if (token !== runId) return;

        statusEl.textContent = message;
        running = false;
        skipBtn.hidden = true;
        setButton('Ulangi', 'bi bi-play-fill me-1');

        if (frameId) caf(frameId);
        frameId = null;
    }

    function playAudio(token) {
        var promise;

        try {
            audio.volume = AUDIO_VOLUME;
            audio.currentTime = AUDIO_START;
            promise = audio.play();
        } catch (error) {
            fail(token, 'Audio gagal diputar');
            return;
        }

        statusEl.textContent = 'Menjalankan...';

        if (promise && typeof promise.then === 'function') {
            promise.then(function () {
                if (token !== runId) return;
                frameId = raf(function () { tick(token); });
            }).catch(function () {
                fail(token, 'Audio gagal diputar');
            });
        } else {
            frameId = raf(function () { tick(token); });
        }
    }

    function start() {
        runId++;
        var token = runId;

        if (frameId) caf(frameId);
        frameId = null;
        if (!audio.paused) audio.pause();

        output.textContent = '';
        nextIndex = 0;
        active = null;
        timeEl.textContent = '00:00';

        showCmdView(true);
        statusEl.textContent = 'Memuat audio...';
        setButton('Stop', 'bi bi-stop-fill me-1');
        appendLine(intro, 'cmd-line--intro');

        function onReady() {
            audio.removeEventListener('loadedmetadata', onReady);
            audio.removeEventListener('error', onError);
            if (token === runId) playAudio(token);
        }

        function onError() {
            audio.removeEventListener('loadedmetadata', onReady);
            audio.removeEventListener('error', onError);
            fail(token, 'Gagal memuat audio');
        }

        audio.addEventListener('loadedmetadata', onReady);
        audio.addEventListener('error', onError);

        if (!audio.getAttribute('src')) {
            audio.setAttribute('src', 'audio/lagu.mp3');
            audio.load();
        } else if (audio.readyState >= 1) {
            onReady();
        }
    }

    function stop(resetToCode) {
        runId++;

        if (frameId) caf(frameId);
        frameId = null;
        audio.pause();

        if (resetToCode) {
            showCmdView(false);
            statusEl.textContent = 'Siap';
            setButton('Jalankan kode', 'bi bi-play-fill me-1');
            timeEl.textContent = '00:00';
            return;
        }

        running = false;
        skipBtn.hidden = true;
        statusEl.textContent = 'Dihentikan';
        setButton('Ulangi', 'bi bi-play-fill me-1');
        appendLine('');
        appendLine('Pemutaran dihentikan.', 'cmd-line--muted');
    }

    playBtn.addEventListener('click', function () {
        if (running) {
            stop(false);
        } else {
            start();
        }
    });

    resetBtn.addEventListener('click', function () {
        stop(true);
    });

    // Opsional: lewati tunda ±15 detik sebelum lirik pertama (default tetap sesuai asli)
    skipBtn.addEventListener('click', function () {
        if (running && audio.readyState >= 1) {
            audio.currentTime = AUDIO_START + FIRST_LYRIC;
        }
    });
}());
