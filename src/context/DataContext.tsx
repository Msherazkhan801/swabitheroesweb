'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  db, 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp 
} from '../services/firebase';
import { Donor, BloodRequest, UserProfile, RequestStatus } from '../types';

interface DataContextType {
  donors: Donor[];
  requests: BloodRequest[];
  users: UserProfile[];
  loading: boolean;
  error: string | null;
  isLive: boolean;
  // Donor actions
  addDonor: (donor: Omit<Donor, 'id' | 'createdAt'>) => Promise<string>;
  updateDonor: (id: string, updates: Partial<Donor>) => Promise<void>;
  deleteDonor: (id: string) => Promise<void>;
  toggleDonorAvailability: (id: string) => Promise<void>;
  toggleDonorVerification: (id: string) => Promise<void>;
  // Request actions
  addRequest: (req: Omit<BloodRequest, 'id' | 'createdAt' | 'status'>) => Promise<string>;
  updateRequest: (id: string, updates: Partial<BloodRequest>) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;
  setRequestStatus: (id: string, status: RequestStatus) => Promise<void>;
  // User actions
  deleteUser: (uid: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState<boolean>(true);

  useEffect(() => {
    let unsubscribeDonors: () => void = () => {};
    let unsubscribeRequests: () => void = () => {};
    let unsubscribeUsers: () => void = () => {};

    try {
      // 1. Subscribe to Realtime Donors
      const donorsCol = collection(db, 'donors');
      const donorsQuery = query(donorsCol);
      unsubscribeDonors = onSnapshot(donorsQuery, (snapshot) => {
        const list: Donor[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({
            id: docSnap.id,
            fullName: data.fullName || 'Anonymous Hero',
            bloodGroup: data.bloodGroup || 'O+',
            tehsil: data.tehsil || 'Swabi',
            villageOrArea: data.villageOrArea || 'Swabi',
            phoneNumber: data.phoneNumber || '',
            whatsappNumber: data.whatsappNumber || data.phoneNumber || '',
            age: Number(data.age) || 25,
            gender: data.gender || 'Male',
            isAvailable: data.isAvailable !== false,
            lastDonationDate: data.lastDonationDate || '',
            totalDonations: Number(data.totalDonations) || 1,
            isVerified: !!data.isVerified,
            emergencyOnly: !!data.emergencyOnly,
            notes: data.notes || '',
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString()),
            userId: data.userId || '',
            email: data.email || ''
          });
        });
        setDonors(list);
        setLoading(false);
      }, (err) => {
        console.warn('Realtime donors listener notice:', err);
        setError('Connected in read-only or limited mode');
      });

      // 2. Subscribe to Realtime Blood Requests
      const requestsCol = collection(db, 'blood_requests');
      const requestsQuery = query(requestsCol);
      unsubscribeRequests = onSnapshot(requestsQuery, (snapshot) => {
        const list: BloodRequest[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({
            id: docSnap.id,
            patientName: data.patientName || 'Emergency Patient',
            bloodGroup: data.bloodGroup || 'O+',
            unitsNeeded: Number(data.unitsNeeded) || 1,
            hospitalName: data.hospitalName || 'BKMC Swabi',
            tehsil: data.tehsil || 'Swabi',
            contactPerson: data.contactPerson || 'Attendant',
            contactPhone: data.contactPhone || '',
            whatsappNumber: data.whatsappNumber || data.contactPhone || '',
            urgency: data.urgency || 'HIGH',
            reason: data.reason || 'Urgent Requirement',
            status: data.status || 'ACTIVE',
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString()),
            expiresAt: data.expiresAt || '',
            postedByUid: data.postedByUid || '',
            patientAge: Number(data.patientAge) || undefined,
            patientGender: data.patientGender || undefined
          });
        });
        // Sort active requests first, then by newest
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setRequests(list);
      }, (err) => {
        console.warn('Realtime requests listener notice:', err);
      });

      // 3. Subscribe to Realtime Users
      const usersCol = collection(db, 'users');
      unsubscribeUsers = onSnapshot(usersCol, (snapshot) => {
        const list: UserProfile[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({
            uid: docSnap.id,
            fullName: data.fullName || 'Swabi Citizen',
            email: data.email || '',
            phoneNumber: data.phoneNumber || '',
            whatsappNumber: data.whatsappNumber || '',
            bloodGroup: data.bloodGroup || 'O+',
            tehsil: data.tehsil || 'Swabi',
            villageOrArea: data.villageOrArea || 'Swabi',
            isDonor: !!data.isDonor,
            totalDonations: Number(data.totalDonations) || 0,
            lastDonationDate: data.lastDonationDate || '',
            isAvailable: data.isAvailable !== false,
            registeredAt: data.registeredAt || data.createdAt || new Date().toISOString()
          });
        });
        setUsers(list);
      }, (err) => {
        console.warn('Realtime users listener notice:', err);
      });

    } catch (e: any) {
      console.error('Failed to initialize Firebase data sync:', e);
      setError(e.message);
      setLoading(false);
    }

    return () => {
      unsubscribeDonors();
      unsubscribeRequests();
      unsubscribeUsers();
    };
  }, []);

  // Donor CRUD
  const addDonor = async (donorData: Omit<Donor, 'id' | 'createdAt'>): Promise<string> => {
    const docRef = await addDoc(collection(db, 'donors'), {
      ...donorData,
      createdAt: new Date().toISOString(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  };

  const updateDonor = async (id: string, updates: Partial<Donor>) => {
    const docRef = doc(db, 'donors', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  };

  const deleteDonor = async (id: string) => {
    const docRef = doc(db, 'donors', id);
    await deleteDoc(docRef);
  };

  const toggleDonorAvailability = async (id: string) => {
    const target = donors.find(d => d.id === id);
    if (!target) return;
    await updateDonor(id, { isAvailable: !target.isAvailable });
  };

  const toggleDonorVerification = async (id: string) => {
    const target = donors.find(d => d.id === id);
    if (!target) return;
    await updateDonor(id, { isVerified: !target.isVerified });
  };

  // Request CRUD
  const addRequest = async (reqData: Omit<BloodRequest, 'id' | 'createdAt' | 'status'>): Promise<string> => {
    const docRef = await addDoc(collection(db, 'blood_requests'), {
      ...reqData,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  };

  const updateRequest = async (id: string, updates: Partial<BloodRequest>) => {
    const docRef = doc(db, 'blood_requests', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  };

  const deleteRequest = async (id: string) => {
    const docRef = doc(db, 'blood_requests', id);
    await deleteDoc(docRef);
  };

  const setRequestStatus = async (id: string, status: RequestStatus) => {
    await updateRequest(id, { status });
  };

  // User CRUD
  const deleteUser = async (uid: string) => {
    const docRef = doc(db, 'users', uid);
    await deleteDoc(docRef);
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const dSnap = await getDocs(collection(db, 'donors'));
      const rSnap = await getDocs(collection(db, 'blood_requests'));
      const uSnap = await getDocs(collection(db, 'users'));
      
      const dList: Donor[] = [];
      dSnap.forEach(d => dList.push({ id: d.id, ...d.data() } as Donor));
      setDonors(dList);

      const rList: BloodRequest[] = [];
      rSnap.forEach(r => rList.push({ id: r.id, ...r.data() } as BloodRequest));
      setRequests(rList);

      const uList: UserProfile[] = [];
      uSnap.forEach(u => uList.push({ uid: u.id, ...u.data() } as UserProfile));
      setUsers(uList);
    } catch (err: any) {
      console.error('Refresh error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DataContext.Provider
      value={{
        donors,
        requests,
        users,
        loading,
        error,
        isLive,
        addDonor,
        updateDonor,
        deleteDonor,
        toggleDonorAvailability,
        toggleDonorVerification,
        addRequest,
        updateRequest,
        deleteRequest,
        setRequestStatus,
        deleteUser,
        refreshData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
