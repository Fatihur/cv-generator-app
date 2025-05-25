// Test function untuk Gemini API
export const testGeminiAPI = async () => {
  const apiKey = 'AIzaSyAnHkzBYFJ5fl70tkzCyqr0gLLiQvdO3Nc';
  const baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: "Explain how AI works in a few words"
          }
        ]
      }
    ]
  };

  try {
    console.log('🧪 Testing Gemini API...');
    console.log('URL:', `${baseURL}?key=${apiKey}`);
    console.log('Request:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(`${baseURL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      return { success: false, error: errorText };
    }

    const data = await response.json();
    console.log('✅ API Response:', JSON.stringify(data, null, 2));

    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const result = data.candidates[0].content.parts[0].text;
      console.log('✅ AI Result:', result);
      return { success: true, result };
    } else {
      console.error('❌ Invalid response structure');
      return { success: false, error: 'Invalid response structure' };
    }
  } catch (error) {
    console.error('❌ Test Error:', error);
    return { success: false, error: error.message };
  }
};

// Test dengan prompt CV
export const testGeminiCV = async () => {
  const apiKey = 'AIzaSyAnHkzBYFJ5fl70tkzCyqr0gLLiQvdO3Nc';
  const baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  const prompt = `Anda adalah asisten penulisan CV profesional yang sangat ahli. Analisis input pengguna dan lakukan sesuai dengan permintaan mereka.

CARA KERJA:
1. Baca dan pahami input pengguna dengan teliti
2. Identifikasi apakah ini permintaan untuk membuat konten baru atau memperbaiki teks yang ada
3. Jika user meminta "tuliskan", "buatkan", "generate" → BUAT konten baru sesuai permintaan
4. Jika user memberikan teks untuk diperbaiki → PERBAIKI teks tersebut
5. Gunakan informasi yang diberikan user sebagai dasar
6. Hasilkan konten yang profesional, menarik, dan sesuai standar CV

INPUT PENGGUNA:
"Saya fresh graduate Teknik Industri dengan magang di bidang supply chain. Tolong tuliskan 'Tentang Saya' yang menarik dalam 3 kalimat, dengan tone semangat dan berorientasi pada pertumbuhan."

INSTRUKSI EKSEKUSI:
- Jika user meminta pembuatan konten (seperti "tuliskan tentang saya", "buatkan summary"), buat konten profesional berdasarkan informasi yang diberikan
- Jika user memberikan teks untuk diperbaiki, tingkatkan kualitas bahasa dan struktur
- Gunakan bahasa Indonesia yang profesional dan formal
- Fokus pada achievement dan value proposition
- Berikan HANYA hasil akhir tanpa penjelasan tambahan

Eksekusi permintaan user sekarang:`;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: prompt
          }
        ]
      }
    ]
  };

  try {
    console.log('🧪 Testing Gemini API with CV prompt...');
    
    const response = await fetch(`${baseURL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      return { success: false, error: errorText };
    }

    const data = await response.json();
    console.log('✅ API Response:', JSON.stringify(data, null, 2));

    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const result = data.candidates[0].content.parts[0].text;
      console.log('✅ CV AI Result:', result);
      return { success: true, result };
    } else {
      console.error('❌ Invalid response structure');
      return { success: false, error: 'Invalid response structure' };
    }
  } catch (error) {
    console.error('❌ Test Error:', error);
    return { success: false, error: error.message };
  }
};

export default { testGeminiAPI, testGeminiCV };
