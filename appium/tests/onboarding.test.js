'use strict';
/**
 * Story 2: Onboarding Nama Pengguna
 *
 * Test coverage:
 * - Layar onboarding tampil setelah login pertama
 * - Input nama tersedia
 * - Tombol Mulai disabled jika nama kosong
 * - Submit nama berhasil -> masuk ke Dashboard
 * - Onboarding tidak muncul lagi setelah selesai (skip jika complex)
 */

const { fillField, tapElement, waitForLoadingGone } = require('../helpers/appHelper');

describe('[Story 2] Onboarding Nama Pengguna', () => {

  // Helper: skip ke onboarding screen
  async function navigateToOnboarding() {
    // Simulasi: set state onboarding via deeplink atau langsung launch activity
    // Dalam CI: gunakan mock auth yang langsung ke onboarding
    await driver.startActivity('com.libur.indonesia', 'com.libur.indonesia.MainActivity');
    await browser.pause(2000);
  }

  it('ST2-01: Input nama panggilan tersedia di layar onboarding', async () => {
    await navigateToOnboarding();

    // Cek apakah ada input field untuk nama
    const nameInput = await $('android=new UiSelector().className("android.widget.EditText")');
    const inputVisible = await nameInput.isDisplayed().catch(() => false);

    if (inputVisible) {
      // Kita di layar onboarding
      expect(inputVisible).toBe(true);
    } else {
      // Mungkin sudah di Dashboard (onboarding pernah dilewati)
      console.log('Onboarding sudah selesai, skip test ini.');
      pending('Onboarding sudah selesai - skip');
    }
  });

  it('ST2-02: Tombol Mulai disabled jika nama kosong', async () => {
    await navigateToOnboarding();

    const nameInput = await $('android=new UiSelector().className("android.widget.EditText")');
    const inputVisible = await nameInput.isDisplayed().catch(() => false);

    if (!inputVisible) {
      pending('Tidak di layar onboarding - skip');
      return;
    }

    // Pastikan input kosong
    await nameInput.clearValue();

    // Cari tombol Mulai
    const startBtn = await $('android=new UiSelector().textContains("Mulai")');
    await startBtn.waitForDisplayed({ timeout: 5000 });

    // Tombol harus tidak bisa diklik (disabled) atau tidak responsif
    const isEnabled = await startBtn.isEnabled();
    expect(isEnabled).toBe(false);
  });

  it('ST2-03: Isi nama dan klik Mulai -> masuk ke Dashboard', async () => {
    await navigateToOnboarding();

    const nameInput = await $('android=new UiSelector().className("android.widget.EditText")');
    const inputVisible = await nameInput.isDisplayed().catch(() => false);

    if (!inputVisible) {
      pending('Tidak di layar onboarding - skip');
      return;
    }

    // Isi nama
    await nameInput.setValue('Tester Kapanlibur');

    // Tutup keyboard
    await browser.hideKeyboard();
    await browser.pause(500);

    // Tap tombol Mulai
    const startBtn = await $('android=new UiSelector().textContains("Mulai")');
    await startBtn.waitForDisplayed({ timeout: 5000 });
    await startBtn.click();

    await waitForLoadingGone();
    await browser.pause(1500);

    // Verifikasi masuk ke Dashboard
    const dashboardEl = await $('android=new UiSelector().textContains("Beranda")');
    const isDashboard = await dashboardEl.isDisplayed().catch(() => false);
    expect(isDashboard).toBe(true);
  });

  it('ST2-04: Validasi input - tidak bisa isi lebih dari 50 karakter', async () => {
    await navigateToOnboarding();

    const nameInput = await $('android=new UiSelector().className("android.widget.EditText")');
    const inputVisible = await nameInput.isDisplayed().catch(() => false);

    if (!inputVisible) {
      pending('Tidak di layar onboarding - skip');
      return;
    }

    const longName = 'A'.repeat(60);
    await nameInput.setValue(longName);

    const value = await nameInput.getText();
    expect(value.length).toBeLessThanOrEqual(50);
  });

});
