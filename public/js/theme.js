// =========================================
// Tombol ganti tema terang / gelap di navbar
// =========================================
(function () {
    var button = document.getElementById('themeToggle');
    var root = document.documentElement;
    var STORAGE_KEY = 'portofolio-theme';

    if (!button) return;

    function isDark() {
        return root.getAttribute('data-theme') === 'dark';
    }

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);

        var dark = theme === 'dark';
        button.setAttribute('aria-pressed', dark ? 'true' : 'false');
        button.setAttribute('aria-label', dark
            ? 'Ganti ke tampilan terang'
            : 'Ganti ke tampilan gelap');
        button.title = dark ? 'Ganti ke tampilan terang' : 'Ganti ke tampilan gelap';

        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (e) {
            // localStorage bisa diblokir; tema tetap berlaku untuk sesi ini.
        }
    }

    // Samakan label tombol dengan tema yang sudah dipilih no-flash.js
    applyTheme(isDark() ? 'dark' : 'light');

    button.addEventListener('click', function () {
        applyTheme(isDark() ? 'light' : 'dark');
    });
})();
