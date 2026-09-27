export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type Tehsil = 'Swabi' | 'Topi' | 'Razzar' | 'Chota Lahor';

export type UrgencyLevel = 'CRITICAL_IMMEDIATE' | 'HIGH' | 'NORMAL';

export type RequestStatus = 'ACTIVE' | 'FULFILLED' | 'CANCELLED';

export interface Donor {
  id: string;
  fullName: string;
  bloodGroup: BloodGroup;
  tehsil: Tehsil;
  villageOrArea: string;
  phoneNumber: string;
  whatsappNumber?: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  isAvailable: boolean;
  lastDonationDate?: string; // YYYY-MM-DD
  totalDonations: number;
  isVerified: boolean;
  emergencyOnly: boolean;
  notes?: string;
  createdAt: string;
  userId?: string;
  email?: string;
  avatarUrl?: string;
}

export interface BloodRequest {
  id: string;
  patientName: string;
  bloodGroup: BloodGroup;
  unitsNeeded: number;
  hospitalName: string;
  tehsil: Tehsil;
  contactPerson: string;
  contactPhone: string;
  whatsappNumber?: string;
  urgency: UrgencyLevel;
  reason: string;
  status: RequestStatus;
  createdAt: string;
  expiresAt?: string;
  postedByUid?: string;
  patientAge?: number;
  patientGender?: string;
}

export interface Hospital {
  id: string;
  name: string;
  pashtoName?: string;
  type: 'GOVERNMENT_MTI' | 'DHQ_HOSPITAL' | 'THQ_HOSPITAL' | 'BLOOD_BANK' | 'EMERGENCY_RESCUE';
  tehsil: Tehsil;
  address: string;
  phone: string;
  emergencyHelpline: string;
  hasBloodBank: boolean;
  operatingHours: string;
  services: string[];
  googleMapsUrl: string;
}

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  whatsappNumber?: string;
  bloodGroup: BloodGroup;
  tehsil: Tehsil;
  villageOrArea: string;
  isDonor: boolean;
  totalDonations: number;
  lastDonationDate?: string;
  isAvailable: boolean;
  registeredAt: string;
}

export interface FilterState {
  bloodGroup: BloodGroup | 'ALL';
  tehsil: Tehsil | 'ALL';
  villageOrArea: string;
  onlyAvailable: boolean;
  emergencyOnly: boolean;
  searchQuery: string;
}

export const HOSPITALS_DATA: Hospital[] = [
  {
    id: 'bkmc-swabi',
    name: 'Bacha Khan Medical Complex (MTI BKMC)',
    pashtoName: 'باچا خان میډیکل کمپلیکس صوابۍ',
    type: 'GOVERNMENT_MTI',
    tehsil: 'Swabi',
    address: 'Shahmansoor, Main Jehangira-Swabi Road',
    phone: '0938-280214',
    emergencyHelpline: '0938-280211',
    hasBloodBank: true,
    operatingHours: '24/7 Emergency & Blood Bank',
    services: ['24/7 Blood Bank', 'Emergency & Trauma Center', 'ICU / CCU', 'Dialysis Unit', 'Surgery'],
    googleMapsUrl: 'https://maps.google.com/?q=Bacha+Khan+Medical+Complex+Shahmansoor+Swabi'
  },
  {
    id: 'dhq-swabi',
    name: 'DHQ Hospital Swabi',
    pashtoName: 'ډسټرکټ هیډکوارټر روغتون صوابۍ',
    type: 'DHQ_HOSPITAL',
    tehsil: 'Swabi',
    address: 'Hospital Road, Main Swabi Bazar',
    phone: '0938-221144',
    emergencyHelpline: '0938-221000',
    hasBloodBank: true,
    operatingHours: '24/7 Emergency Services',
    services: ['Emergency Unit', 'Blood Transfusion Unit', 'Pediatrics', 'General Surgery', 'Pharmacy'],
    googleMapsUrl: 'https://maps.google.com/?q=DHQ+Hospital+Swabi'
  },
  {
    id: 'thq-topi',
    name: 'THQ Hospital Topi',
    pashtoName: 'ټي ایچ کیو روغتون ټوپۍ',
    type: 'THQ_HOSPITAL',
    tehsil: 'Topi',
    address: 'Tarakai Road, Topi Main City',
    phone: '0938-271233',
    emergencyHelpline: '0938-271100',
    hasBloodBank: true,
    operatingHours: '24/7 Emergency Wing',
    services: ['24/7 Casualty', 'Blood Storage', 'Maternity Ward', 'Ambulance Support'],
    googleMapsUrl: 'https://maps.google.com/?q=THQ+Hospital+Topi+Swabi'
  },
  {
    id: 'thq-chota-lahor',
    name: 'THQ Hospital Chota Lahor',
    pashtoName: 'ټي ایچ کیو روغتون وړوکے لاهور',
    type: 'THQ_HOSPITAL',
    tehsil: 'Chota Lahor',
    address: 'Main GT Road, Chota Lahor',
    phone: '0938-310122',
    emergencyHelpline: '0938-310111',
    hasBloodBank: false,
    operatingHours: '24/7 Emergency Wing',
    services: ['Emergency Ward', 'First Aid & Trauma', 'Maternity Care', 'Ambulance'],
    googleMapsUrl: 'https://maps.google.com/?q=THQ+Hospital+Chota+Lahor+Swabi'
  },
  {
    id: 'thq-razzar',
    name: 'THQ Hospital Kalu Khan (Razzar)',
    pashtoName: 'ټي ایچ کیو روغتون کلو خان',
    type: 'THQ_HOSPITAL',
    tehsil: 'Razzar',
    address: 'Mardan-Swabi Road, Kalu Khan',
    phone: '0938-330455',
    emergencyHelpline: '0938-330400',
    hasBloodBank: false,
    operatingHours: '24/7 Emergency Wing',
    services: ['Emergency Care', 'OPD', 'Maternity Ward', 'Emergency Blood Screening'],
    googleMapsUrl: 'https://maps.google.com/?q=THQ+Hospital+Kalu+Khan+Swabi'
  },
  {
    id: 'rescue-1122-swabi',
    name: 'Rescue 1122 Swabi Headquarters',
    pashtoName: 'ریسکیو ۱۱۲۲ صوابۍ',
    type: 'EMERGENCY_RESCUE',
    tehsil: 'Swabi',
    address: 'Shahmansoor Complex, Swabi',
    phone: '1122',
    emergencyHelpline: '1122',
    hasBloodBank: false,
    operatingHours: '24/7 Emergency Dispatch',
    services: ['Emergency Patient Transport', 'Free Ambulance Service', 'First Aid Support', 'Accident Response'],
    googleMapsUrl: 'https://maps.google.com/?q=Rescue+1122+Swabi'
  }
];
