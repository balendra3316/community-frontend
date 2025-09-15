import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import notificationService, { Notification } from '@/services/notification.service';


interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed'; // For the full list
  countStatus: 'idle' | 'loading' | 'succeeded' | 'failed'; // For the initial count
  error: string | null;
}

// --- WHY: Define the initial state ---
const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  status: 'idle',
  countStatus: 'idle',
  error: null,
};

// --- ASYNC THUNKS (The "Employees") ---

export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const count = await notificationService.getUnreadCount();
      return count;
    } catch (error) {
      return rejectWithValue('Failed to fetch unread count.');
    }
  }
);

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const notifications = await notificationService.getNotifications();
      return notifications;
    } catch (error) {
      return rejectWithValue('Failed to load notifications.');
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId: string, { dispatch, rejectWithValue }) => {
    try {
      await notificationService.markAsRead(notificationId);
      // After success, we refetch the count to be sure, though the socket also handles this.
      dispatch(fetchUnreadCount()); 
      return notificationId;
    } catch (error) {
      return rejectWithValue('Failed to mark notification as read.');
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await notificationService.markAllAsRead();
      return;
    } catch (error) {
      return rejectWithValue('Failed to mark all as read.');
    }
  }
);

// --- THE SLICE (The "Department") ---

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  // --- WHY: Reducers for direct, synchronous state changes (like from a socket!) ---
  // These are our tools to let the socket directly update the Redux state.
  reducers: {
    updateUnreadCountFromSocket: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    resetNotificationsStatus: (state) => {
      state.status = 'idle';
    },
  },
  // --- WHY: `extraReducers` for our async thunks ---
  // This is the "manager" listening for reports from the "employees" (our thunks).
  extraReducers: (builder) => {
    builder
      // Cases for fetching the initial count
      .addCase(fetchUnreadCount.pending, (state) => {
        state.countStatus = 'loading';
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.countStatus = 'succeeded';
        state.unreadCount = action.payload;
      })
      .addCase(fetchUnreadCount.rejected, (state) => {
        state.countStatus = 'failed';
      })
      // Cases for fetching the full notification list
      .addCase(fetchNotifications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Case for successfully marking ONE notification as read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notificationId = action.payload;
        const notification = state.notifications.find(n => n._id === notificationId);
        if (notification) {
          notification.read = true;
        }
        // The unreadCount is updated via the `fetchUnreadCount` dispatch in the thunk
      })
      // Case for successfully marking ALL notifications as read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach(n => { n.read = true; });
        state.unreadCount = 0;
      });
  },
});

// Export the reducer and the new socket action
export const { updateUnreadCountFromSocket , resetNotificationsStatus} = notificationSlice.actions;
export default notificationSlice.reducer;