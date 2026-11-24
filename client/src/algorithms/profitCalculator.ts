import { Mandi, MarketCalculationResult } from '../types';

export interface CalculationOptions {
  quantityKg: number;
  mandi: Mandi;
  baseBookingCost?: number; // Base flat charge for vehicle e.g. ₹350
  ratePerKm?: number;        // ₹/km e.g. ₹25/km for small commercial vehicle
  loadingRatePerKg?: number; // e.g. ₹0.20 per kg
  customMandiFeeRate?: number; // e.g. 0.015 (1.5%)
  isPooled?: boolean;
  poolDiscountPercent?: number; // e.g. 40% savings if pooled
}

/**
 * Calculates Gross Sale, Transport Cost, Market Taxes/Loading Fees, and Net Return.
 * Formula:
 * Gross Sale = Quantity × Price Per Kg
 * Transport Cost = Base Booking + (Distance × Rate per Km) [Discounted if pooled]
 * Other Costs = (Gross Sale × Mandi Fee Rate) + (Quantity × Loading Rate)
 * Net Return = Gross Sale - Transport Cost - Other Costs
 */
export function calculateMarketReturn(options: CalculationOptions): MarketCalculationResult {
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

  // Standard Solo Transport calculation based on distance and payload scale
  // Base cost + (distance * rate per km) + slight scale for heavy loads (>1000kg)
  const weightFactor = Math.max(1, quantityKg / 1000);
  let rawTransport = baseBookingCost + (mandi.distanceKm * ratePerKm * (1 + (weightFactor - 1) * 0.25));

  if (isPooled) {
    rawTransport = rawTransport * (1 - poolDiscountPercent / 100);
  }

  const transportCost = Math.round(rawTransport);

  const mandiFeeRate = customMandiFeeRate !== undefined ? customMandiFeeRate : (mandi.marketFeePercent / 100);
  const mandiTax = grossSale * mandiFeeRate;
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
    rank: 0,
    isBest: false,
    savingsVsWorst: 0,
    recommendationReason: '',
  };
}
