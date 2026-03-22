import {Holiday, HOLIDAYS_2026, LongWeekend, LONG_WEEKENDS_2026, getAllNonWorkingDates} from '../data/holidays2026';

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

export interface CutiOpportunity {
  date: string;        // Workday to take as leave
  startDate: string;   // Start of resulting consecutive off block
  endDate: string;     // End of resulting consecutive off block
  totalDays: number;   // Total consecutive days off
  holidayName: string; // Related holiday name
}

export function getCutiOpportunities(): CutiOpportunity[] {
  const nonWorking = getAllNonWorkingDates(2026);
  const holidayMap = new Map<string, Holiday>();
  HOLIDAYS_2026.forEach(h => holidayMap.set(h.date, h));

  const opportunities: CutiOpportunity[] = [];
  const seen = new Set<string>();

  const cur = new Date('2026-01-01T00:00:00');
  const endYear = new Date('2026-12-31T00:00:00');

  while (cur <= endYear) {
    const dateStr = cur.toISOString().split('T')[0];
    const dayOfWeek = cur.getDay();

    // Only consider weekdays not already non-working
    if (dayOfWeek !== 0 && dayOfWeek !== 6 && !nonWorking.has(dateStr) && !seen.has(dateStr)) {
      nonWorking.add(dateStr);

      // Find consecutive run this date would belong to
      let runStart = dateStr;
      let runEnd = dateStr;

      const p = new Date(dateStr + 'T00:00:00');
      p.setDate(p.getDate() - 1);
      while (nonWorking.has(p.toISOString().split('T')[0])) {
        runStart = p.toISOString().split('T')[0];
        p.setDate(p.getDate() - 1);
      }

      const n = new Date(dateStr + 'T00:00:00');
      n.setDate(n.getDate() + 1);
      while (nonWorking.has(n.toISOString().split('T')[0])) {
        runEnd = n.toISOString().split('T')[0];
        n.setDate(n.getDate() + 1);
      }

      const totalDays =
        Math.round(
          (new Date(runEnd + 'T00:00:00').getTime() -
            new Date(runStart + 'T00:00:00').getTime()) /
            (1000 * 60 * 60 * 24),
        ) + 1;

      if (totalDays >= 3) {
        // Run must contain at least one existing holiday (not just weekends)
        const c = new Date(runStart + 'T00:00:00');
        const e = new Date(runEnd + 'T00:00:00');
        const existingHolidays: string[] = [];
        while (c <= e) {
          const d = c.toISOString().split('T')[0];
          if (d !== dateStr && holidayMap.has(d)) {
            existingHolidays.push(d);
          }
          c.setDate(c.getDate() + 1);
        }

        if (existingHolidays.length > 0) {
          const relatedHoliday = holidayMap.get(existingHolidays[0])!;
          opportunities.push({
            date: dateStr,
            startDate: runStart,
            endDate: runEnd,
            totalDays,
            holidayName: relatedHoliday.shortName,
          });
          seen.add(dateStr);
        }
      }

      nonWorking.delete(dateStr);
    }

    cur.setDate(cur.getDate() + 1);
  }

  return opportunities;
}

export const CUTI_OPPORTUNITIES_2026 = getCutiOpportunities();
