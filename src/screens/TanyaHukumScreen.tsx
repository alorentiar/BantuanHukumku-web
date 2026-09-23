import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Scale,
  Bot,
  User,
  ExternalLink,
  ShieldAlert,
  Loader2,
  RefreshCw,
  BookOpen,
} from 'lucide-react';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  pasalLinks?: { pasalId: string; label: string }[];
  timestamp: string;
}

interface TanyaHukumScreenProps {
  onSelectPasal: (pasalId: string) => void;
  onOpenDisclaimer: () => void;
}

export const TanyaHukumScreen: React.FC<TanyaHukumScreenProps> = ({
  onSelectPasal,
  onOpenDisclaimer,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      content:
        'Halo! Saya Asisten Edukasi Bantuan Hukumku. Anda dapat menanyakan permasalahan hukum sehari-hari di Indonesia (seperti ketenagakerjaan/PHK, UU ITE/pencemaran nama baik, perlindungan konsumen, perkawinan, hak bantuan hukum cuma-cuma Posbakum, atau hierarki perundang-undangan).\n\nSilakan ajukan pertanyaan atau pilih topik di bawah untuk memulai.',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const samplePrompts = [
    {
      title: 'Pesangon & Hak PHK',
      text: 'Apa saja hak uang pesangon dan kompensasi pekerja jika terjadi PHK berdasarkan PP No. 35 Tahun 2021?',
    },
    {
      title: 'Pencemaran Nama Baik di Medsos',
      text: 'Bagaimana ketentuan pasal pencemaran nama baik dan fitnah di media sosial dalam UU ITE terbaru (UU No. 1 Tahun 2024)?',
    },
    {
      title: 'Cara Minta Pengacara Gratis',
      text: 'Bagaimana cara dan syarat bagi masyarakat tidak mampu untuk mendapatkan bantuan hukum cuma-cuma di Posbakum Pengadilan?',
    },
    {
      title: 'Syarat Sah Perkawinan',
      text: 'Apa saja syarat sah perkawinan dan batas usia menikah menurut Undang-Undang Nomor 1 Tahun 1974 jo UU 16/2019?',
    },
    {
      title: 'Hak Konsumen Barang Rusak',
      text: 'Jika saya membeli barang cacat atau tidak sesuai yang dijanjikan, apa hak konsumen menurut UU No. 8 Tahun 1999?',
    },
  ];

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = {
      id: `user_${Date.now()}`,
      sender: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/tanya-hukum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmed }),
      });

      if (!response.ok) {
        throw new Error('Server error');
      }

      const data = await response.json();
      const assistantMsg: Message = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        content: data.answer || 'Mohon maaf, terjadi kendala saat memproses jawaban hukum.',
        pasalLinks: data.pasalLinks,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      // Offline fallback: provide smart offline legal guidance based on keywords
      const offlineAnswer = generateOfflineLegalAnswer(trimmed);
      const assistantMsg: Message = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        content: offlineAnswer.text,
        pasalLinks: offlineAnswer.links,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0F2B48] via-[#16385d] to-[#0A1D33] p-6 sm:p-8 text-white shadow-lg">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Asisten Edukasi &amp; Konsultasi Hukum Cerdas</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif-legal">
            Tanya Hukumku AI
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            Dapatkan panduan edukatif mengenai rujukan pasal peraturan perundang-undangan Indonesia
            secara mudah, akurat, dan terstruktur.
          </p>
        </div>
      </div>

      <DisclaimerBanner onLearnMore={onOpenDisclaimer} />

      {/* Chat Container */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col min-h-[500px] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[600px]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs ${
                  msg.sender === 'user'
                    ? 'bg-[#0F2B48] text-white shadow-xs'
                    : 'bg-amber-100 text-amber-900 border border-amber-300/60'
                }`}
              >
                {msg.sender === 'user' ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4 text-[#0F2B48]" />
                )}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-[#0F2B48] text-white rounded-tr-none'
                    : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-none font-serif-legal'
                }`}
              >
                <div className="whitespace-pre-line">{msg.content}</div>

                {/* Relevant pasal reference chips */}
                {msg.pasalLinks && msg.pasalLinks.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-slate-200/60">
                    <span className="text-[11px] font-sans font-bold text-slate-600 block mb-1.5 flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                      Rujukan Pasal Terkait:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.pasalLinks.map((link, idx) => (
                        <button
                          key={idx}
                          onClick={() => onSelectPasal(link.pasalId)}
                          className="font-sans inline-flex items-center gap-1 text-[11px] font-semibold bg-white border border-blue-200 text-blue-800 hover:bg-blue-50 px-2.5 py-1 rounded-lg shadow-2xs transition-colors"
                        >
                          <span>{link.label}</span>
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  className={`mt-2 text-[10px] text-right ${
                    msg.sender === 'user' ? 'text-slate-300' : 'text-slate-400 font-sans'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-900 border border-amber-300/60">
                <Bot className="h-4 w-4 text-[#0F2B48]" />
              </div>
              <div className="rounded-2xl rounded-tl-none bg-slate-50 border border-slate-200/80 p-4 text-xs text-slate-600 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-[#0F2B48]" />
                <span>Menganalisis perundang-undangan dan merumuskan jawaban...</span>
              </div>
            </div>
          )}
        </div>

        {/* Sample Prompt Chips if conversation is short */}
        {messages.length <= 2 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Pertanyaan yang Sering Diajukan:
            </span>
            <div className="flex flex-wrap gap-2">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(p.text)}
                  className="text-left text-xs bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl px-3 py-1.5 transition-colors shadow-2xs font-medium"
                >
                  &ldquo;{p.title}&rdquo;
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tanyakan hal hukum apa saja (contoh: 'Apa hak saya jika di-PHK sepihak?')..."
              disabled={isLoading}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0F2B48]"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0F2B48] text-white transition-all hover:bg-[#16385d] disabled:opacity-40 disabled:hover:bg-[#0F2B48] shadow-xs"
              aria-label="Kirim pertanyaan hukum"
            >
              <Send className="h-4 w-4 text-amber-400" />
            </button>
          </form>
          <p className="mt-2 text-[10px] text-slate-400 text-center">
            *Asisten AI ini disajikan untuk edukasi hukum dan rujukan perundang-undangan, bukan nasihat hukum formal advokat.
          </p>
        </div>
      </div>
    </div>
  );
};

// Fallback intelligent responder based on local Indonesian regulations database
function generateOfflineLegalAnswer(q: string): {
  text: string;
  links?: { pasalId: string; label: string }[];
} {
  const query = q.toLowerCase();

  if (query.includes('phk') || query.includes('pesangon') || query.includes('kerja')) {
    return {
      text: `Berdasarkan Peraturan Pemerintah (PP) No. 35 Tahun 2021 tentang PKWT, Alih Daya, Waktu Kerja, dan Pemutusan Hubungan Kerja (PHK):\n\n1. Kompensasi PHK terdiri dari:\n   - Uang Pesangon (UP)\n   - Uang Penghargaan Masa Kerja (UPMK)\n   - Uang Penggantian Hak (UPH) seperti sisa cuti tahunan dan ongkos kepulangan.\n2. Besaran pesangon dihitung berjenjang berdasarkan masa kerja (mulai dari 1 bulan upah untuk kerja kurang dari 1 tahun hingga maksimal 9 bulan upah untuk masa kerja 8 tahun atau lebih).\n3. Pengusaha dilarang melakukan PHK secara sepihak tanpa melalui mekanisme musyawarah bipartit atau penetapan Pengadilan Hubungan Industrial (PHI).`,
      links: [
        {
          pasalId: 'reg_5_pp_2021_bab_1_pasal_1_Pasal_40',
          label: 'PP 35/2021 - Pasal 40 (Uang Pesangon & UPMK)',
        },
      ],
    };
  }

  if (
    query.includes('pencemaran') ||
    query.includes('nama baik') ||
    query.includes('ite') ||
    query.includes('hoax') ||
    query.includes('bohong')
  ) {
    return {
      text: `Mengenai pencemaran nama baik dan penyebaran berita di media elektronik, ketentuan diatur dalam UU No. 1 Tahun 2024 tentang Perubahan Kedua UU ITE:\n\n1. Pasal 27A: Mengatur tindak pidana menyerang kehormatan atau nama baik seseorang dengan menuduhkan suatu hal melalui sistem elektronik.\n2. Pengecualian Pidana: Perbuatan tidak dipidana jika dilakukan demi kepentingan umum atau untuk membela diri.\n3. Sifat Delik Aduan: Tindak pidana pencemaran nama baik merupakan delik aduan absolut (hanya bisa diproses jika korban yang merasa dirugikan sendiri yang melapor).\n4. Berita Bohong (Pasal 28): Menyebarkan berita bohong yang menimbulkan kerusuhan masyarakat atau kerugian konsumen diancam sanksi pidana tersendiri.`,
      links: [
        {
          pasalId: 'reg_3_uu_2024_bab_1_pasal_1_Pasal_27',
          label: 'UU No. 1/2024 (ITE) - Pasal 27 & 27A',
        },
        {
          pasalId: 'reg_3_uu_2024_bab_1_pasal_2_Pasal_28',
          label: 'UU No. 1/2024 (ITE) - Pasal 28',
        },
      ],
    };
  }

  if (query.includes('konsumen') || query.includes('cacat') || query.includes('rusak')) {
    return {
      text: `Berdasarkan Undang-Undang No. 8 Tahun 1999 tentang Perlindungan Konsumen:\n\n1. Hak Konsumen (Pasal 4): Konsumen berhak atas kenyamanan, keamanan, keselamatan, informasi yang benar, jelas, dan jujur, serta hak untuk mendapatkan ganti rugi jika barang/jasa tidak sesuai.\n2. Kewajiban Pelaku Usaha (Pasal 7): Pelaku usaha wajib beritikad baik, memberikan kompensasi ganti rugi, dan menjamin mutu barang yang diproduksi/diperdagangkan.\n3. Jalur Penyelesaian: Sengketa konsumen dapat diselesaikan melalui Badan Penyelesaian Sengketa Konsumen (BPSK) atau melalui peradilan umum.`,
      links: [
        {
          pasalId: 'reg_4_uu_1999_bab_1_pasal_1_Pasal_4',
          label: 'UU 8/1999 - Pasal 4 (Hak Konsumen)',
        },
      ],
    };
  }

  if (
    query.includes('posbakum') ||
    query.includes('gratis') ||
    query.includes('cuma') ||
    query.includes('pengacara')
  ) {
    return {
      text: `Berdasarkan UU No. 16 Tahun 2011 tentang Bantuan Hukum dan UU Advokat (UU 18/2003):\n\n1. Pos Bantuan Hukum (Posbakum): Berada di setiap Pengadilan Negeri (PN) dan Pengadilan Agama (PA) untuk melayani masyarakat miskin tanpa biaya.\n2. Dokumen yang Diperlukan:\n   - KTP atau Kartu Keluarga\n   - Surat Keterangan Tidak Mampu (SKTM) dari Kelurahan/Desa, atau kartu jaminan sosial (KIS/KIP/PKH)\n   - Dokumen perkara hukum yang dihadapi.\n3. Hak Tersangka (Pasal 54 KUHAP): Setiap orang berhak didampingi penasihat hukum sejak awal penyidikan kepolisian. Untuk tindak pidana dengan ancaman hukuman 5 tahun ke atas, negara wajib menunjuk advokat cuma-cuma jika tersangka tidak mampu.`,
      links: [
        {
          pasalId: 'reg_1_uud_1945_1945_bab_10_pasal_4_Pasal_28D',
          label: 'UUD 1945 - Pasal 28D (Jaminan Perlindungan Hukum yang Adil)',
        },
      ],
    };
  }

  if (query.includes('nikah') || query.includes('kawin') || query.includes('cerai')) {
    return {
      text: `Berdasarkan UU No. 1 Tahun 1974 jo UU No. 16 Tahun 2019 tentang Perkawinan:\n\n1. Syarat Sah (Pasal 2): Perkawinan sah apabila dilakukan menurut hukum masing-masing agamanya dan kepercayaannya itu, serta dicatat menurut peraturan perundang-undangan (KUA bagi muslim, Catatan Sipil bagi non-muslim).\n2. Usia Menikah: Batas minimal usia pernikahan bagi pria maupun wanita adalah 19 tahun.\n3. Perceraian: Hanya dapat dilakukan di depan sidang Pengadilan setelah pengadilan berusaha mendamaikan kedua belah pihak dan terdapat alasan yang sah menurut hukum.`,
      links: [
        {
          pasalId: 'reg_6_uu_1974_bab_1_pasal_1_Pasal_2',
          label: 'UU Perkawinan - Pasal 2 (Keabsahan Perkawinan)',
        },
      ],
    };
  }

  // Generic fallback
  return {
    text: `Pertanyaan Anda: "${q}".\n\nDalam hukum positif Republik Indonesia, setiap subjek hukum dilindungi oleh asas legalitas (Pasal 1 ayat 1 KUHP) dan asas persamaan di depan hukum (Pasal 28D ayat 1 UUD 1945).\n\nUntuk meneliti lebih lanjut, silakan telusuri kata kunci spesifik melalui tab Pencarian Peraturan, atau buka tab Hierarki Hukum untuk mempelajari tingkatan peraturan yang relevan. Jika menghadapi perkara litigasi aktif, kami sarankan berkonsultasi langsung dengan Posbakum di Pengadilan Negeri terdekat atau advokat berlisensi.`,
    links: [
      {
        pasalId: 'reg_1_uud_1945_1945_bab_10_pasal_4_Pasal_28D',
        label: 'UUD 1945 - Pasal 28D (Hak Kepastian Hukum)',
      },
    ],
  };
}
