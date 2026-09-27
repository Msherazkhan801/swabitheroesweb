'use client';

import React, { useState } from 'react';
import { BloodRequest } from '../types';
import { 
  AlertTriangle, 
  Building2, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Share2, 
  CheckCircle, 
  Clock, 
  UserCheck 
} from 'lucide-react';

interface SOSCardProps {
  request: BloodRequest;
}

export const SOSCard: React.FC<SOSCardProps> = ({ request }) => {
  const [copied, setCopied] = useState(false);
  const cleanPhone = request.contactPhone.replace(/[^0-9]/g, '');
  const cleanWhatsapp = (request.whatsappNumber || request.contactPhone).replace(/[^0-9]/g, '');

  const isCritical = request.urgency === 'CRITICAL_IMMEDIATE';
  const isFulfilled = request.status === 'FULFILLED';
  const isCancelled = request.status === 'CANCELLED';

  const shareAppealText = `🚨 *URGENT BLOOD REQUIRED IN SWABI* 🚨\n\n` +
    `🩸 *Blood Group:* ${request.bloodGroup}\n` +
    `📦 *Units Needed:* ${request.unitsNeeded} Unit(s)\n` +
    `🏥 *Hospital:* ${request.hospitalName} (${request.tehsil})\n` +
    `👤 *Patient:* ${request.patientName}\n` +
    `⚠️ *Reason:* ${request.reason}\n` +
    `📞 *Contact:* ${request.contactPhone} (${request.contactPerson})\n\n` +
    `_Shared via Swabi Heroes Blood Network. Please forward to save a life!_`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Urgent ${request.bloodGroup} Blood Required in Swabi`,
        text: shareAppealText
      }).catch(() => {});
    } else {
      const waUrl = `https://wa.me/?text=${encodeURIComponent(shareAppealText)}`;
      window.open(waUrl, '_blank');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareAppealText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`rounded-2xl p-5 border transition-all duration-300 relative flex flex-col justify-between overflow-hidden shadow-xl ${
      isFulfilled
        ? 'bg-slate-900/60 border-emerald-800/40 opacity-80'
        : isCritical
        ? 'bg-gradient-to-br from-red-950/90 via-slate-900 to-slate-950 border-red-600/70 shadow-red-950/40'
        : 'bg-slate-900/90 border-red-800/40 shadow-slate-950/50'
    }`}>
      {/* Top Banner Stripe */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${
        isFulfilled 
          ? 'bg-emerald-500' 
          : isCritical 
          ? 'bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 animate-pulse' 
          : 'bg-red-600'
      }`} />

      <div>
        {/* Header: Urgency & Blood Badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center text-white shadow-lg shrink-0 border ${
              isFulfilled
                ? 'bg-emerald-700 border-emerald-500/40'
                : 'bg-gradient-to-br from-red-600 via-red-700 to-rose-800 border-red-400/40 shadow-red-950/60'
            }`}>
              <span className="text-2xl font-black tracking-tight leading-none">{request.bloodGroup}</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-red-200 mt-0.5">
                {request.unitsNeeded} {request.unitsNeeded === 1 ? 'Bag' : 'Bags'}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                  isFulfilled
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                    : isCritical
                    ? 'bg-red-950 text-red-300 border-red-600 animate-pulse'
                    : 'bg-rose-950 text-rose-300 border-rose-800'
                }`}>
                  {isFulfilled ? (
                    <>
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                      CASE FULFILLED
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3 h-3 text-red-400" />
                      {request.urgency.replace('_', ' ')}
                    </>
                  )}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(request.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <h3 className="font-bold text-base text-white mt-1">
                Patient: {request.patientName}
              </h3>
            </div>
          </div>
        </div>

        {/* Hospital & Reason Info */}
        <div className="space-y-2.5 text-xs text-slate-300 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="font-semibold text-white">{request.hospitalName}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Tehsil: <strong className="text-slate-200">{request.tehsil}</strong></span>
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-slate-300">
            <span className="text-slate-400 font-medium">Condition / Reason:</span>
            <p className="font-medium text-white mt-0.5">{request.reason}</p>
          </div>

          <div className="flex items-center justify-between text-slate-400 pt-1 text-[11px]">
            <span>Attendant: <strong className="text-slate-200">{request.contactPerson}</strong></span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <div className="grid grid-cols-2 gap-2">
          <a
            href={`tel:${request.contactPhone}`}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow transition-all active:scale-95"
          >
            <Phone className="w-3.5 h-3.5" />
            Call Attendant
          </a>
          <a
            href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
              `Salam! I am reaching out regarding the urgent ${request.bloodGroup} blood appeal for ${request.patientName} at ${request.hospitalName}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-500 text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow transition-all active:scale-95"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp
          </a>
        </div>

        <button
          onClick={handleShare}
          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs py-2 rounded-xl flex items-center justify-center gap-2 border border-slate-700 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5 text-rose-400" />
          Share Appeal on WhatsApp Group
        </button>
      </div>
    </div>
  );
};
