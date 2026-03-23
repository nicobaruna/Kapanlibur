import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type VacationType = 'kota' | 'alam' | 'pantai' | 'gunung';
export type VacationStyle = 'backpacker' | 'luxury' | 'keluarga';

export interface UserPreferences {
  vacationTypes: VacationType[];
  vacationStyle: VacationStyle;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  photo: string | null;
  preferences?: UserPreferences;
}

const STORAGE_KEYS = {
  USER: '@kapanlibur_user',
  PREFERENCES: '@kapanlibur_preferences',
};

// Configure Google Sign-In once.
// webClientId dapat dari Firebase Console > Project Settings > Web client (auto created by Google Service)
GoogleSignin.configure({
  webClientId: 'GANTI_DENGAN_WEB_CLIENT_ID.apps.googleusercontent.com',
  offlineAccess: false,
});

export async function signInWithGoogle(): Promise<UserProfile> {
  await GoogleSignin.hasPlayServices();
  const userInfo = await GoogleSignin.signIn();

  const user: UserProfile = {
    id: userInfo.data?.user.id ?? '',
    name: userInfo.data?.user.name ?? '',
    email: userInfo.data?.user.email ?? '',
    photo: userInfo.data?.user.photo ?? null,
  };

  await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  return user;
}

export async function signOut(): Promise<void> {
  await GoogleSignin.signOut();
  await AsyncStorage.multiRemove([STORAGE_KEYS.USER, STORAGE_KEYS.PREFERENCES]);
}

export async function loadStoredUser(): Promise<UserProfile | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.USER);
  if (!raw) {return null;}
  const user: UserProfile = JSON.parse(raw);
  const prefs = await loadPreferences();
  if (prefs) {user.preferences = prefs;}
  return user;
}

export async function savePreferences(
  prefs: UserPreferences,
): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
}

export async function loadPreferences(): Promise<UserPreferences | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES);
  return raw ? JSON.parse(raw) : null;
}
