'use client';

import React from 'react';
import { Donor } from '../types';
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  CheckCircle2, 
  Heart, 
  Shield, 
  Clock,
  Sparkles 
} from 'lucide-react';

interface DonorCardProps {
  donor: Donor;
}

export const DonorCard: React.FC<DonorCardProps> = ({ donor }) => {
  const cleanPhone = donor.phoneNumber.replace(/[^0-9]/g, '');
  const cleanWhatsapp = (donor.whatsappNumber || donor.phoneNumber).replace(/[^0-9]/g, '');
  
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    `Salam ${donor.fullName}! I found your contact on Swabi Heroes Blood Network. We urgently need blood donation for a patient in Swabi. Are you available?`
  )}`;

  return (
    <div className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg transition-all duration-300 hover:shadow-red-950/20 group flex flex-col justify-between relative overflow-hidden">
      {/* Top Accent line */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${
        donor.isAvailable ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-slate-700'
      }`} />

      <div>
        {/* Header: Blood Group & Status */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 flex flex-col items-center justify-center text-white shadow-md shadow-red-950/50 p-2 shrink-0 border border-red-400/20">
              <span className="text-xl font-black tracking-tighter leading-none">{donor.bloodGroup}</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-red-200 mt-0.5">Donor</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-bold text-base text-white group-hover:text-red-400 transition-colors">
                  {donor.fullName}
                </h3>
                {donor.isVerified && (
                  <span className="inline-flex items-center text-sky-400" title="Verified Swabi Hero">
                    <CheckCircle2 className="w-4 h-4 fill-sky-400/20" />
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <span>{donor.gender}</span>
                <span>•</span>
                <span>{donor.age} yrs</span>
              </p>
            </div>
          </div>

          {/* Availability Badge */}
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 shrink-0 ${
            donor.isAvailable
              ? 'bg-emerald-950/60 border-emerald-600/40 text-emerald-400'
              : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${donor.isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            {donor.isAvailable ? 'Available' : 'Unavailable'}
          </span>
        </div>

        {/* Location & Details */}
        <div className="space-y-2 text-xs text-slate-300 mb-4 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
          <div className="flex items-center gap-2 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="font-semibold text-white">{donor.villageOrArea}</span>
            <span className="text-slate-500">({donor.tehsil} Tehsil)</span>
          </div>

          <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800/60 text-[11px]">
            <div className="flex items-center gap-1 text-slate-300">
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500/20" />
              <span>{donor.totalDonations} {donor.totalDonations === 1 ? 'Life Saved' : 'Lives Saved'}</span>
            </div>
            {donor.emergencyOnly && (
              <span className="bg-amber-950/80 text-amber-300 border border-amber-800/40 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                Emergency Cases Only
              </span>
            )}
          </div>
        </div>

        {donor.notes && (
          <p className="text-[11px] text-slate-400 italic mb-4 line-clamp-1">
            &ldquo;{donor.notes}&rdquo;
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
        <a
          href={`tel:${donor.phoneNumber}`}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
        >
          <Phone className="w-3.5 h-3.5" />
          Call Direct
        </a>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 hover:bg-green-500 text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          WhatsApp
        </a>
      </div>
    </div>
  );
};
