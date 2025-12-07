


"use client";
import React, { useState, useEffect } from 'react';
import { Paper, Typography, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../lib/Store';
import { fetchJournalDatesForMonth } from '../../../lib/journalSlice';
import dayjs from 'dayjs';

export default function JournalCalendar() {
  const dispatch = useDispatch<AppDispatch>();
  const { datesWithEntries } = useSelector((state: RootState) => state.journalPage);
  const [currentDate, setCurrentDate] = useState(dayjs());

  useEffect(() => {
    dispatch(fetchJournalDatesForMonth({ year: currentDate.year(), month: currentDate.month() + 1 }));
  }, [currentDate, dispatch]);

  const startOfMonth = currentDate.startOf('month');
  const endOfMonth = currentDate.endOf('month');
  const daysInMonth = Array.from({ length: endOfMonth.date() }, (_, i) => startOfMonth.add(i, 'day'));
  const firstDayOfMonth = startOfMonth.day();

  const handlePrevMonth = () => setCurrentDate(currentDate.subtract(1, 'month'));
  const handleNextMonth = () => setCurrentDate(currentDate.add(1, 'month'));

  return (
    <Paper elevation={0} className="p-4 rounded-2xl bg-white/70 backdrop-blur border border-cyan-100 shadow-sm pb-[90px] mb-4">
      <div className="flex justify-between items-center mb-4">
        <IconButton onClick={handlePrevMonth} size="small">
          <ChevronLeft />
        </IconButton>
        <Typography variant="h6" className="font-semibold text-center text-slate-800">
          {currentDate.format('MMMM YYYY')}
        </Typography>
        <IconButton onClick={handleNextMonth} size="small">
          <ChevronRight />
        </IconButton>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs sm:text-sm text-slate-500 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => <div key={day} className="py-1">{day}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
        {daysInMonth.map(day => {
          const isToday = day.isSame(dayjs(), 'day');
          const hasEntry = datesWithEntries.includes(day.format('YYYY-MM-DD'));
          return (
            <div key={day.format('YYYY-MM-DD')} className="flex justify-center items-center h-9">
              <div
                className={[
                  "w-8 h-8 flex items-center justify-center rounded-full transition-colors",
                  "hover:ring-2 hover:ring-emerald-300/60",
                  isToday ? "bg-emerald-100 text-emerald-700 font-semibold" : "text-slate-700",
                  hasEntry ? "bg-emerald-500 text-white hover:ring-0" : "",
                ].join(" ")}
                title={hasEntry ? "Has entry" : undefined}
              >
                {day.date()}
              </div>
            </div>
          );
        })}
      </div>
    </Paper>
  );
}
