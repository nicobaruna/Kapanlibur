import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import {Calendar, DateData} from 'react-native-calendars';
import {HOLIDAYS_2026, LONG_WEEKENDS_2026, Holiday} from '../data/holidays2026';
import {formatDate, formatMonthYear, getDaysUntil} from '../utils/dateUtils';

const COLORS = {
  red: '#C8102E',
  redDark: '#A00C24',
  white: '#FFFFFF',
  bg: '#F7F3EF',
  card: '#FFFFFF',
  text: '#1A1A2E',
  textSub: '#6B7280',
  national: '#C8102E',
  cuti: '#E67E22',
  longweekend: '#27AE60',
  border: '#E8E0D8',
};

type MarkedDates = {
  [key: string]: {
    selected?: boolean;
    marked?: boolean;
    dotColor?: string;
    selectedColor?: string;
    customStyles?: object;
    dots?: Array<{key: string; color: string; selectedDotColor?: string}>;
  };
};

export default function CalendarScreen() {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Build marked dates for calendar
  const markedDates = useMemo<MarkedDates>(() => {
    const marks: MarkedDates = {};

    // Mark all long weekend days with green background
    LONG_WEEKENDS_2026.forEach(lw => {
      const cur = new Date(lw.startDate + 'T00:00:00');
      const end = new Date(lw.endDate + 'T00:00:00');
      while (cur <= end) {
        const key = cur.toISOString().split('T')[0];
        if (!marks[key]) marks[key] = {dots: []};
        if (!marks[key].dots) marks[key].dots = [];
        marks[key].dots!.push({
          key: 'lw',
          color: COLORS.longweekend,
          selectedDotColor: COLORS.white,
        });
        cur.setDate(cur.getDate() + 1);
      }
    });

    // Mark holidays
    HOLIDAYS_2026.forEach(h => {
      const key = h.date;
      if (!marks[key]) marks[key] = {dots: []};
      if (!marks[key].dots) marks[key].dots = [];

      const isCuti = h.type.includes('cuti_bersama');
      const isNasional = h.type.includes('nasional');

      const dotColor = isCuti && !isNasional ? COLORS.cuti : COLORS.national;
      const dotKey = isNasional ? 'nasional' : 'cuti';

      // Remove duplicate dot keys
      const existingKeys = marks[key].dots!.map(d => d.key);
      if (!existingKeys.includes(dotKey)) {
        marks[key].dots!.push({
          key: dotKey,
          color: dotColor,
          selectedDotColor: COLORS.white,
        });
      }
    });

    // Mark selected date
    if (selectedDate) {
      if (!marks[selectedDate]) marks[selectedDate] = {};
      marks[selectedDate].selected = true;
      marks[selectedDate].selectedColor = COLORS.red;
    }

    // Mark today
    if (!selectedDate || selectedDate !== today) {
      if (!marks[today]) marks[today] = {};
      // Today gets a mild highlight if not selected
    }

    return marks;
  }, [selectedDate]);

  // Get holidays for selected date
  const selectedHolidays = useMemo<Holiday[]>(() => {
    if (!selectedDate) return [];
    return HOLIDAYS_2026.filter(h => h.date === selectedDate);
  }, [selectedDate]);

  // All months in 2026 that have holidays
  const monthsWithHolidays = useMemo(() => {
    const months = new Set<string>();
    HOLIDAYS_2026.forEach(h => {
      months.add(h.date.substring(0, 7));
    });
    return Array.from(months).sort();
  }, []);

  const onDayPress = (day: DateData) => {
    setSelectedDate(prev => (prev === day.dateString ? null : day.dateString));
  };

  const renderSelectedInfo = () => {
    if (!selectedDate) return null;

    if (selectedHolidays.length === 0) {
      return (
        <View style={styles.selectedInfoCard}>
          <Text style={styles.selectedDateText}>{formatDate(selectedDate)}</Text>
          <Text style={styles.noHolidayText}>Hari kerja biasa</Text>
        </View>
      );
    }

    return (
      <View style={styles.selectedInfoCard}>
        <Text style={styles.selectedDateText}>{formatDate(selectedDate)}</Text>
        {selectedHolidays.map(h => (
          <View key={h.id} style={styles.selectedHolidayRow}>
            <Text style={styles.selectedHolidayEmoji}>{h.emoji}</Text>
            <View style={styles.selectedHolidayInfo}>
              <Text style={styles.selectedHolidayName}>{h.name}</Text>
              <View style={styles.selectedBadgeRow}>
                {h.type.includes('nasional') && (
                  <View style={[styles.badge, {backgroundColor: COLORS.national}]}>
                    <Text style={styles.badgeText}>Libur Nasional</Text>
                  </View>
                )}
                {h.type.includes('cuti_bersama') && (
                  <View style={[styles.badge, {backgroundColor: COLORS.cuti}]}>
                    <Text style={styles.badgeText}>Cuti Bersama</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        ))}
        <Text style={styles.selectedCountdown}>
          ⏳ {getDaysUntil(selectedDate) > 0
            ? `${getDaysUntil(selectedDate)} hari lagi`
            : getDaysUntil(selectedDate) === 0
            ? '🎉 Hari ini!'
            : 'Sudah berlalu'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.red} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>📅 Kalender Libur 2026</Text>
        <Text style={styles.headerSub}>Ketuk tanggal untuk melihat detail</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: COLORS.national}]} />
            <Text style={styles.legendText}>Libur Nasional</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: COLORS.cuti}]} />
            <Text style={styles.legendText}>Cuti Bersama</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: COLORS.longweekend}]} />
            <Text style={styles.legendText}>Long Weekend</Text>
          </View>
        </View>

        {/* Calendar */}
        <Calendar
          markingType="multi-dot"
          markedDates={markedDates}
          onDayPress={onDayPress}
          initialDate={today}
          minDate="2026-01-01"
          maxDate="2026-12-31"
          theme={{
            backgroundColor: COLORS.bg,
            calendarBackground: COLORS.card,
            textSectionTitleColor: COLORS.textSub,
            selectedDayBackgroundColor: COLORS.red,
            selectedDayTextColor: COLORS.white,
            todayTextColor: COLORS.red,
            dayTextColor: COLORS.text,
            textDisabledColor: COLORS.border,
            dotColor: COLORS.red,
            selectedDotColor: COLORS.white,
            arrowColor: COLORS.red,
            monthTextColor: COLORS.text,
            indicatorColor: COLORS.red,
            textDayFontWeight: '600',
            textMonthFontWeight: '800',
            textDayHeaderFontWeight: '700',
            textDayFontSize: 14,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 12,
          }}
          style={styles.calendar}
        />

        {/* Selected date info */}
        {renderSelectedInfo()}

        {/* All holidays list by month */}
        <View style={styles.allHolidaysSection}>
          <Text style={styles.allHolidaysTitle}>Semua Hari Libur & Cuti 2026</Text>

          {monthsWithHolidays.map(monthKey => {
            const monthHolidays = HOLIDAYS_2026.filter(h =>
              h.date.startsWith(monthKey),
            );
            const [year, month] = monthKey.split('-');
            const monthDate = new Date(parseInt(year), parseInt(month) - 1, 1);
            const monthName = monthDate.toLocaleDateString('id-ID', {
              month: 'long',
              year: 'numeric',
            });

            return (
              <View key={monthKey} style={styles.monthGroup}>
                <Text style={styles.monthGroupTitle}>{monthName}</Text>
                {monthHolidays.map(h => (
                  <TouchableOpacity
                    key={h.id}
                    style={styles.listHolidayRow}
                    onPress={() => setSelectedDate(h.date)}
                    activeOpacity={0.7}>
                    <View
                      style={[
                        styles.listColorBar,
                        {
                          backgroundColor:
                            h.type.includes('nasional')
                              ? COLORS.national
                              : COLORS.cuti,
                        },
                      ]}
                    />
                    <Text style={styles.listEmoji}>{h.emoji}</Text>
                    <View style={styles.listInfo}>
                      <Text style={styles.listName}>{h.shortName}</Text>
                      <Text style={styles.listDate}>{formatDate(h.date)}</Text>
                    </View>
                    {getDaysUntil(h.date) >= 0 && (
                      <Text style={styles.listCountdown}>
                        {getDaysUntil(h.date) === 0
                          ? 'Hari ini'
                          : `${getDaysUntil(h.date)}h`}
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            );
          })}
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    backgroundColor: COLORS.red,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 + 12 : 12,
    paddingBottom: 16,
    paddingHorizontal: 20,
    elevation: 4,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '800',
  },
  headerSub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 2,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 11,
    color: COLORS.textSub,
    fontWeight: '600',
  },
  calendar: {
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  selectedInfoCard: {
    margin: 16,
    marginBottom: 8,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 3,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.red,
  },
  selectedDateText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  noHolidayText: {
    color: COLORS.textSub,
    fontSize: 13,
  },
  selectedHolidayRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  selectedHolidayEmoji: {
    fontSize: 24,
    marginTop: 2,
  },
  selectedHolidayInfo: {
    flex: 1,
  },
  selectedHolidayName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  selectedBadgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
  selectedCountdown: {
    color: COLORS.redDark,
    fontWeight: '700',
    fontSize: 13,
    marginTop: 6,
  },
  allHolidaysSection: {
    padding: 16,
    paddingTop: 8,
  },
  allHolidaysTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 12,
  },
  monthGroup: {
    marginBottom: 16,
  },
  monthGroupTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textSub,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
    paddingLeft: 4,
  },
  listHolidayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 10,
    marginBottom: 6,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 2,
    paddingRight: 12,
  },
  listColorBar: {
    width: 4,
    alignSelf: 'stretch',
    marginRight: 10,
  },
  listEmoji: {
    fontSize: 18,
    marginRight: 8,
    paddingVertical: 10,
  },
  listInfo: {
    flex: 1,
    paddingVertical: 10,
  },
  listName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  listDate: {
    fontSize: 11,
    color: COLORS.textSub,
    marginTop: 1,
  },
  listCountdown: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.red,
  },
  bottomSpace: {
    height: 30,
  },
});
