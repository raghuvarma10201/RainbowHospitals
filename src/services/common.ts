import api from './api';
import {AppointmentPayload} from '../utils/types';
import {timeoutPromise} from '@jitsi/react-native-sdk/react/features/base/util/timeoutPromise';

export const getPatientProfile = async (payload: any) => {
  try {
    const response = await api.post('/getPatientProfile', payload);
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
export const getBranches = async (regionId?: number) => {
  try {
    const response = await api.get('/getBranches/' + regionId);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
export const getSpecialities = async (coe: string) => {
  try {
    const response = await api.get(`/getSpecialities/${coe}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getDoctors = async (
  name: string,
  speciality_id: any,
  branch_id: any,
  category_id: any,
  appointment_type: string,
  page: number,
  pageSize: number,
) => {
  const params = {
    name: name,
    speciality_id: speciality_id,
    branch_id: branch_id,
    category_id: category_id,
    appointment_type: appointment_type,
    page: page,
    pageSize: pageSize,
  };
  try {
    const response = await api.get('/getDoctors', {params});
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getDoctorDetail = async (doctorId: number) => {
  try {
    const response = await api.get('/getDoctor/' + doctorId);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDoctorSessions = async (payload: any) => {
  try {
    const response = await api.post('/getSessionsByDoctor', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDoctorSlots = async (payload: any) => {
  try {
    const response = await api.post('/getSlotsBySession', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchConsultationFee = async (payload: any): Promise<any> => {
  try {
    const response = await api.post('/getConsultationFee', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const bookAppointment = async (payload: AppointmentPayload) => {
  try {
    const response = await api.post('/bookAppointment', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadPatientVitals = async (payload: any) => {
  try {
    const response = await api.post('/uploadPatientVitals', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const advancePay = async (payload: any) => {
  try {
    const response = await api.post('/patientAdvancePay', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const generateHash = async (payload: any) => {
  try {
    const response = await api.post('/generate-hash', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchFamilyMembers = async (payload: any) => {
  try {
    const response = await api.post('/getPatientProfile', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAppointments = async (payload: any) => {
  try {
    const response = await api.post('/getAppointmentForPatient', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get('/getCategories');
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchAppointmentChat = async (BookingId: any) => {
  try {
    const response = await api.get('/appointmentChat/' + BookingId);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const sendAppointmentChat = async (payload: any) => {
  try {
    const response = await api.post('/addAppointmentMessage', payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchSettings = async () => {
  try {
    const response = await api.get('/getSetting');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const globalSearch = async (payload: any) => {
  try {
    const response = await api.post('/globalSearch', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const registerUser = async (payload: any) => {
  try {
    const response = await api.post('/registerNewPatient', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPatientVisits = async (payload: any) => {
  try {
    const response = await api.post('/getPatientVisits', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllLabReports = async (payload: any) => {
  try {
    const response = await api.post('/getAllLabReports', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getVisitPrescriptions = async (payload: any) => {
  try {
    const response = await api.post('/getPrescription', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};
