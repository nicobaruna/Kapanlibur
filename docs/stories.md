# User Stories - Kapanlibur App

## Story 1: Login dengan Google

**Sebagai** pengguna baru,
**Saya ingin** masuk ke aplikasi menggunakan akun Google saya,
**Sehingga** saya bisa mengakses semua fitur personalisasi secara aman.

### Acceptance Criteria
- [ ] Tombol "Masuk dengan Google" tampil di halaman login
- [ ] Proses login memunculkan Google Sign-In dialog
- [ ] Setelah berhasil login, pengguna diarahkan ke halaman onboarding (jika baru) atau dashboard
- [ ] Jika login dibatalkan, tidak ada error yang muncul
- [ ] Jika Google Play Services tidak tersedia, pesan error yang tepat ditampilkan

### Definition of Done
- [ ] Unit test untuk `signInWithGoogle` lulus
- [ ] Login flow teruji secara E2E di device/emulator Android
- [ ] Appium test: tap tombol login -> Google dialog muncul -> login berhasil -> masuk ke app
- [ ] Error handling untuk semua skenario gagal terimplementasi
- [ ] UI sesuai desain (tombol merah, ikon Google, loading spinner)
- [ ] Kode sudah di-review dan di-merge ke branch `main`

---

## Story 2: Onboarding Nama Pengguna

**Sebagai** pengguna yang baru pertama kali login,
**Saya ingin** mengisi nama saya saat pertama kali masuk,
**Sehingga** aplikasi bisa menyapa saya secara personal.

### Acceptance Criteria
- [ ] Layar onboarding tampil hanya sekali setelah login pertama
- [ ] Pengguna dapat mengisi nama panggilan
- [ ] Tombol "Mulai" hanya aktif jika nama sudah diisi
- [ ] Setelah submit, pengguna diarahkan ke Dashboard
- [ ] Nama tersimpan di storage lokal dan dipakai di seluruh app

### Definition of Done
- [ ] Onboarding hanya tampil sekali (persistent flag di AsyncStorage)
- [ ] Validasi input nama (tidak boleh kosong, max 50 karakter)
- [ ] Appium test: isi nama -> tap Mulai -> masuk ke Dashboard
- [ ] Nama pengguna tampil di Dashboard dan Profile
- [ ] Kode sudah di-review dan di-merge ke branch `main`

---

## Story 3: Lihat Hari Libur Berikutnya di Dashboard

**Sebagai** pengguna,
**Saya ingin** langsung melihat hari libur terdekat saat membuka aplikasi,
**Sehingga** saya bisa segera merencanakan waktu libur saya.

### Acceptance Criteria
- [ ] Dashboard menampilkan kartu "Hari Libur Berikutnya" dengan nama dan tanggal libur
- [ ] Countdown hari ditampilkan (contoh: "10 hari lagi")
- [ ] Daftar 6 hari libur mendatang ditampilkan dalam scrollable list
- [ ] Kartu Long Weekend berikutnya ditampilkan terpisah
- [ ] Data bisa di-refresh dengan pull-to-refresh

### Definition of Done
- [ ] Data holiday diambil dari `holidays2026.ts` dengan benar
- [ ] Fungsi `getNextHoliday()` dan `getUpcomingHolidays()` ter-unit-test
- [ ] Appium test: buka app -> Dashboard tampil -> kartu libur terdekat ada
- [ ] Pull-to-refresh bekerja dan data terupdate
- [ ] Widget home screen terupdate saat data dimuat
- [ ] Kode sudah di-review dan di-merge ke branch `main`

---

## Story 4: Melihat Kalender Hari Libur

**Sebagai** pengguna,
**Saya ingin** melihat semua hari libur dalam tampilan kalender bulanan,
**Sehingga** saya bisa merencanakan cuti dan perjalanan dengan lebih mudah.

### Acceptance Criteria
- [ ] Kalender bulanan ditampilkan dengan highlight pada hari libur
- [ ] Warna berbeda untuk libur nasional, cuti bersama, dan long weekend
- [ ] Tap pada tanggal libur menampilkan detail nama hari libur
- [ ] Navigasi antar bulan (kiri/kanan) berfungsi
- [ ] Hari ini selalu ter-highlight

### Definition of Done
- [ ] Semua hari libur 2026 tampil di kalender dengan benar
- [ ] Appium test: buka tab Kalender -> tap tanggal libur -> detail muncul
- [ ] Navigasi bulan berfungsi (prev/next)
- [ ] Kode sudah di-review dan di-merge ke branch `main`

---

## Story 5: Melihat Daftar Long Weekend

**Sebagai** pengguna,
**Saya ingin** melihat semua potensi long weekend sepanjang tahun,
**Sehingga** saya bisa merencanakan liburan jauh-jauh hari.

### Acceptance Criteria
- [ ] Daftar semua long weekend tahun ini tampil dengan rentang tanggal
- [ ] Setiap kartu menampilkan jumlah hari, nama libur, dan countdown
- [ ] Long weekend yang sudah lewat ditampilkan berbeda (misalnya abu-abu)
- [ ] Pengguna bisa scroll melalui semua long weekend

### Definition of Done
- [ ] Data LONG_WEEKENDS_2026 tampil lengkap dan akurat
- [ ] Countdown hari dihitung dengan benar
- [ ] Appium test: buka tab Long Weekend -> scroll -> semua kartu tampil
- [ ] Visual styling sesuai desain (past vs upcoming)
- [ ] Kode sudah di-review dan di-merge ke branch `main`

---

## Story 6: Share Long Weekend ke WhatsApp sebagai Gambar

**Sebagai** pengguna,
**Saya ingin** berbagi informasi long weekend ke WhatsApp dalam bentuk gambar,
**Sehingga** teman saya bisa ikut merencanakan liburan bersama.

### Acceptance Criteria
- [ ] Tombol share tersedia di setiap kartu long weekend
- [ ] Modal share muncul dengan pilihan platform (WhatsApp, X, Threads, Instagram)
- [ ] Share ke WhatsApp menghasilkan gambar yang menarik beserta teks
- [ ] Gambar yang di-share berisi nama libur, tanggal, dan branding Kapanlibur
- [ ] Share ke platform lain (X, Threads, Instagram) juga berfungsi

### Definition of Done
- [ ] `captureRef` berhasil mengambil screenshot kartu sebagai gambar
- [ ] `RNShare` berhasil mengirim gambar ke WhatsApp
- [ ] Appium test: tap share -> pilih WhatsApp -> WhatsApp terbuka dengan gambar
- [ ] Share card visual sesuai desain
- [ ] Kode sudah di-review dan di-merge ke branch `main`

---

## Story 7: Financial Planner untuk Liburan

**Sebagai** pengguna,
**Saya ingin** merencanakan budget liburan saya,
**Sehingga** saya bisa mempersiapkan keuangan sebelum hari libur tiba.

### Acceptance Criteria
- [ ] Pengguna bisa memilih long weekend/hari libur yang ingin direncanakan
- [ ] Form input untuk budget (transportasi, akomodasi, makan, lain-lain)
- [ ] Total budget dihitung otomatis
- [ ] Rencana tersimpan dan bisa dilihat kembali
- [ ] Ada ringkasan semua rencana liburan

### Definition of Done
- [ ] Input validasi: angka positif, tidak boleh kosong
- [ ] Data tersimpan di AsyncStorage
- [ ] Appium test: buka Financial Planner -> isi form -> simpan -> rencana tersimpan
- [ ] Total kalkulasi akurat
- [ ] Kode sudah di-review dan di-merge ke branch `main`

---

## Story 8: Kelola Profil Pengguna

**Sebagai** pengguna,
**Saya ingin** melihat dan mengubah informasi profil saya,
**Sehingga** data saya selalu up-to-date di dalam aplikasi.

### Acceptance Criteria
- [ ] Profil menampilkan foto, nama, dan email dari akun Google
- [ ] Pengguna bisa mengubah nama panggilan
- [ ] Tombol logout tersedia
- [ ] Setelah logout, pengguna kembali ke halaman login

### Definition of Done
- [ ] Data profil diambil dari Google Sign-In dengan benar
- [ ] Perubahan nama tersimpan ke AsyncStorage
- [ ] Appium test: buka profil -> lihat data -> edit nama -> simpan -> nama terupdate
- [ ] Logout flow berfungsi dan state terhapus
- [ ] Kode sudah di-review dan di-merge ke branch `main`
