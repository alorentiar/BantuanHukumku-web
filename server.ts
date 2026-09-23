import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// API endpoint for AI Legal Consultation (Tanya Hukumku)
app.post('/api/tanya-hukum', async (req: Request, res: Response) => {
  const { question } = req.body;
  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Pertanyaan tidak boleh kosong.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Anda adalah Asisten Pakar Hukum Indonesia untuk aplikasi "Bantuan Hukumku" (Panduan & Basis Data Peraturan Perundang-undangan Indonesia).

Tugas Anda:
Jawablah pertanyaan hukum berikut secara jelas, edukatif, berempati, objektif, dan terstruktur dalam Bahasa Indonesia yang baik dan mudah dipahami oleh masyarakat umum.

Instruksi Khusus:
1. Rujuklah peraturan perundang-undangan Indonesia yang berlaku (misalnya: UUD 1945, UU ITE No. 1/2024, UU Perlindungan Konsumen No. 8/1999, PP No. 35/2021 Ketenagakerjaan & PHK, UU Perkawinan No. 1/1974 jo UU 16/2019, UU Bantuan Hukum No. 16/2011, KUHP, atau KUHAP).
2. Sebutkan nomor pasal yang relevan beserta penjelasannya secara ringkas.
3. Berikan langkah taktis atau solusi hukum praktis (misalnya: musyawarah bipartit, lapor Posbakum Pengadilan Negeri jika tidak mampu, lapor BPSK, atau membuat pengaduan resmi).
4. Di akhir, sertakan selalu penegasan disclaimer singkat: "Jawaban ini merupakan informasi edukasi rujukan hukum, bukan pengganti nasihat hukum resmi dari advokat berlisensi."

Pertanyaan Pengguna:
"${question}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const answerText = response.text || '';

      // Extract detected pasal references to render interactive links
      const links: { pasalId: string; label: string }[] = [];
      const lowerQ = question.toLowerCase();

      if (lowerQ.includes('phk') || lowerQ.includes('pesangon') || lowerQ.includes('kerja')) {
        links.push({
          pasalId: 'reg_5_pp_2021_bab_1_pasal_1_Pasal_40',
          label: 'PP 35/2021 - Pasal 40 (Uang Pesangon & Kompensasi PHK)',
        });
      }
      if (lowerQ.includes('ite') || lowerQ.includes('nama baik') || lowerQ.includes('bohong') || lowerQ.includes('pencemaran')) {
        links.push({
          pasalId: 'reg_3_uu_2024_bab_1_pasal_1_Pasal_27',
          label: 'UU No. 1/2024 (UU ITE) - Pasal 27 & 27A (Pencemaran Nama Baik)',
        });
        links.push({
          pasalId: 'reg_3_uu_2024_bab_1_pasal_2_Pasal_28',
          label: 'UU No. 1/2024 (UU ITE) - Pasal 28 (Berita Bohong & Kerugian)',
        });
      }
      if (lowerQ.includes('konsumen') || lowerQ.includes('rusak') || lowerQ.includes('cacat')) {
        links.push({
          pasalId: 'reg_4_uu_1999_bab_1_pasal_1_Pasal_4',
          label: 'UU No. 8/1999 - Pasal 4 (Hak Konsumen & Ganti Rugi)',
        });
      }
      if (lowerQ.includes('posbakum') || lowerQ.includes('bantuan hukum') || lowerQ.includes('gratis') || lowerQ.includes('pengacara')) {
        links.push({
          pasalId: 'reg_1_uud_1945_1945_bab_10_pasal_4_Pasal_28D',
          label: 'UUD 1945 - Pasal 28D (Hak Perlindungan & Kepastian Hukum yang Adil)',
        });
      }
      if (lowerQ.includes('kawin') || lowerQ.includes('nikah') || lowerQ.includes('cerai')) {
        links.push({
          pasalId: 'reg_6_uu_1974_bab_1_pasal_1_Pasal_2',
          label: 'UU Perkawinan No. 1/1974 - Pasal 2 (Syarat Sah Perkawinan)',
        });
      }

      return res.json({
        answer: answerText,
        pasalLinks: links,
      });
    } catch (err: any) {
      console.warn('Gemini API call failed, falling back to rule-based legal logic:', err?.message);
    }
  }

  // Fallback if no API key or API call threw an error
  const fallback = getRuleBasedLegalResponse(question);
  return res.json(fallback);
});

function getRuleBasedLegalResponse(q: string) {
  const query = q.toLowerCase();

  if (query.includes('phk') || query.includes('pesangon') || query.includes('kerja')) {
    return {
      answer: `Berdasarkan Peraturan Pemerintah (PP) No. 35 Tahun 2021 tentang PKWT, Alih Daya, Waktu Kerja dan Istirahat, dan Pemutusan Hubungan Kerja (PHK):\n\n1. Komponen Hak Pekerja Ter-PHK:\n   - Uang Pesangon (UP)\n   - Uang Penghargaan Masa Kerja (UPMK)\n   - Uang Penggantian Hak (UPH) atas sisa cuti tahunan dan ongkos kepulangan.\n\n2. Perhitungan Uang Pesangon (Pasal 40 ayat 2):\n   - Masa kerja < 1 tahun: 1 bulan upah\n   - Masa kerja 1 s.d < 2 tahun: 2 bulan upah\n   - Masa kerja seterusnya bertambah 1 bulan upah per tahun hingga maksimal 9 bulan upah untuk masa kerja 8 tahun atau lebih.\n\n3. Prosedur Hukum:\n   Pengusaha dilarang memutuskan hubungan kerja tanpa pemberitahuan tertulis dan proses perundingan bipartit. Jika tidak tercapai kesepakatan, diselesaikan melalui mediasi Disnaker atau Pengadilan Hubungan Industrial (PHI).\n\n*Disclaimer: Referensi edukasi peraturan, bukan pengganti nasihat advokat berlisensi.*`,
      pasalLinks: [
        {
          pasalId: 'reg_5_pp_2021_bab_1_pasal_1_Pasal_40',
          label: 'PP 35/2021 - Pasal 40 (Uang Pesangon, UPMK & Penggantian Hak)',
        },
      ],
    };
  }

  if (query.includes('ite') || query.includes('nama baik') || query.includes('bohong') || query.includes('pencemaran') || query.includes('fitnah')) {
    return {
      answer: `Berdasarkan UU No. 1 Tahun 2024 tentang Perubahan Kedua UU ITE:\n\n1. Pencemaran Nama Baik (Pasal 27A):\n   Setiap orang dengan sengaja menyerang kehormatan atau nama baik orang lain dengan menuduhkan suatu hal melalui Sistem Elektronik dengan maksud agar diketahui umum diancam pidana penjara paling lama 2 tahun atau denda paling banyak Rp400 juta.\n\n2. Pengecualian:\n   Tindak pidana gugur apabila dilakukan demi kepentingan umum atau karena terpaksa untuk membela diri.\n\n3. Sifat Delik Aduan:\n   Perkara hanya dapat dituntut jika ada pengaduan dari korban langsung yang nama baiknya dicemarkan.\n\n4. Berita Bohong (Pasal 28):\n   Penyebaran hoaks yang menimbulkan kerugian konsumen transaksi elektronik diancam pidana Pasal 45A.\n\n*Disclaimer: Referensi edukasi peraturan, bukan pengganti nasihat advokat berlisensi.*`,
      pasalLinks: [
        {
          pasalId: 'reg_3_uu_2024_bab_1_pasal_1_Pasal_27',
          label: 'UU No. 1/2024 (UU ITE) - Pasal 27 & 27A',
        },
        {
          pasalId: 'reg_3_uu_2024_bab_1_pasal_2_Pasal_28',
          label: 'UU No. 1/2024 (UU ITE) - Pasal 28',
        },
      ],
    };
  }

  if (query.includes('posbakum') || query.includes('bantuan hukum') || query.includes('gratis') || query.includes('cuma') || query.includes('pengacara')) {
    return {
      answer: `Berdasarkan UU No. 16 Tahun 2011 tentang Bantuan Hukum dan UU Advokat (UU 18/2003):\n\n1. Hak Pro Bono:\n   Masyarakat tidak mampu yang berhadapan dengan masalah hukum pidana, perdata, atau TUN berhak mendapatkan bantuan hukum bebas biaya dari Pos Bantuan Hukum (Posbakum) di Pengadilan Negeri atau Organisasi Bantuan Hukum (OBH) terakreditasi Kemenkumham.\n\n2. Dokumen Persyaratan:\n   - KTP / KK pemohon\n   - Surat Keterangan Tidak Mampu (SKTM) dari Lurah/Desa atau kartu jaminan sosial (KIS/KIP/PKH)\n   - Dokumen perkara terkait.\n\n3. Pendampingan Pidana (Pasal 54 KUHAP):\n   Tersangka berhak didampingi penasihat hukum sejak awal pemeriksaan di kepolisian.\n\n*Disclaimer: Referensi edukasi peraturan, bukan pengganti nasihat advokat berlisensi.*`,
      pasalLinks: [
        {
          pasalId: 'reg_1_uud_1945_1945_bab_10_pasal_4_Pasal_28D',
          label: 'UUD 1945 - Pasal 28D (Jaminan Kepastian Hukum yang Adil)',
        },
      ],
    };
  }

  return {
    answer: `Pertanyaan Anda: "${q}"\n\nDalam tata hukum Republik Indonesia, setiap warga negara berhak atas perlindungan dan kepastian hukum yang adil (Pasal 28D ayat 1 UUD 1945). Silakan jelajahi pasal-pasal terkait melalui fitur Pencarian atau pelajari susunan peraturan pada menu Hierarki Hukum.\n\n*Disclaimer: Informasi ini adalah edukasi rujukan umum perundang-undangan dan bukan pengganti nasihat advokat berlisensi.*`,
    pasalLinks: [
      {
        pasalId: 'reg_1_uud_1945_1945_bab_10_pasal_4_Pasal_28D',
        label: 'UUD 1945 - Pasal 28D (Hak Kepastian Hukum)',
      },
    ],
  };
}

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server Bantuan Hukumku berjalan pada port ${PORT}`);
  });
}

startServer();
