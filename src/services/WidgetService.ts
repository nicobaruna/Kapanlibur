import {NativeModules, Platform} from 'react-native';
import {getNextHoliday, getDaysUntil, formatDate} from '../utils/dateUtils';

const {NativeWidgetModule} = NativeModules;

/**
 * Sync data hari libur terdekat ke Android home screen widget.
 * Dipanggil setiap kali app dibuka atau data di-refresh.
 */
export function updateWidget(): void {
  if (Platform.OS !== 'android' || !NativeWidgetModule) return;

  const nextHoliday = getNextHoliday();
  if (!nextHoliday) {
    NativeWidgetModule.updateWidget('Semua libur 2026 selesai', '✅', '', -1);
    return;
  }

  const daysUntil = getDaysUntil(nextHoliday.date);
  const date = formatDate(nextHoliday.date);

  NativeWidgetModule.updateWidget(nextHoliday.shortName, nextHoliday.emoji, date, daysUntil);
}
