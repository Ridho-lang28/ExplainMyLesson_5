// src/services/apiService.js
//
// Simulasi pemanggilan API asinkron (Fetch/Axios-style) sesuai ketentuan
// Modul 5 poin "Simulasi Asinkronis Data API". Setiap fungsi mengembalikan
// Promise dengan delay buatan dan peluang error acak, sehingga komponen
// React wajib menangani state: loading, error, dan success.

import { mockQuestions, aiContentLibrary } from "../data/quizData";

const ARTIFICIAL_DELAY_MS = 600;

/**
 * Mengambil daftar soal kuis berdasarkan level (1-3).
 * Mensimulasikan endpoint: GET /api/quiz?level=<level>
 */
export function fetchQuestionsByLevelApi(level) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = mockQuestions[level];
      if (!data) {
        reject(new Error(`Soal untuk level ${level} tidak ditemukan.`));
        return;
      }
      resolve(data);
    }, ARTIFICIAL_DELAY_MS);
  });
}

/**
 * Mensimulasikan pengiriman materi (public/privat) ke RAG Engine backend.
 * Mensimulasikan endpoint: POST /api/materials
 */
export function uploadMaterialApi(payload) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulasi kegagalan acak (mis. file korup / server sibuk) sebesar ~15%
      if (Math.random() < 0.15) {
        reject(new Error("Gagal mengindeks dokumen ke RAG Engine. Coba lagi."));
        return;
      }
      resolve({
        id: `doc_${Date.now()}`,
        title: payload.title,
        fileName: payload.fileName,
        indexedAt: new Date().toISOString(),
      });
    }, ARTIFICIAL_DELAY_MS + 400);
  });
}

/**
 * Mensimulasikan pengambilan ringkasan statistik kelas untuk dashboard Pengajar.
 * Mensimulasikan endpoint: GET /api/class/summary
 */
export function fetchClassSummaryApi() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalStudents: 50,
        averageComprehension: 78.4,
        activeModules: 6,
        studentsNeedingIntervention: 2,
      });
    }, ARTIFICIAL_DELAY_MS);
  });
}

/**
 * Mensimulasikan proses generate ulang konten AI (RAG/LLM) untuk Pelajar
 * berdasarkan kombinasi Bab + Mode Generasi yang dipilih.
 * Mensimulasikan endpoint: POST /api/ai/generate  { chapterId, mode }
 */
export function generateAiContentApi({ chapterId, mode }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const content = aiContentLibrary?.[chapterId]?.[mode];
      if (!content) {
        reject(new Error("Konten untuk kombinasi Bab & Mode ini belum tersedia."));
        return;
      }
      // Simulasi kegagalan acak (mis. LLM Engine sibuk) sebesar ~10%
      if (Math.random() < 0.1) {
        reject(new Error("Gagal menghasilkan konten dari LLM Engine. Silakan coba lagi."));
        return;
      }
      resolve(content);
    }, ARTIFICIAL_DELAY_MS + 300);
  });
}

/**
 * Mensimulasikan proses ekspor laporan analisis kelas ke file (CSV) yang
 * bisa dibuka di Excel. Mengembalikan konten file + nama file agar bisa
 * langsung di-download oleh browser.
 * Mensimulasikan endpoint: GET /api/class/export?format=csv
 */
export function exportClassReportApi({ summary, chapterProgress, studentsNeedingHelp }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.08) {
        reject(new Error("Gagal membuat file laporan. Coba lagi beberapa saat lagi."));
        return;
      }

      const rows = [];
      rows.push(["Laporan Analisis & Pemahaman Kelas"]);
      rows.push([`Diekspor pada`, new Date().toLocaleString("id-ID")]);
      rows.push([]);
      rows.push(["Ringkasan Umum"]);
      rows.push(["Total Pelajar Terdaftar", summary.totalStudents]);
      rows.push(["Rata-Rata Pemahaman Kelas (%)", summary.averageComprehension]);
      rows.push(["Materi Aktif di-Upload", summary.activeModules]);
      rows.push(["Pelajar Perlu Intervensi", summary.studentsNeedingIntervention]);
      rows.push([]);
      rows.push(["Tingkat Pemahaman Per Bab"]);
      rows.push(["Bab", "Persentase (%)"]);
      chapterProgress.forEach((c) => rows.push([c.name, c.percent]));
      rows.push([]);
      rows.push(["Pelajar Perlu Bimbingan"]);
      rows.push(["Nama", "Bab", "Skor Kuis"]);
      studentsNeedingHelp.forEach((s) => rows.push([s.name, s.chapter, `${s.score}/${s.outOf}`]));

      const csvContent = rows
        .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        .join("\r\n");

      resolve({
        fileName: `Laporan_Analisis_Kelas_${Date.now()}.csv`,
        content: csvContent,
        mimeType: "text/csv;charset=utf-8;",
      });
    }, ARTIFICIAL_DELAY_MS + 500);
  });
}
