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
  const [schedule, setSchedule] = useState<Schedule | null>(initialSchedule);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSchedule = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await scheduleAPI.getById(id);
        setSchedule({
          ...response.data.data,
          tasks: response.data.data.tasks || []
        });
      } catch (error) {
        console.error('Error loading schedule:', error);
        setError('Error loading schedule');
      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
  }, [id]);

  return { schedule, setSchedule, loading, error };
};