

"use client";
import React from 'react';
import { Paper, Typography } from '@mui/material';
import { AccessTime, Whatshot, EmojiEvents, FitnessCenter } from '@mui/icons-material';

interface ProgressSummaryProps {
  summary: {
    totalMinutes: number;
    currentStreak: number;
    longestStreak: number;
    badges: string[];
  }
}

const StatCard = ({
  icon,
  title,
  value,
  unit,
  bgClass,
  borderClass,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  unit: string;
  bgClass: string;
  borderClass: string;
}) => (
  <Paper elevation={0} className={`p-5 rounded-2xl flex items-center space-x-4 ${bgClass} ${borderClass} shadow-sm`}>
    <div className="p-3 bg-white/70 rounded-full shadow-sm">
      {icon}
    </div>
    <div>
      <Typography variant="body2" className="text-slate-600 font-medium">{title}</Typography>
      <Typography variant="h5" className="font-bold text-slate-900">
        {value} <span className="text-base font-normal text-slate-600">{unit}</span>
      </Typography>
    </div>
  </Paper>
);

export default function ProgressSummary({ summary }: ProgressSummaryProps) {
  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<AccessTime color="primary" />}
          title="Total Practice"
          value={summary.totalMinutes}
          unit="min"
          bgClass="bg-emerald-50"
          borderClass="border border-emerald-100"
        />
        <StatCard
          icon={<Whatshot sx={{ color: '#ef5350' }} />}
          title="Current Streak"
          value={summary.currentStreak}
          unit="days"
          bgClass="bg-rose-50"
          borderClass="border border-rose-100"
        />
        <StatCard
          icon={<EmojiEvents sx={{ color: '#fbbf24' }} />}
          title="Longest Streak"
          value={summary.longestStreak}
          unit="days"
          bgClass="bg-amber-50"
          borderClass="border border-amber-100"
        />
        <StatCard
          icon={<FitnessCenter sx={{ color: '#22c55e' }} />}
          title="Badges Earned"
          value={summary.badges.length}
          unit="badges"
          bgClass="bg-indigo-50"
          borderClass="border border-indigo-100"
        />


  <div className="mt-8">
        <Typography variant="h6" className="font-semibold text-slate-800 mb-4">
          Your Awards 🏆
        </Typography>
        {summary.badges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {/* --- FIX: Map over the array of strings --- */}
            {summary.badges.map((badgeName) => (
              <Paper 
                key={badgeName} 
                elevation={1} 
                className="p-4 text-center flex flex-col items-center justify-center rounded-lg bg-white hover:shadow-md transition-shadow"
              >
                <EmojiEvents sx={{ color: '#facc15', fontSize: 40 }} className="mb-2" />
                <Typography variant="body2" className="font-semibold text-slate-700">
                  {/* Display the badge string directly */}
                  {badgeName}
                </Typography>
              </Paper>
            ))}
          </div>
        ) : (
          <Paper className="p-6 text-center text-gray-500 rounded-lg bg-slate-50 border-dashed border">
            <Typography>No badges earned yet. Keep up the great work!</Typography>
          </Paper>
        )}
      </div>


      </div>
    </div>
  );
}
