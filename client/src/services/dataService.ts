import {
  MANDIS as DEFAULT_MANDIS,
  BUYER_OFFERS as DEFAULT_BUYERS,
  TRANSPORT_POOLS as DEFAULT_POOLS,
  TRANSPORT_PROVIDERS as DEFAULT_PROVIDERS,
  CROPS,
  CURRENT_FARMER,
  getPriceTrendStats,
} from '../data/mockData';
import { Mandi, BuyerOffer, TransportPool, TransportListing, Crop, Farmer } from '../types';

const STORAGE_KEYS = {
  MANDIS: 'mandimatch_mandis_v1',
  BUYER_OFFERS: 'mandimatch_buyers_v1',
  TRANSPORT_POOLS: 'mandimatch_pools_v1',
  TRANSPORT_PROVIDERS: 'mandimatch_providers_v1',
  CURRENT_FARMER: 'mandimatch_farmer_v1',
  USER_REQUESTS: 'mandimatch_user_requests_v1',
};

class DataService {
  private isLocalStorageAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  // --- CROPS & FARMER ---
  getCrops(): Crop[] {
    return CROPS;
  }

  getCurrentFarmer(): Farmer {
    if (!this.isLocalStorageAvailable()) return CURRENT_FARMER;
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_FARMER);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_FARMER, JSON.stringify(CURRENT_FARMER));
      return CURRENT_FARMER;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return CURRENT_FARMER;
    }
  }

  updateFarmer(farmer: Partial<Farmer>): Farmer {
    const current = this.getCurrentFarmer();
    const updated = { ...current, ...farmer };
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_FARMER, JSON.stringify(updated));
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('mandimatch_farmer_updated', { detail: updated }));
    }
    return updated;
  }

  // --- MANDIS ---
  getMandis(): Mandi[] {
    if (!this.isLocalStorageAvailable()) return DEFAULT_MANDIS;
    const stored = localStorage.getItem(STORAGE_KEYS.MANDIS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.MANDIS, JSON.stringify(DEFAULT_MANDIS));
      return DEFAULT_MANDIS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return DEFAULT_MANDIS;
    }
  }

  addMandi(mandi: Omit<Mandi, 'id'>): Mandi {
    const mandis = this.getMandis();
    const newMandi: Mandi = {
      ...mandi,
      id: `mandi-custom-${Date.now()}`,
    };
    mandis.unshift(newMandi);
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(STORAGE_KEYS.MANDIS, JSON.stringify(mandis));
    }
    return newMandi;
  }

  updateMandi(id: string, updates: Partial<Mandi>): Mandi | null {
    const mandis = this.getMandis();
    const idx = mandis.findIndex(m => m.id === id);
    if (idx === -1) return null;
    mandis[idx] = { ...mandis[idx], ...updates };
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(STORAGE_KEYS.MANDIS, JSON.stringify(mandis));
    }
    return mandis[idx];
  }

  deleteMandi(id: string): boolean {
    const mandis = this.getMandis().filter(m => m.id !== id);
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(STORAGE_KEYS.MANDIS, JSON.stringify(mandis));
    }
    return true;
  }

  // --- BUYER OFFERS ---
  getBuyerOffers(): BuyerOffer[] {
    if (!this.isLocalStorageAvailable()) return DEFAULT_BUYERS;
    const stored = localStorage.getItem(STORAGE_KEYS.BUYER_OFFERS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.BUYER_OFFERS, JSON.stringify(DEFAULT_BUYERS));
      return DEFAULT_BUYERS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return DEFAULT_BUYERS;
    }
  }

  addBuyerOffer(offer: Omit<BuyerOffer, 'id'>): BuyerOffer {
    const offers = this.getBuyerOffers();
    const newOffer: BuyerOffer = {
      ...offer,
      id: `buyer-${Date.now()}`,
      verified: offer.verified ?? true,
      status: 'open',
    };
    offers.unshift(newOffer);
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(STORAGE_KEYS.BUYER_OFFERS, JSON.stringify(offers));
    }
    return newOffer;
  }

  updateBuyerOffer(id: string, updates: Partial<BuyerOffer>): BuyerOffer | null {
    const offers = this.getBuyerOffers();
    const idx = offers.findIndex(b => b.id === id);
    if (idx === -1) return null;
    offers[idx] = { ...offers[idx], ...updates };
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(STORAGE_KEYS.BUYER_OFFERS, JSON.stringify(offers));
    }
    return offers[idx];
  }

  deleteBuyerOffer(id: string): boolean {
    const offers = this.getBuyerOffers().filter(b => b.id !== id);
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(STORAGE_KEYS.BUYER_OFFERS, JSON.stringify(offers));
    }
    return true;
  }

  // --- TRANSPORT POOLS ---
  getTransportPools(): TransportPool[] {
    if (!this.isLocalStorageAvailable()) return DEFAULT_POOLS;
    const stored = localStorage.getItem(STORAGE_KEYS.TRANSPORT_POOLS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.TRANSPORT_POOLS, JSON.stringify(DEFAULT_POOLS));
      return DEFAULT_POOLS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return DEFAULT_POOLS;
    }
  }

  createTransportPool(pool: Omit<TransportPool, 'id' | 'status'>): TransportPool {
    const pools = this.getTransportPools();
    const newPool: TransportPool = {
      ...pool,
      id: `pool-${Date.now()}`,
      status: 'active',
    };
    pools.unshift(newPool);
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(STORAGE_KEYS.TRANSPORT_POOLS, JSON.stringify(pools));
    }
    return newPool;
  }

  joinPool(poolId: string, memberData: { farmerId: string; farmerName: string; village: string; cropId: string; quantityKg: number; lat: number; lng: number }): TransportPool | null {
    const pools = this.getTransportPools();
    const pool = pools.find(p => p.id === poolId);
    if (!pool) return null;

    // Solo cost calculation if individual
    const indCost = Math.round(750 + (memberData.quantityKg * 0.45));
    const newTotalQty = pool.totalQuantity + memberData.quantityKg;

    // Recalculate members shared cost
    const existingMembers = pool.members.filter(m => m.farmerId !== memberData.farmerId);
    const newMemberList = [
      ...existingMembers,
      {
        ...memberData,
        individualCost: indCost,
        sharedCost: 0,
        savings: 0,
      },
    ];

    let totalSolo = 0;
    const updatedMembers = newMemberList.map(m => {
      totalSolo += m.individualCost;
      const weightShare = m.quantityKg / newTotalQty;
      const sharedCost = Math.round(weightShare * pool.totalSharedCost);
      const savings = Math.max(0, m.individualCost - sharedCost);
      return {
        ...m,
        sharedCost,
        savings,
      };
    });

    pool.totalQuantity = newTotalQty;
    pool.totalSoloCost = totalSolo;
    pool.totalSavings = Math.max(0, totalSolo - pool.totalSharedCost);
    pool.members = updatedMembers;
    if (pool.totalQuantity >= pool.vehicleCapacity) {
      pool.status = 'full';
    }

    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(STORAGE_KEYS.TRANSPORT_POOLS, JSON.stringify(pools));
    }
    return pool;
  }

  // --- TRANSPORT PROVIDERS ---
  getTransportProviders(): TransportListing[] {
    if (!this.isLocalStorageAvailable()) return DEFAULT_PROVIDERS;
    const stored = localStorage.getItem(STORAGE_KEYS.TRANSPORT_PROVIDERS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.TRANSPORT_PROVIDERS, JSON.stringify(DEFAULT_PROVIDERS));
      return DEFAULT_PROVIDERS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return DEFAULT_PROVIDERS;
    }
  }

  addTransportListing(listing: Omit<TransportListing, 'id'>): TransportListing {
    const listings = this.getTransportProviders();
    const newListing: TransportListing = {
      ...listing,
      id: `tr-${Date.now()}`,
    };
    listings.unshift(newListing);
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(STORAGE_KEYS.TRANSPORT_PROVIDERS, JSON.stringify(listings));
    }
    return newListing;
  }

  // --- DEMO RESET ---
  resetToDefaults(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(STORAGE_KEYS.MANDIS);
      localStorage.removeItem(STORAGE_KEYS.BUYER_OFFERS);
      localStorage.removeItem(STORAGE_KEYS.TRANSPORT_POOLS);
      localStorage.removeItem(STORAGE_KEYS.TRANSPORT_PROVIDERS);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_FARMER);
    }
  }

  // --- PRICE TRENDS ---
  getPriceTrends(cropId: string, mandiId?: string) {
    return getPriceTrendStats(cropId, mandiId);
  }
}

export const dataService = new DataService();
