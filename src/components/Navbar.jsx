import { Link, useLocation } from "react-router-dom";

const ROLE_BADGE = {
  "/": { label: "Pelajar", tone: "bg-blue-100 text-blue-800" },
  "/pengajar": { label: "Pengajar / Admin", tone: "bg-purple-100 text-purple-800" },
  "/kuis": { label: "Kuis Adaptif", tone: "bg-amber-100 text-amber-800" },
};

export default function Navbar() {
  const location = useLocation();
  const badge = ROLE_BADGE[location.pathname] ?? ROLE_BADGE["/"];
  const isTeacher = location.pathname === "/pengajar";

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link to="/" className="text-xl font-bold text-blue-600">
            ExplainMyLesson AI
          </Link>
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded ${badge.tone}`}>
            {badge.label}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          {location.pathname !== "/kuis" && (
            <Link
              to={isTeacher ? "/" : "/pengajar"}
              className="text-sm text-gray-600 hover:text-blue-600 font-medium"
            >
              {isTeacher ? "Ganti Ke Pelajar" : "Ganti Ke Pengajar"}
            </Link>
          )}
          <div
            className={`w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-sm ${
              isTeacher ? "bg-purple-600" : "bg-blue-600"
            }`}
          >
            {isTeacher ? "P" : "R"}
          </div>
        </div>
      </div>
    </header>
  );
}
