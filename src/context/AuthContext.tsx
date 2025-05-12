// // src/context/AuthContext.tsx
// "use client";

// import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import axios from 'axios';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// interface User {
//   _id: string;
//   googleId: string;
//   email: string;
//   name: string;
//   avatar: string;
//   isAdmin: boolean;
//   badges: string[];
//   bio: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   error: string | null;
//   loginWithGoogle: () => Promise<void>;
//   logout: () => Promise<void>;
//   checkAuth: () => Promise<boolean>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // src/context/AuthContext.tsx (modify the checkAuth function)
// const checkAuth = async () => {
//   try {
//     setLoading(true);
//     console.log("Checking authentication status...");
//     const response = await axios.get(`${API_URL}/auth/me`, { 
//       withCredentials: true 
//     });
//     console.log("Auth response data:", response.data);
    
//     if (response.data && response.data._id) {
//       setUser(response.data);
//       setError(null);
//       return true;
//     } else {
//       setUser(null);
//       return false;
//     }
//   } catch (err) {
//     console.error("Auth check error:", err);
//     setUser(null);
//     return false;
//   } finally {
//     setLoading(false);
//   }
// };

//   const loginWithGoogle = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axios.get(`${API_URL}/auth/google/url`);
//       window.location.href = data.url; // This will redirect to Google auth
//     } catch (err) {
//       setError('Failed to get Google auth URL');
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     try {
//       setLoading(true);
//       await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
//       setUser(null);
//     } catch (err) {
//       setError('Failed to logout');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     checkAuth();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, loading, error, loginWithGoogle, logout, checkAuth }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };





// src/context/AuthContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface User {
  _id: string;
  googleId: string;
  email: string;
  name: string;
  avatar: string;
  isAdmin: boolean;
  badges: string[];
  bio: string;
  createdAt: string;
  updatedAt: string;
}

interface ProfileUpdateData {
  name?: string;
  avatar?: File | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  updateProfile: (data: ProfileUpdateData) => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // src/context/AuthContext.tsx (modify the checkAuth function)
  const checkAuth = async () => {
    try {
      setLoading(true);
      console.log("Checking authentication status...");
      const response = await axios.get(`${API_URL}/auth/me`, { 
        withCredentials: true 
      });
      console.log("Auth response data:", response.data);
      
      if (response.data && response.data._id) {
        setUser(response.data);
        setError(null);
        return true;
      } else {
        setUser(null);
        return false;
      }
    } catch (err) {
      console.error("Auth check error:", err);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/auth/google/url`);
      window.location.href = data.url; // This will redirect to Google auth
    } catch (err) {
      setError('Failed to get Google auth URL');
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
      setUser(null);
    } catch (err) {
      setError('Failed to logout');
    } finally {
      setLoading(false);
    }
  };

  // New function to update user profile
  const updateProfile = async (data: ProfileUpdateData): Promise<User | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const formData = new FormData();
      
      // Add name to form data if provided
      if (data.name) {
        formData.append('name', data.name);
      }
      
      // Add avatar file to form data if provided
      if (data.avatar) {
        formData.append('avatar', data.avatar);
      }
      
      const response = await axios.put(
        `${API_URL}/auth/profile`, 
        formData, 
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      
      if (response.data) {
        setUser(response.data);
        return response.data;
      }
      
      return null;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update profile';
      setError(errorMessage);
      console.error("Profile update error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      loginWithGoogle, 
      logout, 
      checkAuth,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};