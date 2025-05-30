



// // src/components/NavBar.tsx
// "use client"
// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { Menu, Bell, LogOut, User } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import NotificationDropdown from './NotificationDropdown';
// import notificationService from '../services/notification.service';
// import { useRouter } from 'next/navigation';

// import { initializeSocket, getSocket, disconnectSocket } from '../services/socket.service';
// import { Avatar } from '@mui/material';


// const NavBar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const pathname = usePathname();
//   const { user, logout } = useAuth();
// const router = useRouter();
  
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

//   // Fetch unread notification count
//      useEffect(() => {
//     if (!user) return;

//     // Initialize socket connection
//     const socket = initializeSocket(user._id);

//     // Listen for unread count updates
//     socket.on('unreadCountUpdate', ({ count }) => {
//       setUnreadCount(count);
//     });

//     // Initial fetch of unread count
//     const fetchUnreadCount = async () => {
//       try {
//         const count = await notificationService.getUnreadCount();
//         setUnreadCount(count);
//       } catch (error) {
//         console.error("Error fetching unread count:", error);
//       }
//     };

//     fetchUnreadCount();

//     return () => {
//       // Clean up socket listeners
//       socket.off('unreadCountUpdate');
//       // Don't disconnect socket here - keep it alive for the app lifetime
//     };
//   }, [user]);

//     // Set up polling for notification count (every 30 seconds) remove it use redux toolkit
//   //   const intervalId = setInterval(fetchUnreadCount, 30000);
    
//   //   return () => clearInterval(intervalId);
//   // }, [user]);

  
//   const handleLogout = async () => {
//     try {
//       await logout();
//       setShowProfileMenu(false);
//       router.push('/')
//     } catch (error) {
//      // console.error("Error logging out:", error);
//     }
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

             
//               <div className="hidden md:flex flex-1 mx-8"></div>

//               {/* Right icons */}
//               <div className="flex items-center space-x-4">
//                 {/* Notifications button with dropdown */}
//                 {user && (
//                   <div className="relative">
//                     <button 
//                       className="relative text-gray-500 hover:text-gray-700"
//                       onClick={() => {
//                         setShowNotifications(!showNotifications);
//                         setShowProfileMenu(false);
//                       }}
//                     >
//                       <Bell size={22} />
//                       {unreadCount > 0 && (
//                         <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                           {unreadCount > 99 ? '99+' : unreadCount}
//                         </span>
//                       )}
//                     </button>
                    
//                     {/* Notifications dropdown */}
//                     <NotificationDropdown 
//                       isOpen={showNotifications} 
//                       onClose={() => setShowNotifications(false)} 
//                     />
//                   </div>
//                 )}
                
//                 {/* Profile dropdown */}
//                 {user ? (
//                   <div className="relative">
//                     <button
//                       className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden"
//                       onClick={() => {
//                         setShowProfileMenu(!showProfileMenu);
//                         setShowNotifications(false);
//                       }}
//                     >
                       
//     <Avatar
//       src={user.avatar }
//       alt={user.name?.charAt(0).toUpperCase()}
//       className="h-full w-full bg-gray-300"
//       sx={{ width: 34, height: 34 }}
//     />
  
//                     </button>
                    
//                     {/* Profile menu dropdown */}
//                     {showProfileMenu && (
//                       <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
//                         <Link href="/profile" className="px-4 py-2 flex items-center text-sm text-gray-700 hover:bg-gray-100">
//                           <User size={16} className="mr-2" />
//                           Profile
//                         </Link>
                        
//                         <button 
//                           className="px-4 py-2 flex items-center text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
//                           onClick={handleLogout}
//                         >
//                           <LogOut size={16} className="mr-2" />
//                           Logout
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   <Link href="/" className="text-sm text-pink-600 hover:text-pink-800 font-medium">
//                     Login
//                   </Link>
//                 )}
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
        
//         {/* Backdrop for closing profile dropdown when clicking outside */}
//         {showProfileMenu && (
//           <div 
//             className="fixed inset-0 h-full w-full z-0" 
//             onClick={() => setShowProfileMenu(false)}
//           ></div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default NavBar;







// use client"
// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { Menu, Bell, LogOut, User } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import NotificationDropdown from './NotificationDropdown';
// import notificationService from '../services/notification.service';
// import { useRouter } from 'next/navigation';

// import { initializeSocket, getSocket, disconnectSocket } from '../services/socket.service';
// import { Avatar } from '@mui/material';

// const NavBar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const pathname = usePathname();
//   const { user, logout } = useAuth();
//   const router = useRouter();

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

//   // Fetch unread notification count
//   useEffect(() => {
//     if (!user) return;

//     // Initialize socket connection
//     let socket: any;
//     try {
//       socket = initializeSocket(user._id);

//       // Listen for unread count updates
//       socket.on('unreadCountUpdate', ({ count }: { count: number }) => {
//         setUnreadCount(count);
//       });

//       // Initial fetch of unread count
//       const fetchUnreadCount = async () => {
//         try {
//           const count = await notificationService.getUnreadCount();
//           setUnreadCount(count);
//         } catch (error) {
//           console.error("Error fetching unread count:", error);
//         }
//       };

//       fetchUnreadCount();

//       return () => {
//         // Clean up socket listeners
//         if (socket) {
//           socket.off('unreadCountUpdate');
//         }
//         // Don't disconnect socket here - keep it alive for the app lifetime
//       };
//     } catch (error) {
//       console.error("Error initializing socket in NavBar:", error);

//       // Fallback to direct API call if socket initialization fails
//       const fetchUnreadCount = async () => {
//         try {
//           const count = await notificationService.getUnreadCount();
//           setUnreadCount(count);
//         } catch (error) {
//           console.error("Error fetching unread count:", error);
//         }
//       };

//       fetchUnreadCount();

//       // No cleanup needed if socket wasn't initialized
//       return () => {};
//     }
//   }, [user]);

//   const handleLogout = async () => {
//     try {
//       await logout();
//       setShowProfileMenu(false);
//       router.push('/')
//     } catch (error) {
//      // console.error("Error logging out:", error);
//     }
//   };

//   // Handle notification count update from dropdown
//   const handleNotificationCountUpdate = (count: number) => {
//     setUnreadCount(count);
//   };

//   return (
//     <div className="fixed top-0 left-0 right-0 z-50 bg-white">
//       <div className="flex flex-col w-full">
//         {/* Navbar /}
//         <div className="border-b border-gray-200">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="flex justify-between h-16 items-center">
//               {/ Mobile menu button /}
//               {/ <div className="flex items-center md:hidden">
//                 <button
//                   type="button"
//                   className="text-gray-500 hover:text-gray-700 focus:outline-none"
//                   onClick={() => setIsMenuOpen(!isMenuOpen)}
//                 >
//                   <Menu size={24} />
//                 </button>
//               </div> */}

//               {/* Logo */}
//               <div className="flex items-center">
//                 <Link href="/" className="flex items-center">
//                  <div className="rounded-md p-1">
//   <img 
//     src="/logo acd.png" // Path to your image in public folder
//     alt="Logo" 
//     className="h-12 w-13 object-contain"
//   />
// </div>
//                   <span className="ml-2 text-xl font-bold text-gray-800 hidden md:block">Anyone Can Dance</span>
//                 </Link>
//               </div>

//               <div className="hidden md:flex flex-1 mx-8"></div>

//               {/* Right icons /}
//               <div className="flex items-center space-x-4">
//                 {/ Notifications button with dropdown */}
//                 {user && (
//                   <div className="relative">
//                     <button 
//                       className="relative text-gray-500 hover:text-gray-700"
//                       onClick={() => {
//                         setShowNotifications(!showNotifications);
//                         setShowProfileMenu(false);
//                       }}
//                     >
//                       <Bell size={22} />
//                       {unreadCount > 0 && (
//                         <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                           {unreadCount > 99 ? '99+' : unreadCount}
//                         </span>
//                       )}
//                     </button>

//                     {/* Notifications dropdown */}
//                     <NotificationDropdown 
//                       isOpen={showNotifications} 
//                       onClose={() => setShowNotifications(false)}
//                       onCountUpdate={handleNotificationCountUpdate}
//                     />
//                   </div>
//                 )}

//                 {/* Profile dropdown */}
//                 {user ? (
//                   <div className="relative">
//                     <button
//                       className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden"
//                       onClick={() => {
//                         setShowProfileMenu(!showProfileMenu);
//                         setShowNotifications(false);
//                       }}
//                     >

//                       <Avatar
//                         src={user.avatar}
//                         alt={user.name?.charAt(0).toUpperCase()}
//                         className="h-full w-full bg-gray-300"
//                         sx={{ width: 34, height: 34 }}
//                       />

//                     </button>

//                     {/* Profile menu dropdown */}
//                     {showProfileMenu && (
//                       <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
//                         <Link href="/profile" className="px-4 py-2 flex items-center text-sm text-gray-700 hover:bg-gray-100">
//                           <User size={16} className="mr-2" />
//                           Profile
//                         </Link>

//                         <button 
//                           className="px-4 py-2 flex items-center text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
//                           onClick={handleLogout}
//                         >
//                           <LogOut size={16} className="mr-2" />
//                           Logout
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   <Link href="/" className="text-sm text-pink-600 hover:text-pink-800 font-medium">
//                     Login
//                   </Link>
//                 )}
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
//                     className={
//                       inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
//                       ${isActive 
//                         ? 'border-pink-500 text-pink-600' 
//                         : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
//                     }
//                     aria-current={isActive ? 'page' : undefined}
//                   >
//                     {item.name}
//                   </Link>
//                 );
//               })}
//             </nav>
//           </div>
//         </div>

//         {/* Backdrop for closing profile dropdown when clicking outside */}
//         {showProfileMenu && (
//           <div 
//             className="fixed inset-0 h-full w-full z-0" 
//             onClick={() => setShowProfileMenu(false)}
//           ></div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default NavBar;

















// "use client"
// import { useState, useEffect, MouseEvent } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { Menu as MenuIcon, Bell, LogOut, User } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import NotificationDropdown from './NotificationDropdown';
// import notificationService from '../services/notification.service';
// import { useRouter } from 'next/navigation';

// import { initializeSocket, getSocket, disconnectSocket } from '../services/socket.service';
// import { Avatar, Menu, MenuItem, ListItemIcon, Divider } from '@mui/material';


// const NavBar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const pathname = usePathname();
//   const { user, logout } = useAuth();
//   const router = useRouter();
  
//   // For MUI Menu
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const open = Boolean(anchorEl);
  
//   const navItems = [
//     { name: 'Community', path: '/community' },
//     { name: 'Classroom', path: '/classroom' },
   
//     { name: 'Leaderboards', path: '/leaderboards' },
  
//   ];

//   // Only show Community, Classroom, and Leaderboards in the tab switcher
//   const tabItems = navItems.filter(item => 
//     ['Community', 'Classroom', 'Leaderboards'].includes(item.name)
//   );

//   // Fetch unread notification count
//   useEffect(() => {
//     if (!user) return;

//     // Initialize socket connection
//     let socket: any;
//     try {
//       socket = initializeSocket(user._id);
      
//       // Listen for unread count updates
//       socket.on('unreadCountUpdate', ({ count }: { count: number }) => {
//         setUnreadCount(count);
//       });

//       // Initial fetch of unread count
//       const fetchUnreadCount = async () => {
//         try {
//           const count = await notificationService.getUnreadCount();
//           setUnreadCount(count);
//         } catch (error) {
//           console.error("Error fetching unread count:", error);
//         }
//       };

//       fetchUnreadCount();

//       return () => {
//         // Clean up socket listeners
//         if (socket) {
//           socket.off('unreadCountUpdate');
//         }
//         // Don't disconnect socket here - keep it alive for the app lifetime
//       };
//     } catch (error) {
//       console.error("Error initializing socket in NavBar:", error);
      
//       // Fallback to direct API call if socket initialization fails
//       const fetchUnreadCount = async () => {
//         try {
//           const count = await notificationService.getUnreadCount();
//           setUnreadCount(count);
//         } catch (error) {
//           console.error("Error fetching unread count:", error);
//         }
//       };
      
//       fetchUnreadCount();
      
//       // No cleanup needed if socket wasn't initialized
//       return () => {};
//     }
//   }, [user]);
  
//   const handleProfileMenuOpen = (event: MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//     setShowNotifications(false);
//   };

//   const handleProfileMenuClose = () => {
//     setAnchorEl(null);
//   };
  
//   const handleLogout = async () => {
//     try {
//       await logout();
//       handleProfileMenuClose();
//       router.push('/');
//     } catch (error) {
//      // console.error("Error logging out:", error);
//     }
//   };

//   const handleProfileClick = () => {
//     router.push('/profile');
//     handleProfileMenuClose();
//   };

//   // Handle notification count update from dropdown
//   const handleNotificationCountUpdate = (count: number) => {
//     setUnreadCount(count);
//   };

//   return (
//     <div className="fixed top-0 left-0 right-0 z-50 bg-white">
//       <div className="flex flex-col w-full">
//         {/* Navbar */}
//         <div className="border-b border-gray-200">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="flex justify-between h-16 items-center">
//               {/* Logo */}
//               <div className="flex items-center">
//                 <Link href="/" className="flex items-center">
//                  <div className="rounded-md p-1">
//                   <img 
//                     src="/logo acd.png" 
//                     alt="Logo" 
//                     className="h-12 w-13 object-contain"
//                   />
//                 </div>
//                   <span className="ml-2 text-xl font-bold text-gray-800 hidden md:block">Anyone Can Dance</span>
//                 </Link>
//               </div>

             
//               <div className="hidden md:flex flex-1 mx-8"></div>

//               {/* Right icons */}
//               <div className="flex items-center space-x-4">
//                 {/* Notifications button with dropdown */}
//                 {user && (
//                   <div className="relative">
//                     <button 
//                       className="relative text-gray-500 hover:text-gray-700"
//                       onClick={() => {
//                         setShowNotifications(!showNotifications);
//                         setAnchorEl(null); // Close profile menu if open
//                       }}
//                     >
//                       <Bell size={22} />
//                       {unreadCount > 0 && (
//                         <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                           {unreadCount > 99 ? '99+' : unreadCount}
//                         </span>
//                       )}
//                     </button>
                    
//                     {/* Notifications dropdown */}
//                     <NotificationDropdown 
//                       isOpen={showNotifications} 
//                       onClose={() => setShowNotifications(false)}
//                       onCountUpdate={handleNotificationCountUpdate}
//                     />
//                   </div>
//                 )}
                
//                 {/* Profile dropdown using MUI Menu */}
//                 {user ? (
//                   <div>
//                     <Avatar
//                       src={user.avatar}
//                       alt={user.name?.charAt(0).toUpperCase()}
//                       className="cursor-pointer"
//                       sx={{ width: 34, height: 34 }}
//                       onClick={handleProfileMenuOpen}
//                     />
                    
//                     <Menu
//                       anchorEl={anchorEl}
//                       id="account-menu"
//                       open={open}
//                       onClose={handleProfileMenuClose}
//                       onClick={handleProfileMenuClose}
//                       transformOrigin={{ horizontal: 'right', vertical: 'top' }}
//                       anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
//                       PaperProps={{
//                         elevation: 3,
//                         sx: {
//                           width: '200px',
//                           mt: 1.5,
//                           overflow: 'visible',
//                           filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
//                           '& .MuiAvatar-root': {
//                             width: 32,
//                             height: 32,
//                             ml: -0.5,
//                             mr: 1,
//                           },
//                         },
//                       }}
//                     >
//                       <MenuItem onClick={handleProfileClick}>
//                         <ListItemIcon>
//                           <User size={16} />
//                         </ListItemIcon>
//                         Profile
//                       </MenuItem>
//                       <Divider />
//                       <MenuItem onClick={handleLogout}>
//                         <ListItemIcon>
//                           <LogOut size={16} />
//                         </ListItemIcon>
//                         Logout
//                       </MenuItem>
//                     </Menu>
//                   </div>
//                 ) : (
//                   <Link href="/" className="text-sm text-pink-600 hover:text-pink-800 font-medium">
//                     Login
//                   </Link>
//                 )}
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
//                       inline-flex items-center py-4 px-1 border-b-4 font-medium text-sm
//                       ${isActive 
//                         ? 'border-yellow-500  text-yellow-900' 
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
//       </div>
//     </div>
//   );
// };

// export default NavBar;








// components/NavBar/index.tsx (Main NavBar component)
"use client"
import { useState, useEffect, MouseEvent, lazy, Suspense, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import notificationService from '../services/notification.service';
import { initializeSocket } from '../services/socket.service';

// Static imports for critical components
import Logo from './subcomNavbar/Logo';
import TabSwitcher from './subcomNavbar/TabSwitcher';
import NotificationButton from './subcomNavbar/NotificationButton';
import ProfileMenu from './subcomNavbar/ProfileMenu';

// Lazy load notification dropdown (non-critical)
const NotificationDropdown = lazy(() => import('./NotificationDropdown'));

// Loading component for notification dropdown
const NotificationLoading = () => (
  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
    <div className="animate-pulse space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  </div>
);

const NavBar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, logout } = useAuth();
  
  // For MUI Menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  // Memoize navigation items to prevent unnecessary re-renders
  const navItems = useMemo(() => [
    { name: 'Community', path: '/community' },
    { name: 'Classroom', path: '/classroom' },
    { name: 'Leaderboards', path: '/leaderboards' },
  ], []);

  // Only show Community, Classroom, and Leaderboards in the tab switcher
  const tabItems = useMemo(() => 
    navItems.filter(item => 
      ['Community', 'Classroom', 'Leaderboards'].includes(item.name)
    ), [navItems]
  );

  // Fetch unread notification count with optimized socket handling
  useEffect(() => {
    if (!user) return;

    let socket: any;
    let mounted = true;

    const initializeNotifications = async () => {
      try {
        // Initialize socket connection
        socket = initializeSocket(user._id);
        
        // Listen for unread count updates
        const handleUnreadCountUpdate = ({ count }: { count: number }) => {
          if (mounted) {
            setUnreadCount(count);
          }
        };

        socket.on('unreadCountUpdate', handleUnreadCountUpdate);

        // Initial fetch of unread count
        try {
          const count = await notificationService.getUnreadCount();
          if (mounted) {
            setUnreadCount(count);
          }
        } catch (error) {
          console.error("Error fetching unread count:", error);
        }

      } catch (error) {
        console.error("Error initializing socket in NavBar:", error);
        
        // Fallback to direct API call if socket initialization fails
        try {
          const count = await notificationService.getUnreadCount();
          if (mounted) {
            setUnreadCount(count);
          }
        } catch (apiError) {
          console.error("Error fetching unread count:", apiError);
        }
      }
    };

    initializeNotifications();

    return () => {
      mounted = false;
      // Clean up socket listeners
      if (socket) {
        socket.off('unreadCountUpdate');
      }
      // Don't disconnect socket here - keep it alive for the app lifetime
    };
  }, [user]);
  
  const handleProfileMenuOpen = useCallback((event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setShowNotifications(false);
  }, []);

  const handleProfileMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleNotificationToggle = useCallback(() => {
    setShowNotifications(prev => !prev);
    setAnchorEl(null); // Close profile menu if open
  }, []);

  const handleNotificationClose = useCallback(() => {
    setShowNotifications(false);
  }, []);

  // Handle notification count update from dropdown
  const handleNotificationCountUpdate = useCallback((count: number) => {
    setUnreadCount(count);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white">
      <div className="flex flex-col w-full">
        {/* Navbar */}
        <div className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              {/* Logo */}
              <Logo />

              {/* Spacer */}
              <div className="hidden md:flex flex-1 mx-8"></div>

              {/* Right icons */}
              <div className="flex items-center space-x-4">
                {/* Notifications button with dropdown */}
                {user && (
                  <div className="relative">
                    <NotificationButton
                      unreadCount={unreadCount}
                      isOpen={showNotifications}
                      onClick={handleNotificationToggle}
                    />
                    
                    {/* Notifications dropdown with proper positioning */}
                    {showNotifications && (
                      <div className="absolute right-0 top-full mt-2 z-50">
                        <Suspense fallback={<NotificationLoading />}>
                          <NotificationDropdown
                            isOpen={showNotifications}
                            onClose={handleNotificationClose}
                            onCountUpdate={handleNotificationCountUpdate}
                          />
                        </Suspense>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Profile dropdown using MUI Menu */}
                {user ? (
                  <ProfileMenu
                    user={user}
                    anchorEl={anchorEl}
                    open={open}
                    onMenuOpen={handleProfileMenuOpen}
                    onMenuClose={handleProfileMenuClose}
                    onLogout={logout}
                  />
                ) : (
                  <Link 
                    href="/" 
                    className="text-sm text-pink-600 hover:text-pink-800 font-medium transition-colors duration-200"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <TabSwitcher items={tabItems} />
      </div>
    </div>
  );
};

export default NavBar;