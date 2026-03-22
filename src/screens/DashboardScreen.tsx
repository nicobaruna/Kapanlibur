import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Holiday, LongWeekend} from '../data/holidays2026';
import {
  getNextHoliday,
  getUpcomingHolidays,
  getNextLongWeekend,
  getDaysUntil,
  formatDate,
  formatShortDate,
  formatLongWeekendRange,
  countdownLabel,
  CUTI_OPPORTUNITIES_2026,
  CutiOpportunity,
} from '../utils/dateUtils';
import {NotificationService} from '../services/NotificationService';

const COLORS = {
  red: '#C8102E',
  redDark: '#A00C24',
  redLight: '#FF3350',
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

export default function DashboardScreen() {
  const [nextHoliday, setNextHoliday] = useState<Holiday | null>(null);
  const [upcomingHolidays, setUpcomingHolidays] = useState<Holiday[]>([]);
  const [nextLongWeekend, setNextLongWeekend] = useState<LongWeekend | null>(null);
  const [cutiRecommendations, setCutiRecommendations] = useState<CutiOpportunity[]>([]);
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(() => {
    setNextHoliday(getNextHoliday());
    setUpcomingHolidays(getUpcomingHolidays(6));
    setNextLongWeekend(getNextLongWeekend());
    const upcoming = CUTI_OPPORTUNITIES_2026
      .filter(opp => getDaysUntil(opp.date) >= 0)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5);
    setCutiRecommendations(upcoming);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
    setTimeout(() => setRefreshing(false), 500);
  }, [loadData]);

  const handleEnableNotifications = async () => {
    setLoading(true);
    try {
      const granted = await NotificationService.requestPermission();
      if (!granted) {
        Alert.alert(
          'Izin Diperlukan',
          'Mohon aktifkan izin notifikasi di pengaturan perangkat untuk mendapatkan pengingat hari libur.',
        );
        setLoading(false);
        return;
      }
      // Schedule reminders — tolerate failures (e.g. exact alarm permission not granted yet)
      try {
        await NotificationService.scheduleAllReminders();
      } catch (scheduleErr) {
        console.warn('[Notifee] scheduleAllReminders failed:', scheduleErr);
      }
      await NotificationService.showTestNotification();
      setNotifEnabled(true);
      Alert.alert(
        '✅ Berhasil!',
        'Notifikasi H-7 dan H-1 sebelum setiap hari libur sudah diaktifkan.',
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      Alert.alert('Gagal Mengaktifkan Notifikasi', msg);
      console.error('[Notifee] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const daysUntilNext = nextHoliday ? getDaysUntil(nextHoliday.date) : null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.red} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🇮🇩 Libur Indonesia</Text>
        <Text style={styles.headerSub}>Kalender BI 2026</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}>

        {/* ===== MAIN COUNTDOWN CARD ===== */}
        {nextHoliday ? (
          <View style={styles.countdownCard}>
            <Text style={styles.countdownEmoji}>{nextHoliday.emoji}</Text>
            <Text style={styles.countdownLabel}>Libur Berikutnya</Text>
            <Text style={styles.countdownName}>{nextHoliday.shortName}</Text>
            <Text style={styles.countdownDate}>{formatDate(nextHoliday.date)}</Text>

            <View style={styles.countdownBadge}>
              <Text style={styles.countdownDays}>
                {daysUntilNext === 0
                  ? '🎉 Hari ini!'
                  : daysUntilNext === 1
                  ? '⏰ Besok!'
                  : `${daysUntilNext}`}
              </Text>
              {daysUntilNext !== null && daysUntilNext > 1 && (
                <Text style={styles.countdownDaysLabel}>hari lagi</Text>
              )}
            </View>

            <View style={styles.typeBadgesRow}>
              {nextHoliday.type.includes('nasional') && (
                <View style={[styles.typeBadge, {backgroundColor: 'rgba(255,255,255,0.25)'}]}>
                  <Text style={styles.typeBadgeText}>🏛 Libur Nasional</Text>
                </View>
              )}
              {nextHoliday.type.includes('cuti_bersama') && (
                <View style={[styles.typeBadge, {backgroundColor: 'rgba(255,200,0,0.3)'}]}>
                  <Text style={styles.typeBadgeText}>📅 Cuti Bersama</Text>
                </View>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.countdownCard}>
            <Text style={styles.countdownEmoji}>✅</Text>
            <Text style={styles.countdownName}>Semua libur 2026 selesai!</Text>
          </View>
        )}

        {/* ===== LONG WEEKEND CARD ===== */}
        {nextLongWeekend && (
          <View style={styles.longWeekendCard}>
            <View style={styles.lwHeader}>
              <Text style={styles.lwIcon}>🏖️</Text>
              <View>
                <Text style={styles.lwTitle}>Long Weekend Berikutnya</Text>
                <Text style={styles.lwLabel}>{nextLongWeekend.label}</Text>
              </View>
              <View style={styles.lwDaysBadge}>
                <Text style={styles.lwDaysNumber}>{nextLongWeekend.totalDays}</Text>
                <Text style={styles.lwDaysText}>hari</Text>
              </View>
            </View>
            <Text style={styles.lwRange}>
              📅 {formatLongWeekendRange(nextLongWeekend)}
            </Text>
            <Text style={styles.lwCountdown}>
              ⏳ {countdownLabel(getDaysUntil(nextLongWeekend.startDate))}
            </Text>
          </View>
        )}

        {/* ===== REKOMENDASI CUTI ===== */}
        {cutiRecommendations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💡 Rekomendasi Ambil Cuti</Text>
            <Text style={styles.cutiRecomSub}>
              Cuti 1 hari, dapat libur panjang!
            </Text>
            {cutiRecommendations.map(opp => {
              const days = getDaysUntil(opp.date);
              return (
                <View key={opp.date} style={styles.cutiRecomRow}>
                  <View style={styles.cutiRecomLeft}>
                    <View style={styles.cutiRecomDot} />
                  </View>
                  <View style={styles.cutiRecomContent}>
                    <View style={styles.cutiRecomHeader}>
                      <Text style={styles.cutiRecomDate}>
                        {formatDate(opp.date)}
                      </Text>
                      <View style={styles.cutiRecomBadge}>
                        <Text style={styles.cutiRecomBadgeText}>
                          {opp.totalDays} hari
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.cutiRecomInfo}>
                      {formatShortDate(opp.startDate)} –{' '}
                      {formatShortDate(opp.endDate)} · {opp.holidayName}
                    </Text>
                    <Text style={styles.cutiRecomCountdown}>
                      {days === 0
                        ? '🎉 Hari ini!'
                        : days === 1
                        ? '⏰ Besok!'
                        : `⏳ ${days} hari lagi`}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* ===== UPCOMING HOLIDAYS ===== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Jadwal Libur Mendatang</Text>

          {upcomingHolidays.map((holiday, index) => {
            const days = getDaysUntil(holiday.date);
            const isNasional = holiday.type.includes('nasional');
            const isCuti = holiday.type.includes('cuti_bersama');

            return (
              <View key={holiday.id} style={styles.holidayRow}>
                <View
                  style={[
                    styles.holidayColorBar,
                    {backgroundColor: isCuti ? COLORS.cuti : COLORS.national},
                  ]}
                />
                <View style={styles.holidayInfo}>
                  <Text style={styles.holidayEmoji}>{holiday.emoji}</Text>
                  <View style={styles.holidayText}>
                    <Text style={styles.holidayName} numberOfLines={1}>
                      {holiday.shortName}
                    </Text>
                    <Text style={styles.holidayDate}>
                      {formatDate(holiday.date)}
                    </Text>
                  </View>
                  <View style={styles.holidayCountdown}>
                    <Text
                      style={[
                        styles.holidayDays,
                        days <= 7 && {color: COLORS.red},
                      ]}>
                      {days === 0 ? 'Hari ini' : days === 1 ? 'Besok' : `${days}h`}
                    </Text>
                    <Text style={styles.holidayDaysLabel}>
                      {days > 1 ? 'lagi' : ''}
                    </Text>
                  </View>
                </View>
                {isCuti && (
                  <View style={styles.cutiTag}>
                    <Text style={styles.cutiTagText}>Cuti</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* ===== NOTIFICATION BUTTON ===== */}
        <View style={styles.notifSection}>
          <Text style={styles.notifTitle}>🔔 Aktifkan Pengingat</Text>
          <Text style={styles.notifDesc}>
            Dapatkan notifikasi otomatis H-7 dan H-1 sebelum setiap hari libur nasional dan cuti bersama.
          </Text>
          <TouchableOpacity
            style={[
              styles.notifButton,
              notifEnabled && styles.notifButtonEnabled,
            ]}
            onPress={notifEnabled ? undefined : handleEnableNotifications}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color={COLORS.white} size="small" />
            ) : (
              <Text style={styles.notifButtonText}>
                {notifEnabled ? '✅ Pengingat Aktif' : '🔔 Aktifkan Pengingat'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Data resmi Bank Indonesia 2026{'\n'}
            Sumber: Keputusan Bersama Menteri RI
          </Text>
        </View>
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
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerSub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },

  // Countdown card
  countdownCard: {
    backgroundColor: COLORS.red,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 6,
    shadowColor: COLORS.red,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  countdownEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  countdownLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  countdownName: {
    color: COLORS.white,
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 4,
  },
  countdownDate: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  countdownBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 50,
    paddingHorizontal: 28,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 14,
    minWidth: 120,
  },
  countdownDays: {
    color: COLORS.white,
    fontSize: 34,
    fontWeight: '900',
    lineHeight: 38,
  },
  countdownDaysLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: '600',
  },
  typeBadgesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeBadge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  typeBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },

  // Long weekend card
  longWeekendCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.longweekend,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  lwHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  lwIcon: {
    fontSize: 28,
  },
  lwTitle: {
    fontSize: 11,
    color: COLORS.textSub,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  lwLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  lwDaysBadge: {
    marginLeft: 'auto',
    backgroundColor: COLORS.longweekend,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
  },
  lwDaysNumber: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 22,
  },
  lwDaysText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 10,
    fontWeight: '600',
  },
  lwRange: {
    color: COLORS.textSub,
    fontSize: 14,
    marginBottom: 4,
  },
  lwCountdown: {
    color: COLORS.longweekend,
    fontSize: 14,
    fontWeight: '700',
  },

  // Section
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 10,
    paddingLeft: 2,
  },

  // Holiday row
  holidayRow: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  holidayColorBar: {
    height: 3,
    width: '100%',
  },
  holidayInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
  },
  holidayEmoji: {
    fontSize: 22,
  },
  holidayText: {
    flex: 1,
  },
  holidayName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  holidayDate: {
    fontSize: 12,
    color: COLORS.textSub,
    marginTop: 2,
  },
  holidayCountdown: {
    alignItems: 'flex-end',
  },
  holidayDays: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
  },
  holidayDaysLabel: {
    fontSize: 11,
    color: COLORS.textSub,
    fontWeight: '500',
  },
  cutiTag: {
    position: 'absolute',
    right: 0,
    top: 3,
    backgroundColor: COLORS.cuti,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 0,
  },
  cutiTagText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },

  // Cuti recommendation
  cutiRecomSub: {
    fontSize: 13,
    color: COLORS.textSub,
    marginBottom: 10,
    marginTop: -6,
    paddingLeft: 2,
  },
  cutiRecomRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  cutiRecomLeft: {
    width: 4,
    backgroundColor: COLORS.longweekend,
    alignSelf: 'stretch',
  },
  cutiRecomDot: {
    flex: 1,
  },
  cutiRecomContent: {
    flex: 1,
    padding: 12,
    paddingLeft: 12,
  },
  cutiRecomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cutiRecomDate: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  cutiRecomBadge: {
    backgroundColor: COLORS.longweekend,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  cutiRecomBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800',
  },
  cutiRecomInfo: {
    fontSize: 12,
    color: COLORS.textSub,
    marginBottom: 4,
  },
  cutiRecomCountdown: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.longweekend,
  },

  // Notification
  notifSection: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  notifTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 6,
  },
  notifDesc: {
    fontSize: 13,
    color: COLORS.textSub,
    lineHeight: 19,
    marginBottom: 16,
  },
  notifButton: {
    backgroundColor: COLORS.red,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    elevation: 3,
    shadowColor: COLORS.red,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  notifButtonEnabled: {
    backgroundColor: COLORS.longweekend,
  },
  notifButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
  },

  footer: {
    alignItems: 'center',
    paddingTop: 8,
  },
  footerText: {
    color: COLORS.textSub,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 17,
  },
});
