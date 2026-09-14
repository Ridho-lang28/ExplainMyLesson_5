// Komponen kecil & reusable — dipakai di dashboard Pelajar & halaman Kuis.
// Tidak memerlukan useMemo/useCallback manual (React 19 Compiler friendly):
// komponen murni menerima props dan tidak melakukan komputasi berat.

const LEVEL_STYLES = {
  EASY: "bg-blue-100 text-blue-800",
  MEDIUM: "bg-indigo-100 text-indigo-800",
  HARD: "bg-rose-100 text-rose-800",
};

const LEVEL_TEXT = {
  EASY: "Level 1: Mudah",
  MEDIUM: "Level 2: Menengah",
  HARD: "Level 3: Sulit",
};

export default function LevelBadge({ level = "EASY" }) {
  return (
    <span
      className={`text-xs font-bold px-2.5 py-1 rounded ${LEVEL_STYLES[level] ?? LEVEL_STYLES.EASY}`}
    >
      {LEVEL_TEXT[level] ?? LEVEL_TEXT.EASY}
    </span>
  );
}
