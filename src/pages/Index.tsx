import { useState } from 'react';
import { useBoothData } from '@/hooks/useBoothData';
import BoothMap from '@/components/BoothMap';
import BoothTable from '@/components/BoothTable';
import SummaryCards from '@/components/SummaryCards';
import ExportPanel from '@/components/ExportPanel';
import DayCharts from '@/components/DayCharts';
import LocationsList from '@/components/LocationsList';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Search, Loader2, List } from 'lucide-react';

import { exportToExcel, exportToPdf } from '@/lib/exportUtils';

export default function Index() {
  const { data, loading } = useBoothData();
  const [activeTab, setActiveTab] = useState<'20' | '10' | '7' | 'places'>('10');
  const [lastPlanTab, setLastPlanTab] = useState<'20' | '10' | '7'>('10');
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

  const handleTabChange = (v: string) => {
    const newTab = v as '20' | '10' | '7' | 'places';
    if (newTab !== 'places') {
      setLastPlanTab(newTab);
    }
    setActiveTab(newTab);
    setSelectedDay(null);
  };

  const handleSelectLocation = (location: string) => {
    setActiveTab(lastPlanTab);
    setLocationFilter(location);
    setSelectedDay(null);
    // Smooth scroll to table section
    setTimeout(() => {
      const tableSection = document.getElementById('booth-table-section');
      tableSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const planType = activeTab === 'places' ? lastPlanTab : activeTab;
  const booths = 
    planType === '20' ? data.plan_20 : 
    planType === '10' ? data.plan_10 : 
    data.plan_7;
    
  const summary = 
    planType === '20' ? data.summary_20 : 
    planType === '10' ? data.summary_10 : 
    data.summary_7;

  const handleDownloadDay = (day: number) => {
    exportToPdf(booths, planType, day);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Booth Visit Planner</h1>
              <p className="text-xs text-muted-foreground">{data.total_booths} booths · Route optimized</p>
            </div>
          </div>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="bg-muted ring-1 ring-border">
              <TabsTrigger value="20" className="data-[state=active]:bg-card">20-Day Plan</TabsTrigger>
              <TabsTrigger value="10" className="data-[state=active]:bg-card">10-Day Plan</TabsTrigger>
              <TabsTrigger value="7" className="data-[state=active]:bg-card">7-Day Plan</TabsTrigger>
              <TabsTrigger value="places" className="data-[state=active]:bg-card flex items-center gap-2">
                <List className="w-3.5 h-3.5" />
                List Places
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {activeTab !== 'places' ? (
          <>
            {/* Summary */}
            <SummaryCards
              summary={summary}
              totalBooths={data.total_booths}
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
              onDownloadDay={handleDownloadDay}
            />

            {/* Map */}
            {/* Charts */}
            <DayCharts summary={summary} />

            {/* Map */}
            <section className="rounded-xl border border-border overflow-hidden shadow-sm bg-card" style={{ height: '480px' }}>
              <BoothMap booths={booths} selectedDay={selectedDay} totalDays={Number(planType)} />
            </section>

            {/* Filter + Table */}
            <section id="booth-table-section" className="space-y-3 scroll-mt-24">
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Filter by area…"
                    value={locationFilter}
                    onChange={e => setLocationFilter(e.target.value)}
                    className="pl-9 mr-10"
                  />
                  {locationFilter && (
                    <button 
                      onClick={() => setLocationFilter('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground font-medium"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <ExportPanel booths={booths} summary={summary} planLabel={`${planType}_day`} selectedDay={selectedDay} />
              </div>
              <BoothTable booths={booths} selectedDay={selectedDay} locationFilter={locationFilter} />
            </section>
          </>
        ) : (
          <LocationsList 
            locations={data.unique_locations || []} 
            onSelectLocation={handleSelectLocation}
          />
        )}
      </main>
    </div>
  );
}


