import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { scheduleAPI } from '../../../../services/api';
import { getCurrentLocation } from '../../../../utils/geolocation';
import { Schedule } from './useScheduleData';

export const useClockIn = () => {
  const navigate = useNavigate();
  const [clockingIn, setClockingIn] = useState(false);

  const handleClockIn = async (schedule: Schedule) => {
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
            const checkResponse = await scheduleAPI.getById(schedule.id);
            const currentStatus = checkResponse.data.status;
            
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
              const checkResponse = await scheduleAPI.getById(schedule.id);
              if (checkResponse.data.status === 'in-progress') {
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
    clockingIn,
    handleClockIn
  };
};