import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Calendar,
  Sparkles,
  Info,
  Scale,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { dataService } from '../services/dataService';
import { Language } from '../services/i18n';

interface ContextType {
  lang: Language;
  onOpenVoice: () => void;
  onOpenAI: () => void;
}

export const PriceTrendsPage: React.FC = () => {
  const { lang } = useOutletContext<ContextType>();

  const [selectedCropId, setSelectedCropId] = useState<string>('crop-potato');
  const [selectedMandiId, setSelectedMandiId] = useState<string>('mandi-shb-pot');
  const [trendRange, setTrendRange] = useState<'7d' | '30d'>('7d');

  const crops = dataService.getCrops();
  const allMandis = dataService.getMandis();
  const availableMandis = allMandis.filter(m => m.cropId === selectedCropId);

  const trendStats = useMemo(() => {
    return dataService.getPriceTrends(selectedCropId, selectedMandiId);
  }, [selectedCropId, selectedMandiId]);

  const chartData = useMemo(() => {
    const historicalPoints = trendStats.historical.map(h => ({
      date: h.date,
      'Actual / Simulated Price': h.price,
      'Moving Avg Projected': null,
    }));

    const projectedPoints = trendStats.projection.map(p => ({
      date: p.date,
      'Actual / Simulated Price': p.date === 'Today' ? p.price : null,
      'Moving Avg Projected': p.price,
    }));

    return [...historicalPoints.slice(0, -1), ...projectedPoints];
  }, [trendStats]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
              {lang === 'hi' ? 'मंडी भाव रुझान व सांख्यिकी' : 'Price Trend Intelligence'}
            </h1>
            <span className="text-[10px] font-semibold bg-forest-100 text-forest-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Moving Average Model
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1 font-normal">
            {lang === 'hi'
              ? 'ऐतिहासिक भाव विश्लेषण, उतार-चढ़ाव (Volatility) और पारदर्शी अनुमान।'
              : 'Historical price movement analysis, market volatility indexes, and statistical projections.'}
          </p>
        </div>
      </div>

      {/* Apple Notice Pill */}
      <div className="p-3.5 rounded-2xl bg-black/[0.02] border border-black/[0.05] text-xs text-neutral-600 flex items-center gap-2.5">
        <ShieldAlert className="w-4 h-4 text-forest-700 shrink-0" />
        <span className="font-normal text-[11px] leading-relaxed">
          Price trend estimates are informational and calculated using a 3-day simple moving average. They are not guaranteed future predictions.
        </span>
      </div>

      {/* Apple Inset Filter Bar */}
      <div className="bg-white/80 backdrop-blur-xl p-4 sm:p-5 rounded-[28px] border border-black/[0.06] shadow-apple-card">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Crop Selector */}
          <div>
            <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">Select Crop</label>
            <select
              value={selectedCropId}
              onChange={(e) => {
                setSelectedCropId(e.target.value);
                const firstMandi = allMandis.find(m => m.cropId === e.target.value);
                if (firstMandi) setSelectedMandiId(firstMandi.id);
              }}
              className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-3 py-2 text-xs font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-forest-700/20 cursor-pointer"
            >
              {crops.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.cropName} ({c.hindiName.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Mandi Selector */}
          <div>
            <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">Mandi Yard</label>
            <select
              value={selectedMandiId}
              onChange={(e) => setSelectedMandiId(e.target.value)}
              className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-3 py-2 text-xs font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-forest-700/20 cursor-pointer"
            >
              {availableMandis.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.mandiName} ({m.distanceKm} km)
                </option>
              ))}
            </select>
          </div>

          {/* Segmented Horizon Picker */}
          <div>
            <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">Horizon</label>
            <div className="flex bg-black/[0.04] p-0.5 rounded-xl border border-black/[0.04] text-xs">
              <button
                onClick={() => setTrendRange('7d')}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                  trendRange === '7d' ? 'bg-white text-neutral-900 shadow-apple-sm' : 'text-neutral-500'
                }`}
              >
                7-Day Trend
              </button>
              <button
                onClick={() => setTrendRange('30d')}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                  trendRange === '30d' ? 'bg-white text-neutral-900 shadow-apple-sm' : 'text-neutral-500'
                }`}
              >
                30-Day Window
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Apple Stocks Style Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Current Benchmark */}
        <div className="p-5 rounded-[26px] bg-white border border-black/[0.06] shadow-apple-card">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 block">Today's Benchmark</span>
          <span className="text-2xl font-extrabold text-neutral-900 mt-1 block tracking-tight">
            ₹{trendStats.currentPrice.toFixed(2)}/kg
          </span>
          <div className="flex items-center gap-1 text-[11px] mt-1 font-semibold">
            {trendStats.percentageChange >= 0 ? (
              <span className="text-forest-700 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> +{trendStats.percentageChange}%
              </span>
            ) : (
              <span className="text-mandi-red flex items-center">
                <ArrowDownRight className="w-3.5 h-3.5" /> {trendStats.percentageChange}%
              </span>
            )}
            <span className="text-neutral-400 font-normal">vs last week</span>
          </div>
        </div>

        {/* 7-Day Average */}
        <div className="p-5 rounded-[26px] bg-white border border-black/[0.06] shadow-apple-card">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 block">7-Day Rolling Avg</span>
          <span className="text-2xl font-extrabold text-neutral-900 mt-1 block tracking-tight">
            ₹{trendStats.sevenDayAvg.toFixed(2)}/kg
          </span>
          <span className="text-[11px] text-neutral-400 mt-1 block font-medium">Weighted Agmarknet</span>
        </div>

        {/* Volatility */}
        <div className="p-5 rounded-[26px] bg-white border border-black/[0.06] shadow-apple-card">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 block">Market Volatility</span>
          <span className="text-2xl font-extrabold text-forest-800 mt-1 block tracking-tight">
            {trendStats.volatility}
          </span>
          <span className="text-[11px] text-neutral-400 mt-1 block font-medium">Fluctuation index</span>
        </div>

        {/* High & Low Range */}
        <div className="p-5 rounded-[26px] bg-white border border-black/[0.06] shadow-apple-card">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 block">Weekly Range</span>
          <span className="text-lg font-bold text-neutral-900 mt-1 block tracking-tight">
            ₹{trendStats.lowestPrice} — ₹{trendStats.highestPrice}
          </span>
          <span className="text-[11px] text-forest-700 font-semibold mt-1 block">
            Spread: ₹{(trendStats.highestPrice - trendStats.lowestPrice).toFixed(2)}/kg
          </span>
        </div>
      </div>

      {/* Main Apple Stocks Area Curve */}
      <div className="bg-white/80 backdrop-blur-xl p-5 sm:p-6 rounded-[28px] border border-black/[0.06] shadow-apple-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-black/[0.05]">
          <div>
            <h3 className="text-sm font-bold tracking-tight text-neutral-900">
              Price Evolution & Moving Average Projection
            </h3>
            <p className="text-xs text-neutral-500 font-normal">
              Solid green area indicates recorded simulated prices; dashed curve shows statistical continuation.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-forest-700" /> Recorded Price
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-harvest" /> 3-Day Moving Avg
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 15, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#218653" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#218653" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorProj" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F4A340" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#F4A340" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#8E9D93' }} tickLine={false} />
              <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#8E9D93' }} tickLine={false} />
              <Tooltip
                formatter={(val: any) => [`₹${Number(val).toFixed(2)}/kg`, '']}
                contentStyle={{ backgroundColor: 'rgba(22, 78, 53, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '16px', color: '#fff', fontSize: '11px', border: 'none' }}
              />
              <Area
                type="monotone"
                dataKey="Actual / Simulated Price"
                stroke="#218653"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorPrice)"
              />
              <Area
                type="monotone"
                dataKey="Moving Avg Projected"
                stroke="#F4A340"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#colorProj)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
