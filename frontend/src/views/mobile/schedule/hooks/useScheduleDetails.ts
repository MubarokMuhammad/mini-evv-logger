import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { scheduleAPI } from '../../../../services/api';
import { getCurrentLocation } from '../../../../utils/geolocation';

interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

interface Task {
  id: string;
  name: string;
  description: string;
  completed: boolean;
}

interface Schedule {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceName: string;
  date: string;
  startTime: string;
  endTime: string;
  location: Location;
  status: string;
  tasks: Task[];
  serviceNotes: string;
  actualStartTime?: string;
  actualEndTime?: string;
  startLocation?: Location;
  endLocation?: Location;
}

export const useScheduleDetails = (id: string | undefined) => {
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clockingIn, setClockingIn] = useState(false);

  // Extract fetchSchedule function so it can be reused
  const fetchSchedule = useCallback(async () => {
    try {
      const response = await scheduleAPI.getById(id!);
      setSchedule(response.data.data);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      setError('Failed to fetch schedule');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchSchedule();
    }
  }, [id, fetchSchedule]);

  // Redirect to Clock-Out page if status is in-progress
  useEffect(() => {
    if (schedule && schedule.status === 'in-progress') {
      navigate(`/schedules/clock-out/${id}`);
    }
  }, [schedule, id, navigate]);

  const handleClockIn = async () => {
    if (!schedule || clockingIn) return;
    
    setClockingIn(true);
    
    try {
      const clickTimestamp = new Date().toISOString();
      console.log('[DEBUG] Clock-in timestamp captured at button click:', clickTimestamp);
      const locationData = await getCurrentLocation(clickTimestamp);
      await scheduleAPI.startVisit(schedule.id, { ...locationData, timestamp: clickTimestamp });
      
      // Direct redirect to home page
      navigate('/');
      
    } catch (error: any) {
      console.error('[ERROR] Clock-in failed:', error);
      
      // Log detailed error information
      if (error.response) {
        console.error('[ERROR] Response status:', error.response.status);
        console.error('[ERROR] Response data:', error.response.data);
        console.error('[ERROR] Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('[ERROR] Request made but no response:', error.request);
      } else {
        console.error('[ERROR] Error setting up request:', error.message);
      }
      
      // Check if the error is actually a success (data was updated despite error)
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data?.error || '';
        
        // Handle specific error cases
        if (errorMessage.includes('not in scheduled status')) {
          console.log('[INFO] Detected "not in scheduled status" error, checking current status...');
          
          // Check current schedule status
          try {
            const response = await scheduleAPI.getById(schedule.id);
            const currentStatus = response.data.status;
              
            console.log(`[INFO] Current schedule status: ${currentStatus}`);
              
            // If status is in-progress or completed, redirect to home
            if (currentStatus === 'in-progress' || currentStatus === 'completed') {
              navigate('/');
              return;
            }
          } catch (checkError) {
            console.error('[ERROR] Failed to check current schedule status:', checkError);
            // Still redirect to home on error
            navigate('/');
            return;
          }
        } else {
          // Wait a moment and check if the schedule was actually updated (for other 400 errors)
          setTimeout(async () => {
            try {
              const response = await scheduleAPI.getById(schedule.id);
              if (response.data.status === 'in-progress') {
                console.log('[INFO] Schedule was actually updated successfully despite error');
                navigate('/');
                return;
              }
            } catch (checkError) {
              console.error('[ERROR] Failed to verify schedule status:', checkError);
            }
            // Redirect to home even if verification fails
            navigate('/');
          }, 1000);
        }
      } else {
        // For non-400 errors, still redirect to home
        navigate('/');
      }
    } finally {
      setClockingIn(false);
    }
  };

  return {
    schedule,
    loading,
    error,
    clockingIn,
    handleClockIn
  };
};