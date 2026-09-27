'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Heart, 
  Search, 
  AlertCircle, 
  Building2, 
  UserPlus, 
  ShieldCheck, 
  Menu, 
  X, 
  User,
  Droplet,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { UserRole } from '../types';

interface NavbarProps {
  onRequestBloodClick: () => void;
  onRegisterClick: () => void;
  onProfileClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onRequestBloodClick,
  onRegisterClick,
  onProfileClick
}) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { requests, currentProfile } = useData();
  const activeCount = requests.filter(r => r.status === 'ACTIVE').length;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white transition-all shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-18 lg:h-20 gap-2">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative w-10 h-10 lg:w-11 lg:h-11 rounded-2xl overflow-hidden shadow-md shadow-red-900/30 border border-red-500/30 group-hover:scale-105 transition-transform bg-slate-800 shrink-0">
              <Image 
                src="/logo.png" 
                alt="Swabi Heroes Logo" 
                fill 
                className="object-cover"
                priority
              />
            </div>
            <div className="shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base lg:text-lg tracking-tight bg-gradient-to-r from-red-500 via-rose-400 to-amber-300 bg-clip-text text-transparent whitespace-nowrap">
                  SWABI HEROES
                </span>
                <span className="hidden xl:inline-block bg-red-600/30 border border-red-500/40 text-red-300 text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider whitespace-nowrap">
                  Blood Network
                </span>
              </div>
              <p className="text-[10px] lg:text-[11px] text-slate-400 font-medium tracking-wide whitespace-nowrap hidden sm:block">
                صوابۍ وینه بخښونکي • Save Lives in Swabi
              </p>
            </div>
          </Link>

          {/* Desktop Navigation - Strictly One-Line */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 xl:gap-2">
            <Link
              href="/#donors"
              className={`px-2 py-1.5 lg:px-2.5 lg:py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                pathname === '/' ? 'text-slate-200 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Search className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-rose-500 shrink-0" />
              <span>Find Donors</span>
            </Link>

            <Link
              href="/#sos-requests"
              className="px-2 py-1.5 lg:px-2.5 lg:py-2 rounded-xl text-xs xl:text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1.5 whitespace-nowrap"
            >
              <AlertCircle className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-red-500 shrink-0" />
              <span>SOS Cases</span>
              {activeCount > 0 && (
                <span className="bg-red-600 text-white text-[10px] lg:text-[11px] font-black px-1.5 py-0.2 rounded-full animate-pulse">
                  {activeCount}
                </span>
              )}
            </Link>

            <Link
              href="/#hospitals"
              className="px-2 py-1.5 lg:px-2.5 lg:py-2 rounded-xl text-xs xl:text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1.5 whitespace-nowrap"
            >
              <Building2 className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-sky-400 shrink-0" />
              <span>Hospitals & 1122</span>
            </Link>

            {/* Profile or Registration Button */}
            {currentProfile ? (
              <button
                onClick={onProfileClick}
                className="px-2.5 py-1.5 rounded-xl text-xs xl:text-sm font-bold bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 text-white transition-all flex items-center gap-2 whitespace-nowrap shadow-sm"
              >
                <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md leading-none">
                  {currentProfile.bloodGroup}
                </span>
                <span className="max-w-[90px] lg:max-w-[120px] truncate">{currentProfile.fullName.split(' ')[0]}</span>
                <span className={`w-2 h-2 rounded-full shrink-0 ${
                  currentProfile.isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                }`} />
              </button>
            ) : (
              <button
                onClick={onRegisterClick}
                className="px-2 py-1.5 lg:px-2.5 lg:py-2 rounded-xl text-xs xl:text-sm font-semibold text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                <UserPlus className="w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0" />
                <span>Join Network</span>
              </button>
            )}
          </nav>

          {/* Action CTA Button */}
          <div className="hidden md:flex items-center shrink-0">
            <button
              onClick={onRequestBloodClick}
              className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs lg:text-xs xl:text-sm px-3 py-2 lg:px-4 lg:py-2.5 rounded-xl shadow-lg shadow-red-600/30 flex items-center gap-1.5 lg:gap-2 transform active:scale-95 transition-all border border-red-400/30 whitespace-nowrap"
            >
              <Heart className="w-3.5 h-3.5 lg:w-4 lg:h-4 fill-white animate-bounce shrink-0" />
              <span>Post Emergency SOS</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2 shrink-0">
            {currentProfile ? (
              <button
                onClick={onProfileClick}
                className="bg-slate-800 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 border border-slate-700"
              >
                <span className="text-red-400 font-black text-[11px]">{currentProfile.bloodGroup}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </button>
            ) : null}

            <button
              onClick={onRequestBloodClick}
              className="bg-red-600 text-white font-bold text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow whitespace-nowrap"
            >
              <Heart className="w-3 h-3 fill-white" />
              <span>SOS</span>
            </button>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-2">
          {currentProfile ? (
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-600/30 text-red-300 flex items-center justify-center font-bold text-xs">
                  {currentProfile.bloodGroup}
                </div>
                <div>
                  <div className="font-bold text-xs text-white">{currentProfile.fullName}</div>
                  <div className="text-[10px] text-emerald-400 font-semibold">
                    🩸 Swabi Hero Donor
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onProfileClick();
                }}
                className="text-xs text-amber-300 font-semibold px-2.5 py-1 bg-slate-800 rounded-lg"
              >
                View Profile
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onRegisterClick();
              }}
              className="w-full p-2.5 bg-emerald-950/60 border border-emerald-800/60 rounded-xl text-left flex items-center justify-between mb-2"
            >
              <div>
                <div className="text-xs font-bold text-emerald-300">🩸 Become a Volunteer Donor</div>
                <div className="text-[10px] text-slate-400">Join Swabi Heroes Network</div>
              </div>
              <UserPlus className="w-4 h-4 text-emerald-400" />
            </button>
          )}

          <Link
            href="/#donors"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-200 hover:bg-slate-800 font-medium text-xs"
          >
            <Search className="w-4 h-4 text-rose-500" />
            Find Blood Donors
          </Link>
          <Link
            href="/#sos-requests"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-200 hover:bg-slate-800 font-medium text-xs"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-red-500" />
              Emergency SOS Requests
            </div>
            {activeCount > 0 && (
              <span className="bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                {activeCount}
              </span>
            )}
          </Link>
          <Link
            href="/#hospitals"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-200 hover:bg-slate-800 font-medium text-xs"
          >
            <Building2 className="w-4 h-4 text-sky-400" />
            Swabi Hospitals & Rescue 1122
          </Link>
          
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-amber-300 hover:bg-amber-950/40 font-medium text-xs"
          >
            <ShieldCheck className="w-4 h-4" />
            Admin Management Dashboard
          </Link>
          
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onRequestBloodClick();
              }}
              className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg text-xs"
            >
              <Heart className="w-4 h-4 fill-white" />
              Submit Urgent Blood Request
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
