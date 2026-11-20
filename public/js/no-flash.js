// Dijalankan lebih awal (tanpa defer) agar elemen reveal tidak berkedip
// sebelum stylesheet dan main.js selesai dimuat.
document.documentElement.classList.add('js');

// Terapkan tema sebelum halaman dicat supaya tidak ada kedip terang/gelap.
(function () {
    var key = 'portofolio-theme';
    var theme;

    try {
        theme = localStorage.getItem(key);
    } catch (e) {
        theme = null;
    }

    if (theme !== 'dark' && theme !== 'light') {
        theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
    }

    document.documentElement.setAttribute('data-theme', theme);
})();
