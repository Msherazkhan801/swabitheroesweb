'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useData } from '../context/DataContext';
import { SOSTicker } from '../components/SOSTicker';
import { Navbar } from '../components/Navbar';
import { DonorCard } from '../components/DonorCard';
import { SOSCard } from '../components/SOSCard';
import { HospitalDirectory } from '../components/HospitalDirectory';
import { Footer } from '../components/Footer';
import { RequestBloodModal } from '../components/RequestBloodModal';
import { RegisterModal } from '../components/RegisterModal';
import { UserProfileModal } from '../components/UserProfileModal';
import { BloodGroup, Tehsil, UserRole } from '../types';
import { 
  Search, 
  Heart, 
  AlertTriangle, 
  MapPin, 
  Users, 
  ShieldCheck, 
  Activity, 
  CheckCircle2, 
  Sparkles, 
  Droplet, 
  PhoneCall, 
  ArrowRight,
  Filter,
  User,
  Check
} from 'lucide-react';

const BLOOD_GROUPS: (BloodGroup | 'ALL')[] = ['ALL', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const TEHSILS: (Tehsil | 'ALL')[] = ['ALL', 'Swabi', 'Topi', 'Razzar', 'Chota Lahor'];

export default function HomePage() {
  const { donors, requests, currentProfile, loading } = useData();

  // Modals state
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Filters
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<BloodGroup | 'ALL'>('ALL');
  const [selectedTehsil, setSelectedTehsil] = useState<Tehsil | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(true);

  // Active requests
  const activeRequests = requests.filter(r => r.status === 'ACTIVE');

  // Filtered donors
  const filteredDonors = donors.filter(d => {
    const matchesBlood = selectedBloodGroup === 'ALL' || d.bloodGroup === selectedBloodGroup;
    const matchesTehsil = selectedTehsil === 'ALL' || d.tehsil === selectedTehsil;
    const matchesSearch = 
      d.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.villageOrArea.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.phoneNumber.includes(searchQuery);
    const matchesAvailability = !onlyAvailable || d.isAvailable;

    return matchesBlood && matchesTehsil && matchesSearch && matchesAvailability;
  });

  const availableDonorsCount = donors.filter(d => d.isAvailable).length;

  const handleOpenRegister = () => {
    setIsRegisterModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      {/* Live SOS Emergency Ticker */}
      <SOSTicker onRequestClick={() => setIsRequestModalOpen(true)} />

      {/* Main Navigation */}
      <Navbar 
        onRequestBloodClick={() => setIsRequestModalOpen(true)}
        onRegisterClick={handleOpenRegister}
        onProfileClick={() => setIsProfileModalOpen(true)}
      />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-900">
          {/* Subtle Ambient Red Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-red-600/15 to-rose-700/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-7">
            
            {/* User Logged In Profile Banner / Community Tag */}
            {currentProfile ? (
              <div 
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-red-950/90 via-slate-900 to-slate-900 border border-red-500/40 px-4 py-2 rounded-2xl shadow-lg cursor-pointer hover:border-red-400 transition-all"
                onClick={() => setIsProfileModalOpen(true)}
              >
                <div className="w-6 h-6 rounded-lg bg-red-600 text-white font-black text-xs flex items-center justify-center">
                  {currentProfile.bloodGroup}
                </div>
                <span className="text-xs text-slate-200">
                  Welcome, <strong className="text-white">{currentProfile.fullName}</strong> • 🩸 Registered Donor
                </span>
                <span className="text-[11px] text-amber-300 underline font-semibold ml-1">
                  My Profile →
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-950/80 to-slate-900 border border-red-500/30 px-4 py-1.5 rounded-full text-xs font-semibold text-red-300 shadow-md">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>Swabi District Official Blood Network • صوابۍ وینه بخښونکي</span>
              </div>
            )}

            {/* Hero Heading */}
            <div className="space-y-4 max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                Save Lives in Swabi. <br />
                <span className="bg-gradient-to-r from-red-500 via-rose-400 to-amber-300 bg-clip-text text-transparent">
                  Find Blood Donors & Post SOS
                </span> in Minutes.
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal">
                Direct, 100% free connection between volunteer blood donors and emergency patients in BKMC Shahmansoor, DHQ Swabi, and THQ Hospitals.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
              <button
                onClick={() => setIsRequestModalOpen(true)}
                className="w-full sm:w-auto bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm sm:text-base px-6 sm:px-8 py-3.5 rounded-2xl shadow-xl shadow-red-950/80 flex items-center justify-center gap-2 transform active:scale-95 transition-all border border-red-400/30"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-white animate-bounce" />
                Post Emergency Blood SOS
              </button>

              <button
                onClick={() => currentProfile ? setIsProfileModalOpen(true) : handleOpenRegister()}
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-emerald-300 font-bold text-sm sm:text-base px-6 sm:px-8 py-3.5 rounded-2xl border border-emerald-500/40 flex items-center justify-center gap-2 transition-all shadow-lg hover:border-emerald-400"
              >
                <Droplet className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                {currentProfile ? 'View My Donor Profile' : 'Register Donor Profile'}
              </button>
            </div>

            {/* Live Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-4">
              <div className="bg-slate-900/60 border border-slate-800/80 p-3.5 sm:p-4 rounded-2xl backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-black text-white">{donors.length}</div>
                <div className="text-xs text-slate-400 font-semibold mt-0.5">Registered Donors</div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800/80 p-3.5 sm:p-4 rounded-2xl backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">{availableDonorsCount}</div>
                <div className="text-xs text-slate-400 font-semibold mt-0.5">Available Right Now</div>
              </div>

              <div className="bg-slate-900/60 border border-red-800/40 p-3.5 sm:p-4 rounded-2xl backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-black text-red-400">{activeRequests.length}</div>
                <div className="text-xs text-red-300 font-semibold mt-0.5">Active SOS Appeals</div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800/80 p-3.5 sm:p-4 rounded-2xl backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-black text-amber-300">4 Tehsils</div>
                <div className="text-xs text-slate-400 font-semibold mt-0.5">100% Free Coverage</div>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 2: LIVE SOS EMERGENCY APPEALS */}
        <section id="sos-requests" className="py-14 bg-slate-950 border-b border-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-red-400">Emergency Response</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-1 flex items-center gap-2">
                  <AlertTriangle className="w-7 h-7 text-red-500 shrink-0" />
                  Live SOS Blood Appeals in Swabi
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Critical patient appeals requiring immediate donors. Contact attendants directly or share on WhatsApp.
                </p>
              </div>

              <button
                onClick={() => setIsRequestModalOpen(true)}
                className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow self-start sm:self-auto flex items-center gap-1.5"
              >
                <Heart className="w-3.5 h-3.5 fill-white" />
                + Post SOS Request
              </button>
            </div>

            {activeRequests.length === 0 ? (
              <div className="bg-slate-900/60 border border-emerald-800/30 rounded-3xl p-10 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/20">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-white">No Critical Blood Requests at this Moment</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Alhamdulillah, all previous emergency cases have been fulfilled. Donors remain on standby across Swabi.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeRequests.map((req) => (
                  <SOSCard key={req.id} request={req} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* SECTION 3: DONOR DIRECTORY WITH LIVE FILTERS */}
        <section id="donors" className="py-14 bg-slate-900/40 border-b border-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            
            {/* Section Header */}
            <div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500 fill-red-500/30" />
                <span className="text-xs font-bold uppercase tracking-wider text-red-400">Swabi Heroes Directory</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Verified Blood Donors ({filteredDonors.length})
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Filter by your required blood group and tehsil for instant direct contact.
              </p>
            </div>

            {/* Filter Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
              
              {/* Blood Group Selector Chips */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Select Required Blood Group:
                </label>
                <div className="flex flex-wrap gap-2">
                  {BLOOD_GROUPS.map((bg) => (
                    <button
                      key={bg}
                      onClick={() => setSelectedBloodGroup(bg)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                        selectedBloodGroup === bg
                          ? 'bg-red-600 text-white shadow-lg shadow-red-950 scale-105 border border-red-400/40'
                          : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      {bg === 'ALL' ? 'All Blood Groups' : bg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Secondary Controls: Tehsil, Search & Availability */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80">
                {/* Search Text */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search village, area, or name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-red-500"
                  />
                </div>

                {/* Tehsil Dropdown */}
                <div>
                  <select
                    value={selectedTehsil}
                    onChange={(e) => setSelectedTehsil(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-red-500"
                  >
                    <option value="ALL">All Tehsils (Swabi, Topi, Razzar, Chota Lahor)</option>
                    <option value="Swabi">Tehsil Swabi</option>
                    <option value="Topi">Tehsil Topi</option>
                    <option value="Razzar">Tehsil Razzar</option>
                    <option value="Chota Lahor">Tehsil Chota Lahor</option>
                  </select>
                </div>

                {/* Availability Toggle */}
                <div className="flex items-center gap-3 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
                  <input
                    type="checkbox"
                    id="onlyAvailable"
                    checked={onlyAvailable}
                    onChange={(e) => setOnlyAvailable(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 bg-slate-900 border-slate-700"
                  />
                  <label htmlFor="onlyAvailable" className="text-xs text-slate-300 font-semibold cursor-pointer">
                    Show Available Donors Only
                  </label>
                </div>
              </div>

            </div>

            {/* Donors Grid */}
            {filteredDonors.length === 0 ? (
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-10 text-center space-y-3">
                <Droplet className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-white">No Donors Found</h3>
                <p className="text-xs text-slate-400">
                  Try adjusting your blood group or Tehsil filter, or post an Emergency SOS request for rapid assistance.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDonors.map((donor) => (
                  <DonorCard key={donor.id} donor={donor} />
                ))}
              </div>
            )}

          </div>
        </section>

        {/* SECTION 4: HOSPITALS & 1122 DIRECTORY */}
        <section id="hospitals" className="py-14 bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <HospitalDirectory />
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <Footer />

      {/* MODALS */}
      <RequestBloodModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onRequestBloodClick={() => setIsRequestModalOpen(true)}
      />
    </div>
  );
}
