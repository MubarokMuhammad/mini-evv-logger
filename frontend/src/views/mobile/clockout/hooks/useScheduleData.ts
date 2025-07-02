import { useState, useEffect } from 'react';
import { Schedule } from '../../../../hooks/types';
import { scheduleAPI } from '../../../../services/api';

const initialSchedule: Schedule = {
  id: '',
  clientName: '',
  serviceName: '',
  date: '',
  startTime: '',
  endTime: '',
  status: 'scheduled',
  location: {
    latitude: 0,
    longitude: 0,
    address: ''
  },
  startLocation: undefined,
  endLocation: undefined,
  actualStartTime: undefined,
  actualEndTime: undefined,
  clientEmail: undefined,
  clientPhone: undefined,
  serviceNotes: undefined,
  tasks: []
};

export const useScheduleData = (id: string | undefined) => {
  const [schedule, setSchedule] = useState<Schedule>(initialSchedule);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSchedule = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await scheduleAPI.getById(id);
        setSchedule({
          ...response.data.data,
          tasks: response.data.data.tasks || []
        });
      } catch (error) {
        console.error('Error loading schedule:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSchedule();
  }, [id]);

  return { schedule, setSchedule, loading };
};