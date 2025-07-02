import { scheduleAPI } from '../api.ts';
import { Schedule, Location } from '../models/Schedule.ts';
import { getCurrentLocation } from '../utils/geolocation.ts';

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
    field: 'date' | 'startTime' | 'clientName' | 'status';
    direction: 'asc' | 'desc';
  }): Schedule[] {
    return [...schedules].sort((a, b) => {
      // For date sorting, always include time as secondary sort to maintain consistency
      if (sortBy.field === 'date') {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        
        if (dateA.getTime() !== dateB.getTime()) {
          const dateComparison = dateA.getTime() - dateB.getTime();
          return sortBy.direction === 'asc' ? dateComparison : -dateComparison;
        }
        
        // If dates are the same, sort by start time
        const timeComparison = a.startTime.localeCompare(b.startTime);
        return sortBy.direction === 'asc' ? timeComparison : -timeComparison;
      }
      
      // For other fields, use original logic
      let aValue = a[sortBy.field];
      let bValue = b[sortBy.field];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
      }
      if (typeof bValue === 'string') {
        bValue = bValue.toLowerCase();
      }
      
      if (sortBy.direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }
}