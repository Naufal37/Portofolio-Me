const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Semua aset statis (HTML, CSS, JS, gambar) diambil dari folder public/
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`Portofolio berjalan di http://localhost:${PORT}`);
});
