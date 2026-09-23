import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  Sparkles,
  BookOpen,
  Scale,
  ArrowRight,
  Shield,
  FileText,
  Clock,
} from 'lucide-react';
import { Peraturan, PeraturanJenis, SearchResultItem } from '../types/legal';
import { SearchResultCard } from '../components/SearchResultCard';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

interface SearchScreenProps {
  regulations: Peraturan[];
  searchResults: SearchResultItem[];
  searchQuery: string;
  onQueryChange: (query: string) => void;
  selectedCategory: PeraturanJenis | 'ALL';
  onCategoryChange: (category: PeraturanJenis | 'ALL') => void;
  onSelectPasal: (pasalId: string) => void;
  onSelectRegulation: (reg: Peraturan) => void;
  isBookmarked: (pasalId: string) => boolean;
  onToggleBookmark: (pasalId: string) => void;
  onOpenDisclaimer: () => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  regulations,
  searchResults,
  searchQuery,
  onQueryChange,
  selectedCategory,
  onCategoryChange,
  onSelectPasal,
  onSelectRegulation,
  isBookmarked,
  onToggleBookmark,
  onOpenDisclaimer,
}) => {
  const quickKeywords = [
    { label: 'Pencemaran Nama Baik', query: 'pencemaran nama baik' },
    { label: 'Berita Bohong (Hoax)', query: 'berita bohong' },
    { label: 'Hak Konsumen', query: 'hak konsumen' },
    { label: 'Pesangon PHK', query: 'pesangon' },
    { label: 'Hierarki Hukum', query: 'hierarki' },
    { label: 'Syarat Sah Perkawinan', query: 'perkawinan' },
    { label: 'Hak Asasi Manusia', query: 'hak asasi' },
    { label: 'Perlindungan Data', query: 'elektronik' },
    { label: 'Pasal 27', query: 'pasal 27' },
    { label: 'Pasal 28D', query: 'pasal 28d' },
  ];

  const categories: { id: PeraturanJenis | 'ALL'; label: string }[] = [
    { id: 'ALL', label: 'Semua Kategori' },
    { id: 'UUD_1945', label: 'UUD 1945' },
    { id: 'UU', label: 'Undang-Undang' },
    { id: 'PP', label: 'Peraturan Pemerintah' },
    { id: 'TAP_MPR', label: 'TAP MPR' },
    { id: 'PERPRES', label: 'Perpres' },
    { id: 'PERDA_PROV', label: 'Perda Provinsi' },
    { id: 'PERDA_KAB', label: 'Perda Kab/Kota' },
  ];

  const searchTokens = useMemo(() => {
    return searchQuery
      .trim()
      .split(/\s+/)
      .filter((t) => t.length > 0);
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      {/* Hero / Search Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F2B48] via-[#16385d] to-[#0A1D33] p-6 sm:p-10 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-amber-300 text-xs font-semibold tracking-wide mb-4">
            <Scale className="h-3.5 w-3.5" />
            <span>Kompilasi Hukum Indonesia Lengkap &amp; Terpercaya</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-serif-legal leading-tight">
            Pencarian Pasal &amp; Peraturan Hukum RI
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Cari cepat ribuan kata, pasal, ayat, dan penjelasan resmi (UUD 1945, UU ITE, UU
            Perkawinan, PP 35/2021 Ketenagakerjaan, Perlindungan Konsumen, dll.) secara instan 100%
            offline.
          </p>

          {/* Big Search Input */}
          <div className="mt-6 relative">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Cari pasal, kata kunci, topik (contoh: 'pencemaran nama baik', 'Pasal 27', 'pesangon')..."
                className="w-full rounded-2xl bg-white pl-12 pr-12 py-4 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 shadow-2xl focus:outline-hidden focus:ring-4 focus:ring-amber-400/40 border-0"
              />
              {searchQuery && (
                <button
                  onClick={() => onQueryChange('')}
                  className="absolute right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Hapus kata kunci pencarian"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Keyword Chips */}
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-slate-300 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-amber-400" /> Kata Kunci Populer:
            </span>
            {quickKeywords.map((kw, i) => (
              <button
                key={i}
                onClick={() => onQueryChange(kw.query)}
                className="text-xs bg-white/10 hover:bg-white/20 active:scale-95 text-slate-200 hover:text-white px-2.5 py-1 rounded-lg border border-white/10 transition-all font-medium"
              >
                {kw.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-[#0F2B48] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Main Content: Results or Default Browse View */}
      {searchQuery.trim().length > 0 ? (
        /* Results View */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              Hasil Pencarian: &ldquo;{searchQuery}&rdquo;
            </h3>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              {searchResults.length} pasal ditemukan
            </span>
          </div>

          {searchResults.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4">
                <Search className="h-7 w-7" />
              </div>
              <h4 className="text-base font-bold text-slate-800">
                Tidak Ada Pasal yang Cocok
              </h4>
              <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Coba gunakan kata kunci yang lebih umum, periksa ejaan, atau gunakan nomor pasal
                seperti &ldquo;Pasal 27&rdquo;, &ldquo;Pasal 28&rdquo;, atau &ldquo;Pasal 156&rdquo;.
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <button
                  onClick={() => onQueryChange('')}
                  className="rounded-xl bg-[#0F2B48] px-4 py-2 text-xs font-semibold text-white hover:bg-[#16385d]"
                >
                  Kembali ke Koleksi Utama
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map((item) => (
                <SearchResultCard
                  key={item.id}
                  item={item}
                  searchTokens={searchTokens}
                  isBookmarked={isBookmarked(item.pasalId)}
                  onToggleBookmark={(e) => {
                    e.stopPropagation();
                    onToggleBookmark(item.pasalId);
                  }}
                  onClick={() => onSelectPasal(item.pasalId)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Default Browse View (Android RegulationQuickCard style) */
        <div className="space-y-6">
          <DisclaimerBanner onLearnMore={onOpenDisclaimer} />

          {/* Section: Peraturan Utama Tersedia */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-[#0F2B48] font-serif-legal">
                  Koleksi Peraturan Utama (Offline)
                </h3>
                <p className="text-xs text-slate-500">
                  Pilih peraturan untuk melihat bab, pasal, dan penjelasan resmi
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {regulations
                .filter((r) => {
                  if (selectedCategory === 'ALL') return true;
                  if (selectedCategory === 'UU') return r.jenis === 'UU' || r.jenis === 'PERPPU';
                  return r.jenis === selectedCategory;
                })
                .map((peraturan) => {
                  const totalPasal = peraturan.babs.reduce((acc, b) => acc + b.pasals.length, 0);
                  const isTopTier = peraturan.jenis === 'UUD_1945' || peraturan.jenis === 'UU';

                  return (
                    <div
                      key={peraturan.id}
                      onClick={() => onSelectRegulation(peraturan)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && onSelectRegulation(peraturan)}
                      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-[#0F2B48]/40 hover:shadow-md cursor-pointer text-left"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span
                            className={`rounded-md border px-2.5 py-0.5 text-[10px] font-bold tracking-wide ${
                              isTopTier
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {peraturan.jenis.replace('_', ' ')}
                          </span>
                          <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                            {peraturan.status}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-[#0F2B48] group-hover:text-blue-900 transition-colors line-clamp-2">
                          {peraturan.judul}
                        </h4>
                        <div className="text-xs font-semibold text-amber-700 mt-1">
                          {peraturan.nomor}
                        </div>

                        <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {peraturan.tentang}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                        <span className="font-medium text-slate-500">
                          {peraturan.babs.length} Bab &bull; {totalPasal} Pasal
                        </span>
                        <span className="inline-flex items-center font-semibold text-[#0F2B48] group-hover:translate-x-1 transition-transform">
                          Buka <ArrowRight className="h-3.5 w-3.5 ml-1" />
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
