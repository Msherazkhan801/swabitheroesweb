'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Shield, Phone, MapPin, ExternalLink, Activity } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-red-950 border-b border-red-900/30 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
              <Heart className="w-7 h-7 fill-red-500 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Save a Life Today in Swabi</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Every blood donation can save up to 3 lives. Connect with patients in BKMC, DHQ Swabi, and THQ Hospitals.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/#donors"
              className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg shadow-red-950 transition-all"
            >
              Find Donors in Your Tehsil
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand info */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-800 border border-red-500/30">
              <Image src="/logo.png" alt="Swabi Heroes" fill className="object-cover" />
            </div>
            <div>
              <span className="font-black text-lg text-white">SWABI HEROES</span>
              <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Blood Donation Network</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Free community blood donor network connecting volunteer blood donors with patients across Swabi, Topi, Razzar, and Chota Lahor.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>100% Free & Non-Profit Initiative</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4 tracking-wider uppercase">Quick Links</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link href="/#donors" className="hover:text-white transition-colors">
                🩸 Search Blood Donors
              </Link>
            </li>
            <li>
              <Link href="/#sos-requests" className="hover:text-white transition-colors">
                🚨 Emergency SOS Appeals
              </Link>
            </li>
            <li>
              <Link href="/#hospitals" className="hover:text-white transition-colors">
                🏥 Swabi Hospitals & Blood Banks
              </Link>
            </li>
            <li>
              <Link href="/admin" className="text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                Admin Management Portal
              </Link>
            </li>
          </ul>
        </div>

        {/* Swabi Coverage */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4 tracking-wider uppercase">Tehsils Covered</h4>
          <ul className="space-y-2.5 text-xs">
            <li className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span>Tehsil Swabi (City, Shahmansoor, Zaida, Maneri)</span>
            </li>
            <li className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span>Tehsil Topi (Topi City, Gadoon, Kotha, Maini)</span>
            </li>
            <li className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span>Tehsil Razzar (Kalu Khan, Shewa, Karnal Sher Killi)</span>
            </li>
            <li className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span>Tehsil Chota Lahor (Lahor, Jhangira, Yar Hussain)</span>
            </li>
          </ul>
        </div>

        {/* Emergency Helplines */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4 tracking-wider uppercase">Emergency Contacts</h4>
          <div className="space-y-2.5 text-xs">
            <a
              href="tel:1122"
              className="bg-red-950/60 border border-red-800/40 p-2.5 rounded-xl flex items-center justify-between text-red-200 hover:bg-red-900/60 transition-colors"
            >
              <span>Rescue 1122 Swabi:</span>
              <strong className="text-white font-mono text-sm">1122</strong>
            </a>
            <a
              href="tel:0938280214"
              className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex items-center justify-between text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <span>BKMC Shahmansoor:</span>
              <strong className="text-white font-mono">0938-280214</strong>
            </a>
            <a
              href="tel:0938221144"
              className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex items-center justify-between text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <span>DHQ Hospital Swabi:</span>
              <strong className="text-white font-mono">0938-221144</strong>
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Legal */}
      <div className="border-t border-slate-900 py-6 px-4 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Swabi Heroes Blood Network (صوابۍ وینه بخښونکي). Dedicated to saving lives in Swabi, KP, Pakistan.</p>
      </div>
    </footer>
  );
};
