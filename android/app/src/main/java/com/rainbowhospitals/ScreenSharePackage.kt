package com.rainbowhospitals

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext // ✅ Add this import
import com.facebook.react.uimanager.ViewManager
import android.app.Application
import android.content.Context

class ScreenSharePackage : ReactPackage {
    override fun createNativeModules(context: ReactApplicationContext): List<NativeModule> {
        return listOf(ScreenShareModule(context))
    }

    override fun createViewManagers(context: ReactApplicationContext): List<ViewManager<*, *>> = emptyList()
}
