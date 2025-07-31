package com.rainbowhospitals

import android.app.*
import android.content.*
import android.media.projection.*
import android.os.*
import android.util.Log
import android.widget.Toast

class ScreenCaptureService : Service() {

    companion object {
        const val NOTIFICATION_ID = 1234
        const val CHANNEL_ID = "ScreenShareChannel"
        const val ACTION_START = "START_SCREEN_CAPTURE"
        const val ACTION_STOP = "STOP_SCREEN_CAPTURE"
        var resultCode: Int = 0
        var dataIntent: Intent? = null
    }

    private lateinit var mediaProjection: MediaProjection
    private lateinit var mediaProjectionManager: MediaProjectionManager

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_START -> {
                startForegroundService()
                startProjection()
            }
            ACTION_STOP -> {
                stopProjection()
                stopSelf()
            }
        }
        return START_STICKY
    }

    private fun startForegroundService() {
        val notification = Notification.Builder(this, CHANNEL_ID)
            .setContentTitle("Screen Sharing")
            .setContentText("Screen sharing is active")
            .setSmallIcon(android.R.drawable.ic_menu_camera)
            .build()

        val manager = getSystemService(NotificationManager::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Screen Sharing",
                NotificationManager.IMPORTANCE_DEFAULT
            )
            manager.createNotificationChannel(channel)
        }

        startForeground(NOTIFICATION_ID, notification)
    }

    private fun startProjection() {
        mediaProjectionManager =
            getSystemService(Context.MEDIA_PROJECTION_SERVICE) as MediaProjectionManager

        if (dataIntent != null) {
            mediaProjection = mediaProjectionManager.getMediaProjection(resultCode, dataIntent!!)!!
            Toast.makeText(this, "Started Screen Capture", Toast.LENGTH_SHORT).show()
            // TODO: setup VirtualDisplay + Surface + WebRTC
        }
    }

    private fun stopProjection() {
        mediaProjection.stop()
        Toast.makeText(this, "Stopped Screen Capture", Toast.LENGTH_SHORT).show()
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
