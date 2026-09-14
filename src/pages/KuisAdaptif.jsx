import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchQuestionsByLevelApi } from "../services/apiService";
import LevelBadge from "../components/LevelBadge";

// ============================================================
// MODULE DATA TABLE / LIST — SRS-QUIZ-01
//
// Menampilkan daftar (list) soal & opsi jawaban yang di-fetch secara
// asinkron per level, lengkap dengan indikator loading, error state,
// progres, hint AI, dan skor kumulatif.
// ============================================================

const LEVEL_KEY = { 1: "EASY", 2: "MEDIUM", 3: "HARD" };

export default function KuisAdaptif() {
  const navigate = useNavigate();
  const [level, setLevel] = useState(1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState(null); // "Pilih salah satu jawaban!"

  // --- Simulasi Asinkron Data API ---
  const [quizState, setQuizState] = useState({ status: "idle" });

  useEffect(() => {
    let isMounted = true;
    setQuizState({ status: "loading" });
    setQuestionIndex(0);
    setSelectedOption(null);
    setShowHint(false);

    fetchQuestionsByLevelApi(level)
      .then((data) => {
        if (isMounted) setQuizState({ status: "success", data });
      })
      .catch((err) => {
        if (isMounted) setQuizState({ status: "error", message: err.message });
      });

    return () => {
      isMounted = false;
    };
  }, [level]);

  function handleSubmitAnswer() {
    if (quizState.status !== "success") return;
    if (selectedOption === null) {
      setFeedback("Pilih salah satu jawaban!");
      return;
    }

    const currentQuestion = quizState.data[questionIndex];
    if (selectedOption === currentQuestion.correctOption) {
      setScore((s) => s + 10);
    }

    setFeedback(null);
    setSelectedOption(null);
    setShowHint(false);

    const nextIndex = questionIndex + 1;
    if (nextIndex >= quizState.data.length) {
      if (level < 3) {
        setLevel((l) => l + 1);
      } else {
        alert(`Kuis Selesai! Total Skor: ${score + (selectedOption === currentQuestion.correctOption ? 10 : 0)}`);
        navigate("/");
      }
    } else {
      setQuestionIndex(nextIndex);
    }
  }

  function handleExit() {
    if (confirm("Keluar dari kuis?")) navigate("/");
  }

  const totalQuestions = quizState.status === "success" ? quizState.data.length : 10;
  const progressPercent = Math.round(((questionIndex + 1) / totalQuestions) * 100);
  const currentQuestion = quizState.status === "success" ? quizState.data[questionIndex] : null;

  return (
    <main className="max-w-4xl mx-auto px-4 py-6">
      <section className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <LevelBadge level={LEVEL_KEY[level]} />
          <h1 className="text-base font-bold text-gray-900 mt-2">Bab 2: Agile, Scrum &amp; AI Assessment</h1>
        </div>
        <div className="w-full sm:w-48">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progres Soal</span>
            <span>
              Soal {questionIndex + 1} dari {totalQuestions}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        <button
          onClick={handleExit}
          className="text-xs text-gray-500 hover:text-gray-700 font-medium px-3 py-1.5 border rounded-md"
        >
          Keluar Kuis
        </button>
      </section>

      <article className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        {quizState.status === "loading" && (
          <div className="py-10 text-center text-sm text-gray-500 animate-pulse">Memuat soal...</div>
        )}

        {quizState.status === "error" && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium px-4 py-3 rounded-lg">
            Gagal memuat kuis: {quizState.message}
          </div>
        )}

        {quizState.status === "success" && currentQuestion && (
          <>
            <div>
              <h2 className="text-sm font-bold text-gray-900 leading-relaxed">{currentQuestion.question}</h2>
            </div>

            {/* DATA LIST — daftar opsi jawaban */}
            <fieldset>
              <legend className="sr-only">Pilihan Jawaban</legend>
              <div className="space-y-3 text-xs">
                {currentQuestion.options.map((option, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                      selectedOption === idx ? "border-blue-400 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="quiz_option"
                      value={idx}
                      checked={selectedOption === idx}
                      onChange={() => {
                        setSelectedOption(idx);
                        setFeedback(null);
                      }}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2.5 text-gray-800">{option}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <aside className="bg-indigo-50/60 border border-indigo-100 p-4 rounded-lg flex items-start justify-between gap-3">
              <div className="text-xs text-indigo-900">
                <span className="font-bold flex items-center gap-1 text-indigo-700">💡 AI Hint (Petunjuk Asisten)</span>
                <p className="mt-1 text-indigo-800">
                  {showHint ? currentQuestion.hint : "Klik tombol di samping untuk meminta bantuan AI."}
                </p>
              </div>
              <button
                onClick={() => setShowHint(true)}
                className="text-[11px] bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-3 py-1.5 rounded transition whitespace-nowrap"
              >
                Minta Hint AI
              </button>
            </aside>

            <div className="border-t pt-4 flex justify-between items-center">
              <span className="text-xs text-gray-500">
                {feedback ?? `Skor sementara: ${score} poin`}
              </span>
              <button
                onClick={handleSubmitAnswer}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow-sm"
              >
                Jawab & Lanjut
              </button>
            </div>
          </>
        )}
      </article>
    </main>
  );
}
