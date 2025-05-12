// "use client";

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { Bell, Check } from 'lucide-react';
// import dayjs from 'dayjs';
// import relativeTime from 'dayjs/plugin/relativeTime';
// import notificationService, { Notification } from '../services/notification.service';

// dayjs.extend(relativeTime);

// interface NotificationDropdownProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const NotificationDropdown = ({ isOpen, onClose }: NotificationDropdownProps) => {
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [unreadCount, setUnreadCount] = useState<number>(0);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     if (isOpen) {
//       fetchNotifications();
//       fetchUnreadCount();
//     }
//   }, [isOpen]);

//   const fetchNotifications = async () => {
//     try {
//       setLoading(true);
//       const data = await notificationService.getNotifications();
//       setNotifications(data);
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUnreadCount = async () => {
//     try {
//       const count = await notificationService.getUnreadCount();
//       setUnreadCount(count);
//     } catch (error) {
//       console.error("Error fetching unread count:", error);
//     }
//   };

//   const handleMarkAsRead = async (id: string) => {
//     try {
//       await notificationService.markAsRead(id);
//       setNotifications(prevNotifications => 
//         prevNotifications.map(notif => 
//           notif._id === id ? { ...notif, read: true } : notif
//         )
//       );
//       fetchUnreadCount();
//     } catch (error) {
//       console.error("Error marking notification as read:", error);
//     }
//   };

//   const handleMarkAllAsRead = async () => {
//     try {
//       await notificationService.markAllAsRead();
//       setNotifications(prevNotifications => 
//         prevNotifications.map(notif => ({ ...notif, read: true }))
//       );
//       setUnreadCount(0);
//     } catch (error) {
//       console.error("Error marking all notifications as read:", error);
//     }
//   };

//   const getNotificationText = (notification: Notification): string => {
//     switch (notification.type) {
//       case 'like':
//         return `${notification.sender.name} liked your post "${notification.post.title}"`;
//       case 'comment':
//         return `${notification.sender.name} commented on your post "${notification.post.title}"`;
//       case 'reply':
//         return `${notification.sender.name} replied to your comment on "${notification.post.title}"`;
//       default:
//         return `New notification from ${notification.sender.name}`;
//     }
//   };

//   const getTimestamp = (date: string): string => {
//     try {
//       return dayjs(date).fromNow();
//     } catch (error) {
//       return 'Unknown time';
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <>
//       <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-10 max-h-96 overflow-y-auto">
//         <div className="border-b border-gray-200 py-2 px-4 flex justify-between items-center">
//           <h3 className="font-semibold text-gray-800">Notifications</h3>
//           <div className="flex items-center">
//             <button 
//               onClick={handleMarkAllAsRead}
//               className="text-xs text-pink-600 hover:text-pink-800 font-medium flex items-center"
//             >
//               <Check size={12} className="mr-1" />
//               Mark all as read
//             </button>
//           </div>
//         </div>
        
//         {loading ? (
//           <div className="flex justify-center items-center py-4">
//             <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
//           </div>
//         ) : notifications.length > 0 ? (
//           <>
//             {notifications.map(notification => (
//               <div 
//                 key={notification._id} 
//                 className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer ${!notification.read ? 'bg-pink-50' : ''}`}
//                 onClick={() => handleMarkAsRead(notification._id)}
//               >
//                 <div className="flex items-start">
//                   <div className="flex-shrink-0">
//                     <img 
//                       src={notification.sender.avatar || "/api/placeholder/32/32"} 
//                       alt={notification.sender.name}
//                       className="h-8 w-8 rounded-full"
//                     />
//                   </div>
//                   <div className="ml-3 w-0 flex-1">
//                     <p className={`text-sm ${!notification.read ? 'font-medium' : ''} text-gray-900`}>
//                       {getNotificationText(notification)}
//                     </p>
//                     <p className="mt-1 text-xs text-gray-500">
//                       {getTimestamp(notification.createdAt)}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
            
//           </>
//         ) : (
//           <div className="py-4 px-4 text-center text-gray-500">
//             No notifications
//           </div>
//         )}
//       </div>

//       {/* Backdrop for closing dropdown when clicking outside */}
//       <div 
//         className="fixed inset-0 h-full w-full z-0" 
//         onClick={onClose}
//       ></div>
//     </>
//   );
// };

// export default NotificationDropdown;

















"use client";

import { useState, useEffect } from 'react';
import { Bell, Check } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import notificationService, { Notification } from '../services/notification.service';
import PostDetailView from '../components/PostDetailView'; // Import PostDetailView

dayjs.extend(relativeTime);

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationDropdown = ({ isOpen, onClose }: NotificationDropdownProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showPostDetail, setShowPostDetail] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [isOpen]);

  // Close post detail when dropdown is closed
  useEffect(() => {
    if (!isOpen) {
      setShowPostDetail(false);
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prevNotifications => 
        prevNotifications.map(notif => 
          notif._id === id ? { ...notif, read: true } : notif
        )
      );
      fetchUnreadCount();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prevNotifications => 
        prevNotifications.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const getNotificationText = (notification: Notification): string => {
    switch (notification.type) {
      case 'like':
        return `${notification.sender.name} liked your post "${notification.post.title}"`;
      case 'comment':
        return `${notification.sender.name} commented on your post "${notification.post.title}"`;
      case 'reply':
        return `${notification.sender.name} replied to your comment on "${notification.post.title}"`;
      default:
        return `New notification from ${notification.sender.name}`;
    }
  };

  const getTimestamp = (date: string): string => {
    try {
      return dayjs(date).fromNow();
    } catch (error) {
      return 'Unknown time';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    handleMarkAsRead(notification._id);
    
    // Set the selected post and show the post detail modal
    if (notification.post) {
      setSelectedPost(notification.post);
      setShowPostDetail(true);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-10 max-h-96 overflow-y-auto">
        <div className="border-b border-gray-200 py-2 px-4 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Notifications</h3>
          <div className="flex items-center">
            <button 
              onClick={handleMarkAllAsRead}
              className="text-xs text-pink-600 hover:text-pink-800 font-medium flex items-center"
            >
              <Check size={12} className="mr-1" />
              Mark all as read
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
          </div>
        ) : notifications.length > 0 ? (
          <>
            {notifications.map(notification => (
              <div 
                key={notification._id} 
                className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer ${!notification.read ? 'bg-pink-50' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <img 
                      src={notification.sender.avatar || "/api/placeholder/32/32"} 
                      alt={notification.sender.name}
                      className="h-8 w-8 rounded-full"
                    />
                  </div>
                  <div className="ml-3 w-0 flex-1">
                    <p className={`text-sm ${!notification.read ? 'font-medium' : ''} text-gray-900`}>
                      {getNotificationText(notification)}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {getTimestamp(notification.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="py-4 px-4 text-center text-gray-500">
            No notifications
          </div>
        )}
      </div>

      {/* Render PostDetailView */}
      {selectedPost && (
        <PostDetailView
          post={selectedPost}
          isOpen={showPostDetail}
          onClose={() => setShowPostDetail(false)}
        />
      )}

      {/* Backdrop for closing dropdown when clicking outside */}
      <div 
        className="fixed inset-0 h-full w-full z-0" 
        onClick={onClose}
      ></div>
    </>
  );
};

export default NotificationDropdown;
