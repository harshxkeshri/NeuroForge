import React, { createContext, useContext, useState, useEffect } from 'react';
import { Farmer } from '../types';
import { dataService } from '../services/dataService';

export type UserRole = 'farmer' | 'admin';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin';
  department: string;
  badgeId: string;
  photoUrl?: string;
}

export interface AuthContextType {
  role: UserRole;
  isAuthenticated: boolean;
  farmer: Farmer;
  admin: AdminUser | null;
  authProvider: 'google' | 'phone' | 'email' | 'demo';
  loginWithGoogle: (targetRole: UserRole, customName?: string, customEmail?: string) => Promise<boolean>;
  loginWithPhone: (phone: string, otp: string) => Promise<boolean>;
  loginWithAdminCredentials: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  updateFarmerProfile: (updates: Partial<Farmer>) => Farmer;
  switchRole: (newRole: UserRole) => void;
}

const DEFAULT_ADMIN: AdminUser = {
  id: 'admin-1',
  name: 'Devendra Nath (District Officer)',
  email: 'admin.ghaziabad@mandimatch.gov.in',
  role: 'admin',
  department: 'UP Krishi Utpadan Mandi Samiti',
  badgeId: 'UP-AGRI-0421',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'mandimatch_auth_session_v2';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('farmer');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [farmer, setFarmer] = useState<Farmer>(() => dataService.getCurrentFarmer());
  const [admin, setAdmin] = useState<AdminUser | null>(DEFAULT_ADMIN);
  const [authProvider, setAuthProvider] = useState<'google' | 'phone' | 'email' | 'demo'>('google');

  // Load stored auth session if present
  useEffect(() => {
    try {
      const storedSession = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedSession) {
        const parsed = JSON.parse(storedSession);
        if (parsed.role) setRole(parsed.role);
        if (parsed.authProvider) setAuthProvider(parsed.authProvider);
        if (parsed.isAuthenticated !== undefined) setIsAuthenticated(parsed.isAuthenticated);
        if (parsed.admin) setAdmin(parsed.admin);
      }
    } catch {
      // ignore
    }
  }, []);

  // Listen for farmer update events from anywhere in the app
  useEffect(() => {
    const handleFarmerUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<Farmer>;
      if (customEvent.detail) {
        setFarmer(customEvent.detail);
      } else {
        setFarmer(dataService.getCurrentFarmer());
      }
    };

    window.addEventListener('mandimatch_farmer_updated', handleFarmerUpdated);
    window.addEventListener('storage', (e) => {
      if (e.key === 'mandimatch_farmer_v1') {
        setFarmer(dataService.getCurrentFarmer());
      }
    });

    return () => {
      window.removeEventListener('mandimatch_farmer_updated', handleFarmerUpdated);
    };
  }, []);

  const saveSession = (newRole: UserRole, newProvider: 'google' | 'phone' | 'email' | 'demo', isAuth: boolean, adminObj?: AdminUser | null) => {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        role: newRole,
        authProvider: newProvider,
        isAuthenticated: isAuth,
        admin: adminObj || admin,
      })
    );
  };

  const loginWithGoogle = async (targetRole: UserRole, customName?: string, customEmail?: string): Promise<boolean> => {
    // Simulate real Google OAuth authentication handshake
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (targetRole === 'farmer') {
      const updatedFarmer = dataService.updateFarmer({
        name: customName || farmer.name || 'Ramesh Kumar',
        phone: farmer.phone || '+91 98765 43210',
      });
      setFarmer(updatedFarmer);
      setRole('farmer');
      setIsAuthenticated(true);
      setAuthProvider('google');
      saveSession('farmer', 'google', true, null);
    } else {
      const adminObj: AdminUser = {
        id: `admin-${Date.now()}`,
        name: customName || 'Agri Officer (Verified)',
        email: customEmail || 'officer.krishi@mandimatch.gov.in',
        role: 'admin',
        department: 'National Agriculture Informatics Council',
        badgeId: 'GOV-IN-7782',
      };
      setAdmin(adminObj);
      setRole('admin');
      setIsAuthenticated(true);
      setAuthProvider('google');
      saveSession('admin', 'google', true, adminObj);
    }

    return true;
  };

  const loginWithPhone = async (phone: string, otp: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const updatedFarmer = dataService.updateFarmer({ phone });
    setFarmer(updatedFarmer);
    setRole('farmer');
    setIsAuthenticated(true);
    setAuthProvider('phone');
    saveSession('farmer', 'phone', true, null);
    return true;
  };

  const loginWithAdminCredentials = async (email: string, pass: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const adminObj: AdminUser = {
      ...DEFAULT_ADMIN,
      email: email || DEFAULT_ADMIN.email,
    };
    setAdmin(adminObj);
    setRole('admin');
    setIsAuthenticated(true);
    setAuthProvider('email');
    saveSession('admin', 'email', true, adminObj);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    saveSession(role, authProvider, false);
  };

  const updateFarmerProfile = (updates: Partial<Farmer>): Farmer => {
    const updated = dataService.updateFarmer(updates);
    setFarmer(updated);
    return updated;
  };

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    saveSession(newRole, authProvider, isAuthenticated);
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        isAuthenticated,
        farmer,
        admin,
        authProvider,
        loginWithGoogle,
        loginWithPhone,
        loginWithAdminCredentials,
        logout,
        updateFarmerProfile,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
