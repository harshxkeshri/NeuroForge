-- MandiMatch Seed Data
-- Realistic Uttar Pradesh & NCR Agro-Ecosystem Data (DEMO DATA)

-- 1. Crops
INSERT INTO crops (id, crop_name, hindi_name, category, base_mandi_price, unit) VALUES
('crop-potato', 'Potato', 'आलू (Aloo)', 'Vegetable', 18.50, 'kg'),
('crop-wheat', 'Wheat', 'गेहूं (Gehun)', 'Cereal', 24.20, 'kg'),
('crop-tomato', 'Tomato', 'टमाटर (Tamatar)', 'Vegetable', 32.00, 'kg'),
('crop-onion', 'Onion', 'प्याज़ (Pyaaz)', 'Vegetable', 28.50, 'kg'),
('crop-rice', 'Rice (Basmati/Paddy)', 'चावल/धान (Dhan)', 'Cereal', 36.00, 'kg'),
('crop-mustard', 'Mustard', 'सरसों (Sarson)', 'Oilseed', 54.00, 'kg')
ON CONFLICT (id) DO NOTHING;

-- 2. Farmers
INSERT INTO farmers (id, name, phone, village, district, state, latitude, longitude) VALUES
('farmer-ramesh', 'Ramesh Kumar', '+91 98765 43210', 'Dundahera', 'Ghaziabad', 'Uttar Pradesh', 28.6692, 77.4538),
('farmer-suresh', 'Suresh Pal', '+91 98765 43211', 'Morta', 'Ghaziabad', 'Uttar Pradesh', 28.7214, 77.4612),
('farmer-mukesh', 'Mukesh Tyagi', '+91 98765 43212', 'Muradnagar Dehat', 'Ghaziabad', 'Uttar Pradesh', 28.7756, 77.5029),
('farmer-ramavtar', 'Ram Avtar Singh', '+91 98765 43213', 'Loni Khurd', 'Ghaziabad', 'Uttar Pradesh', 28.7511, 77.2882),
('farmer-dinesh', 'Dinesh Sharma', '+91 98765 43214', 'Pilkhuwa', 'Hapur', 'Uttar Pradesh', 28.7128, 77.6534),
('farmer-baldev', 'Baldev Singh', '+91 98765 43215', 'Modinagar', 'Ghaziabad', 'Uttar Pradesh', 28.8315, 77.5786),
('farmer-anil', 'Anil Verma', '+91 98765 43216', 'Bhojpur', 'Ghaziabad', 'Uttar Pradesh', 28.8055, 77.6210),
('farmer-rajesh', 'Rajesh Choudhary', '+91 98765 43217', 'Dasna', 'Ghaziabad', 'Uttar Pradesh', 28.6791, 77.5312),
('farmer-sunil', 'Sunil Yadav', '+91 98765 43218', 'Chhapraula', 'Gautam Buddha Nagar', 'Uttar Pradesh', 28.5812, 77.4615),
('farmer-jaiprakash', 'Jai Prakash Lodhi', '+91 98765 43219', 'Khekra Border', 'Baghpat', 'Uttar Pradesh', 28.8711, 77.2831)
ON CONFLICT (id) DO NOTHING;

-- 3. Mandi Prices (Ghaziabad origin reference: 0 km from Ghaziabad center)
INSERT INTO mandi_prices (id, crop_id, mandi_name, district, state, price_per_kg, distance_km, date, source, data_type) VALUES
('mandi-shb-pot', 'crop-potato', 'Sahibabad Mandi', 'Ghaziabad', 'Uttar Pradesh', 19.50, 12.0, CURRENT_DATE, 'Agmarknet Simulated', 'demo'),
('mandi-gzb-pot', 'crop-potato', 'Ghaziabad Main Sabzi Mandi', 'Ghaziabad', 'Uttar Pradesh', 18.00, 6.5, CURRENT_DATE, 'Agmarknet Simulated', 'demo'),
('mandi-azd-pot', 'crop-potato', 'Azadpur Mandi (Asia Largest)', 'North West Delhi', 'Delhi', 21.80, 34.0, CURRENT_DATE, 'Agmarknet Simulated', 'demo'),
('mandi-gzp-pot', 'crop-potato', 'Ghazipur Mandi', 'East Delhi', 'Delhi', 19.80, 16.5, CURRENT_DATE, 'Agmarknet Simulated', 'demo'),
('mandi-okh-pot', 'crop-potato', 'Okhla Mandi', 'South Delhi', 'Delhi', 20.20, 29.0, CURRENT_DATE, 'Agmarknet Simulated', 'demo'),
('mandi-hpr-pot', 'crop-potato', 'Hapur Krishi Upaj Mandi', 'Hapur', 'Uttar Pradesh', 18.20, 36.0, CURRENT_DATE, 'Agmarknet Simulated', 'demo'),
('mandi-mrt-pot', 'crop-potato', 'Meerut Naveen Mandi', 'Meerut', 'Uttar Pradesh', 18.90, 48.0, CURRENT_DATE, 'Agmarknet Simulated', 'demo'),
('mandi-noi-pot', 'crop-potato', 'Noida Phase-2 Mandi', 'Gautam Buddha Nagar', 'Uttar Pradesh', 19.10, 22.0, CURRENT_DATE, 'Agmarknet Simulated', 'demo'),

('mandi-shb-wht', 'crop-wheat', 'Sahibabad Mandi', 'Ghaziabad', 'Uttar Pradesh', 24.50, 12.0, CURRENT_DATE, 'Agmarknet Simulated', 'demo'),
('mandi-gzb-wht', 'crop-wheat', 'Ghaziabad Main Sabzi Mandi', 'Ghaziabad', 'Uttar Pradesh', 24.10, 6.5, CURRENT_DATE, 'Agmarknet Simulated', 'demo'),
('mandi-azd-wht', 'crop-wheat', 'Azadpur Mandi (Asia Largest)', 'North West Delhi', 'Delhi', 25.80, 34.0, CURRENT_DATE, 'Agmarknet Simulated', 'demo'),
('mandi-hpr-wht', 'crop-wheat', 'Hapur Krishi Upaj Mandi', 'Hapur', 'Uttar Pradesh', 25.20, 36.0, CURRENT_DATE, 'Agmarknet Simulated', 'demo'),

('mandi-shb-tom', 'crop-tomato', 'Sahibabad Mandi', 'Ghaziabad', 'Uttar Pradesh', 33.00, 12.0, CURRENT_DATE, 'Agmarknet Simulated', 'demo'),
('mandi-azd-tom', 'crop-tomato', 'Azadpur Mandi (Asia Largest)', 'North West Delhi', 'Delhi', 38.50, 34.0, CURRENT_DATE, 'Agmarknet Simulated', 'demo'),
('mandi-gzp-tom', 'crop-tomato', 'Ghazipur Mandi', 'East Delhi', 'Delhi', 35.00, 16.5, CURRENT_DATE, 'Agmarknet Simulated', 'demo'),
('mandi-okh-tom', 'crop-tomato', 'Okhla Mandi', 'South Delhi', 'Delhi', 36.20, 29.0, CURRENT_DATE, 'Agmarknet Simulated', 'demo'),

('mandi-shb-oni', 'crop-onion', 'Sahibabad Mandi', 'Ghaziabad', 'Uttar Pradesh', 29.00, 12.0, CURRENT_DATE, 'Agmarknet Simulated', 'demo'),
('mandi-azd-oni', 'crop-onion', 'Azadpur Mandi (Asia Largest)', 'North West Delhi', 'Delhi', 32.50, 34.0, CURRENT_DATE, 'Agmarknet Simulated', 'demo'),
('mandi-gzp-oni', 'crop-onion', 'Ghazipur Mandi', 'East Delhi', 'Delhi', 30.00, 16.5, CURRENT_DATE, 'Agmarknet Simulated', 'demo'),
('mandi-noi-oni', 'crop-onion', 'Noida Phase-2 Mandi', 'Gautam Buddha Nagar', 'Uttar Pradesh', 29.80, 22.0, CURRENT_DATE, 'Agmarknet Simulated', 'demo'),

('mandi-shb-ric', 'crop-rice', 'Sahibabad Mandi', 'Ghaziabad', 'Uttar Pradesh', 36.50, 12.0, CURRENT_DATE, 'Agmarknet Simulated', 'demo'),
('mandi-hpr-ric', 'crop-rice', 'Hapur Krishi Upaj Mandi', 'Hapur', 'Uttar Pradesh', 38.00, 36.0, CURRENT_DATE, 'Agmarknet Simulated', 'demo'),
('mandi-azd-ric', 'crop-rice', 'Azadpur Mandi (Asia Largest)', 'North West Delhi', 'Delhi', 39.50, 34.0, CURRENT_DATE, 'Agmarknet Simulated', 'demo'),

('mandi-hpr-mus', 'crop-mustard', 'Hapur Krishi Upaj Mandi', 'Hapur', 'Uttar Pradesh', 56.50, 36.0, CURRENT_DATE, 'Agmarknet Simulated', 'demo'),
('mandi-mrt-mus', 'crop-mustard', 'Meerut Naveen Mandi', 'Meerut', 'Uttar Pradesh', 55.80, 48.0, CURRENT_DATE, 'Agmarknet Simulated', 'demo')
ON CONFLICT (id) DO NOTHING;

-- 4. Buyer Offers (20+ realistic buyers)
INSERT INTO buyer_offers (id, buyer_name, company_type, crop_id, quantity_required, offered_price, location, distance_km, pickup_available, verified, status, expiry_date, contact_phone) VALUES
('buyer-1', 'Safal Mother Dairy Hub', 'National Retail Chain', 'crop-potato', 2500, 20.50, 'Patparganj Industrial Area', 18.0, true, true, 'open', CURRENT_DATE + INTERVAL '5 days', '+91 99100 11221'),
('buyer-2', 'Haldiram Snacks Ltd Processing Plant', 'Food Processor', 'crop-potato', 5000, 21.00, 'Sector 68, Noida', 24.0, true, true, 'open', CURRENT_DATE + INTERVAL '7 days', '+91 99100 11222'),
('buyer-3', 'DeHaat Kisan Procurement Hub', 'Agri-Tech Platform', 'crop-potato', 1500, 20.00, 'Muradnagar, Ghaziabad', 14.0, true, true, 'open', CURRENT_DATE + INTERVAL '3 days', '+91 99100 11223'),
('buyer-4', 'BigBasket Regional Distribution Center', 'E-Grocery Hub', 'crop-potato', 3000, 20.80, 'Kashmiri Gate / Kundli', 38.0, false, true, 'open', CURRENT_DATE + INTERVAL '4 days', '+91 99100 11224'),
('buyer-5', 'Blinkit Quick Commerce Dark Store', 'Quick Commerce', 'crop-potato', 800, 21.50, 'Vaishali Sector 4, Ghaziabad', 9.5, true, true, 'open', CURRENT_DATE + INTERVAL '2 days', '+91 99100 11225'),
('buyer-6', 'Kisan Kalyan FPO Cooperative', 'Farmer Producer Org', 'crop-potato', 2000, 19.80, 'Dasna, Ghaziabad', 11.0, true, true, 'open', CURRENT_DATE + INTERVAL '8 days', '+91 99100 11226'),
('buyer-7', 'Reliance Retail Fresh Collection Hub', 'National Supermarket', 'crop-potato', 4000, 20.20, 'Greater Noida Depot', 31.0, false, true, 'open', CURRENT_DATE + INTERVAL '6 days', '+91 99100 11227'),
('buyer-8', 'McCain Potato Processing Partners', 'Food Processing', 'crop-potato', 10000, 22.00, 'Hapur Industrial Corridor', 35.0, true, true, 'open', CURRENT_DATE + INTERVAL '12 days', '+91 99100 11228'),

('buyer-9', 'ITC Choupal Saagar Hub', 'Agri-Enterprise', 'crop-wheat', 8000, 26.00, 'Hapur Road Terminal', 32.0, false, true, 'open', CURRENT_DATE + INTERVAL '10 days', '+91 99100 11229'),
('buyer-10', 'Aashirvaad Atta Procurement Agency', 'Food Brand', 'crop-wheat', 12000, 26.50, 'Ghaziabad Rail Goods Shed', 7.0, true, true, 'open', CURRENT_DATE + INTERVAL '14 days', '+91 99100 11230'),
('buyer-11', 'Patanjali Agro Flour Mills', 'Food Processor', 'crop-wheat', 6000, 25.80, 'Modinagar Industrial Zone', 25.0, true, true, 'open', CURRENT_DATE + INTERVAL '9 days', '+91 99100 11231'),

('buyer-12', 'Kissan Pure Puree Processing Unit', 'Condiments Processor', 'crop-tomato', 3500, 36.00, 'Sahibabad Site IV', 10.5, true, true, 'open', CURRENT_DATE + INTERVAL '3 days', '+91 99100 11232'),
('buyer-13', 'Zepto City Hub East NCR', 'Quick Commerce', 'crop-tomato', 1200, 37.50, 'Indirapuram, Ghaziabad', 8.0, true, true, 'open', CURRENT_DATE + INTERVAL '2 days', '+91 99100 11233'),
('buyer-14', 'Delhi NCR Hotel & Caterers Guild', 'Hospitality Procurement', 'crop-tomato', 1800, 35.50, 'Ghazipur Border Facility', 15.0, false, true, 'open', CURRENT_DATE + INTERVAL '4 days', '+91 99100 11234'),

('buyer-15', 'Nafed Buffer Stock Agency', 'Govt Agency/Coop', 'crop-onion', 15000, 31.00, 'Lawrence Road Godown', 32.0, false, true, 'open', CURRENT_DATE + INTERVAL '15 days', '+91 99100 11235'),
('buyer-16', 'FreshToHome Organics', 'E-Commerce', 'crop-onion', 2200, 31.50, 'Noida Sector 63', 14.5, true, true, 'open', CURRENT_DATE + INTERVAL '5 days', '+91 99100 11236'),
('buyer-17', 'Subway / QSR Supply Chain India', 'Food Chain', 'crop-onion', 1000, 33.00, 'Okhla Phase III', 28.0, true, true, 'open', CURRENT_DATE + INTERVAL '6 days', '+91 99100 11237'),

('buyer-18', 'Daawat Basmati Export House', 'Export House', 'crop-rice', 20000, 42.00, 'Kundli Cold Storage Park', 45.0, true, true, 'open', CURRENT_DATE + INTERVAL '20 days', '+91 99100 11238'),
('buyer-19', 'India Gate Rice Milling Unit', 'Rice Mill', 'crop-rice', 15000, 41.50, 'Hapur Rice Belt', 34.0, false, true, 'open', CURRENT_DATE + INTERVAL '15 days', '+91 99100 11239'),

('buyer-20', 'Dhara / NDDB Oil Extraction Depot', 'Oil Processor', 'crop-mustard', 4000, 58.00, 'Meerut Bypass Oil Mill', 42.0, true, true, 'open', CURRENT_DATE + INTERVAL '11 days', '+91 99100 11240'),
('buyer-21', 'Fortune Agro Refineries', 'Edible Oil Producer', 'crop-mustard', 8000, 59.50, 'Ghaziabad Bulk Center', 8.5, true, true, 'open', CURRENT_DATE + INTERVAL '8 days', '+91 99100 11241')
ON CONFLICT (id) DO NOTHING;

-- 5. Transport Listings (Providers)
INSERT INTO transport_listings (id, provider_name, vehicle_type, capacity_kg, base_rate_per_km, destination, cost, available_date, status, phone) VALUES
('tr-1', 'Kisan Express Mini-Trucks', 'Tata Ace Gold (Chota Hathi)', 1200, 22.0, 'Sahibabad & Ghazipur Mandis', 950, CURRENT_DATE, 'available', '+91 98110 55441'),
('tr-2', 'NCR Agro Freight Bolero Maxi', 'Mahindra Bolero Pickup', 2000, 28.0, 'Azadpur Mandi Delhi', 1800, CURRENT_DATE, 'available', '+91 98110 55442'),
('tr-3', 'Gramin Goods Carrier Eicher 14ft', 'Eicher Pro 1110', 4500, 45.0, 'Delhi NCR / Okhla / Azadpur', 3400, CURRENT_DATE, 'available', '+91 98110 55443'),
('tr-4', 'Chaudhary Kisan Roadways', 'Tata 407', 3000, 34.0, 'Hapur & Meerut Mandis', 2100, CURRENT_DATE, 'available', '+91 98110 55444'),
('tr-5', 'Green Haulage EV Logistics', 'Tata Ace EV Tipper', 1000, 18.0, 'Local Ghaziabad / Sahibabad Hubs', 750, CURRENT_DATE, 'available', '+91 98110 55445')
ON CONFLICT (id) DO NOTHING;

-- 6. Transport Pools (Pre-seeded live pool scenario)
-- Ramesh (500kg) + Suresh (700kg) + Mukesh (800kg) = 2,000kg. Tata Bolero Pickup (2,000 kg cap)
INSERT INTO transport_pools (id, title, destination, crop_id, total_quantity, vehicle_capacity, total_cost, status, scheduled_departure) VALUES
('pool-1', 'Ghaziabad Cluster to Azadpur Mandi Express', 'Azadpur Mandi (Asia Largest)', 'crop-potato', 2000, 2500, 1800, 'active', CURRENT_DATE + INTERVAL '1 day'),
('pool-2', 'Muradnagar & Morta to Sahibabad Daily Route', 'Sahibabad Mandi', 'crop-tomato', 1600, 2000, 1200, 'active', CURRENT_DATE + INTERVAL '1 day'),
('pool-3', 'Hapur Road Farmers to Ghazipur Terminal', 'Ghazipur Mandi', 'crop-onion', 2800, 3500, 2200, 'active', CURRENT_DATE + INTERVAL '2 days')
ON CONFLICT (id) DO NOTHING;
