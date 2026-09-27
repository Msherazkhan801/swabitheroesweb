'use client';

import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { BloodGroup, Tehsil } from '../types';
import { X, UserPlus, Heart, CheckCircle2, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RegisterDonorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const TEHSILS: Tehsil[] = ['Swabi', 'Topi', 'Razzar', 'Chota Lahor'];

export const RegisterDonorModal: React.FC<RegisterDonorModalProps> = ({ isOpen, onClose }) => {
  const { addDonor } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    bloodGroup: 'O+' as BloodGroup,
    tehsil: 'Swabi' as Tehsil,
    villageOrArea: '',
    phoneNumber: '',
    whatsappNumber: '',
    age: 24,
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    isAvailable: true,
    totalDonations: 1,
    emergencyOnly: false,
    notes: 'Available for blood donation in Swabi district.'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phoneNumber || !formData.villageOrArea) {
      alert('Please fill in your Full Name, Phone Number, and Area/Village.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDonor({
        fullName: formData.fullName,
        bloodGroup: formData.bloodGroup,
        tehsil: formData.tehsil,
        villageOrArea: formData.villageOrArea,
        phoneNumber: formData.phoneNumber,
        whatsappNumber: formData.whatsappNumber || formData.phoneNumber,
        age: Number(formData.age) || 24,
        gender: formData.gender,
        isAvailable: formData.isAvailable,
        totalDonations: Number(formData.totalDonations) || 0,
        isVerified: true,
        emergencyOnly: formData.emergencyOnly,
        notes: formData.notes
      });

      setSuccess(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2500);
    } catch (err: any) {
      alert('Registration error: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative text-white">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <UserPlus className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">Join as Blood Donor</h2>
              <p className="text-xs text-emerald-100">Be a hero for patients in need across Swabi</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-black/20 hover:bg-black/40 text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Welcome to Swabi Heroes!</h3>
            <p className="text-sm text-slate-300">
              JazakAllah Khair. Your donor profile is now live in the network and visible to patients in need.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Name & Blood Group */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Asad Ali"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Blood Group *
                </label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value as BloodGroup })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-bold focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                >
                  {BLOOD_GROUPS.map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tehsil & Village */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Tehsil *
                </label>
                <select
                  value={formData.tehsil}
                  onChange={(e) => setFormData({ ...formData, tehsil: e.target.value as Tehsil })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                >
                  {TEHSILS.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Village / Area *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Zaida, Shahmansoor, Maneri"
                  value={formData.villageOrArea}
                  onChange={(e) => setFormData({ ...formData, villageOrArea: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            {/* Phone & WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  placeholder="0300-1234567"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  WhatsApp Number (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="0300-1234567"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Age, Gender & Donations */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Age (18-60)
                </label>
                <input
                  type="number"
                  min="18"
                  max="65"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 20 })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Past Donations
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.totalDonations}
                  onChange={(e) => setFormData({ ...formData, totalDonations: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Availability Checkbox */}
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="isAvailable"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-600 bg-slate-950 border-slate-700 focus:ring-emerald-500"
              />
              <label htmlFor="isAvailable" className="text-xs text-slate-300 font-medium cursor-pointer">
                I am currently active and ready to donate blood if requested
              </label>
            </div>

            {/* Submit CTA */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-emerald-950 flex items-center gap-2 disabled:opacity-50"
              >
                <Heart className="w-4 h-4 fill-white" />
                {isSubmitting ? 'Registering...' : 'Complete Registration'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
