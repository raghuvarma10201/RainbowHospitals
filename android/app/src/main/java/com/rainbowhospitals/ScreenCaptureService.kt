package com.rainbowhospitals

import android.app.*
import android.content.Context
import android.content.Intent
import android.graphics.PixelFormat
import android.media.projection.MediaProjection
import android.media.projection.MediaProjectionManager
import android.os.Build
import android.os.IBinder
import android.util.DisplayMetrics
import android.util.Log
import android.view.Surface
import android.view.SurfaceView
import android.hardware.display.DisplayManager
import android.hardware.display.VirtualDisplay

class ScreenCaptureService : Service() {

    companion object {
        const val NOTIFICATION_CHANNEL_ID = "ScreenCaptureChannel"
        const val NOTIFICATION_ID = 101
        const val ACTION_START = "START_CAPTURE"
        const val ACTION_STOP = "STOP_CAPTURE"
        const val EXTRA_RESULT_CODE = "RESULT_CODE"
        const val EXTRA_DATA_INTENT = "DATA_INTENT"
    }

    private var mediaProjection: MediaProjection? = null
    private var virtualDisplay: VirtualDisplay? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_START -> startScreenCapture(intent)
            ACTION_STOP -> stopSelf()
        }
        return START_STICKY
    }

    private fun startScreenCapture(intent: Intent) {
        val resultCode = intent.getIntExtra(EXTRA_RESULT_CODE, Activity.RESULT_CANCELED)
        val data = intent.getParcelableExtra<Intent>(EXTRA_DATA_INTENT)

        if (resultCode != Activity.RESULT_OK || data == null) {
            Log.e("ScreenCaptureService", "Invalid screen capture intent")
            stopSelf()
            return
        }

        createNotificationChannel()
        startForeground(NOTIFICATION_ID, buildNotification())

        val projectionManager = getSystemService(Context.MEDIA_PROJECTION_SERVICE) as MediaProjectionManager
        mediaProjection = projectionManager.getMediaProjection(resultCode, data)

        val metrics = resources.displayMetrics
        val density = metrics.densityDpi
        val width = metrics.widthPixels
        val height = metrics.heightPixels

        val surfaceView = SurfaceView(this)
        val surface = surfaceView.holder.surface

        virtualDisplay = mediaProjection?.createVirtualDisplay(
            "ScreenCapture",
            width,
            height,
            density,
            DisplayManager.VIRTUAL_DISPLAY_FLAG_AUTO_MIRROR,
            surface,
            null,
            null
        )

        Log.i("ScreenCaptureService", "Virtual display started")
    }

    private fun buildNotification(): Notification {
        val stopIntent = Intent(this, ScreenCaptureService::class.java).apply {
            action = ACTION_STOP
        }
        val stopPendingIntent = PendingIntent.getService(
            this, 0, stopIntent, PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        return Notification.Builder(this, NOTIFICATION_CHANNEL_ID)
            .setContentTitle("Screen Sharing Active")
            .setContentText("Your screen is being shared")
            .setSmallIcon(android.R.drawable.presence_video_online)
            .addAction(android.R.drawable.ic_menu_close_clear_cancel, "Stop", stopPendingIntent)
            .build()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                NOTIFICATION_CHANNEL_ID,
                "Screen Sharing",
                NotificationManager.IMPORTANCE_DEFAULT
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }
    }

    override fun onDestroy() {
        virtualDisplay?.release()
        mediaProjection?.stop()
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
