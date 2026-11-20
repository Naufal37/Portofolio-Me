# ✨ Portofolio Naufal

Web portofolio pribadi yang menampilkan profil, keahlian, project, aktivitas, riwayat pendidikan, sertifikat, dan kontak. Dibangun dengan HTML, CSS, Bootstrap 5, dan sedikit JavaScript, lalu disajikan lewat server Express yang ringan.

Tampilannya responsif di desktop maupun HP, punya animasi saat scroll, tooltip persentase skill, progress bar, dan **tombol ganti tema terang/gelap** ala GitHub.

---

## 🔍 Preview

Jalankan server, lalu buka:

```
http://localhost:3001
```

> Halaman **Home** memakai wallpaper `public/images/walpaper 2.jpg` dengan latar gelap. Section di bawahnya mengikuti tema yang dipilih (terang/gelap).

---

## 🚀 Fitur

- **8 section navigasi:** Home, About, Skills, Projects, Aktivitas, Pendidikan, Sertifikat, Contact
- **Theme toggle** 🌙☀️ di navbar — pilihan tersimpan di `localStorage` dan mengikuti preferensi sistem saat pertama kali dibuka
- **Reveal animation** saat elemen masuk ke layar (dengan stagger & delay)
- **Skill card interaktif:** efek "pop" saat diklik + tooltip level keahlian setelah hover
- **Scroll progress bar** di bagian atas halaman
- **Navbar menyusut** saat scroll dan menu aktif menyesuaikan section yang sedang dilihat
- **Full responsive** dengan Breakpoint Bootstrap
- **Ramah aksesibilitas:** label ARIA, `focus-visible`, dan dukungan `prefers-reduced-motion`

---

## 🛠️ Teknologi

| Layer | Teknologi |
| --- | --- |
| Struktur | HTML5 |
| Styling | CSS3, Bootstrap 5.3.8, Bootstrap Icons |
| Logika | JavaScript (vanilla, CommonJS di server) |
| Server | Node.js + Express 5 |
| Font | Plus Jakarta Sans (Google Fonts) |

---

## 📦 Persyaratan

- [Node.js](https://nodejs.org/) **18 atau lebih baru** (disarankan LTS)
- npm (sudah termasuk saat menginstal Node.js)

---

## ▶️ Cara Menjalankan

```bash
# 1. Masuk ke folder proyek
cd D:\Portofolio

# 2. Instal dependensi (cukup sekali)
npm install

# 3. Jalankan server
npm start
# atau
npm run dev
```

Lalu buka **http://localhost:3001** di browser.

> Kalau port 3001 bentrok dengan aplikasi lain, ganti lewat environment variable:
>
> ```powershell
> $env:PORT=4000; npm start
> ```
>
> ```bash
> PORT=4000 npm start   # macOS / Linux
> ```

Hentikan server dengan menekan `Ctrl + C` di terminal.

---

## 📁 Struktur Proyek

```
Portofolio/
├── public/
│   ├── images/
│   │   ├── logos/          # Logo skill & media sosial (SVG)
│   │   ├── walpaper 2.jpg  # Wallpaper section Home
│   │   ├── walpaper.jpg    # Wallpaper lama (tidak dipakai)
│   │   └── ...             # Foto project, aktivitas, sekolah, sertifikat
│   ├── js/
│   │   ├── no-flash.js     # Probe awal: class .js + tema sebelum render
│   │   ├── theme.js        # Logika tombol terang/gelap + localStorage
│   │   └── main.js         # Reveal, skill tooltip, progress bar, navbar
│   ├── index.html          # Seluruh konten & struktur halaman
│   └── style.css           # Styling + CSS variables tema
├── server.js               # Static server Express
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

---

## ✏️ Kustomisasi

### Mengubah data diri, project, atau kontak
Edit langsung di **`public/index.html`**. Tiap kartu memakai struktur yang sama, jadi tinggal duplikat/blok `<article class="project-card reveal">`.

### Mengganti gambar
Taruh file di **`public/images/`**, lalu ubah path di atribut `src`. Untuk nama file yang mengandung spasi, gunakan `%20`, misalnya:

```html
<img src="images/Aplikasi%20Student%20Hub.jpeg" alt="Student Hub">
```

### Mengganti wallpaper Home
Ubah baris ini di **`public/style.css`**:

```css
.hero-section::before {
    background: url('images/walpaper 2.jpg') center / cover no-repeat;
}
```

### Mengubah warna tema
Semua warna terkumpul di bagian atas **`public/style.css`**:

```css
:root { /* tema terang */ }
[data-theme="dark"] { /* tema gelap */ }
```

Ubah `--primary`, `--surface`, `--section-bg`, `--ink`, dll. Untuk menyesuaikan warna latar tiap section, cukup ganti `--section-bg`.

### Menambah section baru
1. Tambahkan `<section id="nama" class="section">...</section>` di `index.html`.
2. Tambahkan `<li class="nav-item"><a class="nav-link" href="#nama">Nama</a></li>` di navbar.
3. Script `main.js` otomatis mendeteksi link navbar dan mengaktifkannya saat scroll.

---

## 🌐 Deploy

Proyek ini memakai server Express, jadi cocok di-deploy ke platform Node.js seperti **Render**, **Railway**, **Fly.io**, atau **VPS**.

```bash
npm install
npm start
```

Pastikan platform men-set environment variable `PORT` (kebanyakan platform mengatur otomatis).

> Alternatif: karena isinya murni statis, folder `public/` juga bisa di-deploy langsung ke Vercel/Netlify/GitHub Pages tanpa server.

---

## 📜 Script

| Perintah | Fungsi |
| --- | --- |
| `npm start` | Menjalankan server produksi |
| `npm run dev` | Menjalankan server untuk development (saat ini sama dengan `start`) |

---

## 📄 Lisensi

Proyek ini menggunakan lisensi **ISC** (sesuai `package.json`).

---

## 👤 Author

**Muhammad Naufal Al Baihaqi** — siswa SMKN 5 Malang, jurusan Rekayasa Perangkat Lunak (XI RPL).

- GitHub: [github.com/Naufal37](https://github.com/Naufal37)
- Email: nisizza@gmail.com
- Instagram: [@fall_1282](https://instagram.com/fall_1282)

---

Dibuat dengan ☕, Bootstrap, dan sedikit kopi malam.
