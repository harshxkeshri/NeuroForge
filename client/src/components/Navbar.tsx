import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mic,
  Sparkles,
  Bell,
  MapPin,
  Menu,
  X,
  CheckCircle2,
  ChevronDown,
  User,
  ShieldCheck,
  LogOut,
  LogIn,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Language } from '../services/i18n';

interface NavbarProps {
  lang: Language;
  setLang: (lang: Language) => void;
  onOpenVoice: () => void;
  onOpenAI: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  setLang,
  onOpenVoice,
  onOpenAI,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const { role, isAuthenticated, farmer, admin, logout, switchRole } = useAuth();
  const navigate = useNavigate();

  const notifications = [
    { id: 1, title: 'Azadpur Potato Price Up +₹1.20/kg', time: '10m ago', unread: true },
    { id: 2, title: 'Suresh Pal joined your transport pool', time: '1h ago', unread: true },
    { id: 3, title: 'Haldiram Snacks verified your produce grade', time: '3h ago', unread: false },
  ];

  // Dynamically compute initials from current live farmer or admin name
  const displayName = role === 'admin'
    ? (admin?.name || 'Agri Officer')
    : (farmer.name || 'Ramesh Kumar');

  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map(p => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'RK';

  const handleRoleToggle = () => {
    const nextRole = role === 'farmer' ? 'admin' : 'farmer';
    switchRole(nextRole);
    setShowAccountMenu(false);
    navigate(nextRole === 'admin' ? '/admin' : '/dashboard');
  };

  const handleLogout = () => {
    logout();
    setShowAccountMenu(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-2xl border-b border-black/[0.06] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-black/[0.04] active:scale-95 transition-all lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-forest-900 flex items-center justify-center text-white shadow-apple-sm group-hover:scale-105 active:scale-95 transition-transform">
                <span className="text-lg">🌾</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-[17px] font-semibold tracking-tight text-neutral-900">
                    Mandi<span className="text-harvest">Match</span>
                  </span>
                  <span className="text-[10px] tracking-wide font-semibold bg-forest-100 text-forest-800 px-1.5 py-0.5 rounded-full">
                    Bharat
                  </span>
                </div>
                <span className="text-[11px] text-neutral-500 font-normal leading-tight hidden sm:block">
                  {lang === 'hi' ? 'आपकी फसल • आपका बाज़ार • आपका मुनाफा' : 'Your Harvest. Your Market. Your Profit.'}
                </span>
              </div>
            </Link>
          </div>

          {/* Apple HIG Control Bar */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Voice Input Capsule Button */}
            <button
              onClick={onOpenVoice}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/[0.04] hover:bg-black/[0.07] active:scale-95 text-neutral-800 text-xs font-medium transition-all"
              title="Voice Search (Hindi / English)"
            >
              <Mic className="w-3.5 h-3.5 text-forest-700 animate-pulse" />
              <span className="hidden md:inline font-medium">
                {lang === 'hi' ? 'बोलकर खोजें' : 'Voice Query'}
              </span>
            </button>

            {/* Apple Intelligence / Kisan Mitra AI Button */}
            <button
              onClick={onOpenAI}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-forest-900 hover:bg-forest-800 active:scale-95 text-white text-xs font-semibold shadow-apple-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-harvest" />
              <span className="hidden sm:inline font-medium">
                {lang === 'hi' ? 'किसान मित्र AI' : 'Kisan Mitra AI'}
              </span>
            </button>

            {/* Apple Segmented Language Picker */}
            <div className="flex items-center bg-black/[0.05] p-0.5 rounded-full text-xs font-medium">
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                  lang === 'en'
                    ? 'bg-white text-neutral-900 shadow-apple-sm'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                  lang === 'hi'
                    ? 'bg-white text-neutral-900 shadow-apple-sm'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                हिंदी
              </button>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-black/[0.04] active:scale-95 transition-all relative"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-harvest rounded-full ring-2 ring-white" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-apple-modal border border-black/[0.08] p-3.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2 border-b border-black/[0.05] mb-2">
                    <span className="text-xs font-semibold text-neutral-900">
                      {lang === 'hi' ? 'सूचनाएं' : 'Notifications'}
                    </span>
                    <span className="text-[11px] text-forest-700 font-medium cursor-pointer hover:underline">
                      {lang === 'hi' ? 'सभी पढ़ें' : 'Mark all read'}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl text-xs transition-colors ${
                          n.unread ? 'bg-forest-50/70' : 'bg-black/[0.02]'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <p className="font-medium text-neutral-900 leading-snug">{n.title}</p>
                          {n.unread && <span className="w-1.5 h-1.5 bg-forest-600 rounded-full shrink-0 mt-1" />}
                        </div>
                        <span className="text-[10px] text-neutral-400 mt-1 block font-medium">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Apple Contact Card Pill with Real-time Name Synchronization & Account Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-black/[0.03] hover:bg-black/[0.06] active:scale-98 transition-all border border-black/[0.04]"
                >
                  <div className="w-7 h-7 rounded-full bg-forest-900 text-white flex items-center justify-center font-bold text-[11px] shadow-apple-sm">
                    {initials}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold text-neutral-900 leading-none">
                        {displayName}
                      </span>
                      {role === 'admin' ? (
                        <ShieldCheck className="w-3 h-3 text-harvest-hover" />
                      ) : (
                        <CheckCircle2 className="w-3 h-3 text-forest-700" />
                      )}
                    </div>
                    <span className="text-[10px] text-neutral-500 flex items-center gap-0.5 mt-0.5 leading-none font-medium">
                      <MapPin className="w-2.5 h-2.5 text-neutral-400" />
                      {role === 'admin' ? 'District Officer' : `${farmer.district || 'Ghaziabad'}, UP`}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400 ml-0.5" />
                </button>

                {/* Account Popover Menu */}
                {showAccountMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-apple-modal border border-black/[0.08] p-2 z-50 animate-in fade-in zoom-in-95 space-y-1">
                    <div className="p-2.5 rounded-xl bg-black/[0.02] border border-black/[0.04] mb-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                          Active Account
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-forest-100 text-forest-800'
                        }`}>
                          {role}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-neutral-900 mt-1">{displayName}</p>
                      <p className="text-[10px] text-neutral-500">
                        {role === 'admin' ? admin?.email : farmer.phone}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setShowAccountMenu(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-700 hover:text-neutral-900 hover:bg-black/[0.04] transition-colors"
                    >
                      <User className="w-4 h-4 text-forest-700" />
                      <span>{lang === 'hi' ? 'किसान प्रोफाइल देखें' : 'Farmer Profile & Settings'}</span>
                    </Link>

                    <button
                      onClick={handleRoleToggle}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-neutral-700 hover:text-neutral-900 hover:bg-black/[0.04] transition-colors text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-harvest-hover" />
                        <span>
                          {role === 'farmer'
                            ? (lang === 'hi' ? 'एडमिन पोर्टल पर जाएं' : 'Switch to Admin View')
                            : (lang === 'hi' ? 'किसान दृश्य पर जाएं' : 'Switch to Farmer View')}
                        </span>
                      </div>
                    </button>

                    <div className="border-t border-black/[0.05] pt-1 mt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-mandi-red hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{lang === 'hi' ? 'लॉगआउट करें' : 'Sign Out'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-forest-900 hover:bg-forest-800 active:scale-95 text-white text-xs font-semibold shadow-apple-sm transition-all"
              >
                <LogIn className="w-3.5 h-3.5 text-harvest" />
                <span>{lang === 'hi' ? 'लॉगिन करें' : 'Sign In'}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
