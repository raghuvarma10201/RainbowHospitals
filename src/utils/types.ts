import {ImageProps, ImageSourcePropType} from 'react-native';

export type FormValues = {
  title: string;
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  mobile: string;
  phone?: string;
  email: string;
  country: string;
  bloodGroup?: string;
  rhFactor?: string;
};

export type FamilyMember = {
  id: string;
  name: string;
  age: number;
  relation: string;
  image: string;
  mrn: string;
  sex: string;
  PatientID?: string | undefined;
  value?: string;
};

//Get Doctor

export type DoctorDetailsResponse = {
  data: DoctorDetails;
  message: string;
  status: number;
  success: boolean;
};

export type DoctorDetails = {
  id: number;

  name: string;
  email: string | null;
  designation: string;
  qualification: string;
  experience: string;
  short_info: string;
  long_info: string;
  publications: string;
  small_image: string;
  large_image: string;
  doctor_UID: string;
  new_doctor_UID: string;
  languages: string;
  speciality_data: Speciality[];
  coe_data: COE[];
  branches_data: Branch[];
  order_number: number;
  physical_consultation_fee: number | null;
  video_consultation_fee: number | null;
  canonical: string;
  status: string;
  updated_at: string;
  created_at: string;
  position: number;
  faq_practice: string;
  faq_appointment: string;
  faq_education: string;
  faq_specialized: string;
  faq_experience: string;
  faq_services: string | null;
  pay_now: number;
  pay_hospital: number;
  show_pc_fee: number;
  notice: string | null;
  available_time: string;
  DepartmentCode: string;
};

export type Speciality = {
  name: string;
  id: number;
  UID: string;
};

export type COE = {
  name: string;
  id: number;
  UID: string;
};

export type Branch = {
  branchName: string;
  region_id: number;
  id: number;
  UID: string;
  branchContact: string;
  branchAddress: string;
  brachPostalCode: string | null;
  latitude: string | null;
  longitude: string | null;
  branch_id?: any;
};

// Slot
export type SlotData = {
  SessionDefinitionUID: string;
  SlotID: string;
  CareproviderUID: string;
  CareproviderCode: string;
  CareProviderTitle: string;
  CareProviderName: string;
  LocationUID: string;
  LocationCode: string;
  LocationName: string;
  SessionStartDttm: string; // ISO Date string
  SessionEndDttm: string; // ISO Date string
  BookingUID: string;
  AppointNumber: string;
  PatientUID: string;
  PatientMRN: string;
  PatientName: string;
  GenderName: string;
  Comments: string;
  PatientAge: string;
  BookingStatus: 'FREE' | 'BOOKED' | string;
  OrganisationUID: string;
  OrgCode: string;
  APMTYPUID: number;
  AppointmentType: string;
  ClinicCode: string;
  ClinicName: string;
  DepCode: string;
};

//patient Details
export type PatientProfile = {
  BloodGroup: string;
  DateOfBirth: string; // ISO date string
  EmailAddress: string;
  MobileNumber: string;
  PatientID: string;
  PatientName: string;
  PatientUID: string;
  PhoneNumber: string;
  Sex: 'Male' | 'Female' | string;
  Title: string;
  address: string;
  age: string;
  tempmrnid: string;
  zipcode: string;
  UHID: string;
};

//Appointments

export type Appointment = {
  id: string;
  name: string;
  date: string;
  AppointmentDttm: string;
  AppointmentType: string;
  BKSTSUID: string;
  BookedBy: string;
  BookingMode: string;
  BookingStatus: string;
  BookingUID: string;
  CareProviderCode: string;
  CareProviderName: string;
  CareProviderTitle: string;
  Comments: string;
  IsDepositAvailable: string;
  LocationCode: string;
  LocationName: string;
  LocationUID: string;
  OrgCode: string;
  OrganisationName: string;
  OrganisationUID: string;
  PatientID: string;
  PatientName: string;
  PatientUID: string;
  PhoneNumber: string;
  SessionName: string;
  SlotEndDttm: string;
  SlotStartDttm: string;
  SpecialtyCode: string;
  SpecialtyName: string;
  VisitType: string;
  appointmentnumber: string;
};

// settings time
export type SettingItem = {
  key: string;
  value: string;
};

export type SettingsAPIResponse = {
  data: SettingItem[];
  message: string;
  status: number;
  success: boolean;
};
export interface SettingsResponse {
  joinEnableOffsetSeconds: number;
  physicalBookingInterval: number;
  doctorSessionCount: number;
}

// DoctorListPayload type
export type DoctorListPayloadP = {
  name?: string;
  branch_id?: number | null;
  category_id?: number;
  appointment_type?: string;
  page: number;
  pageSize: number;
};

// DoctorListPayload with spcality type
export type DoctorListPayloadSpecialityid = {
  name?: string;
  branch_id?: number | null;
  category_id?: number;
  speciality_id?: number;
  page: number;
  pageSize: number;
};

export type upcomingApointment = {
  AppointmentDttm: string;
  AppointmentType: string;
  BKSTSUID: string;
  BookedBy: string;
  BookingMode: string;
  BookingStatus: string;
  BookingUID: string;
  CareProviderCode: string;
  CareProviderName: string;
  CareProviderTitle: string;
  Comments: string;
  IsDepositAvailable: string;
  LocationCode: string;
  LocationName: string;
  LocationUID: string;
  OrgCode: string;
  OrganisationName: string;
  OrganisationUID: string;
  PatientID: string;
  PatientName: string;
  PatientUID: string;
  PhoneNumber: string;
  SessionName: string;
  SlotEndDttm: string;
  SlotStartDttm: string;
  SpecialtyCode: string;
  SpecialtyName: string;
  VisitType: string;
  appointmentnumber: string;
  image: ImageProps;
  id: number;
  payment_type?: any;
};

export type ActionItem = {
  icon: ImageSourcePropType;
  label: string;
  onPress: () => void;
};

export type BookingStatus = 'BLOCK' | 'RESCHEDULE' | 'CANCEL';
export type AppointmentType = 'Video' | 'Physical' | '';
export type PaymentType = 'PayU' | 'PAYATHOSPITAL' | 'CASH';

export interface BankDetails {
  bank_name: string | null;
  account_number: string | null;
  ifsc_code: string | null;
  account_holder_name: string | null;
  branch_name: string | null;
}

export interface AppointmentPayload {
  status?: BookingStatus;
  appointmentnumber?: string;
  slotid?: string;
  comment?: string | null;
  mrn: string;
  OrganisationUID?: string;
  AppointmentType?: AppointmentType;
  Visittype?: string;
  careprovider_code?: string;
  date?: string;
  time?: string;
  transaction_id?: string;
  price?: number;
  payment_type?: PaymentType;
  payu_response?: any;
  bank_details?: BankDetails;
  expirytime?: number;
  orgcode?: string;
  registrationFee?: any;
  doctor_name?: any;
}
