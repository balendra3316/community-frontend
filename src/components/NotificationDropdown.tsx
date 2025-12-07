

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
import { Avatar } from "@mui/material";

// Redux Imports
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../lib/Store";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../lib/NotificationSlice";

// Other Imports
import { useAuth } from "../context/AuthContext";
import { Notification } from "@/services/notification.service";

// Lazy load the PostDetailView
const PostDetailView = lazy(() => import("./PostDetailView"));

// Extend dayjs with the relativeTime plugin
dayjs.extend(relativeTime);

// The component props are now simpler
interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

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
      const senderName = notification.sender?.name || "Someone";
      const postTitle = notification.post?.title || "a post";
      switch (notification.type) {
        case "like":
          return `${senderName} liked your post "${postTitle}"`;
        case "comment":
          return `${senderName} commented on your post "${postTitle}"`;
        case "reply":
          return `${senderName} replied to your comment on "${postTitle}"`;
        default:
          return `New notification from ${senderName}`;
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
              src={notification.sender?.avatar}
              alt={notification.sender?.name?.charAt(0).toUpperCase() || "U"}
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

const PostDetailLoading = () => (
  <div className="fixed inset-0 bg-[rgba(144,144,144,0.6)] bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading post...</p>
    </div>
  </div>
);

const NotificationDropdown = ({
  isOpen,
  onClose,
}: NotificationDropdownProps) => {
  // --- REDUX STATE & DISPATCH ---
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, unreadCount, status, error } = useSelector(
    (state: RootState) => state.notifications
  );

  // --- LOCAL UI STATE ---
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showPostDetail, setShowPostDetail] = useState<boolean>(false);

  // --- FETCH NOTIFICATIONS WHEN DROPDOWN OPENS ---
  useEffect(() => {
    if (isOpen && status === "idle") {
      dispatch(fetchNotifications());
    }
  }, [isOpen, status, dispatch]);

  // --- HANDLERS DISPATCH REDUX ACTIONS ---
  const handleNotificationClick = useCallback(
    async (notification: Notification) => {
      if (notification.post && notification.post._id) {
        setSelectedPost(notification.post);
        setShowPostDetail(true);
      }

      if (!notification.read) {
        dispatch(markNotificationAsRead(notification._id));
      }
    },
    [dispatch]
  );

  const handleMarkAllAsRead = useCallback(() => {
    if (unreadCount > 0) {
      dispatch(markAllNotificationsAsRead());
    }
  }, [dispatch, unreadCount]);

  const handlePostDetailClose = useCallback(() => {
    setShowPostDetail(false);
    setSelectedPost(null);
  }, []);

  if (!isOpen) return null;

  const isLoading = status === "loading";

  return (
    <>
      <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden flex flex-col">
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
              disabled={unreadCount === 0 || isLoading}
              className={`text-xs font-medium flex items-center transition-colors duration-150 ${
                unreadCount > 0 && !isLoading
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
        <div className="overflow-y-auto flex-1">
          {isLoading ? (
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
                onClick={() => dispatch(fetchNotifications())}
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
