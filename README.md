# 🌾 MandiMatch — Build for Bharat Hackathon Project

> **Tagline:** Your Harvest. Your Market. Your Profit.  
> **Category:** Agriculture & Rural Livelihoods  
> **Author & Project:** MandiMatch Full-Stack Agri-Fintech Platform  
> **Target Region:** Uttar Pradesh & NCR Agro-Climatic Clusters (Ghaziabad, Sahibabad, Hapur, Meerut, Delhi)  

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/Frontend-React%20%7C%20Vite%20%7C%20TypeScript-blue.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Design-Tailwind%20CSS-teal.svg)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-lightgrey.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-emerald.svg)](https://supabase.com/)

---

## 📌 Executive Summary & 60-Second Hackathon Pitch

> *"Small and marginal farmers across India lose up to 35% of their hard-earned harvest revenue not because they produce inferior crops, but because they sell with incomplete information. A mandi offering ₹2.00/kg more is often 30 km farther away — and after paying ₹1,800 for transport, labor, and market cess, the farmer actually earns less cash in hand.*  
> 
> *MandiMatch solves this. We give farmers an automated Net Return Engine that calculates their actual pocket profit: **Gross Sale − Transit Cost − Market Fees**. Then, we unlock two unprecedented avenues: direct verified corporate buyers (with free farm-gate pickup) and **Transport Pooling**, allowing 3 neighboring farmers to share a single pickup truck and slash freight costs by 40%. With bilingual Hindi voice search and Kisan Mitra AI, MandiMatch puts real pricing power back into the farmer's hands."*

---

## 🎯 The Core Problem We Solve

Small and marginal farmers encounter three systemic information bottlenecks:

1. **The "High Price Illusion":** Mandi price boards show headline rates (e.g., Azadpur Mandi quoting ₹21.80/kg vs Sahibabad Mandi at ₹19.50/kg). Farmers travel farther without realizing diesel and freight wipe out the difference.
2. **Intermediary Dependency:** Farmers lack direct access to verified institutional food processors (Haldiram, McCain, Safal, BigBasket) who are willing to buy at a premium with farm-gate pickup.
3. **Logistics Underutilization:** Smallholders hire solo mini-trucks (Tata Ace) at a flat minimum fee (₹1,000–₹1,500) for small 500 kg loads, wasting cargo capacity and freight money.

---

## 💡 Key Innovations & Highlights

### 1. Transparent Net Return Engine
$$\text{Gross Sale} = \text{Quantity (kg)} \times \text{Mandi Price (₹/kg)}$$
$$\text{Net In-Pocket Return} = \text{Gross Sale} - \text{Transport Cost} - \text{Market Cess & Loading Fee}$$
$$\text{Net Price/kg} = \frac{\text{Net Return}}{\text{Quantity (kg)}}$$

Every calculation is performed dynamically on real user input. No hardcoded or fake outcomes.

### 2. Multi-Farmer Transport Pooling Algorithm
Nearby farmers traveling to the same market yard or compatible route can pool their harvest into a single commercial vehicle (e.g., Mahindra Bolero Maxi-Truck or Tata 407). Costs are distributed proportionally by load weight:
$$\text{Farmer Cost} = \left(\frac{\text{Farmer Quantity}}{\text{Total Pooled Quantity}}\right) \times \text{Consolidated Vehicle Hire Cost}$$

**Demonstrated Hackathon Demo Scenario:**
* **Farmer A (Ramesh Kumar):** 500 kg potato (Solo Booking: ₹1,000 $\rightarrow$ **Pooled Share: ₹450 | Saves ₹550**)
* **Farmer B (Suresh Pal):** 700 kg potato (Solo Booking: ₹1,000 $\rightarrow$ **Pooled Share: ₹630 | Saves ₹370**)
* **Farmer C (Mukesh Tyagi):** 800 kg potato (Solo Booking: ₹1,000 $\rightarrow$ **Pooled Share: ₹720 | Saves ₹280**)
* **Total Pooled Cargo:** 2,000 kg
* **Total Individual Transport Cost:** ₹3,000
* **Consolidated Truck Cost:** ₹1,800
* **Total Collective Savings:** **₹1,200 (40% discount!)**

### 3. Direct Buyer Marketplace
* 20+ realistic institutional agro-buyers (Mother Dairy Safal, Haldiram, McCain, ITC e-Choupal, BigBasket, Blinkit, Nafed).
* Intelligent Match Score (0–100%) factoring crop compatibility, quantity alignment, distance, price premium, and **farm-gate pickup availability**.
* Interactive "Express Interest" handshake request creating instant simulated alerts.

### 4. Rural Accessibility: Voice & Hindi First
* **Hindi / English bilingual toggle** across the entire UI.
* **Web Speech Recognition:** Farmers can speak naturally in Hindi or Hinglish (e.g., *"Mere paas 1000 kilo aloo hain. Sabse achha bazaar batao."*).
* **Text-to-Speech (TTS):** Farmers can tap the speaker button to hear audio recommendations read aloud in clear, rural-friendly Hindi or English.

### 5. Grounded Kisan Mitra AI
* AI assistant that operates strictly on the mathematical outputs of the ranking engine.
* **Never hallucinates fake prices or non-existent mandis.**
* Explains economic trade-offs in plain, simple vernacular language.

### 6. Role-Based Dual Authentication & Live Profile Sync
* **Differentiated Farmer & Admin Logins:** Dedicated portals with **Continue with Google**, Mobile OTP, or Officer Credentials.
* **Real-Time State Synchronization:** Profile name changes propagate instantly across the top Apple navigation bar, account avatar pill, and local storage without requiring a page reload.

---

## 🎨 Apple Human Interface Guidelines (HIG) Design System

MandiMatch incorporates Apple's Human Interface Guidelines (HIG), blending macOS/iOS elegance with Indian rural fintech utility:

* **Translucent Materials & Blur:** `backdrop-blur-2xl`, `bg-white/80`, ultra-subtle hairline borders (`border-black/[0.06]`).
* **Apple Inset Grouped Hierarchy:** Soft squircle cards (`rounded-[28px]`, `rounded-[32px]`), grouped list rows with subtle dividers, and high negative space.
* **Segmented Controls & Native Switches:** iOS-style sliding pill pickers, custom iOS range slider thumbs, and toggle switches.
* **Apple Floating Dock on Mobile:** Frosted glass floating pill bar (`shadow-apple-dock`) with subtle active scale states.
* **Typography & Palette:**
  * **System Font Stack:** `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro", system-ui, sans-serif`
  * **Primary Dark Emerald:** `#164E35`
  * **Vibrant Leaf Green:** `#218653`
  * **Apple System Colors:** Blue `#007AFF`, Red `#FF3B30`, Green `#34C759`, Amber `#FF9500`
  * **Harvest Accent Gold:** `#F4A340`
  * **Airy Canvas:** `#F5F7F2`

---

## 🏗️ Architecture & Project Structure

```
neuroforge/
├── client/                     # Frontend Application (React + Vite + TypeScript)
│   ├── src/
│   │   ├── algorithms/        # Client-side Core Mathematical Engines
│   │   │   ├── profitCalculator.ts
│   │   │   ├── marketRanker.ts
│   │   │   ├── buyerMatcher.ts
│   │   │   └── transportPooler.ts
│   │   ├── components/        # Reusable UI Components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   ├── DemoBanner.tsx
│   │   │   ├── VoiceModal.tsx
│   │   │   └── AIAssistantDrawer.tsx
│   │   ├── data/
│   │   │   └── mockData.ts    # Seed Data (8+ Mandis, 20+ Buyers, 10 Farmers)
│   │   ├── layouts/
│   │   │   └── AppLayout.tsx
│   │   ├── pages/             # 8 Core Pages
│   │   │   ├── LandingPage.tsx
│   │   │   ├── FarmerDashboardPage.tsx
│   │   │   ├── MarketComparisonPage.tsx
│   │   │   ├── BuyerMarketplacePage.tsx
│   │   │   ├── TransportPoolingPage.tsx
│   │   │   ├── PriceTrendsPage.tsx
│   │   │   ├── FarmerProfilePage.tsx
│   │   │   └── AdminDashboardPage.tsx
│   │   ├── services/
│   │   │   ├── dataService.ts # LocalStorage Persistent State Service
│   │   │   ├── voiceService.ts# Speech-to-Text & Text-to-Speech
│   │   │   ├── aiAssistantService.ts
│   │   │   └── i18n.ts        # Bilingual Localization
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
├── server/                     # Backend API (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── algorithms/
│   │   ├── routes/
│   │   └── index.ts           # REST API Endpoints
│   └── tsconfig.json
├── database/                   # Supabase PostgreSQL Schemas
│   ├── schema.sql             # Relational Table Definitions
│   └── seed.sql               # Seed Data for 8 Mandis, 20 Buyers, 10 Farmers
├── package.json                # Root Concurrently Orchestration
├── .env.example
└── README.md
```

---

## ⚡ Quick Start & Local Setup

### Prerequisites
* Node.js v18+ (tested on Node v20/v26)
* npm v9+

### 1. Install Dependencies
```bash
# From project root
npm run install:all
```
*(Or install inside client and server individually: `cd client && npm install && cd ../server && npm install`)*

### 2. Start the Development Servers
```bash
# Starts both frontend on :5173 and backend on :5001 concurrently
npm run dev
```

* **Frontend:** [http://localhost:5173](http://localhost:5173)
* **Backend API:** [http://localhost:5001/api/health](http://localhost:5001/api/health)

> **Zero-Breakage Guarantee:** If the backend or Supabase is not running, the application **automatically runs seamlessly in local demo mode** with persistent browser storage!

---

## 🎬 60-Second Live Hackathon Demo Walkthrough

1. **Landing Page:** Open [http://localhost:5173](http://localhost:5173). Notice the tagline, visual metrics, and bilingual EN/हिंदी toggle.
2. **Farmer Dashboard:** Click **"Open Demo Dashboard"** or navigate to `/dashboard`.
   * Pre-loaded with demo farmer **Ramesh Kumar (Ghaziabad, UP)** with **1,000 kg Potato**.
   * Observe the 4 KPI cards and the breakdown: Gross Sale, Transport Cost, Cess, and Net In-Pocket Earnings.
   * Tap the **"Listen Aloud"** button to hear the recommendation in Hindi or English.
3. **Market Comparison Engine:** Navigate to `/compare`.
   * Change quantity from 1,000 kg to 500 kg.
   * Watch how **Sahibabad Mandi (12 km)** beats **Azadpur Mandi (34 km)** in net cash due to transportation physics.
   * Toggle the **"Transport Mode: Pooled (-40%)"** button and observe the immediate savings.
4. **Buyer Marketplace:** Navigate to `/buyers`.
   * See 20+ real buyers filtered by crop and distance.
   * Notice verified badges and the **Farm-Gate Pickup** indicator.
   * Click **"Express Interest"** on Haldiram Snacks or Safal to trigger a simulated handshake notification.
5. **Transport Pooling:** Navigate to `/pooling`.
   * Review the real demo route: Ramesh (500kg) + Suresh (700kg) + Mukesh (800kg) = 2,000kg.
   * Notice the clear mathematical saving of **₹1,200 (40% discount)**.
   * Click **"Join This Route"** to add a new farmer and witness live quota recalculation.
6. **Price Trends:** Navigate to `/trends`.
   * View the 7-day historical curve with moving average projections.
   * Verify the prominent transparency disclaimer.
7. **Admin Dashboard:** Navigate to `/admin`.
   * Add a custom Mandi price or toggle buyer offer statuses. Changes persist across browser refreshes!

---

## 🗄️ Database Schema (Supabase / PostgreSQL)

The `database/schema.sql` file defines 7 production-grade tables:
1. `crops` (id, crop_name, hindi_name, category, base_mandi_price, unit)
2. `farmers` (id, name, phone, village, district, state, latitude, longitude)
3. `mandi_prices` (id, crop_id, mandi_name, district, price_per_kg, distance_km, date, source, data_type)
4. `buyer_offers` (id, buyer_name, company_type, crop_id, quantity_required, offered_price, location, distance_km, pickup_available, verified, status)
5. `farmer_produce` (id, farmer_id, crop_id, quantity_kg, harvest_date, quality_grade, status)
6. `transport_listings` (id, provider_name, vehicle_type, capacity_kg, base_rate_per_km, destination, cost, available_date, status)
7. `transport_pools` (id, title, destination, crop_id, total_quantity, vehicle_capacity, total_cost, status, scheduled_departure)

---

## 🔮 Future Scope & Roadmap

* **Live e-NAM Integration:** Connect to official Agmarknet and e-NAM APIs with fallback to simulated data during mandi off-hours.
* **IoT Weight Bridge Verification:** Digital scale integration at village collection points.
* **UPI Escrow Payments:** Safe conditional payments released upon produce delivery verification.
* **WhatsApp Bot Interface:** Lightweight conversational bot running MandiMatch algorithms via WhatsApp Business API for feature phones.

---

## 📜 Ethical Data & Simulation Notice

**DEMO DATA NOTICE:** All prices, buyer offers, and transport listings presented in this demonstration are simulated for the Build for Bharat Hackathon to illustrate the economic decision engine. MandiMatch never misrepresents simulated quotes as live market guarantees.

---

*Built with ❤️ for Indian Farmers • Build for Bharat 2026*
