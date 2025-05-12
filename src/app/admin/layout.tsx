"use client";

import { ReactNode, useState } from 'react';
import { AdminAuthProvider } from './_components/AdminAuthContext';
import AdminSidebar from './_components/AdminSidebar';
import AdminProtectedRoute from './_components/AdminProtectedRoute';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AdminAuthProvider>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className="flex-1">
          <AdminProtectedRoute>
            {/* Add top padding on mobile to accommodate the toggle button */}
            <main className="p-6 pt-16 md:pt-6">{children}</main>
          </AdminProtectedRoute>
        </div>
      </div>
    </AdminAuthProvider>
  );
}