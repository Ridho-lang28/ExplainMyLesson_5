// Data domain kuis adaptif (SRS-QUIZ-01)
// Bertindak sebagai "database" tiruan yang nantinya diganti backend nyata.

export const mockQuestions = {
  1: Array.from({ length: 10 }, (_, i) => ({
    id: `q1_${i + 1}`,
    question: `[Level 1 - Soal ${i + 1}] Apa prinsip utama Agile Manifesto?`,
    options: [
      "Individu dan interaksi lebih dari proses dan sarana",
      "Dokumentasi menyeluruh lebih dari perangkat lunak yang berfungsi",
      "Negosiasi kontrak lebih dari kolaborasi pelanggan",
      "Mengikuti rencana lebih dari tanggap terhadap perubahan",
    ],
    correctOption: 0,
    hint: "Utamakan komunikasi antar manusia dibandingkan aturan yang kaku.",
  })),
  2: Array.from({ length: 10 }, (_, i) => ({
    id: `q2_${i + 1}`,
    question: `[Level 2 - Soal ${i + 1}] Siapa yang bertanggung jawab mengelola Product Backlog dalam Scrum?`,
    options: ["Scrum Master", "Product Owner", "Development Team", "Stakeholder"],
    correctOption: 1,
    hint: "Peran ini mewakili suara pengguna dan menentukan prioritas fitur.",
  })),
  3: Array.from({ length: 10 }, (_, i) => ({
    id: `q3_${i + 1}`,
    question: `[Level 3 - Soal ${i + 1}] Bagaimana AI dapat membantu dalam estimasi Sprint Planning?`,
    options: [
      "Menggantikan seluruh anggota tim developer",
      "Menganalisis histori velocity dan kompleksitas tugas secara presisi",
      "Menghapus kebutuhan Daily Standup",
      "Membuat keputusan produk tanpa persetujuan PO",
    ],
    correctOption: 1,
    hint: "AI berperan sebagai asisten berbasis data historis, bukan pengganti peran manusia.",
  })),
};

export const levelLabel = {
  1: "Level 1: Mudah",
  2: "Level 2: Menengah",
  3: "Level 3: Sulit",
};

// Ringkasan progres pemahaman per bab (SRS-DASH-01)
export const chapterProgress = [
  { id: 1, name: "Bab 1: Pengantar Software Engineering", percent: 88, tone: "high" },
  { id: 2, name: "Bab 2: Agile, Scrum & AI Assessment", percent: 58, tone: "warning" },
  { id: 3, name: "Bab 3: Software Requirements & SKPL", percent: 76, tone: "good" },
];

// Daftar pelajar yang perlu bimbingan (SRS-DASH-02)
export const studentsNeedingHelp = [
  { id: "s1", name: "Ridho Asykuri", chapter: "Bab 2", score: 2, outOf: 10 },
  { id: "s2", name: "Siswa B", chapter: "Bab 2", score: 5, outOf: 10 },
];

// Materi publik yang tersedia untuk dipelajari (SRS-FORM-02 dropdown)
export const availableChapters = [
  { value: "1", label: "Bab 1: Pengantar Software Engineering" },
  { value: "2", label: "Bab 2: Agile, Scrum & AI Assessment" },
  { value: "3", label: "Bab 3: Software Requirements & SKPL" },
];

export const aiModes = [
  { value: "ringkasan", icon: "📄", label: "Ringkasan (200 hlm → 2 hlm)" },
  { value: "analogi", icon: "💡", label: "Analogi Sederhana" },
  { value: "mindmap", icon: "🧠", label: "Mind Map / Hierarki" },
  { value: "contoh", icon: "✍️", label: "Contoh Soal & Pembahasan" },
];

// Konten hasil generate AI (RAG/LLM) per kombinasi Bab x Mode (SRS-STUDENT-01)
// Menjadi sumber data untuk fitur "Refresh AI" pada dashboard Pelajar.
export const aiContentLibrary = {
  1: {
    ringkasan: {
      title: "Ringkasan — Bab 1: Pengantar Software Engineering",
      body: [
        "Software Engineering adalah pendekatan sistematis untuk merancang, mengembangkan, dan memelihara perangkat lunak.",
        "Siklus hidup perangkat lunak mencakup analisis kebutuhan, desain, implementasi, pengujian, dan pemeliharaan.",
      ],
    },
    analogi: {
      title: "Analogi Sederhana — Bab 1: Pengantar Software Engineering",
      body: [
        "Bayangkan membangun perangkat lunak seperti membangun rumah: butuh rancangan (desain), fondasi yang kuat (implementasi inti), dan pengecekan kualitas sebelum ditempati (pengujian).",
        "Tanpa tahapan yang jelas, rumah (aplikasi) bisa retak di kemudian hari — sama seperti software yang dibangun tanpa proses SE yang benar akan sulit dipelihara.",
      ],
    },
    mindmap: {
      title: "Mind Map — Bab 1: Pengantar Software Engineering",
      body: [
        "🔹 Software Engineering",
        "  ├─ Analisis Kebutuhan — mengumpulkan apa yang diinginkan pengguna",
        "  ├─ Desain — merancang arsitektur & struktur sistem",
        "  ├─ Implementasi — menulis kode program",
        "  ├─ Pengujian — memastikan sistem bebas dari bug",
        "  └─ Pemeliharaan — perbaikan & pembaruan setelah rilis",
      ],
    },
    contoh: {
      title: "Contoh Soal & Pembahasan — Bab 1: Pengantar Software Engineering",
      body: [
        "Soal: Tahap apa yang bertujuan memastikan perangkat lunak bebas dari kesalahan sebelum dirilis?",
        "Pembahasan: Jawabannya adalah tahap Pengujian (Testing). Tahap ini memverifikasi bahwa perangkat lunak berjalan sesuai spesifikasi kebutuhan yang telah didefinisikan sebelumnya.",
      ],
    },
  },
  2: {
    ringkasan: {
      title: "Ringkasan — Bab 2: Agile, Scrum & AI Assessment",
      body: [
        "Agile adalah metodologi pengembangan perangkat lunak yang berfokus pada iterasi cepat, kolaborasi tim, dan adaptabilitas terhadap perubahan kebutuhan pengguna.",
        "Dalam pembelajaran berbasis AI, RAG (Retrieval-Augmented Generation) membantu membedah dokumen modul panjang menjadi materi ringkas yang mudah dipahami secara personal.",
      ],
    },
    analogi: {
      title: "Analogi Sederhana — Bab 2: Agile, Scrum & AI Assessment",
      body: [
        "Scrum itu seperti memasak dalam porsi kecil bertahap (Sprint), bukan menyiapkan pesta besar sekaligus — supaya lebih mudah dievaluasi dan disesuaikan rasanya di tiap tahap.",
        "Product Owner ibarat kepala koki yang menentukan menu prioritas, sementara Scrum Master menjaga dapur tetap berjalan lancar tanpa hambatan.",
      ],
    },
    mindmap: {
      title: "Mind Map — Bab 2: Agile, Scrum & AI Assessment",
      body: [
        "🔹 Agile & Scrum",
        "  ├─ Sprint — siklus kerja 1–4 minggu",
        "  ├─ Scrum Master — memfasilitasi & menghilangkan hambatan",
        "  ├─ Product Owner — mengelola prioritas backlog",
        "  └─ AI Assessment — RAG meringkas materi panjang jadi ringkas",
      ],
    },
    contoh: {
      title: "Contoh Soal & Pembahasan — Bab 2: Agile, Scrum & AI Assessment",
      body: [
        "Soal: Siapa yang bertanggung jawab mengelola Product Backlog dalam Scrum?",
        "Pembahasan: Jawabannya adalah Product Owner. Peran ini mewakili suara pengguna/bisnis dan menentukan prioritas fitur yang dikerjakan tim.",
      ],
    },
  },
  3: {
    ringkasan: {
      title: "Ringkasan — Bab 3: Software Requirements & SKPL",
      body: [
        "SKPL (Spesifikasi Kebutuhan Perangkat Lunak) mendokumentasikan kebutuhan fungsional dan non-fungsional sebuah sistem.",
        "Kebutuhan yang tertulis jelas menjadi dasar penerjemahan ke komponen UI yang terstruktur.",
      ],
    },
    analogi: {
      title: "Analogi Sederhana — Bab 3: Software Requirements & SKPL",
      body: [
        "SKPL itu seperti cetak biru (blueprint) sebelum membangun gedung — semua kebutuhan ruang dan fungsinya ditulis dulu supaya tukang bangunan (developer) tidak salah membangun.",
        "Kebutuhan fungsional adalah 'apa yang harus dilakukan gedung', sedangkan non-fungsional adalah 'seberapa baik gedung itu bekerja' (misal: tahan gempa, hemat energi).",
      ],
    },
    mindmap: {
      title: "Mind Map — Bab 3: Software Requirements & SKPL",
      body: [
        "🔹 SKPL",
        "  ├─ Kebutuhan Fungsional — fitur & perilaku sistem",
        "  ├─ Kebutuhan Non-Fungsional — performa, keamanan, usability",
        "  └─ Penerjemahan ke UI — struktur komponen mengikuti dokumen SKPL",
      ],
    },
    contoh: {
      title: "Contoh Soal & Pembahasan — Bab 3: Software Requirements & SKPL",
      body: [
        "Soal: Apa perbedaan kebutuhan fungsional dan non-fungsional dalam SKPL?",
        "Pembahasan: Kebutuhan fungsional menjelaskan fitur/perilaku yang harus dilakukan sistem, sedangkan non-fungsional menjelaskan kualitas sistem seperti performa, keamanan, dan kemudahan pakai.",
      ],
    },
  },
};
