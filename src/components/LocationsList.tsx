import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Search, Copy, Check, Info } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface LocationsListProps {
  locations: string[];
  onSelectLocation: (location: string) => void;
}

export default function LocationsList({ locations, onSelectLocation }: LocationsListProps) {
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);

  const filtered = locations.filter(l => 
    l.toLowerCase().includes(search.toLowerCase())
  ).sort();

  const handleCopy = () => {
    navigator.clipboard.writeText(locations.sort().join('\n'));
    setCopied(true);
    toast.success('List of places copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Areas Covered</h2>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
            <Info className="w-3.5 h-3.5" />
            Click on any area to view its booths in the plan.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search areas..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-10 bg-card"
            />
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-10 w-10 shrink-0"
            onClick={handleCopy}
            title="Copy all locations to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <Card className="border-border shadow-sm bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filtered.map((location, i) => (
              <button 
                key={i} 
                onClick={() => onSelectLocation(location)}
                className="bg-card hover:bg-primary/5 hover:border-primary/30 transition-all p-3 rounded-xl border border-border shadow-sm hover:shadow-md hover:-translate-y-1 group text-left w-full active:scale-95"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold truncate" title={location}>{location}</span>
                </div>
              </button>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="p-4 rounded-full bg-muted mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No places found</h3>
              <p className="text-muted-foreground">Try adjusting your search terms.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


