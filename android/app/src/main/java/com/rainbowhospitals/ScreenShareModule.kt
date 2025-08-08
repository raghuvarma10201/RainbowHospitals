package com.rainbowhospitals

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.media.projection.MediaProjectionManager
import android.os.Build
import androidx.annotation.RequiresApi
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import org.jitsi.meet.sdk.JMOngoingConferenceService
import android.util.Log

class ScreenShareModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private val SCREEN_CAPTURE_REQUEST_CODE = 1000

    override fun getName(): String = "ScreenShareModule"

    @RequiresApi(Build.VERSION_CODES.LOLLIPOP)
    @ReactMethod
    fun startScreenShare() {
        val activity: Activity? = currentActivity
        if (activity != null) {
            Log.d(TAG, "[ScreenShareModule] Requesting screen share permission...")
            val projectionManager =
                activity.getSystemService(Context.MEDIA_PROJECTION_SERVICE) as MediaProjectionManager
            val captureIntent = projectionManager.createScreenCaptureIntent()
            activity.startActivityForResult(captureIntent, SCREEN_CAPTURE_REQUEST_CODE)
        } else {
            Log.e(TAG, "[ScreenShareModule] startScreenShare() failed — no currentActivity")
        }
    }

    private fun sendEvent(eventName: String, params: WritableMap? = null) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    init {
        reactContext.addActivityEventListener(object : BaseActivityEventListener() {
            @RequiresApi(Build.VERSION_CODES.LOLLIPOP)
            override fun onActivityResult(
                activity: Activity?,
                requestCode: Int,
                resultCode: Int,
                data: Intent?
            ) {
                if (requestCode == SCREEN_CAPTURE_REQUEST_CODE) {
                    if (resultCode == Activity.RESULT_OK && data != null) {
                        Log.d(TAG, "[ScreenShareModule] ✅ Screen share permission granted")

                        sendEvent("ScreenSharePermissionGranted")

                        // 1️⃣ Start the Jitsi ongoing conference service to register ExternalVideoInput listener
                        try {
                            Log.d(TAG, "[ScreenShareModule] Launching JMOngoingConferenceService...")
                            JMOngoingConferenceService.launch(reactContext.applicationContext)
                        } catch (e: Exception) {
                            Log.e(TAG, "[ScreenShareModule] Failed to launch JMOngoingConferenceService", e)
                        }

                        // 2️⃣ Start the ScreenCaptureService with projection data
                        try {
                            Log.d(TAG, "[ScreenShareModule] Starting ScreenCaptureService...")
                            val serviceIntent = Intent(activity, ScreenCaptureService::class.java)
                            serviceIntent.putExtra("resultCode", resultCode)
                            serviceIntent.putExtra("data", data)

                            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                                activity?.startForegroundService(serviceIntent)
                            } else {
                                activity?.startService(serviceIntent)
                            }
                        } catch (e: Exception) {
                            Log.e(TAG, "[ScreenShareModule] Failed to start ScreenCaptureService", e)
                        }

                    } else {
                        Log.w(TAG, "[ScreenShareModule] ❌ Screen share permission denied or data null")
                        sendEvent("ScreenSharePermissionDenied")
                    }
                }
            }
        })
    }

    companion object {
        private const val TAG = "ScreenShareModule"
    }
}
