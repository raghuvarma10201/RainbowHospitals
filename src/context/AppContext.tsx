// AppProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Branch, Region } from './../services/Region/api';
import { DoctorDetailsResponse, PatientProfile } from './../utils/types';

type AppCtx = {
  user: string | null;
  branch: Branch | null;
  allbranch: Branch[];
  region: Region | null;
  mrn: string;
  profile: PatientProfile | null;
  doctorDetails: DoctorDetailsResponse | null;
  isvideoconsulation: boolean;
  consultationType: string;
  sessionStartDttm: string;
  doctorSessionCount: string;
  todayCount: number;
  upcomingCount: number;

  updateUser: (u: string | null) => void;
  updateBranch: (b: Branch | null) => void;
  updateAllBranch: (b: Branch[]) => void;
  updateRegion: (r: Region | null) => void;
  updateMrn: (m: string) => void;
  updateProfile: (p: PatientProfile | null) => void;
  updateDoctorDetails: (d: DoctorDetailsResponse | null) => void;
  updateVideoConsult: (v: boolean) => void;
  updateConsultationType: (c: string) => void;
  updateSessionStart: (s: string) => void;
  updateSessionCount: (s: string) => void;
  updateTodayCount: (c: number) => void;
  updateUpcomingCount: (c: number) => void;
};

const AppCtx = createContext<AppCtx | undefined>(undefined);
export const useApp = () => {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [branch, setBranch] = useState<Branch | null>(null);
  const [allbranch, setAllBranch] = useState<Branch[]>([]);
  const [region, setRegion] = useState<Region | null>(null);
  const [mrn, setMrn] = useState<string>('');
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [doctorDetails, setDoctorDetails] = useState<DoctorDetailsResponse | null>(null);
  const [isvideoconsulation, setIsvideoconsulation] = useState<boolean>(false);
  const [consultationType, setConsultationType] = useState<string>('');
  const [sessionStartDttm, SetSessionStartDttm] = useState<string>('');
  const [doctorSessionCount, setDoctorSessionCount] = useState<string>('');
  const [todayCount, setTodayCount] = useState<number>(0);
  const [upcomingCount, setUpcomingCount] = useState<number>(0);

  const ctx: AppCtx = {
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
  };

  return <AppCtx.Provider value={ctx}>{children}</AppCtx.Provider>;
};
