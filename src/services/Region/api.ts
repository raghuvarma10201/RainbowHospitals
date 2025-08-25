import {API_BASE_URL} from '../../utils/enums';

// api.ts
export type Region = {
  region_id: number;
  id: number;
  name: string;
  latitude: string;
  longitude: string;
};

export type Branch = {
  name: string;
  contact_number: string;
  id: string;
  latitude: string;
  longitude: string;
  banner_mobile_image: string;
  email: string;
  map_link: string;
  mobile_image: string;
  address: string;
  walk_through: string;
  UID: string;
  branch_id: number;
  organisation: any;
};

export type Setting = {
  key: string;
  value: string;
};

export const fetchRegions = async (token: string): Promise<Region[]> => {
  const response = await fetch(`${API_BASE_URL}/api/getRegions`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // <-- pass token here
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch regions: ${response.status}`);
  }

  const data = await response.json();
  return data.data;
};

export const fetchBranchesByRegionId = async (
  regionId: number,
  token: string,
): Promise<Branch[]> => {
  const response = await fetch(`${API_BASE_URL}/api/getBranches/${regionId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // <-- pass token here
    },
  });
  const data = await response.json();
  return data.data || [];
};
