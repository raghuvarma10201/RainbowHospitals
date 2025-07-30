package com.rainbowhospitals

import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule
import androidx.activity.ComponentActivity

@ReactModule(name = ScreenShareModule.NAME)
class ScreenShareModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val NAME = "ScreenShareModule"
    }

    private var helper: ScreenShareHelper? = null

    override fun getName(): String = NAME

    @ReactMethod
    fun startScreenSharing() {
        val activity = currentActivity as? ComponentActivity
        if (activity != null) {
            helper = ScreenShareHelper(activity)
            helper?.startScreenCapture()
        }
    }

    @ReactMethod
    fun stopScreenSharing() {
        val activity = currentActivity as? ComponentActivity
        if (activity != null) {
            helper?.stopScreenCapture()
        }
    }
}
