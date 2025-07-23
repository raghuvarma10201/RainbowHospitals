import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true; // iOS will auto-handle
};

export const getCurrentCoordinates = async (): Promise<{
  latitude: number;
  longitude: number;
} | null> => {
  const hasPermission = await requestLocationPermission();
  if (!hasPermission) return null;

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        resolve({latitude, longitude});
      },
      error => {
        console.error('Location Error:', error.message);
        reject(null);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  });
};

export const getCityNameFromCoords = async (
  latitude: number,
  longitude: number,
): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
    );
    const data = await response.json();
    const address = data.address;

    // Combine relevant address components
    const suburb =
      address.suburb || address.neighbourhood || address.village || '';
    const city = address.city || address.town || address.state_district || '';
    const state = address.state || '';

    // You can adjust this format as per your display needs
    const fullLocation = suburb || city || state.filter(Boolean).join(', ');

    return fullLocation || 'Unknown';
  } catch (err) {
    console.error('Reverse Geocoding Error:', err);
    return null;
  }
};
