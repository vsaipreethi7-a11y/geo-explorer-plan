export interface Booth {
  id: number;
  name: string;
  location: string;
  lat: number;
  lng: number;
  geocoded: boolean;
  day: number;
  visit_order: number;
  assigned_person: string;
}

export interface DaySummary {
  day: number;
  total_booths: number;
  estimated_distance_km: number;
}

export interface BoothData {
  plan_20: Booth[];
  plan_10: Booth[];
  plan_7: Booth[];
  summary_20: DaySummary[];
  summary_10: DaySummary[];
  summary_7: DaySummary[];
  unique_locations: string[];
  total_booths: number;
}
