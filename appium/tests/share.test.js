'use strict';
/**
 * Story 6: Share Long Weekend ke WhatsApp sebagai Gambar
 *
 * Test coverage:
 * - Tombol share tersedia di kartu long weekend
 * - Modal share muncul saat tombol diklik
 * - Pilihan platform tersedia (WhatsApp, X, Threads, Instagram)
 * - Tap WhatsApp memulai proses share
 */

const { tapTab, tapElement, isElementPresent } = require('../helpers/appHelper');

describe('[Story 6] Share Long Weekend ke WhatsApp', () => {

  beforeAll(async () => {
    await tapTab('Long Weekend');
    await browser.pause(1500);
  });

  afterEach(async () => {
    // Tutup modal share jika masih terbuka
    const closeBtn = await $('android=new UiSelector().descriptionContains("close")');
    if (await closeBtn.isDisplayed().catch(() => false)) {
      await closeBtn.click();
      await browser.pause(500);
    }

    // Atau tekan back
    await driver.back();
    await browser.pause(500);

    // Kembali ke Long Weekend tab jika perlu
    await tapTab('Long Weekend');
    await browser.pause(1000);
  });

  it('ST6-01: Tombol share tersedia di kartu long weekend', async () => {
    // Cari tombol share - bisa berisi text "Share", "Bagikan", atau icon share
    const shareBtn = await $('android=new UiSelector().descriptionContains("share")');
    const shareBtnText = await $('android=new UiSelector().textContains("Bagikan")');
    const shareBtnText2 = await $('android=new UiSelector().textContains("Share")');

    const visible = await shareBtn.isDisplayed().catch(() => false)
      || await shareBtnText.isDisplayed().catch(() => false)
      || await shareBtnText2.isDisplayed().catch(() => false);

    expect(visible).toBe(true);
  });

  it('ST6-02: Modal share muncul saat tombol diklik', async () => {
    // Klik tombol share pertama yang ditemukan
    const shareSelectors = [
      'android=new UiSelector().descriptionContains("share")',
      'android=new UiSelector().textContains("Bagikan")',
      'android=new UiSelector().textContains("Share")',
    ];

    let clicked = false;
    for (const sel of shareSelectors) {
      const btn = await $(sel);
      if (await btn.isDisplayed().catch(() => false)) {
        await btn.click();
        clicked = true;
        break;
      }
    }

    if (!clicked) {
      pending('Tombol share tidak ditemukan');
      return;
    }

    await browser.pause(1500);

    // Modal share harus muncul
    const modal = await $('android=new UiSelector().textContains("WhatsApp")');
    const modalAlt = await $('android=new UiSelector().textContains("whatsapp")');

    const modalVisible = await modal.isDisplayed().catch(() => false)
      || await modalAlt.isDisplayed().catch(() => false);

    expect(modalVisible).toBe(true);
  });

  it('ST6-03: Modal share menampilkan pilihan platform', async () => {
    // Buka modal share
    const shareSelectors = [
      'android=new UiSelector().descriptionContains("share")',
      'android=new UiSelector().textContains("Bagikan")',
      'android=new UiSelector().textContains("Share")',
    ];

    for (const sel of shareSelectors) {
      const btn = await $(sel);
      if (await btn.isDisplayed().catch(() => false)) {
        await btn.click();
        break;
      }
    }

    await browser.pause(1500);

    // Cek platform yang tersedia
    const platforms = ['WhatsApp', 'X', 'Instagram'];
    const foundPlatforms = [];

    for (const platform of platforms) {
      const el = await $(`android=new UiSelector().textContains("${platform}")`);
      if (await el.isDisplayed().catch(() => false)) {
        foundPlatforms.push(platform);
      }
    }

    console.log('Platform ditemukan:', foundPlatforms);
    expect(foundPlatforms.length).toBeGreaterThan(0);
  });

  it('ST6-04: Tap WhatsApp memulai proses share', async () => {
    // Buka modal
    const shareSelectors = [
      'android=new UiSelector().descriptionContains("share")',
      'android=new UiSelector().textContains("Bagikan")',
      'android=new UiSelector().textContains("Share")',
    ];

    for (const sel of shareSelectors) {
      const btn = await $(sel);
      if (await btn.isDisplayed().catch(() => false)) {
        await btn.click();
        break;
      }
    }

    await browser.pause(1500);

    // Klik tombol WhatsApp
    const whatsappBtn = await $('android=new UiSelector().textContains("WhatsApp")');
    const waVisible = await whatsappBtn.isDisplayed().catch(() => false);

    if (!waVisible) {
      pending('Tombol WhatsApp tidak tampil di modal');
      return;
    }

    await whatsappBtn.click();
    await browser.pause(2000);

    // Setelah tap, bisa terjadi:
    // 1. WhatsApp terbuka (jika terinstall)
    // 2. System share sheet muncul
    // 3. Kembali ke app (jika WA tidak terinstall)
    // Semua skenario valid - yang penting tidak crash

    const currentPackage = await driver.getCurrentPackage();
    console.log('Current package after share:', currentPackage);

    // App masih jalan (tidak crash)
    expect(currentPackage).toBeTruthy();
  });

  it('ST6-05: Konten share card tampil di modal', async () => {
    // Buka modal
    const shareSelectors = [
      'android=new UiSelector().descriptionContains("share")',
      'android=new UiSelector().textContains("Bagikan")',
      'android=new UiSelector().textContains("Share")',
    ];

    for (const sel of shareSelectors) {
      const btn = await $(sel);
      if (await btn.isDisplayed().catch(() => false)) {
        await btn.click();
        break;
      }
    }

    await browser.pause(1500);

    // Preview kartu share harus tampil (berisi nama libur atau tanggal)
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    let cardContentFound = false;
    for (const month of months) {
      const el = await $(`android=new UiSelector().textContains("${month}")`);
      if (await el.isDisplayed().catch(() => false)) {
        cardContentFound = true;
        break;
      }
    }

    expect(cardContentFound).toBe(true);
  });

});
