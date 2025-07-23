import api from './api';
import axios from 'axios';

export const getPatientProfile = async (payload : any) => {
  try {
    const response = await api.post('/getPatientProfile',payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getRegions = async () => {
  try {
    const response = await api.get('/getRegions');
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
export const getBranches = async (regionId : number) => {
  try {
    const response = await api.get('/getBranches/'+regionId);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};





