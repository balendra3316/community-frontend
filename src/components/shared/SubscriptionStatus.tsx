"use client";

import React from 'react';
import { useAuth } from '@/context/AuthContext'; // Adjust path to your AuthContext
import { Paper, Typography, Chip, CircularProgress, Box } from '@mui/material';
import dayjs from 'dayjs';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

export default function SubscriptionStatus() {
  const { user, loading } = useAuth();

  // Handle the loading state while auth is being checked
  if (loading) {
    return (
      <Paper elevation={2} className="p-4 rounded-lg bg-white flex items-center justify-center">
        <CircularProgress size={24} />
      </Paper>
    );
  }

  // If the user is not logged in, don't render anything
  if (!user) {
    return null;
  }
  
  const isSubscribed = user.subscription?.status === 'active';
  const endDate = user.subscription?.endDate;

  // Calculate days left if the subscription is active
  const getDaysLeft = () => {
    if (!endDate) return 0;
    const end = dayjs(endDate);
    const now = dayjs();
    // Use Math.max to avoid showing negative days
    return Math.max(0, end.diff(now, 'day'));
  };

  const daysLeft = getDaysLeft();

  return (
    <Paper elevation={2} className="p-4 rounded-lg bg-white shadow-sm">
      <Typography variant="h6" className="font-semibold text-gray-800 mb-3">
        Subscription Status
      </Typography>
      
      {isSubscribed && endDate ? (
        // --- Active Subscription View ---
        <Box>
          <Chip
  icon={<CheckCircleIcon />}
  label="Active"
  size="small"
  // Remove the MUI color/variant props and use Tailwind classes instead
  className="mb-3 bg-green-600 text-white"
/>
          <div className="space-y-1 text-sm text-gray-600">
            <p>Expires on: <span className="font-medium text-gray-900">{dayjs(endDate).format('MMMM D, YYYY')}</span></p>
            <p>Time remaining: <span className="font-medium text-gray-900">{daysLeft} days</span></p>
          </div>
        </Box>
      ) : (
        // --- Inactive/Free Subscription View ---
        <Box>
          <Chip 
            icon={<CancelIcon />} 
            label="Inactive" 
            variant="outlined"
            size="small"
            className="mb-2"
          />
          <Typography variant="body2" className="text-gray-500">
            You are currently on the free plan.
          </Typography>
        </Box>
      )}
    </Paper>
  );
}