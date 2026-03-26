import type { Booth, DaySummary } from '@/types/booth';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { exportToExcel, exportToPdf } from '@/lib/exportUtils';

interface ExportPanelProps {
  booths: Booth[];
  summary: DaySummary[];
  planLabel: string;
  selectedDay: number | null;
}

export default function ExportPanel({ booths, summary, planLabel, selectedDay }: ExportPanelProps) {
  return (
    <div className="flex items-center gap-2">
      <Button 
        onClick={() => exportToPdf(booths, planLabel, selectedDay)} 
        variant="outline" 
        className="gap-2 border-primary/20 hover:bg-primary/5 text-primary"
      >
        <FileText className="w-4 h-4" />
        {selectedDay ? `Day ${selectedDay} PDF` : `Download PDF`}
      </Button>
      <Button 
        onClick={() => exportToExcel(booths, summary, planLabel, selectedDay)} 
        className="gap-2 shadow-md"
      >
        <Download className="w-4 h-4" />
        {selectedDay ? `Day ${selectedDay} Excel` : `Export Excel`}
      </Button>
    </div>
  );
}


