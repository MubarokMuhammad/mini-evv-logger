import { statsAPI } from '../services/api';
import { Stats } from '../hooks/types';

export class StatsService {
  static async getStats(): Promise<Stats> {
    try {
      const response = await statsAPI.get();
      return response.data.data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch stats');
    }
  }

  static calculateCompletionRate(stats: Stats): number {
    const total = stats.completedToday + stats.upcomingToday + stats.missedSchedules;
    if (total === 0) return 0;
    return Math.round((stats.completedToday / total) * 100);
  }

  static getPerformanceStatus(completionRate: number): {
    status: 'excellent' | 'good' | 'average' | 'poor';
    color: string;
    message: string;
  } {
    if (completionRate >= 90) {
      return {
        status: 'excellent',
        color: '#2E7D32',
        message: 'Excellent performance!'
      };
    } else if (completionRate >= 75) {
      return {
        status: 'good',
        color: '#ED6C02',
        message: 'Good performance'
      };
    } else if (completionRate >= 50) {
      return {
        status: 'average',
        color: '#616161',
        message: 'Average performance'
      };
    } else {
      return {
        status: 'poor',
        color: '#D32F2F',
        message: 'Needs improvement'
      };
    }
  }
}