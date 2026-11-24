export interface PoolMemberModel {
  farmerId: string;
  farmerName: string;
  village: string;
  quantityKg: number;
  individualCost: number;
  sharedCost: number;
  savings: number;
}

export function calculatePoolEconomicsServer(
  members: Array<{ farmerId: string; farmerName: string; village: string; quantityKg: number; soloBookingCost?: number }>,
  totalVehicleHireCost: number,
  vehicleCapacity: number
) {
  const totalQuantity = members.reduce((sum, m) => sum + m.quantityKg, 0);
  let totalSoloCost = 0;

  const processed: PoolMemberModel[] = members.map(m => {
    const individualCost = m.soloBookingCost ?? Math.round(750 + (m.quantityKg * 0.45));
    totalSoloCost += individualCost;
    const share = totalQuantity > 0 ? (m.quantityKg / totalQuantity) : 0;
    const sharedCost = Math.round(share * totalVehicleHireCost);
    const savings = Math.max(0, individualCost - sharedCost);

    return {
      farmerId: m.farmerId,
      farmerName: m.farmerName,
      village: m.village,
      quantityKg: m.quantityKg,
      individualCost,
      sharedCost,
      savings,
    };
  });

  const totalSharedCost = totalVehicleHireCost;
  const totalSavings = Math.max(0, totalSoloCost - totalSharedCost);
  const savingsPercent = totalSoloCost > 0 ? Math.round((totalSavings / totalSoloCost) * 100) : 0;

  return {
    totalQuantity,
    vehicleCapacity,
    totalSoloCost,
    totalSharedCost,
    totalSavings,
    savingsPercent,
    members: processed,
  };
}
