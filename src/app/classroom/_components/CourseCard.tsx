'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Button, 
  CircularProgress, 
  Chip,
  Box,
  IconButton,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  ShoppingCart, 
  Lock, 
  PlayArrow, 
  Star,
  AccessTime
} from '@mui/icons-material';
import { Course, CourseService } from '../../../services/courseService';

// Declare Razorpay interface
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CourseCardProps {
  course: Course;
  onPurchaseSuccess?: () => void;
}

// Styled Material-UI Button with yellow variants
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

const CourseCard: React.FC<CourseCardProps> = ({ course, onPurchaseSuccess }) => {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const progress = course.progress?.completionPercentage || 0;

  // Load Razorpay script dynamically
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        // Check if Razorpay is already loaded
        if (window.Razorpay) {
          setIsRazorpayLoaded(true);
          resolve(true);
          return;
        }

        // Check if script is already in the document
        const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
        if (existingScript) {
          existingScript.addEventListener('load', () => {
            setIsRazorpayLoaded(true);
            resolve(true);
          });
          return;
        }

        // Create and load the script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
          setIsRazorpayLoaded(true);
          resolve(true);
        };
        script.onerror = () => {
          console.error('Failed to load Razorpay script');
          resolve(false);
        };
        document.head.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, []);

  const handlePayment = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isProcessingPayment) return;
    
    // Check if Razorpay is loaded
    if (!isRazorpayLoaded || !window.Razorpay) {
      alert('Payment system is still loading. Please try again in a moment.');
      return;
    }
    
    setIsProcessingPayment(true);

    try {
      // Create Razorpay options
      const options = {
        key: "rzp_live_Dj70XqJ0PkPgJY", // Your Razorpay key
        amount: course.price * 100, // Amount in paisa
        currency: 'INR',
        name: 'Course Purchase',
        description: `Purchase ${course.title}`,
        image: course.coverImage || '/logo.png',
        handler: async function (response: any) {
          try {
            console.log('Razorpay response:', response); // Debug log
            
            // Prepare payment data - ensure all required fields are present
            const paymentData = {
              courseId: course._id,
              paymentAmount: course.price, // Make sure this matches exactly
              razorpayOrderId: response.razorpay_order_id || `temp_order_${Date.now()}`,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature || 'temp_signature'
            };

            console.log('Sending payment data:', paymentData); // Debug log

            // Call your backend API to verify payment and grant access
            const purchaseResponse = await CourseService.purchaseCourse(paymentData);
            
            console.log('Purchase response:', purchaseResponse); // Debug log

            // Show success message
            alert('Course purchased successfully!');
            
            // Refresh the course list
            if (onPurchaseSuccess) {
              onPurchaseSuccess();
            }
          } catch (error:any) {
            console.error('Payment verification failed:', error);
            
            // More detailed error handling
            if (error instanceof Error) {
              console.error('Error message:', error.message);
            }
            
            // Try to parse the error response for more details
            try {
              const errorResponse = await error.response?.json?.();
              console.error('Server error response:', errorResponse);
              alert(`Payment verification failed: ${errorResponse?.message || 'Please contact support.'}`);
            } catch {
              alert('Payment verification failed. Please contact support.');
            }
          } finally {
            setIsProcessingPayment(false);
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        notes: {
          course_id: course._id,
          course_title: course.title
        },
        theme: {
          color: '#F59E0B'
        },
        modal: {
          ondismiss: function() {
            setIsProcessingPayment(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment initiation failed:', error);
      alert('Failed to initiate payment. Please try again.');
      setIsProcessingPayment(false);
    }
  };

  const CardContent = () => (
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
        
        {/* Price/Free Badge */}
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

        {/* Course Status Indicator */}
        {course.isAccessible && (
          <Box className="absolute top-3 left-3">
            <Tooltip title={course.isPaid ? "Purchased Course" : "Free Course"}>
              <IconButton 
                size="small" 
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' }
                }}
              >
                <PlayArrow sx={{ color: '#10B981', fontSize: '1.2rem' }} />
              </IconButton>
            </Tooltip>
          </Box>
        )}
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
              startIcon={
                isProcessingPayment ? (
                  <CircularProgress size={18} sx={{ color: '#92400E' }} />
                ) : (
                  <ShoppingCart />
                )
              }
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
      
      {/* Locked indicator for non-accessible courses */}
      {!course.isAccessible && course.needsPayment && (
        <div className="px-5 pb-4">
          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="center" 
            className="text-gray-500 text-sm bg-gray-50 rounded-lg py-3"
          >
            <Lock sx={{ fontSize: '1rem', marginRight: '0.5rem' }} />
            <span className="font-medium">Course Locked</span>
          </Box>
        </div>
      )}
    </div>
  );

  // If course is accessible, wrap with Link
  if (course.isAccessible) {
    return (
      <Link href={`/classroom/${course._id}`} className="block h-full">
        <CardContent />
      </Link>
    );
  }

  // If course is not accessible, don't wrap with Link
  return <CardContent />;
};

export default CourseCard;