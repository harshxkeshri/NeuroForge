import { Mandi, MarketCalculationResult } from '../types';
import { calculateMarketReturn } from './profitCalculator';

export interface MarketRankerOptions {
  cropId: string;
  quantityKg: number;
  mandis: Mandi[];
  maxDistanceKm?: number;
  isPooled?: boolean;
}

/**
 * Evaluates all eligible mandis, sorts by highest Net Return, and builds human-readable rationale.
 */
export function rankMarkets(options: MarketRankerOptions): MarketCalculationResult[] {
  const { cropId, quantityKg, mandis, maxDistanceKm = 100, isPooled = false } = options;

  // Filter mandis matching crop and distance
  const eligibleMandis = mandis.filter(m => m.cropId === cropId && m.distanceKm <= maxDistanceKm);

  if (eligibleMandis.length === 0) {
    return [];
  }

  // Calculate return for each
  const evaluated = eligibleMandis.map(mandi =>
    calculateMarketReturn({
      quantityKg,
      mandi,
      isPooled,
    })
  );

  // Sort descending by netReturn
  evaluated.sort((a, b) => b.netReturn - a.netReturn);

  const bestResult = evaluated[0];
  const worstResult = evaluated[evaluated.length - 1];

  return evaluated.map((item, index) => {
    const rank = index + 1;
    const isBest = rank === 1;
    const savingsVsWorst = Math.max(0, item.netReturn - worstResult.netReturn);

    let reason = '';
    if (isBest) {
      if (item.mandi.distanceKm < 20) {
        reason = `${item.mandi.mandiName} offers optimal profit: high rate (₹${item.mandi.pricePerKg}/kg) with minimal transport cost (₹${item.transportCost}) due to close proximity (${item.mandi.distanceKm} km).`;
      } else {
        reason = `${item.mandi.mandiName} yields the highest net in-hand return (₹${item.netReturn.toLocaleString('en-IN')}) because its premium price (₹${item.mandi.pricePerKg}/kg) easily offsets the ₹${item.transportCost} transit cost.`;
      }
    } else {
      const diffWithBest = bestResult.netReturn - item.netReturn;
      reason = `Earns ₹${diffWithBest.toLocaleString('en-IN')} less than ${bestResult.mandi.mandiName} after accounting for distance and market cess.`;
    }

    return {
      ...item,
      rank,
      isBest,
      savingsVsWorst,
      recommendationReason: reason,
    };
  });
}
