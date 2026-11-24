import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { rankMarketsServer } from './algorithms/marketRanker.js';
import { matchBuyersServer } from './algorithms/buyerMatcher.js';
import { calculatePoolEconomicsServer } from './algorithms/transportPooler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// In-memory demo store (mirrored with seed)
let demoMandis = [
  { id: 'mandi-shb-pot', cropId: 'crop-potato', mandiName: 'Sahibabad Mandi', district: 'Ghaziabad', state: 'Uttar Pradesh', pricePerKg: 19.5, distanceKm: 12.0, marketFeePercent: 1.5 },
  { id: 'mandi-gzb-pot', cropId: 'crop-potato', mandiName: 'Ghaziabad Main Sabzi Mandi', district: 'Ghaziabad', state: 'Uttar Pradesh', pricePerKg: 18.0, distanceKm: 6.5, marketFeePercent: 1.5 },
  { id: 'mandi-azd-pot', cropId: 'crop-potato', mandiName: 'Azadpur Mandi (Asia Largest)', district: 'North West Delhi', state: 'Delhi', pricePerKg: 21.8, distanceKm: 34.0, marketFeePercent: 1.0 },
  { id: 'mandi-gzp-pot', cropId: 'crop-potato', mandiName: 'Ghazipur Mandi', district: 'East Delhi', state: 'Delhi', pricePerKg: 19.8, distanceKm: 16.5, marketFeePercent: 1.2 },
  { id: 'mandi-okh-pot', cropId: 'crop-potato', mandiName: 'Okhla Mandi', district: 'South Delhi', state: 'Delhi', pricePerKg: 20.2, distanceKm: 29.0, marketFeePercent: 1.2 },
  { id: 'mandi-hpr-pot', cropId: 'crop-potato', mandiName: 'Hapur Krishi Upaj Mandi', district: 'Hapur', state: 'Uttar Pradesh', pricePerKg: 18.2, distanceKm: 36.0, marketFeePercent: 1.5 },
  { id: 'mandi-mrt-pot', cropId: 'crop-potato', mandiName: 'Meerut Naveen Mandi', district: 'Meerut', state: 'Uttar Pradesh', pricePerKg: 18.9, distanceKm: 48.0, marketFeePercent: 1.5 },
  { id: 'mandi-noi-pot', cropId: 'crop-potato', mandiName: 'Noida Phase-2 Mandi', district: 'Gautam Buddha Nagar', state: 'Uttar Pradesh', pricePerKg: 19.1, distanceKm: 22.0, marketFeePercent: 1.5 },
];

let demoBuyers = [
  { id: 'buyer-1', buyerName: 'Safal Mother Dairy Hub', cropId: 'crop-potato', quantityRequired: 2500, offeredPrice: 20.50, location: 'Patparganj Industrial Area', distanceKm: 18.0, pickupAvailable: true, verified: true, status: 'open' },
  { id: 'buyer-2', buyerName: 'Haldiram Snacks Ltd Processing Plant', cropId: 'crop-potato', quantityRequired: 5000, offeredPrice: 21.00, location: 'Sector 68, Noida', distanceKm: 24.0, pickupAvailable: true, verified: true, status: 'open' },
  { id: 'buyer-3', buyerName: 'DeHaat Kisan Procurement Hub', cropId: 'crop-potato', quantityRequired: 1500, offeredPrice: 20.00, location: 'Muradnagar, Ghaziabad', distanceKm: 14.0, pickupAvailable: true, verified: true, status: 'open' },
  { id: 'buyer-4', buyerName: 'BigBasket Regional Distribution Center', cropId: 'crop-potato', quantityRequired: 3000, offeredPrice: 20.80, location: 'Kashmiri Gate / Kundli', distanceKm: 38.0, pickupAvailable: false, verified: true, status: 'open' },
  { id: 'buyer-5', buyerName: 'Blinkit Quick Commerce Dark Store', cropId: 'crop-potato', quantityRequired: 800, offeredPrice: 21.50, location: 'Vaishali Sector 4, Ghaziabad', distanceKm: 9.5, pickupAvailable: true, verified: true, status: 'open' },
];

let demoPools = [
  {
    id: 'pool-1',
    title: 'Ghaziabad Cluster to Azadpur Mandi Express',
    destination: 'Azadpur Mandi (Asia Largest)',
    cropId: 'crop-potato',
    totalQuantity: 2000,
    vehicleCapacity: 2500,
    totalSoloCost: 3000,
    totalSharedCost: 1800,
    totalSavings: 1200,
    status: 'active',
    scheduledDeparture: 'Tomorrow at 04:30 AM',
    members: [
      { farmerId: 'farmer-ramesh', farmerName: 'Ramesh Kumar (You)', village: 'Dundahera, Ghaziabad', quantityKg: 500, individualCost: 1000, sharedCost: 450, savings: 550 },
      { farmerId: 'farmer-suresh', farmerName: 'Suresh Pal', village: 'Morta Village', quantityKg: 700, individualCost: 1000, sharedCost: 630, savings: 370 },
      { farmerId: 'farmer-mukesh', farmerName: 'Mukesh Tyagi', village: 'Muradnagar Dehat', quantityKg: 800, individualCost: 1000, sharedCost: 720, savings: 280 },
    ],
  },
];

// --- API ROUTES ---

// Health & Info
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    project: 'MandiMatch',
    version: '1.0.0',
    mode: 'Build for Bharat Hackathon API',
    timestamp: new Date().toISOString(),
  });
});

// Market Comparison Engine Route
app.post('/api/compare-markets', (req: Request, res: Response) => {
  const { cropId = 'crop-potato', quantityKg = 1000, maxDistanceKm = 100, isPooled = false } = req.body;
  const results = rankMarketsServer(cropId, Number(quantityKg), demoMandis, Number(maxDistanceKm), isPooled);
  res.json({
    cropId,
    quantityKg,
    totalMarketsCompared: results.length,
    results,
    bestMarket: results[0] || null,
  });
});

// Buyer Matching Engine Route
app.post('/api/match-buyers', (req: Request, res: Response) => {
  const { cropId = 'crop-potato', quantityKg = 1000, farmerBasePrice = 18.0 } = req.body;
  const matches = matchBuyersServer(cropId, Number(quantityKg), demoBuyers, Number(farmerBasePrice));
  res.json({
    cropId,
    quantityKg,
    totalOffersFound: matches.length,
    matches,
  });
});

// Transport Pool Routes
app.get('/api/pools', (_req: Request, res: Response) => {
  res.json({ pools: demoPools });
});

app.post('/api/pools/calculate', (req: Request, res: Response) => {
  const { members, vehicleCost = 1800, capacity = 2500 } = req.body;
  const result = calculatePoolEconomicsServer(members || [], Number(vehicleCost), Number(capacity));
  res.json(result);
});

// Admin CRUD Routes
app.get('/api/admin/overview', (_req: Request, res: Response) => {
  res.json({
    totalMandis: demoMandis.length,
    totalBuyers: demoBuyers.length,
    totalPools: demoPools.length,
    activeFarmers: 10,
    cumulativeFarmerSavings: 48500,
  });
});

app.post('/api/admin/mandis', (req: Request, res: Response) => {
  const newMandi = { id: `mandi-custom-${Date.now()}`, ...req.body };
  demoMandis.unshift(newMandi);
  res.status(201).json(newMandi);
});

app.delete('/api/admin/mandis/:id', (req: Request, res: Response) => {
  demoMandis = demoMandis.filter(m => m.id !== req.params.id);
  res.json({ success: true });
});

// Start server
app.listen(PORT, () => {
  console.log(`🌾 MandiMatch Express Server listening on port ${PORT}`);
});
