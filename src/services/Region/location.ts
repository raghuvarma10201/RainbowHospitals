import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {Region, Branch} from './api'; // Ensure both types are imported

// Request location permission (Android only)
export const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};

// Get current device coordinates
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

// Utility: Convert degrees to radians
const toRad = (value: number): number => (value * Math.PI) / 180;

// Utility: Haversine distance between two lat/lng points in kilometers
const getDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371; // Radius of Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Find the nearest region based on current location
export const findNearestRegion = (
  regions: Region[],
  lat: number,
  lon: number,
): Region | null => {
  
  let nearest: Region | null = null;
  let minDistance = Infinity;

  regions.forEach(region => {
    const distance = getDistance(
      lat,
      lon,
      parseFloat(region.latitude),
      parseFloat(region.longitude),
    );
    if (distance < minDistance) {
      minDistance = distance;
      nearest = region;
    }
  });

  return nearest;
};

// ✅ Find the nearest branch within a region based on current location
export const findNearestBranch = (
  branches: Branch[],
  lat: number,
  lon: number,
): Branch | null => {
  let nearest: Branch | null = null;
  let minDistance = Infinity;

  branches.forEach(branch => {
    const branchLat = parseFloat(branch.latitude);
    const branchLon = parseFloat(branch.longitude);
    const distance = getDistance(lat, lon, branchLat, branchLon);

    if (distance < minDistance) {
      minDistance = distance;
      nearest = branch;
    }
  });

  return nearest;
};
