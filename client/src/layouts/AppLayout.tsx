import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { MobileNav } from '../components/MobileNav';
import { VoiceModal } from '../components/VoiceModal';
import { AIAssistantDrawer } from '../components/AIAssistantDrawer';
import { Language } from '../services/i18n';
import { ParsedVoiceQuery } from '../services/voiceService';

export const AppLayout: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleApplyVoiceQuery = (parsed: ParsedVoiceQuery) => {
    // Navigate with query state
    if (parsed.intent === 'buyer_search') {
      navigate('/buyers', { state: { cropId: parsed.cropId, quantityKg: parsed.quantityKg } });
    } else if (parsed.intent === 'transport_pooling') {
      navigate('/pooling', { state: { cropId: parsed.cropId, quantityKg: parsed.quantityKg } });
    } else {
      navigate('/compare', { state: { cropId: parsed.cropId || 'crop-potato', quantityKg: parsed.quantityKg || 1000 } });
    }
  };

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col text-ink-primary font-sans">
      {/* Main Navbar */}
      <Navbar
        lang={lang}
        setLang={setLang}
        onOpenVoice={() => setIsVoiceOpen(true)}
        onOpenAI={() => setIsAIOpen(true)}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Body: Sidebar + Main Outlet */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        <Sidebar lang={lang} onOpenAI={() => setIsAIOpen(true)} />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-12 max-w-full overflow-hidden">
          <Outlet context={{ lang, onOpenVoice: () => setIsVoiceOpen(true), onOpenAI: () => setIsAIOpen(true) }} />
        </main>
      </div>

      {/* Mobile Navigation Drawer & Bottom Bar */}
      <MobileNav lang={lang} open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Modals & Overlays */}
      <VoiceModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        lang={lang}
        onApplyVoiceQuery={handleApplyVoiceQuery}
      />

      <AIAssistantDrawer
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        lang={lang}
      />
    </div>
  );
};
