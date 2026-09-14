import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LevelBadge from "../components/LevelBadge";
import UploadMaterialModal from "../components/UploadMaterialModal";
import { availableChapters, aiModes } from "../data/quizData";
import { generateAiContentApi } from "../services/apiService";

// ============================================================
// MODULE DASHBOARD (Pelajar) — SRS-STUDENT-01
// Menggabungkan panel kontrol pembelajaran (pilih bab, mode AI)
// dengan area output materi hasil RAG/LLM.
// ============================================================

export default function PelajarDashboard() {
  const navigate = useNavigate();
  const [selectedChapter, setSelectedChapter] = useState("2");
  const [selectedMode, setSelectedMode] = useState("ringkasan");
  const [modalOpen, setModalOpen] = useState(false);
  const [points, setPoints] = useState(420);
  const [claimed, setClaimed] = useState(false);

  // --- Konten AI (RAG/LLM) — Simulasi Asinkron (loading / error / success) ---
  const [contentState, setContentState] = useState({ status: "loading" });

  function loadAiContent(chapterId, mode) {
    setContentState({ status: "loading" });
    generateAiContentApi({ chapterId, mode })
      .then((data) => setContentState({ status: "success", data }))
      .catch((err) => setContentState({ status: "error", message: err.message }));
  }

  // Muat konten awal saat dashboard pertama kali dibuka
  useEffect(() => {
    loadAiContent(selectedChapter, selectedMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleRefreshAi() {
    setClaimed(false);
    loadAiContent(selectedChapter, selectedMode);
  }

  function handleClaimPoints() {
    if (claimed) return;
    setPoints((p) => p + 10);
    setClaimed(true);
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Selamat Datang Kembali, Ridho!</h1>
          <p className="text-blue-100 text-sm mt-1">
            Dari 200 Halaman jadi 2 Halaman — Pahami Materi Tanpa Pusing
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-3 flex items-center space-x-4">
          <div className="text-2xl">🏆</div>
          <div>
            <p className="text-xs text-blue-100">Total Poin Gamifikasi</p>
            <p className="text-xl font-extrabold text-white">{points} pts</p>
          </div>
          <div className="border-l border-white/20 pl-4">
            <p className="text-xs text-blue-100">Level Saat Ini</p>
            <LevelBadge level="MEDIUM" />
          </div>
        </div>
      </section>

      <aside className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start space-x-3">
          <span className="text-amber-600 font-bold text-lg">⚠️</span>
          <div>
            <h2 className="font-semibold text-amber-900 text-sm">Rekomendasi Belajar Otomatis</h2>
            <p className="text-xs text-amber-700 mt-0.5">
              Nilai Kuis Anda 2 &lt; 60 pada Bab 2: Agile, Scrum &amp; AI Assessment. Yuk pelajari ulang bab ini!
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setSelectedChapter("2");
            setSelectedMode("ringkasan");
            loadAiContent("2", "ringkasan");
          }}
          className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-2 rounded-md transition shadow-sm whitespace-nowrap self-start sm:self-auto"
        >
          Pelajari Yang Direkomendasikan
        </button>
      </aside>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* PANEL KIRI: Fitur Kontrol & Mode AI (Form Entry) */}
        <aside className="lg:col-span-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-5">
          <div className="border-b pb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="block text-xs font-bold text-gray-700">Upload Materi Privat (Opsional)</span>
              <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Catatan Pribadi</span>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="w-full border-2 border-dashed border-blue-200 bg-blue-50/30 hover:bg-blue-50 text-blue-700 font-semibold py-2 px-3 rounded-lg text-xs transition flex items-center justify-center space-x-2"
            >
              <span>📎</span>
              <span>Unggah PDF Privat Kamu</span>
            </button>
          </div>

          <div>
            <label htmlFor="selectBab" className="block text-xs font-bold text-gray-700 mb-2">
              Pilih Bab / Modul Publik
            </label>
            <select
              id="selectBab"
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
            >
              {availableChapters.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <fieldset>
            <legend className="block text-xs font-bold text-gray-700 mb-2">Pilih Mode Generasi AI</legend>
            <div className="space-y-2 text-xs">
              {aiModes.map((mode) => (
                <label
                  key={mode.value}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                    selectedMode === mode.value
                      ? "border-blue-200 bg-blue-50/50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="ai_mode"
                    value={mode.value}
                    checked={selectedMode === mode.value}
                    onChange={(e) => setSelectedMode(e.target.value)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2.5 font-medium text-gray-800">
                    {mode.icon} {mode.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="pt-2">
            <button
              onClick={() => navigate("/kuis")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-xs transition shadow-sm flex items-center justify-center space-x-2"
            >
              <span>🎯</span>
              <span>Mulai Kuis Adaptif 3 Level (+Poin)</span>
            </button>
          </div>
        </aside>

        {/* PANEL KANAN: Output Content AI */}
        <article className="lg:col-span-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b pb-4 mb-4 gap-3">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  {contentState.status === "success"
                    ? contentState.data.title
                    : `Materi — Bab ${selectedChapter}`}
                </h2>
                <span className="text-xs text-gray-500">
                  Ekstraksi otomatis RAG & LLM dari dokumen modul utama
                </span>
              </div>
              <button
                onClick={handleRefreshAi}
                disabled={contentState.status === "loading"}
                aria-label="Refresh konten AI"
                className="flex items-center space-x-1 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 px-3 py-1.5 rounded-md text-xs font-medium text-gray-700 shrink-0"
              >
                <span className={contentState.status === "loading" ? "animate-spin" : ""}>🔄</span>
                <span>{contentState.status === "loading" ? "Memuat..." : "Refresh AI"}</span>
              </button>
            </div>

            {contentState.status === "loading" && (
              <div className="space-y-3 animate-pulse">
                <div className="h-3 w-5/6 bg-gray-200 rounded" />
                <div className="h-3 w-full bg-gray-200 rounded" />
                <div className="h-3 w-3/4 bg-gray-200 rounded" />
              </div>
            )}

            {contentState.status === "error" && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium px-4 py-3 rounded-lg space-y-2">
                <p>Gagal memuat konten AI: {contentState.message}</p>
                <button
                  onClick={handleRefreshAi}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-3 py-1.5 rounded-md"
                >
                  Coba Lagi
                </button>
              </div>
            )}

            {contentState.status === "success" && (
              <div className="prose max-w-none text-xs text-gray-700 space-y-3">
                {contentState.data.body.map((paragraph, idx) => (
                  <p key={idx} className="whitespace-pre-wrap">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className="border-t pt-4 flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {claimed ? "Poin sudah diklaim untuk sesi ini." : "Selesai membaca? Klaim poin kamu!"}
            </span>
            <button
              onClick={handleClaimPoints}
              disabled={claimed || contentState.status !== "success"}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-md shadow-sm"
            >
              Tandai Sudah Paham (+10 pts)
            </button>
          </div>
        </article>
      </div>

      <UploadMaterialModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </main>
  );
}
