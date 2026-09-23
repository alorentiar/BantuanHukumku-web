import React from 'react';
import { ChevronRight, Bookmark, BookmarkCheck } from 'lucide-react';
import { SearchResultItem, PeraturanJenis } from '../types/legal';

interface SearchResultCardProps {
  item: SearchResultItem;
  searchTokens: string[];
  isBookmarked: boolean;
  onToggleBookmark: (e: React.MouseEvent) => void;
  onClick: () => void;
}

const getCategoryBadge = (jenis: PeraturanJenis) => {
  switch (jenis) {
    case 'UUD_1945':
      return {
        label: 'UUD 1945',
        bg: 'bg-red-50 text-red-700 border-red-200',
      };
    case 'TAP_MPR':
      return {
        label: 'TAP MPR',
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
      };
    case 'UU':
    case 'PERPPU':
      return {
        label: 'Undang-Undang',
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
      };
    case 'PP':
      return {
        label: 'Peraturan Pemerintah',
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      };
    case 'PERPRES':
      return {
        label: 'Peraturan Presiden',
        bg: 'bg-purple-50 text-purple-700 border-purple-200',
      };
    case 'PERDA_PROV':
      return {
        label: 'Perda Provinsi',
        bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      };
    case 'PERDA_KAB':
      return {
        label: 'Perda Kab/Kota',
        bg: 'bg-teal-50 text-teal-700 border-teal-200',
      };
    default:
      return {
        label: jenis,
        bg: 'bg-slate-100 text-slate-700 border-slate-200',
      };
  }
};

// Helper for highlighting keywords
const renderHighlightedText = (text: string, tokens: string[]) => {
  if (!tokens || tokens.length === 0 || !text) return text;
  const escapedTokens = tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escapedTokens.join('|')})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, i) => {
    const isMatch = tokens.some((t) => t.toLowerCase() === part.toLowerCase());
    return isMatch ? (
      <mark
        key={i}
        className="bg-amber-200 text-amber-950 font-semibold px-0.5 rounded-xs"
      >
        {part}
      </mark>
    ) : (
      part
    );
  });
};

export const SearchResultCard: React.FC<SearchResultCardProps> = ({
  item,
  searchTokens,
  isBookmarked,
  onToggleBookmark,
  onClick,
}) => {
  const badge = getCategoryBadge(item.peraturanJenis);

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-[#0F2B48]/30 hover:shadow-md cursor-pointer text-left"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${badge.bg}`}
          >
            {badge.label}
          </span>
          <span className="text-xs text-slate-500 font-medium">{item.peraturanNomor}</span>
        </div>

        <button
          onClick={onToggleBookmark}
          title={isBookmarked ? 'Hapus Simpanan' : 'Simpan Pasal'}
          className={`rounded-lg p-1.5 transition-colors ${
            isBookmarked
              ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
          }`}
        >
          {isBookmarked ? (
            <BookmarkCheck className="h-4 w-4 fill-amber-500" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="mt-2.5">
        <div className="text-xs text-slate-500 truncate mb-1">
          {item.peraturanJudul} &bull; {item.nomorBab}: {item.judulBab}
        </div>
        <h4 className="text-base font-bold text-[#0F2B48] group-hover:text-blue-900 transition-colors">
          {renderHighlightedText(
            item.judulPasal
              ? `${item.nomorPasal} — ${item.judulPasal}`
              : item.nomorPasal,
            searchTokens
          )}
        </h4>
      </div>

      <div className="mt-2 text-xs md:text-sm text-slate-600 leading-relaxed font-serif-legal line-clamp-3 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
        {renderHighlightedText(item.snippet, searchTokens)}
      </div>

      <div className="mt-3.5 flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400 group-hover:text-slate-600">
        <span className="inline-flex items-center gap-1 font-medium text-slate-500">
          Cocok di:{' '}
          <span className="capitalize font-semibold text-slate-700">
            {item.matchedIn === 'ayat'
              ? 'Isi Ayat'
              : item.matchedIn === 'nomor'
              ? 'Nomor Pasal'
              : item.matchedIn === 'penjelasan'
              ? 'Penjelasan Resmi'
              : item.matchedIn}
          </span>
        </span>
        <span className="inline-flex items-center font-semibold text-[#0F2B48] group-hover:translate-x-0.5 transition-transform">
          Buka Teks Lengkap <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
        </span>
      </div>
    </div>
  );
};
