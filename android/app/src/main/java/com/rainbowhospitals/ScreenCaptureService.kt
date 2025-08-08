package com.rainbowhospitals

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.media.projection.MediaProjection
import android.media.projection.MediaProjectionManager
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import org.jitsi.meet.sdk.ExternalVideoInput
import org.webrtc.*

class ScreenCaptureService : Service() {

    private var eglBase: EglBase? = null
    private var surfaceTextureHelper: SurfaceTextureHelper? = null
    private var peerConnectionFactory: PeerConnectionFactory? = null
    private var videoSource: VideoSource? = null
    private var videoTrack: VideoTrack? = null
    private var screenCapturer: ScreenCapturerAndroid? = null
    private var mediaProjection: MediaProjection? = null

    companion object {
        private const val TAG = "ScreenCaptureService"
        private const val NOTIF_CHANNEL_ID = "screen_capture_channel"
        private const val NOTIF_ID = 4321
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.d(TAG, "▶️ onStartCommand called with intent: $intent")

        val resultCode = intent?.getIntExtra("resultCode", -1) ?: -1
        val data = intent?.getParcelableExtra<Intent>("data")

        if (resultCode != -1 && data != null) {
            Log.d(TAG, "✅ Projection data received, starting capture...")
            startForegroundServiceNotification()
            startScreenCapture(resultCode, data)
        } else {
            Log.e(TAG, "❌ Missing projection data. Stopping service.")
            stopSelf()
        }

        return START_NOT_STICKY
    }

    private fun startForegroundServiceNotification() {
        val channelName = "Screen Capture Service"
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val chan = NotificationChannel(
                NOTIF_CHANNEL_ID,
                channelName,
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.createNotificationChannel(chan)
        }

        val notification: Notification = NotificationCompat.Builder(this, NOTIF_CHANNEL_ID)
            .setContentTitle("Screen sharing in progress")
            .setContentText("Your screen is being shared.")
            .setSmallIcon(android.R.drawable.ic_menu_camera)
            .setOngoing(true)
            .build()

        startForeground(NOTIF_ID, notification)
    }

    private fun startScreenCapture(resultCode: Int, data: Intent) {
        val width = 720
        val height = 1280
        val fps = 30

        Log.d(TAG, "🎥 Initializing WebRTC for screen capture ($width x $height @ $fps fps)")

        // MediaProjection setup
        val projectionManager =
            getSystemService(Context.MEDIA_PROJECTION_SERVICE) as MediaProjectionManager
        mediaProjection = projectionManager.getMediaProjection(resultCode, data)
        if (mediaProjection == null) {
            Log.e(TAG, "❌ mediaProjection is null — cannot start capture.")
            stopSelf()
            return
        }

        eglBase = EglBase.create()

        // Init WebRTC
        val options = PeerConnectionFactory.InitializationOptions
            .builder(this)
            .setEnableInternalTracer(true)
            .createInitializationOptions()
        PeerConnectionFactory.initialize(options)

        val encoderFactory = DefaultVideoEncoderFactory(eglBase!!.eglBaseContext, true, true)
        val decoderFactory = DefaultVideoDecoderFactory(eglBase!!.eglBaseContext)

        peerConnectionFactory = PeerConnectionFactory.builder()
            .setVideoEncoderFactory(encoderFactory)
            .setVideoDecoderFactory(decoderFactory)
            .createPeerConnectionFactory()

        screenCapturer = ScreenCapturerAndroid(
            data,
            object : MediaProjection.Callback() {
                override fun onStop() {
                    Log.w(TAG, "⚠️ MediaProjection stopped by the system/user")
                    stopSelf()
                }
            }
        )

        surfaceTextureHelper = SurfaceTextureHelper.create("ScreenCaptureThread", eglBase!!.eglBaseContext)

        videoSource = peerConnectionFactory!!.createVideoSource(false)
        screenCapturer!!.initialize(surfaceTextureHelper, applicationContext, videoSource!!.capturerObserver)

        try {
            screenCapturer!!.startCapture(width, height, fps)
            Log.d(TAG, "✅ Screen capturer started")
        } catch (e: Exception) {
            Log.e(TAG, "❌ Failed to start screen capturer", e)
            stopSelf()
            return
        }

        videoTrack = peerConnectionFactory!!.createVideoTrack("SCREEN_TRACK", videoSource)
        if (videoTrack == null) {
            Log.e(TAG, "❌ Failed to create VideoTrack")
            stopSelf()
            return
        }

        // Inject into Jitsi
        ExternalVideoInput.setVideoTrack(videoTrack)
        Log.i(TAG, "📤 Injected screen track into ExternalVideoInput")

        // Debug: Check if videoTrack is sending frames
        videoTrack!!.addSink { frame ->
            Log.d(TAG, "🖼  Frame captured: ${frame.buffer.width}x${frame.buffer.height}")
        }
    }

    override fun onDestroy() {
        Log.d(TAG, "🛑 onDestroy called — stopping capture & cleaning resources")

        try {
            screenCapturer?.stopCapture()
        } catch (e: InterruptedException) {
            Log.e(TAG, "❌ Error stopping capturer", e)
        }

        videoTrack?.dispose()
        videoSource?.dispose()
        surfaceTextureHelper?.dispose()
        eglBase?.release()
        peerConnectionFactory?.dispose()
        screenCapturer?.dispose()
        mediaProjection?.stop()

        screenCapturer = null
        videoTrack = null
        videoSource = null
        surfaceTextureHelper = null
        eglBase = null
        peerConnectionFactory = null
        mediaProjection = null

        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
