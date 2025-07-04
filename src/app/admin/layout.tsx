"use client";

import { ReactNode, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AdminAuthProvider } from './_components/AdminAuthContext';
import AdminSidebar from './_components/AdminSidebar';
import AdminProtectedRoute from './_components/AdminProtectedRoute';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  

  const shouldHideSidebar = pathname === '/admin/login';

  return (
    <AdminAuthProvider>
      <div className="flex min-h-screen bg-gray-100">
        {!shouldHideSidebar && (
          <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        )}
        <div className={`flex-1 ${shouldHideSidebar ? 'w-full' : ''}`}>
          <AdminProtectedRoute>
            <main className={`p-6 ${!shouldHideSidebar ? 'pt-16 md:pt-6' : ''}`}>
              {children}
            </main>
          </AdminProtectedRoute>
        </div>
      </div>
    </AdminAuthProvider>
  );
}