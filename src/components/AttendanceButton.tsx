

// // components/AttendanceButton.tsx

// "use client";
// import React, { useState, useEffect, useCallback } from 'react';
// import { useAuth } from '../context/AuthContext';
// import axios from 'axios';
// import { Button, CircularProgress, Tooltip, styled, TooltipProps, tooltipClasses, Snackbar } from '@mui/material';
// import MuiAlert, { AlertProps } from "@mui/material/Alert";
// import { CheckCircle, EditCalendar } from '@mui/icons-material';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
// const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
//   <Tooltip {...props} arrow classes={{ popper: className }} />
// ))(({ theme }) => ({
//   [`& .${tooltipClasses.arrow}`]: {
//     color: theme.palette.common.white,
//   },
//   [`& .${tooltipClasses.tooltip}`]: {
//     backgroundColor: theme.palette.common.white,
//     color: 'rgba(0, 0, 0, 0.87)',
//     border: '1px solid #dadde9',
//     fontSize: 11,
//   },
// }));

// const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
//   props,
//   ref
// ) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });


// export default function AttendanceButton() {
//   const { user } = useAuth();
//   const [hasAttended, setHasAttended] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

//   const checkAttendance = useCallback(async () => {
//     if (!user) {
//       setIsLoading(false);
//       return;
//     }
//     try {
//       setIsLoading(true);
//       const response = await axios.get(`${API_URL}/attendance/check`, { withCredentials: true });
//       setHasAttended(response.data.hasAttended);
//     } catch (err) {
//       setSnackbar({ open: true, message: "Failed to check attendance status.", severity: "error" });
//     } finally {
//       setIsLoading(false);
//     }
//   }, [user]);

//   useEffect(() => {
//     checkAttendance();
//   }, [checkAttendance]);

//   const handleCheckIn = async () => {
//     if (!user) {
//       setSnackbar({ open: true, message: "You must be logged in.", severity: "error" });
//       return;
//     }
//     try {
//       setIsSubmitting(true);
//       await axios.post(`${API_URL}/attendance/mark-starclub`, {}, { withCredentials: true });
//       setHasAttended(true);
//       setSnackbar({ open: true, message: "Attendance marked successfully!", severity: "success" });
//     } catch (err) {
//       setSnackbar({ open: true, message: "Failed to mark attendance.", severity: "error" });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!user) return null;
//   if (isLoading) return <CircularProgress size={24} color="warning"/>;

//   return (
//     <>
//       <LightTooltip 
//         title={hasAttended ? "You have Marked attendance for today" : "Mark your attendance for today"}
//       >
//         <span>
//             <Button
//               variant="contained"
//               color={hasAttended ? "success" : "warning"}
//               disabled={hasAttended || isSubmitting}
//               onClick={handleCheckIn}
//               startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : hasAttended ? <CheckCircle /> : <EditCalendar />}
//               sx={{ minWidth: '120px', transition: 'background-color 0.3s ease', color: 'white', '&.Mui-disabled': { backgroundColor: hasAttended ? '#29592b' : '', color: '#ffffff', opacity: hasAttended ? 0.7 : 0.5, } }}
//             >
//               {isSubmitting ? "Checking..." : hasAttended ? "Checked" : "Check-in"}
//             </Button>
//         </span>
//       </LightTooltip>

//       <Snackbar 
//         open={snackbar.open} 
//         autoHideDuration={6000} 
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//       >
//         <Alert 
//           onClose={() => setSnackbar({ ...snackbar, open: false })} 
//           severity={snackbar.severity}
//           sx={{
//             width: '100%',
//             '& .MuiAlert-message': {
//               color: 'white',
//             },
//             '& .MuiAlert-icon': {
//               color: 'white'
//             },
           
//             '& .MuiAlert-action .MuiIconButton-root': {
//               color: 'white'
//             },
//             // ---------------------------------------------
//             '&.MuiAlert-filledSuccess': {
//               backgroundColor: '#2e7d32', 
//             },
//             '&.MuiAlert-filledError': {
//               backgroundColor: '#d32f2f',
//             }
//           }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </>
//   );
// }










"use client";
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, CircularProgress, Tooltip, styled, TooltipProps, tooltipClasses, Snackbar } from '@mui/material';
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { CheckCircle, EditCalendar } from '@mui/icons-material';

// Import your new Redux actions and types
import { checkAttendanceStatus, markUserAttendance } from '../lib/AttendanceSlice';
import { RootState, AppDispatch } from '../lib/Store';
import { useAuth } from '../context/AuthContext';

// Styled component for the custom tooltip
const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.white,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    border: '1px solid #dadde9',
    fontSize: 11,
  },
}));

// Styled component for the Snackbar alert
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function AttendanceButton() {
  const { user } = useAuth();
  
  // Get the dispatch function from Redux
  const dispatch = useDispatch<AppDispatch>();

  // Select data from the Redux store
  const { hasAttended, status, error } = useSelector((state: RootState) => state.attendance);

  // Local state for managing the snackbar notifications
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

  // Fetch initial status only if we haven't fetched it before
  useEffect(() => {
    if (user && status === 'idle') {
      dispatch(checkAttendanceStatus());
    }
  }, [user, status, dispatch]);

  // Effect to show an error snackbar if a Redux action fails
  useEffect(() => {
    if (status === 'failed' && error) {
        setSnackbar({ open: true, message: error, severity: "error" });
    }
  }, [status, error]);


  // Handle the check-in button click by dispatching a Redux action
  const handleCheckIn = () => {
    if (!user) {
      setSnackbar({ open: true, message: "You must be logged in.", severity: "error" });
      return;
    }
    dispatch(markUserAttendance())
        .unwrap() // .unwrap() returns a promise that resolves on success or rejects on failure
        .then(() => {
             setSnackbar({ open: true, message: "Attendance marked successfully!", severity: "success" });
        })
        .catch((err) => {
             // The error message comes from the `rejectWithValue` in our thunk
             setSnackbar({ open: true, message: err, severity: "error" });
        });
  };

  // Do not render the button if there is no logged-in user
  if (!user) return null;

  // Derive UI loading states from the Redux status
  const isLoading = status === 'loading' || status === 'idle';
  const isSubmitting = status === 'loading';

  return (
    <>
      <LightTooltip 
        title={hasAttended ? "You have Marked attendance for today" : "Mark your attendance for today"}
      >
        <span>
            <Button
              variant="contained"
              color={hasAttended ? "success" : "warning"}
              disabled={hasAttended || isSubmitting}
              onClick={handleCheckIn}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : hasAttended ? <CheckCircle /> : <EditCalendar />}
              sx={{ 
                minWidth: '120px', 
                transition: 'background-color 0.3s ease', 
                color: 'white', 
                '&.Mui-disabled': { 
                  backgroundColor: hasAttended ? '#29592b' : '', 
                  color: '#ffffff', 
                  opacity: hasAttended ? 0.7 : 0.5, 
                } 
              }}
            >
              {isSubmitting ? "Checking..." : hasAttended ? "Checked" : "Check-in"}
            </Button>
        </span>
      </LightTooltip>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{
            width: '100%',
            '& .MuiAlert-message': { color: 'white' },
            '& .MuiAlert-icon': { color: 'white' },
            '& .MuiAlert-action .MuiIconButton-root': { color: 'white' },
            '&.MuiAlert-filledSuccess': { backgroundColor: '#2e7d32' },
            '&.MuiAlert-filledError': { backgroundColor: '#d32f2f' }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}