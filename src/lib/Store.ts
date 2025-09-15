import { configureStore } from '@reduxjs/toolkit';
import attendanceReducer from './AttendanceSlice';
import notificationReducer from './NotificationSlice'


export const store = configureStore({
  
  reducer: {
    attendance: attendanceReducer,
    notifications: notificationReducer,
    // You can add other reducers here for other features
    // user: userReducer,
    // posts: postsReducer,
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
