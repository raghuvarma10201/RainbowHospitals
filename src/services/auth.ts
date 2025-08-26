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
