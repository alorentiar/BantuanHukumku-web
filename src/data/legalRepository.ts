import rawLegalDatabase from './hukum_database.json';
import {
  Peraturan,
  Bab,
  Pasal,
  Ayat,
  Penjelasan,
  PasalWithDetails,
  SearchResultItem,
  PeraturanJenis,
  HierarchyLevelInfo,
} from '../types/legal';

// Initialize and normalize the database
function buildNormalizedDatabase(): {
  peraturanList: Peraturan[];
  pasalMap: Map<string, PasalWithDetails>;
} {
  const rawList = (rawLegalDatabase as { peraturanList: any[] }).peraturanList || [];
  const normalizedList: Peraturan[] = [];
  const pasalMap = new Map<string, PasalWithDetails>();

  rawList.forEach((rawReg, regIndex) => {
    const regId = `reg_${regIndex + 1}_${(rawReg.jenis || 'UU').toLowerCase()}_${rawReg.tahun || 0}`;

    const babs: Bab[] = (rawReg.babs || []).map((rawBab: any, babIndex: number) => {
      const babId = `${regId}_bab_${babIndex + 1}`;

      const pasals: Pasal[] = (rawBab.pasals || []).map((rawPasal: any, pasalIndex: number) => {
        const cleanNomor = String(rawPasal.nomorPasal || '').trim();
        const pasalId = `${babId}_pasal_${pasalIndex + 1}_${cleanNomor.replace(/\s+/g, '_')}`;

        const ayats: Ayat[] = (rawPasal.ayats || []).map((a: any) => ({
          nomorAyat: Number(a.nomorAyat) || 0,
          labelAyat: String(a.labelAyat || ''),
          isiAyat: String(a.isiAyat || '').trim(),
        }));

        const penjelasans: Penjelasan[] = (rawPasal.penjelasans || []).map((p: any) => ({
          nomorPenjelasan: String(p.nomorPenjelasan || ''),
          isiPenjelasan: String(p.isiPenjelasan || '').trim(),
        }));

        const pasalObj: Pasal = {
          id: pasalId,
          nomorPasal: cleanNomor,
          judulPasal: rawPasal.judulPasal ? String(rawPasal.judulPasal).trim() : undefined,
          urutan: rawPasal.urutan || pasalIndex + 1,
          ayats,
          penjelasans,
          peraturanId: regId,
          babId,
        };

        return pasalObj;
      });

      const babObj: Bab = {
        id: babId,
        nomorBab: String(rawBab.nomorBab || '').trim(),
        judulBab: String(rawBab.judulBab || '').trim(),
        urutan: rawBab.urutan || babIndex + 1,
        pasals,
        peraturanId: regId,
      };

      return babObj;
    });

    const peraturanObj: Peraturan = {
      id: regId,
      jenis: rawReg.jenis as PeraturanJenis,
      nomor: String(rawReg.nomor || '').trim(),
      tahun: Number(rawReg.tahun) || 0,
      judul: String(rawReg.judul || '').trim(),
      tentang: String(rawReg.tentang || '').trim(),
      tanggalPenetapan: String(rawReg.tanggalPenetapan || '').trim(),
      status: String(rawReg.status || 'Berlaku').trim(),
      urutanHierarki: Number(rawReg.urutanHierarki) || 99,
      deskripsiSingkat: String(rawReg.deskripsiSingkat || '').trim(),
      babs,
    };

    // Index every pasal into map for instant O(1) lookup
    babs.forEach((b) => {
      b.pasals.forEach((p) => {
        pasalMap.set(p.id, {
          pasal: p,
          bab: b,
          peraturan: peraturanObj,
        });
      });
    });

    normalizedList.push(peraturanObj);
  });

  return { peraturanList: normalizedList, pasalMap };
}

const { peraturanList: PERATURAN_DATA, pasalMap: PASAL_MAP } = buildNormalizedDatabase();

export const HIERARCHY_LEVELS: HierarchyLevelInfo[] = [
  {
    code: 'UUD_1945',
    levelNumber: 1,
    shortName: 'UUD 1945',
    displayName: 'Undang-Undang Dasar Negara Republik Indonesia Tahun 1945',
    description: 'Hukum dasar tertulis dan konstitusi tertinggi negara Republik Indonesia. Seluruh peraturan perundang-undangan di bawahnya tidak boleh bertentangan dengan UUD 1945.',
    authority: 'MPR (Majelis Permusyawaratan Rakyat)',
    legalBasis: 'Pasal 7 ayat (1) huruf a UU No. 12/2011',
  },
  {
    code: 'TAP_MPR',
    levelNumber: 2,
    shortName: 'TAP MPR',
    displayName: 'Ketetapan Majelis Permusyawaratan Rakyat',
    description: 'Ketetapan MPR yang masih berlaku sebagaimana dimaksud dalam Pasal 2 dan Pasal 4 Ketetapan MPR RI No. I/MPR/2003.',
    authority: 'MPR RI',
    legalBasis: 'Pasal 7 ayat (1) huruf b UU No. 12/2011',
  },
  {
    code: 'UU',
    levelNumber: 3,
    shortName: 'UU / PERPPU',
    displayName: 'Undang-Undang / Peraturan Pemerintah Pengganti Undang-Undang',
    description: 'Peraturan yang dibentuk oleh Dewan Perwakilan Rakyat (DPR) dengan persetujuan bersama Presiden, atau Perppu yang ditetapkan Presiden dalam hal ihwal kegentingan memaksa.',
    authority: 'DPR bersama Presiden / Presiden (Perppu)',
    legalBasis: 'Pasal 7 ayat (1) huruf c UU No. 12/2011',
  },
  {
    code: 'PP',
    levelNumber: 4,
    shortName: 'PP',
    displayName: 'Peraturan Pemerintah',
    description: 'Peraturan perundang-undangan yang ditetapkan oleh Presiden untuk menjalankan Undang-Undang sebagaimana mestinya.',
    authority: 'Presiden Republik Indonesia',
    legalBasis: 'Pasal 7 ayat (1) huruf d UU No. 12/2011',
  },
  {
    code: 'PERPRES',
    levelNumber: 5,
    shortName: 'PERPRES',
    displayName: 'Peraturan Presiden',
    description: 'Peraturan perundang-undangan yang ditetapkan oleh Presiden untuk menjalankan perintah peraturan yang lebih tinggi atau menyelenggarakan kekuasaan pemerintahan.',
    authority: 'Presiden Republik Indonesia',
    legalBasis: 'Pasal 7 ayat (1) huruf e UU No. 12/2011',
  },
  {
    code: 'PERDA_PROV',
    levelNumber: 6,
    shortName: 'Perda Provinsi',
    displayName: 'Peraturan Daerah Provinsi',
    description: 'Peraturan yang dibentuk oleh Dewan Perwakilan Rakyat Daerah Provinsi dengan persetujuan bersama Gubernur dalam rangka otonomi daerah provinsi.',
    authority: 'DPRD Provinsi bersama Gubernur',
    legalBasis: 'Pasal 7 ayat (1) huruf f UU No. 12/2011',
  },
  {
    code: 'PERDA_KAB',
    levelNumber: 7,
    shortName: 'Perda Kab/Kota',
    displayName: 'Peraturan Daerah Kabupaten / Kota',
    description: 'Peraturan yang dibentuk oleh DPRD Kabupaten/Kota dengan persetujuan bersama Bupati atau Walikota untuk urusan daerah setempat.',
    authority: 'DPRD Kab/Kota bersama Bupati/Walikota',
    legalBasis: 'Pasal 7 ayat (1) huruf g UU No. 12/2011',
  },
];

// Bookmark Storage Helpers
const BOOKMARKS_STORAGE_KEY = 'bantuan_hukum_bookmarks_v1';

export function getBookmarkedPasalIds(): string[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function togglePasalBookmark(pasalId: string): boolean {
  try {
    const current = getBookmarkedPasalIds();
    const index = current.indexOf(pasalId);
    let updated: string[];
    let isNowBookmarked: boolean;

    if (index >= 0) {
      updated = current.filter((id) => id !== pasalId);
      isNowBookmarked = false;
    } else {
      updated = [pasalId, ...current];
      isNowBookmarked = true;
    }

    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updated));
    return isNowBookmarked;
  } catch {
    return false;
  }
}

export function isPasalBookmarked(pasalId: string): boolean {
  return getBookmarkedPasalIds().includes(pasalId);
}

export function getBookmarkedPasals(): PasalWithDetails[] {
  const ids = getBookmarkedPasalIds();
  const results: PasalWithDetails[] = [];
  ids.forEach((id) => {
    const detail = PASAL_MAP.get(id);
    if (detail) {
      results.push(detail);
    }
  });
  return results;
}

export function clearAllSavedBookmarks(): void {
  try {
    localStorage.removeItem(BOOKMARKS_STORAGE_KEY);
  } catch {
    // Ignore
  }
}

// Queries
export function getAllRegulations(): Peraturan[] {
  return PERATURAN_DATA;
}

export function getRegulationById(id: string): Peraturan | undefined {
  return PERATURAN_DATA.find((r) => r.id === id);
}

export function getPasalWithDetails(pasalId: string): PasalWithDetails | undefined {
  return PASAL_MAP.get(pasalId);
}

export function getNextAndPrevPasals(pasalId: string): {
  prev?: { id: string; label: string };
  next?: { id: string; label: string };
} {
  const current = PASAL_MAP.get(pasalId);
  if (!current) return {};

  const allInRegulation: Pasal[] = [];
  current.peraturan.babs.forEach((b) => {
    b.pasals.forEach((p) => allInRegulation.push(p));
  });

  const currentIndex = allInRegulation.findIndex((p) => p.id === pasalId);
  if (currentIndex === -1) return {};

  const prevPasal = currentIndex > 0 ? allInRegulation[currentIndex - 1] : undefined;
  const nextPasal =
    currentIndex < allInRegulation.length - 1 ? allInRegulation[currentIndex + 1] : undefined;

  return {
    prev: prevPasal ? { id: prevPasal.id, label: prevPasal.nomorPasal } : undefined,
    next: nextPasal ? { id: nextPasal.id, label: nextPasal.nomorPasal } : undefined,
  };
}

// Full-Text Search across the entire legal database
export function searchLegalDatabase(
  rawQuery: string,
  categoryFilter?: PeraturanJenis | 'ALL'
): SearchResultItem[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return [];

  const tokens = query.split(/\s+/).filter((t) => t.length > 0);
  const results: SearchResultItem[] = [];

  PASAL_MAP.forEach((item, pasalId) => {
    const { pasal, bab, peraturan } = item;

    // Filter by category if specified
    if (categoryFilter && categoryFilter !== 'ALL') {
      if (categoryFilter === 'UU' && (peraturan.jenis === 'UU' || peraturan.jenis === 'PERPPU')) {
        // match
      } else if (peraturan.jenis !== categoryFilter) {
        return;
      }
    }

    const regTitle = peraturan.judul.toLowerCase();
    const regNomor = peraturan.nomor.toLowerCase();
    const regTentang = peraturan.tentang.toLowerCase();
    const babTitle = bab.judulBab.toLowerCase();
    const pasalNomor = pasal.nomorPasal.toLowerCase();
    const pasalTitle = (pasal.judulPasal || '').toLowerCase();

    // Check matches
    let matchedIn: 'nomor' | 'judul' | 'tentang' | 'ayat' | 'penjelasan' | null = null;
    let snippet = '';

    // 1. Direct Pasal Number match (e.g. "pasal 27" or "28d")
    if (tokens.every((t) => pasalNomor.includes(t))) {
      matchedIn = 'nomor';
      snippet = pasal.ayats[0]?.isiAyat || pasalTitle || bab.judulBab;
    }
    // 2. Pasal Title match
    else if (pasalTitle && tokens.every((t) => pasalTitle.includes(t))) {
      matchedIn = 'judul';
      snippet = pasalTitle;
    }
    // 3. Search in Ayats
    else {
      for (const ayat of pasal.ayats) {
        const text = ayat.isiAyat.toLowerCase();
        const matchesAll = tokens.every((t) => text.includes(t));
        if (matchesAll) {
          matchedIn = 'ayat';
          snippet = ayat.nomorAyat > 0 ? `[Ayat ${ayat.labelAyat}] ${ayat.isiAyat}` : ayat.isiAyat;
          break;
        }
      }
    }

    // 4. Search in Penjelasan
    if (!matchedIn && pasal.penjelasans && pasal.penjelasans.length > 0) {
      for (const pen of pasal.penjelasans) {
        const text = pen.isiPenjelasan.toLowerCase();
        const matchesAll = tokens.every((t) => text.includes(t));
        if (matchesAll) {
          matchedIn = 'penjelasan';
          snippet = `[Penjelasan ${pen.nomorPenjelasan}] ${pen.isiPenjelasan}`;
          break;
        }
      }
    }

    // 5. Search in Peraturan Tentang or Judul
    if (!matchedIn) {
      if (tokens.every((t) => regTentang.includes(t))) {
        matchedIn = 'tentang';
        snippet = `${peraturan.tentang} — ${pasal.ayats[0]?.isiAyat || ''}`;
      } else if (tokens.every((t) => regTitle.includes(t) || regNomor.includes(t))) {
        matchedIn = 'judul';
        snippet = `${peraturan.judul} (${peraturan.nomor}) — ${pasal.ayats[0]?.isiAyat || ''}`;
      }
    }

    if (matchedIn && snippet) {
      results.push({
        id: `search_${pasalId}`,
        pasalId,
        peraturanId: peraturan.id,
        peraturanJudul: peraturan.judul,
        peraturanNomor: peraturan.nomor,
        peraturanJenis: peraturan.jenis,
        nomorBab: bab.nomorBab,
        judulBab: bab.judulBab,
        nomorPasal: pasal.nomorPasal,
        judulPasal: pasal.judulPasal,
        snippet: snippet.length > 280 ? snippet.substring(0, 280) + '...' : snippet,
        matchedIn,
      });
    }
  });

  return results;
}

// Stats helper
export function getLegalDatabaseStats() {
  let totalPasal = 0;
  let totalAyat = 0;
  PERATURAN_DATA.forEach((r) => {
    r.babs.forEach((b) => {
      totalPasal += b.pasals.length;
      b.pasals.forEach((p) => {
        totalAyat += p.ayats.length;
      });
    });
  });

  return {
    totalPeraturan: PERATURAN_DATA.length,
    totalPasal,
    totalAyat,
  };
}
