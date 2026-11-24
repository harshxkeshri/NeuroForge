export interface BuyerModel {
  id: string;
  buyerName: string;
  cropId: string;
  quantityRequired: number;
  offeredPrice: number;
  location: string;
  distanceKm: number;
  pickupAvailable: boolean;
  verified: boolean;
  status: string;
}

export function matchBuyersServer(cropId: string, quantityKg: number, offers: BuyerModel[], farmerBasePrice = 18.0) {
  const eligible = offers.filter(b => b.cropId === cropId && b.status === 'open');

  const matches = eligible.map(buyer => {
    const priceDiff = buyer.offeredPrice - farmerBasePrice;
    let priceScore = 20 + Math.min(20, Math.max(-10, priceDiff * 8));

    let quantityScore = 20;
    if (quantityKg <= buyer.quantityRequired) {
      quantityScore = 25;
    } else {
      quantityScore = Math.max(10, Math.round(25 * (buyer.quantityRequired / quantityKg)));
    }

    const distanceScore = Math.max(5, Math.round(20 - (buyer.distanceKm / 5)));
    let bonus = 0;
    if (buyer.pickupAvailable) bonus += 10;
    if (buyer.verified) bonus += 5;

    const matchScore = Math.min(99, Math.max(35, Math.round(priceScore + quantityScore + distanceScore + bonus)));
    const soldQty = Math.min(quantityKg, buyer.quantityRequired);
    const totalEarnings = Math.round(soldQty * buyer.offeredPrice);

    return {
      buyer,
      matchScore,
      soldQty,
      totalEarnings,
      reason: buyer.pickupAvailable
        ? `Offers ₹${buyer.offeredPrice}/kg with free farm gate pickup.`
        : `Verified buyer in ${buyer.location} at ₹${buyer.offeredPrice}/kg.`,
    };
  });

  return matches.sort((a, b) => b.matchScore - a.matchScore);
}
