import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  Image,
  Alert,
} from 'react-native';
import {useUser} from '../context/UserContext';
import {
  savePreferences,
  type VacationType,
  type VacationStyle,
  type UserPreferences,
} from '../services/AuthService';

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
  green: '#27AE60',
  greenLight: '#D5F5E3',
};

const VACATION_TYPES: {value: VacationType; label: string; emoji: string}[] = [
  {value: 'kota', label: 'Kota', emoji: '🏙️'},
  {value: 'alam', label: 'Alam', emoji: '🌿'},
  {value: 'pantai', label: 'Pantai', emoji: '🏖️'},
  {value: 'gunung', label: 'Gunung', emoji: '⛰️'},
];

const VACATION_STYLES: {value: VacationStyle; label: string; emoji: string}[] = [
  {value: 'backpacker', label: 'Backpacker', emoji: '🎒'},
  {value: 'luxury', label: 'Luxury', emoji: '✨'},
  {value: 'keluarga', label: 'Keluarga', emoji: '👨‍👩‍👧'},
];

export default function ProfileScreen() {
  const {user, completeOnboarding, signOut} = useUser();

  const [editMode, setEditMode] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<VacationType[]>(
    user?.preferences?.vacationTypes ?? [],
  );
  const [selectedStyle, setSelectedStyle] = useState<VacationStyle | null>(
    user?.preferences?.vacationStyle ?? null,
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleType = (type: VacationType) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type],
    );
  };

  const handleSave = async () => {
    if (selectedTypes.length === 0 || !selectedStyle) {return;}
    setSaving(true);
    const prefs: UserPreferences = {
      vacationTypes: selectedTypes,
      vacationStyle: selectedStyle,
    };
    await completeOnboarding(prefs);
    setSaving(false);
    setEditMode(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSignOut = () => {
    Alert.alert(
      'Keluar Akun',
      'Kamu yakin ingin keluar dari akun Google?',
      [
        {text: 'Batal', style: 'cancel'},
        {text: 'Keluar', style: 'destructive', onPress: signOut},
      ],
    );
  };

  const prefs = user?.preferences;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.red} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil Saya</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* User info card */}
        <View style={styles.userCard}>
          {user?.photo ? (
            <Image source={{uri: user.photo}} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>
                {user?.name?.charAt(0).toUpperCase() ?? '?'}
              </Text>
            </View>
          )}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name ?? '-'}</Text>
            <Text style={styles.userEmail}>{user?.email ?? '-'}</Text>
          </View>
        </View>

        {/* Saved confirmation */}
        {saved && (
          <View style={styles.savedBanner}>
            <Text style={styles.savedBannerText}>Preferensi berhasil disimpan!</Text>
          </View>
        )}

        {/* Preferences section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Preferensi Liburan</Text>
          {!editMode && (
            <TouchableOpacity onPress={() => setEditMode(true)}>
              <Text style={styles.editLink}>Ubah</Text>
            </TouchableOpacity>
          )}
        </View>

        {!editMode ? (
          /* Read-only view */
          <View style={styles.card}>
            <Text style={styles.prefLabel}>Tipe Liburan</Text>
            <View style={styles.tagsRow}>
              {(prefs?.vacationTypes ?? []).map(t => {
                const opt = VACATION_TYPES.find(v => v.value === t)!;
                return (
                  <View key={t} style={styles.tag}>
                    <Text style={styles.tagText}>{opt.emoji} {opt.label}</Text>
                  </View>
                );
              })}
              {(!prefs?.vacationTypes?.length) && (
                <Text style={styles.emptyText}>Belum diatur</Text>
              )}
            </View>

            <View style={styles.divider} />

            <Text style={styles.prefLabel}>Gaya Liburan</Text>
            {prefs?.vacationStyle ? (
              <View style={styles.styleReadRow}>
                {(() => {
                  const s = VACATION_STYLES.find(v => v.value === prefs.vacationStyle)!;
                  return (
                    <>
                      <Text style={styles.styleReadEmoji}>{s.emoji}</Text>
                      <Text style={styles.styleReadLabel}>{s.label}</Text>
                    </>
                  );
                })()}
              </View>
            ) : (
              <Text style={styles.emptyText}>Belum diatur</Text>
            )}
          </View>
        ) : (
          /* Edit mode */
          <View style={styles.card}>
            <Text style={styles.editSectionLabel}>Tipe Liburan</Text>
            <Text style={styles.editHint}>Pilih satu atau lebih</Text>
            <View style={styles.chipRow}>
              {VACATION_TYPES.map(t => {
                const sel = selectedTypes.includes(t.value);
                return (
                  <TouchableOpacity
                    key={t.value}
                    style={[styles.chip, sel && styles.chipSelected]}
                    onPress={() => toggleType(t.value)}>
                    <Text style={styles.chipEmoji}>{t.emoji}</Text>
                    <Text style={[styles.chipLabel, sel && styles.chipLabelSelected]}>
                      {t.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.divider} />

            <Text style={styles.editSectionLabel}>Gaya Liburan</Text>
            <Text style={styles.editHint}>Pilih satu</Text>
            <View style={styles.styleChoiceList}>
              {VACATION_STYLES.map(s => {
                const sel = selectedStyle === s.value;
                return (
                  <TouchableOpacity
                    key={s.value}
                    style={[styles.styleChoice, sel && styles.styleChoiceSelected]}
                    onPress={() => setSelectedStyle(s.value)}>
                    <Text style={styles.chipEmoji}>{s.emoji}</Text>
                    <Text style={[styles.chipLabel, sel && styles.chipLabelSelected]}>
                      {s.label}
                    </Text>
                    <View style={[styles.radioCircle, sel && styles.radioCircleSelected]}>
                      {sel && <View style={styles.radioDot} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Save / Cancel */}
            <View style={styles.editActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setSelectedTypes(user?.preferences?.vacationTypes ?? []);
                  setSelectedStyle(user?.preferences?.vacationStyle ?? null);
                  setEditMode(false);
                }}>
                <Text style={styles.cancelBtnText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.saveBtn,
                  (selectedTypes.length === 0 || !selectedStyle) && styles.saveBtnDisabled,
                ]}
                onPress={handleSave}
                disabled={saving || selectedTypes.length === 0 || !selectedStyle}>
                <Text style={styles.saveBtnText}>
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Sign out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Keluar Akun</Text>
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
  scrollContent: {
    padding: 16,
  },
  userCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.07,
    shadowRadius: 3,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '900',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },
  userEmail: {
    fontSize: 13,
    color: COLORS.textSub,
    marginTop: 2,
  },
  savedBanner: {
    backgroundColor: COLORS.greenLight,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  savedBannerText: {
    color: COLORS.green,
    fontWeight: '700',
    fontSize: 13,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  editLink: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.red,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.07,
    shadowRadius: 3,
  },
  prefLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSub,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  tag: {
    backgroundColor: COLORS.selectedBg,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.red + '40',
  },
  tagText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.red,
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.textSub,
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 14,
  },
  styleReadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  styleReadEmoji: {
    fontSize: 22,
  },
  styleReadLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  // Edit mode styles
  editSectionLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 2,
  },
  editHint: {
    fontSize: 12,
    color: COLORS.textSub,
    marginBottom: 10,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.bg,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  chipSelected: {
    backgroundColor: COLORS.selectedBg,
    borderColor: COLORS.red,
  },
  chipEmoji: {
    fontSize: 16,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  chipLabelSelected: {
    color: COLORS.red,
  },
  styleChoiceList: {
    gap: 8,
  },
  styleChoice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.bg,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  styleChoiceSelected: {
    backgroundColor: COLORS.selectedBg,
    borderColor: COLORS.red,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
  },
  radioCircleSelected: {
    borderColor: COLORS.red,
  },
  radioDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: COLORS.red,
  },
  editActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSub,
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.red,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    backgroundColor: COLORS.border,
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
  },
  signOutBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.red + '60',
    alignItems: 'center',
    marginBottom: 8,
  },
  signOutText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.red,
  },
  bottomSpace: {
    height: 20,
  },
});
