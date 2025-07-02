import { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchSchedules, startVisit, endVisit } from '../store/slices/scheduleSlice';
import { fetchStats } from '../store/slices/statsSlice';
import { setTimer } from '../store/slices/uiSlice';

declare global {
  namespace NodeJS {
    interface Timeout {}
  }
}

type TimerHandle = ReturnType<typeof setInterval>;

export const useHomeViewModel = () => {
  const dispatch = useAppDispatch();
  const { schedules, activeVisit, loading, error } = useAppSelector(state => state.schedules);
  const { stats } = useAppSelector(state => state.stats);
  const { timer } = useAppSelector(state => state.ui);
  
  const [timerInterval, setTimerInterval] = useState<TimerHandle | null>(null);

  const loadData = useCallback(async () => {
    await Promise.all([
      dispatch(fetchSchedules()),
      dispatch(fetchStats())
    ]);
  }, [dispatch]);

  const startTimer = useCallback(() => {
    if (activeVisit?.startTime) {
      const interval = setInterval(() => {
        const startTime = new Date(activeVisit.startTime).getTime();
        const currentTime = new Date().getTime();
        const elapsed = Math.floor((currentTime - startTime) / 1000);
        
        const hours = Math.floor(elapsed / 3600);
        const minutes = Math.floor((elapsed % 3600) / 60);
        const seconds = elapsed % 60;
        
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        dispatch(setTimer(timeString));
      }, 1000);
      
      setTimerInterval(interval);
    }
  }, [activeVisit, dispatch]);

  const stopTimer = useCallback(() => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
      dispatch(setTimer('00:00:00'));
    }
  }, [timerInterval, dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (activeVisit && !timerInterval) {
      startTimer();
    } else if (!activeVisit && timerInterval) {
      stopTimer();
    }
  }, [activeVisit, timerInterval, startTimer, stopTimer]);

  const getTodaySchedules = () => {
    // Format: "Wed, 2 Jul 2025" (matching backend format exactly)
    const today = new Date();
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const todayString = `${weekdays[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
    
    return schedules.filter(schedule => {
      return schedule.date === todayString;
    });
  };

  const handleClockIn = async (scheduleId: string) => {
    try {
      await dispatch(startVisit(scheduleId)).unwrap();
      await loadData();
    } catch (error) {
      console.error('Failed to clock in:', error);
    }
  };

  const handleClockOut = async (scheduleId: string) => {
    try {
      await dispatch(endVisit(scheduleId)).unwrap();
      await loadData();
      return true;
    } catch (error) {
      console.error('Failed to clock out:', error);
      return false;
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'scheduled': return 'Scheduled';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'scheduled': return '#1976D2';
      case 'in-progress': return '#ff7f50';
      case 'completed': return '#2E7D32';
      case 'cancelled': return '#d32f2f';
      default: return '#666';
    }
  };

  return {
    schedules: getTodaySchedules().slice(0, 5), // Show only first 5 today's schedules for homepage
    activeVisit,
    stats,
    timer,
    loading,
    error,
    handleClockIn,
    handleClockOut,
    getStatusText,
    getStatusColor,
  };
};