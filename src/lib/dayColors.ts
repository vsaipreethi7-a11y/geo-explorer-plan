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
  11: '#6633cc',
  12: '#b82d7e',
  13: '#2b94e6',
  14: '#7048d9',
  15: '#cc5588',
  16: '#b8a52b',
  17: '#3066d9',
  18: '#45994d',
  19: '#cc4db8',
  20: '#00aacc',
};

export function getDayColor(day: number): string {
  return DAY_COLORS[day] || '#888888';
}
