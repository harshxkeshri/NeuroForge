import React, { useState, useMemo } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  MapPin,
  Truck,
  Calendar,
  Phone,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  Check,
  X,
  MessageSquare,
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { matchBuyers } from '../algorithms/buyerMatcher';
import { BuyerOffer } from '../types';
import { Language } from '../services/i18n';

interface ContextType {
  lang: Language;
  onOpenVoice: () => void;
  onOpenAI: () => void;
}

export const BuyerMarketplacePage: React.FC = () => {
  const { lang, onOpenVoice } = useOutletContext<ContextType>();
  const location = useLocation();

  const initialCrop = (location.state as { cropId?: string })?.cropId || 'crop-potato';
  const initialQty = (location.state as { quantityKg?: number })?.quantityKg || 1000;

  // Filter state
  const [selectedCropId, setSelectedCropId] = useState<string>(initialCrop);
  const [farmerQty, setFarmerQty] = useState<number>(initialQty);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyPickup, setOnlyPickup] = useState<boolean>(false);
  const [maxDistance, setMaxDistance] = useState<number>(60);

  // Modals & Handshake State
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [editingBuyer, setEditingBuyer] = useState<BuyerOffer | null>(null);
  const [interestedBuyer, setInterestedBuyer] = useState<BuyerOffer | null>(null);
  const [interestSubmitted, setInterestSubmitted] = useState<boolean>(false);
  const [contactedBuyers, setContactedBuyers] = useState<Record<string, boolean>>({});

  // Form State for Create/Edit
  const [formName, setFormName] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formCrop, setFormCrop] = useState('crop-potato');
  const [formQty, setFormQty] = useState(2000);
  const [formPrice, setFormPrice] = useState(21.0);
  const [formLocation, setFormLocation] = useState('Noida Sector 62');
  const [formDistance, setFormDistance] = useState(20);
  const [formPickup, setFormPickup] = useState(true);
  const [formPhone, setFormPhone] = useState('+91 99100 12345');

  const crops = dataService.getCrops();
  const [buyerOffers, setBuyerOffers] = useState<BuyerOffer[]>(() => dataService.getBuyerOffers());

  const currentCrop = crops.find(c => c.id === selectedCropId) || crops[0];

  const matchedBuyers = useMemo(() => {
    const matched = matchBuyers({
      cropId: selectedCropId,
      quantityKg: farmerQty,
      offers: buyerOffers,
      farmerBasePrice: currentCrop.basePrice,
      maxDistanceKm: maxDistance,
      onlyPickup,
    });

    if (!searchQuery.trim()) return matched;

    const q = searchQuery.toLowerCase();
    return matched.filter(
      m =>
        m.buyer.buyerName.toLowerCase().includes(q) ||
        m.buyer.location.toLowerCase().includes(q) ||
        m.buyer.companyType.toLowerCase().includes(q)
    );
  }, [selectedCropId, farmerQty, buyerOffers, currentCrop.basePrice, maxDistance, onlyPickup, searchQuery]);

  const handleSaveOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBuyer) {
      const updated = dataService.updateBuyerOffer(editingBuyer.id, {
        buyerName: formName,
        companyType: formCompany,
        cropId: formCrop,
        quantityRequired: Number(formQty),
        offeredPrice: Number(formPrice),
        location: formLocation,
        distanceKm: Number(formDistance),
        pickupAvailable: formPickup,
        contactPhone: formPhone,
      });
      if (updated) {
        setBuyerOffers(dataService.getBuyerOffers());
      }
      setEditingBuyer(null);
    } else {
      dataService.addBuyerOffer({
        buyerName: formName,
        companyType: formCompany || 'FPO / Wholesale Trader',
        cropId: formCrop,
        quantityRequired: Number(formQty),
        offeredPrice: Number(formPrice),
        location: formLocation,
        distanceKm: Number(formDistance),
        pickupAvailable: formPickup,
        verified: true,
        status: 'open',
        expiryDate: 'In 7 days',
        contactPhone: formPhone,
      });
      setBuyerOffers(dataService.getBuyerOffers());
      setShowCreateModal(false);
    }
  };

  const handleDeleteOffer = (id: string) => {
    if (window.confirm('Are you sure you want to delete this buyer offer?')) {
      dataService.deleteBuyerOffer(id);
      setBuyerOffers(dataService.getBuyerOffers());
    }
  };

  const handleOpenEdit = (buyer: BuyerOffer) => {
    setEditingBuyer(buyer);
    setFormName(buyer.buyerName);
    setFormCompany(buyer.companyType);
    setFormCrop(buyer.cropId);
    setFormQty(buyer.quantityRequired);
    setFormPrice(buyer.offeredPrice);
    setFormLocation(buyer.location);
    setFormDistance(buyer.distanceKm);
    setFormPickup(buyer.pickupAvailable);
    setFormPhone(buyer.contactPhone);
  };

  const handleOpenCreate = () => {
    setEditingBuyer(null);
    setFormName('');
    setFormCompany('Agro Foods Processing');
    setFormCrop(selectedCropId);
    setFormQty(2500);
    setFormPrice(currentCrop.basePrice + 2);
    setFormLocation('Patparganj Hub');
    setFormDistance(18);
    setFormPickup(true);
    setFormPhone('+91 99100 88776');
    setShowCreateModal(true);
  };

  const handleConfirmInterest = () => {
    if (interestedBuyer) {
      setContactedBuyers(prev => ({ ...prev, [interestedBuyer.id]: true }));
      setInterestSubmitted(true);
      setTimeout(() => {
        setInterestSubmitted(false);
        setInterestedBuyer(null);
      }, 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
              {lang === 'hi' ? 'सीधे कृषि खरीदार बाज़ार' : 'Direct Buyer Marketplace'}
            </h1>
            <span className="text-[10px] font-semibold bg-harvest/20 text-harvest-hover px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Zero Intermediary
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1 font-normal">
            {lang === 'hi'
              ? 'सत्यापित खुदरा कंपनियों, FPO और खाद्य प्रसंस्करण इकाइयों से सीधे जुड़ें।'
              : 'Connect directly with verified corporate buyers, FPOs, and food processors for better farm-gate pricing.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-forest-900 hover:bg-forest-800 active:scale-95 text-white font-semibold text-xs shadow-apple-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-harvest" />
            <span>{lang === 'hi' ? 'खरीदार प्रस्ताव जोड़ें' : 'Post Demand'}</span>
          </button>
        </div>
      </div>

      {/* Apple Styled Filter and Search Bar */}
      <div className="bg-white/80 backdrop-blur-xl p-4 sm:p-5 rounded-[28px] border border-black/[0.06] shadow-apple-card space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search enterprise..."
              className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl pl-9 pr-3 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-forest-700/20 focus:bg-white transition-all"
            />
          </div>

          {/* Crop Filter */}
          <div>
            <select
              value={selectedCropId}
              onChange={(e) => setSelectedCropId(e.target.value)}
              className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-3 py-2 text-xs font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-forest-700/20 focus:bg-white transition-all cursor-pointer"
            >
              {crops.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.cropName} ({c.hindiName.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Farmer Quantity Matcher */}
          <div>
            <input
              type="number"
              min={100}
              step={100}
              value={farmerQty}
              onChange={(e) => setFarmerQty(Math.max(50, Number(e.target.value)))}
              placeholder="Your Quantity (kg)"
              className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-3 py-2 text-xs font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-forest-700/20 focus:bg-white transition-all"
            />
          </div>

          {/* Max Distance Filter */}
          <div>
            <select
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-3 py-2 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-forest-700/20 focus:bg-white transition-all cursor-pointer"
            >
              <option value={20}>Within 20 km</option>
              <option value={40}>Within 40 km</option>
              <option value={60}>Within 60 km</option>
              <option value={100}>All Distances</option>
            </select>
          </div>

          {/* Farm-Gate Pickup Toggle */}
          <div>
            <button
              onClick={() => setOnlyPickup(!onlyPickup)}
              className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
                onlyPickup
                  ? 'bg-forest-900 text-white border-forest-900 shadow-apple-sm'
                  : 'bg-black/[0.03] text-neutral-600 border-black/[0.05] hover:bg-black/[0.06]'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>{onlyPickup ? 'Farm Pickup Only' : 'All Deliveries'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* App Store Style Editorial Buyer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {matchedBuyers.map(({ buyer, matchScore, totalEarnings, matchReason }) => {
          const isContacted = contactedBuyers[buyer.id];

          return (
            <div
              key={buyer.id}
              className="bg-white rounded-[28px] border border-black/[0.06] shadow-apple-card hover:shadow-apple-hover transition-all p-6 flex flex-col justify-between space-y-4 group"
            >
              {/* Header info */}
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold tracking-tight text-neutral-900 group-hover:text-forest-900">
                        {buyer.buyerName}
                      </h3>
                      {buyer.verified && (
                        <span title="Verified Buyer">
                          <CheckCircle2 className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-neutral-400 font-medium block">
                      {buyer.companyType}
                    </span>
                  </div>

                  {/* Match Pill */}
                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-forest-100 text-forest-900">
                      <Sparkles className="w-3 h-3 text-harvest" />
                      {matchScore}%
                    </span>
                  </div>
                </div>

                {/* Match Reason Rationale */}
                <p className="text-[11px] text-forest-800 bg-forest-50/70 p-2.5 rounded-2xl border border-forest-100 leading-snug font-normal">
                  {matchReason}
                </p>
              </div>

              {/* Price & Volume Group */}
              <div className="grid grid-cols-2 gap-2.5 py-3 border-y border-black/[0.05] text-xs">
                <div>
                  <span className="text-neutral-400 text-[10px] uppercase font-semibold tracking-wider block">Offered Rate</span>
                  <span className="text-lg font-extrabold text-neutral-900 tracking-tight block">
                    ₹{buyer.offeredPrice.toFixed(2)}/kg
                  </span>
                  <span className="text-[10px] text-forest-700 font-semibold block">
                    +₹{(buyer.offeredPrice - currentCrop.basePrice).toFixed(2)} premium
                  </span>
                </div>

                <div>
                  <span className="text-neutral-400 text-[10px] uppercase font-semibold tracking-wider block">Demand Volume</span>
                  <span className="text-sm font-bold text-neutral-800 block">
                    {buyer.quantityRequired.toLocaleString('en-IN')} kg
                  </span>
                  <span className="text-[10px] text-neutral-400 block font-medium">
                    Gross: ₹{totalEarnings.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Location & Delivery */}
              <div className="space-y-1.5 text-xs text-neutral-500 font-medium">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-neutral-400" />
                    {buyer.location} ({buyer.distanceKm} km)
                  </span>
                  <span className="text-neutral-400">{buyer.expiryDate}</span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px]">
                  <Truck className="w-3 h-3 text-forest-700" />
                  <span className={buyer.pickupAvailable ? 'text-forest-800 font-semibold' : 'text-neutral-400'}>
                    {buyer.pickupAvailable ? 'Farm-Gate Pickup Included' : 'Self Delivery'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => setInterestedBuyer(buyer)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-full text-xs font-semibold transition-all active:scale-95 shadow-apple-sm ${
                    isContacted
                      ? 'bg-forest-100 text-forest-900 border border-forest-200'
                      : 'bg-forest-900 hover:bg-forest-800 text-white'
                  }`}
                >
                  {isContacted ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-forest-700" />
                      <span>{lang === 'hi' ? 'अनुरोध भेजा गया' : 'Interest Sent'}</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-3.5 h-3.5 text-harvest" />
                      <span>{lang === 'hi' ? 'सौदा पक्का करें' : 'Express Interest'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleOpenEdit(buyer)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-black/[0.04] active:scale-95 transition-all"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteOffer(buyer.id)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-400 hover:text-mandi-red hover:bg-red-50 active:scale-95 transition-all"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {matchedBuyers.length === 0 && (
        <div className="p-14 text-center bg-white rounded-[28px] border border-black/[0.06] shadow-apple-card space-y-3">
          <ShoppingBag className="w-10 h-10 text-neutral-300 mx-auto" />
          <h3 className="text-sm font-bold text-neutral-900">No Matching Buyers Found</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto font-normal">
            Try adjusting your radius slider, resetting pickup filter, or creating a new buyer offer.
          </p>
        </div>
      )}

      {/* Express Interest Sheet Modal */}
      {interestedBuyer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/35 backdrop-blur-sm transition-opacity" onClick={() => setInterestedBuyer(null)} />
          <div className="relative w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-[32px] shadow-apple-modal border border-black/[0.08] p-6 sm:p-7 z-10 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.05]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-forest-100 flex items-center justify-center text-forest-900">
                  <MessageSquare className="w-4 h-4 text-forest-700" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-neutral-900">
                    {lang === 'hi' ? 'खरीदार से संपर्क अनुरोध' : 'Deal Handshake Request'}
                  </h3>
                  <p className="text-[11px] text-neutral-500 font-normal">{interestedBuyer.buyerName}</p>
                </div>
              </div>
              <button onClick={() => setInterestedBuyer(null)} className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {interestSubmitted ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center mx-auto shadow-apple-sm">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-forest-900">
                  {lang === 'hi' ? 'सफलतापूर्वक भेजा गया!' : 'Offer Request Dispatched!'}
                </h4>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto font-normal">
                  A simulated SMS alert with Ramesh Kumar's produce details was sent to {interestedBuyer.contactPhone}.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-forest-50/70 border border-forest-100 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Crop:</span>
                    <span className="font-semibold text-neutral-900">{currentCrop.cropName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Your Lot:</span>
                    <span className="font-semibold text-neutral-900">{farmerQty.toLocaleString('en-IN')} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Offered Price:</span>
                    <span className="font-extrabold text-forest-900">₹{interestedBuyer.offeredPrice}/kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Pickup Location:</span>
                    <span className="font-medium text-neutral-900">Dundahera, Ghaziabad (Farm Gate)</span>
                  </div>
                </div>

                <p className="text-[11px] text-neutral-500 leading-relaxed font-normal">
                  Clicking confirm will transmit Ramesh's contact and harvest lot to the procurement agent.
                </p>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setInterestedBuyer(null)}
                    className="flex-1 py-2.5 rounded-full border border-black/[0.08] text-xs font-semibold text-neutral-600 hover:bg-black/[0.03] active:scale-95 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmInterest}
                    className="flex-1 py-2.5 rounded-full bg-forest-900 hover:bg-forest-800 active:scale-95 text-white text-xs font-semibold shadow-apple-sm transition-all"
                  >
                    Confirm Handshake
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {(showCreateModal || editingBuyer) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/35 backdrop-blur-sm transition-opacity"
            onClick={() => {
              setShowCreateModal(false);
              setEditingBuyer(null);
            }}
          />
          <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-[32px] shadow-apple-modal border border-black/[0.08] p-6 sm:p-7 z-10 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.05]">
              <h3 className="text-base font-bold tracking-tight text-neutral-900">
                {editingBuyer ? 'Edit Buyer Demand' : 'Post Direct Buyer Demand'}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingBuyer(null);
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveOffer} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                    Buyer Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Safal / Mother Dairy"
                    className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-3 py-2 text-neutral-900 font-medium focus:outline-none focus:ring-2 focus:ring-forest-700/20"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                    Company Type
                  </label>
                  <input
                    type="text"
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    placeholder="e.g. Food Processor / FPO"
                    className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-3 py-2 text-neutral-900 font-medium focus:outline-none focus:ring-2 focus:ring-forest-700/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">Crop</label>
                  <select
                    value={formCrop}
                    onChange={(e) => setFormCrop(e.target.value)}
                    className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-3 py-2 text-neutral-900 font-semibold focus:outline-none focus:ring-2 focus:ring-forest-700/20"
                  >
                    {crops.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.cropName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">Required (kg)</label>
                  <input
                    type="number"
                    value={formQty}
                    onChange={(e) => setFormQty(Number(e.target.value))}
                    className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-3 py-2 text-neutral-900 font-medium focus:outline-none focus:ring-2 focus:ring-forest-700/20"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">Price (₹/kg)</label>
                  <input
                    type="number"
                    step={0.5}
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-3 py-2 text-neutral-900 font-medium focus:outline-none focus:ring-2 focus:ring-forest-700/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-3 py-2 text-neutral-900 font-medium focus:outline-none focus:ring-2 focus:ring-forest-700/20"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">Distance (km)</label>
                  <input
                    type="number"
                    value={formDistance}
                    onChange={(e) => setFormDistance(Number(e.target.value))}
                    className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-3 py-2 text-neutral-900 font-medium focus:outline-none focus:ring-2 focus:ring-forest-700/20"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pickupCb"
                  checked={formPickup}
                  onChange={(e) => setFormPickup(e.target.checked)}
                  className="w-4 h-4 accent-forest-700 rounded"
                />
                <label htmlFor="pickupCb" className="font-medium text-neutral-800">
                  Farm-gate pickup provided by buyer
                </label>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingBuyer(null);
                  }}
                  className="flex-1 py-2.5 rounded-full border border-black/[0.08] font-semibold text-neutral-600 hover:bg-black/[0.03] active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-forest-900 hover:bg-forest-800 active:scale-95 text-white font-semibold shadow-apple-sm transition-all"
                >
                  Save Buyer Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
