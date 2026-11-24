export type Language = 'en' | 'hi';

export interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

export const DICTIONARY: Translations = {
  // Brand & Nav
  appName: { en: 'MandiMatch', hi: 'मंडीमैच' },
  tagline: { en: 'Your Harvest. Your Market. Your Profit.', hi: 'आपकी फसल। आपका बाज़ार। आपका मुनाफा।' },
  landingSubtitle: {
    en: 'Compare mandi prices, discover direct buyers and calculate your actual earnings after transportation.',
    hi: 'मंडी भावों की तुलना करें, सीधे खरीदार खोजें और परिवहन खर्च घटाकर अपनी वास्तविक शुद्ध कमाई जानें।',
  },
  navDashboard: { en: 'Farmer Dashboard', hi: 'किसान डैशबोर्ड' },
  navComparison: { en: 'Market Comparison', hi: 'मंडी भाव तुलना' },
  navBuyers: { en: 'Buyer Marketplace', hi: 'खरीदार बाज़ार' },
  navTransport: { en: 'Transport Pooling', hi: 'साझा परिवहन' },
  navTrends: { en: 'Price Trends', hi: 'मंडी भाव रुझान' },
  navProfile: { en: 'Farmer Profile', hi: 'किसान प्रोफाइल' },
  navAdmin: { en: 'Admin Portal', hi: 'एडमिन पोर्टल' },

  // Metrics & Headers
  bestNetReturn: { en: 'Best Net Return', hi: 'सर्वाधिक शुद्ध कमाई' },
  recommendedMarket: { en: 'Recommended Market', hi: 'सर्वोत्तम अनुशंसित मंडी' },
  bestBuyerPrice: { en: 'Best Buyer Offer', hi: 'सर्वोत्तम खरीदार भाव' },
  transportSavings: { en: 'Potential Transport Savings', hi: 'संभावित परिवहन बचत' },
  grossSale: { en: 'Gross Sale', hi: 'कुल बिक्री' },
  transportCost: { en: 'Transport Cost', hi: 'परिवहन खर्च' },
  otherCosts: { en: 'Mandi Cess & Labor', hi: 'मंडी शुल्क व पल्लेदारी' },
  netProfit: { en: 'Net In-Hand Earnings', hi: 'हाथ में शुद्ध कमाई' },
  pricePerKg: { en: 'Price / kg', hi: 'भाव प्रति किलो' },
  distance: { en: 'Distance', hi: 'दूरी' },
  crop: { en: 'Crop', hi: 'फसल' },
  quantity: { en: 'Quantity (kg)', hi: 'मात्रा (किलो)' },
  location: { en: 'Your Location', hi: 'आपका स्थान' },
  calculate: { en: 'Calculate Best Profit', hi: 'सर्वोत्तम मुनाफा निकालें' },
  bestOptionBadge: { en: 'BEST NET RETURN', hi: 'सर्वाधिक शुद्ध मुनाफा' },
  demoDataBadge: { en: 'DEMO DATA — Simulated for Hackathon', hi: 'डेमो डेटा — हैकाथॉन प्रदर्शन हेतु' },
  voiceSearchPrompt: { en: 'Speak in Hindi or English (e.g. "Mere paas 1000 kilo aloo hai")', hi: 'हिंदी या अंग्रेजी में बोलें (उदा: "मेरे पास 1000 किलो आलू है")' },
  readAloud: { en: 'Listen to Recommendation', hi: 'सुझाव बोलकर सुनें' },
  stopListening: { en: 'Stop', hi: 'रोकें' },
  aiAssistant: { en: 'Kisan Mitra AI', hi: 'किसान मित्र AI' },
};

export function t(key: keyof typeof DICTIONARY, lang: Language): string {
  if (DICTIONARY[key]) {
    return DICTIONARY[key][lang] || DICTIONARY[key]['en'];
  }
  return String(key);
}
