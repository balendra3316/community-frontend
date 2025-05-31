interface AdminCredentials {
    email: string;
    password: string;
  }
  
  interface AdminData {
    _id: string;
    name: string;
    email: string;
  }
  

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  

  export const adminService = {

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
      

      if (typeof window !== 'undefined') {
        localStorage.setItem('adminInfo', JSON.stringify(data.admin));
      }
      
      return data.admin;
    },
  

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
  

    async logout(): Promise<void> {
      await fetch(`${API_URL}/admin/logout`, {
        method: 'POST',
        credentials: 'include', // Important for cookies
      });
      

      if (typeof window !== 'undefined') {
        localStorage.removeItem('adminInfo');
      }
    },
  

    isLoggedIn(): boolean {
      if (typeof window === 'undefined') {
        return false;
      }
      return localStorage.getItem('adminInfo') !== null;
    },
  };