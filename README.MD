# Limina

Sistem peringatan dini risiko suspensi untuk emiten Bursa Efek Indonesia.

> Nama Limina berasal dari kata Latin *limen* (ambang, batas). Inti produk ini bukan meramal peristiwa, melainkan mengukur jarak sebuah emiten terhadap ambang batas risiko yang sudah dipublikasikan oleh BEI.

**Status:** dalam pengembangan · **Kompetisi:** Sectors Hackathon 2026, Track 03 Market Intelligence

---

## Ringkasan

Investor ritel pemegang saham lapis dua dan tiga umumnya baru mengetahui ada masalah pada emitennya ketika sahamnya sudah tidak bisa dijual. BEI menerbitkan Notasi Khusus dan memindahkan emiten bermasalah ke Papan Pemantauan Khusus, tetapi kedua mekanisme itu bersifat menandai kondisi yang sudah terjadi — bukan memperingatkan kondisi yang sedang terbentuk.

Limina menghitung ulang kriteria risiko tersebut secara berkelanjutan dari data [Sectors](https://sectors.app), lalu menampilkan emiten mana yang sedang bergerak mendekati ambang batas, beserta alasan kuantitatif mengapa skornya naik.

**Klaim produk:** bukan "kami memprediksi suspensi", melainkan **"kami menghitung rubrik risiko yang sudah dipublikasikan, lebih cepat daripada labelnya diterbitkan."**

---

## Untuk siapa

- **Pengguna utama** — investor ritel yang memegang saham lapis dua dan tiga, memantau portofolionya sendiri, tanpa akses ke riset sekuritas
- **Pengguna sekunder** — penulis dan pengelola komunitas investasi yang membutuhkan dasar kuantitatif saat membahas emiten berisiko
- **Bukan target** — investor institusional dan analis profesional yang sudah punya proses pemantauan sendiri

---

## Yang diklaim, yang tidak

| Diklaim | Tidak diklaim |
|---|---|
| Menghitung indikator risiko dari kriteria publik BEI, berkelanjutan, untuk seluruh emiten cakupan | Bukan prediksi kebangkrutan, kecurangan, atau delisting |
| Menampilkan peringkat emiten berdasarkan skor risiko, disertai penjelasan kontribusi tiap indikator | Bukan rekomendasi beli, jual, atau tahan |
| Menunjukkan bukti historis berupa selisih waktu antara naiknya skor dan terbitnya label resmi | Bukan pengganti pengumuman resmi BEI |
| | Tidak memberikan estimasi durasi suspensi |

---

## Fitur

- **Halaman Peringkat** — daftar emiten diurutkan dari skor risiko tertinggi, dengan arah pergerakan 30 hari terakhir dan indikator paling dominan
- **Halaman Detail Emiten** — rincian kontribusi tiap indikator, grafik pergerakan skor, nilai mentah berdampingan dengan ambang batasnya
- **Halaman Bukti** — studi kasus emiten yang pernah disuspensi, ditampilkan sebagai garis waktu dengan distribusi selisih waktu terhadap label resmi
- **Halaman Metodologi** — definisi label, daftar indikator dan rumusnya, aturan point-in-time, keterbatasan yang diketahui

---

## Arsitektur

Perhitungan dilakukan luring, hasilnya diekspor sebagai berkas statis, dan antarmuka hanya membaca berkas tersebut.

```
Sectors API → Lapisan pengambilan → Cache lokal → Model & indikator → Artefak JSON → Antarmuka statis
```

Konsekuensi yang disengaja:
- Tidak ada server yang perlu dijaga hidup untuk fitur inti
- Kunci API tidak pernah berada di sisi klien
- Antarmuka dapat ditempatkan di layanan hosting statis tanpa biaya

---

## Tumpukan teknologi

| Lapisan | Teknologi |
|---|---|
| Data & model | Python |
| Antarmuka | Vue 3 / React, Vite, Tailwind |
| Grafik | ApexCharts |
| Akun pengguna (opsional) | Supabase (Postgres + Auth + Row Level Security) |
| Progressive Web App | Manifest + service worker |

---

## Struktur proyek

```
limina/
  src/            Pembungkus API, pengelompokan label, indikator,
                   pemeriksa point-in-time, sampling, model, ekspor
  data/
    cache/        Respons mentah (tidak masuk kontrol versi)
    labels/       Pemetaan alasan suspensi
    artifacts/    scores.json, backtest.json — keluaran untuk antarmuka
  web/            Antarmuka, PWA
  supabase/       Skema dan migrasi (jika fitur akun diaktifkan)
  scheduler/      Job pembaruan berkala
  notebooks/      Eksplorasi, bukan jalur produksi
  docs/           Metodologi dan dokumentasi tambahan
```

---

## Metodologi singkat

- **Label positif** hanya berasal dari suspensi kategori kepatuhan/distress (keterlambatan laporan keuangan, sanksi, going concern) — suspensi sukarela atau teknis jangka pendek dibuang dari label utama
- **Aturan point-in-time**: tidak ada indikator yang memakai data yang baru tersedia setelah T dikurangi 30 hari, ditegakkan lewat fungsi pemeriksa otomatis pada setiap sampel
- **Pemisahan data bersifat temporal**, bukan acak — peristiwa sebelum 2025 untuk pelatihan, 2025–2026 untuk pengujian
- **Metrik utama**: Precision@20 dan rata-rata selisih waktu terhadap label resmi. Akurasi tidak dilaporkan karena menyesatkan pada kelas yang timpang
- Jalur cadangan rule-based tersedia jika jumlah sampel atau performa model tidak memadai

Detail lengkap ada di `docs/metodologi.md`.

---

## Keterbatasan

- Jumlah sampel positif kemungkinan kecil, sehingga selang kepercayaan pada metrik lebar
- Pengelompokan alasan suspensi bersifat penilaian manusia, dipublikasikan agar dapat diperdebatkan
- Skor tidak berlaku untuk emiten dengan data tidak lengkap — dikeluarkan dari cakupan dan ditandai, bukan diberi skor rendah diam-diam
- Tidak dapat melihat informasi non-publik
- Selisih waktu historis bukan jaminan masa depan

---

## Disclaimer

Limina bukan nasihat investasi. Seluruh angka dan skor bersifat informatif, dihitung dari data publik, dan tidak menggantikan verifikasi ke sumber resmi seperti laporan keuangan atau pengumuman Bursa Efek Indonesia. Keputusan investasi sepenuhnya tanggung jawab pengguna.

---

## Lisensi

Belum ditentukan.