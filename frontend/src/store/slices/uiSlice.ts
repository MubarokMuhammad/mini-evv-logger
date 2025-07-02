import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  timer: string;
  notifications: {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  }[];
  isLoading: boolean;
}

const initialState: UIState = {
  timer: '00:00:00',
  notifications: [],
  isLoading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTimer: (state, action: PayloadAction<string>) => {
      state.timer = action.payload;
    },
    addNotification: (state, action: PayloadAction<{
      message: string;
      type: 'success' | 'error' | 'info' | 'warning';
    }>) => {
      const notification = {
        id: Date.now().toString(),
        ...action.payload,
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  setTimer,
  addNotification,
  removeNotification,
  setLoading,
  clearNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;