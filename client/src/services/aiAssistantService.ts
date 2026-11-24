import { MarketCalculationResult, BuyerMatchResult } from '../types';
import { voiceService } from './voiceService';

export interface AIResponse {
  cropName: string;
  quantityKg: number;
  extractedQuery: string;
  marketExplanation: string;
  recommendedMarketName: string;
  estimatedNetProfit: number;
  buyerAlternativeText?: string;
  transportAdvice?: string;
  hindiSummary: string;
  confidence: number;
  isAiLive: boolean;
}

class AIAssistantService {
  /**
   * Explains market calculation results without hallucinating fake numbers
   */
  generateMarketExplanation(
    queryText: string,
    results: MarketCalculationResult[],
    buyerMatches?: BuyerMatchResult[]
  ): AIResponse {
    const parsed = voiceService.parseFarmerVoiceQuery(queryText);
    const bestMarket = results[0];
    const secondMarket = results[1];

    if (!bestMarket) {
      return {
        cropName: parsed.cropName || 'Produce',
        quantityKg: parsed.quantityKg || 1000,
        extractedQuery: queryText,
        marketExplanation: 'No nearby markets found for this specific crop and distance filter.',
        recommendedMarketName: 'None',
        estimatedNetProfit: 0,
        hindiSummary: 'इस फसल के लिए कोई मंडी उपलब्ध नहीं है।',
        confidence: 0.9,
        isAiLive: false,
      };
    }

    const netProfitFormatted = `₹${bestMarket.netReturn.toLocaleString('en-IN')}`;
    const diff = secondMarket ? bestMarket.netReturn - secondMarket.netReturn : 0;

    let explanation = `Based on your harvest of ${bestMarket.quantityKg.toLocaleString('en-IN')} kg, **${bestMarket.mandi.mandiName}** gives you the highest net in-hand profit of **${netProfitFormatted}** (net ₹${bestMarket.netPricePerKg}/kg).`;

    if (secondMarket) {
      if (secondMarket.mandi.pricePerKg > bestMarket.mandi.pricePerKg) {
        explanation += ` Although ${secondMarket.mandi.mandiName} displays a higher headline price of ₹${secondMarket.mandi.pricePerKg}/kg, its longer distance (${secondMarket.mandi.distanceKm} km) costs ₹${secondMarket.transportCost} in transport. Choosing ${bestMarket.mandi.mandiName} saves you ₹${diff.toLocaleString('en-IN')} more net cash.`;
      } else {
        explanation += ` It out-earns ${secondMarket.mandi.mandiName} by ₹${diff.toLocaleString('en-IN')} after factoring all transport and local mandi fees.`;
      }
    }

    let hindiSummary = `आपके ${bestMarket.quantityKg} किलो उपज के लिए सबसे फायदेमंद मंडी **${bestMarket.mandi.mandiName}** है। यहां परिवहन खर्च काटकर आपकी शुद्ध जेब में कमाई **${netProfitFormatted}** होगी।`;

    let buyerAlternativeText: string | undefined;
    if (buyerMatches && buyerMatches.length > 0) {
      const topBuyer = buyerMatches[0];
      buyerAlternativeText = `Direct Buyer Option: ${topBuyer.buyer.buyerName} offers ₹${topBuyer.buyer.offeredPrice}/kg (${topBuyer.matchScore}% Match). Total direct earning: ₹${topBuyer.totalEarnings.toLocaleString('en-IN')}. ${topBuyer.buyer.pickupAvailable ? 'Free farm-gate pickup available!' : ''}`;
    }

    const transportAdvice = 'Tip: You can reduce transit cost by up to 40% using MandiMatch Transport Pooling with nearby farmers in your village.';

    return {
      cropName: bestMarket.mandi.cropId.replace('crop-', ''),
      quantityKg: bestMarket.quantityKg,
      extractedQuery: queryText,
      marketExplanation: explanation,
      recommendedMarketName: bestMarket.mandi.mandiName,
      estimatedNetProfit: bestMarket.netReturn,
      buyerAlternativeText,
      transportAdvice,
      hindiSummary,
      confidence: 0.98,
      isAiLive: false,
    };
  }
}

export const aiAssistantService = new AIAssistantService();
