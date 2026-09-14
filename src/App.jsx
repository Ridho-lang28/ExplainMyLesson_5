import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import PelajarDashboard from "./pages/PelajarDashboard";
import PengajarDashboard from "./pages/PengajarDashboard";
import KuisAdaptif from "./pages/KuisAdaptif";

// ============================================================
// App.jsx — Root komponen React 19.
// Routing dipisah per modul SRS agar setiap "halaman" lama
// (index.html / pengajar.html / pelajar.html / kuis.html)
// menjadi satu komponen React yang reusable & terstruktur.
// ============================================================

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar />
      {children}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <PelajarDashboard />
            </Layout>
          }
        />
        <Route
          path="/pengajar"
          element={
            <Layout>
              <PengajarDashboard />
            </Layout>
          }
        />
        <Route
          path="/kuis"
          element={
            <Layout>
              <KuisAdaptif />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
