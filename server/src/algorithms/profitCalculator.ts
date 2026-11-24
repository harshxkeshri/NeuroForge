export interface MandiModel {
  id: string;
  cropId: string;
  mandiName: string;
  district: string;
  state: string;
  pricePerKg: number;
  distanceKm: number;
  marketFeePercent: number;
}

export interface CalculationOptions {
  quantityKg: number;
  mandi: MandiModel;
  baseBookingCost?: number;
  ratePerKm?: number;
  loadingRatePerKg?: number;
  customMandiFeeRate?: number;
  isPooled?: boolean;
  poolDiscountPercent?: number;
}

export function calculateMarketReturn(options: CalculationOptions) {
  const {
    quantityKg,
    mandi,
    baseBookingCost = 350,
    ratePerKm = 24,
    loadingRatePerKg = 0.20,
    customMandiFeeRate,
    isPooled = false,
    poolDiscountPercent = 40,
  } = options;

  const grossSale = Math.round(quantityKg * mandi.pricePerKg);
  const weightFactor = Math.max(1, quantityKg / 1000);
  let rawTransport = baseBookingCost + (mandi.distanceKm * ratePerKm * (1 + (weightFactor - 1) * 0.25));

  if (isPooled) {
    rawTransport = rawTransport * (1 - poolDiscountPercent / 100);
  }

  const transportCost = Math.round(rawTransport);
  const feeRate = customMandiFeeRate !== undefined ? customMandiFeeRate : (mandi.marketFeePercent / 100);
  const mandiTax = grossSale * feeRate;
  const loadingFee = quantityKg * loadingRatePerKg;
  const otherCosts = Math.round(mandiTax + loadingFee);

  const netReturn = grossSale - transportCost - otherCosts;
  const netPricePerKg = quantityKg > 0 ? Number((netReturn / quantityKg).toFixed(2)) : 0;

  return {
    mandi,
    quantityKg,
    grossSale,
    transportCost,
    otherCosts,
    netReturn,
    netPricePerKg,
  };
}
