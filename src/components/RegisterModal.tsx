'use client';

import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { BloodGroup, Tehsil } from '../types';
import { 
  X, 
  User, 
  MapPin, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  Check, 
  Droplet, 
  Heart, 
  CheckCircle2, 
  Loader2,
  LogIn
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'register' | 'signin';
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const TEHSILS: { key: Tehsil; label: string }[] = [
  { key: 'Swabi', label: 'Tehsil Swabi' },
  { key: 'Topi', label: 'Tehsil Topi' },
  { key: 'Razzar', label: 'Tehsil Razzar' },
  { key: 'Chota Lahor', label: 'Tehsil Chota Lahor' }
];

export const RegisterModal: React.FC<RegisterModalProps> = ({ 
  isOpen, 
  onClose,
  initialTab = 'register'
}) => {
  const { saveProfile, signIn } = useData();
  const [activeTab, setActiveTab] = useState<'register' | 'signin'>(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Register Form State
  const [formData, setFormData] = useState({
    fullName: '',
    bloodGroup: 'O+' as BloodGroup,
    tehsil: 'Swabi' as Tehsil,
    villageOrArea: '',
    isDonor: true,
    email: '',
    phoneNumber: '',
    password: ''
  });

  // Sign In Form State
  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  if (!isOpen) return null;

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your Full Name (پوره نوم).');
      return;
    }
    if (!formData.villageOrArea.trim()) {
      setErrorMessage('Please enter your Village / Town / Union Council.');
      return;
    }
    if (!formData.phoneNumber.trim()) {
      setErrorMessage('Please enter your Mobile Number (موبایل نمبر).');
      return;
    }

    setIsSubmitting(true);
    try {
      await saveProfile({
        fullName: formData.fullName.trim(),
        bloodGroup: formData.bloodGroup,
        role: formData.isDonor ? 'DONOR' : 'ACCEPTER',
        tehsil: formData.tehsil,
        villageOrArea: formData.villageOrArea.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        whatsappNumber: formData.phoneNumber.trim(),
        email: formData.email.trim(),
        password: formData.password,
        isDonor: formData.isDonor,
        isAvailable: true,
        totalDonations: formData.isDonor ? 1 : 0,
        notes: `Registered from ${formData.villageOrArea.trim()}, Tehsil ${formData.tehsil}.`
      });

      setSuccessMessage('Welcome to Swabi Heroes Hub! Your account is registered.');
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 2200);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!signInIdentifier.trim()) {
      setErrorMessage('Please enter your Email Address or Mobile Number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const profile = await signIn(signInIdentifier.trim(), signInPassword);
      setSuccessMessage(`Welcome back, ${profile.fullName}! You are signed in.`);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1800);
    } catch (err: any) {
      setErrorMessage(err.message || 'Sign In failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0b1324] border border-slate-800/90 rounded-[28px] w-full max-w-md overflow-hidden shadow-2xl relative text-white max-h-[92vh] flex flex-col">
        
        {/* Top Header */}
        <div className="px-5 pt-5 pb-3 flex items-start justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            {/* Droplet Badge Icon */}
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-red-500 flex items-center justify-center shadow-lg shadow-red-950/80 border border-red-400/30 shrink-0">
              <Droplet className="w-6 h-6 text-white fill-white/30" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-white tracking-tight leading-snug">
                Join Swabi Heroes Hub
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Register once to stay permanently logged in on your phone
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors shrink-0 ml-2"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 py-2 shrink-0">
          <div className="bg-[#060b17] p-1 rounded-2xl flex items-center gap-1 border border-slate-800/80">
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all text-center ${
                activeTab === 'register'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950/70'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Register / Join (رجسټر)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('signin');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all text-center ${
                activeTab === 'signin'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950/70'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In (ننوتل)
            </button>
          </div>
        </div>

        {/* Error / Success Alerts */}
        {errorMessage && (
          <div className="mx-5 my-1.5 p-3 rounded-xl bg-red-950/80 border border-red-700/60 text-red-200 text-xs flex items-center justify-between shrink-0 animate-in slide-in-from-top-1">
            <span>{errorMessage}</span>
            <button onClick={() => setErrorMessage(null)} className="text-red-400 hover:text-red-200 ml-2">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-5 pt-2 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
          {successMessage ? (
            <div className="py-8 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Success!</h3>
              <p className="text-sm text-slate-300 max-w-xs mx-auto">
                {successMessage}
              </p>
            </div>
          ) : activeTab === 'register' ? (
            /* ================= REGISTER FORM ================= */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Full Name (پوره نوم) <span className="text-red-500">*</span>
                </label>
                <div className="bg-[#070c18] border border-slate-800 rounded-xl px-3 py-2.5 flex items-center gap-2.5 focus-within:border-red-500/80 focus-within:ring-1 focus-within:ring-red-500 transition-all">
                  <User className="w-4 h-4 text-slate-500 shrink-0" />
                  <input
                    type="text"
                    placeholder="e.g. Asad Khan Yousafzai"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="bg-transparent w-full text-xs sm:text-sm text-white placeholder-slate-500 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Blood Group (د وينې ګروپ) <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {BLOOD_GROUPS.map((bg) => {
                    const isSelected = formData.bloodGroup === bg;
                    return (
                      <button
                        key={bg}
                        type="button"
                        onClick={() => setFormData({ ...formData, bloodGroup: bg })}
                        className={`py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                          isSelected
                            ? 'bg-red-600 text-white shadow-lg shadow-red-950/80 border border-red-500 transform scale-[1.02]'
                            : 'bg-[#080e1d] hover:bg-slate-800/90 border border-slate-800/90 text-slate-200'
                        }`}
                      >
                        {bg}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tehsil in Swabi */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Tehsil in Swabi (تحصیل) <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TEHSILS.map((t) => {
                    const isSelected = formData.tehsil === t.key;
                    return (
                      <button
                        key={t.key}
                        type="button"
                        onClick={() => setFormData({ ...formData, tehsil: t.key })}
                        className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm text-left transition-all font-semibold ${
                          isSelected
                            ? 'bg-[#2a1015] border border-red-500/90 text-white font-bold shadow-sm shadow-red-950/40'
                            : 'bg-[#080e1d] hover:bg-slate-800 border border-slate-800/90 text-slate-300'
                        }`}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Village / Town / Union Council */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Village / Town / Union Council <span className="text-red-500">*</span>
                </label>
                <div className="bg-[#070c18] border border-slate-800 rounded-xl px-3 py-2.5 flex items-center gap-2.5 focus-within:border-red-500/80 focus-within:ring-1 focus-within:ring-red-500 transition-all">
                  <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                  <input
                    type="text"
                    placeholder="e.g. Shahmansoor, Kalu Khan, Maini..."
                    value={formData.villageOrArea}
                    onChange={(e) => setFormData({ ...formData, villageOrArea: e.target.value })}
                    className="bg-transparent w-full text-xs sm:text-sm text-white placeholder-slate-500 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Active Blood Donor Checkbox */}
              <div 
                onClick={() => setFormData({ ...formData, isDonor: !formData.isDonor })}
                className="bg-[#070c18] border border-slate-800 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:border-slate-700 transition-colors"
              >
                <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 transition-colors ${
                  formData.isDonor 
                    ? 'bg-red-600 text-white shadow-sm shadow-red-900/60' 
                    : 'border border-slate-700 bg-slate-900'
                }`}>
                  {formData.isDonor && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <span className="text-xs sm:text-sm text-slate-200 font-medium select-none">
                  List me as an Active Blood Donor for Swabi patients
                </span>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Email Address (برېښناليک) <span className="text-red-500">*</span>
                </label>
                <div className="bg-[#070c18] border border-slate-800 rounded-xl px-3 py-2.5 flex items-center gap-2.5 focus-within:border-red-500/80 focus-within:ring-1 focus-within:ring-red-500 transition-all">
                  <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                  <input
                    type="email"
                    placeholder="e.g. sherazkhan801@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-transparent w-full text-xs sm:text-sm text-white placeholder-slate-500 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Mobile Number (موبایل نمبر) <span className="text-red-500">*</span>
                </label>
                <div className="bg-[#070c18] border border-slate-800 rounded-xl px-3 py-2.5 flex items-center gap-2.5 focus-within:border-red-500/80 focus-within:ring-1 focus-within:ring-red-500 transition-all">
                  <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                  <input
                    type="tel"
                    placeholder="0312-XXXXXXX"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="bg-transparent w-full text-xs sm:text-sm text-white placeholder-slate-500 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Password (پټ نوم) <span className="text-red-500">*</span>
                </label>
                <div className="bg-[#070c18] border border-slate-800 rounded-xl px-3 py-2.5 flex items-center gap-2.5 focus-within:border-red-500/80 focus-within:ring-1 focus-within:ring-red-500 transition-all">
                  <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="bg-transparent w-full text-xs sm:text-sm text-white placeholder-slate-500 outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-500 hover:text-slate-300 transition-colors p-0.5"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-red-950 flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base transition-all active:scale-[0.99]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 fill-white" />
                      <span>Create Account / Join Network</span>
                    </>
                  )}
                </button>
              </div>

              {/* Switch to Sign In footer */}
              <p className="text-center text-xs text-slate-400 pt-1">
                Already registered in Swabi Heroes?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('signin');
                    setErrorMessage(null);
                  }}
                  className="text-red-400 hover:text-red-300 font-bold underline underline-offset-2"
                >
                  Sign In (ننوتل)
                </button>
              </p>
            </form>
          ) : (
            /* ================= SIGN IN FORM ================= */
            <form onSubmit={handleSignInSubmit} className="space-y-4 pt-2">
              
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Email or Mobile Number (برېښناليک يا موبایل نمبر) <span className="text-red-500">*</span>
                </label>
                <div className="bg-[#070c18] border border-slate-800 rounded-xl px-3 py-2.5 flex items-center gap-2.5 focus-within:border-red-500/80 focus-within:ring-1 focus-within:ring-red-500 transition-all">
                  <User className="w-4 h-4 text-slate-500 shrink-0" />
                  <input
                    type="text"
                    placeholder="Enter email or 0300-XXXXXXX"
                    value={signInIdentifier}
                    onChange={(e) => setSignInIdentifier(e.target.value)}
                    className="bg-transparent w-full text-xs sm:text-sm text-white placeholder-slate-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Password (پټ نوم)
                </label>
                <div className="bg-[#070c18] border border-slate-800 rounded-xl px-3 py-2.5 flex items-center gap-2.5 focus-within:border-red-500/80 focus-within:ring-1 focus-within:ring-red-500 transition-all">
                  <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password (if set)"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    className="bg-transparent w-full text-xs sm:text-sm text-white placeholder-slate-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-500 hover:text-slate-300 transition-colors p-0.5"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-red-950 flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base transition-all active:scale-[0.99]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Sign In (ننوتل)</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-center text-xs text-slate-400 pt-1">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setErrorMessage(null);
                  }}
                  className="text-red-400 hover:text-red-300 font-bold underline underline-offset-2"
                >
                  Register / Join (رجسټر)
                </button>
              </p>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
