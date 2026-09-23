import { jsPDF } from 'jspdf';
import { PasalWithDetails } from '../types/legal';

export function exportPasalToPdf(details: PasalWithDetails): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let currentY = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - margin) {
      doc.addPage();
      currentY = margin;
      drawPageBorder();
    }
  };

  const drawPageBorder = () => {
    // Subtle border
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
  };

  drawPageBorder();

  // 1. Kop Dokumen Resmi
  doc.setFont('times', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 43, 72); // Navy
  doc.text('BANTUAN HUKUMKU', margin, currentY);
  currentY += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(184, 134, 11); // Gold
  doc.text(
    'REPOSITORI PERATURAN PERUNDANG-UNDANGAN REPUBLIK INDONESIA',
    margin,
    currentY
  );
  currentY += 4;

  // Gold separator line
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.8);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 7;

  // 2. Info Peraturan
  const { peraturan, bab, pasal } = details;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 58, 95);
  const regTitleLines = doc.splitTextToSize(
    `${peraturan.judul} (${peraturan.nomor})`,
    contentWidth
  );
  doc.text(regTitleLines, margin, currentY);
  currentY += regTitleLines.length * 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  const tentangLines = doc.splitTextToSize(`Tentang: ${peraturan.tentang}`, contentWidth);
  doc.text(tentangLines, margin, currentY);
  currentY += tentangLines.length * 4.5;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Status: ${peraturan.status} | Tanggal Penetapan: ${peraturan.tanggalPenetapan}`,
    margin,
    currentY
  );
  currentY += 5;

  // Thin separator
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 7;

  // 3. Bab dan Judul Pasal
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(184, 134, 11);
  doc.text(`${bab.nomorBab}: ${bab.judulBab}`, margin, currentY);
  currentY += 6;

  doc.setFont('times', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 43, 72);
  const pasalTitle = pasal.judulPasal
    ? `${pasal.nomorPasal} - ${pasal.judulPasal}`
    : pasal.nomorPasal;
  const pLines = doc.splitTextToSize(pasalTitle, contentWidth);
  doc.text(pLines, margin, currentY);
  currentY += pLines.length * 6 + 3;

  // 4. Ayat-Ayat
  for (const ayat of details.pasal.ayats) {
    const ayatLabel = ayat.nomorAyat > 0 ? `Ayat (${ayat.labelAyat})` : 'Teks Pasal';

    checkPageBreak(18);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 58, 95);
    doc.text(ayatLabel, margin, currentY);
    currentY += 5;

    doc.setFont('times', 'normal');
    doc.setFontSize(10.5);
    doc.setTextColor(20, 30, 45);

    const bodyLines = doc.splitTextToSize(ayat.isiAyat, contentWidth);
    checkPageBreak(bodyLines.length * 5 + 4);
    doc.text(bodyLines, margin, currentY, { lineHeightFactor: 1.3 });
    currentY += bodyLines.length * 5 + 4;
  }

  // 5. Penjelasan Resmi
  if (details.pasal.penjelasans && details.pasal.penjelasans.length > 0) {
    checkPageBreak(20);
    currentY += 3;

    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.4);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 6;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(184, 134, 11);
    doc.text('PENJELASAN RESMI PASAL', margin, currentY);
    currentY += 5;

    for (const pen of details.pasal.penjelasans) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text(pen.nomorPenjelasan, margin, currentY);
      currentY += 4.5;

      doc.setFont('times', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      const penLines = doc.splitTextToSize(pen.isiPenjelasan, contentWidth);
      checkPageBreak(penLines.length * 4.8);
      doc.text(penLines, margin, currentY, { lineHeightFactor: 1.25 });
      currentY += penLines.length * 4.8 + 3;
    }
  }

  // 6. Disclaimer Footer
  checkPageBreak(25);
  currentY += 4;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 5;

  const now = new Date();
  const formattedDate = now.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);

  const disclaimerText = `Dicetak pada ${formattedDate} WIB melalui aplikasi Bantuan Hukumku untuk keperluan pengarsipan informasi hukum. Seluruh teks pasal bersumber dari naskah resmi perundang-undangan RI (JDIHN). Informasi ini bersifat edukasi rujukan dan bukan pengganti nasihat advokat berlisensi.`;
  const discLines = doc.splitTextToSize(disclaimerText, contentWidth);
  doc.text(discLines, margin, currentY);

  // Save the PDF
  const cleanPasal = pasal.nomorPasal.replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `Arsip_Hukum_${cleanPasal}_${Date.now()}.pdf`;
  doc.save(fileName);
}
