// "use client";

// import React, { useEffect } from 'react';
// import { useAuth } from '@/context/AuthContext'; // Adjust path
// import { useRouter } from 'next/navigation';
// import Script from 'next/script';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '@/lib/Store'; // Adjust path
// import { createRazorpayOrder, verifyRazorpayPayment, resetPaymentStatus } from '@/lib/PaymenSlice'; // Adjust path
// import { unwrapResult } from '@reduxjs/toolkit';
// import { Paper, Typography, Button, CircularProgress } from '@mui/material';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// import NotificationSnackbar, { SnackbarState } from '@/components/shared/NotificationSnackbar'; // Adjust path

// declare global {
//     interface Window { Razorpay: any; }
// }

// const benefits = [
//     "Log unlimited practice sessions",
//     "Track your progress with detailed stats",
//     "Maintain your practice streak",
//     "Earn exclusive badges",
//     "Access to all future premium features"
// ];

// export default function SubscribePage() {
//     const { user, updateUserSubscription } = useAuth();
//     const router = useRouter();
//     const dispatch = useDispatch<AppDispatch>();
//     const { status: paymentStatus, error: paymentError } = useSelector((state: RootState) => state.payment); // Get status from Redux
    
//     const [snackbar, setSnackbar] = React.useState<SnackbarState>({ open: false, message: '', severity: 'success' });
    
//     // Reset status when the component unmounts
//     useEffect(() => {
//         return () => {
//             dispatch(resetPaymentStatus());
//         }
//     }, [dispatch]);
    
//     const handlePayment = async () => {
//         if (!user) {
//             setSnackbar({ open: true, message: 'You must be logged in to subscribe.', severity: 'error' });
//             return;
//         }

//         try {
//             // Step 1: Dispatch action to create an order
//             const order = await dispatch(createRazorpayOrder()).unwrap();

//             // Step 2: Configure and open Razorpay checkout
//             const options = {
//                 key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//                 amount: order.amount,
//                 currency: "INR",
//                 name: "ACD LMS Subscription",
//                 description: "Journal & Progress Tracking - Monthly",
//                 order_id: order.id,
//                 handler: async function (response: any) {
//                     // Step 3: Dispatch action to verify the payment
//                     try {
//                         const resultAction = await dispatch(verifyRazorpayPayment({
//                             razorpay_payment_id: response.razorpay_payment_id,
//                             razorpay_order_id: response.razorpay_order_id,
//                             razorpay_signature: response.razorpay_signature,
//                         }));
//                         const result = unwrapResult(resultAction);

//                         // Step 4: Update the AuthContext and redirect
//                         updateUserSubscription(result.user);
//                         setSnackbar({ open: true, message: result.message, severity: 'success' });
//                         router.push('/journal');
//                     } catch (error: any) {
//                          setSnackbar({ open: true, message: error || 'Payment verification failed.', severity: 'error' });
//                     }
//                 },
//                 prefill: {
//                     name: user.name,
//                     email: user.email,
//                 },
//                 theme: {
//                     color: "#3b82f6",
//                 },
//             };

//             const rzp = new window.Razorpay(options);
//             rzp.open();

//         } catch (error: any) {
//             setSnackbar({ open: true, message: error || 'Could not initiate payment.', severity: 'error' });
//         }
//     };

//     return (
//         <>
//             <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
            
//             <NotificationSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />

//             <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//                 <Paper elevation={3} className="max-w-md w-full p-6 sm:p-8 rounded-lg">
//                     <div className="text-center">
//                         <Typography variant="h4" component="h1" className="font-bold text-gray-800">
//                             Go Pro
//                         </Typography>
//                         <Typography className="text-gray-500 mt-2">
//                             Unlock all features and accelerate your dance journey.
//                         </Typography>
//                     </div>

//                     <div className="my-8 text-center">
//                         <span className="text-5xl font-extrabold text-gray-900">₹99</span>
//                         <span className="text-xl font-medium text-gray-500">/month</span>
//                     </div>

//                     <div className="space-y-3 mb-8">
//                         {benefits.map((benefit, index) => (
//                             <div key={index} className="flex items-center">
//                                 <CheckCircleOutlineIcon color="primary" className="mr-3" />
//                                 <Typography variant="body1">{benefit}</Typography>
//                             </div>
//                         ))}
//                     </div>

//                     <Button
//                         variant="contained"
//                         color="primary"
//                         fullWidth
//                         onClick={handlePayment}
//                         disabled={paymentStatus === 'loading'}
//                         className="py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
//                     >
//                         {paymentStatus === 'loading' ? <CircularProgress size={24} color="inherit" /> : 'Subscribe Now'}
//                     </Button>
//                 </Paper>
//             </main>
//         </>
//     );
// }







"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/Store";
import { createRazorpayOrder, verifyRazorpayPayment, resetPaymentStatus } from "@/lib/PaymenSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import NotificationSnackbar, { SnackbarState } from "@/components/shared/NotificationSnackbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import Logo from "@/components/subcomNavbar/Logo";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const benefits = [
  "Log unlimited practice sessions",
  "Track your progress with detailed stats",
  "Maintain your practice streak",
  "Earn exclusive badges",
  "Access to all future premium features",
];

export default function SubscribePage() {
  const { user, updateUserSubscription } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { status: paymentStatus } = useSelector((state: RootState) => state.payment);

  const [snackbar, setSnackbar] = React.useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    return () => {
      dispatch(resetPaymentStatus());
    };
  }, [dispatch]);

  const handlePayment = async () => {
    if (!user) {
      setSnackbar({ open: true, message: "You must be logged in to subscribe.", severity: "error" });
      return;
    }

    try {
      const order = await dispatch(createRazorpayOrder()).unwrap();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "ACD LMS Subscription",
        description: "Journal & Progress Tracking - Monthly",
        order_id: order.id,
        handler: async function (response: any) {
          try {
            const resultAction = await dispatch(
              verifyRazorpayPayment({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              })
            );
            const result = unwrapResult(resultAction);

            updateUserSubscription(result.user);
            setSnackbar({ open: true, message: result.message, severity: "success" });
            router.push("/journal");
          } catch (error: any) {
            setSnackbar({ open: true, message: error || "Payment verification failed.", severity: "error" });
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#3b82f6",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      setSnackbar({ open: true, message: error || "Could not initiate payment.", severity: "error" });
    }
  };

  return (
    <>
    <ProtectedRoute>
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
      <NotificationSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />

      <main className="min-h-screen bg-gradient-to-b from-blue-50 via-emerald-50 to-indigo-50 flex items-center justify-center p-4">
        <section className="w-full max-w-md">
          {/* Card */}
          <div className="rounded-2xl border border-blue-100 bg-white/80 backdrop-blur shadow-sm">
            {/* Header */}
            <div className="px-6 sm:px-8 pt-6 sm:pt-8 text-center">

              <div className="flex items-center justify-center gap-2 mb-2">
    <img
      src="/logo acd.png"
      alt="Anyone Can Dance"
      className="h-9 w-auto object-contain"
      loading="lazy"
    />
    <span className="text-base sm:text-lg font-semibold text-slate-700 hidden sm:inline">
      Anyone Can Dance
    </span>
  </div>
              <h1 className="text-3xl font-bold text-slate-900">Go Pro</h1>
              <p className="text-slate-600 mt-2">
                Unlock all features and accelerate a dance journey.
              </p>
            </div>

            {/* Price */}
            <div className="px-6 sm:px-8 mt-8 text-center">
              <span className="text-5xl font-extrabold text-slate-900">₹99</span>
              <span className="text-xl font-medium text-slate-500">/month</span>
            </div>

            {/* Benefits */}
            <div className="px-6 sm:px-8 my-8 space-y-3">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
                  >
                    ✓
                  </span>
                  <p className="text-slate-800">{benefit}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="px-6 sm:px-8 pb-6 sm:pb-8">
              <button
                type="button"
                onClick={handlePayment}
                disabled={paymentStatus === "loading"}
                className="w-full inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-white font-semibold shadow-sm hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {paymentStatus === "loading" ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
                    Processing...
                  </span>
                ) : (
                  "Subscribe Now"
                )}
              </button>
            </div>

            {/* Decorative footer stripe */}
            <div className="h-2 bg-gradient-to-r from-blue-200 via-emerald-200 to-indigo-200 rounded-b-2xl" />
          </div>
        </section>
      </main>
      </ProtectedRoute>
    </>
  );
}



