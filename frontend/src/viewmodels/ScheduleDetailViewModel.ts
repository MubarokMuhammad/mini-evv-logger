import { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchSchedules, startVisit, endVisit } from '../store/slices/scheduleSlice';
import { addNotification } from '../store/slices/uiSlice';
import { Schedule, Task } from '../models/Schedule';
import { ScheduleService } from '../services/ScheduleService';

export const useScheduleDetailViewModel = (scheduleId: string) => {
  const dispatch = useAppDispatch();
  const { schedules, loading } = useAppSelector(state => state.schedules);
  
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const loadSchedule = useCallback(async () => {
    try {
      const scheduleData = await ScheduleService.getScheduleById(scheduleId);
      setSchedule(scheduleData);
      setTasks(scheduleData.tasks || []);
      setNotes(scheduleData.notes || '');
    } catch (error) {
      dispatch(addNotification({
        message: 'Failed to load schedule details',
        type: 'error'
      }));
    }
  }, [scheduleId, dispatch]);

  const handleClockIn = useCallback(async () => {
    if (!schedule) return false;
    
    try {
      await dispatch(startVisit(schedule.id)).unwrap();
      await loadSchedule();
      dispatch(addNotification({
        message: 'Visit started successfully',
        type: 'success'
      }));
      return true;
    } catch (error) {
      dispatch(addNotification({
        message: error as string,
        type: 'error'
      }));
      return false;
    }
  }, [schedule, dispatch, loadSchedule]);

  const handleClockOut = useCallback(async () => {
    if (!schedule) return false;
    
    try {
      await dispatch(endVisit(schedule.id)).unwrap();
      await loadSchedule();
      dispatch(addNotification({
        message: 'Visit ended successfully',
        type: 'success'
      }));
      return true;
    } catch (error) {
      dispatch(addNotification({
        message: error as string,
        type: 'error'
      }));
      return false;
    }
  }, [schedule, dispatch, loadSchedule]);

  const toggleTask = useCallback(async (taskId: string) => {
    if (!schedule) return;
    
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    
    setTasks(updatedTasks);
    
    try {
      setIsUpdating(true);
      await ScheduleService.updateTasks(schedule.id, updatedTasks);
      dispatch(addNotification({
        message: 'Task updated successfully',
        type: 'success'
      }));
    } catch (error) {
      // Revert on error
      setTasks(tasks);
      dispatch(addNotification({
        message: 'Failed to update task',
        type: 'error'
      }));
    } finally {
      setIsUpdating(false);
    }
  }, [schedule, tasks, dispatch]);

  const updateNotes = useCallback(async (newNotes: string) => {
    if (!schedule) return;
    
    setNotes(newNotes);
    
    try {
      setIsUpdating(true);
      await ScheduleService.addNotes(schedule.id, newNotes);
      dispatch(addNotification({
        message: 'Notes updated successfully',
        type: 'success'
      }));
    } catch (error) {
      dispatch(addNotification({
        message: 'Failed to update notes',
        type: 'error'
      }));
    } finally {
      setIsUpdating(false);
    }
  }, [schedule, dispatch]);

  const getStatusText = useCallback((status: string) => {
    switch (status) {
      case 'scheduled': return 'Scheduled';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      case 'missed': return 'Missed';
      default: return status;
    }
  }, []);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'scheduled': return '#616161';
      case 'in-progress': return '#ED6C02';
      case 'completed': return '#2E7D32';
      case 'cancelled': return '#D32F2F';
      case 'missed': return '#616161';
      default: return '#eee';
    }
  }, []);

  const getCompletedTasksCount = useCallback(() => {
    return tasks.filter(task => task.completed).length;
  }, [tasks]);

  const getTaskCompletionPercentage = useCallback(() => {
    if (tasks.length === 0) return 0;
    return Math.round((getCompletedTasksCount() / tasks.length) * 100);
  }, [tasks, getCompletedTasksCount]);

  const canClockIn = useCallback(() => {
    return schedule?.status === 'scheduled';
  }, [schedule]);

  const canClockOut = useCallback(() => {
    return schedule?.status === 'in-progress';
  }, [schedule]);

  const isVisitActive = useCallback(() => {
    return schedule?.status === 'in-progress';
  }, [schedule]);

  const isVisitCompleted = useCallback(() => {
    return schedule?.status === 'completed';
  }, [schedule]);

  const handleToggleTask = useCallback(async (taskId: string) => {
    await toggleTask(taskId);
  }, [toggleTask]);

  const handleUpdateNotes = useCallback(async (newNotes: string) => {
    await updateNotes(newNotes);
  }, [updateNotes]);

  const getTotalTasksCount = useCallback(() => {
    return tasks.length;
  }, [tasks]);

  const getCompletionPercentage = useCallback(() => {
    return getTaskCompletionPercentage();
  }, [getTaskCompletionPercentage]);

  // Load schedule on mount and when scheduleId changes
  useEffect(() => {
    if (scheduleId) {
      loadSchedule();
    }
  }, [scheduleId, loadSchedule]);

  // Update schedule from Redux store if available
  useEffect(() => {
    const scheduleFromStore = schedules.find(s => s.id === scheduleId);
    if (scheduleFromStore && (!schedule || schedule.status !== scheduleFromStore.status)) {
      setSchedule(scheduleFromStore);
    }
  }, [schedules, scheduleId, schedule]);

  return {
    // State
    schedule,
    tasks,
    notes,
    loading: loading || isUpdating,
    error: null,
    
    // Actions
    handleClockIn,
    handleClockOut,
    toggleTask,
    updateNotes,
    loadSchedule,
    handleToggleTask,
    handleUpdateNotes,
    
    // Utilities
    getStatusText,
    getStatusColor,
    getCompletedTasksCount,
    getTaskCompletionPercentage,
    getTotalTasksCount,
    getCompletionPercentage,
    canClockIn,
    canClockOut,
    isVisitActive,
    isVisitCompleted,
  };
};