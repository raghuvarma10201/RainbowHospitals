import api from './api';

export const login = async (payload: any) => {
  const {data} = await api.post('/sendOtp', payload);
  return data;
};
export const VerifyOTP = async (payload: any) => {
  const {data} = await api.post('/verifyOTP', payload);
  return data;
};
export const authenticateUser = async (payload: any) => {
  try {
    const {data} = await api.post('/checkUser', payload);
    return data;
  } catch (error) {
    return error;
  }
};

export const postMpin = async (payload: any) => {
  try {
    const response = await api.post('/setMpin', payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const verifyMpin = async (payload: any) => {
  try {
    const response = await api.post('/verifyMpin', payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};
