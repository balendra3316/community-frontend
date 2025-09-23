import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axios'; // Use your configured axios instance
import { User } from '@/context/AuthContext'; // Import the User type from your context

// Define the types for our thunk payloads
interface VerifyPaymentPayload {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

interface VerifyPaymentResponse {
    message: string;
    user: User; // The API returns the updated user object
}

// Define the shape of our slice's state
interface PaymentState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: PaymentState = {
    status: 'idle',
    error: null,
};

// --- ASYNC THUNKS ---

export const createRazorpayOrder = createAsyncThunk(
    'payment/createOrder',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post('/subscriptions/create-order');
            return data; // This will be the Razorpay order object
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create order');
        }
    }
);

export const verifyRazorpayPayment = createAsyncThunk<VerifyPaymentResponse, VerifyPaymentPayload>(
    'payment/verifyPayment',
    async (paymentData, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post('/subscriptions/verify-payment', paymentData);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Payment verification failed');
        }
    }
);

// --- THE SLICE ---

const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        // A reducer to reset the status if needed, e.g., when the component unmounts
        resetPaymentStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle create order lifecycle
            .addCase(createRazorpayOrder.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(createRazorpayOrder.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(createRazorpayOrder.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            // Handle verify payment lifecycle
            .addCase(verifyRazorpayPayment.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(verifyRazorpayPayment.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(verifyRazorpayPayment.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    }
});

export const { resetPaymentStatus } = paymentSlice.actions;
export default paymentSlice.reducer;