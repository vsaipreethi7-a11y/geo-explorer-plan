import { useState, useEffect } from 'react';
import type { BoothData } from '@/types/booth';

export function useBoothData() {
  const [data, setData] = useState<BoothData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/booth_data.json')
      .then(r => r.json())
      .then((d: BoothData) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return { data, loading };
}
