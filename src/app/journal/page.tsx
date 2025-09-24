// "use client";

// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '../../lib/Store'; // Adjust import path
// import { fetchJournalPageData } from '../../lib/journalSlice'; // Adjust import path
// import { Button } from '@mui/material';
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import { useAuth } from '@/context/AuthContext'; // Adjust path
// import SubscriptionAlert from '@/components/shared/SubscriptionAlert';

// // A simple loading skeleton
// const PageSkeleton = () => (
//     <div className="animate-pulse space-y-8">
//         <div className="h-24 bg-gray-200 rounded-lg"></div>
//         <div className="h-10 bg-gray-200 rounded w-1/3"></div>
//         <div className="space-y-4">
//             <div className="h-32 bg-gray-200 rounded-lg"></div>
//             <div className="h-32 bg-gray-200 rounded-lg"></div>
//         </div>
//     </div>
// );

// // We will create these child components next
// import ProgressSummary from './_components/ProgressSummary';
// import JournalList from './_components/JournalList';
// import JournalCalendar from './_components/JournalCalendar';
// import JournalFormModal from './_components/JournalFormModal';
// import NotificationSnackbar, { SnackbarState } from '@/components/shared/NotificationSnackbar'; 
// import { Typography, Paper } from '@mui/material';

// export default function JournalPage() {
//     const dispatch = useDispatch<AppDispatch>();
//     const { summary, entries, status, error } = useSelector((state: RootState) => state.journalPage); 
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [entryToEdit, setEntryToEdit] = useState(null);

//     const { user, loading } = useAuth();
//     const [isAlertOpen, setIsAlertOpen] = useState(false);

//     const isSubscribed = user?.subscription?.status === 'active';

//     useEffect(() => {
//         // Show the alert only after loading is done and if the user is not subscribed.
//         if (!loading && user && !isSubscribed) {
//             setIsAlertOpen(true);
//         }
//     }, [user, loading, isSubscribed]);

//     // State for the MUI Snackbar
//     const [snackbar, setSnackbar] = useState<SnackbarState>({ open: false, message: '', severity: 'success' });
//     const showNotification = (message: string, severity: 'success' | 'error') => {
//         setSnackbar({ open: true, message, severity });
//     };
    
//     useEffect(() => {
//         if (status === 'idle') {
//             dispatch(fetchJournalPageData());
//         }
//     }, [status, dispatch]);

//     useEffect(() => {
//         if (error) {
//             showNotification(error, 'error');
//         }
//     }, [error]);

//     const handleEdit = (entry: any) => {
//         setEntryToEdit(entry);
//         setIsModalOpen(true);
//     };

//     const handleAddNew = () => {
//         setEntryToEdit(null);
//         setIsModalOpen(true);
//     };

//     if (status === 'loading' && !summary) {
//         return <PageSkeleton />;
//     }

// if (!isSubscribed) {
//         return (
//             <div className="p-8">
//                 <SubscriptionAlert isOpen={isAlertOpen} onClose={() => setIsAlertOpen(false)} />
//                 <Paper className="p-8 text-center text-gray-500">
//                     <Typography variant="h5" className="font-semibold mb-2">Journal is a Pro Feature</Typography>
//                     <Typography>Subscribe now to start logging your practice and tracking your progress.</Typography>
//                 </Paper>
//             </div>
//         );
//     }



//     return (
//         <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
//             <NotificationSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
//             <div className="max-w-7xl mx-auto">
//                 <div className="flex justify-between items-center mb-6">
//                     <h1 className="text-3xl font-bold text-gray-800">My Dance Journal</h1>
//                     <Button 
//                         variant="contained" 
//                         color="primary" 
//                         startIcon={<AddCircleOutlineIcon />}
//                         onClick={handleAddNew}
//                         className="bg-yellow-600 hover:bg-yellow-700 text-white"
//                     >
//                         Add Entry
//                     </Button>
//                 </div>

//                 {/* Progress Section */}
//                 {summary && <ProgressSummary summary={summary} />}

//                 {/* Main Content Area */}
//                 <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
//                     {/* Journal List (main column) */}
//                     <div className="lg:col-span-2">
//                         <h2 className="text-2xl font-semibold text-gray-700 mb-4">Recent Entries</h2>
//                         <JournalList entries={entries} onEdit={handleEdit} showNotification={showNotification} />
//                     </div>

//                     {/* Calendar (sidebar) */}
//                     <div>
//                          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Calendar</h2>
//                         <JournalCalendar />
//                     </div>
//                 </div>
//             </div>
            
//             <JournalFormModal 
//                 isOpen={isModalOpen} 
//                 onClose={() => setIsModalOpen(false)} 
//                 entryToEdit={entryToEdit}
//                 showNotification={showNotification}
//             />
//         </div>
//     );
// }

















"use client";
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../lib/Store';
import { fetchJournalPageData } from '../../lib/journalSlice';
import { Button, Paper, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useAuth } from '@/context/AuthContext';
import SubscriptionAlert from '@/components/shared/SubscriptionAlert';

// Child components
import ProgressSummary from './_components/ProgressSummary';
import JournalList from './_components/JournalList';
import JournalCalendar from './_components/JournalCalendar';
import JournalFormModal from './_components/JournalFormModal';
import NotificationSnackbar, { SnackbarState } from '@/components/shared/NotificationSnackbar';

// New: same NavBar used on Community page
import NavBar from '@/components/Navbar';

// A simple loading skeleton
const PageSkeleton = () => (
  <div className="animate-pulse space-y-8">
    <div className="h-24 bg-gray-200 rounded-lg"></div>
    <div className="h-10 bg-gray-200 rounded w-1/3"></div>
    <div className="space-y-4">
      <div className="h-32 bg-gray-200 rounded-lg"></div>
      <div className="h-32 bg-gray-200 rounded-lg"></div>
    </div>
  </div>
);

export default function JournalPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { summary, entries, status, error } = useSelector((state: RootState) => state.journalPage);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entryToEdit, setEntryToEdit] = useState(null);

  const { user, loading } = useAuth();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const isSubscribed = user?.subscription?.status === 'active';

  useEffect(() => {
    if (!loading && user && !isSubscribed) setIsAlertOpen(true);
  }, [user, loading, isSubscribed]);

  const [snackbar, setSnackbar] = useState<SnackbarState>({ open: false, message: '', severity: 'success' });
  const showNotification = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchJournalPageData());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (error) showNotification(error, 'error');
  }, [error]);

  const handleEdit = (entry: any) => {
    setEntryToEdit(entry);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEntryToEdit(null);
    setIsModalOpen(true);
  };

  if (status === 'loading' && !summary) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-cyan-50 to-indigo-50">
        <NavBar />
        <main className="pt-[104px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageSkeleton />
        </main>
      </div>
    );
  }

  if (!isSubscribed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-cyan-50 to-indigo-50">
        <NavBar />
        <main className="pt-[104px] max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SubscriptionAlert isOpen={isAlertOpen} onClose={() => setIsAlertOpen(false)} />
          <Paper className="p-10 rounded-2xl bg-white/70 backdrop-blur shadow-sm border border-emerald-100">
            <Typography variant="h5" className="font-semibold mb-2 text-slate-800">
              Journal is a Pro Feature
            </Typography>
            <Typography className="text-slate-600">
              Subscribe now to start logging practice and tracking progress.
            </Typography>
          </Paper>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-cyan-50 to-indigo-50">
      <NavBar />
      <NotificationSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
      <main className="pt-[104px]">
        {/* Header band */}
        <section className="border-y border-emerald-100 bg-white/60 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Dance Journal</h1>
              <p className="text-slate-600 mt-1">Log sessions<br/> track mood and energy 💃<br/>keep a daily streak 💖</p>
            </div>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircleOutlineIcon />}
              onClick={handleAddNew}
              className="!bg-emerald-600 hover:!bg-emerald-700 !normal-case"
            >
              Add Entry
            </Button>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Progress Section */}
          {summary && <ProgressSummary summary={summary} />}

          {/* Main Content Area */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Journal List (main column) */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-slate-800">Recent Entries</h2>
              </div>
              <JournalList entries={entries} onEdit={handleEdit} showNotification={showNotification} />
            </div>

            {/* Calendar (sidebar) */}
            <aside>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">Calendar</h2>
              <JournalCalendar />
            </aside>
          </div>
        </section>
      </main>

      <JournalFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        entryToEdit={entryToEdit}
        showNotification={showNotification}
      />
    </div>
  );
}
