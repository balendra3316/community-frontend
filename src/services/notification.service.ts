
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL

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

  async getNotifications(): Promise<Notification[]> {
    try {
      const response = await axios.get(`${API_URL}/notifications`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }


  async markAsRead(notificationId: string): Promise<void> {
    try {
      await axios.put(
        `${API_URL}/notifications/${notificationId}`, 
        {}, 
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
    } catch (error) {
      throw error;
    }
  }


  async markAllAsRead(): Promise<void> {
    try {
      await axios.put(
        `${API_URL}/notifications`, 
        {}, 
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
    } catch (error) {
      throw error;
    }
  }


  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/notifications/${notificationId}`, {
        withCredentials: true
      });
    } catch (error) {
      throw error;
    }
  }


  async getUnreadCount(): Promise<number> {
    try {
      const response = await axios.get(`${API_URL}/notifications/unread`, {
        withCredentials: true
      });
      return response.data.count;
    } catch (error) {
      throw error;
    }
  }
}

export default new NotificationService();
