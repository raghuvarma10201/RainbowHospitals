package com.rainbowhospitals

import android.content.Context
import android.content.Intent
import android.media.projection.MediaProjectionManager
import android.app.Activity
import androidx.activity.ComponentActivity
import androidx.activity.result.ActivityResult
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts

class ScreenShareHelper(private val activity: ComponentActivity) {

    private val mediaProjectionManager =
        activity.getSystemService(Context.MEDIA_PROJECTION_SERVICE) as MediaProjectionManager

    private val launcher: ActivityResultLauncher<Intent> =
        activity.registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result: ActivityResult ->
            if (result.resultCode == Activity.RESULT_OK && result.data != null) {
                ScreenCaptureService.resultCode = result.resultCode
                ScreenCaptureService.dataIntent = result.data

                val intent = Intent(activity, ScreenCaptureService::class.java).apply {
                    action = ScreenCaptureService.ACTION_START
                }
                activity.startService(intent)
            }
        }

    fun startScreenCapture() {
        val intent = mediaProjectionManager.createScreenCaptureIntent()
        launcher.launch(intent)
    }

    fun stopScreenCapture() {
        val intent = Intent(activity, ScreenCaptureService::class.java).apply {
            action = ScreenCaptureService.ACTION_STOP
        }
        activity.startService(intent)
    }
}
