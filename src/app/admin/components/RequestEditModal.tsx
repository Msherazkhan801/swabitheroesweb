'use client';

import React, { useState, useEffect } from 'react';
import { BloodRequest, BloodGroup, Tehsil, UrgencyLevel, RequestStatus } from '../../../types';
import { X, Save, AlertTriangle, CheckCircle, Ban } from 'lucide-react';

interface RequestEditModalProps {
  isOpen: boolean;
  request: BloodRequest | null;
  onClose: () => void;
  onSave: (data: Partial<BloodRequest>) => Promise<void>;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const TEHSILS: Tehsil[] = ['Swabi', 'Topi', 'Razzar', 'Chota Lahor'];

export const RequestEditModal: React.FC<RequestEditModalProps> = ({
  isOpen,
  request,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<BloodRequest>>({
    patientName: '',
    bloodGroup: 'O+',
    unitsNeeded: 1,
    hospitalName: 'Bacha Khan Medical Complex (MTI BKMC)',
    tehsil: 'Swabi',
    contactPerson: '',
    contactPhone: '',
    whatsappNumber: '',
    urgency: 'HIGH',
    reason: 'Emergency Blood Need',
    status: 'ACTIVE'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (request) {
      setFormData({
        patientName: request.patientName,
        bloodGroup: request.bloodGroup,
        unitsNeeded: request.unitsNeeded,
        hospitalName: request.hospitalName,
        tehsil: request.tehsil,
        contactPerson: request.contactPerson,
        contactPhone: request.contactPhone,
        whatsappNumber: request.whatsappNumber || request.contactPhone,
        urgency: request.urgency,
        reason: request.reason,
        status: request.status
      });
    }
  }, [request, isOpen]);

  if (!isOpen || !request) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      alert('Error updating request: ' + err.message);
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
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">Edit Emergency SOS Request</h2>
              <p className="text-xs text-slate-400">Update case parameters or status</p>
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
          {/* Status Selection */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Case Status *</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'ACTIVE' })}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border ${
                  formData.status === 'ACTIVE'
                    ? 'bg-red-600 border-red-500 text-white shadow'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                ACTIVE SOS
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'FULFILLED' })}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border ${
                  formData.status === 'FULFILLED'
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                FULFILLED
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'CANCELLED' })}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border ${
                  formData.status === 'CANCELLED'
                    ? 'bg-slate-700 border-slate-600 text-white shadow'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <Ban className="w-3.5 h-3.5" />
                CANCELLED
              </button>
            </div>
          </div>

          {/* Blood Group & Units */}
          <div className="grid grid-cols-2 gap-3">
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
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Units Needed *</label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.unitsNeeded || 1}
                onChange={(e) => setFormData({ ...formData, unitsNeeded: parseInt(e.target.value) || 1 })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-red-500"
              />
            </div>
          </div>

          {/* Patient Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Patient Name *</label>
            <input
              type="text"
              value={formData.patientName || ''}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-red-500"
              required
            />
          </div>

          {/* Hospital & Tehsil */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Hospital Name *</label>
              <input
                type="text"
                value={formData.hospitalName || ''}
                onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-red-500"
                required
              />
            </div>
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
          </div>

          {/* Contact Person & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Contact Person *</label>
              <input
                type="text"
                value={formData.contactPerson || ''}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Phone Number *</label>
              <input
                type="tel"
                value={formData.contactPhone || ''}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-red-500"
                required
              />
            </div>
          </div>

          {/* Urgency & Reason */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Urgency Level</label>
              <select
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value as UrgencyLevel })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold focus:border-red-500"
              >
                <option value="CRITICAL_IMMEDIATE">🔴 Critical Immediate (Urgent)</option>
                <option value="HIGH">🟠 High Priority</option>
                <option value="NORMAL">🟡 Normal Priority</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Reason / Condition</label>
              <input
                type="text"
                value={formData.reason || ''}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-red-500"
              />
            </div>
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
              {isSubmitting ? 'Updating...' : 'Update SOS Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
