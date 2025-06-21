


"use client";
import {
  useState,
  useEffect,
  MouseEvent,
  lazy,
  Suspense,
  useCallback,
  useMemo,
} from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import notificationService from "../services/notification.service";
import { initializeSocket } from "../services/socket.service";
import { 
  Drawer, 
  IconButton, 
  useMediaQuery, 
  useTheme 
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Close as CloseIcon 
} from '@mui/icons-material';

import Logo from "./subcomNavbar/Logo";
import TabSwitcher from "./subcomNavbar/TabSwitcher";
import NotificationButton from "./subcomNavbar/NotificationButton";
import ProfileMenu from "./subcomNavbar/ProfileMenu";
import CommunityInfoSidebar from "./CommunityInfoSidebar"; // Import your existing component

const NotificationDropdown = lazy(() => import("./NotificationDropdown"));

const NotificationLoading = () => (
  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
    <div className="animate-pulse space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  </div>
);


const MobileSidebar = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const theme = useTheme();
  
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: '70%',
          maxWidth: '400px',
          backgroundColor: '#f8f9fa',
          transition: theme.transitions.create(['transform'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
         '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(144,144,144,0.6)', // Light backdrop
         
        }
      }}
      transitionDuration={{
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
      }}
    >
      <div className="h-full flex flex-col">
        {/* Header with close button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
          <IconButton 
            onClick={onClose}
            sx={{ 
              color: '#666',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                transform: 'rotate(180deg)',
                transition: 'all 0.3s ease'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>
        
        {/* Sidebar content */}
        <div className="flex-1 overflow-y-auto p-4">
          <CommunityInfoSidebar />
        </div>
      </div>
    </Drawer>
  );
};

const NavBar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:1024px)');

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const navItems = useMemo(
    () => [
      { name: "Community", path: "/community" },
      { name: "Classroom", path: "/classroom" },
      { name: "Leaderboards", path: "/leaderboards" },
    ],
    []
  );

  const tabItems = useMemo(
    () =>
      navItems.filter((item) =>
        ["Community", "Classroom", "Leaderboards"].includes(item.name)
      ),
    [navItems]
  );

  useEffect(() => {
    if (!user) return;

    let socket: any;
    let mounted = true;

    const initializeNotifications = async () => {
      try {
        socket = initializeSocket(user._id);

        const handleUnreadCountUpdate = ({ count }: { count: number }) => {
          if (mounted) {
            setUnreadCount(count);
          }
        };

        socket.on("unreadCountUpdate", handleUnreadCountUpdate);

        try {
          const count = await notificationService.getUnreadCount();
          if (mounted) {
            setUnreadCount(count);
          }
        } catch (error) {
        }
      } catch (error) {
        try {
          const count = await notificationService.getUnreadCount();
          if (mounted) {
            setUnreadCount(count);
          }
        } catch (apiError) {
        }
      }
    };

    initializeNotifications();

    return () => {
      mounted = false;

      if (socket) {
        socket.off("unreadCountUpdate");
      }
    };
  }, [user]);

  const handleProfileMenuOpen = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
      setShowNotifications(false);
    },
    []
  );

  const handleProfileMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleNotificationToggle = useCallback(() => {
    setShowNotifications((prev) => !prev);
    setAnchorEl(null);
  }, []);

  const handleNotificationClose = useCallback(() => {
    setShowNotifications(false);
  }, []);

  const handleNotificationCountUpdate = useCallback((count: number) => {
    setUnreadCount(count);
  }, []);

  const handleSidebarOpen = useCallback(() => {
    setSidebarOpen(true);
  }, []);

  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white">
      <div className="flex flex-col w-full">
        {/* Navbar */}
        <div className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              {/* Left side - Menu icon (mobile) + Logo */}
              <div className="flex items-center space-x-3">
                {/* Menu icon - only visible on mobile */}
                {isMobile && (
                  <IconButton
                    onClick={handleSidebarOpen}
                    sx={{
                      color: '#008894',
                      padding: '8px',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 136, 148, 0.08)',
                        transform: 'scale(1.05)',
                        transition: 'all 0.2s ease'
                      }
                    }}
                  >
                    <MenuIcon />
                  </IconButton>
                )}
                
                {/* Logo */}
                <Logo />
              </div>

            
              <div className="hidden md:flex flex-1 mx-8"></div>

            
              <div className="flex items-center space-x-4">
              
                {user && (
                  <div className="relative">
                    <NotificationButton
                      unreadCount={unreadCount}
                      isOpen={showNotifications}
                      onClick={handleNotificationToggle}
                    />

                    
                    {showNotifications && (
                      <div className="absolute right-0 top-full mt-2 z-50 w-80">
                      
                        <div className="md:hidden fixed inset-0 bg-opacity-50 -z-10" 
                             onClick={handleNotificationClose} />
                        
                       
                        <div className="md:relative fixed md:fixed-0 right-0 md:right-auto top-16 md:top-full w-full md:w-80 bg-white rounded-lg shadow-lg border border-gray-200">
                          <Suspense fallback={<NotificationLoading />}>
                            <NotificationDropdown
                              isOpen={showNotifications}
                              onClose={handleNotificationClose}
                              onCountUpdate={handleNotificationCountUpdate}
                            />
                          </Suspense>
                        </div>
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

      {/* Mobile Sidebar */}
      <MobileSidebar 
        open={sidebarOpen} 
        onClose={handleSidebarClose} 
      />
    </div>
  );
};

export default NavBar;