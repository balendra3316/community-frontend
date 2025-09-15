import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";


interface AttendanceState {
  hasAttended: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}


const initialState: AttendanceState = {
  hasAttended: false,
  status: 'idle', // 'idle' means we haven't tried to fetch the data yet
  error: null,
};


export const checkAttendanceStatus = createAsyncThunk(
  'attendance/checkStatus', // Action type name
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/attendance/check`, { withCredentials: true });
      return response.data.hasAttended; // This becomes the `action.payload` on success
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to check attendance');
    }
  }
);


export const markUserAttendance = createAsyncThunk(
  'attendance/mark', // Action type name
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(`${API_URL}/attendance/mark-starclub`, {}, { withCredentials: true });
      return true; // We return `true` to confirm success.
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to mark attendance');
    }
  }
);


const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    // We can add standard reducers here if needed, but for async, we use extraReducers.
  },
  
  extraReducers: (builder) => {
    builder
      // Cases for checking the status
      .addCase(checkAttendanceStatus.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(checkAttendanceStatus.fulfilled, (state, action: PayloadAction<boolean>) => {
        state.status = 'succeeded';
        state.hasAttended = action.payload; // Update state with data from the API
      })
      .addCase(checkAttendanceStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Cases for marking attendance
      .addCase(markUserAttendance.pending, (state) => {
        
        state.status = 'loading'; 
      })
      .addCase(markUserAttendance.fulfilled, (state) => {
        state.status = 'succeeded';
      
        
        state.hasAttended = true; 
      })
      .addCase(markUserAttendance.rejected, (state, action) => {
        state.status = 'failed';
        state.hasAttended = false;
        state.error = action.payload as string;
      });
  },
});

export default attendanceSlice.reducer;
