// Voice Recognition and Text-to-Speech Accessibility Service

export interface ParsedVoiceQuery {
  rawText: string;
  cropId?: string;
  cropName?: string;
  quantityKg?: number;
  location?: string;
  intent: 'market_comparison' | 'buyer_search' | 'transport_pooling' | 'general';
}

class VoiceService {
  isSpeechRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(
      (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition
    );
  }

  isSpeechSynthesisSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return 'speechSynthesis' in window;
  }

  startListening(
    onResult: (parsed: ParsedVoiceQuery) => void,
    onError: (err: string) => void,
    onEnd: () => void,
    language: 'hi-IN' | 'en-IN' = 'hi-IN'
  ): () => void {
    if (!this.isSpeechRecognitionSupported()) {
      onError('Voice recognition is not supported in this browser. Please use keyboard input.');
      return () => {};
    }

    try {
      const SpeechRecognition =
        (window as unknown as { SpeechRecognition?: any }).SpeechRecognition ||
        (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const parsed = this.parseFarmerVoiceQuery(transcript);
        onResult(parsed);
      };

      recognition.onerror = (event: any) => {
        onError(event.error || 'Voice error occurred');
      };

      recognition.onend = () => {
        onEnd();
      };

      recognition.start();

      return () => {
        try {
          recognition.stop();
        } catch {
          // ignore
        }
      };
    } catch (e: any) {
      onError(e.message || 'Failed to initialize speech recognition');
      return () => {};
    }
  }

  /**
   * Intelligently parses Hindi, Hinglish, and English natural farmer voice phrases
   * Examples:
   * "Mere paas 500 kilo aloo hain. Sabse achha bazaar batao"
   * "1000 kg gehun bechna hai"
   * "Find buyers for 800 kg tomatoes"
   */
  parseFarmerVoiceQuery(text: string): ParsedVoiceQuery {
    const lower = text.toLowerCase();

    // 1. Detect Crop
    let cropId: string | undefined;
    let cropName: string | undefined;

    if (lower.includes('aloo') || lower.includes('potato') || lower.includes('आलू')) {
      cropId = 'crop-potato';
      cropName = 'Potato (आलू)';
    } else if (lower.includes('gehun') || lower.includes('gehu') || lower.includes('wheat') || lower.includes('गेहूं')) {
      cropId = 'crop-wheat';
      cropName = 'Wheat (गेहूं)';
    } else if (lower.includes('tamatar') || lower.includes('tomato') || lower.includes('टमाटर')) {
      cropId = 'crop-tomato';
      cropName = 'Tomato (टमाटर)';
    } else if (lower.includes('pyaaz') || lower.includes('pyaz') || lower.includes('onion') || lower.includes('प्याज़')) {
      cropId = 'crop-onion';
      cropName = 'Onion (प्याज़)';
    } else if (lower.includes('dhan') || lower.includes('chawal') || lower.includes('rice') || lower.includes('चावल') || lower.includes('धान')) {
      cropId = 'crop-rice';
      cropName = 'Rice (धान/चावल)';
    } else if (lower.includes('sarson') || lower.includes('mustard') || lower.includes('सरसों')) {
      cropId = 'crop-mustard';
      cropName = 'Mustard (सरसों)';
    }

    // 2. Extract Quantity (supports digits or spoken numbers like 500, 1000, "paanch sau", "hazaar")
    let quantityKg: number | undefined;

    // Look for numbers preceding kg, kilo, quintal, or standalone
    const numMatch = lower.match(/(\d+)\s*(kilo|kg|quintal|kwtl|क्विंटल|किलो)?/i);
    if (numMatch) {
      let val = parseInt(numMatch[1], 10);
      const unit = numMatch[2]?.toLowerCase();
      if (unit && (unit.includes('quintal') || unit.includes('क्विंटल') || unit.includes('kwtl'))) {
        val = val * 100; // 1 quintal = 100 kg
      }
      quantityKg = val;
    } else {
      // Common spoken Hindi numbers
      if (lower.includes('hazaar') || lower.includes('hazar') || lower.includes('हज़ार')) {
        quantityKg = 1000;
      } else if (lower.includes('paanch sau') || lower.includes('panch sau') || lower.includes('पांच सौ')) {
        quantityKg = 500;
      } else if (lower.includes('aath sau') || lower.includes('आठ सौ')) {
        quantityKg = 800;
      }
    }

    // 3. Determine Intent
    let intent: ParsedVoiceQuery['intent'] = 'market_comparison';
    if (lower.includes('buyer') || lower.includes('kharidar') || lower.includes('खरीदार')) {
      intent = 'buyer_search';
    } else if (lower.includes('transport') || lower.includes('gaadi') || lower.includes('tempo') || lower.includes('pool') || lower.includes('साझा')) {
      intent = 'transport_pooling';
    }

    return {
      rawText: text,
      cropId,
      cropName,
      quantityKg,
      intent,
    };
  }

  /**
   * Reads recommendation aloud in simple Hindi or English
   */
  speakRecommendation(text: string, language: 'hi-IN' | 'en-IN' = 'hi-IN'): void {
    if (!this.isSpeechSynthesisSupported()) return;

    try {
      window.speechSynthesis.cancel(); // Stop any pending utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.95; // slightly slower for rural clarity
      utterance.pitch = 1.0;

      // Select matching voice if available
      const voices = window.speechSynthesis.getVoices();
      const match = voices.find(v => v.lang.startsWith(language.slice(0, 2)));
      if (match) {
        utterance.voice = match;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore
    }
  }

  stopSpeaking(): void {
    if (this.isSpeechSynthesisSupported()) {
      window.speechSynthesis.cancel();
    }
  }
}

export const voiceService = new VoiceService();
