import React, { useState, useEffect, useMemo } from 'react';
import {
  getAllRegulations,
  searchLegalDatabase,
  getPasalWithDetails,
  getNextAndPrevPasals,
  getBookmarkedPasals,
  getBookmarkedPasalIds,
  togglePasalBookmark,
  clearAllSavedBookmarks,
  getLegalDatabaseStats,
} from './data/legalRepository';
import { Peraturan, PeraturanJenis, ScreenTab } from './types/legal';
import { LegalNavbar } from './components/LegalNavbar';
import { DisclaimerModal } from './components/DisclaimerModal';
import { SearchScreen } from './screens/SearchScreen';
import { BrowseHierarchyScreen } from './screens/BrowseHierarchyScreen';
import { PeraturanListScreen } from './screens/PeraturanListScreen';
import { PeraturanDetailScreen } from './screens/PeraturanDetailScreen';
import { PasalDetailScreen } from './screens/PasalDetailScreen';
import { BookmarksScreen } from './screens/BookmarksScreen';
import { LegalGuideScreen } from './screens/LegalGuideScreen';
import { TanyaHukumScreen } from './screens/TanyaHukumScreen';
import { Scale, Heart, Shield, ExternalLink } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ScreenTab>('search');
  const [selectedRegulation, setSelectedRegulation] = useState<Peraturan | null>(null);
  const [selectedPasalId, setSelectedPasalId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PeraturanJenis | 'ALL'>('ALL');

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

  // Load regulations
  const regulations = useMemo(() => getAllRegulations(), []);
  const stats = useMemo(() => getLegalDatabaseStats(), []);

  // Sync bookmarks from localStorage
  useEffect(() => {
    setBookmarkedIds(getBookmarkedPasalIds());
  }, []);

  const handleToggleBookmark = (pasalId: string) => {
    togglePasalBookmark(pasalId);
    setBookmarkedIds(getBookmarkedPasalIds());
  };

  const handleClearAllBookmarks = () => {
    clearAllSavedBookmarks();
    setBookmarkedIds([]);
  };

  const isBookmarked = (pasalId: string) => bookmarkedIds.includes(pasalId);

  // Search Results
  const searchResults = useMemo(() => {
    return searchLegalDatabase(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  // Handle Pasal selection
  const handleSelectPasal = (pasalId: string) => {
    setSelectedPasalId(pasalId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Regulation selection
  const handleSelectRegulation = (reg: Peraturan) => {
    setSelectedRegulation(reg);
    setSelectedPasalId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back handling
  const handleBack = () => {
    if (selectedPasalId) {
      setSelectedPasalId(null);
    } else if (selectedRegulation) {
      setSelectedRegulation(null);
    }
  };

  // Selected Pasal with Details & adjacent pasals
  const selectedPasalDetails = useMemo(() => {
    if (!selectedPasalId) return null;
    return getPasalWithDetails(selectedPasalId);
  }, [selectedPasalId]);

  const adjacentPasals = useMemo(() => {
    if (!selectedPasalId) return {};
    return getNextAndPrevPasals(selectedPasalId);
  }, [selectedPasalId]);

  // Bookmarked items list
  const bookmarkedItems = useMemo(() => {
    return getBookmarkedPasals();
  }, [bookmarkedIds]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 font-sans selection:bg-[#D6E3FF] selection:text-[#001B3E]">
      {/* Top Navbar */}
      <LegalNavbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setSelectedPasalId(null);
          setSelectedRegulation(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        bookmarkCount={bookmarkedIds.length}
        onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Render View based on state */}
        {selectedPasalId && selectedPasalDetails ? (
          <PasalDetailScreen
            details={selectedPasalDetails}
            isBookmarked={isBookmarked(selectedPasalId)}
            onToggleBookmark={() => handleToggleBookmark(selectedPasalId)}
            onBack={handleBack}
            onNavigatePasal={handleSelectPasal}
            prevPasal={adjacentPasals.prev}
            nextPasal={adjacentPasals.next}
            onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
          />
        ) : selectedRegulation ? (
          <PeraturanDetailScreen
            peraturan={selectedRegulation}
            onBack={handleBack}
            onSelectPasal={handleSelectPasal}
          />
        ) : currentTab === 'search' ? (
          <SearchScreen
            regulations={regulations}
            searchResults={searchResults}
            searchQuery={searchQuery}
            onQueryChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onSelectPasal={handleSelectPasal}
            onSelectRegulation={handleSelectRegulation}
            isBookmarked={isBookmarked}
            onToggleBookmark={handleToggleBookmark}
            onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
          />
        ) : currentTab === 'hierarchy' ? (
          <BrowseHierarchyScreen
            regulations={regulations}
            onSelectRegulation={handleSelectRegulation}
            onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
          />
        ) : currentTab === 'regulations' ? (
          <PeraturanListScreen
            regulations={regulations}
            onSelectRegulation={handleSelectRegulation}
          />
        ) : currentTab === 'bookmarks' ? (
          <BookmarksScreen
            bookmarkedPasals={bookmarkedItems}
            onSelectPasal={handleSelectPasal}
            onRemoveBookmark={handleToggleBookmark}
            onClearAll={handleClearAllBookmarks}
            onGoToSearch={() => {
              setCurrentTab('search');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : currentTab === 'guide' ? (
          <LegalGuideScreen onOpenDisclaimer={() => setIsDisclaimerOpen(true)} />
        ) : currentTab === 'ai-consult' ? (
          <TanyaHukumScreen
            onSelectPasal={handleSelectPasal}
            onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
          />
        ) : null}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12 py-8 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0F2B48] text-amber-400">
              <Scale className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-slate-800 font-serif-legal">Bantuan Hukumku</span> &bull; Basis Data Peraturan &amp; Akses Keadilan RI
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400 text-[11px]">
            <span>{stats.totalPeraturan} Peraturan Utama</span>
            <span>&bull;</span>
            <span>{stats.totalPasal} Pasal Tersedia</span>
            <span>&bull;</span>
            <button
              onClick={() => setIsDisclaimerOpen(true)}
              className="text-slate-600 hover:text-[#0F2B48] underline font-medium"
            >
              Disclaimer &amp; Sumber Resmi
            </button>
          </div>

          <div className="text-[11px] text-slate-400">
            Aplikasi independen edukasi hukum &bull; 100% Offline Database
          </div>
        </div>
      </footer>

      {/* Disclaimer Modal */}
      <DisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
      />
    </div>
  );
}
