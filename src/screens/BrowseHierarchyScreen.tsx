import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Layers,
  ArrowRight,
  BookOpen,
  Info,
  Building,
  CheckCircle,
} from 'lucide-react';
import { Peraturan, HierarchyLevelInfo } from '../types/legal';
import { HIERARCHY_LEVELS } from '../data/legalRepository';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

interface BrowseHierarchyScreenProps {
  regulations: Peraturan[];
  onSelectRegulation: (reg: Peraturan) => void;
  onOpenDisclaimer: () => void;
}

export const BrowseHierarchyScreen: React.FC<BrowseHierarchyScreenProps> = ({
  regulations,
  onSelectRegulation,
  onOpenDisclaimer,
}) => {
  const [expandedLevels, setExpandedLevels] = useState<Record<string, boolean>>({
    UUD_1945: true,
    UU: true,
    PP: true,
  });

  const toggleLevel = (code: string) => {
    setExpandedLevels((prev) => ({
      ...prev,
      [code]: !prev[code],
    }));
  };

  const getRegulationsForLevel = (level: HierarchyLevelInfo) => {
    return regulations.filter((reg) => {
      if (level.code === 'UU') {
        return reg.jenis === 'UU' || reg.jenis === 'PERPPU';
      }
      return reg.jenis === level.code;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0F2B48] via-[#16385d] to-[#0A1D33] p-6 sm:p-8 text-white shadow-lg">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold mb-3">
            <Layers className="h-3.5 w-3.5" />
            <span>Tata Urutan Peraturan Perundang-undangan RI</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif-legal">
            Hierarki Hukum Indonesia
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            Berdasarkan <strong>Pasal 7 ayat (1) UU No. 12 Tahun 2011</strong> (jo UU No. 13 Tahun
            2022). Peraturan yang lebih rendah tidak boleh bertentangan dengan peraturan yang lebih
            tinggi (<em>Lex Superior Derogat Legi Inferiori</em>).
          </p>
        </div>
      </div>

      <DisclaimerBanner onLearnMore={onOpenDisclaimer} />

      {/* Visual Pyramid Guide */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <h3 className="text-sm font-bold text-[#0F2B48] mb-3 flex items-center gap-2">
          <Info className="h-4 w-4 text-amber-500" />
          Piramida Stufenbau Theory (Hans Kelsen) dalam Hukum Positif RI
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          Hierarki menentukan daya ikat serta pembagian wewenang pengujian hukum (<em>judicial review</em>):
          UU diuji terhadap UUD 1945 oleh <strong>Mahkamah Konstitusi (MK)</strong>, sedangkan
          peraturan di bawah UU diuji terhadap UU oleh <strong>Mahkamah Agung (MA)</strong>.
        </p>

        {/* Hierarchy Cards List */}
        <div className="space-y-3.5">
          {HIERARCHY_LEVELS.map((level) => {
            const matchingRegulations = getRegulationsForLevel(level);
            const isExpanded = !!expandedLevels[level.code];

            return (
              <div
                key={level.code}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all shadow-xs hover:border-[#0F2B48]/30"
              >
                {/* Header Row */}
                <button
                  onClick={() => toggleLevel(level.code)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left bg-white hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    {/* Level Number Badge */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0F2B48] text-white font-bold text-sm shadow-xs">
                      {level.levelNumber}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm sm:text-base font-bold text-[#0F2B48] font-serif-legal">
                          {level.shortName}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                          Tingkat {level.levelNumber}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {level.displayName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="hidden sm:inline-block text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/60">
                      {matchingRegulations.length} Peraturan Tersedia
                    </span>
                    <div className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/50 p-4 sm:p-5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="rounded-xl border border-slate-200/80 bg-white p-3">
                        <span className="font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
                          <Building className="h-3.5 w-3.5 text-blue-600" />
                          Lembaga Pembentuk:
                        </span>
                        <p className="text-slate-600">{level.authority}</p>
                      </div>

                      <div className="rounded-xl border border-slate-200/80 bg-white p-3">
                        <span className="font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                          Dasar Pengaturan:
                        </span>
                        <p className="text-slate-600">{level.legalBasis}</p>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200/80">
                      <strong>Karakteristik &amp; Kedudukan:</strong> {level.description}
                    </div>

                    {/* Regulations under this level */}
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-700">
                        Dokumen Tersedia di Basis Data ({matchingRegulations.length}):
                      </div>

                      {matchingRegulations.length === 0 ? (
                        <div className="text-xs text-slate-400 italic p-3 bg-white rounded-xl border border-slate-200 text-center">
                          Belum ada dokumen peraturan pada tingkat ini di basis data offline.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {matchingRegulations.map((reg) => (
                            <div
                              key={reg.id}
                              onClick={() => onSelectRegulation(reg)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => e.key === 'Enter' && onSelectRegulation(reg)}
                              className="group flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-[#0F2B48] hover:shadow-xs transition-all cursor-pointer"
                            >
                              <div className="pr-2">
                                <div className="text-xs font-bold text-[#0F2B48] group-hover:text-blue-900 transition-colors">
                                  {reg.judul} ({reg.nomor})
                                </div>
                                <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                  {reg.tentang}
                                </div>
                              </div>
                              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#0F2B48] group-hover:translate-x-1 shrink-0 transition-transform" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
