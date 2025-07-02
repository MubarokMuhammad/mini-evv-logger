import axios from 'axios';
import { Schedule, Stats, Location } from './types';

const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? '/api' : 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

interface VisitRequest {
  location: Location;
}

export const scheduleAPI = {
  getAll: () => api.get('/schedules'),
  getToday: () => api.get('/schedules/today'),
  getById: (id: string) => api.get(`/schedules/${id}`),
  startVisit: (id: string, location: Location) => api.post(`/schedules/${id}/start`, { location }),
  endVisit: (id: string, location: Location) => api.post(`/schedules/${id}/end`, { location }),
  updateTasks: (id: string, tasks: any[]) => api.post(`/schedules/${id}/tasks`, { tasks }),
  addNotes: (id: string, notes: string) => api.post(`/schedules/${id}/notes`, { notes })
};

export const taskAPI = {
  create: (scheduleId: string, data: { name: string; description: string }) =>
    api.post(`/schedules/${scheduleId}/tasks`, data),
  update: (taskId: string, data: { completed: boolean; reason?: string }) =>
    api.put(`/schedules/tasks/${taskId}`, data),
};

export const statsAPI = {
  get: () => api.get('/stats')
};

export default api;
