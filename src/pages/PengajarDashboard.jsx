import { useEffect, useState } from "react";
import { fetchClassSummaryApi, exportClassReportApi } from "../services/apiService";
import { chapterProgress, studentsNeedingHelp } from "../data/quizData";
import UploadModuleModal from "../components/UploadModuleModal";

// ============================================================
// MODULE DASHBOARD — SRS-DASH-01 (Analisis & Pemahaman Kelas)
// SRS-DASH-02 (Daftar Pelajar Perlu Bimbingan)
//
// Pola reaktivitas: useState murni. Tidak ada useMemo/useCallback
// manual — sesuai skenario React 19 + React Compiler pada modul,
// nilai turunan cukup dihitung ulang tiap render karena datanya kecil.
// ============================================================

const TONE_STYLES = {
  high: { bar: "bg-emerald-500", text: "text-emerald-600", label: "Tinggi" },
  good: { bar: "bg-blue-500", text: "text-blue-600", label: "Baik" },
  warning: { bar: "bg-amber-500", text: "text-amber-600", label: "Perlu Perhatian" },
};

function MetricCard({ label, value, valueClass = "text-gray-900", note, noteClass = "text-gray-400", warn }) {
  return (
    <div
      className={`p-5 rounded-xl border shadow-sm ${
        warn ? "border-amber-200 bg-amber-50/30" : "bg-white border-gray-200"
      }`}
    >
      <p className={`text-xs font-medium ${warn ? "text-amber-800" : "text-gray-500"}`}>{label}</p>
      <p className={`text-2xl font-bold mt-1 ${valueClass}`}>{value}</p>
      <span className={`text-xs font-medium mt-1 inline-block ${noteClass}`}>{note}</span>
    </div>
  );
}

export default function PengajarDashboard() {
  // --- Simulasi Asinkron Data API (loading / error / success) ---
  const [summaryState, setSummaryState] = useState({ status: "loading" });

  useEffect(() => {
    let isMounted = true;
    setSummaryState({ status: "loading" });

    fetchClassSummaryApi()
      .then((data) => {
        if (isMounted) setSummaryState({ status: "success", data });
      })
      .catch((err) => {
        if (isMounted) setSummaryState({ status: "error", message: err.message });
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const [exportState, setExportState] = useState({ status: "idle" });
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  async function handleExport() {
    if (summaryState.status !== "success" || exportState.status === "loading") return;

    setExportState({ status: "loading" });
    try {
      const { fileName, content, mimeType } = await exportClassReportApi({
        summary: summaryState.data,
        chapterProgress,
        studentsNeedingHelp,
      });

      // Trigger download file secara nyata di browser (bukan sekadar notifikasi)
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      setExportState({ status: "success", fileName });
      setTimeout(() => setExportState({ status: "idle" }), 3000);
    } catch (err) {
      setExportState({ status: "error", message: err.message });
      setTimeout(() => setExportState({ status: "idle" }), 3500);
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Analisis & Pemahaman Kelas</h1>
          <p className="text-sm text-gray-500">
            Pantau progres pemahaman pelajar dan lakukan intervensi tepat sasaran.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExport}
            disabled={summaryState.status !== "success" || exportState.status === "loading"}
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 text-xs font-semibold px-4 py-2 rounded-lg shadow-sm"
          >
            📄 {exportState.status === "loading" ? "Mengekspor..." : "Ekspor Laporan"}
          </button>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm"
          >
            ➕ Unggah Modul Baru
          </button>
        </div>
      </div>

      {exportState.status === "loading" && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs font-medium px-4 py-2 rounded-lg">
          Memproses ekspor laporan analisis kelas (CSV/Excel)...
        </div>
      )}
      {exportState.status === "success" && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium px-4 py-2 rounded-lg">
          Laporan berhasil diunduh: {exportState.fileName}
        </div>
      )}
      {exportState.status === "error" && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium px-4 py-2 rounded-lg">
          Gagal mengekspor laporan: {exportState.message}
        </div>
      )}

      {/* METRIC CARDS — bergantung pada state async */}
      {summaryState.status === "loading" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm animate-pulse">
              <div className="h-3 w-24 bg-gray-200 rounded mb-3" />
              <div className="h-6 w-16 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      )}

      {summaryState.status === "error" && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium px-4 py-3 rounded-lg">
          Gagal memuat ringkasan kelas: {summaryState.message}
        </div>
      )}

      {summaryState.status === "success" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Total Pelajar Terdaftar"
            value={summaryState.data.totalStudents}
            note="● Aktif semester ini"
            noteClass="text-emerald-600"
          />
          <MetricCard
            label="Rata-Rata Pemahaman Kelas"
            value={`${summaryState.data.averageComprehension}%`}
            valueClass="text-blue-600"
            note="↑ +2.1% dari minggu lalu"
            noteClass="text-blue-600"
          />
          <MetricCard
            label="Materi Aktif di-Upload"
            value={`${summaryState.data.activeModules} Modul`}
            note="Format PDF terverifikasi RAG"
          />
          <MetricCard
            label="Pelajar Perlu Intervensi"
            value={`${summaryState.data.studentsNeedingIntervention} Pelajar`}
            valueClass="text-amber-600"
            note="⚠️ Nilai Kuis < 60"
            noteClass="text-amber-700"
            warn
          />
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-8 bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="font-bold text-gray-800">Tingkat Pemahaman Per Bab</h2>
            <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded">Rata-rata Kuis</span>
          </div>

          <div className="space-y-4 pt-2">
            {chapterProgress.map((chapter) => {
              const tone = TONE_STYLES[chapter.tone];
              return (
                <div key={chapter.id}>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span>{chapter.name}</span>
                    <span className={`font-bold ${tone.text}`}>
                      {chapter.percent}% ({tone.label})
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div
                      className={`${tone.bar} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${chapter.percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="lg:col-span-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="border-b pb-3">
            <h2 className="font-bold text-gray-800">Pelajar Perlu Bimbingan</h2>
            <p className="text-xs text-gray-500">Terdeteksi skor kuis &lt; 60</p>
          </div>

          <div className="space-y-3">
            {studentsNeedingHelp.map((student) => (
              <div
                key={student.id}
                className="p-3 border border-amber-200 bg-amber-50/50 rounded-lg flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">{student.name}</p>
                  <p className="text-xs text-amber-700">
                    {student.chapter} — Skor Kuis: {student.score}/{student.outOf}
                  </p>
                </div>
                <button className="bg-amber-600 hover:bg-amber-700 text-white text-xs px-2.5 py-1 rounded font-medium">
                  Bimbing
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <UploadModuleModal open={uploadModalOpen} onClose={() => setUploadModalOpen(false)} />
    </main>
  );
}
