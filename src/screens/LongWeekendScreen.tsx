import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {LONG_WEEKENDS_2026} from '../data/holidays2026';
import {
  formatLongWeekendRange,
  getDaysUntil,
  countdownLabel,
} from '../utils/dateUtils';

const COLORS = {
  red: '#C8102E',
  white: '#FFFFFF',
  bg: '#F7F3EF',
  card: '#FFFFFF',
  text: '#1A1A2E',
  textSub: '#6B7280',
  national: '#C8102E',
  cuti: '#E67E22',
  green: '#27AE60',
  greenLight: '#D5F5E3',
  redLight: '#FDECEA',
  border: '#E8E0D8',
};

const DAY_COLORS = [
  '#C8102E', '#E67E22', '#27AE60', '#2980B9', '#8E44AD',
  '#1ABC9C', '#D35400', '#C0392B',
];

export default function LongWeekendScreen() {
  const navigation = useNavigation<any>();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = LONG_WEEKENDS_2026.filter(lw => {
    const end = new Date(lw.endDate + 'T00:00:00');
    return end >= today;
  });

  const past = LONG_WEEKENDS_2026.filter(lw => {
    const end = new Date(lw.endDate + 'T00:00:00');
    return end < today;
  });

  const renderLW = (lw: typeof LONG_WEEKENDS_2026[0], index: number, isPast: boolean) => {
    const daysUntil = getDaysUntil(lw.startDate);
    const accentColor = DAY_COLORS[index % DAY_COLORS.length];
    const isActive = getDaysUntil(lw.startDate) <= 0 && getDaysUntil(lw.endDate) >= 0;

    return (
      <TouchableOpacity
        key={`${lw.startDate}-${lw.endDate}`}
        activeOpacity={0.85}
        onPress={() =>
          navigation.navigate('Calendar', {selectedDate: lw.startDate})
        }>
      <View
        style={[
          styles.lwCard,
          isPast && styles.lwCardPast,
          isActive && styles.lwCardActive,
        ]}>

        {/* Top accent bar */}
        <View style={[styles.accentBar, {backgroundColor: isPast ? COLORS.border : accentColor}]} />

        <View style={styles.lwCardContent}>
          {/* Header row */}
          <View style={styles.lwHeaderRow}>
            <View style={styles.lwHeaderLeft}>
              <Text style={styles.lwEmoji}>🏖️</Text>
              <View>
                <Text style={[styles.lwLabel, isPast && styles.pastText]}>
                  {lw.label}
                </Text>
                <Text style={styles.lwRange}>
                  📅 {formatLongWeekendRange(lw)}
                </Text>
              </View>
            </View>

            {/* Day count badge */}
            <View
              style={[
                styles.dayBadge,
                {backgroundColor: isPast ? COLORS.border : accentColor},
              ]}>
              <Text style={[styles.dayBadgeNumber, isPast && {color: COLORS.textSub}]}>
                {lw.totalDays}
              </Text>
              <Text style={[styles.dayBadgeText, isPast && {color: COLORS.textSub}]}>
                hari
              </Text>
            </View>
          </View>

          {/* Status / countdown */}
          {!isPast && (
            <View style={styles.countdownRow}>
              {isActive ? (
                <View style={[styles.countdownPill, {backgroundColor: COLORS.greenLight}]}>
                  <Text style={[styles.countdownPillText, {color: COLORS.green}]}>
                    🎉 Sedang berlangsung!
                  </Text>
                </View>
              ) : (
                <View style={[styles.countdownPill, {backgroundColor: `${accentColor}15`}]}>
                  <Text style={[styles.countdownPillText, {color: accentColor}]}>
                    ⏳ {countdownLabel(daysUntil)}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Holiday details */}
          <View style={styles.holidayDetails}>
            {lw.holidays
              .filter((h, idx, arr) => arr.findIndex(x => x.id === h.id) === idx)
              .map(h => (
                <View key={h.id} style={styles.holidayDetailRow}>
                  <Text style={styles.holidayDetailEmoji}>{h.emoji}</Text>
                  <Text
                    style={[
                      styles.holidayDetailName,
                      isPast && styles.pastText,
                    ]}
                    numberOfLines={1}>
                    {h.shortName}
                  </Text>
                  <Text style={styles.holidayDetailDate}>
                    {new Date(h.date + 'T00:00:00').toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </Text>
                </View>
              ))}
          </View>
        </View>
      </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.red} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏖️ Long Weekend 2026</Text>
        <Text style={styles.headerSub}>
          {upcoming.length} long weekend tersisa · Total {LONG_WEEKENDS_2026.length} di 2026
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Summary bar */}
        <View style={styles.summaryBar}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{LONG_WEEKENDS_2026.length}</Text>
            <Text style={styles.summaryLabel}>Total LW</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{upcoming.length}</Text>
            <Text style={styles.summaryLabel}>Tersisa</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>
              {Math.max(...LONG_WEEKENDS_2026.map(lw => lw.totalDays))}
            </Text>
            <Text style={styles.summaryLabel}>Max Hari</Text>
          </View>
        </View>

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Mendatang</Text>
            {upcoming.map((lw, i) => renderLW(lw, i, false))}
          </>
        )}

        {/* Past */}
        {past.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, styles.pastSectionTitle]}>
              Sudah Berlalu
            </Text>
            {past.map((lw, i) => renderLW(lw, i, true))}
          </>
        )}

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
  scrollContent: {
    padding: 16,
  },
  summaryBar: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.red,
  },
  summaryLabel: {
    fontSize: 11,
    color: COLORS.textSub,
    fontWeight: '600',
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    height: 36,
    backgroundColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 10,
    paddingLeft: 2,
  },
  pastSectionTitle: {
    color: COLORS.textSub,
    marginTop: 16,
  },
  lwCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  lwCardPast: {
    opacity: 0.6,
  },
  lwCardActive: {
    borderWidth: 2,
    borderColor: COLORS.green,
  },
  accentBar: {
    height: 5,
    width: '100%',
  },
  lwCardContent: {
    padding: 16,
  },
  lwHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  lwHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  lwEmoji: {
    fontSize: 28,
  },
  lwLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  lwRange: {
    fontSize: 12,
    color: COLORS.textSub,
    marginTop: 2,
  },
  dayBadge: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
    minWidth: 52,
  },
  dayBadgeNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.white,
    lineHeight: 24,
  },
  dayBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
  },
  countdownRow: {
    marginBottom: 10,
  },
  countdownPill: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  countdownPillText: {
    fontSize: 13,
    fontWeight: '700',
  },
  holidayDetails: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
    gap: 6,
  },
  holidayDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  holidayDetailEmoji: {
    fontSize: 16,
  },
  holidayDetailName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  holidayDetailDate: {
    fontSize: 12,
    color: COLORS.textSub,
    fontWeight: '600',
  },
  pastText: {
    color: COLORS.textSub,
  },
  bottomSpace: {
    height: 30,
  },
});
