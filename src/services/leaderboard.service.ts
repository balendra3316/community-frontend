// src/services/leaderboard.service.ts
import axios from 'axios';

export interface LeaderboardUser {
  _id: string;
  name: string;
  avatar: string;
  points: number;
  rank: number;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardUser[];
  user: {
    _id: string;
    name: string;
    avatar: string;
    points: number;
    rank: number | null;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const LeaderboardService = {
  getAllTimeLeaderboard: async (limit: number = 10): Promise<LeaderboardResponse> => {
    try {
      const response = await axios.get(`${API_URL}/leaderboard/all-time`, {
        params: { limit },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching all-time leaderboard:', error);
      throw error;
    }
  },

  getWeeklyLeaderboard: async (limit: number = 10): Promise<LeaderboardResponse> => {
    try {
      const response = await axios.get(`${API_URL}/leaderboard/weekly`, {
        params: { limit },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching weekly leaderboard:', error);
      throw error;
    }
  },

  getMonthlyLeaderboard: async (limit: number = 10): Promise<LeaderboardResponse> => {
    try {
      const response = await axios.get(`${API_URL}/leaderboard/monthly`, {
        params: { limit },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching monthly leaderboard:', error);
      throw error;
    }
  }
};

export default LeaderboardService;