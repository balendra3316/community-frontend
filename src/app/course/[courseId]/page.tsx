'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { CourseService, CourseAccessDetails, PublicCourse } from '@/services/courseService';
import { CircularProgress, Alert, Snackbar } from '@mui/material';
import { ShoppingCart, PlayArrow, Login } from '@mui/icons-material';
import NavBar from '@/components/Navbar';
// Import your new styled buttons
import { YellowButton, AccessButton } from '@/components/ui/StyledButtons'; 

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Define a clear interface for the Snackbar state
interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

type CourseData = PublicCourse | CourseAccessDetails;

export default function CourseSharePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  
  const { user, loading: authLoading } = useAuth();
  
  const [course, setCourse] = useState<CourseData | null>(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // Use the SnackbarState interface here to fix the TypeScript errors
  const [snackbar, setSnackbar] = useState<SnackbarState>({ open: false, message: '', severity: 'info' });

  const fetchCourseData = useCallback(async () => {
    setPageLoading(true);
    setError(null);
    try {
      let data;
      if (user) {
        data = await CourseService.getCourseAccessDetails(courseId);
        if (data) setIsPurchased(data.isPurchased);
      } else {
        data = await CourseService.getPublicCourse(courseId);
      }
      
      if (data) {
        setCourse(data);
      } else {
        setError("Course not found or is no longer available.");
      }
    } catch (err) {
      setError("An error occurred while fetching course details.");
    } finally {
      setPageLoading(false);
    }
  }, [courseId, user]);

  useEffect(() => {
    if (!authLoading && courseId) {
      fetchCourseData();
    }
  }, [authLoading, courseId, fetchCourseData]);
  
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.head.appendChild(script);
  }, []);

  const handlePayment = async () => {
    if (!course || !course.isPaid || !user) return;
    
    setIsProcessingPayment(true);
    try {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: course.price * 100,
        currency: 'INR',
        name: 'Course Purchase',
        description: `Purchase: ${course.title}`,
        image: course.coverImage,
        handler: async (response: any) => {
          try {
            const paymentData = {
              courseId: course._id,
              paymentAmount: course.price,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            };
            await CourseService.purchaseCourse(paymentData);
            setSnackbar({ open: true, message: 'Purchase successful! You now have access.', severity: 'success' });
            setIsPurchased(true);
          } catch (verifyError: any) {
             setSnackbar({ open: true, message: `Payment verification failed: ${verifyError.message}`, severity: 'error' });
          } finally {
            setIsProcessingPayment(false);
          }
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: '#F59E0B' },
        modal: { ondismiss: () => setIsProcessingPayment(false) }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (initError) {
      setSnackbar({ open: true, message: 'Failed to initiate payment. Please try again.', severity: 'error' });
      setIsProcessingPayment(false);
    }
  };

  const renderActionButton = () => {
    if (!course) return null;

    if (!user) {
      return (
        // Use YellowButton for consistency
        <YellowButton variant="contained" startIcon={<Login />} onClick={() => router.push('/')}>
          Login to Enroll
        </YellowButton>
      );
    }

    if (!course.isPaid || isPurchased) {
      return (
        // Use AccessButton for the "go to course" action
        <AccessButton variant="contained" startIcon={<PlayArrow />} onClick={() => router.push(`/classroom/${course._id}`)}>
          {isPurchased ? 'Continue Learning' : 'Start Free Course'}
        </AccessButton>
      );
    }
    
    if (course.isPaid && !isPurchased) {
      return (
        // Use YellowButton for the purchase action
        <YellowButton 
          variant="contained"
          startIcon={isProcessingPayment ? <CircularProgress size={20} color="inherit" /> : <ShoppingCart />}
          onClick={handlePayment}
          disabled={isProcessingPayment}
        >
          {isProcessingPayment ? 'Processing...' : `Buy Now for ₹${course.price}`}
        </YellowButton>
      );
    }
    
    return null;
  };

  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-gray-50 pt-[100px] flex items-center justify-center p-4">
        {pageLoading || authLoading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error" className="w-full max-w-2xl">{error}</Alert>
        ) : course ? (
          <div 
            className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full md:flex"
            // Add the same styling as the Course Card
            style={{
              boxShadow: "rgba(60, 64, 67, 0.32) 0px 1px 2px, rgba(60, 64, 67, 0.15) 0px 2px 6px, rgba(0, 0, 0, 0.1) 0px 1px 8px",
              border: "1px solid rgb(228, 228, 228)"
            }}
          >
            <div className="md:w-1/2">
              <img className="h-64 w-full object-cover md:h-full" src={course.coverImage || '/placeholder.png'} alt={course.title} />
            </div>
            <div className="p-8 md:w-1/2 flex flex-col justify-between">
              <div>
                <div className="uppercase tracking-wide text-sm text-yellow-600 font-semibold">
                  {course.isPaid ? `Price: ₹${course.price}` : 'Free Course'}
                </div>
                <h1 className="block mt-1 text-3xl leading-tight font-extrabold text-black">{course.title}</h1>
                <p className="mt-4 text-gray-600">{course.description}</p>
              </div>
              <div className="mt-8">
                {renderActionButton()}
              </div>
            </div>
          </div>
        ) : null}
      </main>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar(prev => ({...prev, open: false}))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert 
          onClose={() => setSnackbar(prev => ({...prev, open: false}))} 
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
}