

"use client";
import React, { useState } from 'react';
import { Paper, Typography, Button, IconButton, Divider } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../lib/Store';
import { JournalEntry, deleteJournalEntry } from '../../../lib/journalSlice';
import dayjs from 'dayjs';
import ConfirmationDialog from '@/components/shared/ConfirmationDialog';

interface JournalEntryCardProps {
  entry: JournalEntry;
  onEdit: (entry: JournalEntry) => void;
  showNotification: (message: string, severity: 'success' | 'error') => void;
}

const JournalEntryCard = ({ entry, onEdit, showNotification }: JournalEntryCardProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);


   const confirmDelete = async () => {
    setIsDeleting(true); // 1. Start loading
    try {
      await dispatch(deleteJournalEntry(entry._id)).unwrap();
      showNotification('Journal entry deleted successfully.', 'success');
    } catch (error: any) {
      showNotification(error.message || 'Failed to delete entry.', 'error');
    } finally {
      setIsDeleting(false); // 2. Stop loading
      setIsConfirmOpen(false); // 3. Close the dialog
    }
  };

  // const handleDelete = async () => {
  //   if (window.confirm('Are you sure you want to delete this entry?')) {
  //     try {
  //       await dispatch(deleteJournalEntry(entry._id)).unwrap();
  //       showNotification('Journal entry deleted successfully.', 'success');
  //     } catch (error: any) {
  //       showNotification(error.message || 'Failed to delete entry.', 'error');
  //     }
  //   }
  // };


  return (
    <>
    <Paper
      elevation={0}
      className="p-5 rounded-2xl bg-white/70 backdrop-blur border border-indigo-100 shadow-sm hover:shadow-md transition"
    >
      <div className="flex justify-between items-start">
        <div>
          <Typography variant="h6" className="font-semibold text-slate-800">
            {dayjs(entry.practiceDate).format('dddd, MMMM D, YYYY')}
          </Typography>
          <Typography variant="body2" className="text-slate-600">
            {entry.minutes} minutes practiced
          </Typography>
        </div>
        <div className="flex items-center">
          <IconButton onClick={() => onEdit(entry)} size="small" aria-label="edit" className="hover:bg-indigo-50">
            <Edit fontSize="small" />
          </IconButton>
          <IconButton onClick={() => setIsConfirmOpen(true)} size="small" color="error" aria-label="delete" className="hover:bg-rose-50">
            <Delete fontSize="small" />
          </IconButton>
        </div>
      </div>

      <Divider className="my-3" />

      <div className="flex justify-around text-center my-2">
        <div>
          <Typography variant="caption" className="text-slate-500">Mood</Typography>
          <Typography className="mt-1 text-lg">{'⭐'.repeat(entry.mood)}</Typography>
        </div>
        <div>
          <Typography variant="caption" className="text-slate-500">Energy</Typography>
          <Typography className="mt-1 text-lg">{'⚡'.repeat(entry.energy)}</Typography>
        </div>
      </div>

      {entry.notes && (
        <>
          <Divider className="my-3" />
          <Typography variant="body2" className="text-slate-700 whitespace-pre-wrap">{entry.notes}</Typography>
        </>
      )}
    </Paper>


 <ConfirmationDialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this entry? This action cannot be undone."
        isLoading={isDeleting}
      />
      </>
  );
};

interface JournalListProps {
  entries: JournalEntry[];
  onEdit: (entry: JournalEntry) => void;
  showNotification: (message: string, severity: 'success' | 'error') => void;
}

export default function JournalList({ entries, onEdit, showNotification }: JournalListProps) {
  if (entries.length === 0) {
    return (
      <Paper className="p-10 text-center text-slate-600 rounded-2xl bg-white/70 backdrop-blur border border-indigo-100">
        <Typography>No journal entries yet.</Typography>
        <Typography variant="body2" className="mt-1">
          Click "Add Entry" to log your first practice session!
        </Typography>
      </Paper>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <JournalEntryCard key={entry._id} entry={entry} onEdit={onEdit} showNotification={showNotification} />
      ))}
    </div>
  );
}
