import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { scheduleAPI } from '../../../../services/api';

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

export const useScheduleData = (id: string | undefined) => {
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSchedule = useCallback(async () => {
    try {
      const response = await scheduleAPI.getById(id!);
      setSchedule(response.data.data);
    } catch (error) {
      console.error('Error fetching schedule:', error);
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

  return {
    schedule,
    loading,
    fetchSchedule
  };
};

export type { Schedule, Location, Task };