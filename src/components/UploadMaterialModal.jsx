import { useState } from "react";
import { uploadMaterialApi } from "../services/apiService";

// ============================================================
// MODULE FORM ENTRY — SRS-FORM-01 (Unggah Materi Privat)
//
// Mencakup:
//  - Validasi form sisi klien (judul wajib diisi, file wajib .pdf)
//  - Event handling interaktif (submit, batal, tutup)
//  - Umpan balik visual (pesan error per-field & status pengiriman)
//  - Simulasi asinkron API (loading / success / error) lewat apiService
// ============================================================

const initialForm = { title: "", file: null };

export default function UploadMaterialModal({ open, onClose }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitState, setSubmitState] = useState({ status: "idle" });

  if (!open) return null;

  function validate(values) {
    const nextErrors = {};
    if (!values.title.trim()) {
      nextErrors.title = "Judul dokumen wajib diisi.";
    } else if (values.title.trim().length < 5) {
      nextErrors.title = "Judul minimal 5 karakter.";
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
      await uploadMaterialApi({ title: form.title, fileName: form.file.name });
      setSubmitState({ status: "success" });
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
          <h3 className="font-bold text-gray-900 text-sm">Upload Materi Privat (Opsional)</h3>
          <button
            onClick={resetAndClose}
            aria-label="Tutup Modal Upload"
            className="text-gray-400 hover:text-gray-600 font-bold text-lg"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="docTitle" className="block text-xs font-semibold text-gray-700 mb-1">
              Judul Catatan / Dokumen Privat
            </label>
            <input
              id="docTitle"
              type="text"
              placeholder="Contoh: Catatan Tambahan Kuliah Pertemuan 3"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className={`w-full border rounded-lg p-2 text-xs focus:ring-blue-500 focus:border-blue-500 ${
                errors.title ? "border-rose-400" : "border-gray-300"
              }`}
            />
            {errors.title && <p className="text-[11px] text-rose-600 mt-1">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="docFile" className="block text-xs font-semibold text-gray-700 mb-1">
              Pilih File PDF
            </label>
            <input
              id="docFile"
              type="file"
              accept=".pdf"
              onChange={(e) => setForm((f) => ({ ...f, file: e.target.files?.[0] ?? null }))}
              className={`w-full border rounded-lg p-2 text-xs text-gray-600 bg-gray-50 ${
                errors.file ? "border-rose-400" : "border-gray-300"
              }`}
            />
            <p className="text-[10px] text-gray-500 mt-1">
              Dokumen ini bersifat privat dan hanya bisa diakses oleh akun Anda.
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
              Dokumen berhasil diunggah &amp; diindeks oleh RAG Engine!
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
              {submitState.status === "loading" ? "Mengunggah..." : "Simpan Privat"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
