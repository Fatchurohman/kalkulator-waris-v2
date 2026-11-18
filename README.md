# 🕌 Kalkulator Waris Syafi'i Premium v2.0

> **Single-File Islamic Faraidh Calculation Engine**  
> Sistem kalkulasi pembagian harta warisan secara proporsional sesuai Syariat Islam berdasarkan Mazhab Syafi'i, dilengkapi otomatisasi Hijab, 'Aul, Radd, Gharrawain, hingga penanganan status khusus.

![License](https://img.shields.io/badge/license-MIT-emerald.svg)
![Version](https://img.shields.io/badge/version-2.0-amber.svg)
![Developer](https://img.shields.io/badge/developer-fatur62-blue.svg)

---

## ✨ Fitur Unggulan

* **🕌 Sesuai Mazhab Syafi'i:** Perhitungan hukum Faraidh merujuk pada ketentuan fikih Syafi'i yang akurat.
* **⚡ Arsitektur Single-File:** Seluruh antarmuka (UI), logika perhitungan, styling (Tailwind CSS), hingga ikon SVG terintegrasi dalam satu file `index.html` yang ringan dan mandiri tanpa *dependency* server yang rumit.
* **🔒 Otomatisasi Hukum Waris Kompleks:**
  * **Al-Hijab (Mahjub Hirman):** Otomatis menyaring kerabat yang terhalang hak warisnya (misalnya cucu terhalang anak laki-laki, kakek terhalang ayah, dll.).
  * **Kasus Khusus `'Aul & Radd`:** Menyesuaikan proporsi pembagian secara otomatis jika total bagian melebihi 1 (Aul) atau bersisa (Radd).
  * **Kasus `Gharrawain` / 'Umariyatain:** Penanganan khusus untuk pembagian bagian ibu bersama ayah dan pasangan.
* **📝 Pengecekan Kondisi & Status Khusus:**
  * Validasi batas maksimal wasiat syariat (1/3 dari harta setelah hutang).
  * Pengaturan anak di luar nikah (nasab jalur ibu).
  * Validasi kerabat non-muslim/murtad (terhalang waris).
  * Opsi penahanan porsi (*Mauquf*) untuk janin dalam kandungan.
* **🖨️ Cetak & Ekspor PDF:** Fitur cetak ramah media (*Print Media Optimized*) untuk menghasilkan laporan pembagian waris yang rapi dan profesional.
* **📱 PWA Ready:** Dilengkapi injeksi Web Manifest dinamis sehingga dapat diinstal sebagai aplikasi di perangkat seluler maupun desktop.

---

## 🛠️ Teknologi yang Digunakan

* **HTML5 & JavaScript (ES6+):** Fondasi struktur dan mesin logika kalkulasi waris sisi klien.
* **Tailwind CSS (CDN):** Kerangka kerja CSS modern untuk antarmuka yang bersih, elegan, dan responsif.
* **Google Fonts:** Menggunakan *Plus Jakarta Sans* untuk keterbacaan teks utama dan *Amiri* untuk teks bernuansa Islami.

---

## 🚀 Cara Menjalankan (Installation & Usage)

Karena aplikasi ini berformat **Single-File Engine**, kamu bisa langsung menjalankannya dengan sangat mudah:

1. **Clone repository ini:**
   ```bash
   git clone [https://github.com/username/nama-repo-kamu.git](https://github.com/username/nama-repo-kamu.git)
