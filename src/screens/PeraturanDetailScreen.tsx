import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  FileText,
  Search,
  Calendar,
  Layers,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Peraturan } from '../types/legal';

interface PeraturanDetailScreenProps {
  peraturan: Peraturan;
  onBack: () => void;
  onSelectPasal: (pasalId: string) => void;
}

export const PeraturanDetailScreen: React.FC<PeraturanDetailScreenProps> = ({
  peraturan,
  onBack,
  onSelectPasal,
}) => {
  // Expand first 3 babs by default
  const [expandedBabs, setExpandedBabs] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    peraturan.babs.forEach((b, idx) => {
      init[b.id] = idx < 3;
    });
    return init;
  });

  const [filterPasal, setFilterPasal] = useState('');

  const toggleBab = (babId: string) => {
    setExpandedBabs((prev) => ({
      ...prev,
      [babId]: !prev[babId],
    }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    peraturan.babs.forEach((b) => {
      all[b.id] = true;
    });
    setExpandedBabs(all);
  };

  const collapseAll = () => {
    setExpandedBabs({});
  };

  const totalPasal = useMemo(() => {
    return peraturan.babs.reduce((acc, b) => acc + b.pasals.length, 0);
  }, [peraturan]);

  const totalAyat = useMemo(() => {
    return peraturan.babs.reduce(
      (acc, b) => acc + b.pasals.reduce((a, p) => a + p.ayats.length, 0),
      0
    );
  }, [peraturan]);

  return (
    <div className="space-y-6">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-xs"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="text-[11px] font-medium text-slate-600 hover:text-[#0F2B48] px-2 py-1 rounded-md hover:bg-slate-100"
          >
            Buka Semua Bab
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={collapseAll}
            className="text-[11px] font-medium text-slate-600 hover:text-[#0F2B48] px-2 py-1 rounded-md hover:bg-slate-100"
          >
            Tutup Semua
          </button>
        </div>
      </div>

      {/* Regulation Header Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200 px-3 py-1 rounded-md">
            {peraturan.jenis.replace('_', ' ')}
          </span>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-200/60">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Status: {peraturan.status}
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F2B48] font-serif-legal leading-snug">
          {peraturan.judul}
        </h1>
        <div className="mt-1 text-sm font-bold text-amber-700">{peraturan.nomor}</div>

        <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
          <div className="text-xs text-slate-700">
            <span className="font-semibold text-slate-900">Tentang:</span> {peraturan.tentang}
          </div>
          {peraturan.deskripsiSingkat && (
            <div className="text-xs text-slate-600 leading-relaxed italic">
              {peraturan.deskripsiSingkat}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              Ditetapkan: {peraturan.tanggalPenetapan}
            </span>
            <span className="flex items-center gap-1">
              <Layers className="h-3.5 w-3.5 text-slate-400" />
              {peraturan.babs.length} Bab
            </span>
            <span className="flex items-center gap-1">
              <FileText className="h-3.5 w-3.5 text-slate-400" />
              {totalPasal} Pasal ({totalAyat} Ayat)
            </span>
          </div>
        </div>
      </div>

      {/* Filter inside this regulation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <h3 className="text-base font-bold text-[#0F2B48] font-serif-legal">
          Struktur Bab &amp; Daftar Pasal
        </h3>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={filterPasal}
            onChange={(e) => setFilterPasal(e.target.value)}
            placeholder="Cari pasal dalam UU ini..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0F2B48]"
          />
        </div>
      </div>

      {/* Bab List Accordion */}
      <div className="space-y-4">
        {peraturan.babs.map((bab) => {
          const isExpanded = !!expandedBabs[bab.id];

          // Filter pasals if filter text present
          const visiblePasals = bab.pasals.filter((p) => {
            if (!filterPasal.trim()) return true;
            const term = filterPasal.toLowerCase();
            return (
              p.nomorPasal.toLowerCase().includes(term) ||
              (p.judulPasal && p.judulPasal.toLowerCase().includes(term)) ||
              p.ayats.some((a) => a.isiAyat.toLowerCase().includes(term))
            );
          });

          if (filterPasal.trim() && visiblePasals.length === 0) {
            return null;
          }

          return (
            <div
              key={bab.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all"
            >
              {/* Bab Header */}
              <button
                onClick={() => toggleBab(bab.id)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left bg-white hover:bg-slate-50 transition-colors"
              >
                <div>
                  <div className="text-xs font-bold text-amber-700 tracking-wide uppercase">
                    {bab.nomorBab}
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-[#0F2B48] mt-0.5 font-serif-legal">
                    {bab.judulBab}
                  </h4>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    {visiblePasals.length} Pasal
                  </span>
                  <div className="text-slate-400">
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </div>
              </button>

              {/* Pasal List inside Bab */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50/40 p-4 space-y-2.5">
                  {visiblePasals.map((pasal) => {
                    const firstAyatSnippet = pasal.ayats[0]?.isiAyat || '';

                    return (
                      <div
                        key={pasal.id}
                        onClick={() => onSelectPasal(pasal.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && onSelectPasal(pasal.id)}
                        className="group flex items-start justify-between p-3.5 rounded-xl bg-white border border-slate-200/80 hover:border-[#0F2B48] hover:shadow-xs transition-all cursor-pointer text-left"
                      >
                        <div className="flex-1 pr-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#0F2B48] group-hover:text-blue-900 transition-colors">
                              {pasal.nomorPasal}
                            </span>
                            {pasal.judulPasal && (
                              <span className="text-xs font-medium text-slate-700">
                                &bull; {pasal.judulPasal}
                              </span>
                            )}
                            <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-sm">
                              {pasal.ayats.length} Ayat
                            </span>
                          </div>

                          {firstAyatSnippet && (
                            <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 font-serif-legal leading-relaxed">
                              {firstAyatSnippet}
                            </p>
                          )}
                        </div>

                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#0F2B48] group-hover:translate-x-1 shrink-0 transition-transform mt-1" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
