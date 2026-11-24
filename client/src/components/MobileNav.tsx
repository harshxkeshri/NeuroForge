import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Scale,
  ShoppingBag,
  Truck,
  TrendingUp,
  User,
  ShieldCheck,
  LogIn,
  X,
} from 'lucide-react';
import { Language, t } from '../services/i18n';

interface MobileNavProps {
  lang: Language;
  open: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ lang, open, onClose }) => {
  const bottomBarItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: lang === 'hi' ? 'डैशबोर्ड' : 'Dashboard' },
    { to: '/compare', icon: Scale, label: lang === 'hi' ? 'तुलना' : 'Compare' },
    { to: '/buyers', icon: ShoppingBag, label: lang === 'hi' ? 'खरीदार' : 'Buyers' },
    { to: '/pooling', icon: Truck, label: lang === 'hi' ? 'पूलिंग' : 'Pooling' },
    { to: '/trends', icon: TrendingUp, label: lang === 'hi' ? 'रुझान' : 'Trends' },
  ];

  const drawerItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: t('navDashboard', lang) },
    { to: '/compare', icon: Scale, label: t('navComparison', lang) },
    { to: '/buyers', icon: ShoppingBag, label: t('navBuyers', lang) },
    { to: '/pooling', icon: Truck, label: t('navTransport', lang) },
    { to: '/trends', icon: TrendingUp, label: t('navTrends', lang) },
    { to: '/profile', icon: User, label: t('navProfile', lang) },
    { to: '/admin', icon: ShieldCheck, label: t('navAdmin', lang) },
    { to: '/login', icon: LogIn, label: lang === 'hi' ? 'लॉगिन / स्विच' : 'Sign In / Switch' },
  ];

  return (
    <>
      {/* 1. iOS Floating Tab Bar (Dock Style) */}
      <nav aria-label="Mobile bottom navigation" className="lg:hidden fixed bottom-4 inset-x-4 max-w-sm mx-auto z-40 bg-white/85 backdrop-blur-2xl rounded-full border border-black/[0.08] shadow-apple-dock py-1.5 px-3 flex justify-around items-center">
        {bottomBarItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center py-1 px-2.5 rounded-full text-[10px] font-semibold transition-all active:scale-90 ${
                  isActive ? 'text-forest-800' : 'text-neutral-500 hover:text-neutral-800'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1.5 rounded-full transition-all ${isActive ? 'bg-forest-100 text-forest-900 shadow-sm' : ''}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="mt-0.5 tracking-tight font-medium text-[9px]">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* 2. iOS Sheet-Style Slide-over Drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={onClose} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white/95 backdrop-blur-2xl shadow-apple-modal z-10 p-5 rounded-r-[32px] border-r border-black/[0.08]">
            {/* Grab handle indicator */}
            <div className="w-10 h-1 bg-black/15 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between pb-4 border-b border-black/[0.05]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-forest-900 flex items-center justify-center text-white text-base">
                  🌾
                </div>
                <span className="text-base font-semibold tracking-tight text-neutral-900">MandiMatch</span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-500 hover:bg-black/[0.05]"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-1">
              {drawerItems.map(item => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-3 rounded-2xl text-[13px] font-medium transition-all ${
                        isActive
                          ? 'bg-forest-900 text-white font-semibold shadow-apple-sm'
                          : 'text-neutral-600 hover:bg-black/[0.04] hover:text-neutral-900'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>

            <div className="pt-4 border-t border-black/[0.05] text-[11px] text-neutral-400 font-medium">
              Apple Human Interface Design • Build for Bharat
            </div>
          </div>
        </div>
      )}
    </>
  );
};
