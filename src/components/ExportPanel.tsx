import * as XLSX from 'xlsx';
import type { Booth, DaySummary } from '@/types/booth';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink } from 'lucide-react';

interface ExportPanelProps {
  booths: Booth[];
  summary: DaySummary[];
  planLabel: string;
}

function generateGoogleMapsLink(booths: Booth[]): string {
  const sorted = [...booths].sort((a, b) => a.visit_order - b.visit_order);
  if (sorted.length === 0) return '#';
  const origin = sorted[0];
  const dest = sorted[sorted.length - 1];
  const waypoints = sorted.slice(1, -1).slice(0, 23); // Google Maps max 25 waypoints
  let url = `https://www.google.com/maps/dir/${origin.lat},${origin.lng}`;
  waypoints.forEach(w => { url += `/${w.lat},${w.lng}`; });
  url += `/${dest.lat},${dest.lng}`;
  return url;
}

export default function ExportPanel({ booths, summary, planLabel }: ExportPanelProps) {
  const handleExcelExport = () => {
    const sorted = [...booths].sort((a, b) => a.day - b.day || a.visit_order - b.visit_order);
    const wsData = sorted.map(b => ({
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

    const summWs = XLSX.utils.json_to_sheet(summary.map(s => ({
      Day: s.day,
      'Total Booths': s.total_booths,
      'Est. Distance (km)': s.estimated_distance_km,
    })));
    XLSX.utils.book_append_sheet(wb, summWs, 'Summary');
    XLSX.writeFile(wb, `booth_plan_${planLabel}.xlsx`);
  };

  const days = [...new Set(booths.map(b => b.day))].sort((a, b) => a - b);

  return (
    <Button onClick={handleExcelExport} className="gap-2">
      <Download className="w-4 h-4" />
      Export Excel ({planLabel})
    </Button>
  );
}
