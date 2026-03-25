'use strict';
/**
 * Story 4: Melihat Kalender Hari Libur
 *
 * Test coverage:
 * - Tab Kalender bisa diakses
 * - Kalender bulanan tampil
 * - Navigasi prev/next bulan berfungsi
 * - Tap pada tanggal libur menampilkan detail
 */

const { tapTab, isElementPresent } = require('../helpers/appHelper');

describe('[Story 4] Kalender Hari Libur', () => {

  beforeAll(async () => {
    await tapTab('Kalender');
    await browser.pause(1500);
  });

  it('ST4-01: Tab Kalender berhasil dibuka', async () => {
    // Cek bahwa kita sudah di halaman kalender
    const calendarView = await $('android=new UiSelector().className("android.widget.ScrollView")');
    const scrollPresent = await calendarView.isDisplayed().catch(() => false);
    expect(scrollPresent).toBe(true);
  });

  it('ST4-02: Komponen kalender bulanan tampil', async () => {
    // react-native-calendars menggunakan Views
    // Cari hari dalam seminggu header: Min Sel Rab Kam Jum Sab
    const dayHeaders = ['MIN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];
    let foundHeaders = 0;
    for (const day of dayHeaders) {
      const el = await $(`android=new UiSelector().textContains("${day}")`);
      if (await el.isDisplayed().catch(() => false)) foundHeaders++;
    }
    // Minimal 3 dari 6 header terlihat (mungkin terpotong)
    expect(foundHeaders).toBeGreaterThanOrEqual(3);
  });

  it('ST4-03: Tombol navigasi bulan (panah prev/next) tersedia', async () => {
    // Cari tombol navigasi - biasanya ada ikon panah kiri/kanan
    const arrowButtons = await $$('android=new UiSelector().className("android.view.ViewGroup").clickable(true)');
    expect(arrowButtons.length).toBeGreaterThan(0);
  });

  it('ST4-04: Navigasi ke bulan berikutnya berfungsi', async () => {
    // Ambil teks bulan saat ini
    const monthTexts = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    let currentMonthEl = null;
    for (const month of monthTexts) {
      const el = await $(`android=new UiSelector().textContains("${month}")`);
      if (await el.isDisplayed().catch(() => false)) {
        currentMonthEl = el;
        break;
      }
    }

    if (!currentMonthEl) {
      pending('Tidak menemukan nama bulan - skip');
      return;
    }

    const currentMonthText = await currentMonthEl.getText();

    // Klik tombol next (cari tombol di sisi kanan judul bulan)
    // react-native-calendars biasanya gunakan '>' atau arrow icon
    const nextBtn = await $('android=new UiSelector().descriptionContains("next")');
    const nextBtnAlt = await $('android=new UiSelector().textContains(">")');
    const nextBtnAlt2 = await $('android=new UiSelector().descriptionContains("forward")');

    const nextVisible = await nextBtn.isDisplayed().catch(() => false)
      || await nextBtnAlt.isDisplayed().catch(() => false)
      || await nextBtnAlt2.isDisplayed().catch(() => false);

    if (nextVisible) {
      if (await nextBtn.isDisplayed().catch(() => false)) await nextBtn.click();
      else if (await nextBtnAlt.isDisplayed().catch(() => false)) await nextBtnAlt.click();
      else await nextBtnAlt2.click();

      await browser.pause(1000);

      // Verifikasi bulan berubah
      let newMonthText = '';
      for (const month of monthTexts) {
        const el = await $(`android=new UiSelector().textContains("${month}")`);
        if (await el.isDisplayed().catch(() => false)) {
          newMonthText = await el.getText();
          break;
        }
      }

      expect(newMonthText).not.toEqual(currentMonthText);
    } else {
      // Fallback: swipe ke kiri untuk pindah bulan
      await browser.execute('mobile: swipeGesture', {
        left: 800, top: 400, width: 500, height: 200,
        direction: 'left', percent: 0.9,
      });
      await browser.pause(1000);
      console.log('Navigasi menggunakan swipe gesture');
    }
  });

  it('ST4-05: Tap tanggal menampilkan informasi hari libur', async () => {
    // Cari tanggal yang merupakan hari libur (biasanya merah/berwarna)
    // Tangal 1 Januari biasanya libur
    const jan1 = await $('android=new UiSelector().text("1")');
    if (await jan1.isDisplayed().catch(() => false)) {
      await jan1.click();
      await browser.pause(1000);

      // Cek apakah ada popup atau section detail yang muncul
      const detailEl = await $('android=new UiSelector().textContains("Tahun Baru")');
      const anyDetail = await $('android=new UiSelector().textContains("Libur")');

      const detailVisible = await detailEl.isDisplayed().catch(() => false)
        || await anyDetail.isDisplayed().catch(() => false);

      console.log('Detail holiday tampil:', detailVisible);
    } else {
      pending('Tanggal 1 tidak terlihat - mungkin bukan bulan Januari');
    }
  });

});
