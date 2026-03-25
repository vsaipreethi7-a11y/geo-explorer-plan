import { useState } from 'react';
import { useBoothData } from '@/hooks/useBoothData';
import BoothMap from '@/components/BoothMap';
import BoothTable from '@/components/BoothTable';
import SummaryCards from '@/components/SummaryCards';
import ExportPanel from '@/components/ExportPanel';
import DayCharts from '@/components/DayCharts';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Search, Loader2 } from 'lucide-react';

export default function Index() {
  const { data, loading } = useBoothData();
  const [planType, setPlanType] = useState<'10' | '7'>('10');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [locationFilter, setLocationFilter] = useState('');

  if (loading || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Loading booth data…</span>
      </div>
    );
  }

  const booths = planType === '10' ? data.plan_10 : data.plan_7;
  const summary = planType === '10' ? data.summary_10 : data.summary_7;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary text-primary-foreground">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Booth Visit Planner</h1>
              <p className="text-xs text-muted-foreground">{data.total_booths} booths · Route optimized</p>
            </div>
          </div>
          <Tabs value={planType} onValueChange={v => { setPlanType(v as '10' | '7'); setSelectedDay(null); }}>
            <TabsList>
              <TabsTrigger value="10">10-Day Plan</TabsTrigger>
              <TabsTrigger value="7">7-Day Plan</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Summary */}
        <SummaryCards
          summary={summary}
          totalBooths={data.total_booths}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
        />

        {/* Map */}
        {/* Charts */}
        <DayCharts summary={summary} />

        {/* Map */}
        <section className="rounded-xl border border-border overflow-hidden shadow-sm bg-card" style={{ height: '480px' }}>
          <BoothMap booths={booths} selectedDay={selectedDay} totalDays={Number(planType)} />
        </section>

        {/* Filter + Table */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Filter by area…"
                value={locationFilter}
                onChange={e => setLocationFilter(e.target.value)}
                className="pl-9"
              />
            </div>
            <ExportPanel booths={booths} summary={summary} planLabel={`${planType}_day`} />
          </div>
          <BoothTable booths={booths} selectedDay={selectedDay} locationFilter={locationFilter} />
        </section>
      </main>
    </div>
  );
}
