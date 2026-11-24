import { BuyerOffer, BuyerMatchResult } from '../types';

export interface BuyerMatcherOptions {
  cropId: string;
  quantityKg: number;
  offers: BuyerOffer[];
  farmerBasePrice?: number;
  maxDistanceKm?: number;
  onlyPickup?: boolean;
}

/**
 * Intelligent Buyer Matching Engine
 * Ranks direct buyers based on price premium, distance, quantity alignment, and pickup options.
 */
export function matchBuyers(options: BuyerMatcherOptions): BuyerMatchResult[] {
  const {
    cropId,
    quantityKg,
    offers,
    farmerBasePrice = 18.0,
    maxDistanceKm = 100,
    onlyPickup = false,
  } = options;

  const filtered = offers.filter(b => {
    if (b.cropId !== cropId) return false;
    if (b.status !== 'open') return false;
    if (b.distanceKm > maxDistanceKm) return false;
    if (onlyPickup && !b.pickupAvailable) return false;
    return true;
  });

  const matches: BuyerMatchResult[] = filtered.map(buyer => {
    // 1. Price Score (up to 40 pts)
    // Compare buyer offer vs farmer base reference price
    const priceDiff = buyer.offeredPrice - farmerBasePrice;
    let priceScore = 20 + Math.min(20, Math.max(-10, priceDiff * 8));

    // 2. Quantity Score (up to 25 pts)
    // High compatibility if farmer's lot is >= min purchase and doesn't drastically exceed buyer required
    let quantityScore = 20;
    if (quantityKg <= buyer.quantityRequired) {
      quantityScore = 25;
    } else {
      // Farmer has more than buyer wants
      const ratio = buyer.quantityRequired / quantityKg;
      quantityScore = Math.max(10, Math.round(25 * ratio));
    }

    // 3. Distance Score (up to 20 pts)
    // Closer is better
    const distanceScore = Math.max(5, Math.round(20 - (buyer.distanceKm / 5)));

    // 4. Convenience Bonus (up to 15 pts)
    let convenienceBonus = 0;
    if (buyer.pickupAvailable) convenienceBonus += 10;
    if (buyer.verified) convenienceBonus += 5;

    const rawTotal = priceScore + quantityScore + distanceScore + convenienceBonus;
    const matchScore = Math.min(99, Math.max(35, Math.round(rawTotal)));

    const soldQty = Math.min(quantityKg, buyer.quantityRequired);
    const totalEarnings = Math.round(soldQty * buyer.offeredPrice);

    let pickupAdvantage = buyer.pickupAvailable
      ? 'Direct Farm-gate Pickup — Zero transport hassle'
      : `Self-delivery required to ${buyer.location} (${buyer.distanceKm} km)`;

    let reason = '';
    if (buyer.pickupAvailable && priceDiff > 0) {
      reason = `Highly recommended: Offers ₹${priceDiff.toFixed(2)}/kg premium over local baseline and provides free farm-gate pickup.`;
    } else if (buyer.offeredPrice > farmerBasePrice * 1.1) {
      reason = `Top commercial rate of ₹${buyer.offeredPrice}/kg from verified institutional buyer.`;
    } else {
      reason = `Reliable demand for ${buyer.quantityRequired.toLocaleString('en-IN')} kg located ${buyer.distanceKm} km away.`;
    }

    return {
      buyer,
      matchScore,
      scoreBreakdown: {
        priceScore,
        distanceScore,
        quantityScore,
        convenienceBonus,
      },
      farmerQuantityKg: quantityKg,
      totalEarnings,
      pickupAdvantage,
      matchReason: reason,
    };
  });

  return matches.sort((a, b) => b.matchScore - a.matchScore);
}
