package com.rainbowhospitals
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.media.AudioAttributes
import android.net.Uri
import android.os.Build

fun CreateCustomSoundNotificationChannel(context: Context) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        val channelId = "rainbow_custom_channel"
        val channelName = "Rainbow Channel"
        val description = "Channel for custom sound notifications"
        val soundUri = Uri.parse("android.resource://${context.packageName}/raw/alert3")

        val audioAttributes = AudioAttributes.Builder()
            .setUsage(AudioAttributes.USAGE_NOTIFICATION)
            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
            .build()

        val channel = NotificationChannel(channelId, channelName, NotificationManager.IMPORTANCE_HIGH).apply {
            setDescription(description)
            setSound(soundUri, audioAttributes)
            enableVibration(true)
            enableLights(true)
        }

        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.createNotificationChannel(channel)
    }
}
