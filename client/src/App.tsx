import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppLayout } from './layouts/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { FarmerDashboardPage } from './pages/FarmerDashboardPage';
import { MarketComparisonPage } from './pages/MarketComparisonPage';
import { BuyerMarketplacePage } from './pages/BuyerMarketplacePage';
import { TransportPoolingPage } from './pages/TransportPoolingPage';
import { PriceTrendsPage } from './pages/PriceTrendsPage';
import { FarmerProfilePage } from './pages/FarmerProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { LoginPage } from './pages/LoginPage';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="dashboard" element={<FarmerDashboardPage />} />
            <Route path="compare" element={<MarketComparisonPage />} />
            <Route path="buyers" element={<BuyerMarketplacePage />} />
            <Route path="pooling" element={<TransportPoolingPage />} />
            <Route path="trends" element={<PriceTrendsPage />} />
            <Route path="profile" element={<FarmerProfilePage />} />
            <Route path="admin" element={<AdminDashboardPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
