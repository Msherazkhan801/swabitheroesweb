'use client';

import React, { useState, useEffect } from 'react';
import { Donor, BloodGroup, Tehsil } from '../../../types';
import { X, Save, Shield, Heart } from 'lucide-react';

interface DonorEditModalProps {
  isOpen: boolean;
  donor: Donor | null; // null if adding a new donor
  onClose: () => void;
  onSave: (data: Partial<Donor>) => Promise<void>;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const TEHSILS: Tehsil[] = ['Swabi', 'Topi', 'Razzar', 'Chota Lahor'];

export const DonorEditModal: React.FC<DonorEditModalProps> = ({
  isOpen,
  donor,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<Donor>>({
    fullName: '',
    bloodGroup: 'O+',
    tehsil: 'Swabi',
    villageOrArea: '',
    phoneNumber: '',
    whatsappNumber: '',
    age: 25,
    gender: 'Male',
    isAvailable: true,
    isVerified: true,
    totalDonations: 1,
    emergencyOnly: false,
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (donor) {
      setFormData({
        fullName: donor.fullName,
        bloodGroup: donor.bloodGroup,
        tehsil: donor.tehsil,
        villageOrArea: donor.villageOrArea,
        phoneNumber: donor.phoneNumber,
        whatsappNumber: donor.whatsappNumber || donor.phoneNumber,
        age: donor.age,
        gender: donor.gender,
        isAvailable: donor.isAvailable,
        isVerified: donor.isVerified,
        totalDonations: donor.totalDonations,
        emergencyOnly: donor.emergencyOnly,
        notes: donor.notes || ''
      });
    } else {
      setFormData({
        fullName: '',
        bloodGroup: 'O+',
        tehsil: 'Swabi',
        villageOrArea: '',
        phoneNumber: '',
        whatsappNumber: '',
        age: 25,
        gender: 'Male',
        isAvailable: true,
        isVerified: true,
        totalDonations: 1,
        emergencyOnly: false,
        notes: ''
      });
    }
  }, [donor, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phoneNumber || !formData.villageOrArea) {
      alert('Please fill in Full Name, Phone, and Village/Area.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      alert('Error saving donor: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative text-white">
        {/* Header */}
        <div className="bg-slate-800 p-5 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center border border-red-500/30">
              <Heart className="w-5 h-5 fill-red-500/30" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">
                {donor ? 'Edit Donor Profile' : 'Add New Donor'}
              </h2>
              <p className="text-xs text-slate-400">Manage donor record in Cloud Firestore</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Name & Blood Group */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Full Name *</label>
              <input
                type="text"
                value={formData.fullName || ''}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Blood Group *</label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value as BloodGroup })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-red-500"
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
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Tehsil *</label>
              <select
                value={formData.tehsil}
                onChange={(e) => setFormData({ ...formData, tehsil: e.target.value as Tehsil })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-red-500"
              >
                {TEHSILS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Village / Area *</label>
              <input
                type="text"
                value={formData.villageOrArea || ''}
                onChange={(e) => setFormData({ ...formData, villageOrArea: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-red-500"
                required
              />
            </div>
          </div>

          {/* Phone & WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Phone Number *</label>
              <input
                type="tel"
                value={formData.phoneNumber || ''}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">WhatsApp</label>
              <input
                type="tel"
                value={formData.whatsappNumber || ''}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-red-500"
              />
            </div>
          </div>

          {/* Age, Gender & Donations */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Age</label>
              <input
                type="number"
                value={formData.age || 25}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 25 })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-red-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Donations</label>
              <input
                type="number"
                value={formData.totalDonations || 0}
                onChange={(e) => setFormData({ ...formData, totalDonations: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-red-500"
              />
            </div>
          </div>

          {/* Flags */}
          <div className="space-y-2 pt-2 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isAvailable !== false}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-600 bg-slate-900 border-slate-700"
              />
              <span className="text-xs font-medium text-slate-200">
                Mark Donor as <strong>Available & Active</strong>
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!formData.isVerified}
                onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                className="w-4 h-4 rounded text-sky-600 bg-slate-900 border-slate-700"
              />
              <span className="text-xs font-medium text-slate-200">
                Grant <strong>Verified Hero Badge (Blue Check)</strong>
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!formData.emergencyOnly}
                onChange={(e) => setFormData({ ...formData, emergencyOnly: e.target.checked })}
                className="w-4 h-4 rounded text-amber-600 bg-slate-900 border-slate-700"
              />
              <span className="text-xs font-medium text-slate-200">
                Contact for <strong>Emergency / Critical Cases Only</strong>
              </span>
            </label>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Admin Notes / Medical Comments</label>
            <textarea
              rows={2}
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 text-xs"
              placeholder="e.g. Ready for Topi and Swabi city hospitals"
            />
          </div>

          {/* Footer CTA */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Saving...' : 'Save to Firestore'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
