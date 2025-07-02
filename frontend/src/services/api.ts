import axios from 'axios';
import { Location } from '../hooks/types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
});



export const scheduleAPI = {
  getAll: () => api.get('/api/schedules'),
  getToday: () => api.get('/api/schedules/today'),
  getById: (id: string) => api.get(`/api/schedules/${id}`),
  startVisit: (id: string, location: Location) => api.post(`/api/schedules/${id}/start`, { location }),
  endVisit: (id: string, location: Location) => api.post(`/api/schedules/${id}/end`, { location }),
  updateTasks: (id: string, tasks: any[]) => api.post(`/api/schedules/${id}/tasks`, { tasks }),
  addNotes: (id: string, notes: string) => api.post(`/api/schedules/${id}/notes`, { notes }),
  cancel: (id: string, data: { cancelledAt: string }) => api.post(`/api/schedules/${id}/cancel`, data)
};

export const taskAPI = {
  create: (scheduleId: string, data: { name: string; description: string }) =>
    api.post(`/api/schedules/${scheduleId}/tasks`, data),
  update: (taskId: string, data: { completed: boolean; reason?: string }) =>
    api.put(`/api/schedules/tasks/${taskId}`, data),
};

export const statsAPI = {
  get: () => api.get('/api/stats')
};

export default api;
