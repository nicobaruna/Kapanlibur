'use strict';

/**
 * Helpers untuk Appium tests Kapanlibur
 */

/**
 * Tunggu element muncul dan klik
 */
async function tapElement(selector, timeout = 15000) {
  const el = await $(selector);
  await el.waitForDisplayed({ timeout });
  await el.click();
}

/**
 * Tunggu element muncul dan isi teks
 */
async function fillField(selector, text, timeout = 15000) {
  const el = await $(selector);
  await el.waitForDisplayed({ timeout });
  await el.clearValue();
  await el.setValue(text);
}

/**
 * Tap tab navigasi bawah berdasarkan label
 */
async function tapTab(label) {
  // React Navigation bottom tab - cari berdasarkan content-desc atau text
  const tabEl = await $(`~${label}`);
  if (await tabEl.isDisplayed()) {
    await tabEl.click();
    return;
  }
  // Fallback: cari berdasarkan text
  const textEl = await $(`android=new UiSelector().text("${label}")`);
  await textEl.waitForDisplayed({ timeout: 10000 });
  await textEl.click();
}

/**
 * Scroll vertikal ke bawah
 */
async function scrollDown(times = 1) {
  for (let i = 0; i < times; i++) {
    await browser.execute('mobile: scrollGesture', {
      left: 100, top: 300, width: 200, height: 800,
      direction: 'down', percent: 0.75,
    });
    await browser.pause(500);
  }
}

/**
 * Tunggu loading hilang
 */
async function waitForLoadingGone(timeout = 20000) {
  try {
    const spinner = await $('android=new UiSelector().className("android.widget.ProgressBar")');
    await spinner.waitForDisplayed({ timeout: 5000 });
    await spinner.waitForDisplayed({ timeout, reverse: true });
  } catch (_) {
    // spinner tidak muncul, lanjut
  }
}

/**
 * Cek apakah element ada di layar
 */
async function isElementPresent(selector) {
  try {
    const el = await $(selector);
    return await el.isDisplayed();
  } catch (_) {
    return false;
  }
}

/**
 * Ambil teks dari element
 */
async function getText(selector, timeout = 10000) {
  const el = await $(selector);
  await el.waitForDisplayed({ timeout });
  return await el.getText();
}

module.exports = {
  tapElement,
  fillField,
  tapTab,
  scrollDown,
  waitForLoadingGone,
  isElementPresent,
  getText,
};
