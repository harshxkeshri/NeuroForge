import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  Scale,
  ShoppingBag,
  Truck,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Sparkles,
  ChevronRight,
  Calculator,
  Percent,
} from 'lucide-react';
import { Language } from '../services/i18n';

interface ContextType {
  lang: Language;
  onOpenVoice: () => void;
  onOpenAI: () => void;
}

export const LandingPage: React.FC = () => {
  const { lang, onOpenVoice } = useOutletContext<ContextType>();

  const stats = [
    { label: lang === 'hi' ? 'मंडी भाव तुलना' : 'Markets Compared', value: '8+ Mandis', sub: 'Delhi NCR & UP' },
    { label: lang === 'hi' ? 'सत्यापित खरीदार' : 'Active Direct Buyers', value: '20+ Buyers', sub: 'FPOs & Retail Chains' },
    { label: lang === 'hi' ? 'किसान जुड़े' : 'Farmers Connected', value: '1,240+', sub: 'Sharing Logistics' },
    { label: lang === 'hi' ? 'औसत परिवहन बचत' : 'Avg. Transport Savings', value: '38% Off', sub: 'Via Smart Pooling' },
  ];

  const steps = [
    {
      step: '01',
      title: lang === 'hi' ? 'फसल व मात्रा दर्ज करें' : 'Enter Crop & Quantity',
      desc: lang === 'hi' ? 'आलू, गेहूं, टमाटर आदि का चयन करें या माइक से बोलें।' : 'Input your harvest volume or simply speak into the microphone in Hindi or English.',
      icon: Scale,
    },
    {
      step: '02',
      title: lang === 'hi' ? 'सच्ची शुद्ध कमाई की तुलना करें' : 'Compare Real Net Earnings',
      desc: lang === 'hi' ? 'हम सिर्फ मंडी भाव नहीं, बल्कि ढुलाई और पल्लेदारी घटाकर शुद्ध मुनाफा दिखाते हैं।' : 'We don’t just show headline prices. We subtract diesel, tolls, and loading costs.',
      icon: Calculator,
    },
    {
      step: '03',
      title: lang === 'hi' ? 'सीधे बेचें या साझा गाड़ी बुक करें' : 'Sell Direct or Pool Transport',
      desc: lang === 'hi' ? 'पड़ोसी किसानों के साथ गाड़ी साझा करें और प्रति क्विंटल ₹400-₹1200 बचाएं।' : 'Connect with verified buyers or share a pickup truck with nearby farmers to maximize in-hand cash.',
      icon: Truck,
    },
  ];

  const benefits = [
    {
      title: lang === 'hi' ? 'कोई बिचौलिया या छुपे शुल्क नहीं' : 'No Middlemen or Hidden Deductions',
      desc: lang === 'hi' ? 'पारदर्शी फॉर्मूला: कुल बिक्री - परिवहन खर्च - मंडी शुल्क = आपका शुद्ध पैसा।' : 'Transparent mathematical formula: Gross Sale - Transit Cost - Cess = Net In-Pocket Earnings.',
    },
    {
      title: lang === 'hi' ? 'स्मार्ट साझा परिवहन (Transport Pooling)' : 'Algorithm-Driven Shared Transport',
      desc: lang === 'hi' ? 'आसपास के किसानों के साथ टाटा ऐस या बोलेरो साझा करें और 40% तक बचाएं।' : 'Share Tata Ace or Bolero Pickups with nearby farmers heading to the same market yard.',
    },
    {
      title: lang === 'hi' ? 'सत्यापित कॉर्पोरेट व FPO खरीदार' : 'Verified Direct Institutional Buyers',
      desc: lang === 'hi' ? 'सफल, हल्दीराम, बिगबास्केट और स्थानीय FPO से सीधे खेत पर उठान (Farm-gate Pickup)।' : 'Institutional contracts with Safal, Haldiram, BigBasket and FPOs with farm-gate pickup.',
    },
    {
      title: lang === 'hi' ? 'आवाज व हिंदी में सुलभ' : 'Voice-First Rural Accessibility',
      desc: lang === 'hi' ? 'स्मार्टफोन पर पहली बार उपयोग करने वाले किसानों के लिए सरल हिंदी व ऑडियो सपोर्ट।' : 'Engineered for first-time smartphone farmers with voice search & text-to-speech.',
    },
  ];

  return (
    <div className="space-y-16 py-2">
      {/* Apple Product Style Hero Banner */}
      <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-b from-[#164E35] via-[#1B6343] to-[#164E35] text-white p-8 sm:p-14 lg:p-16 shadow-apple-modal">
        {/* Apple subtle diffused lighting */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-forest-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-harvest/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-xs font-semibold text-forest-100 shadow-apple-sm">
            <span className="w-2 h-2 rounded-full bg-harvest animate-pulse" />
            <span>Build for Bharat • Apple HIG Design</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.12]">
            {lang === 'hi' ? (
              <>
                आपकी फसल। आपका बाज़ार। <br />
                <span className="text-harvest">आपका शुद्ध मुनाफा।</span>
              </>
            ) : (
              <>
                Your Harvest. Your Market. <br />
                <span className="text-harvest">Your True Profit.</span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg text-forest-100/90 leading-relaxed font-normal max-w-2xl">
            {lang === 'hi'
              ? 'मंडी भावों की तुलना करें, सीधे खरीदार खोजें और परिवहन खर्च घटाकर अपनी वास्तविक शुद्ध जेब में कमाई जानें।'
              : 'Compare mandi prices, discover verified direct buyers, and calculate your actual earnings after transportation and market fees.'}
          </p>

          {/* Action Pills */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/compare"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-harvest hover:bg-harvest-hover active:scale-95 text-forest-900 font-bold text-sm shadow-apple-hover transition-all"
            >
              <Scale className="w-4 h-4" />
              <span>{lang === 'hi' ? 'सर्वोत्तम मंडी खोजें' : 'Find Best Market'}</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </Link>

            <Link
              to="/buyers"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white font-semibold text-sm border border-white/20 backdrop-blur-xl shadow-apple-sm transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{lang === 'hi' ? 'सीधे खरीदार देखें' : 'Explore Buyers'}</span>
            </Link>

            <button
              onClick={onOpenVoice}
              className="inline-flex items-center gap-2 px-4 py-3.5 rounded-full bg-black/20 hover:bg-black/30 active:scale-95 text-forest-100 font-medium text-sm border border-white/10 backdrop-blur-xl transition-all"
            >
              <Sparkles className="w-4 h-4 text-harvest" />
              <span>{lang === 'hi' ? 'आवाज से खोजें' : 'Try Voice Assistant'}</span>
            </button>
          </div>
        </div>

        {/* Hero Translucent Metric Strip */}
        <div className="mt-12 pt-8 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((s, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white/[0.08] border border-white/10 backdrop-blur-xl shadow-apple-sm">
              <span className="text-[11px] font-medium text-forest-200 block">{s.label}</span>
              <span className="text-xl sm:text-2xl font-bold text-white mt-1 block tracking-tight">{s.value}</span>
              <span className="text-[10px] text-harvest font-semibold block mt-0.5">{s.sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3 Step Editorial Cards */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[11px] font-semibold text-forest-800 uppercase tracking-wider bg-forest-100 px-3 py-1 rounded-full">
            {lang === 'hi' ? 'सरल व पारदर्शी' : 'Intuitive Workflow'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
            {lang === 'hi' ? 'मंडीमैच कैसे काम करता है?' : 'How MandiMatch Empowers Farmers'}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 font-normal">
            {lang === 'hi'
              ? 'बिना किसी उलझन के 60 सेकंड में अपनी फसल का अधिकतम मुनाफा निकालें।'
              : 'From harvest to highest in-pocket return in under 60 seconds.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative p-7 rounded-[28px] bg-white border border-black/[0.06] shadow-apple-card hover:shadow-apple-hover transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-forest-50 text-forest-900 flex items-center justify-center font-bold text-lg group-hover:bg-forest-900 group-hover:text-white transition-colors shadow-apple-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-bold text-neutral-300 font-mono tracking-tight">{item.step}</span>
                </div>
                <h3 className="text-base font-semibold tracking-tight text-neutral-900 mb-2">{item.title}</h3>
                <p className="text-xs text-neutral-500 leading-relaxed font-normal">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Spec Sheet Comparison */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Column */}
        <div className="space-y-6">
          <span className="text-[11px] font-semibold text-harvest-hover uppercase tracking-wider bg-harvest/15 px-3 py-1 rounded-full">
            {lang === 'hi' ? 'सच्चा मुनाफा कैलकुलेटर' : 'Groundbreaking Net Profit Engine'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-neutral-900 leading-tight">
            {lang === 'hi' ? (
              <>
                ऊंचा भाव हमेशा ज्यादा मुनाफा <br />
                <span className="text-forest-700">नहीं देता!</span>
              </>
            ) : (
              <>
                A higher mandi price doesn't <br />
                always mean <span className="text-forest-700">higher profit.</span>
              </>
            )}
          </h2>
          <p className="text-sm text-neutral-600 leading-relaxed font-normal">
            {lang === 'hi'
              ? 'आज़ादपुर मंडी ₹21.80/किलो दे रही है, लेकिन 34 किमी दूर है और ₹1,800 ढुलाई लगेगी। साहिबाबाद मंडी 12 किमी पर ₹19.50 दे रही है। छोटे किसान के 500 किलो आलू पर साहिबाबाद मंडी में ₹450 ज्यादा शुद्ध बचत होती है।'
              : 'Azadpur Mandi may quote ₹21.80/kg, but at 34 km away, fuel and transport cost ₹1,800. Sahibabad Mandi at 12 km offers ₹19.50/kg. For 500 kg potatoes, selling at Sahibabad actually puts ₹450 MORE net profit into Ramesh’s pocket.'}
          </p>

          <div className="space-y-3.5">
            {benefits.map((b, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-forest-100 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-forest-700" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-neutral-900">{b.title}</h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5 font-normal leading-normal">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-forest-900 hover:bg-forest-800 active:scale-95 text-white font-semibold text-xs shadow-apple-sm transition-all"
            >
              <span>{lang === 'hi' ? 'रमेश कुमार का लाइव डेमो देखें' : 'View Ramesh Kumar Demo'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right Column: Spec Card */}
        <div className="p-7 rounded-[32px] bg-white border border-black/[0.06] shadow-apple-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-black/[0.05]">
            <div>
              <span className="text-xs font-semibold text-neutral-900">Live Mathematical Proof</span>
              <p className="text-[11px] text-neutral-500">Potato (1,000 kg) • Origin: Ghaziabad</p>
            </div>
            <span className="text-[10px] bg-forest-100 text-forest-800 font-semibold px-2.5 py-0.5 rounded-full">
              Real-time
            </span>
          </div>

          <div className="space-y-3">
            {/* Sahibabad */}
            <div className="p-4 rounded-2xl bg-forest-50/70 border border-forest-600/60 space-y-2 relative shadow-apple-sm">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-forest-900">Sahibabad Mandi (12 km)</span>
                  <span className="block text-[11px] text-forest-700">₹19.50/kg • Transit: ₹638</span>
                </div>
                <span className="text-[10px] font-semibold bg-forest-700 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Best Net Return
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-forest-200/60">
                <span className="text-xs text-forest-800 font-medium">Net In-Pocket Profit:</span>
                <span className="text-base font-extrabold text-forest-900 tracking-tight">₹18,570</span>
              </div>
            </div>

            {/* Azadpur */}
            <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.05] space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-neutral-700">Azadpur Mandi (34 km)</span>
                  <span className="block text-[11px] text-neutral-500">₹21.80/kg • Transit: ₹1,166</span>
                </div>
                <span className="text-[10px] font-semibold bg-black/[0.06] text-neutral-600 px-2 py-0.5 rounded-full">
                  Rank #2
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-black/[0.05]">
                <span className="text-xs text-neutral-500 font-medium">Net In-Pocket Profit:</span>
                <span className="text-base font-semibold text-neutral-800 tracking-tight">₹20,416</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-harvest-light/70 border border-harvest/30 text-xs text-neutral-800 flex items-center gap-2.5">
            <Percent className="w-4 h-4 text-harvest-hover shrink-0" />
            <span className="text-[11px] leading-relaxed">
              <strong>Pooling Bonus:</strong> Sharing a pickup truck with Suresh Pal saves another ₹450 in cash!
            </span>
          </div>
        </div>
      </section>

      {/* Bottom CTA Card */}
      <section className="rounded-[32px] bg-gradient-to-br from-forest-50 to-white border border-forest-200/80 p-8 sm:p-14 text-center space-y-4 shadow-apple-card">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
          {lang === 'hi' ? 'अपनी अगली फसल पर अधिकतम मुनाफा कमाएं' : 'Ready to maximize your harvest earnings?'}
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto font-normal">
          {lang === 'hi'
            ? 'बिना किसी शुल्क या कमीशन के अभी मंडी तुलना शुरू करें।'
            : 'Zero registration fee. Transparent open calculations for every Indian farmer.'}
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            to="/dashboard"
            className="px-6 py-3 rounded-full bg-forest-900 hover:bg-forest-800 active:scale-95 text-white font-semibold text-sm shadow-apple-sm transition-all"
          >
            {lang === 'hi' ? 'डैशबोर्ड खोलें' : 'Open Demo Dashboard'}
          </Link>
          <Link
            to="/pooling"
            className="px-6 py-3 rounded-full bg-white hover:bg-black/[0.02] active:scale-95 text-neutral-900 font-semibold text-sm border border-black/[0.08] shadow-apple-sm transition-all"
          >
            {lang === 'hi' ? 'साझा परिवहन देखें' : 'View Transport Pooling'}
          </Link>
        </div>
      </section>
    </div>
  );
};
