import {useState} from 'react';
import {fetchBranchesByRegionId, fetchRegions} from './api';
import {
  findNearestBranch,
  findNearestRegion,
  getCurrentCoordinates,
} from './location';
import {useApp} from '../../Context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loadDetails = async () => {
  const {updateBranch, updateAllBranch, updateRegion} = useApp();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  try {
    const token= await AsyncStorage.getItem('access_token');
    const regions = await fetchRegions(token??'');
    const location = await getCurrentCoordinates();
    if (!location) throw new Error('Location unavailable');

    const nearestRegion = findNearestRegion(
      regions,
      location.latitude, //12.97160
      location.longitude, //77.59456
    );
    if (!nearestRegion) throw new Error('No region found nearby');
    updateRegion(nearestRegion);
    const allBranches = await fetchBranchesByRegionId(nearestRegion.region_id,token??'');
    if (!allBranches.length) throw new Error('No branch data found');

    updateAllBranch(allBranches); // ✅ Store centrally

    const nearestBranch = findNearestBranch(
      allBranches,
      location.latitude,
      location.longitude,
    );
    if (!nearestBranch) throw new Error('No nearby branch found');

    updateBranch(nearestBranch); // ✅ Store selected branch
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
