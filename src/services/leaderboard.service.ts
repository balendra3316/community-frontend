
import axios from 'axios';

export interface LeaderboardBadgeLite {
  name: string;
  level: number;
  earnedAt: string;
}

export interface LeaderboardUser {
  _id: string;
  name: string;
  avatar: string;
  points: number;
  rank: number;
  latestBadge?: LeaderboardBadgeLite | null;

}

export interface LeaderboardResponse {
  leaderboard: LeaderboardUser[];
  user: {
    _id: string;
    name: string;
    avatar: string;
    points: number;
    rank: number | null;
    latestBadge?: LeaderboardBadgeLite | null;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const LeaderboardService = {
  getAllTimeLeaderboard: async (limit: number = 10): Promise<LeaderboardResponse> => {
    try {
      const response = await axios.get(`${API_URL}/leaderboard/all-time`, {
        params: { limit },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
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
      throw error;
    }
  }
};

export default LeaderboardService;