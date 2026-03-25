'use strict';
/**
 * Story 3: Lihat Hari Libur Berikutnya di Dashboard
 *
 * Test coverage:
 * - Dashboard tampil sebagai tab pertama
 * - Kartu "Hari Libur Berikutnya" ada
 * - Countdown hari ditampilkan
 * - Daftar upcoming holidays ada (minimal 1 item)
 * - Kartu Long Weekend ada
 * - Pull-to-refresh berfungsi
 */

const { tapTab, scrollDown, isElementPresent } = require('../helpers/appHelper');

describe('[Story 3] Dashboard - Hari Libur Berikutnya', () => {

  beforeAll(async () => {
    // Pastikan kita di Dashboard
    await tapTab('Beranda');
    await browser.pause(1500);
  });

  it('ST3-01: Dashboard berhasil dimuat', async () => {
    const beranda = await $('android=new UiSelector().text("Beranda")');
    await expect(beranda).toBeDisplayed();
  });

  it('ST3-02: Kartu hari libur berikutnya tampil', async () => {
    // Cari kartu next holiday - bisa berisi teks "Hari Libur" atau nama hari libur
    const nextHolidayCard = await $('android=new UiSelector().textContains("Hari Libur")');
    const altCard = await $('android=new UiSelector().textContains("libur")');

    const cardVisible = await nextHolidayCard.isDisplayed().catch(() => false)
      || await altCard.isDisplayed().catch(() => false);
    expect(cardVisible).toBe(true);
  });

  it('ST3-03: Countdown hari ditampilkan', async () => {
    // Cari elemen yang mengandung "hari lagi" atau angka countdown
    const countdown = await $('android=new UiSelector().textContains("hari lagi")');
    const countdownAlt = await $('android=new UiSelector().textContains("Hari lagi")');
    const countdownAlt2 = await $('android=new UiSelector().textContains("lagi")');

    const visible = await countdown.isDisplayed().catch(() => false)
      || await countdownAlt.isDisplayed().catch(() => false)
      || await countdownAlt2.isDisplayed().catch(() => false);
    expect(visible).toBe(true);
  });

  it('ST3-04: Daftar upcoming holidays tampil (minimal 1 item)', async () => {
    // Scroll sedikit ke bawah untuk melihat list
    await scrollDown(1);
    await browser.pause(500);

    // Cari list item atau kartu
    const listItems = await $$('android=new UiSelector().className("android.view.ViewGroup").clickable(true)');
    expect(listItems.length).toBeGreaterThan(0);
  });

  it('ST3-05: Kartu Long Weekend berikutnya tampil', async () => {
    const lwCard = await $('android=new UiSelector().textContains("Long Weekend")');
    const lwCardAlt = await $('android=new UiSelector().textContains("long weekend")');

    const visible = await lwCard.isDisplayed().catch(() => false)
      || await lwCardAlt.isDisplayed().catch(() => false);
    expect(visible).toBe(true);
  });

  it('ST3-06: Pull-to-refresh berfungsi', async () => {
    // Scroll ke atas dulu
    await browser.execute('mobile: scrollGesture', {
      left: 100, top: 100, width: 200, height: 800,
      direction: 'up', percent: 1.0,
    });
    await browser.pause(500);

    // Lakukan pull-to-refresh
    await browser.execute('mobile: scrollGesture', {
      left: 200, top: 200, width: 200, height: 800,
      direction: 'down', percent: 1.5,
    });
    await browser.pause(2000);

    // Verifikasi konten masih ada setelah refresh
    const dashEl = await $('android=new UiSelector().textContains("Beranda")');
    await expect(dashEl).toBeDisplayed();
  });

  it('ST3-07: Tab navigasi bottom tampil dengan 5 tab', async () => {
    const tabs = ['Beranda', 'Kalender', 'Long Weekend', 'Finansial', 'Profil'];
    for (const tab of tabs) {
      const tabEl = await $(`android=new UiSelector().text("${tab}")`);
      const visible = await tabEl.isDisplayed().catch(() => false);
      expect(visible).toBe(true, `Tab "${tab}" tidak tampil`);
    }
  });

});
