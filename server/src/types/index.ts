// Server TypeScript Data Types

export type CropCategory = 'Vegetable' | 'Cereal' | 'Oilseed' | 'Pulse' | 'Fruit';

export interface Crop {
  id: string;
  cropName: string;
  hindiName: string;
  category: CropCategory;
  basePrice: number;
  unit: string;
  icon?: string;
}

export interface Farmer {
  id: string;
  name: string;
  hindiName?: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
}

export interface Mandi {
  id: string;
  cropId: string;
  mandiName: string;
  district: string;
  state: string;
  pricePerKg: number;
  distanceKm: number;
  lastUpdated: string;
  source: string;
  dataType: 'demo' | 'live';
  lat: number;
  lng: number;
  marketFeePercent: number;
}

export interface MarketCalculationResult {
  mandi: Mandi;
  quantityKg: number;
  grossSale: number;
  transportCost: number;
  otherCosts: number;
  netReturn: number;
  netPricePerKg: number;
  rank: number;
  isBest: boolean;
  savingsVsWorst: number;
  recommendationReason: string;
}

export interface BuyerOffer {
  id: string;
  buyerName: string;
  companyType: string;
  cropId: string;
  quantityRequired: number;
  offeredPrice: number;
  location: string;
  distanceKm: number;
  pickupAvailable: boolean;
  verified: boolean;
  status: 'open' | 'matched' | 'closed';
  expiryDate: string;
  contactPhone: string;
  rating?: number;
  minPurchaseKg?: number;
}

export interface BuyerMatchResult {
  buyer: BuyerOffer;
  matchScore: number;
  scoreBreakdown: {
    priceScore: number;
    distanceScore: number;
    quantityScore: number;
    convenienceBonus: number;
  };
  farmerQuantityKg: number;
  totalEarnings: number;
  pickupAdvantage: string;
  matchReason: string;
}

export interface TransportListing {
  id: string;
  providerName: string;
  vehicleType: string;
  capacityKg: number;
  baseRatePerKm: number;
  destination: string;
  cost: number;
  availableDate: string;
  status: 'available' | 'booked';
  phone: string;
}

export interface PoolMember {
  farmerId: string;
  farmerName: string;
  village: string;
  cropId: string;
  quantityKg: number;
  lat: number;
  lng: number;
  individualCost: number;
  sharedCost: number;
  savings: number;
}

export interface TransportPool {
  id: string;
  title: string;
  destination: string;
  cropId: string;
  totalQuantity: number;
  vehicleCapacity: number;
  totalSoloCost: number;
  totalSharedCost: number;
  totalSavings: number;
  status: 'active' | 'full' | 'departed';
  scheduledDeparture: string;
  routeStops: string[];
  members: PoolMember[];
}
