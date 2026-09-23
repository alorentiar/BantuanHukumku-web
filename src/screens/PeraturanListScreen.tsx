import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Calendar,
  Layers,
  FileText,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Peraturan, PeraturanJenis } from '../types/legal';

interface PeraturanListScreenProps {
  regulations: Peraturan[];
  onSelectRegulation: (reg: Peraturan) => void;
}

export const PeraturanListScreen: React.FC<PeraturanListScreenProps> = ({
  regulations,
  onSelectRegulation,
}) => {
  const [filterText, setFilterText] = useState('');
  const [selectedJenis, setSelectedJenis] = useState<PeraturanJenis | 'ALL'>('ALL');

  const filteredRegulations = useMemo(() => {
    return regulations.filter((reg) => {
      const matchJenis =
        selectedJenis === 'ALL'
          ? true
          : selectedJenis === 'UU'
          ? reg.jenis === 'UU' || reg.jenis === 'PERPPU'
          : reg.jenis === selectedJenis;

      if (!matchJenis) return false;

      if (!filterText.trim()) return true;
      const term = filterText.toLowerCase();
      return (
        reg.judul.toLowerCase().includes(term) ||
        reg.nomor.toLowerCase().includes(term) ||
        reg.tentang.toLowerCase().includes(term) ||
        String(reg.tahun).includes(term)
      );
    });
  }, [regulations, filterText, selectedJenis]);

  const jenisTabs: { id: PeraturanJenis | 'ALL'; label: string }[] = [
    { id: 'ALL', label: 'Semua' },
    { id: 'UUD_1945', label: 'UUD 1945' },
    { id: 'UU', label: 'Undang-Undang' },
    { id: 'PP', label: 'Peraturan Pemerintah' },
    { id: 'TAP_MPR', label: 'TAP MPR' },
    { id: 'PERPRES', label: 'Perpres' },
    { id: 'PERDA_PROV', label: 'Perda Prov' },
    { id: 'PERDA_KAB', label: 'Perda Kab/Kota' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F2B48] font-serif-legal">
            Katalog Peraturan Perundang-undangan
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Menampilkan seluruh dokumen undang-undang dan peraturan resmi yang tersimpan offline.
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Saring judul atau nomor..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0F2B48]"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {jenisTabs.map((tab) => {
          const isSelected = selectedJenis === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedJenis(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-[#0F2B48] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Grid of Regulations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRegulations.map((reg) => {
          const totalPasal = reg.babs.reduce((acc, b) => acc + b.pasals.length, 0);
          const totalAyat = reg.babs.reduce(
            (acc, b) => acc + b.pasals.reduce((a2, p) => a2 + p.ayats.length, 0),
            0
          );

          return (
            <div
              key={reg.id}
              onClick={() => onSelectRegulation(reg)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSelectRegulation(reg)}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-[#0F2B48] hover:shadow-md cursor-pointer text-left"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[11px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                    {reg.jenis.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200/50">
                    <CheckCircle2 className="h-3 w-3" />
                    {reg.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#0F2B48] group-hover:text-blue-900 transition-colors line-clamp-2">
                  {reg.judul}
                </h3>
                <div className="text-xs font-semibold text-amber-700 mt-1">{reg.nomor}</div>

                <div className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {reg.tentang}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                  <span className="flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5 text-slate-400" />
                    {reg.babs.length} Bab
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5 text-slate-400" />
                    {totalPasal} Pasal ({totalAyat} Ayat)
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    {reg.tahun}
                  </span>
                </div>

                <div className="flex items-center justify-end text-xs font-semibold text-[#0F2B48] group-hover:translate-x-0.5 transition-transform">
                  Jelajahi Isi Bab &amp; Pasal <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRegulations.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
          Tidak ada peraturan yang sesuai dengan pencarian atau filter yang dipilih.
        </div>
      )}
    </div>
  );
};
