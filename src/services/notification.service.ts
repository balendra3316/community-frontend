// src/services/notification.service.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface NotificationSender {
  _id: string;
  name: string;
  avatar: string;
}

interface NotificationPost {
  _id: string;
  title: string;
}

export interface Notification {
  _id: string;
  recipient: string;
  sender: NotificationSender;
  type: 'like' | 'comment' | 'reply';
  post: NotificationPost;
  comment?: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

class NotificationService {
  // Get all notifications for the current user
  async getNotifications(): Promise<Notification[]> {
    try {
      const response = await axios.get(`${API_URL}/notifications`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  // Mark a notification as read
  async markAsRead(notificationId: string): Promise<void> {
    try {
      await axios.put(`${API_URL}/notifications/${notificationId}`, {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read
  async markAllAsRead(): Promise<void> {
    try {
      await axios.put(`${API_URL}/notifications`, {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Delete a notification
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/notifications/${notificationId}`, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  // Get unread notification count
  async getUnreadCount(): Promise<number> {
    try {
      const response = await axios.get(`${API_URL}/notifications/unread`, {
        withCredentials: true
      });
      return response.data.count;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  }
}

export default new NotificationService();