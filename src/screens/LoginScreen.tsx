import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import {signInWithGoogle} from '../services/AuthService';
import {useUser} from '../context/UserContext';

const COLORS = {
  red: '#C8102E',
  white: '#FFFFFF',
  bg: '#F7F3EF',
  card: '#FFFFFF',
  text: '#1A1A2E',
  textSub: '#6B7280',
  border: '#E8E0D8',
  googleBlue: '#4285F4',
};

export default function LoginScreen() {
  const {setUser} = useUser();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      setUser(user);
    } catch (err: unknown) {
      const error = err as {code?: string; message?: string};
      if (error.code === 'SIGN_IN_CANCELLED') {
        // user cancelled, do nothing
      } else if (error.code === 'IN_PROGRESS') {
        // already signing in
      } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
        Alert.alert('Error', 'Google Play Services tidak tersedia di perangkat ini.');
      } else {
        Alert.alert('Gagal Login', error.message ?? 'Terjadi kesalahan saat login.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {/* Hero section */}
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>🇮🇩</Text>
        <Text style={styles.appName}>KapanLibur</Text>
        <Text style={styles.appTagline}>
          Pantau hari libur & rencanakan liburanmu
        </Text>
      </View>

      {/* Feature list */}
      <View style={styles.featuresCard}>
        {[
          {icon: '📅', text: 'Kalender hari libur nasional 2026'},
          {icon: '🏖️', text: 'Info long weekend mendatang'},
          {icon: '💰', text: 'Perencana finansial liburan'},
          {icon: '🎯', text: 'Rekomendasi sesuai gaya liburanmu'},
        ].map((f, i) => (
          <View key={i} style={styles.featureRow}>
            <Text style={styles.featureIcon}>{f.icon}</Text>
            <Text style={styles.featureText}>{f.text}</Text>
          </View>
        ))}
      </View>

      {/* Sign in button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[styles.googleBtn, loading && styles.googleBtnDisabled]}
          onPress={handleGoogleSignIn}
          disabled={loading}
          activeOpacity={0.85}>
          {loading ? (
            <ActivityIndicator color={COLORS.text} size="small" />
          ) : (
            <>
              <View style={styles.googleIconWrap}>
                <Text style={styles.googleIconText}>G</Text>
              </View>
              <Text style={styles.googleBtnText}>Masuk dengan Google</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Dengan masuk, kamu menyetujui penggunaan data untuk personalisasi
          rekomendasi liburan.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 44,
    paddingHorizontal: 24,
    paddingBottom: 36,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  heroEmoji: {
    fontSize: 72,
    marginBottom: 8,
  },
  appName: {
    fontSize: 36,
    fontWeight: '900',
    color: COLORS.red,
    letterSpacing: -0.5,
  },
  appTagline: {
    fontSize: 15,
    color: COLORS.textSub,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 22,
  },
  featuresCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 28,
    gap: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  featureIcon: {
    fontSize: 22,
    width: 32,
    textAlign: 'center',
  },
  featureText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
    flex: 1,
  },
  bottomSection: {
    gap: 16,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  googleBtnDisabled: {
    opacity: 0.6,
  },
  googleIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.googleBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIconText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 20,
  },
  googleBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  disclaimer: {
    fontSize: 11,
    color: COLORS.textSub,
    textAlign: 'center',
    lineHeight: 16,
  },
});
