


"use client";

import React from 'react';
import { useAuth } from '@/context/AuthContext'; // Adjust path
import { Paper, Typography, Chip, CircularProgress, Box, Button } from '@mui/material';
import dayjs from 'dayjs';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Link from 'next/link';
import AutorenewIcon from '@mui/icons-material/Autorenew';

export default function SubscriptionStatus() {
  const { user, loading, checkActiveSubscription } = useAuth();

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

  const isTrulyActive = checkActiveSubscription(); // Uses status === 'active' AND date >= now
  const dbStatus = user.subscription?.status;
  const endDate = user.subscription?.endDate;

  // Determine the display status for a better user experience
  const getSubscriptionStatusDetails = () => {
    if (isTrulyActive) {
      return {
        label: 'Active',
        chipClass: 'bg-green-600 text-white',
        icon: <CheckCircleIcon />,
        description: 'Your premium subscription is active.',
        buttonDisabled: false, // Allow renewal even if active
      };
    }

    if (dbStatus === 'expired' || (dbStatus === 'active' && endDate && dayjs(endDate).isBefore(dayjs(), 'day'))) {
      // dbStatus is 'expired' OR status is 'active' but the date has passed
      return {
        label: 'Expired',
        chipClass: 'bg-red-500 text-white',
        icon: <CancelIcon />,
        description: 'Your subscription has expired. Renew now to continue premium access.',
        buttonDisabled: false,
      };
    }

    // Default to Inactive/Free plan
    return {
      label: 'Inactive',
      chipClass: 'border border-gray-400 text-gray-700 bg-gray-100', // Outlined look
      icon: <CancelIcon />,
      description: 'You are currently on the free plan. Subscribe for premium features.',
      buttonDisabled: false,
    };
  };

  const statusDetails = getSubscriptionStatusDetails();
  
  // Calculate days left ONLY if it's truly active
  const getDaysLeft = () => {
    if (!endDate || !isTrulyActive) return 0;
    const end = dayjs(endDate).endOf('day'); // Check until the end of the day
    const now = dayjs();
    // Use Math.max to avoid showing negative days
    return Math.max(0, end.diff(now, 'day'));
  };

  const daysLeft = getDaysLeft();

  return (
    <Paper elevation={2} className="p-4 rounded-lg bg-white shadow-sm">
      <Typography variant="h6" className="font-semibold text-gray-800 mb-3">
        Subscription Status ✨
      </Typography>

      <Box>
        <Chip
          icon={statusDetails.icon}
          label={statusDetails.label}
          size="small"
          // Apply custom Tailwind classes for chip
          className={`mb-3 ${statusDetails.chipClass}`}
        />
        
        {isTrulyActive && endDate ? (
          // --- Active Subscription Details ---
          <div className="space-y-1 text-sm text-gray-600 mb-4">
            <p>Expires on: <span className="font-medium text-gray-900">{dayjs(endDate).format('MMMM D, YYYY')}</span></p>
            <p>Time remaining: <span className="font-medium text-gray-900">
              {daysLeft > 0 ? `${daysLeft} days` : 'Expires today!'}
            </span></p>
          </div>
        ) : (
          // --- Inactive/Expired Subscription Details ---
          <Typography variant="body2" className="text-gray-500 mb-4 pb-2">
            {statusDetails.description}
          </Typography>
        )}
      </Box>

      {/* --- Subscribe/Renew Button --- */}
      <Link href="/subscribe" passHref>
        {/* Use a regular <Button> for MUI components, then style with Tailwind classes */}
        <Button
          component="a" 
          variant="contained"
          size="medium"
          startIcon={<AutorenewIcon />}
          // Tailwind classes for styling
          className={`
            w-full py-2 rounded-lg transition duration-200 ease-in-out
            ${
              isTrulyActive
                ? 'bg-blue-500 hover:bg-blue-600 text-white' // Renew button style
                : 'bg-indigo-600 hover:bg-indigo-700 text-white' // Subscribe button style
            }
          `}
          // The button is never disabled for the link to `/subscribe`
          // but we can adjust its visual state if needed for strict 'expired' state
        >
          {isTrulyActive ? 'Renew Subscription' : 'Subscribe Now'}
        </Button>
      </Link>
    </Paper>
  );
}