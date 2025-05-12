interface AdminCredentials {
    email: string;
    password: string;
  }
  
  interface AdminData {
    _id: string;
    name: string;
    email: string;
  }
  
  // API base URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  
  // Admin API service
  export const adminService = {
    // Login admin
    async login(credentials: AdminCredentials): Promise<AdminData> {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookies
        body: JSON.stringify(credentials),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to login');
      }
  
      const data = await response.json();
      
      // Save admin in localStorage for UI state (not for auth)
      if (typeof window !== 'undefined') {
        localStorage.setItem('adminInfo', JSON.stringify(data.admin));
      }
      
      return data.admin;
    },
  
    // Get current admin
    async getCurrentAdmin(): Promise<AdminData> {
      const response = await fetch(`${API_URL}/admin/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookies
      });
  
      if (!response.ok) {
        throw new Error('Failed to get admin data');
      }
  
      const data = await response.json();
      return data;
    },
  
    // Logout admin
    async logout(): Promise<void> {
      await fetch(`${API_URL}/admin/logout`, {
        method: 'POST',
        credentials: 'include', // Important for cookies
      });
      
      // Remove admin from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adminInfo');
      }
    },
  
    // Check if admin is logged in (client-side)
    isLoggedIn(): boolean {
      if (typeof window === 'undefined') {
        return false;
      }
      return localStorage.getItem('adminInfo') !== null;
    },
  };