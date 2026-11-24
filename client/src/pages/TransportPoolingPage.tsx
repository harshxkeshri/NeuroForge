import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Truck,
  Users,
  MapPin,
  Calendar,
  CheckCircle2,
  Plus,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Info,
  DollarSign,
  AlertCircle,
  Navigation,
  Check,
  X,
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { calculatePoolEconomics, validatePoolJoin } from '../algorithms/transportPooler';
import { TransportPool, PoolMember } from '../types';
import { Language } from '../services/i18n';

interface ContextType {
  lang: Language;
  onOpenVoice: () => void;
  onOpenAI: () => void;
}

export const TransportPoolingPage: React.FC = () => {
  const { lang } = useOutletContext<ContextType>();

  const [pools, setPools] = useState<TransportPool[]>(() => dataService.getTransportPools());
  const [selectedPoolId, setSelectedPoolId] = useState<string>(pools[0]?.id || 'pool-1');

  // Join Pool Modal State
  const [showJoinModal, setShowJoinModal] = useState<boolean>(false);
  const [joinQty, setJoinQty] = useState<number>(500);
  const [joinFarmerName, setJoinFarmerName] = useState<string>('Ramesh Kumar (You)');
  const [joinVillage, setJoinVillage] = useState<string>('Dundahera, Ghaziabad');

  // Create Pool Modal State
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('Ghaziabad Express to Ghazipur Mandi');
  const [newDest, setNewDest] = useState('Ghazipur Mandi');
  const [newCapacity, setNewCapacity] = useState(2000);
  const [newCost, setNewCost] = useState(1600);
  const [newDeparture, setNewDeparture] = useState('Tomorrow 05:00 AM');

  const selectedPool = useMemo(() => {
    return pools.find(p => p.id === selectedPoolId) || pools[0];
  }, [pools, selectedPoolId]);

  const handleJoinConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPool) return;

    const validation = validatePoolJoin(selectedPool, joinQty);
    if (!validation.eligible) {
      alert(validation.reason);
      return;
    }

    const updated = dataService.joinPool(selectedPool.id, {
      farmerId: 'farmer-ramesh',
      farmerName: joinFarmerName,
      village: joinVillage,
      cropId: selectedPool.cropId,
      quantityKg: Number(joinQty),
      lat: 28.6692,
      lng: 77.4538,
    });

    if (updated) {
      setPools([...dataService.getTransportPools()]);
      setShowJoinModal(false);
    }
  };

  const handleCreatePool = (e: React.FormEvent) => {
    e.preventDefault();
    const created = dataService.createTransportPool({
      title: newTitle,
      destination: newDest,
      cropId: 'crop-potato',
      totalQuantity: 500,
      vehicleCapacity: Number(newCapacity),
      totalSoloCost: 1000,
      totalSharedCost: Number(newCost),
      totalSavings: Math.max(0, 1000 - Number(newCost)),
      scheduledDeparture: newDeparture,
      routeStops: ['Ghaziabad Hub', newDest],
      members: [
        {
          farmerId: 'farmer-ramesh',
          farmerName: 'Ramesh Kumar (Host)',
          village: 'Dundahera',
          cropId: 'crop-potato',
          quantityKg: 500,
          lat: 28.6692,
          lng: 77.4538,
          individualCost: 1000,
          sharedCost: Number(newCost),
          savings: 0,
        },
      ],
    });

    setPools([...dataService.getTransportPools()]);
    setSelectedPoolId(created.id);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
              {lang === 'hi' ? 'स्मार्ट साझा परिवहन (Transport Pooling)' : 'Smart Transport Pooling'}
            </h1>
            <span className="text-[10px] font-semibold bg-forest-100 text-forest-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Save Up to 40%
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1 font-normal">
            {lang === 'hi'
              ? 'एक ही मंडी जाने वाले पड़ोसी किसानों के साथ मिलकर कमर्शियल वाहन साझा करें और ढुलाई खर्च आधा करें।'
              : 'Share pickup trucks with nearby farmers heading to the same market yard and slash freight expenses.'}
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-forest-900 hover:bg-forest-800 active:scale-95 text-white font-semibold text-xs shadow-apple-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 text-harvest" />
          <span>{lang === 'hi' ? 'नया पूल रूट बनाएं' : 'Create Route'}</span>
        </button>
      </div>

      {/* Featured Highlight Spec Box */}
      <div className="p-6 sm:p-7 rounded-[32px] bg-forest-900 text-white shadow-apple-modal relative overflow-hidden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-white shadow-apple-sm">
              <Truck className="w-6 h-6 text-harvest" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/15 text-harvest px-2.5 py-0.5 rounded-full">
                Active Cluster Showcase
              </span>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight mt-1">
                {selectedPool.title}
              </h2>
            </div>
          </div>

          <button
            onClick={() => setShowJoinModal(true)}
            className="px-5 py-2.5 rounded-full bg-harvest hover:bg-harvest-hover active:scale-95 text-forest-900 font-bold text-xs shadow-apple-sm transition-all"
          >
            {lang === 'hi' ? 'इस पूल में शामिल हों' : 'Join This Route'}
          </button>
        </div>

        {/* 4 Metric Spec Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-white/[0.08] border border-white/10 shadow-apple-sm">
            <span className="text-forest-200 text-[10px] uppercase font-semibold tracking-wider block">Consolidated Load</span>
            <span className="text-base font-bold text-white mt-0.5 block tracking-tight">
              {selectedPool.totalQuantity.toLocaleString('en-IN')} / {selectedPool.vehicleCapacity.toLocaleString('en-IN')} kg
            </span>
            <span className="text-[10px] text-harvest font-medium">
              {Math.round((selectedPool.totalQuantity / selectedPool.vehicleCapacity) * 100)}% Capacity Utilized
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.08] border border-white/10 shadow-apple-sm">
            <span className="text-forest-200 text-[10px] uppercase font-semibold tracking-wider block">Solo Transport Cost</span>
            <span className="text-base font-bold text-forest-200/60 mt-0.5 block line-through tracking-tight">
              ₹{selectedPool.totalSoloCost.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-forest-200 font-medium">Individual booking</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.08] border border-white/10 shadow-apple-sm">
            <span className="text-forest-200 text-[10px] uppercase font-semibold tracking-wider block">Shared Vehicle Cost</span>
            <span className="text-base font-bold text-white mt-0.5 block tracking-tight">
              ₹{selectedPool.totalSharedCost.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-forest-200 font-medium">Bolero Hire Cost</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-harvest text-forest-900 font-bold shadow-apple-sm">
            <span className="text-[10px] uppercase tracking-wider block opacity-90 font-semibold">Total Group Savings</span>
            <span className="text-lg font-extrabold mt-0.5 block tracking-tight">
              ₹{selectedPool.totalSavings.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-forest-900 font-medium">
              {Math.round((selectedPool.totalSavings / (selectedPool.totalSoloCost || 1)) * 100)}% Collective Savings!
            </span>
          </div>
        </div>
      </div>

      {/* Apple Maps Inspired Route Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Route Corridor */}
        <div className="bg-white/80 backdrop-blur-xl p-5 sm:p-6 rounded-[28px] border border-black/[0.06] shadow-apple-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-black/[0.05]">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-forest-700" />
              <h3 className="text-sm font-bold tracking-tight text-neutral-900">
                {lang === 'hi' ? 'साझा मार्ग व पिकअप स्टॉप' : 'Consolidated Route & Pickup Stops'}
              </h3>
            </div>
            <span className="text-xs text-forest-800 font-semibold bg-forest-100 px-3 py-0.5 rounded-full">
              {selectedPool.scheduledDeparture}
            </span>
          </div>

          {/* Graphical Apple Maps style timeline */}
          <div className="relative py-4 pl-6 space-y-5 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-forest-600/40">
            {selectedPool.members.map((m, idx) => (
              <div key={idx} className="relative flex items-start gap-3">
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-forest-900 border-2 border-white shadow-apple-sm flex items-center justify-center text-[10px] text-white font-bold">
                  {idx + 1}
                </div>
                <div className="bg-black/[0.02] p-3.5 rounded-2xl border border-black/[0.05] flex-1 flex items-center justify-between shadow-apple-sm">
                  <div>
                    <span className="text-xs font-bold text-neutral-900 block">{m.farmerName}</span>
                    <span className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5 font-medium">
                      <MapPin className="w-3 h-3 text-neutral-400" /> {m.village}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-neutral-900 block">{m.quantityKg} kg</span>
                    <span className="text-[10px] text-forest-700 font-semibold block">
                      Pays ₹{m.sharedCost} (Saves ₹{m.savings})
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Destination Final Terminal */}
            <div className="relative flex items-start gap-3">
              <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-harvest border-2 border-white shadow-apple-sm flex items-center justify-center text-[10px] text-forest-900 font-bold">
                ★
              </div>
              <div className="bg-forest-50/70 p-3.5 rounded-2xl border border-forest-100 flex-1 flex items-center justify-between shadow-apple-sm">
                <div>
                  <span className="text-xs font-bold text-forest-900 block">Destination Market Yard</span>
                  <span className="text-[11px] text-forest-700 mt-0.5 block font-medium">{selectedPool.destination}</span>
                </div>
                <span className="text-[10px] font-semibold bg-forest-700 text-white px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Unloading Bay
                </span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-harvest-light/70 border border-harvest/30 text-xs text-neutral-800 space-y-1">
            <span className="font-semibold flex items-center gap-1.5 text-forest-900">
              <DollarSign className="w-3.5 h-3.5 text-harvest-hover" />
              Shared Cost Formula:
            </span>
            <p className="text-[11px] text-neutral-600 leading-relaxed font-mono">
              Member Cost = (Farmer Kg ÷ Total Pool Kg) × Single Vehicle Rate
            </p>
          </div>
        </div>

        {/* Member Breakdown Inset Group */}
        <div className="bg-white/80 backdrop-blur-xl p-5 sm:p-6 rounded-[28px] border border-black/[0.06] shadow-apple-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-black/[0.05]">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-forest-700" />
              <h3 className="text-sm font-bold tracking-tight text-neutral-900">
                {lang === 'hi' ? 'किसान बचत विश्लेषण' : 'Farmer Economics Breakdown'}
              </h3>
            </div>
            <span className="text-xs text-neutral-400 font-medium">
              {selectedPool.members.length} Farmers Sharing
            </span>
          </div>

          <div className="space-y-3">
            {selectedPool.members.map((m) => (
              <div
                key={m.farmerId}
                className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.04] space-y-2 hover:bg-black/[0.04] transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-neutral-900">{m.farmerName}</span>
                    <span className="text-[11px] text-neutral-500 block font-medium">{m.village}</span>
                  </div>
                  <span className="text-xs font-bold text-forest-900 bg-forest-100 px-2.5 py-0.5 rounded-full">
                    {m.quantityKg} kg
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1.5 border-t border-black/[0.04]">
                  <div className="p-1.5 rounded-xl bg-white shadow-apple-sm">
                    <span className="text-[9px] text-neutral-400 uppercase font-semibold block">Solo Cost</span>
                    <span className="font-semibold text-neutral-400 line-through">₹{m.individualCost}</span>
                  </div>
                  <div className="p-1.5 rounded-xl bg-white shadow-apple-sm">
                    <span className="text-[9px] text-neutral-400 uppercase font-semibold block">Pooled Cost</span>
                    <span className="font-bold text-neutral-900">₹{m.sharedCost}</span>
                  </div>
                  <div className="p-1.5 rounded-xl bg-forest-50 border border-forest-100 shadow-apple-sm">
                    <span className="text-[9px] text-forest-800 uppercase font-bold block">Net Saved</span>
                    <span className="font-extrabold text-forest-700">₹{m.savings}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Other Routes */}
          <div className="pt-2 border-t border-black/[0.05]">
            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block mb-2">
              Other Active Routes:
            </span>
            <div className="space-y-2">
              {pools.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPoolId(p.id)}
                  className={`w-full text-left p-3 rounded-2xl border text-xs flex items-center justify-between transition-all active:scale-98 ${
                    p.id === selectedPoolId
                      ? 'bg-forest-50/70 border-forest-600/50 font-bold shadow-apple-sm'
                      : 'bg-black/[0.02] border-black/[0.04] hover:bg-black/[0.04]'
                  }`}
                >
                  <div>
                    <span className="text-neutral-900 block font-medium">{p.title}</span>
                    <span className="text-[10px] text-neutral-500 font-normal">{p.destination}</span>
                  </div>
                  <span className="text-xs font-bold text-forest-800">
                    {p.totalQuantity}/{p.vehicleCapacity} kg
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Join Pool Sheet Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/35 backdrop-blur-sm transition-opacity" onClick={() => setShowJoinModal(false)} />
          <div className="relative w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-[32px] shadow-apple-modal border border-black/[0.08] p-6 sm:p-7 z-10 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.05]">
              <h3 className="text-base font-bold tracking-tight text-neutral-900">
                Join {selectedPool.title}
              </h3>
              <button onClick={() => setShowJoinModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleJoinConfirm} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                  Farmer Name
                </label>
                <input
                  type="text"
                  value={joinFarmerName}
                  onChange={(e) => setJoinFarmerName(e.target.value)}
                  className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-3 py-2 text-neutral-900 font-medium focus:outline-none focus:ring-2 focus:ring-forest-700/20"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                  Pickup Landmark
                </label>
                <input
                  type="text"
                  value={joinVillage}
                  onChange={(e) => setJoinVillage(e.target.value)}
                  className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-3 py-2 text-neutral-900 font-medium focus:outline-none focus:ring-2 focus:ring-forest-700/20"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                  Quantity (kg)
                </label>
                <input
                  type="number"
                  min={50}
                  max={selectedPool.vehicleCapacity - selectedPool.totalQuantity}
                  value={joinQty}
                  onChange={(e) => setJoinQty(Number(e.target.value))}
                  className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-3 py-2 text-neutral-900 font-bold focus:outline-none focus:ring-2 focus:ring-forest-700/20"
                />
                <span className="text-[10px] text-forest-700 mt-1 block font-medium">
                  Truck cargo space left: {selectedPool.vehicleCapacity - selectedPool.totalQuantity} kg
                </span>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="flex-1 py-2.5 rounded-full border border-black/[0.08] font-semibold text-neutral-600 hover:bg-black/[0.03] active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-forest-900 hover:bg-forest-800 active:scale-95 text-white font-semibold shadow-apple-sm transition-all"
                >
                  Confirm Pooling
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Route Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/35 backdrop-blur-sm transition-opacity" onClick={() => setShowCreateModal(false)} />
          <div className="relative w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-[32px] shadow-apple-modal border border-black/[0.08] p-6 sm:p-7 z-10 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.05]">
              <h3 className="text-base font-bold tracking-tight text-neutral-900">Create New Route</h3>
              <button onClick={() => setShowCreateModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePool} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                  Route Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-3 py-2 text-neutral-900 font-medium focus:outline-none focus:ring-2 focus:ring-forest-700/20"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                  Destination Mandi
                </label>
                <input
                  type="text"
                  value={newDest}
                  onChange={(e) => setNewDest(e.target.value)}
                  className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-3 py-2 text-neutral-900 font-medium focus:outline-none focus:ring-2 focus:ring-forest-700/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                    Capacity (kg)
                  </label>
                  <input
                    type="number"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(Number(e.target.value))}
                    className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-3 py-2 text-neutral-900 font-medium focus:outline-none focus:ring-2 focus:ring-forest-700/20"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                    Vehicle Cost (₹)
                  </label>
                  <input
                    type="number"
                    value={newCost}
                    onChange={(e) => setNewCost(Number(e.target.value))}
                    className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-3 py-2 text-neutral-900 font-medium focus:outline-none focus:ring-2 focus:ring-forest-700/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                  Departure Time
                </label>
                <input
                  type="text"
                  value={newDeparture}
                  onChange={(e) => setNewDeparture(e.target.value)}
                  className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-3 py-2 text-neutral-900 font-medium focus:outline-none focus:ring-2 focus:ring-forest-700/20"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 rounded-full border border-black/[0.08] font-semibold text-neutral-600 hover:bg-black/[0.03] active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-forest-900 hover:bg-forest-800 active:scale-95 text-white font-semibold shadow-apple-sm transition-all"
                >
                  Publish Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
