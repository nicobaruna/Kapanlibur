export type HolidayType = 'nasional' | 'cuti_bersama';

export interface Holiday {
  id: string;
  date: string; // YYYY-MM-DD
  name: string;
  shortName: string;
  type: HolidayType[];
  emoji: string;
}

export interface LongWeekend {
  startDate: string;
  endDate: string;
  totalDays: number;
  label: string;
  holidays: Holiday[];
}

export const HOLIDAYS_2026: Holiday[] = [
  // ============ HARI LIBUR NASIONAL ============
  {
    id: 'thn-baru',
    date: '2026-01-01',
    name: 'Tahun Baru 2026 Masehi',
    shortName: 'Tahun Baru',
    type: ['nasional'],
    emoji: '🎉',
  },
  {
    id: 'isra-mikraj',
    date: '2026-01-16',
    name: 'Isra Mikraj Nabi Muhammad SAW',
    shortName: 'Isra Mikraj',
    type: ['nasional'],
    emoji: '🌙',
  },
  {
    id: 'imlek',
    date: '2026-02-17',
    name: 'Tahun Baru Imlek 2577 Kongzili',
    shortName: 'Imlek',
    type: ['nasional'],
    emoji: '🧧',
  },
  {
    id: 'nyepi',
    date: '2026-03-19',
    name: 'Hari Suci Nyepi Tahun Baru Saka 1948',
    shortName: 'Nyepi',
    type: ['nasional'],
    emoji: '🕯️',
  },
  {
    id: 'idul-fitri-1',
    date: '2026-03-21',
    name: 'Hari Raya Idul Fitri 1447 H (Hari 1)',
    shortName: 'Idul Fitri H-1',
    type: ['nasional'],
    emoji: '🌙',
  },
  {
    id: 'idul-fitri-2',
    date: '2026-03-22',
    name: 'Hari Raya Idul Fitri 1447 H (Hari 2)',
    shortName: 'Idul Fitri H-2',
    type: ['nasional'],
    emoji: '🌙',
  },
  {
    id: 'wafat-yesus',
    date: '2026-04-03',
    name: 'Wafat Yesus Kristus (Jumat Agung)',
    shortName: 'Jumat Agung',
    type: ['nasional'],
    emoji: '✝️',
  },
  {
    id: 'paskah',
    date: '2026-04-05',
    name: 'Kebangkitan Yesus Kristus (Paskah)',
    shortName: 'Paskah',
    type: ['nasional'],
    emoji: '✝️',
  },
  {
    id: 'buruh',
    date: '2026-05-01',
    name: 'Hari Buruh Internasional',
    shortName: 'Hari Buruh',
    type: ['nasional'],
    emoji: '⚒️',
  },
  {
    id: 'kenaikan-yesus',
    date: '2026-05-14',
    name: 'Kenaikan Yesus Kristus',
    shortName: 'Kenaikan Yesus',
    type: ['nasional'],
    emoji: '✝️',
  },
  {
    id: 'idul-adha',
    date: '2026-05-27',
    name: 'Hari Raya Idul Adha 1447 H',
    shortName: 'Idul Adha',
    type: ['nasional'],
    emoji: '🐑',
  },
  {
    id: 'waisak',
    date: '2026-05-31',
    name: 'Hari Raya Waisak 2570 BE',
    shortName: 'Waisak',
    type: ['nasional'],
    emoji: '☸️',
  },
  {
    id: 'pancasila',
    date: '2026-06-01',
    name: 'Hari Lahir Pancasila',
    shortName: 'Hari Pancasila',
    type: ['nasional'],
    emoji: '🦅',
  },
  {
    id: 'tahun-baru-islam',
    date: '2026-06-16',
    name: 'Tahun Baru Islam 1448 Hijriah',
    shortName: 'Tahun Baru Islam',
    type: ['nasional'],
    emoji: '🌙',
  },
  {
    id: 'kemerdekaan',
    date: '2026-08-17',
    name: 'Hari Proklamasi Kemerdekaan Republik Indonesia',
    shortName: 'HUT RI ke-81',
    type: ['nasional'],
    emoji: '🇮🇩',
  },
  {
    id: 'maulid-nabi',
    date: '2026-08-25',
    name: 'Maulid Nabi Muhammad SAW',
    shortName: 'Maulid Nabi',
    type: ['nasional'],
    emoji: '🌙',
  },
  {
    id: 'natal',
    date: '2026-12-25',
    name: 'Hari Raya Natal / Kelahiran Yesus Kristus',
    shortName: 'Natal',
    type: ['nasional'],
    emoji: '🎄',
  },

  // ============ CUTI BERSAMA ============
  {
    id: 'cuti-imlek',
    date: '2026-02-16',
    name: 'Cuti Bersama Tahun Baru Imlek 2577',
    shortName: 'Cuti Imlek',
    type: ['cuti_bersama'],
    emoji: '🧧',
  },
  {
    id: 'cuti-nyepi',
    date: '2026-03-18',
    name: 'Cuti Bersama Hari Suci Nyepi',
    shortName: 'Cuti Nyepi',
    type: ['cuti_bersama'],
    emoji: '🕯️',
  },
  {
    id: 'cuti-idul-fitri-1',
    date: '2026-03-20',
    name: 'Cuti Bersama Idul Fitri 1447 H',
    shortName: 'Cuti Lebaran',
    type: ['cuti_bersama'],
    emoji: '🌙',
  },
  {
    id: 'cuti-idul-fitri-2',
    date: '2026-03-23',
    name: 'Cuti Bersama Idul Fitri 1447 H',
    shortName: 'Cuti Lebaran',
    type: ['cuti_bersama'],
    emoji: '🌙',
  },
  {
    id: 'cuti-idul-fitri-3',
    date: '2026-03-24',
    name: 'Cuti Bersama Idul Fitri 1447 H',
    shortName: 'Cuti Lebaran',
    type: ['cuti_bersama'],
    emoji: '🌙',
  },
  {
    id: 'cuti-kenaikan-yesus',
    date: '2026-05-15',
    name: 'Cuti Bersama Kenaikan Yesus Kristus',
    shortName: 'Cuti Kenaikan',
    type: ['cuti_bersama'],
    emoji: '✝️',
  },
  {
    id: 'cuti-idul-adha',
    date: '2026-05-28',
    name: 'Cuti Bersama Idul Adha 1447 H',
    shortName: 'Cuti Idul Adha',
    type: ['cuti_bersama'],
    emoji: '🐑',
  },
  {
    id: 'cuti-natal',
    date: '2026-12-24',
    name: 'Cuti Bersama Hari Raya Natal',
    shortName: 'Cuti Natal',
    type: ['cuti_bersama'],
    emoji: '🎄',
  },
];

// Get all non-working dates (holidays + weekends)
export function getAllNonWorkingDates(year: number = 2026): Set<string> {
  const nonWorking = new Set<string>();

  // Add all holiday dates
  HOLIDAYS_2026.forEach(h => nonWorking.add(h.date));

  // Add all Saturdays and Sundays
  const d = new Date(year, 0, 1);
  while (d.getFullYear() === year) {
    const day = d.getDay();
    if (day === 0 || day === 6) {
      nonWorking.add(d.toISOString().split('T')[0]);
    }
    d.setDate(d.getDate() + 1);
  }

  return nonWorking;
}

// Detect long weekends (3+ consecutive non-working days containing at least 1 weekday holiday)
export function detectLongWeekends(): LongWeekend[] {
  const nonWorking = getAllNonWorkingDates(2026);
  const holidayMap = new Map<string, Holiday>();
  HOLIDAYS_2026.forEach(h => holidayMap.set(h.date, h));

  const longWeekends: LongWeekend[] = [];
  const visited = new Set<string>();

  const sortedDates = Array.from(nonWorking).sort();

  for (const startDate of sortedDates) {
    if (visited.has(startDate)) continue;

    // Find consecutive run
    const run: string[] = [];
    const cur = new Date(startDate + 'T00:00:00');
    while (nonWorking.has(cur.toISOString().split('T')[0])) {
      run.push(cur.toISOString().split('T')[0]);
      visited.add(cur.toISOString().split('T')[0]);
      cur.setDate(cur.getDate() + 1);
    }

    if (run.length >= 3) {
      // Check if contains at least one weekday holiday
      const hasWeekdayHoliday = run.some(d => {
        const dow = new Date(d + 'T00:00:00').getDay();
        return dow !== 0 && dow !== 6 && holidayMap.has(d);
      });

      if (hasWeekdayHoliday) {
        const holidays = run
          .filter(d => holidayMap.has(d))
          .map(d => holidayMap.get(d)!);

        // Create label
        const names = [...new Set(holidays.map(h => h.shortName))];
        const label =
          names.length === 1
            ? names[0]
            : names.length === 2
            ? `${names[0]} & ${names[1]}`
            : `${names[0]}, ${names[1]} & lainnya`;

        longWeekends.push({
          startDate: run[0],
          endDate: run[run.length - 1],
          totalDays: run.length,
          label,
          holidays,
        });
      }
    }
  }

  return longWeekends;
}

export const LONG_WEEKENDS_2026 = detectLongWeekends();
