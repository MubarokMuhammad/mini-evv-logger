import { useNavigate } from 'react-router-dom';
import { scheduleAPI } from '../../../../services/api';
import { Schedule } from '../../../../hooks/types';
import { getCurrentLocation } from '../../../../utils/geolocation';

export const useScheduleActions = (loadData: () => Promise<void>) => {
  const navigate = useNavigate();

  const handleClockIn = async (scheduleId: string) => {
    try {
      const clickTimestamp = new Date().toISOString();
      const { latitude, longitude, address } = await getCurrentLocation(clickTimestamp);
      const locationData = { latitude, longitude, address, timestamp: clickTimestamp };
      await scheduleAPI.startVisit(scheduleId, locationData);
      loadData();
    } catch (error) {
      console.error('Error starting visit:', error);
      alert(error instanceof Error ? error.message : 'Error starting visit. Please try again.');
    }
  };

  const handleClockOut = async (schedule: Schedule) => {
    try {
      const clickTimestamp = new Date().toISOString();
      const { latitude, longitude, address } = await getCurrentLocation(clickTimestamp);
      const locationData = { latitude, longitude, address, timestamp: clickTimestamp };
      await scheduleAPI.endVisit(schedule.id, locationData);
      loadData();
      navigate(`/schedules/clock-out/${schedule.id}`);
    } catch (error) {
      console.error('Error ending visit:', error);
      alert(error instanceof Error ? error.message : 'Error ending visit. Please try again.');
    }
  };

  return {
    handleClockIn,
    handleClockOut
  };
};