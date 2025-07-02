import { useState, useEffect } from 'react';
import { scheduleAPI, statsAPI } from '../../../../services/api';
import { Schedule, Stats } from '../../../../hooks/types';

export const useDashboardData = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [activeVisit, setActiveVisit] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [schedulesRes, statsRes] = await Promise.all([
        scheduleAPI.getAll(),
        statsAPI.get()
      ]);
      
      const schedules = schedulesRes.data.data || [];
      const sortedSchedules = schedules.sort((a: Schedule, b: Schedule) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA.getTime() - dateB.getTime();
        }
        return a.startTime.localeCompare(b.startTime);
      });
      
      setSchedules(sortedSchedules);
      setStats(statsRes.data.data || {});
      
      const inProgress = schedules.find((s: Schedule) => s.status === 'in-progress');
      setActiveVisit(inProgress || null);
    } catch (error) {
      console.error('Error loading data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Set up auto-refresh interval
    const refreshInterval = setInterval(() => {
      loadData();
    }, 30000);
    
    // Refresh data when window gains focus (user returns from another tab/page)
    const handleFocus = () => {
      loadData();
    };
    
    // Refresh data when page becomes visible again
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadData();
      }
    };
    
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(refreshInterval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return {
    schedules,
    stats,
    activeVisit,
    loading,
    error,
    loadData
  };
};