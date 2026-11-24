-- MandiMatch Database Schema
-- Supabase / PostgreSQL Compatible
-- Build for Bharat Hackathon Project

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Crops Table
CREATE TABLE IF NOT EXISTS crops (
    id TEXT PRIMARY KEY,
    crop_name TEXT NOT NULL,
    hindi_name TEXT,
    category TEXT NOT NULL DEFAULT 'Vegetable',
    base_mandi_price NUMERIC(10, 2) NOT NULL,
    unit TEXT DEFAULT 'kg',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Farmers Table
CREATE TABLE IF NOT EXISTS farmers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    village TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'Uttar Pradesh',
    latitude NUMERIC(10, 6),
    longitude NUMERIC(10, 6),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Mandi Prices Table
CREATE TABLE IF NOT EXISTS mandi_prices (
    id TEXT PRIMARY KEY,
    crop_id TEXT REFERENCES crops(id) ON DELETE CASCADE,
    mandi_name TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'Uttar Pradesh',
    price_per_kg NUMERIC(10, 2) NOT NULL,
    distance_km NUMERIC(10, 1) NOT NULL,
    date DATE NOT NULL,
    source TEXT NOT NULL DEFAULT 'Agmarknet Simulated',
    data_type TEXT NOT NULL DEFAULT 'demo', -- 'demo' or 'live'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Buyer Offers Table
CREATE TABLE IF NOT EXISTS buyer_offers (
    id TEXT PRIMARY KEY,
    buyer_name TEXT NOT NULL,
    company_type TEXT DEFAULT 'FPO / Wholesale Buyer',
    crop_id TEXT REFERENCES crops(id) ON DELETE CASCADE,
    quantity_required NUMERIC(10, 2) NOT NULL,
    offered_price NUMERIC(10, 2) NOT NULL,
    location TEXT NOT NULL,
    distance_km NUMERIC(10, 1) NOT NULL,
    pickup_available BOOLEAN DEFAULT false,
    verified BOOLEAN DEFAULT true,
    status TEXT NOT NULL DEFAULT 'open', -- 'open', 'matched', 'closed'
    expiry_date DATE,
    contact_phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Farmer Produce Inventory
CREATE TABLE IF NOT EXISTS farmer_produce (
    id TEXT PRIMARY KEY,
    farmer_id TEXT REFERENCES farmers(id) ON DELETE CASCADE,
    crop_id TEXT REFERENCES crops(id) ON DELETE CASCADE,
    quantity_kg NUMERIC(10, 2) NOT NULL,
    harvest_date DATE NOT NULL,
    quality_grade TEXT DEFAULT 'Grade A',
    status TEXT NOT NULL DEFAULT 'available', -- 'available', 'pooled', 'sold'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Transport Listings
CREATE TABLE IF NOT EXISTS transport_listings (
    id TEXT PRIMARY KEY,
    provider_name TEXT NOT NULL,
    vehicle_type TEXT DEFAULT 'Tata Ace / Bolero Pickup',
    capacity_kg NUMERIC(10, 2) NOT NULL,
    base_rate_per_km NUMERIC(10, 2) NOT NULL,
    destination TEXT NOT NULL,
    cost NUMERIC(10, 2) NOT NULL,
    available_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'available',
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Transport Pools Table
CREATE TABLE IF NOT EXISTS transport_pools (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    destination TEXT NOT NULL,
    crop_id TEXT REFERENCES crops(id) ON DELETE SET NULL,
    total_quantity NUMERIC(10, 2) NOT NULL,
    vehicle_capacity NUMERIC(10, 2) NOT NULL,
    total_cost NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'full', 'completed'
    scheduled_departure DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for fast querying
CREATE INDEX IF NOT EXISTS idx_mandi_prices_crop ON mandi_prices(crop_id);
CREATE INDEX IF NOT EXISTS idx_buyer_offers_crop ON buyer_offers(crop_id);
CREATE INDEX IF NOT EXISTS idx_farmer_produce_farmer ON farmer_produce(farmer_id);
