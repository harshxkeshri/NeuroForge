import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  User,
  MapPin,
  Phone,
  CheckCircle2,
  Calendar,
  Sparkles,
  Bell,
  Save,
  ShieldCheck,
  Package,
  Truck,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Language } from '../services/i18n';

interface ContextType {
  lang: Language;
}

export const FarmerProfilePage: React.FC = () => {
  const { lang } = useOutletContext<ContextType>();
  const { farmer, updateFarmerProfile } = useAuth();
  const [isSaved, setIsSaved] = useState(false);

  // Editable fields bound to farmer state
  const [name, setName] = useState(farmer.name);
  const [phone, setPhone] = useState(farmer.phone);
  const [village, setVillage] = useState(farmer.village);
  const [district, setDistrict] = useState(farmer.district);
  const [state, setState] = useState(farmer.state);

  const [smsAlerts, setSmsAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [poolNotifications, setPoolNotifications] = useState(true);

  // Keep form in sync if farmer object changes externally
  useEffect(() => {
    setName(farmer.name);
    setPhone(farmer.phone);
    setVillage(farmer.village);
    setDistrict(farmer.district);
    setState(farmer.state);
  }, [farmer]);

  const initials = (name || farmer.name || 'RK')
    .split(' ')
    .filter(Boolean)
    .map(p => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'RK';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // updateFarmerProfile updates AuthContext, localStorage, and triggers navbar sync immediately!
    updateFarmerProfile({
      name,
      phone,
      village,
      district,
      state,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Apple ID Style Profile Header */}
      <div className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-[32px] border border-black/[0.06] shadow-apple-card flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-18 h-18 rounded-[24px] bg-forest-900 text-white flex items-center justify-center font-bold text-2xl shadow-apple-card border-2 border-white">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">{name || farmer.name}</h1>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-forest-100 text-forest-800 px-2.5 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3 text-forest-700" /> Verified Member
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              {village || farmer.village}, {district || farmer.district}, {state || farmer.state}
            </p>
            <p className="text-xs text-neutral-500 mt-0.5 flex items-center gap-1.5 font-medium">
              <Phone className="w-3.5 h-3.5 text-neutral-400" />
              {phone || farmer.phone}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-forest-50/70 border border-forest-100 text-center sm:text-right shadow-apple-sm">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-forest-800 block">Total Logistics Savings</span>
          <span className="text-2xl font-extrabold text-forest-900 mt-0.5 block tracking-tight">₹4,250</span>
          <span className="text-[11px] text-forest-700 block font-medium">Across 6 pooled trips</span>
        </div>
      </div>

      {/* iOS Settings App Style Inset Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Profile Form */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl p-6 rounded-[28px] border border-black/[0.06] shadow-apple-card space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-black/[0.05]">
            <h2 className="text-sm font-bold tracking-tight text-neutral-900">
              {lang === 'hi' ? 'व्यक्तिगत व खेत विवरण' : 'Farmer Identity & Village Details'}
            </h2>
            {isSaved && (
              <span className="text-xs font-semibold text-forest-700 flex items-center gap-1 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" /> Updated in Navbar & Storage!
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                  Full Name (पूरा नाम)
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-3.5 py-2.5 text-neutral-900 font-medium focus:outline-none focus:ring-2 focus:ring-forest-700/20"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                  Mobile (WhatsApp/SMS)
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-3.5 py-2.5 text-neutral-900 font-medium focus:outline-none focus:ring-2 focus:ring-forest-700/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                Village & Farm Gate Landmark (गाँव / पता)
              </label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-3.5 py-2.5 text-neutral-900 font-medium focus:outline-none focus:ring-2 focus:ring-forest-700/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">District</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-3.5 py-2.5 text-neutral-900 font-medium focus:outline-none focus:ring-2 focus:ring-forest-700/20"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-3.5 py-2.5 text-neutral-900 font-medium focus:outline-none focus:ring-2 focus:ring-forest-700/20"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-forest-900 hover:bg-forest-800 active:scale-95 text-white font-semibold text-xs shadow-apple-sm transition-all"
              >
                <Save className="w-3.5 h-3.5 text-harvest" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Col: Apple HIG Switch Rows */}
        <div className="space-y-6">
          {/* iOS Settings Group for Notifications */}
          <div className="bg-white/80 backdrop-blur-xl p-5 rounded-[28px] border border-black/[0.06] shadow-apple-card space-y-4 text-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-black/[0.05] font-bold text-neutral-900">
              <Bell className="w-4 h-4 text-forest-700" />
              <span>Notification Switches</span>
            </div>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-neutral-900 block">Daily Mandi SMS</span>
                  <span className="text-[10px] text-neutral-400">Official Agmarknet feed</span>
                </div>
                <label className="apple-switch">
                  <input
                    type="checkbox"
                    checked={smsAlerts}
                    onChange={(e) => setSmsAlerts(e.target.checked)}
                  />
                  <span className="apple-slider" />
                </label>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-black/[0.04]">
                <div>
                  <span className="font-semibold text-neutral-900 block">WhatsApp Alerts</span>
                  <span className="text-[10px] text-neutral-400">High-demand buyer quotes</span>
                </div>
                <label className="apple-switch">
                  <input
                    type="checkbox"
                    checked={whatsappAlerts}
                    onChange={(e) => setWhatsappAlerts(e.target.checked)}
                  />
                  <span className="apple-slider" />
                </label>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-black/[0.04]">
                <div>
                  <span className="font-semibold text-neutral-900 block">Transport Pooling</span>
                  <span className="text-[10px] text-neutral-400">Route invitations nearby</span>
                </div>
                <label className="apple-switch">
                  <input
                    type="checkbox"
                    checked={poolNotifications}
                    onChange={(e) => setPoolNotifications(e.target.checked)}
                  />
                  <span className="apple-slider" />
                </label>
              </div>
            </div>
          </div>

          {/* Active Inventory Card */}
          <div className="bg-white/80 backdrop-blur-xl p-5 rounded-[28px] border border-black/[0.06] shadow-apple-card space-y-3 text-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-black/[0.05] font-bold text-neutral-900">
              <Package className="w-4 h-4 text-forest-700" />
              <span>Produce Inventory</span>
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-2xl bg-black/[0.02] border border-black/[0.04] flex items-center justify-between shadow-apple-sm">
                <div>
                  <span className="font-semibold text-neutral-900 block">🥔 Potato (Kufri Jyoti)</span>
                  <span className="text-[10px] text-neutral-400 font-medium">Grade A • Ready for Dispatch</span>
                </div>
                <span className="font-extrabold text-forest-900">1,000 kg</span>
              </div>

              <div className="p-3 rounded-2xl bg-black/[0.02] border border-black/[0.04] flex items-center justify-between shadow-apple-sm">
                <div>
                  <span className="font-semibold text-neutral-900 block">🌾 Wheat (HD-2967)</span>
                  <span className="text-[10px] text-neutral-400 font-medium">Storage Yard #2</span>
                </div>
                <span className="font-extrabold text-forest-900">800 kg</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
