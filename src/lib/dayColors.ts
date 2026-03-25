export const DAY_COLORS: Record<number, string> = {
  1: '#3366cc',
  2: '#2db87e',
  3: '#e6942b',
  4: '#d94870',
  5: '#8855cc',
  6: '#2ba5b8',
  7: '#d96630',
  8: '#4d9945',
  9: '#b84dcc',
  10: '#ccaa00',
};

export function getDayColor(day: number): string {
  return DAY_COLORS[day] || '#888888';
}
