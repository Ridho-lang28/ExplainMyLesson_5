import { useState } from "react";
import { uploadMaterialApi } from "../services/apiService";
import { availableChapters } from "../data/quizData";

// ============================================================
// MODULE FORM ENTRY — SRS-FORM-02 (Unggah Modul Publik oleh Pengajar)
//
// Mencakup:
//  - Validasi form sisi klien (judul wajib diisi, bab wajib dipilih, file wajib .pdf)
//  - Event handling interaktif (submit, batal, tutup)
//  - Umpan balik visual (pesan error per-field & status pengiriman)
//  - Simulasi asinkron API (loading / success / error) lewat apiService
// ============================================================

const initialForm = { title: "", chapter: availableChapters[0]?.value ?? "", file: null };

export default function UploadModuleModal({ open, onClose, onUploaded }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitState, setSubmitState] = useState({ status: "idle" });

  if (!open) return null;

  function validate(values) {
    const nextErrors = {};
    if (!values.title.trim()) {
      nextErrors.title = "Judul modul wajib diisi.";
    } else if (values.title.trim().length < 5) {
      nextErrors.title = "Judul minimal 5 karakter.";
    }

    if (!values.chapter) {
      nextErrors.chapter = "Silakan pilih bab tujuan.";
    }

    if (!values.file) {
      nextErrors.file = "Silakan pilih file PDF.";
    } else if (values.file.type !== "application/pdf") {
      nextErrors.file = "Format file harus PDF.";
    }

    return nextErrors;
  }

  function resetAndClose() {
    setForm(initialForm);
    setErrors({});
    setSubmitState({ status: "idle" });
    onClose();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitState({ status: "loading" });
    try {
      const result = await uploadMaterialApi({ title: form.title, fileName: form.file.name });
      setSubmitState({ status: "success" });
      onUploaded?.({ ...result, chapter: form.chapter });
      setTimeout(resetAndClose, 1200);
    } catch (err) {
      setSubmitState({ status: "error", message: err.message });
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="font-bold text-gray-900 text-sm">Unggah Modul Baru (Materi Publik)</h3>
          <button
            onClick={resetAndClose}
            aria-label="Tutup Modal Unggah Modul"
            className="text-gray-400 hover:text-gray-600 font-bold text-lg"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="moduleTitle" className="block text-xs font-semibold text-gray-700 mb-1">
              Judul Modul
            </label>
            <input
              id="moduleTitle"
              type="text"
              placeholder="Contoh: Bab 4 - Software Testing & QA"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className={`w-full border rounded-lg p-2 text-xs focus:ring-blue-500 focus:border-blue-500 ${
                errors.title ? "border-rose-400" : "border-gray-300"
              }`}
            />
            {errors.title && <p className="text-[11px] text-rose-600 mt-1">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="moduleChapter" className="block text-xs font-semibold text-gray-700 mb-1">
              Bab Tujuan
            </label>
            <select
              id="moduleChapter"
              value={form.chapter}
              onChange={(e) => setForm((f) => ({ ...f, chapter: e.target.value }))}
              className={`w-full border rounded-lg p-2 text-xs bg-white focus:ring-blue-500 focus:border-blue-500 ${
                errors.chapter ? "border-rose-400" : "border-gray-300"
              }`}
            >
              {availableChapters.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            {errors.chapter && <p className="text-[11px] text-rose-600 mt-1">{errors.chapter}</p>}
          </div>

          <div>
            <label htmlFor="moduleFile" className="block text-xs font-semibold text-gray-700 mb-1">
              Pilih File PDF
            </label>
            <input
              id="moduleFile"
              type="file"
              accept=".pdf"
              onChange={(e) => setForm((f) => ({ ...f, file: e.target.files?.[0] ?? null }))}
              className={`w-full border rounded-lg p-2 text-xs text-gray-600 bg-gray-50 ${
                errors.file ? "border-rose-400" : "border-gray-300"
              }`}
            />
            <p className="text-[10px] text-gray-500 mt-1">
              Modul ini akan tampil publik dan bisa diakses oleh seluruh pelajar di kelas.
            </p>
            {errors.file && <p className="text-[11px] text-rose-600 mt-1">{errors.file}</p>}
          </div>

          {submitState.status === "error" && (
            <p className="text-[11px] text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-2">
              {submitState.message}
            </p>
          )}
          {submitState.status === "success" && (
            <p className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-2">
              Modul berhasil diunggah &amp; diindeks oleh RAG Engine!
            </p>
          )}

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={resetAndClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitState.status === "loading"}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg text-xs font-semibold shadow-sm"
            >
              {submitState.status === "loading" ? "Mengunggah..." : "Unggah Modul"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
