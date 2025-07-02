import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Schedule } from '../../hooks/types';
import { scheduleAPI } from '../../services/api';
import { getCurrentLocation } from '../../utils/geolocation';

interface ScheduleState {
  schedules: Schedule[];
  activeVisit: Schedule | null;
  loading: boolean;
  error: string | null;
}

const initialState: ScheduleState = {
  schedules: [],
  activeVisit: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchSchedules = createAsyncThunk(
  'schedules/fetchSchedules',
  async (_, { rejectWithValue }) => {
    try {
      const response = await scheduleAPI.getAll();
      // Backend returns {schedules: [...]} structure
      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch schedules');
    }
  }
);

export const startVisit = createAsyncThunk(
  'schedules/startVisit',
  async (scheduleId: string, { rejectWithValue }) => {
    try {
      const clickTimestamp = new Date().toISOString();
      console.log('[DEBUG] Redux startVisit timestamp captured:', clickTimestamp);
      const { latitude, longitude, address } = await getCurrentLocation(clickTimestamp);
      const locationData = { latitude, longitude, address, timestamp: clickTimestamp };
      await scheduleAPI.startVisit(scheduleId, locationData);
      return scheduleId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to start visit');
    }
  }
);

export const endVisit = createAsyncThunk(
  'schedules/endVisit',
  async (scheduleId: string, { rejectWithValue }) => {
    try {
      const clickTimestamp = new Date().toISOString();
      console.log('[DEBUG] Redux endVisit timestamp captured:', clickTimestamp);
      const { latitude, longitude, address } = await getCurrentLocation(clickTimestamp);
      const locationData = { latitude, longitude, address, timestamp: clickTimestamp };
      await scheduleAPI.endVisit(scheduleId, locationData);
      return scheduleId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to end visit');
    }
  }
);

const scheduleSlice = createSlice({
  name: 'schedules',
  initialState,
  reducers: {
    setActiveVisit: (state, action: PayloadAction<Schedule | null>) => {
      state.activeVisit = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch schedules
      .addCase(fetchSchedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchedules.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules = action.payload || [];
        // Find active visit
        const inProgress = action.payload?.find((s: Schedule) => s.status === 'in-progress');
        state.activeVisit = inProgress || null;
      })
      .addCase(fetchSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Start visit
      .addCase(startVisit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startVisit.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(startVisit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // End visit
      .addCase(endVisit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(endVisit.fulfilled, (state) => {
        state.loading = false;
        state.activeVisit = null;
      })
      .addCase(endVisit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setActiveVisit, clearError } = scheduleSlice.actions;
export default scheduleSlice.reducer;