import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Schedule, Stats } from '../../../../hooks/types';
import { ScheduleService } from '../../../../services/ScheduleService';
import { StatsService } from '../../../../services/StatsService';

export const useHomeData = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [activeVisit, setActiveVisit] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [schedulesData, statsData] = await Promise.all([
        ScheduleService.getAllSchedules(),
        StatsService.getStats()
      ]);
      
      // Sort schedules consistently by date and time to prevent order changes
      const sortedSchedules = (schedulesData || []).sort((a: Schedule, b: Schedule) => {
        // First sort by date
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA.getTime() - dateB.getTime();
        }
        
        // If dates are the same, sort by start time
        const timeA = a.startTime;
        const timeB = b.startTime;
        return timeA.localeCompare(timeB);
      });
      
      setSchedules(sortedSchedules);
      setStats(statsData);
      
      // Find active visit
      const inProgress = sortedSchedules.find((s: Schedule) => s.status === 'in-progress');
      setActiveVisit(inProgress || null);
    } catch (error) {
      console.error('Error loading data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleClockIn = async (scheduleId: string) => {
    try {
      const clickTimestamp = new Date().toISOString();
      console.log('[DEBUG] Clock-in timestamp captured at button click:', clickTimestamp);
      await ScheduleService.startVisit(scheduleId);
      loadData();
    } catch (error) {
      console.error('Error starting visit:', error);
      alert(error instanceof Error ? error.message : 'Error starting visit. Please try again.');
    }
  };

  const handleClockOut = async (schedule: Schedule) => {
    try {
      const clickTimestamp = new Date().toISOString();
      console.log('[DEBUG] Clock-out timestamp captured at button click:', clickTimestamp);
      await ScheduleService.endVisit(schedule.id);
      loadData();
      navigate(`/schedules/clock-out/${schedule.id}`);
    } catch (error) {
      console.error('Error ending visit:', error);
      alert(error instanceof Error ? error.message : 'Error ending visit. Please try again.');
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
    loadData,
    handleClockIn,
    handleClockOut
  };
};