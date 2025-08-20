export type BookingStatus = 'BLOCK' | 'RESCHEDULE' | 'CANCEL';
export type AppointmentType = 'Video' | 'Physical';
export type PaymentType = 'ONLINE' | 'CASH'; // extend as needed

export interface BankDetails {
  bank_name: string | null;
  account_number: string | null;
  ifsc_code: string | null;
  account_holder_name: string | null;
  branch_name: string | null;
}

export interface AppointmentPayload {
  status: BookingStatus;
  appointmentnumber?: string;
  slotid?: string;
  comment: string | null;
  mrn: string;
  OrganisationUID: string;
  AppointmentType: AppointmentType;
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
}
