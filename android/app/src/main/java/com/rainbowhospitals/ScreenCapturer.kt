package com.rainbowhospitals

import android.content.Context
import android.hardware.display.DisplayManager
import android.hardware.display.VirtualDisplay
import android.media.ImageReader
import android.media.projection.MediaProjection
import android.util.DisplayMetrics
import android.view.Surface
import org.webrtc.CapturerObserver
import org.webrtc.SurfaceTextureHelper
import org.webrtc.VideoCapturer
import org.webrtc.VideoFrame
import org.webrtc.VideoSink
import org.webrtc.VideoSource

class ScreenCapturer(
    private val context: Context,
    private val mediaProjection: MediaProjection
) : VideoCapturer {

    private var capturerObserver: CapturerObserver? = null
    private var virtualDisplay: VirtualDisplay? = null
    private var surfaceTextureHelper: SurfaceTextureHelper? = null

    override fun initialize(
        surfaceTextureHelper: SurfaceTextureHelper,
        context: Context,
        capturerObserver: CapturerObserver
    ) {
        this.surfaceTextureHelper = surfaceTextureHelper
        this.capturerObserver = capturerObserver
    }

    override fun startCapture(width: Int, height: Int, framerate: Int) {
        val metrics = context.resources.displayMetrics

        val surface = surfaceTextureHelper!!.surfaceTexture
        val displaySurface = Surface(surface)

        virtualDisplay = mediaProjection.createVirtualDisplay(
            "ScreenCapture",
            width,
            height,
            metrics.densityDpi,
            DisplayManager.VIRTUAL_DISPLAY_FLAG_PUBLIC,
            displaySurface,
            null,
            null
        )
    }

    override fun stopCapture() {
        virtualDisplay?.release()
        surfaceTextureHelper?.dispose()
    }

    override fun isScreencast(): Boolean = true

    override fun changeCaptureFormat(width: Int, height: Int, framerate: Int) {}
    override fun dispose() {
        stopCapture()
    }
}
