import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchSchedules, startVisit, endVisit } from '../store/slices/scheduleSlice';
import { addNotification } from '../store/slices/uiSlice';
import { ScheduleFilters, ScheduleSort } from '../models/Schedule';
import { ScheduleService } from '../services/ScheduleService';

export const useScheduleListViewModel = () => {
  const dispatch = useAppDispatch();
  const { schedules, loading, error } = useAppSelector(state => state.schedules);
  
  const [filters, setFilters] = useState<ScheduleFilters>({});
  const [sort, setSort] = useState<ScheduleSort>({
    field: 'date',
    direction: 'asc'
  });
  const [searchQuery, setSearchQuery] = useState('');

  const loadSchedules = useCallback(async () => {
    try {
      await dispatch(fetchSchedules()).unwrap();
    } catch (error) {
      dispatch(addNotification({
        message: 'Failed to load schedules',
        type: 'error'
      }));
    }
  }, [dispatch]);

  const handleClockIn = useCallback(async (scheduleId: string) => {
    try {
      await dispatch(startVisit(scheduleId)).unwrap();
      await dispatch(fetchSchedules()).unwrap();
      dispatch(addNotification({
        message: 'Visit started successfully',
        type: 'success'
      }));
    } catch (error) {
      dispatch(addNotification({
        message: error as string,
        type: 'error'
      }));
    }
  }, [dispatch]);

  const handleClockOut = useCallback(async (scheduleId: string) => {
    try {
      await dispatch(endVisit(scheduleId)).unwrap();
      await dispatch(fetchSchedules()).unwrap();
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
  }, [dispatch]);

  const filteredAndSortedSchedules = useMemo(() => {
    let result = [...schedules];
    
    // Apply search
    if (searchQuery) {
      result = result.filter(schedule => 
        schedule.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        schedule.serviceName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply filters
    result = ScheduleService.filterSchedules(result, filters);
    
    // Apply sorting
    result = ScheduleService.sortSchedules(result, sort);
    
    return result;
  }, [schedules, filters, sort, searchQuery]);

  const getStatusText = useCallback((status: string): string => {
    return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }, []);

  const getStatusColor = useCallback((status: string): string => {
    switch (status) {
      case 'completed': return '#2E7D32';
      case 'in-progress': return '#ED6C02';
      case 'missed': return '#616161';
      case 'cancelled': return '#D32F2F';
      case 'scheduled':
      default:
        return '#616161';
    }
  }, []);

  const updateFilters = useCallback((newFilters: Partial<ScheduleFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const updateSort = useCallback((newSort: Partial<ScheduleSort>) => {
    setSort(prev => ({
      ...prev,
      ...newSort,
      direction: newSort.field && prev.field === newSort.field && prev.direction === 'asc' ? 'desc' : newSort.direction || 'asc'
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchQuery('');
  }, []);

  const getSchedulesByStatus = useCallback((status: string) => {
    return schedules.filter(schedule => schedule.status === status);
  }, [schedules]);

  const getScheduleStats = useMemo(() => {
    const total = schedules.length;
    const completed = schedules.filter(s => s.status === 'completed').length;
    const inProgress = schedules.filter(s => s.status === 'in-progress').length;
    const scheduled = schedules.filter(s => s.status === 'scheduled').length;
    const missed = schedules.filter(s => s.status === 'missed').length;
    
    return {
      total,
      completed,
      inProgress,
      scheduled,
      missed,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }, [schedules]);

  const updateSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  return {
    // State
    schedules: filteredAndSortedSchedules,
    allSchedules: schedules,
    loading,
    error,
    filters,
    sort,
    searchQuery,
    scheduleStats: getScheduleStats,
    
    // Actions
    loadSchedules,
    handleClockIn,
    handleClockOut,
    updateFilters,
    updateSort,
    clearFilters,
    setSearchQuery,
    updateSearchQuery,
    
    // Utilities
    getStatusText,
    getStatusColor,
    getSchedulesByStatus,
    getScheduleStats,
  };
};