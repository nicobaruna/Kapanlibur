const path = require('path');

const APK_PATH = process.env.APK_PATH || path.resolve(__dirname, '../android/app/build/outputs/apk/release/app-release.apk');
const DEVICE_NAME = process.env.DEVICE_NAME || 'emulator-5554';
const APPIUM_HOST = process.env.APPIUM_HOST || 'localhost';
const APPIUM_PORT = parseInt(process.env.APPIUM_PORT || '4723', 10);

exports.config = {
  runner: 'local',
  port: APPIUM_PORT,
  hostname: APPIUM_HOST,
  specs: ['./tests/**/*.test.js'],
  exclude: [],
  maxInstances: 1,
  capabilities: [{
    platformName: 'Android',
    'appium:deviceName': DEVICE_NAME,
    'appium:automationName': 'UiAutomator2',
    'appium:app': APK_PATH,
    'appium:appPackage': 'com.libur.indonesia',
    'appium:appActivity': 'com.libur.indonesia.MainActivity',
    'appium:noReset': false,
    'appium:fullReset': false,
    'appium:newCommandTimeout': 60,
    'appium:autoGrantPermissions': true,
  }],
  logLevel: 'info',
  bail: 0,
  waitforTimeout: 15000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: ['appium'],
  framework: 'jasmine',
  reporters: [
    'spec',
    ['allure', {
      outputDir: 'allure-results',
      disableWebdriverStepsReporting: false,
      disableWebdriverScreenshotsReporting: false,
    }]
  ],
  jasmineOpts: {
    defaultTimeoutInterval: 60000,
    expectationResultHandler(passed, assertion) {
      if (!passed) {
        browser.takeScreenshot();
      }
    },
  },

  afterTest: async function (test, _context, { error, passed }) {
    if (!passed || error) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      await browser.saveScreenshot(`./screenshots/fail_${test.title.replace(/\s+/g, '_')}_${timestamp}.png`);
    }
  },
};
