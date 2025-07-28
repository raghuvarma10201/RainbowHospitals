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
export const getSpecialities = async () => {
  try {
    const response = await api.get('/getSpecialities/6');
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getDoctors = async (name :string, speciality_id : any,branch_id : any, category_id : any, appointment_type : number,page : number,pageSize : number) => {
  const params = {
    name : name,
    speciality_id : speciality_id,
    branch_id : branch_id,
    category_id : category_id,
    appointment_type : appointment_type,
    page : page,
    pageSize : pageSize
  }
  try {
    const response = await api.get('/getDoctors', {params});
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getDoctorDetail = async (doctorId :number) => {
  try {
    const response = await api.get('/getDoctor/'+doctorId);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDoctorSessions = async (payload : any) => {
  try {
    const response = await api.post('/getSessionsByDoctor', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDoctorSlots = async (payload : any) => {
  try {
    const response = await api.post('/getSlotsBySession', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

