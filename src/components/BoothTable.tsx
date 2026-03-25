import type { Booth } from '@/types/booth';
import { getDayColor } from '@/lib/dayColors';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

interface BoothTableProps {
  booths: Booth[];
  selectedDay: number | null;
  locationFilter: string;
}

export default function BoothTable({ booths, selectedDay, locationFilter }: BoothTableProps) {
  let filtered = booths;
  if (selectedDay) filtered = filtered.filter(b => b.day === selectedDay);
  if (locationFilter) filtered = filtered.filter(b => b.location.toLowerCase().includes(locationFilter.toLowerCase()));
  filtered = [...filtered].sort((a, b) => a.day - b.day || a.visit_order - b.visit_order);

  return (
    <div className="overflow-auto max-h-[500px] rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold w-16">Day</TableHead>
            <TableHead className="font-semibold">Booth Name</TableHead>
            <TableHead className="font-semibold w-20">Lat</TableHead>
            <TableHead className="font-semibold w-20">Lng</TableHead>
            <TableHead className="font-semibold w-16">Order</TableHead>
            <TableHead className="font-semibold w-28">Person</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map(b => (
            <TableRow key={`${b.id}-${b.day}`} className="hover:bg-muted/30 transition-colors">
              <TableCell>
                <span
                  className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold"
                  style={{ backgroundColor: getDayColor(b.day), color: '#fff' }}
                >
                  {b.day}
                </span>
              </TableCell>
              <TableCell className="text-sm max-w-[300px] truncate">{b.name}</TableCell>
              <TableCell className="text-xs text-muted-foreground font-mono">{b.lat.toFixed(4)}</TableCell>
              <TableCell className="text-xs text-muted-foreground font-mono">{b.lng.toFixed(4)}</TableCell>
              <TableCell className="text-center font-medium">{b.visit_order}</TableCell>
              <TableCell className="text-sm">{b.assigned_person}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {filtered.length === 0 && (
        <p className="text-center py-8 text-muted-foreground">No booths match the current filter.</p>
      )}
    </div>
  );
}
