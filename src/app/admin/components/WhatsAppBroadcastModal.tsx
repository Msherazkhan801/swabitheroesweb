'use client';

import React, { useState } from 'react';
import { BloodRequest, Donor } from '../../../types';
import { X, Copy, Check, MessageCircle, Share2, Sparkles } from 'lucide-react';

interface WhatsAppBroadcastModalProps {
  isOpen: boolean;
  requests: BloodRequest[];
  donors: Donor[];
  onClose: () => void;
}

export const WhatsAppBroadcastModal: React.FC<WhatsAppBroadcastModalProps> = ({
  isOpen,
  requests,
  donors,
  onClose
}) => {
  const [copied, setCopied] = useState(false);
  const activeRequests = requests.filter(r => r.status === 'ACTIVE');

  if (!isOpen) return null;

  const broadcastMessage = `🚨 *SWABI HEROES BLOOD NETWORK - EMERGENCY BROADCAST* 🚨\n` +
    `صوابۍ وینه بخښونکي بیړنۍ اړتیاوې\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    (activeRequests.length > 0
      ? activeRequests.map((r, i) => 
          `*Case #${i + 1}:* 🩸 *${r.bloodGroup}* (${r.unitsNeeded} Unit${r.unitsNeeded > 1 ? 's' : ''})\n` +
          `🏥 *Hospital:* ${r.hospitalName} (${r.tehsil})\n` +
          `👤 *Patient:* ${r.patientName}\n` +
          `⚠️ *Reason:* ${r.reason}\n` +
          `📞 *Contact:* ${r.contactPhone} (${r.contactPerson})\n`
        ).join('────────────────────\n')
      : `Alhamdulillah, all emergency cases are fulfilled today!\n`) +
    `\n━━━━━━━━━━━━━━━━━━━━\n` +
    `👥 *Total Registered Donors:* ${donors.length} Heroes in Swabi\n` +
    `📲 *Portal Link:* https://swabiheroes.web.app\n` +
    `_Please share in your family & village WhatsApp groups to save lives!_`;

  const handleCopy = () => {
    navigator.clipboard.writeText(broadcastMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(broadcastMessage)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative text-white">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-700 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <MessageCircle className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">WhatsApp SOS Broadcast</h2>
              <p className="text-xs text-emerald-100">1-Click formatted alert for Swabi WhatsApp groups</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-black/20 hover:bg-black/40 text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-emerald-300 whitespace-pre-wrap max-h-64 overflow-y-auto leading-relaxed">
            {broadcastMessage}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleCopy}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
              {copied ? 'Copied to Clipboard!' : 'Copy Formatted Text'}
            </button>

            <button
              onClick={handleOpenWhatsApp}
              className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <Share2 className="w-4 h-4" />
              Open in WhatsApp
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
