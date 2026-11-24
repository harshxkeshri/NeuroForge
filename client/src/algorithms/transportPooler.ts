import { TransportPool, PoolMember } from '../types';

export interface PoolCalculationResult {
  totalQuantity: number;
  vehicleCapacity: number;
  utilizationPercent: number;
  totalSoloCost: number;
  totalSharedCost: number;
  totalSavings: number;
  savingsPercentage: number;
  members: PoolMember[];
  formulaExplanation: string;
}

/**
 * Calculates proportional shared logistics cost and individual farmer savings
 * Formula:
 * Member Shared Cost = (Member Quantity / Total Pool Quantity) × Total Vehicle Cost
 * Member Savings = Individual Solo Cost - Member Shared Cost
 */
export function calculatePoolEconomics(
  members: Array<{ farmerId: string; farmerName: string; village: string; cropId: string; quantityKg: number; lat: number; lng: number; soloBookingCost?: number }>,
  totalVehicleHireCost: number,
  vehicleCapacity: number
): PoolCalculationResult {
  const totalQuantity = members.reduce((sum, m) => sum + m.quantityKg, 0);
  const utilizationPercent = Math.min(100, Math.round((totalQuantity / vehicleCapacity) * 100));

  let totalSoloCost = 0;

  const processedMembers: PoolMember[] = members.map(m => {
    // Individual solo hiring cost would typically be a minimum flat ₹900 to ₹1,200 per small carrier
    const individualCost = m.soloBookingCost ?? Math.round(750 + (m.quantityKg * 0.45));
    totalSoloCost += individualCost;

    // Proportional shared share of one larger commercial vehicle
    const weightShare = totalQuantity > 0 ? (m.quantityKg / totalQuantity) : 0;
    const sharedCost = Math.round(weightShare * totalVehicleHireCost);
    const savings = Math.max(0, individualCost - sharedCost);

    return {
      farmerId: m.farmerId,
      farmerName: m.farmerName,
      village: m.village,
      cropId: m.cropId,
      quantityKg: m.quantityKg,
      lat: m.lat,
      lng: m.lng,
      individualCost,
      sharedCost,
      savings,
    };
  });

  const totalSharedCost = totalVehicleHireCost;
  const totalSavings = Math.max(0, totalSoloCost - totalSharedCost);
  const savingsPercentage = totalSoloCost > 0 ? Math.round((totalSavings / totalSoloCost) * 100) : 0;

  const formulaExplanation = `Shared Cost Formula: Each farmer pays (Their Kg ÷ Total Pool Kg) × Single Vehicle Hire (₹${totalVehicleHireCost}). Total individual booking would cost ₹${totalSoloCost.toLocaleString('en-IN')}; consolidated vehicle booking saves ₹${totalSavings.toLocaleString('en-IN')} (${savingsPercentage}% collective saving).`;

  return {
    totalQuantity,
    vehicleCapacity,
    utilizationPercent,
    totalSoloCost,
    totalSharedCost,
    totalSavings,
    savingsPercentage,
    members: processedMembers,
    formulaExplanation,
  };
}

/**
 * Validates whether a new farmer can join an existing pool
 */
export function validatePoolJoin(
  pool: TransportPool,
  newQuantityKg: number,
  newCropId?: string
): { eligible: boolean; reason: string } {
  if (pool.status !== 'active') {
    return { eligible: false, reason: 'This transport pool is no longer accepting new members.' };
  }

  if (pool.totalQuantity + newQuantityKg > pool.vehicleCapacity) {
    const availableSpace = pool.vehicleCapacity - pool.totalQuantity;
    return {
      eligible: false,
      reason: `Vehicle capacity exceeded. Only ${availableSpace} kg remaining in this ${pool.vehicleCapacity} kg vehicle.`,
    };
  }

  // Cross-crop compatibility (e.g. potatoes and onions can travel together, but sensitive items might need caution)
  if (newCropId && pool.cropId && pool.cropId !== newCropId) {
    const compatibleGroups = [
      ['crop-potato', 'crop-onion', 'crop-wheat'],
      ['crop-tomato'], // tomatoes are soft produce
      ['crop-rice', 'crop-wheat', 'crop-mustard'],
    ];

    const isCompatible = compatibleGroups.some(group => group.includes(pool.cropId) && group.includes(newCropId));
    if (!isCompatible) {
      return {
        eligible: false,
        reason: 'Crop compatibility notice: Mixing delicate produce with bulk grains/tubers requires separate container partition.',
      };
    }
  }

  return { eligible: true, reason: 'Eligible to join this pooled route.' };
}
