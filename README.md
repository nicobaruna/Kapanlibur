# 🇮🇩 Libur Indonesia 2026

Aplikasi React Native untuk mengingatkan hari libur nasional, cuti bersama, dan long weekend berdasarkan Kalender Resmi Bank Indonesia 2026.

---

## ✨ Fitur

| Fitur | Keterangan |
|-------|------------|
| 🏠 **Dashboard** | Countdown libur berikutnya + daftar 6 libur mendatang |
| 📅 **Kalender** | Kalender bulanan dengan highlight libur & cuti bersama |
| 🏖️ **Long Weekend** | Deteksi otomatis semua long weekend 2026 |
| 🔔 **Notifikasi H-7** | Pengingat 7 hari sebelum setiap libur (jam 08:00) |
| 🔔 **Notifikasi H-1** | Pengingat 1 hari sebelum setiap libur (jam 08:00) |

---

## 📦 Instalasi

### 1. Prasyarat
- Node.js >= 18
- React Native CLI
- Android Studio (untuk Android) / Xcode (untuk iOS)
- JDK 17

### 2. Clone & install dependencies

```bash
git clone <repo-url>
cd LiburIndonesia
npm install
```

### 3. Setup Android (wajib untuk notifikasi)

#### Tambahkan permission di `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED"/>
<uses-permission android:name="android.permission.USE_EXACT_ALARM"/>
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM"/>
```

#### Tambahkan icon notifikasi di `android/app/src/main/res/`:
Buat file `drawable/ic_notification.png` (24x24px, warna putih/transparan).

#### Link native modules:
```bash
cd android && ./gradlew clean && cd ..
```

### 4. Jalankan aplikasi

```bash
# Terminal 1: Start Metro bundler
npx react-native start

# Terminal 2: Run di Android
npx react-native run-android

# Atau iOS
npx react-native run-ios
```

---

## 🗂️ Struktur Project

```
LiburIndonesia/
├── App.tsx                          # Entry point + navigation
├── src/
│   ├── data/
│   │   └── holidays2026.ts          # Data libur 2026 (sumber: Bank Indonesia)
│   ├── screens/
│   │   ├── DashboardScreen.tsx      # Halaman utama
│   │   ├── CalendarScreen.tsx       # Kalender interaktif
│   │   └── LongWeekendScreen.tsx    # Daftar long weekend
│   ├── services/
│   │   └── NotificationService.ts  # Manajemen notifikasi
│   └── utils/
│       └── dateUtils.ts            # Helper tanggal & waktu
└── package.json
```

---

## 📅 Data Libur 2026

### Hari Libur Nasional (17 hari)
| Tanggal | Nama |
|---------|------|
| 1 Jan | Tahun Baru 2026 |
| 16 Jan | Isra Mikraj |
| 17 Feb | Tahun Baru Imlek |
| 19 Mar | Hari Raya Nyepi |
| 21-22 Mar | Idul Fitri 1447 H |
| 3 Apr | Wafat Yesus (Jumat Agung) |
| 5 Apr | Paskah |
| 1 Mei | Hari Buruh |
| 14 Mei | Kenaikan Yesus |
| 27 Mei | Idul Adha 1447 H |
| 31 Mei | Waisak |
| 1 Jun | Hari Lahir Pancasila |
| 16 Jun | Tahun Baru Islam 1448 H |
| 17 Ags | HUT RI ke-81 |
| 25 Ags | Maulid Nabi |
| 25 Des | Natal |

### Cuti Bersama (8 hari)
16 Feb · 18 Mar · 20, 23, 24 Mar (Lebaran) · 15 Mei · 28 Mei · 24 Des

---

## 🏖️ Long Weekend 2026 (Auto-detected)

| Periode | Durasi |
|---------|--------|
| 18–24 Mar | **7 hari** (Nyepi + Lebaran mega-holiday!) |
| 3–5 Apr | 3 hari (Jumat Agung + weekend) |
| 1–3 Mei | 3 hari (Hari Buruh + weekend) |
| 14–17 Mei | 4 hari (Kenaikan Yesus + cuti + weekend) |
| 29–31 Mei | 3 hari (Waisak + weekend) |
| 15–17 Ags | 3 hari (HUT RI + weekend) |
| 24–25 Des | 2 hari + (Cuti Natal + Natal + weekend = 4 hari) |

---

## 🔔 Cara Kerja Notifikasi

1. Buka app → tap **"Aktifkan Pengingat"** di halaman Beranda
2. Izinkan notifikasi jika diminta
3. App akan menjadwalkan notifikasi **H-7** dan **H-1** untuk semua libur yang tersisa
4. Notifikasi dikirim setiap hari **pukul 08:00 pagi**
5. Notifikasi langsung aktif — tidak perlu app terbuka

---

## 🛠️ Dependencies Utama

| Package | Kegunaan |
|---------|----------|
| `@notifee/react-native` | Local notifications terjadwal |
| `react-native-calendars` | Komponen kalender |
| `@react-navigation/native` | Navigasi antar halaman |
| `@react-navigation/bottom-tabs` | Tab bar navigasi |
| `react-native-safe-area-context` | Safe area handling |

---

## 📝 Sumber Data

Data hari libur dan cuti bersama bersumber dari:
> **Kalender Hari Libur dan Cuti Bersama Bank Indonesia Tahun 2026**
> Berdasarkan Keputusan Bersama Menteri Agama, Menteri Ketenagakerjaan, dan Menteri Pendayagunaan Aparatur Negara dan Reformasi Birokrasi Republik Indonesia.

---

## 🚀 Build Release (APK)

```bash
cd android
./gradlew assembleRelease
# APK tersimpan di: android/app/build/outputs/apk/release/app-release.apk
```

Untuk signed APK, tambahkan keystore di `android/app/build.gradle`.
