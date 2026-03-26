import type { DaySummary } from '@/types/booth';
import { getDayColor } from '@/lib/dayColors';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Route, Calendar, Download } from 'lucide-react';

interface SummaryCardsProps {
  summary: DaySummary[];
  totalBooths: number;
  selectedDay: number | null;
  onSelectDay: (day: number | null) => void;
  onDownloadDay?: (day: number) => void;
}

export default function SummaryCards({ summary, totalBooths, selectedDay, onSelectDay, onDownloadDay }: SummaryCardsProps) {
  const totalDistance = summary.reduce((s, d) => s + d.estimated_distance_km, 0);

  return (
    <div className="space-y-4">
      {/* Overview row */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold font-[family-name:var(--font-display)]">{totalBooths}</p>
              <p className="text-xs text-muted-foreground">Total Booths</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'hsl(160 60% 45% / 0.1)' }}>
              <Route className="w-5 h-5" style={{ color: 'hsl(160 60% 45%)' }} />
            </div>
            <div>
              <p className="text-2xl font-bold font-[family-name:var(--font-display)]">{totalDistance.toFixed(0)} km</p>
              <p className="text-xs text-muted-foreground">Total Distance</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'hsl(35 90% 55% / 0.1)' }}>
              <Calendar className="w-5 h-5" style={{ color: 'hsl(35 90% 55%)' }} />
            </div>
            <div>
              <p className="text-2xl font-bold font-[family-name:var(--font-display)]">{summary.length}</p>
              <p className="text-xs text-muted-foreground">Days Planned</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Day chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectDay(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            !selectedDay ? 'bg-foreground text-background shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          All Days
        </button>
        {summary.map(s => (
          <div key={s.day} className="flex items-center gap-1 group">
            <button
              onClick={() => onSelectDay(selectedDay === s.day ? null : s.day)}
              className="px-3 py-1.5 rounded-l-full text-xs font-bold transition-all shadow-sm hover:shadow-md h-9"
              style={{
                backgroundColor: selectedDay === s.day ? getDayColor(s.day) : getDayColor(s.day) + '22',
                color: selectedDay === s.day ? '#fff' : getDayColor(s.day),
                border: `1.5px solid ${getDayColor(s.day)}`,
                borderRight: 'none'
              }}
            >
              Day {s.day} · {s.total_booths} booths
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownloadDay?.(s.day);
              }}
              className="px-2 py-1.5 rounded-r-full text-xs font-bold transition-all shadow-sm hover:shadow-md flex items-center justify-center h-9 border-l-0"
              style={{
                backgroundColor: getDayColor(s.day) + '11',
                color: getDayColor(s.day),
                border: `1.5px solid ${getDayColor(s.day)}`,
              }}
              title={`Download Day ${s.day} Tour Plan`}
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
