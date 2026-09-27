'use client';

import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { BloodGroup, Tehsil } from '../types';
import { 
  X, 
  User, 
  Heart, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Edit3, 
  Save, 
  LogOut, 
  Droplet, 
  AlertTriangle, 
  CheckCircle2, 
  Building2, 
  Users,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestBloodClick: () => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const TEHSILS: Tehsil[] = ['Swabi', 'Topi', 'Razzar', 'Chota Lahor'];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onRequestBloodClick
}) => {
  const { currentProfile, saveProfile, clearProfile, toggleMyAvailability, requests } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    fullName: currentProfile?.fullName || '',
    bloodGroup: (currentProfile?.bloodGroup || 'O+') as BloodGroup,
    tehsil: (currentProfile?.tehsil || 'Swabi') as Tehsil,
    villageOrArea: currentProfile?.villageOrArea || '',
    phoneNumber: currentProfile?.phoneNumber || '',
    whatsappNumber: currentProfile?.whatsappNumber || '',
    age: currentProfile?.age || 24,
    gender: (currentProfile?.gender || 'Male') as 'Male' | 'Female' | 'Other',
    isAvailable: currentProfile?.isAvailable !== false,
    totalDonations: currentProfile?.totalDonations || 0,
    notes: currentProfile?.notes || ''
  });

  // Sync state when currentProfile changes
  React.useEffect(() => {
    if (currentProfile) {
      setFormData({
        fullName: currentProfile.fullName || '',
        bloodGroup: currentProfile.bloodGroup || 'O+',
        tehsil: currentProfile.tehsil || 'Swabi',
        villageOrArea: currentProfile.villageOrArea || '',
        phoneNumber: currentProfile.phoneNumber || '',
        whatsappNumber: currentProfile.whatsappNumber || '',
        age: currentProfile.age || 24,
        gender: (currentProfile.gender || 'Male') as any,
        isAvailable: currentProfile.isAvailable !== false,
        totalDonations: currentProfile.totalDonations || 0,
        notes: currentProfile.notes || ''
      });
    }
  }, [currentProfile]);

  if (!isOpen || !currentProfile) return null;

  // Requests posted by this user
  const myRequests = requests.filter(r => r.postedByUid === currentProfile.uid || r.contactPhone === currentProfile.phoneNumber);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phoneNumber || !formData.villageOrArea) {
      alert('Please provide Full Name, Phone Number, and Village/Area.');
      return;
    }

    setIsSaving(true);
    try {
      await saveProfile({
        ...currentProfile,
        fullName: formData.fullName,
        bloodGroup: formData.bloodGroup,
        role: 'DONOR',
        tehsil: formData.tehsil,
        villageOrArea: formData.villageOrArea,
        phoneNumber: formData.phoneNumber,
        whatsappNumber: formData.whatsappNumber || formData.phoneNumber,
        age: Number(formData.age) || undefined,
        gender: formData.gender,
        isAvailable: formData.isAvailable,
        totalDonations: Number(formData.totalDonations) || 0,
        notes: formData.notes
      });

      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      setIsEditing(false);
    } catch (err: any) {
      alert('Failed to update profile: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to sign out or switch profile on this browser?')) {
      clearProfile();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative text-white flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900 via-slate-900 to-slate-900 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-600/30 border border-red-500/50 flex items-center justify-center text-white shadow-lg">
              <span className="font-black text-xl text-red-300 leading-none">{currentProfile.bloodGroup}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-black text-lg text-white">{currentProfile.fullName}</h2>
                <span className="bg-emerald-950 text-emerald-300 border border-emerald-600 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                  🩸 Swabi Hero Donor
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {currentProfile.villageOrArea}, Tehsil {currentProfile.tehsil}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {isEditing ? (
            /* EDIT FORM */
            <form onSubmit={handleSave} className="space-y-4">
              <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="font-bold text-sm text-amber-300 flex items-center gap-2">
                  <Edit3 className="w-4 h-4" /> Edit Profile Details
                </h3>

                {/* Full Name & Blood Group */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:border-red-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Blood Group *
                    </label>
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value as BloodGroup })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-xs focus:border-red-500"
                    >
                      {BLOOD_GROUPS.map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tehsil & Village */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Tehsil *
                    </label>
                    <select
                      value={formData.tehsil}
                      onChange={(e) => setFormData({ ...formData, tehsil: e.target.value as Tehsil })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:border-red-500"
                    >
                      {TEHSILS.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Village / Area *
                    </label>
                    <input
                      type="text"
                      value={formData.villageOrArea}
                      onChange={(e) => setFormData({ ...formData, villageOrArea: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:border-red-500"
                      required
                    />
                  </div>
                </div>

                {/* Contact numbers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:border-red-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={formData.whatsappNumber}
                      onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:border-red-500"
                    />
                  </div>
                </div>

                {/* Age, Gender & Donations */}
                <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-800">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Age</label>
                    <input
                      type="number"
                      min="18"
                      max="65"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 20 })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Donations</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.totalDonations}
                      onChange={(e) => setFormData({ ...formData, totalDonations: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Edit Actions */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2 rounded-xl flex items-center gap-1.5 shadow"
                >
                  <Save className="w-3.5 h-3.5" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            /* VIEW MODE */
            <div className="space-y-4">
              
              {/* Live Donor Availability Card */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-3.5 h-3.5 rounded-full ${
                    currentProfile.isAvailable ? 'bg-emerald-500 animate-ping' : 'bg-slate-600'
                  }`} />
                  <div>
                    <div className="text-xs font-bold text-white">
                      {currentProfile.isAvailable ? '🟢 Active & Ready to Donate Blood' : '⚪ Temporarily Unavailable'}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {currentProfile.isAvailable ? 'Listed in active donor searches' : 'Hidden from urgent call lists'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={toggleMyAvailability}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                    currentProfile.isAvailable
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700 hover:bg-emerald-900'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {currentProfile.isAvailable ? 'Set to Busy' : 'Set to Available'}
                </button>
              </div>

              {/* Profile Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Location</span>
                  <div className="text-xs font-bold text-white mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    {currentProfile.villageOrArea}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Tehsil {currentProfile.tehsil}</div>
                </div>

                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Calling Number</span>
                  <div className="text-xs font-bold text-white mt-1 font-mono">{currentProfile.phoneNumber}</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-1">
                    <Phone className="w-2.5 h-2.5" /> Call Direct
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Donations Count</span>
                  <div className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-emerald-400/30" />
                    {currentProfile.totalDonations} Lives Saved
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Swabi Volunteer</div>
                </div>
              </div>

              {/* Emergency SOS Quick Action (For Relative or Self) */}
              <div className="bg-gradient-to-r from-red-950/60 via-slate-950 to-slate-950 p-4 rounded-2xl border border-red-900/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    Need Blood for Relative or Patient?
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Broadcast an urgent SOS request with your attendant contact info.
                  </p>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onRequestBloodClick();
                  }}
                  className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-red-950 shrink-0 flex items-center gap-1.5"
                >
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  Post SOS Appeal
                </button>
              </div>

              {/* Cases Posted by This Profile */}
              {myRequests.length > 0 && (
                <div className="space-y-2 pt-1">
                  <h4 className="font-bold text-xs text-slate-300 uppercase tracking-wider">
                    My Posted SOS Cases ({myRequests.length})
                  </h4>
                  <div className="space-y-2">
                    {myRequests.map(req => (
                      <div key={req.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            <span className="bg-red-600 text-white px-1.5 py-0.2 rounded text-[10px]">{req.bloodGroup}</span>
                            {req.patientName} {req.relationship ? `(${req.relationship})` : ''} • {req.unitsNeeded} unit(s)
                          </div>
                          <div className="text-[10px] text-slate-400">{req.hospitalName}</div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          req.status === 'ACTIVE' ? 'bg-red-950 text-red-300 border border-red-700' : 'bg-emerald-950 text-emerald-300'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          {!isEditing ? (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-3.5 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                Edit Profile
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-400 flex items-center gap-1 font-semibold transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </>
          ) : null}
        </div>

      </div>
    </div>
  );
};
