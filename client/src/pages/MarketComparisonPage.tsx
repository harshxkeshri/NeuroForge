import React, { useState, useMemo } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import {
  Scale,
  Award,
  Sliders,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Volume2,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
  MapPin,
  Truck,
  ArrowUpDown,
  Check,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { dataService } from '../services/dataService';
import { rankMarkets } from '../algorithms/marketRanker';
import { voiceService } from '../services/voiceService';
import { Language, t } from '../services/i18n';

interface ContextType {
  lang: Language;
  onOpenVoice: () => void;
  onOpenAI: () => void;
}

export const MarketComparisonPage: React.FC = () => {
  const { lang, onOpenVoice } = useOutletContext<ContextType>();
  const location = useLocation();

  const initialCrop = (location.state as { cropId?: string })?.cropId || 'crop-potato';
  const initialQty = (location.state as { quantityKg?: number })?.quantityKg || 1000;

  // Filter inputs
  const [selectedCropId, setSelectedCropId] = useState<string>(initialCrop);
  const [quantityKg, setQuantityKg] = useState<number>(initialQty);
  const [farmerLocation, setFarmerLocation] = useState<string>('Ghaziabad, UP');
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(60);
  const [isPooled, setIsPooled] = useState<boolean>(false);
  const [sortField, setSortField] = useState<'netReturn' | 'pricePerKg' | 'distanceKm'>('netReturn');

  const crops = dataService.getCrops();
  const allMandis = dataService.getMandis();
  const currentCrop = crops.find(c => c.id === selectedCropId) || crops[0];

  // Dynamic ranking calculation
  const rankedMarkets = useMemo(() => {
    const list = rankMarkets({
      cropId: selectedCropId,
      quantityKg,
      mandis: allMandis,
      maxDistanceKm,
      isPooled,
    });

    if (sortField === 'pricePerKg') {
      return [...list].sort((a, b) => b.mandi.pricePerKg - a.mandi.pricePerKg);
    } else if (sortField === 'distanceKm') {
      return [...list].sort((a, b) => a.mandi.distanceKm - b.mandi.distanceKm);
    }
    return list;
  }, [selectedCropId, quantityKg, allMandis, maxDistanceKm, isPooled, sortField]);

  const bestMarket = rankedMarkets[0];

  const chartData = useMemo(() => {
    return rankedMarkets.slice(0, 6).map((item) => ({
      name: item.mandi.mandiName.split(' ')[0],
      fullName: item.mandi.mandiName,
      'Gross Sale': item.grossSale,
      'Net Return': item.netReturn,
      'Transport Cost': item.transportCost,
    }));
  }, [rankedMarkets]);

  const handleSpeakRecommendation = () => {
    if (!bestMarket) return;
    const msg = lang === 'hi'
      ? `मंडीमैच विश्लेषण: ${bestMarket.mandi.mandiName} सबसे अधिक शुद्ध मुनाफा (₹${bestMarket.netReturn}) देती है, क्योंकि यहाँ परिवहन खर्च केवल ₹${bestMarket.transportCost} है।`
      : `MandiMatch recommendation: ${bestMarket.mandi.mandiName} yields the highest estimated net return of ₹${bestMarket.netReturn} after deducting ₹${bestMarket.transportCost} in transportation.`;

    voiceService.speakRecommendation(msg, lang === 'hi' ? 'hi-IN' : 'en-IN');
  };

  return (
    <div className="space-y-6">
      {/* Title & Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
              {lang === 'hi' ? 'मंडी भाव व शुद्ध मुनाफा तुलना इंजन' : 'Market Comparison Engine'}
            </h1>
            <span className="text-[10px] font-semibold bg-forest-100 text-forest-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Formula Grounded
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1 font-normal">
            {lang === 'hi'
              ? 'परिवहन दूरी और मंडी शुल्क घटाकर वास्तविक जेब में आने वाली शुद्ध रकम की लाइव गणना।'
              : 'Real-time calculation of net pocket profit: Gross Sale − Transport Expenses − Cess & Labor.'}
          </p>
        </div>

        <button
          onClick={onOpenVoice}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/[0.04] hover:bg-black/[0.07] active:scale-95 text-neutral-800 text-xs font-medium self-start sm:self-auto transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-forest-700" />
          <span>{lang === 'hi' ? 'बोलकर बदलें' : 'Voice Update'}</span>
        </button>
      </div>

      {/* Apple Inset Controls Card */}
      <div className="bg-white/80 backdrop-blur-xl p-5 sm:p-6 rounded-[28px] border border-black/[0.06] shadow-apple-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.05] flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-forest-700" />
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              {lang === 'hi' ? 'तुलना मापदंड बदलें' : 'Interactive Controls'}
            </span>
          </div>
          <span className="text-xs font-medium text-forest-700">
            {rankedMarkets.length} {lang === 'hi' ? 'मंडियां विश्लेषित' : 'eligible mandis evaluated'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Crop */}
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

          {/* Quantity */}
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

          {/* Max Distance iOS Slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                {lang === 'hi' ? 'अधिकतम दूरी' : 'Radius'}
              </label>
              <span className="text-xs font-bold text-neutral-800">{maxDistanceKm} km</span>
            </div>
            <input
              type="range"
              min={10}
              max={80}
              step={5}
              value={maxDistanceKm}
              onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
              className="w-full h-1.5 bg-black/[0.08] rounded-lg cursor-pointer"
            />
          </div>

          {/* Pooling Mode Segmented Pill */}
          <div>
            <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              {lang === 'hi' ? 'परिवहन मोड' : 'Freight Share'}
            </label>
            <button
              onClick={() => setIsPooled(!isPooled)}
              className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
                isPooled
                  ? 'bg-forest-900 text-white border-forest-900 shadow-apple-sm'
                  : 'bg-black/[0.03] text-neutral-600 border-black/[0.05] hover:bg-black/[0.06]'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>{isPooled ? 'Pooled (-40%)' : 'Solo Vehicle'}</span>
            </button>
          </div>

          {/* Sorting Segmented Control */}
          <div>
            <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              {lang === 'hi' ? 'क्रमबद्ध करें' : 'Sort By'}
            </label>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as any)}
              className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-3 py-2 text-xs font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-forest-700/20 focus:bg-white transition-all cursor-pointer"
            >
              <option value="netReturn">Highest Net Return (Default)</option>
              <option value="pricePerKg">Highest Price / kg</option>
              <option value="distanceKm">Nearest Distance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recommendation Hero Spec Card */}
      {bestMarket && (
        <div className="p-6 sm:p-7 rounded-[32px] bg-forest-900 text-white shadow-apple-modal space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 rounded-full bg-forest-700/30 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-harvest text-forest-900 flex items-center justify-center font-extrabold text-xl shadow-apple-sm">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/15 text-white px-2.5 py-0.5 rounded-full">
                    {t('bestOptionBadge', lang)}
                  </span>
                  <span className="text-xs text-forest-200 font-medium">
                    {bestMarket.mandi.distanceKm} km from Ghaziabad
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight mt-0.5">
                  {bestMarket.mandi.mandiName}
                </h2>
              </div>
            </div>

            <button
              onClick={handleSpeakRecommendation}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-semibold transition-all self-start sm:self-auto border border-white/15 shadow-apple-sm"
            >
              <Volume2 className="w-4 h-4 text-harvest" />
              <span>{lang === 'hi' ? 'सिफारिश सुनें' : 'Listen to Advice'}</span>
            </button>
          </div>

          <div className="relative z-10 text-xs sm:text-sm text-forest-100 leading-relaxed font-normal max-w-3xl">
            {bestMarket.recommendationReason}
          </div>

          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/[0.08] border border-white/10 shadow-apple-sm">
              <span className="text-forest-200 text-[10px] uppercase font-semibold tracking-wider block">Rate Per Kg</span>
              <span className="text-base font-bold text-white mt-0.5 block tracking-tight">
                ₹{bestMarket.mandi.pricePerKg}/kg
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.08] border border-white/10 shadow-apple-sm">
              <span className="text-forest-200 text-[10px] uppercase font-semibold tracking-wider block">Gross Sale</span>
              <span className="text-base font-bold text-white mt-0.5 block tracking-tight">
                ₹{bestMarket.grossSale.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.08] border border-white/10 shadow-apple-sm">
              <span className="text-forest-200 text-[10px] uppercase font-semibold tracking-wider block">Transport Expense</span>
              <span className="text-base font-bold text-harvest mt-0.5 block tracking-tight">
                - ₹{bestMarket.transportCost.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-harvest text-forest-900 font-bold shadow-apple-sm">
              <span className="text-[10px] uppercase tracking-wider block opacity-90 font-semibold">Net In-Pocket Profit</span>
              <span className="text-lg font-extrabold mt-0.5 block tracking-tight">
                ₹{bestMarket.netReturn.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Visual Comparison Chart */}
      <div className="bg-white/80 backdrop-blur-xl p-5 sm:p-6 rounded-[28px] border border-black/[0.06] shadow-apple-card space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-black/[0.05]">
          <div>
            <h3 className="text-sm font-bold tracking-tight text-neutral-900">
              {lang === 'hi' ? 'मंडी तुलना: कुल बिक्री बनाम शुद्ध कमाई' : 'Visual Economics: Gross Sale vs Net In-Pocket Earnings'}
            </h3>
            <p className="text-xs text-neutral-500 font-normal">
              Notice how high transport costs compress net returns in distant mandis.
            </p>
          </div>
          <span className="text-xs text-neutral-400 font-medium hidden sm:inline">Rupees (₹)</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 15, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#1A2920' }} />
              <YAxis tick={{ fontSize: 10, fill: '#8E9D93' }} tickFormatter={(val) => `₹${val / 1000}k`} />
              <Tooltip
                formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
                contentStyle={{ backgroundColor: 'rgba(22, 78, 53, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '16px', color: '#fff', fontSize: '11px', border: 'none' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="Gross Sale" fill="#C2E8CE" radius={[8, 8, 0, 0]} />
              <Bar dataKey="Net Return" fill="#218653" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Apple Inset Grouped Table */}
      <div className="bg-white/80 backdrop-blur-xl rounded-[28px] border border-black/[0.06] shadow-apple-card overflow-hidden">
        <div className="p-5 pb-3 border-b border-black/[0.05] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold tracking-tight text-neutral-900">
              {lang === 'hi' ? 'विस्तृत मंडी तुलना तालिका' : 'Comprehensive Market Ranking Table'}
            </h3>
            <p className="text-xs text-neutral-500 font-normal">
              Formulas: Gross Sale = Qty × Price | Net Return = Gross − Transport − Cess
            </p>
          </div>
          <span className="text-[11px] text-forest-800 font-semibold bg-forest-100 px-3 py-1 rounded-full">
            Ranked by {sortField}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-black/[0.02] text-neutral-400 text-[10px] uppercase font-semibold tracking-wider border-b border-black/[0.05]">
                <th className="py-3 px-4">Rank / Market</th>
                <th className="py-3 px-4">Price / kg</th>
                <th className="py-3 px-4">Distance</th>
                <th className="py-3 px-4">Transport Cost</th>
                <th className="py-3 px-4">Cess & Labor</th>
                <th className="py-3 px-4">Gross Sale</th>
                <th className="py-3 px-4 text-right">Net Return</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04]">
              {rankedMarkets.map((res) => (
                <tr
                  key={res.mandi.id}
                  className={`hover:bg-black/[0.02] transition-colors ${
                    res.isBest ? 'bg-forest-50/50 font-semibold' : ''
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          res.isBest
                            ? 'bg-forest-900 text-white shadow-apple-sm'
                            : 'bg-black/[0.05] text-neutral-600'
                        }`}
                      >
                        {res.rank}
                      </span>
                      <div>
                        <span className="font-semibold text-neutral-900 block">{res.mandi.mandiName}</span>
                        <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-normal">
                          <span>{res.mandi.district}</span>
                          <span>•</span>
                          <span className="text-forest-700">{res.mandi.source}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-neutral-900">
                    ₹{res.mandi.pricePerKg.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 text-neutral-600 font-medium">
                    {res.mandi.distanceKm} km
                  </td>

                  <td className="py-3.5 px-4 text-mandi-red font-medium">
                    - ₹{res.transportCost.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3.5 px-4 text-neutral-500 font-medium">
                    - ₹{res.otherCosts.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3.5 px-4 text-neutral-900 font-medium">
                    ₹{res.grossSale.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <span className="text-sm font-extrabold text-neutral-900 block tracking-tight">
                      ₹{res.netReturn.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-forest-700 font-semibold block">
                      ₹{res.netPricePerKg}/kg net
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
