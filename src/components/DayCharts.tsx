import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { DaySummary } from '@/types/booth';
import { getDayColor } from '@/lib/dayColors';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DayChartsProps {
  summary: DaySummary[];
}

export default function DayCharts({ summary }: DayChartsProps) {
  const data = summary.map(s => ({
    name: `Day ${s.day}`,
    day: s.day,
    booths: s.total_booths,
    distance: Number(s.estimated_distance_km.toFixed(1)),
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-card border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">Booths per Day</CardTitle>
        </CardHeader>
        <CardContent className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
              <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid hsl(var(--border))' }}
              />
              <Bar dataKey="booths" radius={[4, 4, 0, 0]}>
                {data.map(entry => (
                  <Cell key={entry.day} fill={getDayColor(entry.day)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-card border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">Distance per Day (km)</CardTitle>
        </CardHeader>
        <CardContent className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
              <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid hsl(var(--border))' }}
                formatter={(value: number) => [`${value} km`, 'Distance']}
              />
              <Bar dataKey="distance" radius={[4, 4, 0, 0]}>
                {data.map(entry => (
                  <Cell key={entry.day} fill={getDayColor(entry.day)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
