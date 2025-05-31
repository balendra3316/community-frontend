

import { memo, useCallback } from 'react';
import { Bell } from 'lucide-react';

interface NotificationButtonProps {
  unreadCount: number;
  isOpen: boolean;
  onClick: () => void;
}

const NotificationButton = memo(({ unreadCount, isOpen, onClick }: NotificationButtonProps) => {
  const handleClick = useCallback(() => {
    onClick();
  }, [onClick]);

  return (
    <div className="relative">
      <button 
        className="relative text-gray-500 hover:text-gray-700 transition-colors duration-200"
        onClick={handleClick}
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
});

NotificationButton.displayName = 'NotificationButton';
export default NotificationButton;
