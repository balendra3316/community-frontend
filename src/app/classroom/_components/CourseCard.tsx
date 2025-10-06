



// 'use client';
// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { 
//   Button, 
//   CircularProgress, 
//   Chip,
//   Box,
//   IconButton,
//   Tooltip,
//   Snackbar,
//   Alert,
//   Modal,         // <-- Import Modal
//   Typography,    // <-- Import Typography for modal title
//   Stack          // <-- Import Stack for button layout
// } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import { 
//   ShoppingCart, 
//   Lock, 
//   PlayArrow, 
//   Star,
//   AccessTime,
//   Share,
//   ContentCopy,   // <-- Import Icon for Copy button
//   WhatsApp       // <-- Import Icon for WhatsApp button
// } from '@mui/icons-material';
// import { Course, CourseService } from '../../../services/courseService';


// declare global {
//   interface Window {
//     Razorpay: any;
//   }
// }

// interface CourseCardProps {
//   course: Course;
//   onPurchaseSuccess?: () => void;
// }

// interface SnackbarState {
//   open: boolean;
//   message: string;
//   severity: 'success' | 'error' | 'warning' | 'info';
// }


// const YellowButton = styled(Button)(({ theme, variant }) => ({
//   fontWeight: 600,
//   textTransform: 'none',
//   borderRadius: '12px',
//   padding: '12px 24px',
//   fontSize: '0.95rem',
//   transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//   boxShadow: 'none',
  
//   ...(variant === 'contained' && {
//     background: 'linear-gradient(135deg, #FEF3C7 0%, #FCD34D 50%, #F59E0B 100%)',
//     color: '#92400E',
//     border: '1px solid #F59E0B',
//     '&:hover': {
//       background: 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 50%, #D97706 100%)',
//       boxShadow: '0 8px 25px rgba(245, 158, 11, 0.35)',
//       transform: 'translateY(-2px)',
//     },
//     '&:active': {
//       transform: 'translateY(0)',
//       boxShadow: '0 4px 15px rgba(245, 158, 11, 0.25)',
//     },
//     '&:disabled': {
//       background: '#F9FAFB',
//       color: '#9CA3AF',
//       border: '1px solid #E5E7EB',
//       transform: 'none',
//     },
//   }),
  
//   ...(variant === 'outlined' && {
//     borderColor: '#F59E0B',
//     color: '#D97706',
//     borderWidth: '2px',
//     backgroundColor: 'rgba(254, 243, 199, 0.1)',
//     '&:hover': {
//       borderColor: '#D97706',
//       backgroundColor: 'rgba(254, 243, 199, 0.2)',
//       boxShadow: '0 4px 15px rgba(245, 158, 11, 0.2)',
//       transform: 'translateY(-1px)',
//     },
//   }),
  
//   ...(variant === 'text' && {
//     color: '#D97706',
//     '&:hover': {
//       backgroundColor: 'rgba(254, 243, 199, 0.15)',
//     },
//   }),
// }));

// const AccessButton = styled(Button)(({ theme }) => ({
//   fontWeight: 600,
//   textTransform: 'none',
//   borderRadius: '10px',
//   padding: '10px 20px',
//   background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
//   color: '#065F46',
//   border: '1px solid #10B981',
//   '&:hover': {
//     background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
//     boxShadow: '0 6px 20px rgba(16, 185, 129, 0.25)',
//     transform: 'translateY(-1px)',
//   },
// }));

// const PriceChip = styled(Chip)(({ theme }) => ({
//   background: 'linear-gradient(135deg, #FEF3C7 0%, #FCD34D 100%)',
//   color: '#92400E',
//   fontWeight: 700,
//   fontSize: '0.85rem',
//   boxShadow: '0 2px 8px rgba(252, 211, 77, 0.3)',
//   '& .MuiChip-icon': {
//     color: '#D97706',
//   },
// }));

// const FreeChip = styled(Chip)(({ theme }) => ({
//   background: 'linear-gradient(135deg, #DBEAFE 0%, #93C5FD 100%)',
//   color: '#1E40AF',
//   fontWeight: 700,
//   fontSize: '0.85rem',
//   boxShadow: '0 2px 8px rgba(147, 197, 253, 0.3)',
// }));

// const modalStyle = {
//   position: 'absolute' as 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'background.paper',
//   border: '2px solid #000',
//   boxShadow: 24,
//   p: 4,
//   borderRadius: '12px',
// };


// const CourseCard: React.FC<CourseCardProps> = ({ course, onPurchaseSuccess }) => {
//   const [isProcessingPayment, setIsProcessingPayment] = useState(false);
//   const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
//   const [snackbar, setSnackbar] = useState<SnackbarState>({
//     open: false,
//     message: '',
//     severity: 'info'
//   });
//   const [isShareModalOpen, setIsShareModalOpen] = useState(false); // <-- State for Modal

//   const progress = course.progress?.completionPercentage || 0;

//   // --- Modal Handlers ---
//   const handleOpenShareModal = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsShareModalOpen(true);
//   };
//   const handleCloseShareModal = () => setIsShareModalOpen(false);

//   // --- Snackbar Handlers ---
//   const showSnackbar = (message: string, severity: SnackbarState['severity'] = 'info') => {
//     setSnackbar({ open: true, message, severity });
//   };

//   const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
//     if (reason === 'clickaway') return;
//     setSnackbar(prev => ({ ...prev, open: false }));
//   };

//   // --- Razorpay and other existing hooks ---
//   useEffect(() => {
//     const loadRazorpayScript = () => {
//       return new Promise((resolve) => {
//         if (window.Razorpay) {
//           setIsRazorpayLoaded(true);
//           resolve(true);
//           return;
//         }
//         const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
//         if (existingScript) {
//           existingScript.addEventListener('load', () => {
//             setIsRazorpayLoaded(true);
//             resolve(true);
//           });
//           return;
//         }
//         const script = document.createElement('script');
//         script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//         script.async = true;
//         script.onload = () => { setIsRazorpayLoaded(true); resolve(true); };
//         script.onerror = () => { resolve(false); };
//         document.head.appendChild(script);
//       });
//     };
//     loadRazorpayScript();
//   }, []);

//   const handlePayment = async (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (isProcessingPayment) return;
//     if (!isRazorpayLoaded || !window.Razorpay) {
//       showSnackbar('Payment system is loading. Please try again.', 'warning');
//       return;
//     }
//     setIsProcessingPayment(true);
//     try {
//       const options = {
//         key: "rzp_live_Dj70XqJ0PkPgJY",
//         amount: course.price * 100,
//         currency: 'INR',
//         name: 'Course Purchase',
//         description: `Purchase ${course.title}`,
//         image: course.coverImage || '/logo.png',
//         handler: async function (response: any) {
//           try {
//             const paymentData = {
//               courseId: course._id,
//               paymentAmount: course.price,
//               razorpayOrderId: response.razorpay_order_id || `temp_order_${Date.now()}`,
//               razorpayPaymentId: response.razorpay_payment_id,
//               razorpaySignature: response.razorpay_signature || 'temp_signature'
//             };
//             await CourseService.purchaseCourse(paymentData);
//             showSnackbar('Course purchased successfully! 🎉', 'success');
//             if (onPurchaseSuccess) onPurchaseSuccess();
//           } catch (error: any) {
//             showSnackbar('Payment verification failed. Please contact support.', 'error');
//           } finally {
//             setIsProcessingPayment(false);
//           }
//         },
//         prefill: { name: '', email: '', contact: '' },
//         notes: { course_id: course._id, course_title: course.title },
//         theme: { color: '#F59E0B' },
//         modal: { ondismiss: () => setIsProcessingPayment(false) }
//       };
//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (error) {
//       showSnackbar('Failed to initiate payment. Please try again.', 'error');
//       setIsProcessingPayment(false);
//     }
//   };

//   // --- Share action handlers for Modal ---
//   const handleCopyLink = () => {
//     const shareUrl = `${window.location.origin}/course/${course._id}`;
//     navigator.clipboard.writeText(shareUrl)
//       .then(() => {
//         showSnackbar('Course link copied to clipboard!', 'success');
//       })
//       .catch(() => {
//         showSnackbar('Failed to copy link.', 'error');
//       });
//     handleCloseShareModal();
//   };

//   const handleShareToWhatsApp = () => {
//     const courseUrl = `${window.location.origin}/course/${course._id}`;
//     // Corrected the message typos
//     const message = `Hey! I'm enjoying this course which is great. I am sharing it so you can join now: ${courseUrl}`;
//     const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
//     window.open(whatsappUrl, '_blank');
//     handleCloseShareModal();
//   };


//   const CardContent = () => (
//     <>
//       <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-gray-100"
//        style={{
//         boxShadow: "rgba(60, 64, 67, 0.32) 0px 1px 2px, rgba(60, 64, 67, 0.15) 0px 2px 6px, rgba(0, 0, 0, 0.1) 0px 1px 8px",
//         border: "1px solid rgb(228, 228, 228)"
//       }}>
//         {/* Course Image */}
//         <div className="relative w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100">
//           {course.coverImage ? (
//             <img 
//               src={course.coverImage}
//               alt={course.title}
//               className="w-full h-full object-cover"
//             />
//           ) : (
//             <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-yellow-200">
//               <span className="text-amber-800 text-lg font-semibold text-center px-4">{course.title}</span>
//             </div>
//           )}
          
//          <Box className="absolute top-3 left-3">
//             <Tooltip title="Share Course">
//               <IconButton
//                 onClick={handleOpenShareModal} 
//                 size="small"
//                 sx={{
//                   backgroundColor: 'rgba(0, 0, 0, 0.4)',
//                   '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.6)' }
//                 }}
//               >
//                 <Share sx={{ color: 'white', fontSize: '1.1rem' }} />
//               </IconButton>
//             </Tooltip>
//           </Box>

//           <Box className="absolute top-3 right-3">
//             {course.isPaid ? (
//               <PriceChip 
//                 icon={<Star />} 
//                 label={`₹${course.price}`} 
//                 size="small"
//               />
//             ) : (
//               <FreeChip 
//                 label="FREE" 
//                 size="small"
//               />
//             )}
//           </Box>
//         </div>
        
//         {/* Course Content */}
//         <div className="p-5 flex-grow flex flex-col">
//           <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{course.title}</h3>
//           <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{course.description}</p>
          
//           {/* Action Buttons */}
//           <Box className="mt-auto">
//             {course.needsPayment && (
//               <YellowButton
//                 variant="contained"
//                 fullWidth
//                 onClick={handlePayment}
//                 disabled={isProcessingPayment || !isRazorpayLoaded}
//                 startIcon={isProcessingPayment ? <CircularProgress size={18} sx={{ color: '#92400E' }} /> : <ShoppingCart />}
//                 sx={{ mb: 1 }}
//               >
//                 {isProcessingPayment 
//                   ? 'Processing Payment...' 
//                   : !isRazorpayLoaded 
//                     ? 'Loading Payment...' 
//                     : `Purchase for ₹${course.price}`
//                 }
//               </YellowButton>
//             )}
//             {course.isAccessible && (
//               <AccessButton
//                 variant="contained"
//                 fullWidth
//                 startIcon={<PlayArrow />}
//                 sx={{ mb: 1 }}
//               >
//                 {course.isPaid ? 'Continue Learning' : 'Start Free Course'}
//               </AccessButton>
//             )}
//           </Box>
//         </div>
        
//         {/* Progress Bar - only show for accessible courses */}
//         {course.isAccessible && (
//           <div className="px-5 pb-4">
//             <div className="flex items-center justify-between mb-2">
//               <Box display="flex" alignItems="center" gap={1}>
//                 <AccessTime sx={{ fontSize: '0.875rem', color: '#6B7280' }} />
//                 <span className="text-xs font-semibold text-gray-700">{progress}% Complete</span>
//               </Box>
//               <Chip 
//                 label={course.isPaid ? 'Purchased' : 'Free'} 
//                 size="small"
//                 sx={{
//                   backgroundColor: course.isPaid ? '#FEF3C7' : '#DBEAFE',
//                   color: course.isPaid ? '#92400E' : '#1E40AF',
//                   fontSize: '0.75rem',
//                   height: '20px'
//                 }}
//               />
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div 
//                 className="bg-gradient-to-r from-yellow-400 to-amber-500 h-2 rounded-full transition-all duration-500 ease-out" 
//                 style={{ width: `${progress}%` }}
//               ></div>
//             </div>
//           </div>
//         )}
        
//         {/* Locked indicator */}
//         {!course.isAccessible && course.needsPayment && (
//           <div className="px-5 pb-4">
//             <Box display="flex" alignItems="center" justifyContent="center" className="text-gray-500 text-sm bg-gray-50 rounded-lg py-3">
//               <Lock sx={{ fontSize: '1rem', marginRight: '0.5rem' }} />
//               <span className="font-medium">Course Locked</span>
//             </Box>
//           </div>
//         )}
//       </div>

//       {/* --- ADD THE SHARE MODAL --- */}
//       <Modal
//         open={isShareModalOpen}
//         onClose={handleCloseShareModal}
//         aria-labelledby="share-modal-title"
//         aria-describedby="share-modal-description"
//         slotProps={{
//     backdrop: {
//       onClick: (e) => {
//         // Stop the click from reaching the underlying Link
//         e.stopPropagation();
        
//       },
//     },
//   }}
//       >
//         <Box sx={modalStyle} onClick={(e) => e.stopPropagation()}>
//           <Typography id="share-modal-title" variant="h6" component="h2">
//             Share this Course
//           </Typography>
//           <Typography id="share-modal-description" sx={{ mt: 2, mb: 3 }}>
//             Share this course with your friends and colleagues!
//           </Typography>
//           <Stack spacing={2} direction="column">
//             <Button
//               variant="outlined"
//               startIcon={<ContentCopy />}
//               onClick={handleCopyLink}
//             >
//               Copy Link
//             </Button>
//             <Button
//               variant="contained"
//               startIcon={<WhatsApp />}
//               onClick={handleShareToWhatsApp}
//               sx={{ backgroundColor: '#25D366', '&:hover': { backgroundColor: '#1EBE56' } }}
//             >
//               Share on WhatsApp
//             </Button>
//           </Stack>
//         </Box>
//       </Modal>

//       {/* Snackbar for notifications - Kept your custom styling */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//       >
//         <Alert 
//           onClose={handleCloseSnackbar} 
//           severity={snackbar.severity}
//           variant="filled"
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

//   if (course.isAccessible) {
//     return (
//       <Link href={`/classroom/${course._id}`} className="block h-full">
//         <CardContent />
//       </Link>
//     );
//   }

//   return <CardContent />;
// };

// export default CourseCard;





















'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Button, 
  CircularProgress, 
  Chip,
  Box,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Modal,         // <-- Import Modal
  Typography,    // <-- Import Typography for modal title
  Stack          // <-- Import Stack for button layout
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  ShoppingCart, 
  Lock, 
  PlayArrow, 
  Star,
  AccessTime,
  Share,
  ContentCopy,   // <-- Import Icon for Copy button
  WhatsApp       // <-- Import Icon for WhatsApp button
} from '@mui/icons-material';
import { Course, CourseService } from '../../../services/courseService';


declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CourseCardProps {
  course: Course;
  onPurchaseSuccess?: () => void;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}


const YellowButton = styled(Button)(({ theme, variant }) => ({
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: '12px',
  padding: '12px 24px',
  fontSize: '0.95rem',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: 'none',
  
  ...(variant === 'contained' && {
    background: 'linear-gradient(135deg, #FEF3C7 0%, #FCD34D 50%, #F59E0B 100%)',
    color: '#92400E',
    border: '1px solid #F59E0B',
    '&:hover': {
      background: 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 50%, #D97706 100%)',
      boxShadow: '0 8px 25px rgba(245, 158, 11, 0.35)',
      transform: 'translateY(-2px)',
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 4px 15px rgba(245, 158, 11, 0.25)',
    },
    '&:disabled': {
      background: '#F9FAFB',
      color: '#9CA3AF',
      border: '1px solid #E5E7EB',
      transform: 'none',
    },
  }),
  
  ...(variant === 'outlined' && {
    borderColor: '#F59E0B',
    color: '#D97706',
    borderWidth: '2px',
    backgroundColor: 'rgba(254, 243, 199, 0.1)',
    '&:hover': {
      borderColor: '#D97706',
      backgroundColor: 'rgba(254, 243, 199, 0.2)',
      boxShadow: '0 4px 15px rgba(245, 158, 11, 0.2)',
      transform: 'translateY(-1px)',
    },
  }),
  
  ...(variant === 'text' && {
    color: '#D97706',
    '&:hover': {
      backgroundColor: 'rgba(254, 243, 199, 0.15)',
    },
  }),
}));




const AccessButton = styled(Button)(({ theme }) => ({
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: '10px',
  padding: '10px 20px',
  background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
  color: '#065F46',
  border: '1px solid #10B981',
  '&:hover': {
    background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
    boxShadow: '0 6px 20px rgba(16, 185, 129, 0.25)',
    transform: 'translateY(-1px)',
  },
}));

const PriceChip = styled(Chip)(({ theme }) => ({
  background: 'linear-gradient(135deg, #FEF3C7 0%, #FCD34D 100%)',
  color: '#92400E',
  fontWeight: 700,
  fontSize: '0.85rem',
  boxShadow: '0 2px 8px rgba(252, 211, 77, 0.3)',
  '& .MuiChip-icon': {
    color: '#D97706',
  },
}));

const FreeChip = styled(Chip)(({ theme }) => ({
  background: 'linear-gradient(135deg, #DBEAFE 0%, #93C5FD 100%)',
  color: '#1E40AF',
  fontWeight: 700,
  fontSize: '0.85rem',
  boxShadow: '0 2px 8px rgba(147, 197, 253, 0.3)',
}));

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: '12px',
};


const CourseCard: React.FC<CourseCardProps> = ({ course, onPurchaseSuccess }) => {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'info'
  });
  const [isShareModalOpen, setIsShareModalOpen] = useState(false); // <-- State for Modal

  const progress = course.progress?.completionPercentage || 0;

  // --- Modal Handlers ---
  const handleOpenShareModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsShareModalOpen(true);
  };
  const handleCloseShareModal = () => setIsShareModalOpen(false);

  // --- Snackbar Handlers ---
  const showSnackbar = (message: string, severity: SnackbarState['severity'] = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // --- Razorpay and other existing hooks ---
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          setIsRazorpayLoaded(true);
          resolve(true);
          return;
        }
        const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
        if (existingScript) {
          existingScript.addEventListener('load', () => {
            setIsRazorpayLoaded(true);
            resolve(true);
          });
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => { setIsRazorpayLoaded(true); resolve(true); };
        script.onerror = () => { resolve(false); };
        document.head.appendChild(script);
      });
    };
    loadRazorpayScript();
  }, []);

  const handlePayment = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isProcessingPayment) return;
    if (!isRazorpayLoaded) {
      showSnackbar('Payment system is loading. Please try again.', 'warning');
      return;
    }
    setIsProcessingPayment(true);

    try {
      // Step 1: Securely create an order on the backend.
      const order = await CourseService.createCourseOrder(course._id);

      // Step 2: Configure Razorpay checkout with the secure order_id from our server.
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use the public key here
        amount: order.amount,       // Amount is from the server-created order
        currency: order.currency,   // Currency is from the server-created order
        name: 'ACD STAR CLUB',
        description: `Purchase: ${course.title}`,
        order_id: order.id,         // This is the crucial part
        image: course.coverImage || '/logo.png',

        // Step 3: This handler is called by Razorpay upon successful payment.
        handler: async function (response: any) {
          try {
            // Step 4: Send the payment details to our backend for cryptographic verification.
            const verificationPayload = {
              courseId: course._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            await CourseService.verifyCoursePayment(verificationPayload);

            // Step 5: If verification succeeds, show success and refresh the parent component.
            showSnackbar('Course purchased successfully! 🎉', 'success');
            if (onPurchaseSuccess) onPurchaseSuccess();

          } catch (error: any) {
            showSnackbar(error.message || 'Payment verification failed. Contact support.', 'error');
            setIsProcessingPayment(false); // Reset on verification failure
          }
        },
        // Pre-fill user info if available
        prefill: { name: '', email: '', contact: '' },
        notes: { course_id: course._id },
        theme: { color: '#F59E0B' },
        modal: {
          ondismiss: () => {
            // Reset the button if the user closes the payment modal without paying
            setIsProcessingPayment(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error: any) {
      showSnackbar(error.message || 'Failed to initiate payment. Please try again.', 'error');
      setIsProcessingPayment(false);
    }
    // Note: setIsProcessingPayment(false) is handled inside the modal's ondismiss and handler
  };



  // --- Share action handlers for Modal ---
  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/course/${course._id}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        showSnackbar('Course link copied to clipboard!', 'success');
      })
      .catch(() => {
        showSnackbar('Failed to copy link.', 'error');
      });
    handleCloseShareModal();
  };

  const handleShareToWhatsApp = () => {
    const courseUrl = `${window.location.origin}/course/${course._id}`;
    // Corrected the message typos
    const message = `Hey! I'm enjoying this course which is great. I am sharing it so you can join now: ${courseUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    handleCloseShareModal();
  };


  const CardContent = () => (
    <>
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-gray-100"
       style={{
        boxShadow: "rgba(60, 64, 67, 0.32) 0px 1px 2px, rgba(60, 64, 67, 0.15) 0px 2px 6px, rgba(0, 0, 0, 0.1) 0px 1px 8px",
        border: "1px solid rgb(228, 228, 228)"
      }}>
        {/* Course Image */}
        <div className="relative w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100">
          {course.coverImage ? (
            <img 
              src={course.coverImage}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-yellow-200">
              <span className="text-amber-800 text-lg font-semibold text-center px-4">{course.title}</span>
            </div>
          )}
          
         <Box className="absolute top-3 left-3">
            <Tooltip title="Share Course">
              <IconButton
                onClick={handleOpenShareModal} 
                size="small"
                sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.6)' }
                }}
              >
                <Share sx={{ color: 'white', fontSize: '1.1rem' }} />
              </IconButton>
            </Tooltip>
          </Box>

          <Box className="absolute top-3 right-3">
            {course.isPaid ? (
              <PriceChip 
                icon={<Star />} 
                label={`₹${course.price}`} 
                size="small"
              />
            ) : (
              <FreeChip 
                label="FREE" 
                size="small"
              />
            )}
          </Box>
        </div>
        
        {/* Course Content */}
        <div className="p-5 flex-grow flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{course.title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{course.description}</p>
          
          {/* Action Buttons */}
          <Box className="mt-auto">
            {course.needsPayment && (
              <YellowButton
                variant="contained"
                fullWidth
                onClick={handlePayment}
                disabled={isProcessingPayment || !isRazorpayLoaded}
                startIcon={isProcessingPayment ? <CircularProgress size={18} sx={{ color: '#92400E' }} /> : <ShoppingCart />}
                sx={{ mb: 1 }}
              >
                {isProcessingPayment 
                  ? 'Processing Payment...' 
                  : !isRazorpayLoaded 
                    ? 'Loading Payment...' 
                    : `Purchase for ₹${course.price}`
                }
              </YellowButton>
            )}
            {course.isAccessible && (
              <AccessButton
                variant="contained"
                fullWidth
                startIcon={<PlayArrow />}
                sx={{ mb: 1 }}
              >
                {course.isPaid ? 'Continue Learning' : 'Start Free Course'}
              </AccessButton>
            )}
          </Box>
        </div>
        
        {/* Progress Bar - only show for accessible courses */}
        {course.isAccessible && (
          <div className="px-5 pb-4">
            <div className="flex items-center justify-between mb-2">
              <Box display="flex" alignItems="center" gap={1}>
                <AccessTime sx={{ fontSize: '0.875rem', color: '#6B7280' }} />
                <span className="text-xs font-semibold text-gray-700">{progress}% Complete</span>
              </Box>
              <Chip 
                label={course.isPaid ? 'Purchased' : 'Free'} 
                size="small"
                sx={{
                  backgroundColor: course.isPaid ? '#FEF3C7' : '#DBEAFE',
                  color: course.isPaid ? '#92400E' : '#1E40AF',
                  fontSize: '0.75rem',
                  height: '20px'
                }}
              />
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-amber-500 h-2 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Locked indicator */}
        {!course.isAccessible && course.needsPayment && (
          <div className="px-5 pb-4">
            <Box display="flex" alignItems="center" justifyContent="center" className="text-gray-500 text-sm bg-gray-50 rounded-lg py-3">
              <Lock sx={{ fontSize: '1rem', marginRight: '0.5rem' }} />
              <span className="font-medium">Course Locked</span>
            </Box>
          </div>
        )}
      </div>

      {/* --- ADD THE SHARE MODAL --- */}
      <Modal
        open={isShareModalOpen}
        onClose={handleCloseShareModal}
        aria-labelledby="share-modal-title"
        aria-describedby="share-modal-description"
        slotProps={{
    backdrop: {
      onClick: (e) => {
        // Stop the click from reaching the underlying Link
        e.stopPropagation();
        
      },
    },
  }}
      >
        <Box sx={modalStyle} onClick={(e) => e.stopPropagation()}>
          <Typography id="share-modal-title" variant="h6" component="h2">
            Share this Course
          </Typography>
          <Typography id="share-modal-description" sx={{ mt: 2, mb: 3 }}>
            Share this course with your friends and colleagues!
          </Typography>
          <Stack spacing={2} direction="column">
            <Button
              variant="outlined"
              startIcon={<ContentCopy />}
              onClick={handleCopyLink}
            >
              Copy Link
            </Button>
            <Button
              variant="contained"
              startIcon={<WhatsApp />}
              onClick={handleShareToWhatsApp}
              sx={{ backgroundColor: '#25D366', '&:hover': { backgroundColor: '#1EBE56' } }}
            >
              Share on WhatsApp
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Snackbar for notifications - Kept your custom styling */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: '100%',
            '& .MuiAlert-message': {
              color: 'white',
            },
            '& .MuiAlert-icon': {
              color: 'white'
            },
            '& .MuiAlert-action .MuiIconButton-root': {
              color: 'white'
            },
            '&.MuiAlert-filledSuccess': {
              backgroundColor: '#2e7d32', 
            },
            '&.MuiAlert-filledError': {
              backgroundColor: '#d32f2f',
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );

  if (course.isAccessible) {
    return (
      <Link href={`/classroom/${course._id}`} className="block h-full">
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
};

export default CourseCard;