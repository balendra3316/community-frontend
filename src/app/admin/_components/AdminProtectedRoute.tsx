"use client";

import { ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminAuth } from './AdminAuthContext';

export default function AdminProtectedRoute({ children }: { children: ReactNode }) {
  const { admin, loading } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip redirect for login page
    if (pathname === '/admin/login') {
      return;
    }
    
    // Redirect to login if not authenticated
    if (!loading && !admin) {
      router.push('/admin/login');
    }
  }, [admin, loading, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Don't show children until we know user is logged in (except on login page)
  if (!admin && pathname !== '/admin/login') {
    return null;
  }

  return <>{children}</>;
}