import React, { useState } from 'react';
import { useNavigate, useSearchParams, useOutletContext, Link } from 'react-router-dom';
import {
  ShieldCheck,
  User,
  CheckCircle2,
  Lock,
  Phone,
  Mail,
  ArrowRight,
  Sparkles,
  Scale,
  Truck,
  ShoppingBag,
} from 'lucide-react';
import { useAuth, UserRole } from '../context/AuthContext';
import { Language } from '../services/i18n';

interface ContextType {
  lang: Language;
}

export const LoginPage: React.FC = () => {
  const { lang } = useOutletContext<ContextType>();
  const [searchParams] = useSearchParams();
  const initialTab = (searchParams.get('role') as UserRole) || 'farmer';

  const [activeTab, setActiveTab] = useState<UserRole>(initialTab);
  const [phone, setPhone] = useState('+91 98765 43210');
  const [otp, setOtp] = useState('4321');
  const [adminEmail, setAdminEmail] = useState('admin.ghaziabad@mandimatch.gov.in');
  const [adminPass, setAdminPass] = useState('••••••••');
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { loginWithGoogle, loginWithPhone, loginWithAdminCredentials } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      if (activeTab === 'farmer') {
        await loginWithGoogle('farmer', 'Ramesh Kumar', 'ramesh.kumar@farmer.bharat');
        navigate('/dashboard');
      } else {
        await loginWithGoogle('admin', 'Devendra Nath (Agri Officer)', 'admin.krishi@mandimatch.gov.in');
        navigate('/admin');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await loginWithPhone(phone, otp);
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await loginWithAdminCredentials(adminEmail, adminPass);
      navigate('/admin');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-6 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Apple Segmented Switcher for Farmer vs Admin */}
        <div className="flex bg-black/[0.04] p-1 rounded-2xl border border-black/[0.04] text-xs shadow-apple-sm">
          <button
            onClick={() => setActiveTab('farmer')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'farmer'
                ? 'bg-white text-neutral-900 shadow-apple-sm'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <User className="w-3.5 h-3.5 text-forest-700" />
            <span>{lang === 'hi' ? 'किसान / विक्रेता लॉगिन' : 'Farmer / Seller Login'}</span>
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'admin'
                ? 'bg-white text-neutral-900 shadow-apple-sm'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-forest-700" />
            <span>{lang === 'hi' ? 'अधिकारी / एडमिन पोर्टल' : 'Admin Portal'}</span>
          </button>
        </div>

        {/* Main Apple HIG Card */}
        <div className="bg-white/85 backdrop-blur-2xl rounded-[32px] border border-black/[0.08] shadow-apple-modal p-6 sm:p-8 space-y-6">
          {/* Card Header */}
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 rounded-2xl bg-forest-900 text-white flex items-center justify-center mx-auto shadow-apple-sm">
              {activeTab === 'farmer' ? (
                <span className="text-2xl">🌾</span>
              ) : (
                <ShieldCheck className="w-6 h-6 text-harvest" />
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
              {activeTab === 'farmer'
                ? lang === 'hi' ? 'किसान लॉगिन' : 'Farmer Sign In'
                : lang === 'hi' ? 'मंडी अधिकारी लॉगिन' : 'Mandi Administrator Sign In'}
            </h1>
            <p className="text-xs text-neutral-500 font-normal">
              {activeTab === 'farmer'
                ? lang === 'hi'
                  ? 'अपनी फसल का सर्वोत्तम भाव और शुद्ध मुनाफा जानें'
                  : 'Access transparent net returns, transport pooling & buyer offers'
                : lang === 'hi'
                  ? 'मंडी भाव व FPO खरीदार रिकॉर्ड प्रबंधित करें'
                  : 'Manage simulated price bulletins, fleet registers, and tenders'}
            </p>
          </div>

          {/* 1. Primary Action: Google Sign In Button */}
          <div className="space-y-3">
            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-full bg-white hover:bg-neutral-50 active:scale-98 text-neutral-800 text-xs font-semibold border border-black/[0.12] shadow-apple-sm transition-all group"
            >
              {/* Official Google Vector Logo */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>
                {googleLoading
                  ? 'Connecting to Google...'
                  : activeTab === 'farmer'
                  ? 'Continue with Google'
                  : 'Sign in with Google Workspace'}
              </span>
            </button>

            {/* Quick 1-Click Demo Shortcut */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-full bg-forest-50 hover:bg-forest-100/70 text-forest-900 text-[11px] font-semibold border border-forest-200/80 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-harvest" />
              <span>
                {activeTab === 'farmer'
                  ? 'Quick Demo: Login as Ramesh Kumar (Ghaziabad)'
                  : 'Quick Demo: Login as Devendra Nath (Officer)'}
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-black/[0.08] w-full" />
            <span className="bg-white px-3 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider absolute">
              {lang === 'hi' ? 'या पासवर्ड / OTP से' : 'Or credentials'}
            </span>
          </div>

          {/* 2. Alternative: Phone OTP for Farmer OR Email/Password for Admin */}
          {activeTab === 'farmer' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                  Mobile Number (मोबाइल नंबर)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl pl-9 pr-3 py-2 text-neutral-900 font-medium focus:outline-none focus:ring-2 focus:ring-forest-700/20"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                    One Time Password (OTP)
                  </label>
                  <span className="text-[10px] text-forest-700 font-medium cursor-pointer">
                    Resend OTP
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="4321"
                    className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl pl-9 pr-3 py-2 text-neutral-900 font-semibold tracking-widest focus:outline-none focus:ring-2 focus:ring-forest-700/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-full bg-forest-900 hover:bg-forest-800 active:scale-98 text-white font-semibold text-xs shadow-apple-sm transition-all"
              >
                {isLoading ? 'Verifying...' : 'Sign In with Mobile OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleAdminSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                  Government / Mandi Officer Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin.ghaziabad@mandimatch.gov.in"
                    className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl pl-9 pr-3 py-2 text-neutral-900 font-medium focus:outline-none focus:ring-2 focus:ring-forest-700/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                  Security Passkey
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl pl-9 pr-3 py-2 text-neutral-900 font-medium focus:outline-none focus:ring-2 focus:ring-forest-700/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-full bg-forest-900 hover:bg-forest-800 active:scale-98 text-white font-semibold text-xs shadow-apple-sm transition-all"
              >
                {isLoading ? 'Authenticating...' : 'Enter Admin Control Room'}
              </button>
            </form>
          )}

          {/* Footer Highlights */}
          <div className="pt-2 border-t border-black/[0.05] grid grid-cols-3 gap-2 text-center text-[10px] text-neutral-400">
            <span className="flex items-center justify-center gap-1 font-medium">
              <CheckCircle2 className="w-3 h-3 text-forest-700" /> Free Access
            </span>
            <span className="flex items-center justify-center gap-1 font-medium">
              <CheckCircle2 className="w-3 h-3 text-forest-700" /> Direct Buyers
            </span>
            <span className="flex items-center justify-center gap-1 font-medium">
              <CheckCircle2 className="w-3 h-3 text-forest-700" /> Pooling Saves 40%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
