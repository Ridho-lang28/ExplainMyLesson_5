# UNS Smart Task & Learning Dashboard — ExplainMyLesson AI (React 19 + Tailwind CSS)

Proyek ini adalah hasil migrasi aplikasi **ExplainMyLesson AI** (sebelumnya HTML statis + TypeScript
vanilla) ke **React 19 + Vite + Tailwind CSS v4**, sesuai penugasan mandiri **Modul 5 — Bab 5: Framework
Modern UI & Ekosistem React** (D3 Teknik Informatika, SV UNS).

## Menjalankan proyek

```bash
npm install
npm run dev       # mode pengembangan
npm run build     # build produksi ke folder dist/
```

## Struktur Folder

```
src/
├─ components/
│  ├─ Navbar.jsx                 # Navigasi & badge peran (Pelajar/Pengajar)
│  ├─ LevelBadge.jsx             # Badge level kuis, reusable
│  └─ UploadMaterialModal.jsx    # MODULE FORM ENTRY (validasi + async)
├─ pages/
│  ├─ PelajarDashboard.jsx       # MODULE DASHBOARD (Pelajar)
│  ├─ PengajarDashboard.jsx      # MODULE DASHBOARD (Pengajar) + async API
│  └─ KuisAdaptif.jsx            # MODULE DATA TABLE/LIST (kuis adaptif)
├─ services/
│  └─ apiService.js              # Simulasi Fetch API async/await (loading/error/success)
├─ data/
│  └─ quizData.js                # "Database" tiruan (soal, progres bab, daftar pelajar)
└─ App.jsx                       # Routing (react-router-dom)
```

## Matriks Pemetaan SRS vs Komponen UI

| ID Kebutuhan SRS | Deskripsi Kebutuhan | Komponen UI / File |
|---|---|---|
| SRS-DASH-01 | Pengajar dapat melihat ringkasan statistik kelas (jumlah pelajar, rata-rata pemahaman, modul aktif) secara real-time dari server | `src/pages/PengajarDashboard.jsx` + `fetchClassSummaryApi` di `src/services/apiService.js` |
| SRS-DASH-02 | Pengajar dapat melihat daftar pelajar yang perlu bimbingan (skor kuis < 60) dan tingkat pemahaman per bab | `src/pages/PengajarDashboard.jsx` (`studentsNeedingHelp`, `chapterProgress` dari `src/data/quizData.js`) |
| SRS-STUDENT-01 | Pelajar dapat memilih bab/modul publik dan mode generasi materi AI (ringkasan, analogi, mind map, contoh soal) | `src/pages/PelajarDashboard.jsx` |
| SRS-FORM-01 | Pelajar dapat mengunggah materi privat (PDF) dengan validasi judul & tipe file, disertai umpan balik status pengiriman | `src/components/UploadMaterialModal.jsx` + `uploadMaterialApi` |
| SRS-QUIZ-01 | Sistem menyajikan kuis adaptif 3 level (10 soal/level) yang dimuat secara asinkron per level, lengkap dengan hint AI dan skor kumulatif | `src/pages/KuisAdaptif.jsx` + `fetchQuestionsByLevelApi` |
| SRS-GAMIF-01 | Pelajar mendapatkan poin gamifikasi saat menandai materi sudah dipahami maupun menjawab kuis dengan benar | `src/pages/PelajarDashboard.jsx` (state `points`), `src/pages/KuisAdaptif.jsx` (state `score`) |

## Penerapan Reaktivitas (React 19)

Seluruh state dikelola dengan `useState`/`useEffect` murni **tanpa** `useMemo`/`useCallback` manual,
mengikuti skenario React 19 pada modul di mana React Compiler menangani optimasi memoization secara
otomatis pada tahap build — komponen cukup fokus pada logika dan struktur data.

## Simulasi Asinkron & Loading State

`src/services/apiService.js` mensimulasikan tiga endpoint (`fetchClassSummaryApi`,
`fetchQuestionsByLevelApi`, `uploadMaterialApi`) menggunakan `Promise` + `setTimeout`, termasuk peluang
kegagalan acak pada `uploadMaterialApi` (±15%) untuk melatih penanganan state `loading` / `error` /
`success` pada komponen React (lihat skeleton loading di `PengajarDashboard.jsx` dan pesan error di
`KuisAdaptif.jsx` & `UploadMaterialModal.jsx`).

## Pengukuran Performa (ringkas)

Hasil `npm run build` (Vite, produksi):

- `index.html` ≈ 0.5 KB
- CSS (Tailwind, ter-*purge*) ≈ 25.6 KB (gzip ≈ 5.6 KB)
- JS bundle (React 19 + react-router-dom) ≈ 283 KB (gzip ≈ 89 KB)

Ukuran bundle JS didominasi oleh runtime React + react-router-dom. Karena seluruh state bersifat lokal
per halaman dan tidak ada komputasi berat pada setiap render, tidak ditemukan indikasi re-render
berlebihan; setiap komponen hanya bergantung pada state miliknya sendiri (localized state), bukan
context global.
