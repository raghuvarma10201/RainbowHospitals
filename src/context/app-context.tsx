// AppProvider.tsx
import React, {createContext, useContext, useState} from 'react';
import {Branch, Region, Setting} from '../services/Region/api';
import {DoctorDetailsResponse, PatientProfile} from '../utils/types';
import {AppointmentPayload} from '../utils/types';
import {AppContextProps} from '../types/contexts';

const AppCtx = createContext<AppContextProps | undefined>(undefined);
export const useApp = () => {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};

const AppProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [user, setUser] = useState<string | null>(null);
  const [branch, setBranch] = useState<Branch | null>(null);
  const [allbranch, setAllBranch] = useState<Branch[]>([]);
  const [region, setRegion] = useState<Region | null>(null);
  const [mrn, setMrn] = useState<string>('');
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [doctorDetails, setDoctorDetails] =
    useState<DoctorDetailsResponse | null>(null);
  const [isvideoconsulation, setIsvideoconsulation] = useState<boolean>(false);
  const [consultationType, setConsultationType] = useState<string>('');
  const [sessionStartDttm, SetSessionStartDttm] = useState<string>('');
  const [doctorSessionCount, setDoctorSessionCount] = useState<string>('');
  const [todayCount, setTodayCount] = useState<number>(0);
  const [upcomingCount, setUpcomingCount] = useState<number>(0);
  const [appointment, setAppointment] = useState<AppointmentPayload | null>(
    null,
  );
  const [settings, setSetting] = useState<Setting | null>(null);
  const ctx: AppContextProps = {
    user,
    branch,
    allbranch,
    region,
    mrn,
    profile,
    doctorDetails,
    isvideoconsulation,
    consultationType,
    sessionStartDttm,
    doctorSessionCount,
    todayCount,
    upcomingCount,
    appointment,
    settings,
    updateUser: setUser,
    updateBranch: setBranch,
    updateAllBranch: setAllBranch,
    updateRegion: setRegion,
    updateMrn: setMrn,
    updateProfile: setProfile,
    updateDoctorDetails: setDoctorDetails,
    updateVideoConsult: setIsvideoconsulation,
    updateConsultationType: setConsultationType,
    updateSessionStart: SetSessionStartDttm,
    updateSessionCount: setDoctorSessionCount,
    updateTodayCount: setTodayCount,
    updateUpcomingCount: setUpcomingCount,
    updateAppointment: setAppointment,
    updateSettings: setSetting,
  };

  return <AppCtx.Provider value={ctx}>{children}</AppCtx.Provider>;
};

export default AppProvider;
