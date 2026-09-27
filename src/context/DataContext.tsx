'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  db, 
  auth,
  collection, 
  doc, 
  setDoc,
  getDoc,
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from '../services/firebase';
import { Donor, BloodRequest, UserProfile, RequestStatus, UserRole, BloodGroup, Tehsil } from '../types';

const STORAGE_PROFILE_KEY = 'swabi_heroes_profile_v1';

interface DataContextType {
  donors: Donor[];
  requests: BloodRequest[];
  users: UserProfile[];
  currentProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  isLive: boolean;
  // User Profile
  saveProfile: (profileData: Partial<UserProfile> & {
    fullName: string;
    phoneNumber: string;
    bloodGroup: BloodGroup;
    tehsil: Tehsil;
    villageOrArea: string;
    role: UserRole;
  }) => Promise<UserProfile>;
  signIn: (identifier: string, password?: string) => Promise<UserProfile>;
  clearProfile: () => void;
  toggleMyAvailability: () => Promise<void>;
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
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState<boolean>(true);

  // Load profile from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_PROFILE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.uid) {
          setCurrentProfile(parsed);
        }
      }
    } catch (err) {
      console.warn('Failed to load local profile:', err);
    }

    // Also listen to Firebase Auth changes
    const unsubAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser && fbUser.uid) {
        try {
          const uDoc = await getDoc(doc(db, 'users', fbUser.uid));
          if (uDoc.exists()) {
            const data = uDoc.data();
            const userRole: UserRole = data.role || (data.isDonor ? 'DONOR' : 'ACCEPTER');
            const profile: UserProfile = {
              uid: fbUser.uid,
              fullName: data.fullName || fbUser.displayName || 'Swabi Citizen',
              email: data.email || fbUser.email || '',
              phoneNumber: data.phoneNumber || '',
              whatsappNumber: data.whatsappNumber || '',
              bloodGroup: data.bloodGroup || 'O+',
              tehsil: data.tehsil || 'Swabi',
              villageOrArea: data.villageOrArea || 'Swabi',
              role: userRole,
              isDonor: true,
              totalDonations: Number(data.totalDonations) || 1,
              lastDonationDate: data.lastDonationDate || '',
              isAvailable: data.isAvailable !== false,
              registeredAt: data.registeredAt || new Date().toISOString(),
              patientDetails: data.patientDetails || '',
              preferredHospital: data.preferredHospital || '',
              notes: data.notes || '',
              age: Number(data.age) || undefined,
              gender: data.gender || undefined,
              donorId: data.donorId || undefined,
              password: data.password || ''
            };
            setCurrentProfile(profile);
            localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profile));
          }
        } catch (e) {
          console.warn('Auth state changed profile sync note:', e);
        }
      }
    });

    return () => {
      unsubAuth();
    };
  }, []);

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
            relationship: data.relationship || 'Emergency Case',
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
          const userRole: UserRole = data.role || (data.isDonor ? 'DONOR' : 'ACCEPTER');
          list.push({
            uid: docSnap.id,
            fullName: data.fullName || 'Swabi Citizen',
            email: data.email || '',
            phoneNumber: data.phoneNumber || '',
            whatsappNumber: data.whatsappNumber || '',
            bloodGroup: data.bloodGroup || 'O+',
            tehsil: data.tehsil || 'Swabi',
            villageOrArea: data.villageOrArea || 'Swabi',
            role: userRole,
            isDonor: userRole === 'DONOR' || userRole === 'BOTH' || !!data.isDonor,
            totalDonations: Number(data.totalDonations) || 0,
            lastDonationDate: data.lastDonationDate || '',
            isAvailable: data.isAvailable !== false,
            registeredAt: data.registeredAt || data.createdAt || new Date().toISOString(),
            patientDetails: data.patientDetails || '',
            preferredHospital: data.preferredHospital || '',
            notes: data.notes || '',
            age: Number(data.age) || undefined,
            gender: data.gender || undefined,
            donorId: data.donorId || undefined,
            password: data.password || ''
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

  // User Profile Management
  const saveProfile = async (profileData: Partial<UserProfile> & {
    fullName: string;
    phoneNumber: string;
    bloodGroup: BloodGroup;
    tehsil: Tehsil;
    villageOrArea: string;
    role: UserRole;
  }): Promise<UserProfile> => {
    let uid = currentProfile?.uid || profileData.uid;

    // 1. Firebase Auth Registration / Linking if email & password provided
    const userEmail = (profileData.email || currentProfile?.email || '').trim().toLowerCase();
    const userPassword = profileData.password || currentProfile?.password;

    if (userEmail && userPassword && userPassword.length >= 6) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, userEmail, userPassword);
        if (cred.user && cred.user.uid) {
          uid = cred.user.uid;
        }
      } catch (authErr: any) {
        if (authErr.code === 'auth/email-already-in-use') {
          try {
            const cred = await signInWithEmailAndPassword(auth, userEmail, userPassword);
            if (cred.user && cred.user.uid) {
              uid = cred.user.uid;
            }
          } catch (signInErr: any) {
            console.warn('Firebase Auth sign in notice during profile save:', signInErr.message);
          }
        } else {
          console.warn('Firebase Auth creation notice:', authErr.message);
        }
      }
    }

    if (!uid) {
      uid = 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    }

    const isDonorRole = profileData.role === 'DONOR' || profileData.role === 'BOTH' || profileData.isDonor !== false;
    const isAvailable = profileData.isAvailable !== undefined ? profileData.isAvailable : true;
    
    let linkedDonorId = currentProfile?.donorId || profileData.donorId;

    // 2. Always sync to 'donors' collection so the user is an active donor
    const donorPayload = {
      fullName: profileData.fullName,
      bloodGroup: profileData.bloodGroup,
      tehsil: profileData.tehsil,
      villageOrArea: profileData.villageOrArea,
      phoneNumber: profileData.phoneNumber,
      whatsappNumber: profileData.whatsappNumber || profileData.phoneNumber,
      age: Number(profileData.age) || 24,
      gender: profileData.gender || 'Male',
      isAvailable: isAvailable,
      totalDonations: Number(profileData.totalDonations) || (currentProfile?.totalDonations || 1),
      lastDonationDate: profileData.lastDonationDate || '',
      isVerified: true,
      emergencyOnly: false,
      notes: profileData.notes || `Registered Hero Donor from ${profileData.villageOrArea}, Swabi.`,
      userId: uid,
      email: userEmail,
      updatedAt: serverTimestamp()
    };

    if (isDonorRole) {
      if (linkedDonorId) {
        try {
          const dRef = doc(db, 'donors', linkedDonorId);
          await updateDoc(dRef, donorPayload);
        } catch (e) {
          const dCol = collection(db, 'donors');
          const newDoc = await addDoc(dCol, { ...donorPayload, createdAt: new Date().toISOString() });
          linkedDonorId = newDoc.id;
        }
      } else {
        const existingDonor = donors.find(d => d.userId === uid || d.phoneNumber === profileData.phoneNumber || (userEmail && d.email === userEmail));
        if (existingDonor) {
          linkedDonorId = existingDonor.id;
          const dRef = doc(db, 'donors', existingDonor.id);
          await updateDoc(dRef, donorPayload);
        } else {
          const dCol = collection(db, 'donors');
          const newDoc = await addDoc(dCol, { ...donorPayload, createdAt: new Date().toISOString() });
          linkedDonorId = newDoc.id;
        }
      }
    } else if (linkedDonorId) {
      try {
        const dRef = doc(db, 'donors', linkedDonorId);
        await updateDoc(dRef, { isAvailable: false, updatedAt: serverTimestamp() });
      } catch (e) {}
    }

    const fullProfile: UserProfile = {
      uid,
      fullName: profileData.fullName,
      email: userEmail,
      phoneNumber: profileData.phoneNumber,
      whatsappNumber: profileData.whatsappNumber || profileData.phoneNumber,
      bloodGroup: profileData.bloodGroup,
      tehsil: profileData.tehsil,
      villageOrArea: profileData.villageOrArea,
      role: isDonorRole ? 'DONOR' : profileData.role,
      isDonor: isDonorRole,
      totalDonations: Number(profileData.totalDonations) || (currentProfile?.totalDonations || 1),
      lastDonationDate: profileData.lastDonationDate || '',
      isAvailable: isAvailable,
      registeredAt: currentProfile?.registeredAt || new Date().toISOString(),
      patientDetails: profileData.patientDetails || '',
      preferredHospital: profileData.preferredHospital || '',
      notes: profileData.notes || '',
      age: Number(profileData.age) || undefined,
      gender: profileData.gender || undefined,
      donorId: linkedDonorId || undefined,
      password: userPassword || ''
    };

    // 3. Sync to 'users' collection in Firestore
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, {
        ...fullProfile,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn('Could not sync user to Firestore:', err);
    }

    // 4. Save to localStorage
    try {
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(fullProfile));
    } catch (e) {}

    setCurrentProfile(fullProfile);
    return fullProfile;
  };

  const signIn = async (identifier: string, password?: string): Promise<UserProfile> => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPhone = cleanId.replace(/[^0-9]/g, '');
    let firebaseAuthUid: string | null = null;

    // 1. If it's an email and password is provided, authenticate with Firebase Auth
    if (cleanId.includes('@') && password && password.length >= 6) {
      try {
        const cred = await signInWithEmailAndPassword(auth, cleanId, password);
        if (cred.user && cred.user.uid) {
          firebaseAuthUid = cred.user.uid;
        }
      } catch (authErr: any) {
        console.warn('Firebase Auth direct login notice:', authErr.message);
      }
    }

    // 2. Search by Firebase Auth UID or Email / Phone in users
    let match = users.find(u => {
      if (firebaseAuthUid && u.uid === firebaseAuthUid) return true;
      const uEmail = (u.email || '').toLowerCase().trim();
      const uPhone = (u.phoneNumber || '').replace(/[^0-9]/g, '');
      return (uEmail && uEmail === cleanId) || (cleanPhone && uPhone === cleanPhone) || (u.phoneNumber === identifier.trim());
    });

    // 3. If not found in loaded state, query Firestore users
    if (!match) {
      try {
        if (firebaseAuthUid) {
          const docSnap = await getDoc(doc(db, 'users', firebaseAuthUid));
          if (docSnap.exists()) {
            const data = docSnap.data();
            match = {
              uid: docSnap.id,
              fullName: data.fullName || 'Swabi Citizen',
              email: data.email || cleanId,
              phoneNumber: data.phoneNumber || '',
              whatsappNumber: data.whatsappNumber || '',
              bloodGroup: data.bloodGroup || 'O+',
              tehsil: data.tehsil || 'Swabi',
              villageOrArea: data.villageOrArea || 'Swabi',
              role: data.role || 'DONOR',
              isDonor: true,
              totalDonations: Number(data.totalDonations) || 1,
              lastDonationDate: data.lastDonationDate || '',
              isAvailable: data.isAvailable !== false,
              registeredAt: data.registeredAt || data.createdAt || new Date().toISOString(),
              patientDetails: data.patientDetails || '',
              preferredHospital: data.preferredHospital || '',
              notes: data.notes || '',
              age: Number(data.age) || undefined,
              gender: data.gender || undefined,
              donorId: data.donorId || undefined,
              password: data.password || password || ''
            };
          }
        }

        if (!match) {
          const uSnap = await getDocs(collection(db, 'users'));
          uSnap.forEach((docSnap) => {
            const data = docSnap.data();
            const uEmail = (data.email || '').toLowerCase().trim();
            const uPhone = (data.phoneNumber || '').replace(/[^0-9]/g, '');
            if ((uEmail && uEmail === cleanId) || (cleanPhone && uPhone === cleanPhone) || (data.phoneNumber === identifier.trim())) {
              const userRole: UserRole = data.role || (data.isDonor ? 'DONOR' : 'ACCEPTER');
              match = {
                uid: docSnap.id,
                fullName: data.fullName || 'Swabi Citizen',
                email: data.email || '',
                phoneNumber: data.phoneNumber || '',
                whatsappNumber: data.whatsappNumber || '',
                bloodGroup: data.bloodGroup || 'O+',
                tehsil: data.tehsil || 'Swabi',
                villageOrArea: data.villageOrArea || 'Swabi',
                role: userRole,
                isDonor: userRole === 'DONOR' || userRole === 'BOTH' || !!data.isDonor,
                totalDonations: Number(data.totalDonations) || 1,
                lastDonationDate: data.lastDonationDate || '',
                isAvailable: data.isAvailable !== false,
                registeredAt: data.registeredAt || data.createdAt || new Date().toISOString(),
                patientDetails: data.patientDetails || '',
                preferredHospital: data.preferredHospital || '',
                notes: data.notes || '',
                age: Number(data.age) || undefined,
                gender: data.gender || undefined,
                donorId: data.donorId || undefined,
                password: data.password || ''
              };
            }
          });
        }
      } catch (err) {
        console.warn('Error querying users for signin:', err);
      }
    }

    // 4. Fallback: check in donors collection
    if (!match) {
      const matchedDonor = donors.find(d => {
        const dPhone = d.phoneNumber.replace(/[^0-9]/g, '');
        const dEmail = (d.email || '').toLowerCase().trim();
        return (dEmail && dEmail === cleanId) || (cleanPhone && dPhone === cleanPhone) || (d.phoneNumber === identifier.trim());
      });

      if (matchedDonor) {
        match = {
          uid: matchedDonor.userId || firebaseAuthUid || 'donor_user_' + matchedDonor.id,
          fullName: matchedDonor.fullName,
          email: matchedDonor.email || (cleanId.includes('@') ? cleanId : ''),
          phoneNumber: matchedDonor.phoneNumber,
          whatsappNumber: matchedDonor.whatsappNumber || matchedDonor.phoneNumber,
          bloodGroup: matchedDonor.bloodGroup,
          tehsil: matchedDonor.tehsil,
          villageOrArea: matchedDonor.villageOrArea,
          role: 'DONOR',
          isDonor: true,
          totalDonations: matchedDonor.totalDonations || 1,
          lastDonationDate: matchedDonor.lastDonationDate || '',
          isAvailable: matchedDonor.isAvailable,
          registeredAt: matchedDonor.createdAt || new Date().toISOString(),
          notes: matchedDonor.notes || '',
          age: matchedDonor.age,
          gender: matchedDonor.gender,
          donorId: matchedDonor.id,
          password: password || ''
        };
      }
    }

    if (!match) {
      throw new Error('Account not found with this Email or Mobile Number. Please Register first.');
    }

    // Check password if provided and user has password stored (and not already verified by Firebase Auth)
    if (!firebaseAuthUid && password && match.password && match.password !== password) {
      throw new Error('Incorrect password. Please try again.');
    }

    // Save and set as current profile
    try {
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(match));
    } catch (e) {}
    setCurrentProfile(match);
    return match;
  };

  const clearProfile = () => {
    try {
      localStorage.removeItem(STORAGE_PROFILE_KEY);
      signOut(auth).catch(() => {});
    } catch (e) {}
    setCurrentProfile(null);
  };

  const toggleMyAvailability = async () => {
    if (!currentProfile) return;
    const newAvail = !currentProfile.isAvailable;
    await saveProfile({
      ...currentProfile,
      isAvailable: newAvail
    });
  };

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
      uSnap.forEach(u => {
        const data = u.data();
        const userRole: UserRole = data.role || (data.isDonor ? 'DONOR' : 'ACCEPTER');
        uList.push({
          uid: u.id,
          fullName: data.fullName || 'Swabi Citizen',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          whatsappNumber: data.whatsappNumber || '',
          bloodGroup: data.bloodGroup || 'O+',
          tehsil: data.tehsil || 'Swabi',
          villageOrArea: data.villageOrArea || 'Swabi',
          role: userRole,
          isDonor: userRole === 'DONOR' || userRole === 'BOTH' || !!data.isDonor,
          totalDonations: Number(data.totalDonations) || 0,
          lastDonationDate: data.lastDonationDate || '',
          isAvailable: data.isAvailable !== false,
          registeredAt: data.registeredAt || data.createdAt || new Date().toISOString(),
          patientDetails: data.patientDetails || '',
          preferredHospital: data.preferredHospital || '',
          notes: data.notes || '',
          age: Number(data.age) || undefined,
          gender: data.gender || undefined,
          donorId: data.donorId || undefined,
          password: data.password || ''
        });
      });
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
        currentProfile,
        loading,
        error,
        isLive,
        saveProfile,
        signIn,
        clearProfile,
        toggleMyAvailability,
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
