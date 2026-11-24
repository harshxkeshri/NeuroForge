import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit2,
  Scale,
  ShoppingBag,
  Truck,
  Users,
  DollarSign,
  TrendingUp,
  RotateCcw,
  Check,
  X,
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { Mandi, BuyerOffer, TransportListing, Crop } from '../types';
import { Language } from '../services/i18n';

interface ContextType {
  lang: Language;
}

export const AdminDashboardPage: React.FC = () => {
  const { lang } = useOutletContext<ContextType>();

  const [activeTab, setActiveTab] = useState<'mandis' | 'buyers' | 'transport'>('mandis');

  // Lists
  const [mandis, setMandis] = useState<Mandi[]>(() => dataService.getMandis());
  const [buyers, setBuyers] = useState<BuyerOffer[]>(() => dataService.getBuyerOffers());
  const [transports, setTransports] = useState<TransportListing[]>(() => dataService.getTransportProviders());

  // Mandi Modal Form
  const [showMandiModal, setShowMandiModal] = useState(false);
  const [mandiName, setMandiName] = useState('');
  const [mandiCrop, setMandiCrop] = useState('crop-potato');
  const [mandiDistrict, setMandiDistrict] = useState('Ghaziabad');
  const [mandiPrice, setMandiPrice] = useState(20.0);
  const [mandiDistance, setMandiDistance] = useState(15.0);

  const totalMandis = mandis.length;
  const totalBuyers = buyers.length;
  const totalTransports = transports.length;
  const activePools = dataService.getTransportPools().length;

  const handleAddMandi = (e: React.FormEvent) => {
    e.preventDefault();
    dataService.addMandi({
      cropId: mandiCrop,
      mandiName,
      district: mandiDistrict,
      state: 'Uttar Pradesh',
      pricePerKg: Number(mandiPrice),
      distanceKm: Number(mandiDistance),
      lastUpdated: 'Just now',
      source: 'Admin Live Update',
      dataType: 'demo',
      lat: 28.66,
      lng: 77.44,
      marketFeePercent: 1.5,
    });
    setMandis([...dataService.getMandis()]);
    setShowMandiModal(false);
  };

  const handleDeleteMandi = (id: string) => {
    dataService.deleteMandi(id);
    setMandis([...dataService.getMandis()]);
  };

  const handleDeleteBuyer = (id: string) => {
    dataService.deleteBuyerOffer(id);
    setBuyers([...dataService.getBuyerOffers()]);
  };

  const handleToggleBuyerStatus = (id: string, current: string) => {
    const next = current === 'open' ? 'matched' : 'open';
    dataService.updateBuyerOffer(id, { status: next as any });
    setBuyers([...dataService.getBuyerOffers()]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
              {lang === 'hi' ? 'व्यवस्थापक पोर्टल (Admin Dashboard)' : 'Administrator Control Center'}
            </h1>
            <span className="text-[10px] font-semibold bg-forest-900 text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Full CRUD Enabled
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1 font-normal">
            Real-time management for mandis, buyer tenders, transport fleets, and system benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'mandis' && (
            <button
              onClick={() => setShowMandiModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-forest-900 hover:bg-forest-800 active:scale-95 text-white font-semibold text-xs shadow-apple-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-harvest" />
              <span>Add Mandi Price</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Apple Inset Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-[26px] bg-white border border-black/[0.06] shadow-apple-card">
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-1 font-medium">
            <span>Active Mandis</span>
            <Scale className="w-4 h-4 text-forest-700" />
          </div>
          <span className="text-2xl font-extrabold text-neutral-900 tracking-tight block">{totalMandis}</span>
          <span className="text-[10px] text-forest-700 font-semibold">NCR Agro Hubs</span>
        </div>

        <div className="p-5 rounded-[26px] bg-white border border-black/[0.06] shadow-apple-card">
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-1 font-medium">
            <span>Direct Buyers</span>
            <ShoppingBag className="w-4 h-4 text-harvest-hover" />
          </div>
          <span className="text-2xl font-extrabold text-neutral-900 tracking-tight block">{totalBuyers}</span>
          <span className="text-[10px] text-forest-700 font-semibold">FPOs & Corporates</span>
        </div>

        <div className="p-5 rounded-[26px] bg-white border border-black/[0.06] shadow-apple-card">
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-1 font-medium">
            <span>Active Pools</span>
            <Truck className="w-4 h-4 text-forest-700" />
          </div>
          <span className="text-2xl font-extrabold text-neutral-900 tracking-tight block">{activePools}</span>
          <span className="text-[10px] text-forest-700 font-semibold">Consolidated Routes</span>
        </div>

        <div className="p-5 rounded-[26px] bg-white border border-black/[0.06] shadow-apple-card">
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-1 font-medium">
            <span>Transporters</span>
            <Users className="w-4 h-4 text-forest-700" />
          </div>
          <span className="text-2xl font-extrabold text-neutral-900 tracking-tight block">{totalTransports}</span>
          <span className="text-[10px] text-forest-700 font-semibold">Fleet Network</span>
        </div>
      </div>

      {/* Apple HIG Segmented Tab Switcher */}
      <div className="flex bg-black/[0.04] p-1 rounded-2xl border border-black/[0.04] text-xs max-w-md">
        <button
          onClick={() => setActiveTab('mandis')}
          className={`flex-1 py-1.5 rounded-xl font-semibold transition-all ${
            activeTab === 'mandis' ? 'bg-white text-neutral-900 shadow-apple-sm' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          Mandis ({mandis.length})
        </button>
        <button
          onClick={() => setActiveTab('buyers')}
          className={`flex-1 py-1.5 rounded-xl font-semibold transition-all ${
            activeTab === 'buyers' ? 'bg-white text-neutral-900 shadow-apple-sm' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          Buyer Offers ({buyers.length})
        </button>
        <button
          onClick={() => setActiveTab('transport')}
          className={`flex-1 py-1.5 rounded-xl font-semibold transition-all ${
            activeTab === 'transport' ? 'bg-white text-neutral-900 shadow-apple-sm' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          Fleets ({transports.length})
        </button>
      </div>

      {/* Tab 1: Mandis Table */}
      {activeTab === 'mandis' && (
        <div className="bg-white/80 backdrop-blur-xl rounded-[28px] border border-black/[0.06] shadow-apple-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-black/[0.02] text-neutral-400 text-[10px] uppercase font-semibold tracking-wider border-b border-black/[0.05]">
                  <th className="py-3 px-4">Mandi Name</th>
                  <th className="py-3 px-4">Crop</th>
                  <th className="py-3 px-4">Price / kg</th>
                  <th className="py-3 px-4">Distance</th>
                  <th className="py-3 px-4">District</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04]">
                {mandis.map((m) => (
                  <tr key={m.id} className="hover:bg-black/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-neutral-900">{m.mandiName}</td>
                    <td className="py-3.5 px-4 font-medium text-forest-800">{m.cropId.replace('crop-', '')}</td>
                    <td className="py-3.5 px-4 font-extrabold text-neutral-900">₹{m.pricePerKg.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-neutral-500 font-medium">{m.distanceKm} km</td>
                    <td className="py-3.5 px-4 text-neutral-500 font-medium">{m.district}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteMandi(m.id)}
                        className="w-7 h-7 rounded-full inline-flex items-center justify-center text-neutral-400 hover:text-mandi-red hover:bg-red-50 active:scale-95 transition-all"
                        title="Delete Mandi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Buyers Table */}
      {activeTab === 'buyers' && (
        <div className="bg-white/80 backdrop-blur-xl rounded-[28px] border border-black/[0.06] shadow-apple-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-black/[0.02] text-neutral-400 text-[10px] uppercase font-semibold tracking-wider border-b border-black/[0.05]">
                  <th className="py-3 px-4">Buyer Enterprise</th>
                  <th className="py-3 px-4">Crop</th>
                  <th className="py-3 px-4">Offer Rate</th>
                  <th className="py-3 px-4">Demand Qty</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Toggle / Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04]">
                {buyers.map((b) => (
                  <tr key={b.id} className="hover:bg-black/[0.02] transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-neutral-900 block">{b.buyerName}</span>
                      <span className="text-[10px] text-neutral-400 font-normal">{b.location}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-forest-800">{b.cropId.replace('crop-', '')}</td>
                    <td className="py-3.5 px-4 font-extrabold text-neutral-900">₹{b.offeredPrice.toFixed(2)}</td>
                    <td className="py-3.5 px-4 font-medium text-neutral-800">{b.quantityRequired.toLocaleString('en-IN')} kg</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          b.status === 'open'
                            ? 'bg-forest-100 text-forest-800'
                            : 'bg-harvest/20 text-harvest-hover'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleBuyerStatus(b.id, b.status)}
                        className="text-[11px] font-semibold text-forest-700 hover:underline"
                      >
                        {b.status === 'open' ? 'Mark Matched' : 'Reopen'}
                      </button>
                      <button
                        onClick={() => handleDeleteBuyer(b.id)}
                        className="w-7 h-7 rounded-full inline-flex items-center justify-center text-neutral-400 hover:text-mandi-red hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Transport Fleet Table */}
      {activeTab === 'transport' && (
        <div className="bg-white/80 backdrop-blur-xl rounded-[28px] border border-black/[0.06] shadow-apple-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-black/[0.02] text-neutral-400 text-[10px] uppercase font-semibold tracking-wider border-b border-black/[0.05]">
                  <th className="py-3 px-4">Provider</th>
                  <th className="py-3 px-4">Vehicle Model</th>
                  <th className="py-3 px-4">Capacity</th>
                  <th className="py-3 px-4">Rate / km</th>
                  <th className="py-3 px-4">Cost Basis</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04]">
                {transports.map((t) => (
                  <tr key={t.id} className="hover:bg-black/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-neutral-900">{t.providerName}</td>
                    <td className="py-3.5 px-4 text-neutral-500 font-medium">{t.vehicleType}</td>
                    <td className="py-3.5 px-4 font-bold text-neutral-900">{t.capacityKg} kg</td>
                    <td className="py-3.5 px-4 text-neutral-500 font-medium">₹{t.baseRatePerKm}/km</td>
                    <td className="py-3.5 px-4 font-semibold text-neutral-900">₹{t.cost}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-semibold bg-forest-100 text-forest-800 px-2 py-0.5 rounded-full">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Mandi Sheet Modal */}
      {showMandiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/35 backdrop-blur-sm transition-opacity" onClick={() => setShowMandiModal(false)} />
          <div className="relative w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-[32px] shadow-apple-modal border border-black/[0.08] p-6 sm:p-7 z-10 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.05]">
              <h3 className="text-base font-bold tracking-tight text-neutral-900">Add New Mandi Price</h3>
              <button onClick={() => setShowMandiModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMandi} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">Mandi Name</label>
                <input
                  type="text"
                  required
                  value={mandiName}
                  onChange={(e) => setMandiName(e.target.value)}
                  placeholder="e.g. Loni Sub-Mandi Yard"
                  className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-3 py-2 text-neutral-900 font-medium focus:outline-none focus:ring-2 focus:ring-forest-700/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">Crop</label>
                  <select
                    value={mandiCrop}
                    onChange={(e) => setMandiCrop(e.target.value)}
                    className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-3 py-2 text-neutral-900 font-semibold focus:outline-none focus:ring-2 focus:ring-forest-700/20"
                  >
                    <option value="crop-potato">Potato</option>
                    <option value="crop-wheat">Wheat</option>
                    <option value="crop-tomato">Tomato</option>
                    <option value="crop-onion">Onion</option>
                    <option value="crop-rice">Rice</option>
                    <option value="crop-mustard">Mustard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">Price (₹/kg)</label>
                  <input
                    type="number"
                    step={0.1}
                    value={mandiPrice}
                    onChange={(e) => setMandiPrice(Number(e.target.value))}
                    className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-3 py-2 text-neutral-900 font-bold focus:outline-none focus:ring-2 focus:ring-forest-700/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">District</label>
                  <input
                    type="text"
                    value={mandiDistrict}
                    onChange={(e) => setMandiDistrict(e.target.value)}
                    className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-3 py-2 text-neutral-900 font-medium focus:outline-none focus:ring-2 focus:ring-forest-700/20"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">Distance (km)</label>
                  <input
                    type="number"
                    value={mandiDistance}
                    onChange={(e) => setMandiDistance(Number(e.target.value))}
                    className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-3 py-2 text-neutral-900 font-medium focus:outline-none focus:ring-2 focus:ring-forest-700/20"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowMandiModal(false)}
                  className="flex-1 py-2.5 rounded-full border border-black/[0.08] font-semibold text-neutral-600 hover:bg-black/[0.03] active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-forest-900 hover:bg-forest-800 active:scale-95 text-white font-semibold shadow-apple-sm transition-all"
                >
                  Save Mandi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
