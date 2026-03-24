package com.nicobaruna.liburindonesia

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class NativeWidgetModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "NativeWidgetModule"

    @ReactMethod
    fun updateWidget(name: String, emoji: String, date: String, daysUntil: Int) {
        val context = reactApplicationContext

        // Simpan ke SharedPreferences agar widget bisa baca saat sistem refresh
        context.getSharedPreferences(HolidayWidgetProvider.PREFS_NAME, Context.MODE_PRIVATE)
            .edit()
            .putString("holiday_name", name)
            .putString("holiday_emoji", emoji)
            .putString("holiday_date", date)
            .putInt("holiday_days_until", daysUntil)
            .apply()

        // Trigger update semua instance widget yang terpasang
        val manager = AppWidgetManager.getInstance(context)
        val ids = manager.getAppWidgetIds(
            ComponentName(context, HolidayWidgetProvider::class.java)
        )
        for (id in ids) {
            HolidayWidgetProvider.updateAppWidget(context, manager, id)
        }
    }
}
