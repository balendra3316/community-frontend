
// // src/components/NavBar.tsx
// "use client"
// import { useState } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { Menu, Bell, LogOut, User } from 'lucide-react';

// const NavBar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const pathname = usePathname();

//   // Navigation items
//   const navItems = [
//     { name: 'Community', path: '/community' },
//     { name: 'Classroom', path: '/classroom' },
//     { name: 'Calendar', path: '/calendar' },
//     { name: 'Members', path: '/members' },
//     { name: 'Leaderboards', path: '/leaderboards' },
//     { name: 'About', path: '/about' },
//   ];

//   // Only show Community, Classroom, and Leaderboards in the tab switcher
//   const tabItems = navItems.filter(item => 
//     ['Community', 'Classroom', 'Leaderboards'].includes(item.name)
//   );

//   // Dummy notification data
//   const notifications = [
//     { id: 1, type: 'message', text: 'Sarah sent you a message', time: '5 min ago' },
//     { id: 2, type: 'like', text: 'John liked your post', time: '30 min ago' },
//     { id: 3, type: 'comment', text: 'Alex commented on your project', time: '1 hour ago' },
//     { id: 4, type: 'mention', text: 'You were mentioned in a discussion', time: '3 hours ago' },
//     { id: 5, type: 'achievement', text: 'You earned a new badge!', time: 'Yesterday' },
//   ];

//   // Handle clicks outside of the dropdown
//   const handleClickOutside = () => {
//     setShowNotifications(false);
//     setShowProfileMenu(false);
//   };

//   return (
//     <div className="fixed top-0 left-0 right-0 z-50 bg-white">
//       <div className="flex flex-col w-full">
//         {/* Navbar */}
//         <div className="border-b border-gray-200">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="flex justify-between h-16 items-center">
//               {/* Mobile menu button */}
//               <div className="flex items-center md:hidden">
//                 <button
//                   type="button"
//                   className="text-gray-500 hover:text-gray-700 focus:outline-none"
//                   onClick={() => setIsMenuOpen(!isMenuOpen)}
//                 >
//                   <Menu size={24} />
//                 </button>
//               </div>

//               {/* Logo */}
//               <div className="flex items-center">
//                 <Link href="/" className="flex items-center">
//                   <div className="bg-pink-500 rounded-md p-1">
//                     <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
//                     </svg>
//                   </div>
//                   <span className="ml-2 text-xl font-bold text-gray-800 hidden md:block">AnyOne Can Dance</span>
//                 </Link>
//               </div>

//               {/* Spacer to replace search bar */}
//               <div className="hidden md:flex flex-1 mx-8"></div>

//               {/* Right icons */}
//               <div className="flex items-center space-x-4">
//                 {/* Notifications button with dropdown */}
//                 <div className="relative">
//                   <button 
//                     className="relative text-gray-500 hover:text-gray-700"
//                     onClick={() => {
//                       setShowNotifications(!showNotifications);
//                       setShowProfileMenu(false);
//                     }}
//                   >
//                     <Bell size={22} />
//                     <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                       66
//                     </span>
//                   </button>
                  
//                   {/* Notifications dropdown */}
//                   {showNotifications && (
//                     <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-10 max-h-96 overflow-y-auto">
//                       <div className="border-b border-gray-200 py-2 px-4">
//                         <h3 className="font-semibold text-gray-800">Notifications</h3>
//                       </div>
//                       {notifications.map(notification => (
//                         <div 
//                           key={notification.id} 
//                           className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer"
//                         >
//                           <div className="flex items-start">
//                             <div className="flex-shrink-0 bg-pink-100 rounded-full p-2">
//                               <svg className="h-4 w-4 text-pink-500" viewBox="0 0 20 20" fill="currentColor">
//                                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                               </svg>
//                             </div>
//                             <div className="ml-3 w-0 flex-1">
//                               <p className="text-sm font-medium text-gray-900">{notification.text}</p>
//                               <p className="mt-1 text-xs text-gray-500">{notification.time}</p>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                       <div className="px-4 py-2 text-center">
//                         <button className="text-sm text-pink-600 hover:text-pink-800 font-medium">
//                           View all notifications
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
                
//                 {/* Profile dropdown */}
//                 <div className="relative">
//                   <button
//                     className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden"
//                     onClick={() => {
//                       setShowProfileMenu(!showProfileMenu);
//                       setShowNotifications(false);
//                     }}
//                   >
//                     <img
//                       src="/api/placeholder/32/32"
//                       alt="User Profile"
//                       className="h-full w-full object-cover"
//                     />
//                   </button>
                  
//                   {/* Profile menu dropdown */}
//                   {showProfileMenu && (
//                     <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
//                       <Link href="/profile" className="px-4 py-2 flex items-center text-sm text-gray-700 hover:bg-gray-100">
//                         <User size={16} className="mr-2" />
//                         Profile
//                       </Link>
//                       <button 
//                         className="px-4 py-2 flex items-center text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
//                         onClick={() => console.log('Logging out...')}
//                       >
//                         <LogOut size={16} className="mr-2" />
//                         Logout
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Tab Switcher */}
//         <div className="border-b border-gray-200">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <nav className="flex space-x-8" aria-label="Tabs">
//               {tabItems.map((item) => {
//                 const isActive = 
//                   (item.path === '/' && pathname === '/') ||
//                   (item.path !== '/' && pathname.startsWith(item.path));
                
//                 return (
//                   <Link
//                     key={item.name}
//                     href={item.path}
//                     className={`
//                       inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
//                       ${isActive 
//                         ? 'border-pink-500 text-pink-600' 
//                         : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
//                     `}
//                     aria-current={isActive ? 'page' : undefined}
//                   >
//                     {item.name}
//                   </Link>
//                 );
//               })}
//             </nav>
//           </div>
//         </div>
        
//         {/* Backdrop for closing dropdowns when clicking outside */}
//         {(showNotifications || showProfileMenu) && (
//           <div 
//             className="fixed inset-0 h-full w-full z-0" 
//             onClick={handleClickOutside}
//           ></div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default NavBar;












// src/components/NavBar.tsx
"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Bell, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import notificationService from '../services/notification.service';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  
  const navItems = [
    { name: 'Community', path: '/community' },
    { name: 'Classroom', path: '/classroom' },
    { name: 'Calendar', path: '/calendar' },
    { name: 'Members', path: '/members' },
    { name: 'Leaderboards', path: '/leaderboards' },
    { name: 'About', path: '/about' },
  ];

  // Only show Community, Classroom, and Leaderboards in the tab switcher
  const tabItems = navItems.filter(item => 
    ['Community', 'Classroom', 'Leaderboards'].includes(item.name)
  );

  // Fetch unread notification count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (user) {
        try {
          const count = await notificationService.getUnreadCount();
          setUnreadCount(count);
        } catch (error) {
          console.error("Error fetching unread count:", error);
        }
      }
    };

    fetchUnreadCount();

    // Set up polling for notification count (every 30 seconds) remove it use redux toolkit
    const intervalId = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(intervalId);
  }, [user]);

  
  const handleLogout = async () => {
    try {
      await logout();
      setShowProfileMenu(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white">
      <div className="flex flex-col w-full">
        {/* Navbar */}
        <div className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              {/* Mobile menu button */}
              <div className="flex items-center md:hidden">
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <Menu size={24} />
                </button>
              </div>

              {/* Logo */}
              <div className="flex items-center">
                <Link href="/" className="flex items-center">
                  <div className="bg-pink-500 rounded-md p-1">
                    <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="ml-2 text-xl font-bold text-gray-800 hidden md:block">AnyOne Can Dance</span>
                </Link>
              </div>

             
              <div className="hidden md:flex flex-1 mx-8"></div>

              {/* Right icons */}
              <div className="flex items-center space-x-4">
                {/* Notifications button with dropdown */}
                {user && (
                  <div className="relative">
                    <button 
                      className="relative text-gray-500 hover:text-gray-700"
                      onClick={() => {
                        setShowNotifications(!showNotifications);
                        setShowProfileMenu(false);
                      }}
                    >
                      <Bell size={22} />
                      {unreadCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      )}
                    </button>
                    
                    {/* Notifications dropdown */}
                    <NotificationDropdown 
                      isOpen={showNotifications} 
                      onClose={() => setShowNotifications(false)} 
                    />
                  </div>
                )}
                
                {/* Profile dropdown */}
                {user ? (
                  <div className="relative">
                    <button
                      className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden"
                      onClick={() => {
                        setShowProfileMenu(!showProfileMenu);
                        setShowNotifications(false);
                      }}
                    >
                      <img
                        src={user.avatar || "/api/placeholder/32/32"}
                        alt="User Profile"
                        className="h-full w-full object-cover"
                      />
                    </button>
                    
                    {/* Profile menu dropdown */}
                    {showProfileMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                        <Link href="/profile" className="px-4 py-2 flex items-center text-sm text-gray-700 hover:bg-gray-100">
                          <User size={16} className="mr-2" />
                          Profile
                        </Link>
                        <button 
                          className="px-4 py-2 flex items-center text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          onClick={handleLogout}
                        >
                          <LogOut size={16} className="mr-2" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/" className="text-sm text-pink-600 hover:text-pink-800 font-medium">
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8" aria-label="Tabs">
              {tabItems.map((item) => {
                const isActive = 
                  (item.path === '/' && pathname === '/') ||
                  (item.path !== '/' && pathname.startsWith(item.path));
                
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`
                      inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                      ${isActive 
                        ? 'border-pink-500 text-pink-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                    `}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
        
        {/* Backdrop for closing profile dropdown when clicking outside */}
        {showProfileMenu && (
          <div 
            className="fixed inset-0 h-full w-full z-0" 
            onClick={() => setShowProfileMenu(false)}
          ></div>
        )}
      </div>
    </div>
  );
};

export default NavBar;