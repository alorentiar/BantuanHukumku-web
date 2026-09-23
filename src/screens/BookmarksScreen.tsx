import React, { useState } from 'react';
import {
  Bookmark,
  BookmarkX,
  Trash2,
  FileText,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Search,
} from 'lucide-react';
import { PasalWithDetails } from '../types/legal';

interface BookmarksScreenProps {
  bookmarkedPasals: PasalWithDetails[];
  onSelectPasal: (pasalId: string) => void;
  onRemoveBookmark: (pasalId: string) => void;
  onClearAll: () => void;
  onGoToSearch: () => void;
}

export const BookmarksScreen: React.FC<BookmarksScreenProps> = ({
  bookmarkedPasals,
  onSelectPasal,
  onRemoveBookmark,
  onClearAll,
  onGoToSearch,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filtered = bookmarkedPasals.filter((item) => {
    if (!filterQuery.trim()) return true;
    const term = filterQuery.toLowerCase();
    return (
      item.pasal.nomorPasal.toLowerCase().includes(term) ||
      (item.pasal.judulPasal && item.pasal.judulPasal.toLowerCase().includes(term)) ||
      item.peraturan.judul.toLowerCase().includes(term) ||
      item.peraturan.nomor.toLowerCase().includes(term) ||
      item.pasal.ayats.some((a) => a.isiAyat.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F2B48] font-serif-legal">
            Pasal Hukum Tersimpan
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Koleksi pasal pilihan Anda yang tersimpan di browser secara offline.
          </p>
        </div>

        {bookmarkedPasals.length > 0 && (
          <div className="flex items-center gap-3">
            {showClearConfirm ? (
              <div className="flex items-center gap-2 bg-red-50 p-1.5 rounded-xl border border-red-200">
                <span className="text-xs text-red-700 font-semibold px-2">Hapus semua?</span>
                <button
                  onClick={() => {
                    onClearAll();
                    setShowClearConfirm(false);
                  }}
                  className="px-2.5 py-1 text-xs font-bold bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Ya, Hapus
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-2 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                >
                  Batal
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-medium px-3 py-1.5 rounded-xl border border-red-200 bg-white hover:bg-red-50 transition-colors shadow-xs"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Kosongkan Tersimpan</span>
              </button>
            )}
          </div>
        )}
      </div>

      {bookmarkedPasals.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mb-4">
            <Bookmark className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 font-serif-legal">
            Belum Ada Pasal yang Tersimpan
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Anda dapat menyimpan pasal-pasal penting untuk rujukan cepat sewaktu-waktu tanpa koneksi
            internet dengan menekan ikon <strong>Bookmark (Simpan)</strong> di halaman detail pasal.
          </p>
          <div className="mt-6">
            <button
              onClick={onGoToSearch}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0F2B48] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#16385d] transition-colors shadow-sm"
            >
              <Search className="h-4 w-4" />
              <span>Cari &amp; Jelajahi Pasal Sekarang</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Quick filter input */}
          {bookmarkedPasals.length > 2 && (
            <div className="relative max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Cari dalam daftar tersimpan..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0F2B48]"
              />
            </div>
          )}

          {/* List of bookmarked cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((item) => {
              const snippet = item.pasal.ayats[0]?.isiAyat || '';

              return (
                <div
                  key={item.pasal.id}
                  onClick={() => onSelectPasal(item.pasal.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && onSelectPasal(item.pasal.id)}
                  className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-[#0F2B48] hover:shadow-md cursor-pointer text-left"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className="text-[10px] font-bold text-blue-900 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-md">
                        {item.peraturan.jenis.replace('_', ' ')}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveBookmark(item.pasal.id);
                        }}
                        title="Hapus dari daftar simpanan"
                        className="rounded-lg p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <BookmarkX className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="text-xs text-slate-500 font-medium truncate mb-1">
                      {item.peraturan.judul} ({item.peraturan.nomor})
                    </div>

                    <h3 className="text-base font-bold text-[#0F2B48] group-hover:text-blue-900 transition-colors">
                      {item.pasal.nomorPasal}
                      {item.pasal.judulPasal && ` — ${item.pasal.judulPasal}`}
                    </h3>

                    {snippet && (
                      <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed font-serif-legal bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        {snippet}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span className="font-medium text-slate-500">
                      {item.pasal.ayats.length} Ayat
                    </span>
                    <span className="inline-flex items-center font-semibold text-[#0F2B48] group-hover:translate-x-1 transition-transform">
                      Buka Rujukan <ChevronRight className="h-3.5 w-3.5 ml-1" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
