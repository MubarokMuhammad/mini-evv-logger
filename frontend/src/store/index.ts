import { configureStore } from '@reduxjs/toolkit';
import scheduleReducer from './slices/scheduleSlice';
import statsReducer from './slices/statsSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    schedules: scheduleReducer,
    stats: statsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;