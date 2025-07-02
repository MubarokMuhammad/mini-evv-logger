import { scheduleAPI } from './api';
import { Schedule } from '../models/Schedule';
import { getCurrentLocation } from '../utils/geolocation';

export class ScheduleService {
  static async getAllSchedules(): Promise<Schedule[]> {
    try {
      const response = await scheduleAPI.getAll();
      return response.data.data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch schedules');
    }
  }

  static async getScheduleById(id: string): Promise<Schedule> {
    try {
      const response = await scheduleAPI.getById(id);
      return response.data.data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch schedule');
    }
  }

  static async startVisit(scheduleId: string): Promise<void> {
    try {
      const clickTimestamp = new Date().toISOString();
      console.log('[DEBUG] ScheduleService startVisit timestamp captured:', clickTimestamp);
      const location = await getCurrentLocation(clickTimestamp);
      await scheduleAPI.startVisit(scheduleId, { ...location, timestamp: clickTimestamp });
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to start visit');
    }
  }

  static async endVisit(scheduleId: string): Promise<void> {
    try {
      const clickTimestamp = new Date().toISOString();
      console.log('[DEBUG] ScheduleService endVisit timestamp captured:', clickTimestamp);
      const location = await getCurrentLocation(clickTimestamp);
      await scheduleAPI.endVisit(scheduleId, { ...location, timestamp: clickTimestamp });
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to end visit');
    }
  }

  static async updateTasks(scheduleId: string, tasks: any[]): Promise<void> {
    try {
      await scheduleAPI.updateTasks(scheduleId, tasks);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update tasks');
    }
  }

  static async addNotes(scheduleId: string, notes: string): Promise<void> {
    try {
      await scheduleAPI.addNotes(scheduleId, notes);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to add notes');
    }
  }

  static filterSchedules(schedules: Schedule[], filters: {
    status?: string;
    date?: string;
    clientName?: string;
  }): Schedule[] {
    return schedules.filter(schedule => {
      if (filters.status && schedule.status !== filters.status) {
        return false;
      }
      if (filters.date && schedule.date !== filters.date) {
        return false;
      }
      if (filters.clientName && !schedule.clientName.toLowerCase().includes(filters.clientName.toLowerCase())) {
        return false;
      }
      return true;
    });
  }

  static sortSchedules(schedules: Schedule[], sortBy: {
    field: 'date' | 'clientName' | 'status' | 'startTime';
    direction: 'asc' | 'desc';
  }): Schedule[] {
    return schedules.sort((a: Schedule, b: Schedule) => {
      let aValue: any;
      let bValue: any;
      
      switch (sortBy.field) {
        case 'date':
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case 'clientName':
          aValue = a.clientName.toLowerCase();
          bValue = b.clientName.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'startTime':
          aValue = a.startTime;
          bValue = b.startTime;
          break;
        default:
          return 0;
      }
      
      if (sortBy.direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }
}