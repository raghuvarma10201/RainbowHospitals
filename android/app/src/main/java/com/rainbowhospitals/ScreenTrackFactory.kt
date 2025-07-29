package com.rainbowhospitals

import android.content.Context
import android.media.projection.MediaProjection
import org.webrtc.*

object ScreenTrackFactory {

    fun createScreenVideoTrack(
        context: Context,
        mediaProjection: MediaProjection,
        factory: PeerConnectionFactory
    ): VideoTrack {
        // Create the custom screen capturer
        val screenCapturer = ScreenCapturer(context, mediaProjection)

        // Create EGL context for rendering
        val eglBase = EglBase.create()
        val surfaceTextureHelper = SurfaceTextureHelper.create(
            "ScreenCaptureThread",
            eglBase.eglBaseContext
        )

        // Create WebRTC video source
        val videoSource = factory.createVideoSource(false)

        // Initialize capturer with surface helper and video source
        screenCapturer.initialize(surfaceTextureHelper, context, videoSource.capturerObserver)

        // Start the screen capture
        screenCapturer.startCapture(720, 1280, 30)

        // Return a video track that can be used in WebRTC
        return factory.createVideoTrack("SCREEN_SHARE_TRACK", videoSource)
    }
}
