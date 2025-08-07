package com.rainbowhospitals

import android.app.Service
import android.content.Intent
import android.graphics.SurfaceTexture
import android.hardware.display.VirtualDisplay
import android.media.projection.MediaProjection
import android.media.projection.MediaProjectionManager
import android.os.IBinder
import android.util.Log
import android.view.Surface
import org.webrtc.*
// import org.jitsi.meet.sdk.ExternalVideoInput
import android.hardware.display.DisplayManager

class ScreenCaptureService : Service() {

    private var mediaProjection: MediaProjection? = null
    private var virtualDisplay: VirtualDisplay? = null
    private var eglBase: EglBase? = null
    private var surfaceTextureHelper: SurfaceTextureHelper? = null
    private var surface: Surface? = null
    private var videoSource: VideoSource? = null
    private var videoTrack: VideoTrack? = null
    private var peerConnectionFactory: PeerConnectionFactory? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val resultCode = intent?.getIntExtra("resultCode", -1) ?: -1
        val data = intent?.getParcelableExtra<Intent>("data")

        if (resultCode != -1 && data != null) {
            val mediaProjectionManager =
                getSystemService(MEDIA_PROJECTION_SERVICE) as MediaProjectionManager
            mediaProjection = mediaProjectionManager.getMediaProjection(resultCode, data)
            startScreenCapture()
        } else {
            stopSelf()
        }

        return START_NOT_STICKY
    }

    private fun startScreenCapture() {
        val width = 720
        val height = 1280
        val fps = 30
        val dpi = resources.displayMetrics.densityDpi

        // Initialize EGL
        eglBase = EglBase.create()

        // Initialize WebRTC
        val options = PeerConnectionFactory.InitializationOptions.builder(this)
            .setEnableInternalTracer(true)
            .createInitializationOptions()
        PeerConnectionFactory.initialize(options)

        val encoderFactory = DefaultVideoEncoderFactory(eglBase!!.eglBaseContext, true, true)
        val decoderFactory = DefaultVideoDecoderFactory(eglBase!!.eglBaseContext)

        peerConnectionFactory = PeerConnectionFactory.builder()
            .setVideoEncoderFactory(encoderFactory)
            .setVideoDecoderFactory(decoderFactory)
            .createPeerConnectionFactory()

        // Create SurfaceTextureHelper
        surfaceTextureHelper = SurfaceTextureHelper.create("ScreenCaptureThread", eglBase!!.eglBaseContext)

        // Create VideoSource and assign capturerObserver
        videoSource = peerConnectionFactory!!.createVideoSource(false)
        val capturerObserver = videoSource!!.capturerObserver

        // Listen for frames from SurfaceTexture
        surfaceTextureHelper!!.startListening { frame ->
            capturerObserver.onFrameCaptured(frame)
            frame.release()
        }

        // Create surface from SurfaceTexture
        val surfaceTexture: SurfaceTexture = surfaceTextureHelper!!.surfaceTexture
        surfaceTexture.setDefaultBufferSize(width, height)
        surface = Surface(surfaceTexture)

        // Create VirtualDisplay
        virtualDisplay = mediaProjection?.createVirtualDisplay(
            "ScreenCapture",
            width,
            height,
            dpi,
            DisplayManager.VIRTUAL_DISPLAY_FLAG_PUBLIC,
            surface,
            null,
            null
        )

        if (virtualDisplay != null) {
            Log.d("ScreenCaptureService", "VirtualDisplay created successfully")
        }

        // Create VideoTrack and set it to Jitsi
        videoTrack = peerConnectionFactory!!.createVideoTrack("SCREEN_TRACK", videoSource)
        // ExternalVideoInput.setVideoTrack(videoTrack)

        Log.d("ScreenCaptureService", "VideoTrack injected to Jitsi")
    }

    override fun onDestroy() {
        super.onDestroy()
        virtualDisplay?.release()
        surface?.release()
        surfaceTextureHelper?.dispose()
        videoTrack?.dispose()
        videoSource?.dispose()
        peerConnectionFactory?.dispose()
        eglBase?.release()

        Log.d("ScreenCaptureService", "Screen capture stopped and resources released")
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
