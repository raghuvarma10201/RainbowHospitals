package com.rainbowhospitals

import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule
import android.app.Activity

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
        currentActivity?.let { activity ->
            helper = ScreenShareHelper(activity)
            helper?.startScreenCapture()
        }
    }

    @ReactMethod
    fun stopScreenSharing() {
        currentActivity?.let {
            helper?.stopScreenCapture()
        }
    }
}
