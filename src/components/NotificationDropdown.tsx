"use client";

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  memo,
  lazy,
  Suspense,
} from "react";
import { Bell, Check } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import notificationService, {
  Notification,
} from "../services/notification.service";
import { useAuth } from "../context/AuthContext";
import { initializeSocket, getSocket } from "../services/socket.service";
import { Avatar } from "@mui/material";

// Lazy load PostDetailView as it's not immediately needed
const PostDetailView = lazy(() => import("../components/PostDetailView"));

dayjs.extend(relativeTime);

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onCountUpdate?: (count: number) => void;
}

// Memoized notification item component to prevent unnecessary re-renders
const NotificationItem = memo(
  ({
    notification,
    onClick,
  }: {
    notification: Notification;
    onClick: (notification: Notification) => void;
  }) => {
    const handleClick = useCallback(() => {
      onClick(notification);
    }, [notification, onClick]);

    const notificationText = useMemo(() => {
      switch (notification.type) {
        case "like":
          return `${notification.sender.name} liked your post "${notification.post.title}"`;
        case "comment":
          return `${notification.sender.name} commented on your post "${notification.post.title}"`;
        case "reply":
          return `${notification.sender.name} replied to your comment on "${notification.post.title}"`;
        default:
          return `New notification from ${notification.sender.name}`;
      }
    }, [notification]);

    const timestamp = useMemo(() => {
      try {
        return dayjs(notification.createdAt).fromNow();
      } catch (error) {
        return "Unknown time";
      }
    }, [notification.createdAt]);

    return (
      <div
        className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer transition-colors duration-150 ${
          !notification.read ? "bg-pink-50" : ""
        }`}
        onClick={handleClick}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Avatar
              src={notification.sender.avatar}
              alt={notification.sender.name?.charAt(0).toUpperCase() || "U"}
              className="h-full w-full bg-gray-300"
            />
          </div>
          <div className="ml-3 w-0 flex-1">
            <p
              className={`text-sm ${
                !notification.read ? "font-medium" : ""
              } text-gray-900 line-clamp-2`}
            >
              {notificationText}
            </p>
            <p className="mt-1 text-xs text-gray-500">{timestamp}</p>
          </div>
          {!notification.read && (
            <div className="flex-shrink-0 ml-2">
              <div className="h-2 w-2 bg-pink-500 rounded-full"></div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

NotificationItem.displayName = "NotificationItem";

// Loading component for PostDetailView
const PostDetailLoading = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading post...</p>
    </div>
  </div>
);

const NotificationDropdown = ({
  isOpen,
  onClose,
  onCountUpdate,
}: NotificationDropdownProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showPostDetail, setShowPostDetail] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Memoize socket event handlers to prevent recreation on every render
  const socketHandlers = useMemo(
    () => ({
      onConnect: () => setIsConnected(true),
      onDisconnect: () => setIsConnected(false),
      onNotificationRead: (data: { notificationId: string }) => {
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === data.notificationId ? { ...n, read: true } : n
          )
        );
      },
      onAllNotificationsRead: () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
        onCountUpdate?.(0);
      },
      onUnreadCountUpdate: ({ count }: { count: number }) => {
        setUnreadCount(count);
        onCountUpdate?.(count);
      },
    }),
    [onCountUpdate]
  );

  // Initialize socket connection and event listeners
  useEffect(() => {
    if (!isOpen || !user?._id) return;

    let mounted = true;
    let socket: any;

    const initializeNotifications = async () => {
      try {
        setError(null);
        socket = initializeSocket(user._id);

        // Set up socket event listeners
        socket.on("connect", socketHandlers.onConnect);
        socket.on("disconnect", socketHandlers.onDisconnect);
        socket.on("notificationRead", socketHandlers.onNotificationRead);
        socket.on(
          "allNotificationsRead",
          socketHandlers.onAllNotificationsRead
        );
        socket.on("unreadCountUpdate", socketHandlers.onUnreadCountUpdate);

        // Fetch initial data with Promise.all for better performance
        setLoading(true);
        const [notifs, count] = await Promise.all([
          notificationService.getNotifications(),
          notificationService.getUnreadCount(),
        ]);

        if (mounted) {
          setNotifications(notifs);
          setUnreadCount(count);
          onCountUpdate?.(count);
        }
      } catch (error) {
        console.error("Error initializing notifications:", error);
        if (mounted) {
          setError("Failed to load notifications");
          // Fallback to regular API fetch
          try {
            const [notifs, count] = await Promise.all([
              notificationService.getNotifications(),
              notificationService.getUnreadCount(),
            ]);

            if (mounted) {
              setNotifications(notifs);
              setUnreadCount(count);
              onCountUpdate?.(count);
              setError(null);
            }
          } catch (fallbackError) {
            console.error("Fallback API fetch failed:", fallbackError);
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeNotifications();

    return () => {
      mounted = false;
      if (socket) {
        socket.off("connect", socketHandlers.onConnect);
        socket.off("disconnect", socketHandlers.onDisconnect);
        socket.off("notificationRead", socketHandlers.onNotificationRead);
        socket.off(
          "allNotificationsRead",
          socketHandlers.onAllNotificationsRead
        );
        socket.off("unreadCountUpdate", socketHandlers.onUnreadCountUpdate);
      }
    };
  }, [isOpen, user?._id, socketHandlers]);

  // Optimized notification click handler with better error handling
  const handleNotificationClick = useCallback(
    async (notification: Notification) => {
      if (notification.read) {
        // If already read, just handle setting selected post
        if (notification.post) {
          setSelectedPost(notification.post);
          setShowPostDetail(true);
        }
        return;
      }

      // Store previous state for rollback if needed
      const previousNotifications = [...notifications];
      const previousUnreadCount = unreadCount;

      try {
        // Optimistic UI update first
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notification._id ? { ...n, read: true } : n
          )
        );

        // Calculate new unread count
        const newUnreadCount = Math.max(0, unreadCount - 1);
        setUnreadCount(newUnreadCount);
        onCountUpdate?.(newUnreadCount);

        // Set selected post immediately if notification is about a post
        if (notification.post) {
          setSelectedPost(notification.post);
          setShowPostDetail(true);
        }

        // Make API call in the background with timeout
        const markAsReadPromise = Promise.race([
          notificationService.markAsRead(notification._id),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Request timeout")), 5000)
          ),
        ]);

        markAsReadPromise
          .then(() => {
            // Try to emit socket event if socket is available
            try {
              const socket = getSocket();
              if (socket && user) {
                socket.emit("notificationRead", {
                  notificationId: notification._id,
                  userId: user._id,
                });
              }
            } catch (err) {
              // Silent fail if socket is not available
              console.warn("Socket emission failed:", err);
            }
          })
          .catch((error) => {
            // Revert if API call fails
            console.error("Error marking notification as read:", error);

            setNotifications(previousNotifications);
            setUnreadCount(previousUnreadCount);
            onCountUpdate?.(previousUnreadCount);
          });
      } catch (error) {
        // Revert if any synchronous code fails
        console.error("Error processing notification click:", error);

        setNotifications(previousNotifications);
        setUnreadCount(previousUnreadCount);
        onCountUpdate?.(previousUnreadCount);
      }
    },
    [notifications, unreadCount, onCountUpdate, user]
  );

  // Optimized mark all as read handler
  const handleMarkAllAsRead = useCallback(async () => {
    if (unreadCount === 0) return;

    const previousNotifications = [...notifications];
    const previousUnreadCount = unreadCount;

    try {
      // Optimistic UI update immediately
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      onCountUpdate?.(0);

      // Make API call with timeout
      const markAllAsReadPromise = Promise.race([
        notificationService.markAllAsRead(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Request timeout")), 5000)
        ),
      ]);

      markAllAsReadPromise
        .then(() => {
          try {
            const socket = getSocket();
            if (socket && user) {
              socket.emit("allNotificationsRead", { userId: user._id });
            }
          } catch (err) {
            console.warn("Socket emission failed:", err);
          }
        })
        .catch((error) => {
          console.error("Error marking all notifications as read:", error);

          // Revert on error
          setNotifications(previousNotifications);
          setUnreadCount(previousUnreadCount);
          onCountUpdate?.(previousUnreadCount);
        });
    } catch (error) {
      console.error("Error processing mark all as read:", error);

      setNotifications(previousNotifications);
      setUnreadCount(previousUnreadCount);
      onCountUpdate?.(previousUnreadCount);
    }
  }, [notifications, unreadCount, onCountUpdate, user]);

  // Memoized close handler for post detail
  const handlePostDetailClose = useCallback(() => {
    setShowPostDetail(false);
    setSelectedPost(null);
  }, []);

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <>
      <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 py-3 px-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-800 text-sm">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h3>
            <button
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0 || loading}
              className={`text-xs font-medium flex items-center transition-colors duration-150 ${
                unreadCount > 0 && !loading
                  ? "text-pink-600 hover:text-pink-700"
                  : "text-gray-400 cursor-not-allowed"
              }`}
            >
              <Check size={12} className="mr-1" />
              Mark all as read
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-80">
          {loading ? (
            <div className="flex flex-col justify-center items-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
              <p className="mt-2 text-sm text-gray-500">
                Loading notifications...
              </p>
            </div>
          ) : error ? (
            <div className="py-8 px-4 text-center">
              <p className="text-red-500 text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-pink-600 hover:text-pink-700 text-xs underline"
              >
                Retry
              </button>
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onClick={handleNotificationClick}
              />
            ))
          ) : (
            <div className="py-8 px-4 text-center">
              <Bell size={24} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500 text-sm">No notifications yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Render PostDetailView with Suspense */}
      {selectedPost && showPostDetail && (
        <Suspense fallback={<PostDetailLoading />}>
          <PostDetailView
            post={selectedPost}
            isOpen={showPostDetail}
            onClose={handlePostDetailClose}
          />
        </Suspense>
      )}

      {/* Backdrop for closing dropdown when clicking outside */}
      <div
        className="fixed inset-0 h-full w-full z-40"
        onClick={onClose}
        aria-label="Close notifications"
      />
    </>
  );
};

export default memo(NotificationDropdown);
