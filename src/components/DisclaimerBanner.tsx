import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface DisclaimerBannerProps {
  onLearnMore?: () => void;
  className?: string;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({
  onLearnMore,
  className = '',
}) => {
  return (
    <div
      className={`rounded-xl border border-amber-200/90 bg-amber-50/90 p-3.5 text-amber-900 transition-all ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-lg bg-amber-200/70 p-1.5 text-amber-800">
          <ShieldAlert className="h-4 w-4 shrink-0" />
        </div>
        <div className="flex-1 text-xs leading-relaxed">
          <span className="font-semibold text-amber-950">Pemberitahuan Hukum:</span> Seluruh data
          peraturan perundang-undangan dalam aplikasi ini disajikan untuk keperluan informasi &amp;
          edukasi publik. Informasi ini bukan merupakan nasihat hukum formal atau pengganti jasa
          advokat berlisensi.
          {onLearnMore && (
            <button
              onClick={onLearnMore}
              className="ml-1.5 font-semibold text-amber-800 underline hover:text-amber-950"
            >
              Baca selengkapnya
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
