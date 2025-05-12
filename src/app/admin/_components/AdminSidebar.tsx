// "use client";

// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { useAdminAuth } from './AdminAuthContext';

// export default function AdminSidebar() {
//   const { admin, logout } = useAdminAuth();
//   const pathname = usePathname();

//   // Don't show sidebar on login page
//   if (pathname === '/admin/login') {
//     return null;
//   }

//   // Don't show sidebar if not logged in
//   if (!admin) {
//     return null;
//   }

//   const navItems = [
//     { name: 'Dashboard', href: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
//     // Add more nav items as needed
//   ];

//   const isActive = (path: string) => {
//     return pathname === path;
//   };

//   return (
//     <div className="bg-gray-800 text-white w-64 flex-shrink-0 hidden md:block">
//       <div className="p-4">
//         <h2 className="text-2xl font-bold">Admin Panel</h2>
//       </div>
      
//       <div className="p-4 border-t border-gray-700">
//         <div className="flex items-center mb-4">
//           <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
//             <span className="text-xl">{admin.name.charAt(0)}</span>
//           </div>
//           <div className="ml-3">
//             <p className="font-medium">{admin.name}</p>
//             <p className="text-sm text-gray-400">{admin.email}</p>
//           </div>
//         </div>
//       </div>
      
//       <nav className="mt-4">
//         <ul>
//           {navItems.map((item) => (
//             <li key={item.name}>
//               <Link
//                 href={item.href}
//                 className={`flex items-center px-4 py-3 ${
//                   isActive(item.href)
//                     ? 'bg-gray-900 text-white'
//                     : 'text-gray-300 hover:bg-gray-700'
//                 }`}
//               >
//                 <svg
//                   className="w-5 h-5 mr-3"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d={item.icon}
//                   />
//                 </svg>
//                 {item.name}
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </nav>
      
//       <div className="absolute bottom-0 w-64 p-4">
//         <button
//           onClick={logout}
//           className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-gray-700 rounded"
//         >
//           <svg
//             className="w-5 h-5 mr-3"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
//             />
//           </svg>
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }








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

  // Close sidebar on route change on mobile
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