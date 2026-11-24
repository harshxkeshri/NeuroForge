import React, { useState } from 'react';
import { Sparkles, X, ArrowUp, Volume2, ShieldAlert, Bot, User as UserIcon } from 'lucide-react';
import { aiAssistantService } from '../services/aiAssistantService';
import { rankMarkets } from '../algorithms/marketRanker';
import { matchBuyers } from '../algorithms/buyerMatcher';
import { dataService } from '../services/dataService';
import { voiceService } from '../services/voiceService';
import { Language } from '../services/i18n';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  hindiText?: string;
  structuredCard?: {
    marketName: string;
    netProfit: number;
    cropName: string;
    quantityKg: number;
  };
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Namaste! I am Kisan Mitra, your agricultural economics assistant. Tell me what crop you have harvested and how many kilograms, and I will calculate your true net profit after transport.',
      hindiText: 'नमस्ते! मैं किसान मित्र हूँ। मुझे बताइए आपके पास कौन सी फसल और कितने किलो उपज है, मैं परिवहन खर्च घटाकर आपकी शुद्ध जेब में कमाई बताऊंगा।',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputVal).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
    };
    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsProcessing(true);

    setTimeout(() => {
      const parsed = voiceService.parseFarmerVoiceQuery(query);
      const cropId = parsed.cropId || 'crop-potato';
      const quantityKg = parsed.quantityKg || 1000;

      const allMandis = dataService.getMandis();
      const allBuyers = dataService.getBuyerOffers();

      const ranked = rankMarkets({ cropId, quantityKg, mandis: allMandis });
      const buyerMatches = matchBuyers({ cropId, quantityKg, offers: allBuyers });

      const aiResponse = aiAssistantService.generateMarketExplanation(query, ranked, buyerMatches);

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: aiResponse.marketExplanation,
        hindiText: aiResponse.hindiSummary,
        structuredCard: {
          marketName: aiResponse.recommendedMarketName,
          netProfit: aiResponse.estimatedNetProfit,
          cropName: aiResponse.cropName,
          quantityKg: aiResponse.quantityKg,
        },
      };

      setMessages(prev => [...prev, assistantMsg]);
      setIsProcessing(false);
    }, 500);
  };

  const handleSpeak = (text: string) => {
    voiceService.speakRecommendation(text, lang === 'hi' ? 'hi-IN' : 'en-IN');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Apple Translucent Dimming Backdrop */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* iOS Style Slide-Over Sheet */}
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-2xl h-full shadow-apple-modal flex flex-col z-10 animate-in slide-in-from-right duration-300 border-l border-black/[0.08]">
        {/* Header */}
        <div className="p-4 bg-white/80 border-b border-black/[0.05] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-forest-900 flex items-center justify-center text-white shadow-apple-sm">
              <Sparkles className="w-4 h-4 text-harvest" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-semibold tracking-tight text-neutral-900">Kisan Mitra AI</h3>
                <span className="text-[10px] font-semibold bg-forest-100 text-forest-800 px-2 py-0.5 rounded-full">
                  Factual
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 font-normal">
                {lang === 'hi' ? 'पारदर्शी व वास्तविक मंडी विश्लेषण' : 'Transparent economic intelligence'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-black/[0.04] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Factual Integrity Banner */}
        <div className="bg-black/[0.02] px-4 py-2 border-b border-black/[0.04] flex items-center gap-2 text-[11px] text-neutral-500 font-medium">
          <ShieldAlert className="w-3.5 h-3.5 text-forest-700 shrink-0" />
          <span>
            {lang === 'hi'
              ? 'AI केवल प्रमाणित गणितीय सूत्रों से गणना करता है, कोई मनगढ़ंत भाव नहीं देता।'
              : 'AI is mathematically grounded — explains exact net formula without fake prices.'}
          </span>
        </div>

        {/* Chat Stream (iMessage Style) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F9FAF7]/60">
          {messages.map(m => {
            const isAI = m.sender === 'assistant';
            const displayText = lang === 'hi' && m.hindiText ? m.hindiText : m.text;

            return (
              <div
                key={m.id}
                className={`flex gap-2 ${isAI ? 'items-start' : 'items-end flex-row-reverse'}`}
              >
                <div
                  className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs shadow-apple-sm ${
                    isAI
                      ? 'bg-forest-900 text-white'
                      : 'bg-neutral-800 text-white'
                  }`}
                >
                  {isAI ? <Bot className="w-3.5 h-3.5 text-harvest" /> : <UserIcon className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-[20px] p-3.5 text-xs leading-relaxed ${
                    isAI
                      ? 'bg-white border border-black/[0.06] text-neutral-800 shadow-apple-card'
                      : 'bg-forest-900 text-white shadow-apple-sm font-medium'
                  }`}
                >
                  <p>{displayText}</p>

                  {/* Recommendation Card inside message */}
                  {m.structuredCard && (
                    <div className="mt-3 p-3 rounded-2xl bg-forest-50/80 border border-forest-100 text-forest-900 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-semibold text-forest-700 tracking-wider">Top Market</span>
                        <span className="text-xs font-semibold text-forest-900">
                          {m.structuredCard.marketName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-0.5">
                        <span className="text-[10px] text-neutral-500 font-medium">Net In-Pocket Profit:</span>
                        <span className="text-sm font-extrabold text-forest-900">
                          ₹{m.structuredCard.netProfit.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  )}

                  {isAI && (
                    <div className="mt-2.5 pt-2 border-t border-black/[0.04] flex items-center justify-between">
                      <button
                        onClick={() => handleSpeak(displayText)}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-forest-700 hover:text-forest-900 active:scale-95 transition-all"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>{lang === 'hi' ? 'बोलकर सुनें' : 'Listen'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isProcessing && (
            <div className="flex items-center gap-2 text-xs text-neutral-500 bg-white p-3 rounded-2xl border border-black/[0.05] w-fit shadow-apple-sm">
              <Sparkles className="w-3.5 h-3.5 text-forest-700 animate-spin" />
              <span>Analyzing net returns across 8 mandis...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-white border-t border-black/[0.05] overflow-x-auto flex gap-1.5 scrollbar-none">
          <button
            onClick={() => handleSend('800 kg tomatoes where to sell')}
            className="shrink-0 text-[11px] px-3 py-1 rounded-full bg-black/[0.04] hover:bg-black/[0.07] text-neutral-700 transition-colors font-medium"
          >
            🍅 800 kg Tomatoes
          </button>
          <button
            onClick={() => handleSend('1000 kg potato best market')}
            className="shrink-0 text-[11px] px-3 py-1 rounded-full bg-black/[0.04] hover:bg-black/[0.07] text-neutral-700 transition-colors font-medium"
          >
            🥔 1000 kg Potato
          </button>
          <button
            onClick={() => handleSend('Show me transport pooling savings')}
            className="shrink-0 text-[11px] px-3 py-1 rounded-full bg-black/[0.04] hover:bg-black/[0.07] text-neutral-700 transition-colors font-medium"
          >
            🚚 Transport Savings
          </button>
        </div>

        {/* Apple Style Input Bar */}
        <div className="p-3 bg-white border-t border-black/[0.05]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 bg-black/[0.04] rounded-full p-1 pl-3.5 border border-black/[0.04] focus-within:bg-white focus-within:ring-2 focus-within:ring-forest-700/20 focus-within:border-forest-700 transition-all"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={lang === 'hi' ? 'अपनी फसल व मात्रा पूछें...' : 'Ask about your harvest (e.g. 500 kg wheat)...'}
              className="flex-1 bg-transparent text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isProcessing}
              className="w-8 h-8 rounded-full bg-forest-900 text-white flex items-center justify-center hover:bg-forest-800 disabled:opacity-40 active:scale-90 transition-all shadow-apple-sm"
              aria-label="Send"
            >
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
