import React, { useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Copy,
  Check,
  Share2,
  FileDown,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Info,
  Type,
} from 'lucide-react';
import { PasalWithDetails } from '../types/legal';
import { exportPasalToPdf } from '../utils/pdfExporter';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

interface PasalDetailScreenProps {
  details: PasalWithDetails;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onBack: () => void;
  onNavigatePasal: (pasalId: string) => void;
  prevPasal?: { id: string; label: string };
  nextPasal?: { id: string; label: string };
  onOpenDisclaimer: () => void;
}

export const PasalDetailScreen: React.FC<PasalDetailScreenProps> = ({
  details,
  isBookmarked,
  onToggleBookmark,
  onBack,
  onNavigatePasal,
  prevPasal,
  nextPasal,
  onOpenDisclaimer,
}) => {
  const { peraturan, bab, pasal } = details;
  const [copiedAyatIdx, setCopiedAyatIdx] = useState<number | null>(null);
  const [copiedFull, setCopiedFull] = useState(false);
  const [fontSizeLevel, setFontSizeLevel] = useState<'sm' | 'base' | 'lg'>('base');

  const copyToClipboard = async (text: string, ayatIdx?: number) => {
    try {
      await navigator.clipboard.writeText(text);
      if (ayatIdx !== undefined) {
        setCopiedAyatIdx(ayatIdx);
        setTimeout(() => setCopiedAyatIdx(null), 2000);
      } else {
        setCopiedFull(true);
        setTimeout(() => setCopiedFull(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  const handleShare = async () => {
    const title = `${pasal.nomorPasal} - ${peraturan.judul} (${peraturan.nomor})`;
    let text = `${title}\n${bab.nomorBab}: ${bab.judulBab}\n\n`;

    pasal.ayats.forEach((a) => {
      const label = a.nomorAyat > 0 ? `Ayat (${a.labelAyat}): ` : '';
      text += `${label}${a.isiAyat}\n\n`;
    });

    if (pasal.penjelasans && pasal.penjelasans.length > 0) {
      text += `PENJELASAN:\n`;
      pasal.penjelasans.forEach((p) => {
        text += `${p.nomorPenjelasan}: ${p.isiPenjelasan}\n`;
      });
      text += '\n';
    }

    text += `*Sumber: Bantuan Hukumku (Referensi hukum informatif)*`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
        });
      } catch {
        // Shared cancelled or unsupported
      }
    } else {
      // Open WhatsApp or copy to clipboard
      const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleExportPdf = () => {
    exportPasalToPdf(details);
  };

  const fontSizeClass = {
    sm: 'text-xs md:text-sm leading-relaxed',
    base: 'text-sm md:text-base leading-relaxed',
    lg: 'text-base md:text-lg leading-relaxed',
  }[fontSizeLevel];

  return (
    <div className="space-y-6">
      {/* Top Navigation & Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-xs"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali</span>
        </button>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Font Size Toggle */}
          <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white p-1 text-xs text-slate-600 shadow-xs">
            <span className="px-1.5 text-[11px] font-bold text-slate-400">Ukuran Teks:</span>
            <button
              onClick={() => setFontSizeLevel('sm')}
              className={`px-2 py-1 rounded-lg font-bold ${
                fontSizeLevel === 'sm' ? 'bg-[#0F2B48] text-white' : 'hover:bg-slate-100'
              }`}
            >
              A-
            </button>
            <button
              onClick={() => setFontSizeLevel('base')}
              className={`px-2 py-1 rounded-lg font-bold ${
                fontSizeLevel === 'base' ? 'bg-[#0F2B48] text-white' : 'hover:bg-slate-100'
              }`}
            >
              A
            </button>
            <button
              onClick={() => setFontSizeLevel('lg')}
              className={`px-2 py-1 rounded-lg font-bold ${
                fontSizeLevel === 'lg' ? 'bg-[#0F2B48] text-white' : 'hover:bg-slate-100'
              }`}
            >
              A+
            </button>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={onToggleBookmark}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all shadow-xs ${
              isBookmarked
                ? 'border-amber-400 bg-amber-50 text-amber-900'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            {isBookmarked ? (
              <>
                <BookmarkCheck className="h-4 w-4 text-amber-600 fill-amber-500" />
                <span>Tersimpan</span>
              </>
            ) : (
              <>
                <Bookmark className="h-4 w-4 text-slate-400" />
                <span>Simpan</span>
              </>
            )}
          </button>

          {/* Copy Full Pasal */}
          <button
            onClick={() => {
              const allText = `${pasal.nomorPasal}\n${pasal.ayats
                .map((a) => (a.nomorAyat > 0 ? `Ayat (${a.labelAyat}): ${a.isiAyat}` : a.isiAyat))
                .join('\n\n')}`;
              copyToClipboard(allText);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-xs"
          >
            {copiedFull ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-700">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-slate-500" />
                <span>Salin Lengkap</span>
              </>
            )}
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-xs"
          >
            <Share2 className="h-4 w-4 text-slate-500" />
            <span>Bagikan</span>
          </button>

          {/* Export PDF */}
          <button
            onClick={handleExportPdf}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0F2B48] text-xs font-semibold text-white hover:bg-[#16385d] transition-colors shadow-sm"
          >
            <FileDown className="h-4 w-4 text-amber-400" />
            <span>Unduh PDF</span>
          </button>
        </div>
      </div>

      {/* Breadcrumb Info Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2">
          <span className="font-semibold text-blue-900 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-md">
            {peraturan.jenis.replace('_', ' ')}
          </span>
          <span>&bull;</span>
          <span className="font-medium text-slate-700">
            {peraturan.judul} ({peraturan.nomor})
          </span>
        </div>

        <div className="text-xs font-bold text-amber-700 uppercase tracking-wide">
          {bab.nomorBab}: {bab.judulBab}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2B48] font-serif-legal mt-1">
          {pasal.nomorPasal}
          {pasal.judulPasal && ` — ${pasal.judulPasal}`}
        </h1>
      </div>

      {/* Ayat List */}
      <div className="space-y-4">
        {pasal.ayats.map((ayat, idx) => (
          <div
            key={idx}
            className="relative rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs transition-shadow hover:shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center rounded-lg bg-[#0F2B48]/5 border border-[#0F2B48]/15 px-3 py-1 text-xs font-bold text-[#0F2B48]">
                {ayat.nomorAyat > 0 ? `Ayat (${ayat.labelAyat})` : 'Teks Lengkap Pasal'}
              </span>

              <button
                onClick={() =>
                  copyToClipboard(
                    `${pasal.nomorPasal} Ayat (${ayat.labelAyat}):\n${ayat.isiAyat}`,
                    idx
                  )
                }
                title="Salin isi ayat ini"
                className="inline-flex items-center gap-1 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 text-xs transition-colors"
              >
                {copiedAyatIdx === idx ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-[11px] font-semibold text-emerald-700">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span className="text-[11px]">Salin</span>
                  </>
                )}
              </button>
            </div>

            <p className={`font-serif-legal text-slate-800 ${fontSizeClass}`}>
              {ayat.isiAyat}
            </p>
          </div>
        ))}
      </div>

      {/* Official Explanation (Penjelasan Resmi) if exists */}
      {pasal.penjelasans && pasal.penjelasans.length > 0 && (
        <div className="rounded-2xl border border-amber-300/80 bg-gradient-to-br from-amber-50/70 to-amber-100/30 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1 rounded-md bg-amber-200 text-amber-900">
              <BookOpen className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-amber-950 uppercase tracking-wide">
              Penjelasan Resmi Pasal (Memorie van Toelichting)
            </h3>
          </div>

          <div className="space-y-3 divide-y divide-amber-200/60">
            {pasal.penjelasans.map((pen, idx) => (
              <div key={idx} className={idx > 0 ? 'pt-3' : ''}>
                <div className="text-xs font-bold text-amber-900 mb-1">
                  {pen.nomorPenjelasan}
                </div>
                <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-serif-legal">
                  {pen.isiPenjelasan}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Previous & Next Pasal Navigator */}
      <div className="flex items-center justify-between pt-2">
        {prevPasal ? (
          <button
            onClick={() => onNavigatePasal(prevPasal.id)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-[#0F2B48] hover:bg-slate-100 shadow-xs transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Sebelumnya: {prevPasal.label}</span>
          </button>
        ) : (
          <div />
        )}

        {nextPasal && (
          <button
            onClick={() => onNavigatePasal(nextPasal.id)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-[#0F2B48] hover:bg-slate-100 shadow-xs transition-all"
          >
            <span>Selanjutnya: {nextPasal.label}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      <DisclaimerBanner onLearnMore={onOpenDisclaimer} />
    </div>
  );
};
