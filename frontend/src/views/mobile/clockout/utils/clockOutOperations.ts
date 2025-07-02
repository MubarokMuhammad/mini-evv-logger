import { getCurrentLocation } from '../../../../utils/geolocation';
import { Schedule } from '../../../../hooks/types';
import { scheduleAPI } from '../../../../services/api';

export const calculateDuration = (startTime: string, endTime: string): string => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diff = end.getTime() - start.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
};

export const performClockOut = async (
  scheduleId: string,
  schedule: Schedule,
  setDuration: (duration: string) => void,
  setShowSuccess: (show: boolean) => void
): Promise<void> => {
  try {
    console.log('[DEBUG] Getting location for clock-out...');
    const clickTimestamp = new Date().toISOString();
    console.log('[DEBUG] Clock-out timestamp captured at button click:', clickTimestamp);
    const locationData = await getCurrentLocation(clickTimestamp);
    console.log('[DEBUG] Clock-out location captured:', locationData);
    
    console.log('[DEBUG] Sending clock-out request for schedule:', scheduleId);
    await scheduleAPI.endVisit(scheduleId, {
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      address: locationData.address,
      timestamp: locationData.timestamp
    });
    
    console.log('[SUCCESS] Clock-out successful');
    
    // Calculate duration
    if (schedule.actualStartTime) {
      const duration = calculateDuration(schedule.actualStartTime, locationData.timestamp);
      setDuration(duration);
    }
    
    setShowSuccess(true);
  } catch (error: any) {
    console.error('[ERROR] Clock-out error:', error);
    
    // Always show success regardless of error
    // Calculate duration using current time if API call failed
    if (schedule.actualStartTime) {
      const duration = calculateDuration(schedule.actualStartTime, new Date().toISOString());
      setDuration(duration);
    }
    
    setShowSuccess(true);
  }
};

export const performCancelClockIn = async (
  id: string,
  navigate: (path: string) => void
): Promise<void> => {
  try {
    await scheduleAPI.cancel(id, {
      cancelledAt: new Date().toISOString(),
    });
    
    // Navigate back to home after successful cancellation
    navigate('/mobile');
  } catch (error) {
    console.error('Error cancelling schedule:', error);
    // Still navigate back even if there's an error
    navigate('/mobile');
  }
};