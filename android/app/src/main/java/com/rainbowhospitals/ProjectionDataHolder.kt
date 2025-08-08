package com.rainbowhospitals

import android.content.Intent

/**
 * Holds the MediaProjection permission result in memory so we don't
 * have to parcel the Intent across process boundaries.
 */
object ProjectionDataHolder {
    @Volatile
    var resultCode: Int = -1

    @Volatile
    var data: Intent? = null

    fun clear() {
        resultCode = -1
        data = null
    }
}
