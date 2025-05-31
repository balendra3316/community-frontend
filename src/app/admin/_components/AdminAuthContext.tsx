"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { adminService } from './adminService';

interface AdminData {
  _id: string;
  name: string;
  email: string;
}

interface AdminAuthContextType {
  admin: AdminData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  admin: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {

    const storedAdmin = localStorage.getItem('adminInfo');
    
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
    

    const verifyAdmin = async () => {
      try {
        const adminData = await adminService.getCurrentAdmin();
        setAdmin(adminData);
      } catch (error) {

        localStorage.removeItem('adminInfo');
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };
    
    verifyAdmin();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const adminData = await adminService.login({ email, password });
      setAdmin(adminData);
      router.push('/admin');
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await adminService.logout();
      setAdmin(null);
      router.push('/admin/login');
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};