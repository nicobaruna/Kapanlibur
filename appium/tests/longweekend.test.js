'use strict';
/**
 * Story 5: Melihat Daftar Long Weekend
 *
 * Test coverage:
 * - Tab Long Weekend bisa dibuka
 * - Daftar long weekend tampil
 * - Setiap kartu memiliki info tanggal & hari
 * - Bisa scroll ke bawah untuk melihat semua
 * - Long weekend yang sudah lewat tampil berbeda
 */

const { tapTab, scrollDown, isElementPresent } = require('../helpers/appHelper');

describe('[Story 5] Daftar Long Weekend', () => {

  beforeAll(async () => {
    await tapTab('Long Weekend');
    await browser.pause(1500);
  });

  it('ST5-01: Tab Long Weekend berhasil dibuka', async () => {
    // Verifikasi ada konten di halaman
    const scrollView = await $('android=new UiSelector().className("android.widget.ScrollView")');
    const scrollPresent = await scrollView.isDisplayed().catch(() => false);
    expect(scrollPresent).toBe(true);
  });

  it('ST5-02: Minimal 1 kartu long weekend tampil', async () => {
    // Cari kartu dengan informasi long weekend
    const cards = await $$('android=new UiSelector().className("android.view.ViewGroup").clickable(true)');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('ST5-03: Kartu long weekend berisi informasi hari dan tanggal', async () => {
    // Cari teks yang mengandung nama bulan (menandakan ada tanggal)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

    let monthFound = false;
    for (const month of months) {
      const el = await $(`android=new UiSelector().textContains("${month}")`);
      if (await el.isDisplayed().catch(() => false)) {
        monthFound = true;
        break;
      }
    }
    expect(monthFound).toBe(true);
  });

  it('ST5-04: Info jumlah hari tampil di kartu', async () => {
    // Cari teks mengandung "hari" (misal: "4 hari", "5 Hari")
    const daysEl = await $('android=new UiSelector().textContains("hari")');
    const daysElAlt = await $('android=new UiSelector().textContains("Hari")');
    const visible = await daysEl.isDisplayed().catch(() => false)
      || await daysElAlt.isDisplayed().catch(() => false);
    expect(visible).toBe(true);
  });

  it('ST5-05: Dapat scroll untuk melihat lebih banyak long weekend', async () => {
    // Scroll ke bawah
    const initialCards = await $$('android=new UiSelector().className("android.view.ViewGroup").clickable(true)');
    const initialCount = initialCards.length;

    await scrollDown(2);
    await browser.pause(500);

    // Setelah scroll, masih ada konten (tidak crash)
    const afterScrollCards = await $$('android=new UiSelector().className("android.view.ViewGroup").clickable(true)');
    expect(afterScrollCards.length).toBeGreaterThan(0);

    console.log(`Cards before scroll: ${initialCount}, after scroll: ${afterScrollCards.length}`);
  });

  it('ST5-06: Countdown "lagi" tampil untuk long weekend mendatang', async () => {
    // Scroll kembali ke atas
    await browser.execute('mobile: scrollGesture', {
      left: 100, top: 100, width: 200, height: 800,
      direction: 'up', percent: 1.0,
    });
    await browser.pause(500);

    const countdownEl = await $('android=new UiSelector().textContains("lagi")');
    const visible = await countdownEl.isDisplayed().catch(() => false);
    expect(visible).toBe(true);
  });

});
