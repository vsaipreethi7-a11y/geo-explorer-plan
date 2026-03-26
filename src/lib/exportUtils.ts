import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Booth, DaySummary } from '@/types/booth';

export const exportToExcel = (booths: Booth[], summary: DaySummary[], planLabel: string, selectedDay: number | null) => {
  const filteredBooths = selectedDay 
    ? booths.filter(b => b.day === selectedDay).sort((a, b) => a.visit_order - b.visit_order)
    : [...booths].sort((a, b) => a.day - b.day || a.visit_order - b.visit_order);

  const wsData = filteredBooths.map(b => ({
    Day: b.day,
    'Visit Order': b.visit_order,
    'Booth Name': b.name,
    Location: b.location,
    Latitude: b.lat,
    Longitude: b.lng,
    'Assigned Person': b.assigned_person,
  }));
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(wsData);
  ws['!cols'] = [{ wch: 6 }, { wch: 10 }, { wch: 60 }, { wch: 25 }, { wch: 10 }, { wch: 10 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, ws, 'Assignments');

  if (!selectedDay) {
    const summWs = XLSX.utils.json_to_sheet(summary.map(s => ({
      Day: s.day,
      'Total Booths': s.total_booths,
      'Est. Distance (km)': s.estimated_distance_km,
    })));
    XLSX.utils.book_append_sheet(wb, summWs, 'Summary');
  }
  
  const fileName = selectedDay 
    ? `tour_plan_day_${selectedDay}_${planLabel}.xlsx` 
    : `full_booth_plan_${planLabel}.xlsx`;
  XLSX.writeFile(wb, fileName);
};

export const exportToPdf = (booths: Booth[], planLabel: string, selectedDay: number | null) => {
  const filteredBooths = selectedDay 
    ? booths.filter(b => b.day === selectedDay).sort((a, b) => a.visit_order - b.visit_order)
    : [...booths].sort((a, b) => a.day - b.day || a.visit_order - b.visit_order);

  const doc = new jsPDF();
  const title = selectedDay 
    ? `Tour Plan: Day ${selectedDay} (${planLabel}-Day Strategy)`
    : `Full Booth Visit Plan (${planLabel}-Day Strategy)`;
  
  doc.setFontSize(18);
  doc.text(title, 14, 20);
  
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on ${new Date().toLocaleDateString()} · ${filteredBooths.length} total stops`, 14, 28);

  const tableData = filteredBooths.map(b => [
    b.day,
    b.visit_order,
    b.name,
    b.location,
    b.assigned_person
  ]);

  autoTable(doc, {
    startY: 35,
    head: [['Day', 'Order', 'Booth / Place Name', 'Area', 'Person']],
    body: tableData,
    headStyles: { fillColor: [66, 66, 66] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 15 },
      2: { cellWidth: 'auto' },
      3: { cellWidth: 40 },
      4: { cellWidth: 30 },
    },
  });

  const fileName = selectedDay 
    ? `tour_plan_day_${selectedDay}_${planLabel}.pdf` 
    : `full_booth_plan_${planLabel}.pdf`;
  doc.save(fileName);
};
