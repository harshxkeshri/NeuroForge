import React, { useState, useEffect } from 'react';
import { Mic, MicOff, X, Check, Volume2, ArrowRight, Sparkles } from 'lucide-react';
import { voiceService, ParsedVoiceQuery } from '../services/voiceService';
import { Language } from '../services/i18n';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onApplyVoiceQuery: (parsed: ParsedVoiceQuery) => void;
}

export const VoiceModal: React.FC<VoiceModalProps> = ({
  isOpen,
  onClose,
  lang,
  onApplyVoiceQuery,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [parsedResult, setParsedResult] = useState<ParsedVoiceQuery | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [stopRecognition, setStopRecognition] = useState<(() => void) | null>(null);

  const sampleQueries = [
    { text: 'मेरे पास 1000 किलो आलू हैं। सबसे अच्छी मंडी बताओ।', desc: '1000 kg Potato' },
    { text: 'I have 800 kg tomatoes. Which market gives highest profit?', desc: '800 kg Tomato' },
    { text: '500 kg gehun bechna hai. Azadpur ka bhav kya hai?', desc: '500 kg Wheat' },
    { text: 'Mere paas 2000 kilo pyaz hai. Kharidar khojo.', desc: '2000 kg Onion' },
  ];

  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      setParsedResult(null);
      setErrorMessage('');
    } else {
      if (stopRecognition) {
        stopRecognition();
        setIsListening(false);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartMic = () => {
    setErrorMessage('');
    setIsListening(true);
    setTranscript(lang === 'hi' ? 'सुन रहा हूँ... बोलिए...' : 'Listening... Speak now...');

    const stop = voiceService.startListening(
      (parsed) => {
        setIsListening(false);
        setTranscript(parsed.rawText);
        setParsedResult(parsed);
      },
      (err) => {
        setIsListening(false);
        setErrorMessage(err);
      },
      () => {
        setIsListening(false);
      },
      lang === 'hi' ? 'hi-IN' : 'en-IN'
    );

    setStopRecognition(() => stop);
  };

  const handleStopMic = () => {
    if (stopRecognition) {
      stopRecognition();
      setIsListening(false);
    }
  };

  const handleSampleClick = (queryText: string) => {
    const parsed = voiceService.parseFarmerVoiceQuery(queryText);
    setTranscript(queryText);
    setParsedResult(parsed);
    setErrorMessage('');
  };

  const handleConfirm = () => {
    if (parsedResult) {
      onApplyVoiceQuery(parsedResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Apple Translucent Dimming Backdrop */}
      <div className="fixed inset-0 bg-black/35 backdrop-blur-md transition-opacity" onClick={onClose} />

      {/* Apple Modal Card */}
      <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-[32px] shadow-apple-modal border border-black/[0.08] p-6 sm:p-7 z-10 animate-in fade-in zoom-in-95 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-black/[0.05]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-forest-100 flex items-center justify-center text-forest-900 shadow-apple-sm">
              <Mic className="w-4 h-4 text-forest-700" />
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-tight text-neutral-900">
                {lang === 'hi' ? 'बोलकर फसल व मंडी खोजें' : 'Voice Query'}
              </h3>
              <p className="text-[11px] text-neutral-500 font-normal">
                {lang === 'hi' ? 'हिंदी या अंग्रेजी में अपनी फसल और मात्रा बताएं' : 'Speak crop and quantity in Hindi or English'}
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

        {/* Siri-Inspired Animated Center Orb */}
        <div className="py-6 flex flex-col items-center justify-center text-center">
          <div className="relative">
            {isListening && (
              <>
                <div className="absolute inset-0 rounded-full bg-forest-500/20 animate-ping scale-150 duration-1000" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-forest-400/30 to-harvest/30 animate-pulse scale-125 duration-700" />
              </>
            )}
            <button
              onClick={isListening ? handleStopMic : handleStartMic}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center text-white shadow-apple-hover active:scale-95 transition-all ${
                isListening
                  ? 'bg-mandi-red hover:bg-red-600 scale-105'
                  : 'bg-forest-900 hover:bg-forest-800'
              }`}
            >
              {isListening ? (
                <MicOff className="w-8 h-8 animate-pulse" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </button>
          </div>

          <p className="mt-4 text-[13px] font-semibold text-neutral-900 tracking-tight">
            {isListening
              ? lang === 'hi' ? 'सुन रहा हूँ... बोलिए...' : 'Listening... Speak now...'
              : lang === 'hi' ? 'माइक दबाकर बोलें' : 'Tap microphone to speak'}
          </p>

          {/* Transcript Display */}
          {transcript && (
            <div className="mt-4 w-full p-3.5 rounded-2xl bg-forest-50/70 border border-forest-100 text-left animate-in fade-in">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-forest-800 uppercase tracking-wider mb-1">
                <Volume2 className="w-3 h-3" />
                {lang === 'hi' ? 'पहचाना गया वाक्य' : 'Recognized Speech'}
              </div>
              <p className="text-xs font-medium text-neutral-900 italic">"{transcript}"</p>
            </div>
          )}

          {/* Extracted Parameters Card */}
          {parsedResult && (
            <div className="mt-4 w-full p-4 rounded-2xl bg-black/[0.02] border border-black/[0.05] text-left animate-in fade-in space-y-3">
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
                {lang === 'hi' ? 'पहचाने गए विवरण:' : 'Structured Extraction:'}
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-black/[0.05] shadow-apple-sm">
                  <span className="text-neutral-400 block text-[10px] font-semibold uppercase tracking-wider">Crop</span>
                  <span className="font-semibold text-forest-900 text-xs">
                    {parsedResult.cropName || 'Potato (Default)'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-black/[0.05] shadow-apple-sm">
                  <span className="text-neutral-400 block text-[10px] font-semibold uppercase tracking-wider">Quantity</span>
                  <span className="font-semibold text-forest-900 text-xs">
                    {parsedResult.quantityKg ? `${parsedResult.quantityKg.toLocaleString('en-IN')} kg` : '1,000 kg'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleConfirm}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 active:scale-98 text-white font-semibold text-xs shadow-apple-sm transition-all"
              >
                <Check className="w-3.5 h-3.5 text-harvest" />
                <span>{lang === 'hi' ? 'गणना में लागू करें' : 'Apply to Profit Engine'}</span>
              </button>
            </div>
          )}

          {errorMessage && (
            <div className="mt-3 text-xs text-mandi-red bg-red-50/80 p-2.5 rounded-xl border border-red-200/60 w-full text-center font-medium">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Demo Preset Chips */}
        <div className="pt-3 border-t border-black/[0.05]">
          <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
            {lang === 'hi' ? 'या डेमो वाक्यों पर क्लिक करें:' : 'Or tap a demo voice phrase:'}
          </p>
          <div className="space-y-1">
            {sampleQueries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSampleClick(q.text)}
                className="w-full flex items-center justify-between text-left p-2 rounded-xl hover:bg-black/[0.03] active:bg-black/[0.05] transition-colors text-xs group"
              >
                <span className="text-neutral-700 font-medium group-hover:text-neutral-900 truncate">
                  "{q.text}"
                </span>
                <span className="shrink-0 text-[10px] bg-black/[0.04] text-neutral-600 font-medium px-2 py-0.5 rounded-full ml-2">
                  {q.desc}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
