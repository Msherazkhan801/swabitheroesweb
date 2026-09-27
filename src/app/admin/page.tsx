'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useData } from '../../context/DataContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { 
  Donor, 
  BloodRequest, 
  UserProfile, 
  BloodGroup, 
  Tehsil, 
  RequestStatus 
} from '../../types';
import { DonorEditModal } from './components/DonorEditModal';
import { RequestEditModal } from './components/RequestEditModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { WhatsAppBroadcastModal } from './components/WhatsAppBroadcastModal';
import { 
  ShieldCheck, 
  Users, 
  Heart, 
  AlertTriangle, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Phone, 
  MessageCircle, 
  CheckCircle2, 
  XCircle, 
  Download, 
  Radio, 
  LogOut, 
  Lock, 
  Sparkles, 
  Building2, 
  MapPin, 
  Eye, 
  Share2, 
  RefreshCw,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

type AdminTab = 'donors' | 'requests' | 'users' | 'broadcast';

export default function AdminPage() {
  const { 
    donors, 
    requests, 
    users, 
    loading, 
    isLive, 
    addDonor, 
    updateDonor, 
    deleteDonor, 
    toggleDonorAvailability, 
    toggleDonorVerification, 
    updateRequest, 
    deleteRequest, 
    setRequestStatus, 
    deleteUser,
    refreshData 
  } = useData();

  const { isAdmin, adminName, login, logout } = useAdminAuth();

  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('donors');

  // Search & Filters for Donors
  const [donorSearch, setDonorSearch] = useState('');
  const [donorBloodFilter, setDonorBloodFilter] = useState<string>('ALL');
  const [donorTehsilFilter, setDonorTehsilFilter] = useState<string>('ALL');
  const [donorAvailabilityFilter, setDonorAvailabilityFilter] = useState<'ALL' | 'AVAILABLE' | 'UNAVAILABLE'>('ALL');

  // Search & Filters for Requests
  const [requestSearch, setRequestSearch] = useState('');
  const [requestStatusFilter, setRequestStatusFilter] = useState<'ALL' | 'ACTIVE' | 'FULFILLED' | 'CANCELLED'>('ALL');

  // Modals state
  const [isDonorModalOpen, setIsDonorModalOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'donor' | 'request' | 'user';
    id: string;
    name: string;
  } | null>(null);

  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(passcode)) {
      setPasscodeError('');
    } else {
      setPasscodeError('Invalid Admin Passcode. Try: swabiadmin or swabiheroes2026');
    }
  };

  // Stats calculations
  const totalDonors = donors.length;
  const availableDonors = donors.filter(d => d.isAvailable).length;
  const activeSOSCount = requests.filter(r => r.status === 'ACTIVE').length;
  const fulfilledCount = requests.filter(r => r.status === 'FULFILLED').length;
  const totalUsers = users.length;

  // Filtered Donors
  const filteredDonors = donors.filter(d => {
    const matchesSearch = 
      d.fullName.toLowerCase().includes(donorSearch.toLowerCase()) ||
      d.phoneNumber.includes(donorSearch) ||
      d.villageOrArea.toLowerCase().includes(donorSearch.toLowerCase());
    const matchesBlood = donorBloodFilter === 'ALL' || d.bloodGroup === donorBloodFilter;
    const matchesTehsil = donorTehsilFilter === 'ALL' || d.tehsil === donorTehsilFilter;
    const matchesAvail = 
      donorAvailabilityFilter === 'ALL' ||
      (donorAvailabilityFilter === 'AVAILABLE' && d.isAvailable) ||
      (donorAvailabilityFilter === 'UNAVAILABLE' && !d.isAvailable);

    return matchesSearch && matchesBlood && matchesTehsil && matchesAvail;
  });

  // Filtered Requests
  const filteredRequests = requests.filter(r => {
    const matchesSearch = 
      r.patientName.toLowerCase().includes(requestSearch.toLowerCase()) ||
      r.hospitalName.toLowerCase().includes(requestSearch.toLowerCase()) ||
      r.contactPhone.includes(requestSearch);
    const matchesStatus = requestStatusFilter === 'ALL' || r.status === requestStatusFilter;

    return matchesSearch && matchesStatus;
  });

  // Export Donors to CSV
  const exportDonorsCSV = () => {
    const headers = ['Full Name', 'Blood Group', 'Tehsil', 'Village/Area', 'Phone Number', 'WhatsApp', 'Age', 'Gender', 'Available', 'Verified', 'Donations Count', 'Created At'];
    const rows = donors.map(d => [
      `"${d.fullName}"`,
      d.bloodGroup,
      d.tehsil,
      `"${d.villageOrArea}"`,
      d.phoneNumber,
      d.whatsappNumber || d.phoneNumber,
      d.age,
      d.gender,
      d.isAvailable ? 'Yes' : 'No',
      d.isVerified ? 'Yes' : 'No',
      d.totalDonations,
      d.createdAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Swabi_Heroes_Donors_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Safe Delete Executor
  const handleExecuteDelete = async () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'donor') {
      await deleteDonor(deleteTarget.id);
    } else if (deleteTarget.type === 'request') {
      await deleteRequest(deleteTarget.id);
    } else if (deleteTarget.type === 'user') {
      await deleteUser(deleteTarget.id);
    }
  };

  // 1. If not authenticated, show modern Admin Login Screen
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-white">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 w-full max-w-md shadow-2xl space-y-6">
          <div className="text-center space-y-3">
            <div className="relative w-16 h-16 mx-auto rounded-2xl overflow-hidden shadow-xl border border-red-500/40 bg-slate-800">
              <Image src="/logo.png" alt="Swabi Heroes" fill className="object-cover" priority />
            </div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-red-500 to-amber-300 bg-clip-text text-transparent">
              Swabi Heroes Admin Portal
            </h1>
            <p className="text-xs text-slate-400">
              Authorized access to manage donors, SOS emergencies, and users across Swabi district.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Admin Passcode / Master Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter passcode (e.g. shezihere)"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm font-mono"
                  required
                />
                <Lock className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
              </div>
              {passcodeError && (
                <p className="text-xs text-red-400 mt-2 font-medium">{passcodeError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-950 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <ShieldCheck className="w-5 h-5" />
              Unlock Admin Dashboard
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
              ← Return to Public Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Authenticated Admin Dashboard
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Admin Bar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-slate-800 border border-red-500/30">
                <Image src="/logo.png" alt="Swabi Heroes" fill className="object-cover" />
              </div>
              <div>
                <span className="font-black text-base text-white tracking-tight">SWABI HEROES</span>
                <span className="ml-2 bg-red-600/30 text-red-300 text-[10px] font-bold px-2 py-0.5 rounded border border-red-500/40 uppercase">
                  Admin Panel
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-300 font-medium">Firestore Live Sync</span>
            </div>

            <button
              onClick={() => refreshData()}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <Link
              href="/"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
            >
              <Eye className="w-3.5 h-3.5 text-sky-400" />
              View Site
            </Link>

            <button
              onClick={logout}
              className="bg-red-950/60 hover:bg-red-900 border border-red-800/60 text-red-200 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 w-full">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold uppercase">Total Donors</span>
              <Users className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl font-black text-white mt-2">{totalDonors}</div>
            <div className="text-[11px] text-emerald-400 mt-1 font-medium">{availableDonors} Available Now</div>
          </div>

          <div className="bg-slate-900/80 border border-red-600/40 rounded-2xl p-4 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs text-red-300 font-semibold uppercase">Active SOS</span>
              <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
            </div>
            <div className="text-2xl font-black text-red-400 mt-2">{activeSOSCount} Cases</div>
            <div className="text-[11px] text-red-300 mt-1 font-medium">Urgent Blood Required</div>
          </div>

          <div className="bg-slate-900/80 border border-emerald-800/40 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-400 font-semibold uppercase">Fulfilled Cases</span>
              <Heart className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
            </div>
            <div className="text-2xl font-black text-white mt-2">{fulfilledCount}</div>
            <div className="text-[11px] text-emerald-300 mt-1 font-medium">Lives Saved in Swabi</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold uppercase">App Users</span>
              <ShieldCheck className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-black text-white mt-2">{totalUsers}</div>
            <div className="text-[11px] text-slate-400 mt-1 font-medium">Synced Mobile Users</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm col-span-2 lg:col-span-1 flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase">Quick Broadcast</span>
            <button
              onClick={() => setIsBroadcastModalOpen(true)}
              className="mt-2 bg-green-600 hover:bg-green-500 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Alert
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('donors')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
              activeTab === 'donors'
                ? 'bg-red-600 text-white shadow-md shadow-red-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            Manage Donors ({totalDonors})
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
              activeTab === 'requests'
                ? 'bg-red-600 text-white shadow-md shadow-red-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            SOS Blood Requests ({requests.length})
            {activeSOSCount > 0 && (
              <span className="bg-white text-red-600 text-xs px-1.5 rounded-full font-black">
                {activeSOSCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
              activeTab === 'users'
                ? 'bg-red-600 text-white shadow-md shadow-red-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            App Users ({totalUsers})
          </button>
        </div>

        {/* TAB 1: DONORS MANAGEMENT */}
        {activeTab === 'donors' && (
          <div className="space-y-4">
            {/* Filter & Action Toolbar */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
              
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto flex-1">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search by name, phone, or village..."
                    value={donorSearch}
                    onChange={(e) => setDonorSearch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:border-red-500"
                  />
                </div>

                {/* Blood Filter */}
                <select
                  value={donorBloodFilter}
                  onChange={(e) => setDonorBloodFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold"
                >
                  <option value="ALL">All Blood Groups</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>

                {/* Tehsil Filter */}
                <select
                  value={donorTehsilFilter}
                  onChange={(e) => setDonorTehsilFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="ALL">All Tehsils</option>
                  {['Swabi', 'Topi', 'Razzar', 'Chota Lahor'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>

                {/* Availability Filter */}
                <select
                  value={donorAvailabilityFilter}
                  onChange={(e) => setDonorAvailabilityFilter(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="ALL">All Status</option>
                  <option value="AVAILABLE">Available Only</option>
                  <option value="UNAVAILABLE">Unavailable</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <button
                  onClick={exportDonorsCSV}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2 px-3 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>

                <button
                  onClick={() => {
                    setSelectedDonor(null);
                    setIsDonorModalOpen(true);
                  }}
                  className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-1.5 shadow-md transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Donor
                </button>
              </div>
            </div>

            {/* Donors Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Donor</th>
                      <th className="p-3.5">Blood</th>
                      <th className="p-3.5">Location</th>
                      <th className="p-3.5">Contact</th>
                      <th className="p-3.5 text-center">Status</th>
                      <th className="p-3.5 text-center">Badges</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredDonors.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-10 text-slate-500">
                          No donors found matching the current filters.
                        </td>
                      </tr>
                    ) : (
                      filteredDonors.map((donor) => (
                        <tr key={donor.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3.5">
                            <div className="font-bold text-white text-sm">{donor.fullName}</div>
                            <div className="text-[11px] text-slate-400">{donor.gender}, {donor.age} yrs • {donor.totalDonations} donations</div>
                          </td>
                          <td className="p-3.5">
                            <span className="bg-red-600/20 text-red-300 border border-red-500/40 font-black px-2.5 py-1 rounded-lg text-xs">
                              {donor.bloodGroup}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <div className="font-semibold text-white">{donor.villageOrArea}</div>
                            <div className="text-[11px] text-slate-400">{donor.tehsil}</div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-mono text-white">{donor.phoneNumber}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <a href={`tel:${donor.phoneNumber}`} className="text-emerald-400 hover:underline flex items-center gap-0.5 text-[10px]">
                                <Phone className="w-2.5 h-2.5" /> Call
                              </a>
                              <a 
                                href={`https://wa.me/${(donor.whatsappNumber || donor.phoneNumber).replace(/[^0-9]/g, '')}`} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-400 hover:underline flex items-center gap-0.5 text-[10px]"
                              >
                                <MessageCircle className="w-2.5 h-2.5" /> WA
                              </a>
                            </div>
                          </td>
                          <td className="p-3.5 text-center">
                            <button
                              onClick={() => toggleDonorAvailability(donor.id)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                                donor.isAvailable
                                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700 hover:bg-emerald-900'
                                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                              }`}
                              title="Click to toggle availability"
                            >
                              {donor.isAvailable ? '✓ Available' : '✗ Busy'}
                            </button>
                          </td>
                          <td className="p-3.5 text-center">
                            <button
                              onClick={() => toggleDonorVerification(donor.id)}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                                donor.isVerified
                                  ? 'bg-sky-950 text-sky-300 border-sky-700'
                                  : 'bg-slate-800 text-slate-500 border-slate-700'
                              }`}
                              title="Click to toggle verified badge"
                            >
                              {donor.isVerified ? '🛡️ Verified' : 'Unverified'}
                            </button>
                          </td>
                          <td className="p-3.5 text-right space-x-1">
                            <button
                              onClick={() => {
                                setSelectedDonor(donor);
                                setIsDonorModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                              title="Edit Donor"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setDeleteTarget({
                                  type: 'donor',
                                  id: donor.id,
                                  name: `${donor.fullName} (${donor.bloodGroup})`
                                });
                                setIsDeleteModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 hover:text-white"
                              title="Delete Donor"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SOS BLOOD REQUESTS */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto flex-1">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search by patient, hospital, or phone..."
                    value={requestSearch}
                    onChange={(e) => setRequestSearch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:border-red-500"
                  />
                </div>

                <select
                  value={requestStatusFilter}
                  onChange={(e) => setRequestStatusFilter(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold"
                >
                  <option value="ALL">All Request Statuses</option>
                  <option value="ACTIVE">🔴 Active SOS Only</option>
                  <option value="FULFILLED">🟢 Fulfilled Cases</option>
                  <option value="CANCELLED">⚪ Cancelled</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsBroadcastModalOpen(true)}
                  className="bg-green-600 hover:bg-green-500 text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center gap-1.5 shadow"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  WhatsApp Broadcast
                </button>
              </div>
            </div>

            {/* Requests Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRequests.map((req) => (
                <div
                  key={req.id}
                  className={`bg-slate-900 border rounded-2xl p-4 flex flex-col justify-between space-y-3 ${
                    req.status === 'ACTIVE'
                      ? 'border-red-600/60 shadow-md shadow-red-950/20'
                      : req.status === 'FULFILLED'
                      ? 'border-emerald-800/40 opacity-80'
                      : 'border-slate-800 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded-lg">
                          {req.bloodGroup}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">
                          {req.unitsNeeded} {req.unitsNeeded === 1 ? 'Unit' : 'Units'}
                        </span>
                      </div>

                      <select
                        value={req.status}
                        onChange={(e) => setRequestStatus(req.id, e.target.value as RequestStatus)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg border uppercase ${
                          req.status === 'ACTIVE'
                            ? 'bg-red-950 text-red-300 border-red-700'
                            : req.status === 'FULFILLED'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        <option value="ACTIVE">🔴 Active</option>
                        <option value="FULFILLED">🟢 Fulfilled</option>
                        <option value="CANCELLED">⚪ Cancelled</option>
                      </select>
                    </div>

                    <h4 className="font-bold text-white text-sm">{req.patientName}</h4>
                    <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-sky-400" />
                      {req.hospitalName} ({req.tehsil})
                    </p>
                    <p className="text-xs text-slate-400 mt-1 italic">&ldquo;{req.reason}&rdquo;</p>
                    <p className="text-xs text-slate-400 mt-1 font-mono">
                      Attendant: {req.contactPerson} ({req.contactPhone})
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <a href={`tel:${req.contactPhone}`} className="text-emerald-400 hover:underline text-xs flex items-center gap-1">
                        <Phone className="w-3 h-3" /> Call
                      </a>
                      <a 
                        href={`https://wa.me/${(req.whatsappNumber || req.contactPhone).replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 hover:underline text-xs flex items-center gap-1"
                      >
                        <MessageCircle className="w-3 h-3" /> WhatsApp
                      </a>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setSelectedRequest(req);
                          setIsRequestModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="Edit Request"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteTarget({
                            type: 'request',
                            id: req.id,
                            name: `SOS Request: ${req.patientName} (${req.bloodGroup})`
                          });
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 hover:text-white"
                        title="Delete Request"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: APP USERS MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <h3 className="font-bold text-white text-sm">Synced User Accounts ({totalUsers})</h3>
              <p className="text-xs text-slate-400">Accounts created across Swabi Heroes mobile app & web</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">User</th>
                    <th className="p-3.5">Contact</th>
                    <th className="p-3.5">Blood Group</th>
                    <th className="p-3.5">Location</th>
                    <th className="p-3.5">Donor Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-500">
                        No registered users yet.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.uid} className="hover:bg-slate-800/40">
                        <td className="p-3.5">
                          <div className="font-bold text-white">{u.fullName}</div>
                          <div className="text-[11px] text-slate-400">{u.email}</div>
                        </td>
                        <td className="p-3.5 font-mono text-white">{u.phoneNumber || 'N/A'}</td>
                        <td className="p-3.5 font-bold text-red-400">{u.bloodGroup}</td>
                        <td className="p-3.5">{u.villageOrArea}, {u.tehsil}</td>
                        <td className="p-3.5">
                          {u.role === 'DONOR' || (u.isDonor && u.role !== 'BOTH' && u.role !== 'ACCEPTER') ? (
                            <span className="bg-emerald-950 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">
                              🩸 Registered Donor
                            </span>
                          ) : u.role === 'ACCEPTER' ? (
                            <span className="bg-rose-950 text-rose-300 border border-rose-700 px-2 py-0.5 rounded text-[10px] font-bold">
                              🏥 Blood Accepter
                            </span>
                          ) : u.role === 'BOTH' ? (
                            <span className="bg-purple-950 text-purple-300 border border-purple-700 px-2 py-0.5 rounded text-[10px] font-bold">
                              🤝 Donor & Accepter
                            </span>
                          ) : (
                            <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-[10px]">
                              General User
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => {
                              setDeleteTarget({
                                type: 'user',
                                id: u.uid,
                                name: `User: ${u.fullName} (${u.email})`
                              });
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300"
                            title="Remove User Account"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* MODALS */}
      <DonorEditModal
        isOpen={isDonorModalOpen}
        donor={selectedDonor}
        onClose={() => setIsDonorModalOpen(false)}
        onSave={async (data) => {
          if (selectedDonor) {
            await updateDonor(selectedDonor.id, data);
          } else {
            await addDonor(data as any);
          }
        }}
      />

      <RequestEditModal
        isOpen={isRequestModalOpen}
        request={selectedRequest}
        onClose={() => setIsRequestModalOpen(false)}
        onSave={async (data) => {
          if (selectedRequest) {
            await updateRequest(selectedRequest.id, data);
          }
        }}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        title="Confirm Firestore Deletion"
        message="Are you sure you want to permanently delete this item from the database? This action cannot be undone."
        itemIdentifier={deleteTarget?.name}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleExecuteDelete}
      />

      <WhatsAppBroadcastModal
        isOpen={isBroadcastModalOpen}
        requests={requests}
        donors={donors}
        onClose={() => setIsBroadcastModalOpen(false)}
      />
    </div>
  );
}
