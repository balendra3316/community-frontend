
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminAuth } from './AdminAuthContext';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function AdminSidebar({ isOpen, setIsOpen }:any) {
  const { admin, logout } = useAdminAuth();
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Graph', path: '/admin/graph' },
  ];

  const isActive = (path: string) => {
    return pathname === path;
  };


  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  }, [pathname, setIsOpen]);

  return (
    <>
      {/* Mobile toggle button - Visible on mobile only */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed z-20 top-4 left-4 p-2 bg-gray-800 text-white rounded-md"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar overlay - only visible on mobile when sidebar is open */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-white bg-opacity-50 z-10"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0
        fixed md:static 
        top-0 left-0 
        w-64 bg-gray-800 min-h-screen text-white flex flex-col z-10
        transition-transform duration-300 ease-in-out
      `}>
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Admin Dashboard</h2>
          {admin && (
            <p className="text-sm text-gray-400 mt-1">{admin.name}</p>
          )}
        </div>
        
        <div className="flex-1 mt-6">
          <nav>
            <ul>
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`block px-4 py-3 hover:bg-gray-700 transition-colors ${
                      isActive(item.path) ? 'bg-gray-700 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="px-4 mt-6">
              <button
                onClick={logout}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
              >
                Log Out
              </button>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}