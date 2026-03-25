import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Booth } from '@/types/booth';
import { getDayColor } from '@/lib/dayColors';

interface BoothMapProps {
  booths: Booth[];
  selectedDay: number | null;
  totalDays: number;
}

export default function BoothMap({ booths, selectedDay, totalDays }: BoothMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapRef.current = L.map(containerRef.current).setView([9.15, 77.43], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(mapRef.current);
    return () => { mapRef.current?.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    // Clear existing layers
    map.eachLayer(layer => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline || layer instanceof L.CircleMarker) {
        map.removeLayer(layer);
      }
    });

    const filtered = selectedDay ? booths.filter(b => b.day === selectedDay) : booths;
    const days = [...new Set(filtered.map(b => b.day))].sort((a, b) => a - b);

    days.forEach(day => {
      const dayBooths = filtered.filter(b => b.day === day).sort((a, b) => a.visit_order - b.visit_order);
      const color = getDayColor(day);

      // Draw route line
      if (dayBooths.length > 1) {
        const latlngs = dayBooths.map(b => [b.lat, b.lng] as [number, number]);
        L.polyline(latlngs, { color, weight: 2.5, opacity: 0.7, dashArray: '8 4' }).addTo(map);
      }

      // Plot markers
      dayBooths.forEach(b => {
        L.circleMarker([b.lat, b.lng], {
          radius: 6,
          fillColor: color,
          color: '#fff',
          weight: 2,
          fillOpacity: 0.9,
        })
          .bindPopup(
            `<div style="font-family:Inter,sans-serif;font-size:13px;max-width:250px">
              <strong style="color:${color}">Day ${b.day} · #${b.visit_order}</strong><br/>
              <span style="font-size:12px">${b.name}</span><br/>
              <span style="font-size:11px;color:#666">${b.lat.toFixed(4)}, ${b.lng.toFixed(4)}</span><br/>
              <span style="font-size:11px;color:#666">${b.assigned_person}</span>
            </div>`
          )
          .addTo(map);
      });
    });

    if (filtered.length > 0) {
      const bounds = L.latLngBounds(filtered.map(b => [b.lat, b.lng]));
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [booths, selectedDay]);

  return <div ref={containerRef} className="w-full h-full min-h-[400px]" />;
}
