import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import {useUser} from '../context/UserContext';
import {type VacationType, type VacationStyle, type UserPreferences} from '../services/AuthService';

const COLORS = {
  red: '#C8102E',
  white: '#FFFFFF',
  bg: '#F7F3EF',
  card: '#FFFFFF',
  text: '#1A1A2E',
  textSub: '#6B7280',
  border: '#E8E0D8',
  selected: '#C8102E',
  selectedBg: '#FEF2F2',
};

const VACATION_TYPES: {value: VacationType; label: string; emoji: string; desc: string}[] = [
  {value: 'kota', label: 'Kota', emoji: '🏙️', desc: 'Wisata kuliner & belanja'},
  {value: 'alam', label: 'Alam', emoji: '🌿', desc: 'Hutan & air terjun'},
  {value: 'pantai', label: 'Pantai', emoji: '🏖️', desc: 'Pasir & ombak'},
  {value: 'gunung', label: 'Gunung', emoji: '⛰️', desc: 'Trekking & pemandangan'},
];

const VACATION_STYLES: {value: VacationStyle; label: string; emoji: string; desc: string}[] = [
  {value: 'backpacker', label: 'Backpacker', emoji: '🎒', desc: 'Hemat & suka petualangan'},
  {value: 'luxury', label: 'Luxury', emoji: '✨', desc: 'Nyaman & premium'},
  {value: 'keluarga', label: 'Keluarga', emoji: '👨‍👩‍👧', desc: 'Ramah anak & santai'},
];

export default function OnboardingScreen() {
  const {user, completeOnboarding} = useUser();
  const [selectedTypes, setSelectedTypes] = useState<VacationType[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<VacationStyle | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleType = (type: VacationType) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type],
    );
  };

  const handleContinue = async () => {
    if (selectedTypes.length === 0 || !selectedStyle) {return;}
    setLoading(true);
    const prefs: UserPreferences = {
      vacationTypes: selectedTypes,
      vacationStyle: selectedStyle,
    };
    await completeOnboarding(prefs);
    setLoading(false);
  };

  const canContinue = selectedTypes.length > 0 && selectedStyle !== null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Hei, {user?.name?.split(' ')[0] ?? 'Traveler'}! 👋
        </Text>
        <Text style={styles.headerTitle}>Preferensi Liburanmu</Text>
        <Text style={styles.headerSub}>
          Pilih agar rekomendasi kami lebih personal untukmu
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Step indicator */}
        <View style={styles.stepRow}>
          <View style={[styles.stepDot, styles.stepDotActive]} />
          <View style={styles.stepLine} />
          <View style={[styles.stepDot, selectedStyle && styles.stepDotActive]} />
        </View>

        {/* Vacation Type (multi-select) */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Tipe Liburan</Text>
          <Text style={styles.sectionHint}>Pilih satu atau lebih</Text>
          <View style={styles.optionGrid}>
            {VACATION_TYPES.map(t => {
              const selected = selectedTypes.includes(t.value);
              return (
                <TouchableOpacity
                  key={t.value}
                  style={[styles.optionCard, selected && styles.optionCardSelected]}
                  onPress={() => toggleType(t.value)}
                  activeOpacity={0.75}>
                  <Text style={styles.optionEmoji}>{t.emoji}</Text>
                  <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
                    {t.label}
                  </Text>
                  <Text style={[styles.optionDesc, selected && styles.optionDescSelected]}>
                    {t.desc}
                  </Text>
                  {selected && (
                    <View style={styles.checkBadge}>
                      <Text style={styles.checkBadgeText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Vacation Style (single-select) */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Gaya Liburan</Text>
          <Text style={styles.sectionHint}>Pilih satu</Text>
          <View style={styles.styleList}>
            {VACATION_STYLES.map(s => {
              const selected = selectedStyle === s.value;
              return (
                <TouchableOpacity
                  key={s.value}
                  style={[styles.styleCard, selected && styles.styleCardSelected]}
                  onPress={() => setSelectedStyle(s.value)}
                  activeOpacity={0.75}>
                  <Text style={styles.styleEmoji}>{s.emoji}</Text>
                  <View style={styles.styleInfo}>
                    <Text style={[styles.styleLabel, selected && styles.styleLabelSelected]}>
                      {s.label}
                    </Text>
                    <Text style={[styles.styleDesc, selected && styles.styleDescSelected]}>
                      {s.desc}
                    </Text>
                  </View>
                  <View style={[styles.radioCircle, selected && styles.radioCircleSelected]}>
                    {selected && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Continue button */}
        <TouchableOpacity
          style={[styles.continueBtn, !canContinue && styles.continueBtnDisabled]}
          onPress={handleContinue}
          disabled={!canContinue || loading}
          activeOpacity={0.85}>
          <Text style={styles.continueBtnText}>
            {loading ? 'Menyimpan...' : 'Mulai Jelajahi'}
          </Text>
        </TouchableOpacity>

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
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + 16 : 56,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 16,
    color: COLORS.textSub,
    fontWeight: '600',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 14,
    color: COLORS.textSub,
    lineHeight: 20,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.border,
  },
  stepDotActive: {
    backgroundColor: COLORS.red,
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.border,
    marginHorizontal: 6,
  },
  section: {
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 2,
  },
  sectionHint: {
    fontSize: 12,
    color: COLORS.textSub,
    marginBottom: 14,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionCard: {
    width: '47%',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
    position: 'relative',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  optionCardSelected: {
    borderColor: COLORS.selected,
    backgroundColor: COLORS.selectedBg,
  },
  optionEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 2,
  },
  optionLabelSelected: {
    color: COLORS.red,
  },
  optionDesc: {
    fontSize: 11,
    color: COLORS.textSub,
    lineHeight: 16,
  },
  optionDescSelected: {
    color: COLORS.red,
    opacity: 0.7,
  },
  checkBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '900',
  },
  styleList: {
    gap: 10,
  },
  styleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
    gap: 14,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  styleCardSelected: {
    borderColor: COLORS.selected,
    backgroundColor: COLORS.selectedBg,
  },
  styleEmoji: {
    fontSize: 28,
  },
  styleInfo: {
    flex: 1,
  },
  styleLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 2,
  },
  styleLabelSelected: {
    color: COLORS.red,
  },
  styleDesc: {
    fontSize: 12,
    color: COLORS.textSub,
  },
  styleDescSelected: {
    color: COLORS.red,
    opacity: 0.7,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: COLORS.red,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.red,
  },
  continueBtn: {
    backgroundColor: COLORS.red,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    elevation: 3,
    shadowColor: COLORS.red,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  continueBtnDisabled: {
    backgroundColor: COLORS.border,
    elevation: 0,
    shadowOpacity: 0,
  },
  continueBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  bottomSpace: {
    height: 40,
  },
});
