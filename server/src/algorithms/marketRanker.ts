import { MandiModel, calculateMarketReturn } from './profitCalculator.js';

export function rankMarketsServer(cropId: string, quantityKg: number, mandis: MandiModel[], maxDistanceKm = 100, isPooled = false) {
  const eligible = mandis.filter(m => m.cropId === cropId && m.distanceKm <= maxDistanceKm);
  if (eligible.length === 0) return [];

  const evaluated = eligible.map(mandi =>
    calculateMarketReturn({ quantityKg, mandi, isPooled })
  );

  evaluated.sort((a, b) => b.netReturn - a.netReturn);
  const best = evaluated[0];
  const worst = evaluated[evaluated.length - 1];

  return evaluated.map((item, idx) => {
    const rank = idx + 1;
    const isBest = rank === 1;
    const savingsVsWorst = Math.max(0, item.netReturn - worst.netReturn);
    const reason = isBest
      ? `${item.mandi.mandiName} provides highest net earnings (₹${item.netReturn.toLocaleString('en-IN')}) after deducting ₹${item.transportCost} transport.`
      : `₹${(best.netReturn - item.netReturn).toLocaleString('en-IN')} lower net return than ${best.mandi.mandiName}.`;

    return {
      ...item,
      rank,
      isBest,
      savingsVsWorst,
      recommendationReason: reason,
    };
  });
}
