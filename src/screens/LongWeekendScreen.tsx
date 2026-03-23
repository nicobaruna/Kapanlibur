import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
  TouchableOpacity,
  Modal,
  Share,
  Linking,
  Pressable,
} from 'react-native';
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
  overlay: 'rgba(0,0,0,0.5)',
};

const DAY_COLORS = [
  '#C8102E', '#E67E22', '#27AE60', '#2980B9', '#8E44AD',
  '#1ABC9C', '#D35400', '#C0392B',
];

const SOCIAL_PLATFORMS = [
  {
    id: 'x',
    label: 'X',
    icon: '𝕏',
    color: '#000000',
    bg: '#F0F0F0',
  },
  {
    id: 'threads',
    label: 'Threads',
    icon: '@',
    color: '#FFFFFF',
    bg: '#000000',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    icon: '📸',
    color: '#FFFFFF',
    bg: '#E1306C',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    icon: '♪',
    color: '#FFFFFF',
    bg: '#010101',
  },
];

function buildShareText(lw: typeof LONG_WEEKENDS_2026[0]): string {
  const range = formatLongWeekendRange(lw);
  const holidayLines = lw.holidays
    .filter((h, idx, arr) => arr.findIndex(x => x.id === h.id) === idx)
    .map(h => `${h.emoji} ${h.shortName}`)
    .join('\n');

  return (
    `🏖️ Long Weekend ${lw.label}!\n` +
    `📅 ${range} · ${lw.totalDays} hari\n\n` +
    `${holidayLines}\n\n` +
    `Tandai kalendermu! 🗓️\n` +
    `#LongWeekend #LiburNasional #Indonesia`
  );
}

async function shareToX(text: string) {
  const encoded = encodeURIComponent(text);
  const url = `https://twitter.com/intent/tweet?text=${encoded}`;
  const appUrl = `twitter://post?message=${encoded}`;
  const canOpen = await Linking.canOpenURL(appUrl);
  await Linking.openURL(canOpen ? appUrl : url);
}

async function shareToThreads(text: string) {
  const encoded = encodeURIComponent(text);
  const url = `https://www.threads.net/intent/post?text=${encoded}`;
  await Linking.openURL(url);
}

async function shareToInstagram(text: string) {
  await Share.share({message: text}, {dialogTitle: 'Bagikan ke Instagram'});
}

async function shareToTikTok(text: string) {
  await Share.share({message: text}, {dialogTitle: 'Bagikan ke TikTok'});
}

type ShareModalProps = {
  visible: boolean;
  lw: typeof LONG_WEEKENDS_2026[0] | null;
  onClose: () => void;
};

function ShareModal({visible, lw, onClose}: ShareModalProps) {
  const [sharing, setSharing] = useState<string | null>(null);

  if (!lw) {return null;}

  const shareText = buildShareText(lw);

  const handleShare = async (platformId: string) => {
    setSharing(platformId);
    try {
      switch (platformId) {
        case 'x':
          await shareToX(shareText);
          break;
        case 'threads':
          await shareToThreads(shareText);
          break;
        case 'instagram':
          await shareToInstagram(shareText);
          break;
        case 'tiktok':
          await shareToTikTok(shareText);
          break;
      }
    } catch (_) {
      // user cancelled or error
    } finally {
      setSharing(null);
      if (platformId === 'instagram' || platformId === 'tiktok') {
        onClose();
      }
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalSheet} onPress={() => {}}>
          {/* Handle bar */}
          <View style={styles.handleBar} />

          <Text style={styles.modalTitle}>Bagikan Long Weekend</Text>
          <Text style={styles.modalSubtitle} numberOfLines={2}>
            🏖️ {lw.label} · {formatLongWeekendRange(lw)} · {lw.totalDays} hari
          </Text>

          <View style={styles.platformRow}>
            {SOCIAL_PLATFORMS.map(p => (
              <TouchableOpacity
                key={p.id}
                style={styles.platformButton}
                onPress={() => handleShare(p.id)}
                disabled={sharing !== null}
                activeOpacity={0.75}>
                <View
                  style={[
                    styles.platformIconWrap,
                    {backgroundColor: p.bg},
                    sharing === p.id && styles.platformIconActive,
                  ]}>
                  <Text style={[styles.platformIcon, {color: p.color}]}>
                    {p.icon}
                  </Text>
                </View>
                <Text style={styles.platformLabel}>{p.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.shareHint}>
            Instagram & TikTok: pilih aplikasi dari menu berbagi
          </Text>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Batal</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function LongWeekendScreen() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [shareTarget, setShareTarget] = useState<typeof LONG_WEEKENDS_2026[0] | null>(null);

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
      <View
        key={`${lw.startDate}-${lw.endDate}`}
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

            <View style={styles.lwHeaderRight}>
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

              {/* Share button */}
              <TouchableOpacity
                style={styles.shareBtn}
                onPress={() => setShareTarget(lw)}
                activeOpacity={0.7}>
                <Text style={styles.shareBtnIcon}>↗</Text>
              </TouchableOpacity>
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

      <ShareModal
        visible={shareTarget !== null}
        lw={shareTarget}
        onClose={() => setShareTarget(null)}
      />
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
  lwHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  shareBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtnIcon: {
    fontSize: 18,
    color: COLORS.text,
    fontWeight: '700',
    lineHeight: 20,
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

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    paddingTop: 12,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 13,
    color: COLORS.textSub,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 24,
  },
  platformRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  platformButton: {
    alignItems: 'center',
    gap: 8,
  },
  platformIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  platformIconActive: {
    opacity: 0.6,
  },
  platformIcon: {
    fontSize: 26,
    fontWeight: '900',
  },
  platformLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  shareHint: {
    fontSize: 11,
    color: COLORS.textSub,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: COLORS.bg,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
});
