package com.rainbowhospitals

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.media.projection.MediaProjectionManager
import com.facebook.react.bridge.*
import android.os.Build

class ScreenShareModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), ActivityEventListener {

    private var screenSharePromise: Promise? = null
    private val REQUEST_CODE = 1001

    init {
        reactContext.addActivityEventListener(this)
    }

    override fun getName(): String {
        return "ScreenShare"
    }

    @ReactMethod
    fun startScreenShare(promise: Promise) {
        val currentActivity = currentActivity

        if (currentActivity == null) {
            promise.reject("NO_ACTIVITY", "Activity doesn't exist")
            return
        }

        val mediaProjectionManager =
            currentActivity.getSystemService(Context.MEDIA_PROJECTION_SERVICE) as MediaProjectionManager
        val permissionIntent = mediaProjectionManager.createScreenCaptureIntent()

        screenSharePromise = promise
        currentActivity.startActivityForResult(permissionIntent, REQUEST_CODE)
    }

    override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?) {
    if (requestCode == REQUEST_CODE) {
        if (resultCode == Activity.RESULT_OK && data != null) {
            val context = reactContext.applicationContext
            val serviceIntent = Intent(context, ScreenCaptureService::class.java).apply {
                action = ScreenCaptureService.ACTION_START
                putExtra(ScreenCaptureService.EXTRA_RESULT_CODE, resultCode)
                putExtra(ScreenCaptureService.EXTRA_DATA_INTENT, data)
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(serviceIntent)
            } else {
                context.startService(serviceIntent)
            }

            screenSharePromise?.resolve("Screen sharing started")
        } else {
            screenSharePromise?.reject("PERMISSION_DENIED", "User denied screen sharing")
        }
        screenSharePromise = null
    }
}


    override fun onNewIntent(intent: Intent?) {
        // No-op
    }
}
