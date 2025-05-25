// Contoh-contoh input untuk testing AI
export const aiTestExamples = {
  summary: [
    {
      title: "🆕 Permintaan Pembuatan Konten - Fresh Graduate",
      input: "Saya fresh graduate Teknik Industri dengan magang di bidang supply chain. Tolong tuliskan 'Tentang Saya' yang menarik dalam 3 kalimat, dengan tone semangat dan berorientasi pada pertumbuhan.",
      type: "creation",
      expectedOutput: "Lulusan baru Teknik Industri dengan pengalaman magang di bidang supply chain yang memiliki pemahaman mendalam tentang optimasi proses dan manajemen rantai pasok. Memiliki semangat tinggi untuk berkembang dan berkontribusi dalam industri manufaktur dengan menerapkan pengetahuan analitis dan teknis yang telah dipelajari. Berkomitmen untuk terus mengembangkan keahlian dalam perbaikan berkelanjutan dan inovasi operasional untuk menciptakan nilai tambah bagi perusahaan."
    },
    {
      title: "🔧 Perbaikan Teks Existing - Developer",
      input: "Saya developer dengan 3 tahun pengalaman di React dan Node.js. Pernah buat aplikasi e-commerce dan sistem manajemen. Ingin fokus ke full-stack development.",
      type: "improvement",
      expectedOutput: "Software Developer berpengalaman dengan 3 tahun keahlian dalam React dan Node.js, telah mengembangkan aplikasi e-commerce dan sistem manajemen yang kompleks. Memiliki track record dalam membangun solusi full-stack yang scalable dan user-friendly. Berfokus pada pengembangan karir sebagai Full-Stack Developer dengan komitmen untuk menghadirkan inovasi teknologi terdepan."
    },
    {
      title: "🆕 Permintaan Pembuatan - Marketing Specialist",
      input: "Buatkan professional summary untuk marketing specialist dengan 2 tahun pengalaman digital marketing, pernah handle social media dan Google Ads, bisa analisis data.",
      type: "creation",
      expectedOutput: "Marketing Specialist dengan 2 tahun pengalaman dalam digital marketing yang telah berhasil mengelola campaign social media dan Google Ads dengan hasil yang terukur. Memiliki keahlian dalam analisis data untuk optimasi performa marketing dan pengembangan strategi yang data-driven. Berfokus pada inovasi marketing digital dan penggunaan teknologi terbaru untuk mencapai target bisnis yang optimal."
    }
  ],

  experience: [
    {
      title: "Pengalaman Magang",
      input: "Magang di PT ABC selama 6 bulan sebagai supply chain intern. Bantu analisis inventory, buat laporan mingguan, dan ikut meeting dengan vendor.",
      expectedImprovement: "Supply Chain Intern di PT ABC (6 bulan) - Melakukan analisis inventory untuk optimasi stok dan mengurangi waste, menyusun laporan mingguan yang komprehensif untuk manajemen, dan berpartisipasi aktif dalam meeting koordinasi dengan vendor untuk memastikan kelancaran supply chain."
    },
    {
      title: "Pengalaman Kerja Developer",
      input: "Kerja sebagai frontend developer di startup teknologi. Buat website company profile dan aplikasi internal. Pakai React, TypeScript, dan Tailwind CSS.",
      expectedImprovement: "Frontend Developer di startup teknologi - Mengembangkan website company profile yang responsive dan aplikasi internal untuk meningkatkan efisiensi operasional. Menggunakan teknologi modern seperti React, TypeScript, dan Tailwind CSS untuk menciptakan user interface yang optimal dan maintainable."
    }
  ],

  skills: [
    {
      title: "Data Scientist",
      input: "Data Scientist",
      expectedSkills: [
        "Python, R, SQL",
        "Machine Learning, Deep Learning",
        "Data Visualization",
        "Statistical Analysis",
        "Problem Solving",
        "Communication"
      ]
    },
    {
      title: "Digital Marketing",
      input: "Digital Marketing Specialist",
      expectedSkills: [
        "Google Ads, Facebook Ads",
        "SEO, SEM",
        "Social Media Management",
        "Analytics Tools",
        "Creative Thinking",
        "Data Analysis"
      ]
    }
  ]
};

// Function untuk test AI dengan contoh-contoh di atas
export const testAIWithExamples = async (aiService) => {
  console.log("🧪 Testing AI Service with examples...");

  for (const example of aiTestExamples.summary) {
    console.log(`\n📝 Testing: ${example.title}`);
    console.log(`Input: ${example.input}`);

    try {
      const result = await aiService.generateContent('improve', example.input);
      console.log(`✅ AI Result: ${result}`);
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
};

export default aiTestExamples;
