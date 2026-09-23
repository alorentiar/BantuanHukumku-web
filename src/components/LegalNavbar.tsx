import React from 'react';
import {
  Scale,
  Search,
  Layers,
  BookOpen,
  Bookmark,
  Sparkles,
  Info,
  Compass,
} from 'lucide-react';
import { ScreenTab } from '../types/legal';

interface LegalNavbarProps {
  currentTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
  bookmarkCount: number;
  onOpenDisclaimer: () => void;
}

export const LegalNavbar: React.FC<LegalNavbarProps> = ({
  currentTab,
  onSelectTab,
  bookmarkCount,
  onOpenDisclaimer,
}) => {
  const navTabs: { id: ScreenTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'search',
      label: 'Pencarian',
      icon: <Search className="h-4 w-4" />,
    },
    {
      id: 'hierarchy',
      label: 'Hierarki Hukum',
      icon: <Layers className="h-4 w-4" />,
    },
    {
      id: 'regulations',
      label: 'Koleksi Peraturan',
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      id: 'bookmarks',
      label: 'Tersimpan',
      icon: <Bookmark className="h-4 w-4" />,
      badge: bookmarkCount > 0 ? bookmarkCount : undefined,
    },
    {
      id: 'guide',
      label: 'Panduan Bantuan',
      icon: <Compass className="h-4 w-4" />,
    },
    {
      id: 'ai-consult',
      label: 'Tanya AI',
      icon: <Sparkles className="h-4 w-4 text-amber-400" />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-xs">
      {/* Top Banner Bar */}
      <div className="bg-[#0F2B48] text-white py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-slate-200">
              Basis Data Hukum Indonesia • 100% Offline Ready
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenDisclaimer}
              className="inline-flex items-center gap-1 text-slate-300 hover:text-amber-300 transition-colors"
            >
              <Info className="h-3.5 w-3.5" />
              <span>Sumber Data Resmi &amp; Disclaimer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Brand */}
        <button
          onClick={() => onSelectTab('search')}
          className="flex items-center gap-3 text-left group transition-transform active:scale-98"
        >
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#0F2B48] to-[#1E3A8A] flex items-center justify-center text-amber-400 shadow-sm border border-amber-400/20 group-hover:shadow-md transition-shadow">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-[#0F2B48] font-serif-legal">
                Bantuan Hukumku
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300/60">
                Web
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Peraturan Perundang-undangan &amp; Akses Keadilan
            </p>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navTabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all relative ${
                  isActive
                    ? 'bg-[#0F2B48] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`ml-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-amber-400 text-slate-900' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Bottom Navigation (Floating / Sticky) */}
      <div className="md:hidden border-t border-slate-200 bg-white px-2 py-1 flex items-center justify-around overflow-x-auto">
        {navTabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-lg text-[10px] font-medium transition-colors relative min-w-[56px] ${
                isActive ? 'text-[#0F2B48] font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`p-1 rounded-lg ${
                  isActive ? 'bg-[#0F2B48] text-white' : 'text-slate-600'
                }`}
              >
                {tab.icon}
              </div>
              <span className="mt-0.5 whitespace-nowrap">{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="absolute top-1 right-2 text-[9px] font-bold bg-amber-500 text-white rounded-full px-1">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
