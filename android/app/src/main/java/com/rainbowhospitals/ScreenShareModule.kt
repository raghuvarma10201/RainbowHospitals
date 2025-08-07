package com.rainbowhospitals

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.media.projection.MediaProjectionManager
import android.os.Build
import androidx.annotation.RequiresApi
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class ScreenShareModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private val SCREEN_CAPTURE_REQUEST_CODE = 1000

    override fun getName(): String = "ScreenShareModule"

    @RequiresApi(Build.VERSION_CODES.LOLLIPOP)
    @ReactMethod
    fun startScreenShare() {
        val activity: Activity? = currentActivity
        if (activity != null) {
            val projectionManager =
                activity.getSystemService(Context.MEDIA_PROJECTION_SERVICE) as MediaProjectionManager
            val captureIntent = projectionManager.createScreenCaptureIntent()
            activity.startActivityForResult(captureIntent, SCREEN_CAPTURE_REQUEST_CODE)
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
                        // ✅ Notify JS side
                        sendEvent("ScreenSharePermissionGranted")

                        // ✅ Start screen capture service
                        val serviceIntent = Intent(activity, ScreenCaptureService::class.java)
                        serviceIntent.putExtra("resultCode", resultCode)
                        serviceIntent.putExtra("data", data)
                        activity?.startService(serviceIntent)
                    } else {
                        sendEvent("ScreenSharePermissionDenied")
                    }
                }
            }
        })
    }
}
