import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { dataService } from '../services/dataService';

interface DemoBannerProps {
  onReset?: () => void;
  lang: 'en' | 'hi';
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ onReset, lang }) => {
  const handleReset = () => {
    if (window.confirm(lang === 'hi' ? 'क्या आप डिफ़ॉल्ट डेमो डेटा रीसेट करना चाहते हैं?' : 'Reset all data to default hackathon demo scenario?')) {
      dataService.resetToDefaults();
      if (onReset) onReset();
      window.location.reload();
    }
  };

  return (
    <aside aria-label="Demo notice" className="bg-amber-500/[0.08] backdrop-blur-md border-b border-amber-500/[0.15] px-3.5 py-1.5 text-xs text-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-500/[0.12] px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider">
            <AlertCircle className="w-3 h-3" />
            {lang === 'hi' ? 'डेमो मोड' : 'DEMO MODE'}
          </span>
          <span className="text-neutral-600 font-normal hidden sm:inline text-[11px]">
            {lang === 'hi'
              ? 'मंडी भाव व खरीदार प्रस्ताव केवल हैकाथॉन प्रदर्शन हेतु अनुकरण (Simulated) हैं।'
              : 'Market prices and buyer offers are simulated for Build for Bharat Hackathon demonstration.'}
          </span>
        </div>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-forest-700 hover:text-forest-900 active:scale-95 transition-all ml-auto"
          title="Reset to default Ramesh Kumar demo scenario"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{lang === 'hi' ? 'डिफ़ॉल्ट रीसेट करें' : 'Reset Scenario'}</span>
        </button>
      </div>
    </aside>
  );
};
