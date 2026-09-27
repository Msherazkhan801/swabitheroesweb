'use client';

import React from 'react';
import { useData } from '../context/DataContext';
import { AlertTriangle, Phone, MessageCircle, HeartPulse } from 'lucide-react';

export const SOSTicker: React.FC<{ onRequestClick?: () => void }> = ({ onRequestClick }) => {
  const { requests } = useData();
  const activeRequests = requests.filter(r => r.status === 'ACTIVE');

  if (activeRequests.length === 0) {
    return (
      <div className="bg-emerald-950/80 border-b border-emerald-800/40 text-emerald-200 px-4 py-2 text-xs font-medium flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>Alhamdulillah, no active emergency SOS blood requests in Swabi right now. Donors are standing by!</span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-red-950 via-red-900 to-red-950 border-b border-red-700/50 text-white shadow-md relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-2 sm:py-2.5 flex flex-wrap items-center justify-between gap-2">
        {/* Left SOS Label */}
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-red-300 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            LIVE SOS ALERTS:
          </span>
          <span className="bg-red-700/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full border border-red-500/40">
            {activeRequests.length} Active {activeRequests.length === 1 ? 'Case' : 'Cases'}
          </span>
        </div>

        {/* Scrolling/Listed Active SOS Cases */}
        <div className="flex items-center gap-3 overflow-x-auto py-0.5 no-scrollbar max-w-full text-xs">
          {activeRequests.slice(0, 3).map((req) => (
            <div 
              key={req.id}
              className="bg-black/30 hover:bg-black/50 border border-red-600/30 rounded-lg px-3 py-1 flex items-center gap-2.5 shrink-0 transition-colors"
            >
              <span className="bg-red-600 text-white font-black text-xs px-2 py-0.5 rounded shadow-sm">
                {req.bloodGroup}
              </span>
              <span className="font-semibold text-gray-100 max-w-[130px] truncate">
                {req.hospitalName.replace('Hospital', '').replace('Complex', '')}
              </span>
              <span className="text-red-300 text-[11px]">
                ({req.unitsNeeded} {req.unitsNeeded === 1 ? 'Unit' : 'Units'})
              </span>
              <div className="flex items-center gap-1.5 ml-1">
                <a
                  href={`tel:${req.contactPhone}`}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white p-1 rounded-md transition-colors"
                  title={`Call ${req.contactPhone}`}
                >
                  <Phone className="w-3 h-3" />
                </a>
                <a
                  href={`https://wa.me/${(req.whatsappNumber || req.contactPhone).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Salam, I saw your urgent request on Swabi Heroes for ${req.bloodGroup} at ${req.hospitalName}. Can I donate?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-500 text-white p-1 rounded-md transition-colors"
                  title="WhatsApp"
                >
                  <MessageCircle className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
