import {Branch, Category, Region, Setting} from '../services/Region/api';
import {
  AppointmentPayload,
  DoctorDetailsResponse,
  PatientProfile,
} from '../utils/types';

interface AppContextProps {
  user: string | null;
  branch: Branch | null;
  allbranch: Branch[];
  region: Region | null;
  mrn: string;
  category: any;
  profile: PatientProfile | null;
  doctorDetails: DoctorDetailsResponse | null;
  isvideoconsulation: boolean;
  consultationType: string;
  sessionStartDttm: string;
  doctorSessionCount: string;
  todayCount: number;
  upcomingCount: number;
  appointment: AppointmentPayload | null;
  settings: Setting | null;

  updateAppointment: (data: AppointmentPayload | null) => void;
  updateUser: (u: string | null) => void;
  updateBranch: (b: Branch | null) => void;
  updateAllBranch: (b: Branch[]) => void;
  updateRegion: (r: Region | null) => void;
  updateMrn: (m: string) => void;
  updateCategory: (c: Category) => void;
  updateProfile: (p: PatientProfile | null) => void;
  updateDoctorDetails: (d: DoctorDetailsResponse | null) => void;
  updateVideoConsult: (v: boolean) => void;
  updateConsultationType: (c: string) => void;
  updateSessionStart: (s: string) => void;
  updateSessionCount: (s: string) => void;
  updateTodayCount: (c: number) => void;
  updateUpcomingCount: (c: number) => void;
  updateSettings: (c: Setting) => void;
}

interface AuthContextProps {
  isLoggedIn: boolean;
  setLoggedIn: (val: boolean) => void;
}

export type {AppContextProps, AuthContextProps};
