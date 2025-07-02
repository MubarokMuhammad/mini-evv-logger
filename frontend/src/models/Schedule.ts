export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  timestamp?: string;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  reason?: string;
}

export interface Schedule {
  id: string;
  clientName: string;
  serviceName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'missed';
  location: Location;
  startLocation?: Location;
  endLocation?: Location;
  actualStartTime?: string;
  actualEndTime?: string;
  clientEmail?: string;
  clientPhone?: string;
  serviceNotes?: string;
  notes?: string;
  tasks?: Task[];
}

export interface Stats {
  completedToday: number;
  upcomingToday: number;
  missedSchedules: number;
}

export interface ScheduleFilters {
  status?: string;
  date?: string;
  clientName?: string;
}

export interface ScheduleSort {
  field: 'date' | 'startTime' | 'clientName' | 'status';
  direction: 'asc' | 'desc';
}