import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser
  app.use(express.json());

  // API Route for Gemini TP suggestions
  app.post('/api/generate-tps', async (req, res) => {
    try {
      const { cp, fase, kelas, subject } = req.body;

      if (!cp) {
        return res.status(400).json({ error: 'Capaian Pembelajaran (CP) is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        // Fallback if no real API key is configured yet
        return res.json({
          fallback: true,
          message: 'API Key Gemini belum dikonfigurasi. Menggunakan generator cerdas lokal.',
          tps: [
            {
              text: `Memahami konsep dasar ${subject} sesuai Fase ${fase} Kelas ${kelas}.`,
              jp: 12,
              deepLearning: {
                profileDimensions: ['Berpikir Kritis', 'Mandiri'],
                principles: ['Bermakna'],
                experiences: ['Memahami']
              }
            },
            {
              text: `Menganalisis dan mengaplikasikan materi ${subject} dalam kehidupan sehari-hari.`,
              jp: 16,
              deepLearning: {
                profileDimensions: ['Kreatif', 'Kolaboratif'],
                principles: ['Bermakna', 'Menggembirakan'],
                experiences: ['Mengaplikasikan']
              }
            },
            {
              text: `Merefleksikan hasil pembelajaran ${subject} untuk perbaikan berkelanjutan.`,
              jp: 8,
              deepLearning: {
                profileDimensions: ['Berpikir Kritis', 'Komunikatif'],
                principles: ['Berkesadaran (Mindful)'],
                experiences: ['Merefleksi']
              }
            }
          ]
        });
      }

      // Initialize Gemini SDK safely
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `
Anda adalah ahli Kurikulum Merdeka Kemdikbud dan Pembelajaran Mendalam (Deep Learning).
Tugas Anda adalah memecah Capaian Pembelajaran (CP) berikut menjadi beberapa Tujuan Pembelajaran (TP) yang logis, sistematis, dan terukur.
Untuk setiap TP, berikan juga usulan Alokasi Jam Pelajaran (JP) dan pemetaan Pembelajaran Mendalam (Deep Learning).

INFORMASI KELAS:
- Mata Pelajaran: ${subject || 'Umum'}
- Fase: ${fase || 'Umum'}
- Kelas: ${kelas || 'Umum'}

CAPAIAN PEMBELAJARAN (CP):
"${cp}"

KERANGKA PEMBELAJARAN MENDALAM YANG HARUS DIPILIH:
- 8 Dimensi Profil Lulusan: ["Iman/Taqwa", "Cinta Tanah Air", "Berpikir Kritis", "Kreatif", "Kolaboratif", "Mandiri", "Sehat", "Komunikatif"]
- 3 Prinsip Pembelajaran: ["Berkesadaran (Mindful)", "Bermakna", "Menggembirakan"]
- 3 Pengalaman Belajar: ["Memahami", "Mengaplikasikan", "Merefleksi"]

Format output HARUS berupa JSON valid dengan struktur array seperti berikut, tanpa markdown block tambahan selain JSON yang valid:
[
  {
    "text": "Kalimat Tujuan Pembelajaran (TP) yang jelas dan berfokus pada kompetensi",
    "jp": 12, // angka usulan Jam Pelajaran
    "deepLearning": {
      "profileDimensions": ["Berpikir Kritis", "Kreatif"], // pilih dari 8 dimensi di atas
      "principles": ["Bermakna"], // pilih dari 3 prinsip di atas
      "experiences": ["Mengaplikasikan"] // pilih dari 3 pengalaman belajar di atas
    }
  }
]

Pastikan TP diurutkan dari yang paling dasar/mudah ke yang lebih kompleks. Anda HARUS menghasilkan minimal 15 TP (antara 15 sampai 20 TP) yang sangat rinci, komprehensif, dan mendalam agar mencakup seluruh materi dalam Capaian Pembelajaran tersebut. Jangan dikelompokkan atau diringkas, uraikan seluruh kompetensi menjadi minimal 15 butir TP terpisah.
      `;

      // Use gemini-3.5-flash as the standard fast and smart model
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      let responseText = response.text || '';
      responseText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();

      try {
        const tps = JSON.parse(responseText);
        return res.json({ success: true, tps });
      } catch (e) {
        console.error('Failed to parse Gemini response as JSON:', responseText);
        throw new Error('Format respon AI tidak valid.');
      }

    } catch (error: any) {
      console.error('Gemini API Error:', error);
      res.status(500).json({ error: error.message || 'Terjadi kesalahan pada server AI.' });
    }
  });

  // Serve static files / Vite dev middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
