'use client';

import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { BloodGroup, Tehsil, UrgencyLevel } from '../types';
import { X, Heart, AlertTriangle, Building2, User, Phone, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RequestBloodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const TEHSILS: Tehsil[] = ['Swabi', 'Topi', 'Razzar', 'Chota Lahor'];

export const RequestBloodModal: React.FC<RequestBloodModalProps> = ({ isOpen, onClose }) => {
  const { addRequest } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: 'O+' as BloodGroup,
    unitsNeeded: 1,
    hospitalName: 'Bacha Khan Medical Complex (MTI BKMC)',
    tehsil: 'Swabi' as Tehsil,
    contactPerson: '',
    contactPhone: '',
    whatsappNumber: '',
    urgency: 'HIGH' as UrgencyLevel,
    reason: 'Emergency Surgery / Transfusion'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName || !formData.contactPhone || !formData.contactPerson) {
      alert('Please fill in Patient Name, Contact Person, and Phone Number.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addRequest({
        patientName: formData.patientName,
        bloodGroup: formData.bloodGroup,
        unitsNeeded: Number(formData.unitsNeeded) || 1,
        hospitalName: formData.hospitalName,
        tehsil: formData.tehsil,
        contactPerson: formData.contactPerson,
        contactPhone: formData.contactPhone,
        whatsappNumber: formData.whatsappNumber || formData.contactPhone,
        urgency: formData.urgency,
        reason: formData.reason
      });

      setSuccess(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2500);
    } catch (err: any) {
      alert('Failed to post request: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-red-500/40 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative text-white">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-700 via-rose-600 to-red-800 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <AlertTriangle className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">Post Emergency SOS</h2>
              <p className="text-xs text-red-100">Broadcast blood requirement across Swabi donors</p>
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
            <h3 className="text-xl font-bold text-white">SOS Appeal Published!</h3>
            <p className="text-sm text-slate-300">
              Your blood request is now live in the Swabi Heroes network and synced with the mobile app in real-time.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Blood Group & Units */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Blood Group Required *
                </label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value as BloodGroup })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-bold focus:border-red-500 focus:ring-1 focus:ring-red-500"
                >
                  {BLOOD_GROUPS.map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Units / Bags Needed *
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.unitsNeeded}
                  onChange={(e) => setFormData({ ...formData, unitsNeeded: parseInt(e.target.value) || 1 })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  required
                />
              </div>
            </div>

            {/* Patient Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Patient Name / Case Description *
              </label>
              <input
                type="text"
                placeholder="e.g. Ahmad Khan / Emergency Patient"
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
                required
              />
            </div>

            {/* Hospital & Tehsil */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Hospital Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. BKMC Shahmansoor, DHQ Swabi"
                  value={formData.hospitalName}
                  onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Tehsil *
                </label>
                <select
                  value={formData.tehsil}
                  onChange={(e) => setFormData({ ...formData, tehsil: e.target.value as Tehsil })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
                >
                  {TEHSILS.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contact Person & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Attendant / Contact Person *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tariq Khan (Brother)"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Phone Number (Call/WhatsApp) *
                </label>
                <input
                  type="tel"
                  placeholder="0300-1234567"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  required
                />
              </div>
            </div>

            {/* Urgency & Reason */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Urgency Level
                </label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value as UrgencyLevel })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-semibold focus:border-red-500 focus:ring-1 focus:ring-red-500"
                >
                  <option value="CRITICAL_IMMEDIATE">🔴 Critical Immediate (Within 1 Hour)</option>
                  <option value="HIGH">🟠 High Priority (Today)</option>
                  <option value="NORMAL">🟡 Normal (Scheduled / 24-48 Hours)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Medical Reason
                </label>
                <input
                  type="text"
                  placeholder="e.g. Thalassemia, Delivery, Accident"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>
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
                className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-red-950 flex items-center gap-2 disabled:opacity-50"
              >
                <Heart className="w-4 h-4 fill-white" />
                {isSubmitting ? 'Posting Live...' : 'Publish Emergency SOS'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
