'use client';

import React from 'react';
import { HOSPITALS_DATA, Hospital } from '../types';
import { Building2, Phone, MapPin, ExternalLink, ShieldAlert, HeartPulse } from 'lucide-react';

export const HospitalDirectory: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Building2 className="w-7 h-7 text-sky-400" />
            Hospitals & Emergency Directory
          </h2>
          <p className="text-sm text-slate-400">
            Emergency Blood Banks, Trauma Centers & Rescue 1122 across Swabi District
          </p>
        </div>
        <a
          href="tel:1122"
          className="bg-red-600 hover:bg-red-500 text-white font-black text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-red-950 flex items-center gap-2 self-start sm:self-auto border border-red-400/30"
        >
          <ShieldAlert className="w-5 h-5 animate-pulse" />
          Emergency: Call 1122
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {HOSPITALS_DATA.map((hosp) => (
          <div
            key={hosp.id}
            className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all hover:shadow-sky-950/20 group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                    hosp.hasBloodBank
                      ? 'bg-rose-950/70 border-rose-700 text-rose-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}>
                    {hosp.hasBloodBank ? 'Blood Bank Available' : 'Emergency Center'}
                  </span>
                  <h3 className="font-bold text-base text-white mt-1.5 group-hover:text-sky-400 transition-colors">
                    {hosp.name}
                  </h3>
                  {hosp.pashtoName && (
                    <p className="text-xs text-slate-400 font-medium">{hosp.pashtoName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{hosp.address} ({hosp.tehsil})</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <HeartPulse className="w-3.5 h-3.5 shrink-0" />
                  <span>{hosp.operatingHours}</span>
                </div>
              </div>

              {hosp.services && hosp.services.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {hosp.services.map((s, idx) => (
                    <span key={idx} className="bg-slate-800/80 text-slate-300 text-[10px] font-medium px-2 py-0.5 rounded-md border border-slate-700/60">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800">
              <a
                href={`tel:${hosp.emergencyHelpline || hosp.phone}`}
                className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow"
              >
                <Phone className="w-3.5 h-3.5" />
                Call Helpline
              </a>
              <a
                href={hosp.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Google Maps
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
