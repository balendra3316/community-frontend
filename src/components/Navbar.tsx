// components/NavBar/index.tsx (Main NavBar component)
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

// Static imports for critical components
import Logo from "./subcomNavbar/Logo";
import TabSwitcher from "./subcomNavbar/TabSwitcher";
import NotificationButton from "./subcomNavbar/NotificationButton";
import ProfileMenu from "./subcomNavbar/ProfileMenu";

// Lazy load notification dropdown (non-critical)
const NotificationDropdown = lazy(() => import("./NotificationDropdown"));

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
  const navItems = useMemo(
    () => [
      { name: "Community", path: "/community" },
      { name: "Classroom", path: "/classroom" },
      { name: "Leaderboards", path: "/leaderboards" },
    ],
    []
  );

  // Only show Community, Classroom, and Leaderboards in the tab switcher
  const tabItems = useMemo(
    () =>
      navItems.filter((item) =>
        ["Community", "Classroom", "Leaderboards"].includes(item.name)
      ),
    [navItems]
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

        socket.on("unreadCountUpdate", handleUnreadCountUpdate);

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
        socket.off("unreadCountUpdate");
      }
      // Don't disconnect socket here - keep it alive for the app lifetime
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
