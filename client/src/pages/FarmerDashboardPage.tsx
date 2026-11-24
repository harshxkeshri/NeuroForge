import React, { useState, useMemo } from 'react';
import { Link, useOutletContext, useLocation } from 'react-router-dom';
import {
  TrendingUp,
  MapPin,
  Scale,
  ShoppingBag,
  Truck,
  Volume2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  Sliders,
  DollarSign,
  ChevronRight,
  Award,
  CheckCircle2,
  Clock,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { CROPS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService';
import { rankMarkets } from '../algorithms/marketRanker';
import { matchBuyers } from '../algorithms/buyerMatcher';
import { voiceService } from '../services/voiceService';
import { Language, t } from '../services/i18n';

interface ContextType {
  lang: Language;
  onOpenVoice: () => void;
  onOpenAI: () => void;
}

export const FarmerDashboardPage: React.FC = () => {
  const { lang, onOpenVoice, onOpenAI } = useOutletContext<ContextType>();
  const location = useLocation();
  const { farmer } = useAuth();

  const initialCrop = (location.state as { cropId?: string })?.cropId || 'crop-potato';
  const initialQty = (location.state as { quantityKg?: number })?.quantityKg || 1000;

  const [selectedCropId, setSelectedCropId] = useState<string>(initialCrop);
  const [quantityKg, setQuantityKg] = useState<number>(initialQty);
  const [farmerLocation, setFarmerLocation] = useState<string>(
    `${farmer.village || 'Dundahera'}, ${farmer.district || 'Ghaziabad'}, ${farmer.state || 'UP'}`
  );
  const [qualityGrade, setQualityGrade] = useState<string>('Grade A (Export/Fair)');
  const [isPooledActive, setIsPooledActive] = useState<boolean>(false);

  const crops = dataService.getCrops();
  const allMandis = dataService.getMandis();
  const allBuyers = dataService.getBuyerOffers();
  const currentCrop = crops.find(c => c.id === selectedCropId) || crops[0];

  const marketRankings = useMemo(() => {
    return rankMarkets({
      cropId: selectedCropId,
      quantityKg,
      mandis: allMandis,
      isPooled: isPooledActive,
    });
  }, [selectedCropId, quantityKg, allMandis, isPooledActive]);

  const buyerMatches = useMemo(() => {
    return matchBuyers({
      cropId: selectedCropId,
      quantityKg,
      offers: allBuyers,
      farmerBasePrice: currentCrop.basePrice,
    });
  }, [selectedCropId, quantityKg, allBuyers, currentCrop.basePrice]);

  const bestMarket = marketRankings[0];
  const bestBuyer = buyerMatches[0];

  const trendStats = useMemo(() => {
    return dataService.getPriceTrends(selectedCropId);
  }, [selectedCropId]);

  const farmerName = farmer.name || 'Ramesh Kumar';
  const initials = farmerName
    .split(' ')
    .filter(Boolean)
    .map(p => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'RK';

  const handleReadAloud = () => {
    if (!bestMarket) return;
    const speech = lang === 'hi'
      ? `नमस्ते ${farmer.hindiName || farmerName} जी। आपके ${quantityKg} किलो ${currentCrop.hindiName} के लिए सर्वोत्तम विकल्प ${bestMarket.mandi.mandiName} है। कुल बिक्री ₹${bestMarket.grossSale} होगी और परिवहन खर्च ₹${bestMarket.transportCost} घटाकर शुद्ध बचत ₹${bestMarket.netReturn} होगी।`
      : `Hello ${farmerName}. For your ${quantityKg} kg of ${currentCrop.cropName}, the recommended market is ${bestMarket.mandi.mandiName}. Estimated gross sale is ₹${bestMarket.grossSale}, transport expense is ₹${bestMarket.transportCost}, yielding net earnings of ₹${bestMarket.netReturn}.`;

    voiceService.speakRecommendation(speech, lang === 'hi' ? 'hi-IN' : 'en-IN');
  };

  return (
    <div className="space-y-6">
      {/* 1. Apple Contact Card Style Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-xl p-5 sm:p-6 rounded-[28px] border border-black/[0.06] shadow-apple-card">
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-forest-900 text-white flex items-center justify-center font-bold text-lg shadow-apple-sm">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                {lang === 'hi' ? `राम-राम, ${farmer.hindiName || farmerName} जी` : `Welcome back, ${farmerName}!`}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold bg-forest-100 text-forest-800 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3 text-forest-700" /> Verified
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-neutral-500 mt-1 font-medium">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-neutral-400" />
                {farmerLocation}
              </span>
              <span>•</span>
              <span className="text-forest-700">Cluster #4</span>
            </div>
          </div>
        </div>

        {/* Quick Voice & Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenVoice}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-black/[0.04] hover:bg-black/[0.07] active:scale-95 text-neutral-800 font-medium text-xs transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-forest-700" />
            <span>{lang === 'hi' ? 'आवाज से अपडेट करें' : 'Voice Input'}</span>
          </button>
          <button
            onClick={onOpenAI}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-forest-900 hover:bg-forest-800 active:scale-95 text-white font-semibold text-xs shadow-apple-sm transition-all"
          >
            <span>{lang === 'hi' ? 'सलाहकार AI' : 'Ask AI'}</span>
          </button>
        </div>
      </div>

      {/* 2. Apple HIG Inset Grouped Harvest Parameter Controls */}
      <div className="bg-white/80 backdrop-blur-xl p-5 sm:p-6 rounded-[28px] border border-black/[0.06] shadow-apple-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.05] flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-forest-700" />
            <h2 className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
              {lang === 'hi' ? 'वर्तमान फसल व उपज विवरण' : 'Active Harvest Parameters'}
            </h2>
          </div>
          <span className="text-xs text-neutral-400 font-medium">
            {lang === 'hi' ? 'परिवर्तन करने पर मुनाफा तुरंत अपडेट होगा' : 'Recalculates dynamically'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Crop Selector */}
          <div>
            <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              {t('crop', lang)}
            </label>
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

          {/* Quantity in kg */}
          <div>
            <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              {t('quantity', lang)}
            </label>
            <input
              type="number"
              min={50}
              step={50}
              value={quantityKg}
              onChange={(e) => setQuantityKg(Math.max(10, Number(e.target.value)))}
              className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-3 py-2 text-xs font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-forest-700/20 focus:bg-white transition-all"
            />
          </div>

          {/* Harvest Location */}
          <div>
            <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              {lang === 'hi' ? 'खेत का स्थान' : 'Farmer Origin'}
            </label>
            <input
              type="text"
              value={farmerLocation}
              onChange={(e) => setFarmerLocation(e.target.value)}
              className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-3 py-2 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-forest-700/20 focus:bg-white transition-all"
            />
          </div>

          {/* Quality Grade */}
          <div>
            <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              {lang === 'hi' ? 'गुणवत्ता ग्रेड' : 'Quality Grade'}
            </label>
            <select
              value={qualityGrade}
              onChange={(e) => setQualityGrade(e.target.value)}
              className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-3 py-2 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-forest-700/20 focus:bg-white transition-all cursor-pointer"
            >
              <option>Grade A (Premium / Export)</option>
              <option>Grade B (Standard Market)</option>
              <option>Grade C (Processing / Bulk)</option>
            </select>
          </div>

          {/* Transport Pooling Segmented Button */}
          <div>
            <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              {lang === 'hi' ? 'साझा परिवहन (Pooling)' : 'Transport Mode'}
            </label>
            <button
              onClick={() => setIsPooledActive(!isPooledActive)}
              className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all active:scale-95 border ${
                isPooledActive
                  ? 'bg-forest-900 text-white border-forest-900 shadow-apple-sm'
                  : 'bg-black/[0.03] text-neutral-600 border-black/[0.05] hover:bg-black/[0.06]'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>{isPooledActive ? 'Pooled (40% Off)' : 'Solo Vehicle'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Apple Health / Fitness Style KPI Inset Group */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Best Estimated Net Return */}
        <div className="p-5 rounded-[26px] bg-forest-900 text-white shadow-apple-card relative overflow-hidden group">
          <div className="flex items-center justify-between text-forest-200 text-xs mb-2">
            <span className="font-medium text-forest-200/90">{t('bestNetReturn', lang)}</span>
            <span className="w-7 h-7 rounded-full bg-forest-800 flex items-center justify-center text-harvest shadow-apple-sm">
              <DollarSign className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            ₹{bestMarket?.netReturn.toLocaleString('en-IN') || '0'}
          </div>
          <div className="flex items-center justify-between text-[11px] text-forest-200 mt-2 font-medium">
            <span>₹{bestMarket?.netPricePerKg || '0'}/kg net in-pocket</span>
            <span className="text-harvest font-semibold">#1 Ranked</span>
          </div>
        </div>

        {/* Card 2: Recommended Market */}
        <div className="p-5 rounded-[26px] bg-white border border-black/[0.06] shadow-apple-card hover:shadow-apple-hover transition-all">
          <div className="flex items-center justify-between text-neutral-500 text-xs mb-2 font-medium">
            <span>{t('recommendedMarket', lang)}</span>
            <span className="w-7 h-7 rounded-full bg-forest-50 flex items-center justify-center text-forest-800">
              <Scale className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight truncate">
            {bestMarket?.mandi.mandiName || 'Sahibabad Mandi'}
          </div>
          <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-2 font-medium">
            <span>{bestMarket?.mandi.distanceKm} km away</span>
            <span className="text-forest-700 font-semibold">₹{bestMarket?.mandi.pricePerKg}/kg</span>
          </div>
        </div>

        {/* Card 3: Best Available Direct Buyer */}
        <div className="p-5 rounded-[26px] bg-white border border-black/[0.06] shadow-apple-card hover:shadow-apple-hover transition-all">
          <div className="flex items-center justify-between text-neutral-500 text-xs mb-2 font-medium">
            <span>{t('bestBuyerPrice', lang)}</span>
            <span className="w-7 h-7 rounded-full bg-amber-500/10 flex items-center justify-center text-harvest-hover">
              <ShoppingBag className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight truncate">
            ₹{bestBuyer?.buyer.offeredPrice || '21.00'}/kg
          </div>
          <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-2 font-medium">
            <span className="truncate max-w-[140px]">{bestBuyer?.buyer.buyerName || 'Haldiram Snacks'}</span>
            <span className="text-forest-700 font-semibold">{bestBuyer?.matchScore}% Match</span>
          </div>
        </div>

        {/* Card 4: Potential Transport Savings */}
        <div className="p-5 rounded-[26px] bg-white border border-black/[0.06] shadow-apple-card hover:shadow-apple-hover transition-all">
          <div className="flex items-center justify-between text-neutral-500 text-xs mb-2 font-medium">
            <span>{t('transportSavings', lang)}</span>
            <span className="w-7 h-7 rounded-full bg-forest-50 flex items-center justify-center text-forest-800">
              <Truck className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-forest-800 tracking-tight">
            ₹{isPooledActive ? '1,200 Saved' : '₹550 - ₹1,200'}
          </div>
          <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-2 font-medium">
            <span>2 Farmers Pooling</span>
            <Link to="/pooling" className="text-forest-700 font-semibold hover:underline">
              Join Pool →
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Highlighted Recommendation Card (Apple Spec Sheet) */}
      {bestMarket && (
        <div className="p-6 sm:p-7 rounded-[28px] bg-gradient-to-br from-forest-50/70 via-white to-forest-50/30 border border-forest-600/50 shadow-apple-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-forest-200/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-forest-900 text-white flex items-center justify-center font-bold shadow-apple-sm">
                <Award className="w-5 h-5 text-harvest" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold tracking-tight text-forest-900">
                    {lang === 'hi' ? 'सर्वोत्तम अनुशंसित बिक्री विकल्प' : 'Smart Selling Recommendation'}
                  </h3>
                  <span className="text-[10px] font-semibold bg-forest-700 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Highest Return
                  </span>
                </div>
                <p className="text-xs text-forest-800 font-normal mt-0.5">
                  {bestMarket.recommendationReason}
                </p>
              </div>
            </div>

            {/* Audio Read-Aloud Pill */}
            <button
              onClick={handleReadAloud}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-forest-900 hover:bg-forest-800 active:scale-95 text-white text-xs font-semibold shadow-apple-sm transition-all shrink-0"
              title="Listen to recommendation"
            >
              <Volume2 className="w-3.5 h-3.5 text-harvest" />
              <span>{lang === 'hi' ? 'सुझाव सुनें' : 'Listen Aloud'}</span>
            </button>
          </div>

          {/* Mathematical breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-white border border-black/[0.05] shadow-apple-sm">
              <span className="text-neutral-400 text-[10px] uppercase font-semibold tracking-wider block">1. Gross Sale</span>
              <span className="text-sm font-bold text-neutral-900 block mt-0.5">
                ₹{bestMarket.grossSale.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-neutral-400 font-medium">
                {quantityKg} kg × ₹{bestMarket.mandi.pricePerKg}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-black/[0.05] shadow-apple-sm">
              <span className="text-neutral-400 text-[10px] uppercase font-semibold tracking-wider block">2. Transport Cost</span>
              <span className="text-sm font-bold text-mandi-red block mt-0.5">
                - ₹{bestMarket.transportCost.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-neutral-400 font-medium">
                {bestMarket.mandi.distanceKm} km transit {isPooledActive ? '(Pooled)' : '(Solo)'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-black/[0.05] shadow-apple-sm">
              <span className="text-neutral-400 text-[10px] uppercase font-semibold tracking-wider block">3. Cess & Labor</span>
              <span className="text-sm font-bold text-mandi-red block mt-0.5">
                - ₹{bestMarket.otherCosts.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-neutral-400 font-medium">
                {bestMarket.mandi.marketFeePercent}% cess + loading
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-forest-900 text-white shadow-apple-sm">
              <span className="text-forest-200 text-[10px] uppercase font-semibold tracking-wider block">Net In-Pocket</span>
              <span className="text-base font-extrabold text-harvest block mt-0.5 tracking-tight">
                ₹{bestMarket.netReturn.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-forest-200 font-medium">
                ₹{bestMarket.netPricePerKg}/kg final cash
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 5. Apple Inset Grouped Market Overview & 7-Day Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nearby Markets Inset Group */}
        <div className="bg-white/80 backdrop-blur-xl p-5 sm:p-6 rounded-[28px] border border-black/[0.06] shadow-apple-card space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-black/[0.05]">
            <div>
              <h3 className="text-sm font-bold tracking-tight text-neutral-900">
                {lang === 'hi' ? 'आसपास की मंडियों के भाव' : 'Nearby Mandi Prices'}
              </h3>
              <p className="text-xs text-neutral-500 font-normal">
                {currentCrop.cropName} • Origin: Ghaziabad
              </p>
            </div>
            <Link
              to="/compare"
              className="text-xs font-semibold text-forest-700 hover:text-forest-900 inline-flex items-center gap-0.5"
            >
              <span>{lang === 'hi' ? 'पूरी तुलना' : 'Full Compare'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2">
            {marketRankings.slice(0, 4).map((res) => (
              <div
                key={res.mandi.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                  res.isBest
                    ? 'bg-forest-50/70 border-forest-600/50 shadow-apple-sm'
                    : 'bg-black/[0.02] border-black/[0.04] hover:bg-black/[0.04]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-900">
                      {res.mandi.mandiName}
                    </span>
                    {res.isBest && (
                      <span className="text-[9px] font-semibold bg-forest-700 text-white px-1.5 py-0.5 rounded-full uppercase">
                        Best Return
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-1 font-medium">
                    <span>{res.mandi.distanceKm} km</span>
                    <span>•</span>
                    <span>Transit: ₹{res.transportCost}</span>
                    <span>•</span>
                    <span className="text-neutral-400">{res.mandi.lastUpdated}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-extrabold text-neutral-900 block tracking-tight">
                    ₹{res.mandi.pricePerKg}/kg
                  </span>
                  <span className="text-[11px] font-semibold text-forest-700 block">
                    Net: ₹{res.netReturn.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7-Day Apple Stocks Style Trend Chart */}
        <div className="bg-white/80 backdrop-blur-xl p-5 sm:p-6 rounded-[28px] border border-black/[0.06] shadow-apple-card space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-black/[0.05]">
            <div>
              <h3 className="text-sm font-bold tracking-tight text-neutral-900">
                {lang === 'hi' ? '7-दिवसीय भाव रुझान' : '7-Day Price History'}
              </h3>
              <p className="text-xs text-neutral-500 font-normal">
                {trendStats.cropName} • {trendStats.mandiName}
              </p>
            </div>
            <div className="text-right">
              <span className={`text-xs font-bold ${trendStats.percentageChange >= 0 ? 'text-forest-700' : 'text-mandi-red'}`}>
                {trendStats.percentageChange >= 0 ? `+${trendStats.percentageChange}%` : `${trendStats.percentageChange}%`}
              </span>
              <span className="text-[10px] text-neutral-400 block font-medium">Volatility: {trendStats.volatility}</span>
            </div>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendStats.historical} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#8E9D93' }} tickLine={false} />
                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#8E9D93' }} tickLine={false} />
                <Tooltip
                  formatter={(value: any) => [`₹${value}/kg`, 'Simulated Rate']}
                  contentStyle={{ backgroundColor: 'rgba(22, 78, 53, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '16px', color: '#fff', fontSize: '11px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#218653"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#164E35' }}
                  activeDot={{ r: 5, fill: '#F4A340' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1 border-t border-black/[0.05]">
            <div className="p-2 rounded-xl bg-black/[0.02]">
              <span className="text-[10px] text-neutral-400 block uppercase font-semibold">Lowest</span>
              <span className="font-bold text-neutral-900">₹{trendStats.lowestPrice}/kg</span>
            </div>
            <div className="p-2 rounded-xl bg-black/[0.02]">
              <span className="text-[10px] text-neutral-400 block uppercase font-semibold">7d Average</span>
              <span className="font-bold text-forest-800">₹{trendStats.sevenDayAvg}/kg</span>
            </div>
            <div className="p-2 rounded-xl bg-black/[0.02]">
              <span className="text-[10px] text-neutral-400 block uppercase font-semibold">Highest</span>
              <span className="font-bold text-neutral-900">₹{trendStats.highestPrice}/kg</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
