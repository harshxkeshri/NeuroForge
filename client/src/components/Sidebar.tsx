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
  ChevronRight,
  Sparkles,
  LogIn,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Language, t } from '../services/i18n';

interface SidebarProps {
  lang: Language;
  onOpenAI: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ lang, onOpenAI }) => {
  const { role } = useAuth();

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: t('navDashboard', lang), badge: null },
    { to: '/compare', icon: Scale, label: t('navComparison', lang), badge: 'Core' },
    { to: '/buyers', icon: ShoppingBag, label: t('navBuyers', lang), badge: '20+' },
    { to: '/pooling', icon: Truck, label: t('navTransport', lang), badge: 'Save 40%' },
    { to: '/trends', icon: TrendingUp, label: t('navTrends', lang), badge: null },
    { to: '/profile', icon: User, label: t('navProfile', lang), badge: null },
    { to: '/admin', icon: ShieldCheck, label: t('navAdmin', lang), badge: role === 'admin' ? 'Active' : 'Manage' },
    { to: '/login', icon: LogIn, label: lang === 'hi' ? 'लॉगिन / स्विच' : 'Sign In / Switch', badge: null },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-black/[0.06] bg-white/60 backdrop-blur-xl min-h-[calc(100vh-4rem)] p-4 justify-between shrink-0">
      <div className="space-y-6">
        {/* Navigation Group */}
        <div>
          <p className="px-3 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
            {lang === 'hi' ? 'मुख्य मेनू' : 'Overview'}
          </p>
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-[13px] font-medium transition-all ${
                      isActive
                        ? 'bg-forest-900 text-white shadow-apple-sm font-semibold'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-black/[0.04]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-forest-100' : 'text-forest-700'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold tracking-wide ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : item.badge.includes('%')
                              ? 'bg-harvest/20 text-harvest-hover'
                              : 'bg-forest-100 text-forest-800'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Apple Intelligence Styled Assistant Card */}
        <div className="p-4 rounded-3xl bg-gradient-to-b from-forest-50/80 to-forest-100/40 border border-forest-200/70 shadow-apple-sm space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-forest-900 flex items-center justify-center text-white shadow-apple-sm">
              <Sparkles className="w-3.5 h-3.5 text-harvest" />
            </div>
            <span className="text-xs font-semibold text-neutral-900">
              {lang === 'hi' ? 'किसान मित्र AI' : 'Kisan Mitra AI'}
            </span>
          </div>
          <p className="text-[11px] text-neutral-600 leading-relaxed font-normal">
            {lang === 'hi'
              ? 'अपनी उपज बोलकर बताएं, AI सही मंडी और मुनाफा तुरंत बताएगा।'
              : 'Grounded intelligence explaining true net profit without hallucinations.'}
          </p>
          <button
            onClick={onOpenAI}
            className="w-full flex items-center justify-center gap-1.5 py-2 bg-forest-900 hover:bg-forest-800 active:scale-98 text-white rounded-xl text-xs font-semibold shadow-apple-sm transition-all"
          >
            <span>{lang === 'hi' ? 'AI से पूछें' : 'Ask Assistant'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Footer System Caption */}
      <div className="pt-4 border-t border-black/[0.05]">
        <div className="flex items-center justify-between text-[11px] text-neutral-400 font-medium">
          <span>Build for Bharat</span>
          <span className="font-semibold text-forest-700">v1.0 (HIG)</span>
        </div>
      </div>
    </aside>
  );
};
