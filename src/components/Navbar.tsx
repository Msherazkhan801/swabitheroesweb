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
  PhoneCall, 
  PlusCircle 
} from 'lucide-react';
import { useData } from '../context/DataContext';

interface NavbarProps {
  onRequestBloodClick: () => void;
  onRegisterDonorClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onRequestBloodClick,
  onRegisterDonorClick
}) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { requests } = useData();
  const activeCount = requests.filter(r => r.status === 'ACTIVE').length;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white transition-all shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-md shadow-red-900/30 border border-red-500/30 group-hover:scale-105 transition-transform bg-slate-800">
              <Image 
                src="/logo.png" 
                alt="Swabi Heroes Logo" 
                fill 
                className="object-cover"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight bg-gradient-to-r from-red-500 via-rose-400 to-amber-300 bg-clip-text text-transparent">
                  SWABI HEROES
                </span>
                <span className="hidden sm:inline-block bg-red-600/30 border border-red-500/40 text-red-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Blood Network
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium tracking-wide">
                صوابۍ وینه بخښونکي • Save Lives in Swabi
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              href="/#donors"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                pathname === '/' ? 'text-slate-200 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Search className="w-4 h-4 text-rose-500" />
              Find Donors
            </Link>

            <Link
              href="/#sos-requests"
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1.5"
            >
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span>SOS Cases</span>
              {activeCount > 0 && (
                <span className="bg-red-600 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full animate-pulse">
                  {activeCount}
                </span>
              )}
            </Link>

            <Link
              href="/#hospitals"
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1.5"
            >
              <Building2 className="w-4 h-4 text-sky-400" />
              Hospitals & 1122
            </Link>

            <button
              onClick={onRegisterDonorClick}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 transition-all flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              Become a Donor
            </button>

            <Link
              href="/admin"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                pathname.startsWith('/admin')
                  ? 'bg-red-600 text-white shadow-md shadow-red-900/50'
                  : 'text-amber-300 hover:text-amber-200 hover:bg-amber-950/30'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Portal
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={onRequestBloodClick}
              className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-red-600/30 flex items-center gap-2 transform active:scale-95 transition-all border border-red-400/30"
            >
              <Heart className="w-4 h-4 fill-white animate-bounce" />
              Post Emergency SOS
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onRequestBloodClick}
              className="bg-red-600 text-white font-bold text-xs px-3 py-2 rounded-lg flex items-center gap-1 shadow"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              SOS
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-2">
          <Link
            href="/#donors"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-200 hover:bg-slate-800 font-medium"
          >
            <Search className="w-5 h-5 text-rose-500" />
            Find Blood Donors
          </Link>
          <Link
            href="/#sos-requests"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-200 hover:bg-slate-800 font-medium"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Emergency SOS Requests
            </div>
            {activeCount > 0 && (
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {activeCount}
              </span>
            )}
          </Link>
          <Link
            href="/#hospitals"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-200 hover:bg-slate-800 font-medium"
          >
            <Building2 className="w-5 h-5 text-sky-400" />
            Swabi Hospitals & Rescue 1122
          </Link>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onRegisterDonorClick();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-emerald-400 hover:bg-emerald-950/40 font-medium text-left"
          >
            <UserPlus className="w-5 h-5" />
            Register as a Volunteer Donor
          </button>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-amber-300 hover:bg-amber-950/40 font-medium"
          >
            <ShieldCheck className="w-5 h-5" />
            Admin Management Dashboard
          </Link>
          
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onRequestBloodClick();
              }}
              className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg"
            >
              <Heart className="w-5 h-5 fill-white" />
              Submit Urgent Blood Request
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
