export type PeraturanJenis =
  | 'UUD_1945'
  | 'TAP_MPR'
  | 'UU'
  | 'PERPPU'
  | 'PP'
  | 'PERPRES'
  | 'PERDA_PROV'
  | 'PERDA_KAB';

export interface Ayat {
  nomorAyat: number;
  labelAyat: string;
  isiAyat: string;
}

export interface Penjelasan {
  nomorPenjelasan: string;
  isiPenjelasan: string;
}

export interface Pasal {
  id: string;
  nomorPasal: string;
  judulPasal?: string;
  urutan: number;
  ayats: Ayat[];
  penjelasans?: Penjelasan[];
  // References
  peraturanId: string;
  babId: string;
}

export interface Bab {
  id: string;
  nomorBab: string;
  judulBab: string;
  urutan: number;
  pasals: Pasal[];
  peraturanId: string;
}

export interface Peraturan {
  id: string;
  jenis: PeraturanJenis;
  nomor: string;
  tahun: number;
  judul: string;
  tentang: string;
  tanggalPenetapan: string;
  status: string;
  urutanHierarki: number;
  deskripsiSingkat: string;
  babs: Bab[];
}

export interface PasalWithDetails {
  pasal: Pasal;
  bab: Bab;
  peraturan: Peraturan;
}

export interface SearchResultItem {
  id: string;
  pasalId: string;
  peraturanId: string;
  peraturanJudul: string;
  peraturanNomor: string;
  peraturanJenis: PeraturanJenis;
  nomorBab: string;
  judulBab: string;
  nomorPasal: string;
  judulPasal?: string;
  snippet: string;
  matchedIn: 'judul' | 'nomor' | 'ayat' | 'penjelasan' | 'tentang';
}

export interface HierarchyLevelInfo {
  code: PeraturanJenis;
  levelNumber: number;
  shortName: string;
  displayName: string;
  description: string;
  authority: string;
  legalBasis: string;
}

export type ScreenTab =
  | 'search'
  | 'hierarchy'
  | 'regulations'
  | 'bookmarks'
  | 'guide'
  | 'ai-consult';
