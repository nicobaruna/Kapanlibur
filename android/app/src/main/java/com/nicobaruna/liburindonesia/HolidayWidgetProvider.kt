package com.nicobaruna.liburindonesia

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews

class HolidayWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    companion object {
        const val PREFS_NAME = "LiburIndonesiaWidget"

        fun updateAppWidget(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetId: Int
        ) {
            val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            val name = prefs.getString("holiday_name", "Buka app untuk memuat") ?: "Buka app untuk memuat"
            val emoji = prefs.getString("holiday_emoji", "🇮🇩") ?: "🇮🇩"
            val date = prefs.getString("holiday_date", "") ?: ""
            val daysUntil = prefs.getInt("holiday_days_until", -1)

            val views = RemoteViews(context.packageName, R.layout.widget_holiday)

            views.setTextViewText(R.id.widget_emoji, emoji)
            views.setTextViewText(R.id.widget_name, name)
            views.setTextViewText(R.id.widget_date, date)

            val (daysText, daysLabel) = when {
                daysUntil == 0 -> Pair("🎉 Hari ini!", "")
                daysUntil == 1 -> Pair("⏰ Besok!", "")
                daysUntil > 1  -> Pair("$daysUntil", " hari lagi")
                else           -> Pair("--", "")
            }
            views.setTextViewText(R.id.widget_days, daysText)
            views.setTextViewText(R.id.widget_days_label, daysLabel)

            // Tap widget → buka app
            val intent = Intent(context, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            }
            val pendingIntent = PendingIntent.getActivity(
                context, 0, intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_root, pendingIntent)

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
