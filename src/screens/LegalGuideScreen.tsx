import React from 'react';
import {
  ShieldCheck,
  Scale,
  BookOpen,
  HelpCircle,
  FileCheck2,
  AlertCircle,
  ExternalLink,
  Users,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

interface LegalGuideScreenProps {
  onOpenDisclaimer: () => void;
}

export const LegalGuideScreen: React.FC<LegalGuideScreenProps> = ({ onOpenDisclaimer }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0F2B48] via-[#16385d] to-[#0A1D33] p-6 sm:p-8 text-white shadow-lg">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold mb-3">
            <Compass className="h-3.5 w-3.5" />
            <span>Akses Keadilan Bagi Seluruh Rakyat Indonesia</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif-legal">
            Panduan Hak Bantuan Hukum &amp; Asas Hukum RI
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            Mengetahui hak konstitusional Anda di hadapan hukum, tata cara memperoleh bantuan hukum
            cuma-cuma (pro bono), serta asas fundamental perundang-undangan Indonesia.
          </p>
        </div>
      </div>

      <DisclaimerBanner onLearnMore={onOpenDisclaimer} />

      {/* Section 1: Hak Bantuan Hukum Pro Bono */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#0F2B48] font-serif-legal">
              Hak Bantuan Hukum Cuma-Cuma (Pro Bono)
            </h2>
            <p className="text-xs text-slate-500">
              Landasan: Pasal 28D ayat (1) UUD 1945 &amp; UU No. 16 Tahun 2011 tentang Bantuan Hukum
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Negara menjamin hak konstitusional setiap warga negara untuk mendapatkan perlakuan yang
          sama di hadapan hukum (<em>equality before the law</em>). Bagi masyarakat miskin atau
          kelompok rentan yang tersangkut masalah hukum (pidana, perdata, atau tata usaha negara),
          negara menyediakan <strong>bantuan hukum cuma-cuma</strong> yang dibiayai oleh APBN.
        </p>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 space-y-2">
            <div className="font-bold text-xs text-[#0F2B48] flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Posbakum Pengadilan
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Terdapat di setiap <strong>Pengadilan Negeri (PN)</strong> dan <strong>Pengadilan Agama (PA)</strong>.
              Memberikan konsultasi hukum gratis, pembuatan draf gugatan/permohonan, dan informasi tata cara beracara.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 space-y-2">
            <div className="font-bold text-xs text-[#0F2B48] flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
              Organisasi Bantuan Hukum (OBH)
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              LBH dan OBH yang terakreditasi oleh <strong>Kemenkumham RI</strong> dapat mendampingi Anda
              dari tahap penyidikan kepolisian hingga proses persidangan di pengadilan tanpa dipungut biaya.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 space-y-2">
            <div className="font-bold text-xs text-[#0F2B48] flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-amber-600" />
              Kewajiban Pro Bono Advokat
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Berdasarkan <strong>Pasal 22 UU No. 18 Tahun 2003</strong> (UU Advokat), setiap advokat
              berlisensi wajib memberikan bantuan hukum cuma-cuma kepada pencari keadilan yang tidak mampu.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Syarat & Dokumen Pengajuan */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[#0F2B48] font-serif-legal flex items-center gap-2">
          <FileCheck2 className="h-5 w-5 text-amber-600" />
          Syarat Mengakses Bantuan Hukum Gratis (Posbakum / OBH)
        </h3>

        <div className="space-y-3 text-xs sm:text-sm text-slate-700">
          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0F2B48] text-white font-bold text-xs">
              1
            </span>
            <div>
              <strong>KTP / Kartu Keluarga:</strong> Identitas resmi pemohon bantuan hukum atau
              kuasa keluarga terdekat jika yang bersangkutan sedang ditahan.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0F2B48] text-white font-bold text-xs">
              2
            </span>
            <div>
              <strong>Surat Keterangan Tidak Mampu (SKTM):</strong> Diterbitkan oleh Lurah/Kepala Desa
              setempat. <em>Atau</em> kartu jaminan sosial pemerintah seperti Kartu Indonesia Sehat
              (KIS), Kartu Indonesia Pintar (KIP), atau Program Keluarga Harapan (PKH).
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0F2B48] text-white font-bold text-xs">
              3
            </span>
            <div>
              <strong>Uraian Pokok Masalah:</strong> Menjelaskan kronologi fakta kejadian dan berkas
              pendukung (misal: surat panggilan polisi, surat peringatan/PHK kerja, surat gugatan, dsb.).
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: 4 Asas Penting Perundang-undangan */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
            <Scale className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0F2B48] font-serif-legal">
              4 Asas Fundamental Perundang-undangan
            </h3>
            <p className="text-xs text-slate-500">
              Kaidah hukum universal yang dianut dalam sistem perundang-undangan Republik Indonesia
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Asas 1 */}
          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 space-y-1.5">
            <div className="text-xs font-bold text-blue-900">
              1. Lex Superior Derogat Legi Inferiori
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Peraturan perundang-undangan yang derajatnya lebih tinggi mengesampingkan peraturan
              yang lebih rendah jika occurs pertentangan norma. Misal: Peraturan Presiden tidak boleh
              bertentangan dengan Undang-Undang, dan UU tidak boleh bertentangan dengan UUD 1945.
            </p>
          </div>

          {/* Asas 2 */}
          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 space-y-1.5">
            <div className="text-xs font-bold text-blue-900">
              2. Lex Specialis Derogat Legi Generali
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Peraturan yang mengatur hal yang bersifat khusus mengesampingkan peraturan yang bersifat
              umum. Contoh: Ketentuan tindak pidana dalam UU ITE (khusus siber) mengesampingkan
              ketentuan umum dalam KUHP sepanjang pasal khususnya mengatur perbuatan tersebut.
            </p>
          </div>

          {/* Asas 3 */}
          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 space-y-1.5">
            <div className="text-xs font-bold text-blue-900">
              3. Lex Posterior Derogat Legi Priori
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Peraturan baru yang setingkat mengesampingkan peraturan lama yang setingkat apabila
              keduanya mengatur subjek permasalahan yang sama, guna memastikan kepastian hukum.
            </p>
          </div>

          {/* Asas 4 */}
          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 space-y-1.5">
            <div className="text-xs font-bold text-blue-900">
              4. Asas Fiksi Hukum (Presumptio Iures de Iure)
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Setiap orang dianggap mengetahui hukum begitu suatu undang-undang diundangkan dalam
              Lembaran Negara Republik Indonesia. Dalil &ldquo;tidak tahu undang-undangnya&rdquo;
              bukan alasan pemaaf atas pelanggaran pidana.
            </p>
          </div>
        </div>
      </div>

      {/* Section 4: Asas Kunci Perlindungan Warga (Pidana & Perdata) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[#0F2B48] font-serif-legal flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-700" />
          Hak Anda Jika Diperiksa Aparat Penegak Hukum
        </h3>

        <div className="space-y-3 text-xs sm:text-sm text-slate-700">
          <div className="rounded-xl border border-slate-100 bg-blue-50/50 p-4 space-y-1">
            <div className="font-bold text-blue-950">
              &bull; Asas Praduga Tak Bersalah (Presumption of Innocence)
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Setiap orang yang disangka atau didakwa melakukan tindak pidana wajib dianggap tidak
              bersalah sampai adanya putusan pengadilan yang telah memperoleh kekuatan hukum tetap
              (<em>inkracht</em>).
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-blue-50/50 p-4 space-y-1">
            <div className="font-bold text-blue-950">
              &bull; Hak Didampingi Advokat / Penasihat Hukum (Pasal 54 KUHAP)
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tersangka berhak mendapatkan bantuan hukum dari seorang atau lebih penasihat hukum
              selama dalam dan pada setiap tingkat pemeriksaan, mulai dari pemeriksaan di kantor polisi
              (BAP saksi/tersangka).
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-blue-50/50 p-4 space-y-1">
            <div className="font-bold text-blue-950">
              &bull; Hak Tidak Memberikan Keterangan yang Memberatkan Diri Sendiri (Non-Self Incrimination)
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tersangka berhak memberikan keterangan secara bebas tanpa adanya tekanan fisik maupun
              psikologis dari pemeriksa. Berita Acara Pemeriksaan (BAP) wajib dibaca kembali sebelum
              ditandatangani.
            </p>
          </div>
        </div>
      </div>

      {/* Section 5: Portal Resmi & Direktori Hukum */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-xs space-y-3">
        <h4 className="text-sm font-bold text-[#0F2B48]">
          Tautan &amp; Portal Resmi Akses Keadilan Indonesia:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <a
            href="https://jdihn.go.id"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 text-blue-700 hover:text-blue-900 hover:border-blue-300 transition-colors"
          >
            <div>
              <div className="font-bold">JDIHN Nasional</div>
              <div className="text-[11px] text-slate-400">Database Peraturan Resmi</div>
            </div>
            <ExternalLink className="h-4 w-4 shrink-0" />
          </a>

          <a
            href="https://bphn.go.id"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 text-blue-700 hover:text-blue-900 hover:border-blue-300 transition-colors"
          >
            <div>
              <div className="font-bold">BPHN Kemenkumham</div>
              <div className="text-[11px] text-slate-400">Penyelenggara Bantuan Hukum</div>
            </div>
            <ExternalLink className="h-4 w-4 shrink-0" />
          </a>

          <a
            href="https://putusan3.mahkamahagung.go.id"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 text-blue-700 hover:text-blue-900 hover:border-blue-300 transition-colors"
          >
            <div>
              <div className="font-bold">Direktori Putusan MA</div>
              <div className="text-[11px] text-slate-400">Yurisprudensi &amp; Putusan Hakim</div>
            </div>
            <ExternalLink className="h-4 w-4 shrink-0" />
          </a>
        </div>
      </div>
    </div>
  );
};
