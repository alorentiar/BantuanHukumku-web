import React from 'react';
import { X, ShieldCheck, ExternalLink, Scale, CheckCircle2 } from 'lucide-react';

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-slate-200 p-6 md:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Tutup modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0F2B48] text-amber-400 shadow-md">
            <Scale className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#0F2B48] font-serif-legal">
              Tentang &amp; Disclaimer Bantuan Hukumku
            </h3>
            <p className="text-xs text-slate-500">
              Basis Data Peraturan Perundang-undangan RI 100% Offline
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs md:text-sm text-slate-700 leading-relaxed">
          <p>
            Aplikasi <strong>Bantuan Hukumku</strong> dikembangkan sebagai jembatan keterbukaan
            informasi hukum bagi seluruh masyarakat Indonesia. Menyediakan basis data perundang-undangan
            utama (UUD 1945, Ketetapan MPR, Undang-Undang, Peraturan Pemerintah, Perpres, hingga Perda)
            dengan kemampuan pencarian kilat.
          </p>

          <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 space-y-2">
            <h4 className="font-semibold text-[#0F2B48] flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              Ketentuan &amp; Sumber Data Resmi:
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside">
              <li>
                <strong>Bukan Aplikasi Resmi Pemerintah:</strong> Aplikasi ini dikembangkan secara
                independen oleh pengembang untuk memudahkan masyarakat umum dan praktisi hukum.
              </li>
              <li>
                <strong>Bukan Nasihat Hukum Advokat:</strong> Seluruh kutipan pasal, ayat, dan
                penjelasan adalah referensi informatif semata dan tidak menggantikan nasihat hukum
                resmi dari advokat atau konsultan hukum berlisensi.
              </li>
              <li>
                <strong>Sumber Data:</strong> Naskah peraturan merujuk pada Lembaran Negara Republik
                Indonesia dan Jaringan Dokumentasi dan Informasi Hukum Nasional (JDIHN).
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 space-y-1.5 text-xs text-slate-600">
            <div className="font-medium text-slate-800">Tautan Resmi Terkait:</div>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://jdihn.go.id"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline"
              >
                Portal Resmi JDIHN <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href="https://bphn.go.id"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline"
              >
                BPHN Kemenkumham <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href="https://mahkamahagung.go.id"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline"
              >
                Posbakum Mahkamah Agung <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="flex items-center gap-2 rounded-xl bg-[#0F2B48] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#16385d] transition-colors"
          >
            <CheckCircle2 className="h-4 w-4 text-amber-400" />
            Mengerti &amp; Setuju
          </button>
        </div>
      </div>
    </div>
  );
};
