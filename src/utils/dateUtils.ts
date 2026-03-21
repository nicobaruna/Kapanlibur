import {Holiday, HOLIDAYS_2026, LongWeekend, LONG_WEEKENDS_2026} from '../data/holidays2026';

const MONTHS_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const DAYS_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const day = DAYS_ID[d.getDay()];
  const date = d.getDate();
  const month = MONTHS_ID[d.getMonth()];
  const year = d.getFullYear();
  return `${day}, ${date} ${month} ${year}`;
}

export function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const date = d.getDate();
  const month = MONTHS_ID[d.getMonth()];
  return `${date} ${month}`;
}

export function formatMonthYear(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return `${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`;
}

export function getDaysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + 'T00:00:00');
  target.setHours(0, 0, 0, 0);
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function isToday(dateStr: string): boolean {
  return getDaysUntil(dateStr) === 0;
}

export function isPast(dateStr: string): boolean {
  return getDaysUntil(dateStr) < 0;
}

export function getNextHoliday(): Holiday | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = HOLIDAYS_2026.filter(h => !isPast(h.date) || isToday(h.date))
    .sort((a, b) => a.date.localeCompare(b.date));

  return upcoming.length > 0 ? upcoming[0] : null;
}

export function getUpcomingHolidays(count: number = 5): Holiday[] {
  return HOLIDAYS_2026
    .filter(h => getDaysUntil(h.date) >= 0)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, count);
}

export function getNextLongWeekend(): LongWeekend | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = LONG_WEEKENDS_2026.filter(lw => {
    const end = new Date(lw.endDate + 'T00:00:00');
    return end >= today;
  });

  return upcoming.length > 0 ? upcoming[0] : null;
}

export function getHolidaysForMonth(year: number, month: number): Holiday[] {
  const monthStr = String(month + 1).padStart(2, '0');
  const prefix = `${year}-${monthStr}`;
  return HOLIDAYS_2026.filter(h => h.date.startsWith(prefix));
}

export function countdownLabel(days: number): string {
  if (days === 0) return 'Hari ini! 🎉';
  if (days === 1) return 'Besok!';
  return `${days} hari lagi`;
}

export function formatLongWeekendRange(lw: LongWeekend): string {
  const start = new Date(lw.startDate + 'T00:00:00');
  const end = new Date(lw.endDate + 'T00:00:00');

  const startDay = start.getDate();
  const endDay = end.getDate();
  const startMonth = MONTHS_ID[start.getMonth()];
  const endMonth = MONTHS_ID[end.getMonth()];

  if (start.getMonth() === end.getMonth()) {
    return `${startDay}–${endDay} ${startMonth}`;
  }
  return `${startDay} ${startMonth} – ${endDay} ${endMonth}`;
}

export function getMonthName(month: number): string {
  return MONTHS_ID[month];
}
