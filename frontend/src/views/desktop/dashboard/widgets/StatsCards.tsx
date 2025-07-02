import React from 'react';
import { Stats } from '../../../../hooks/types';

interface StatsCardsProps {
  stats: Stats | null;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="desktop-stats">
      <div className="stat-card missed">
        <div className="stat-number">{stats?.missedSchedules || 0}</div>
        <div className="stat-label">Missed Scheduled</div>
      </div>
      <div className="stat-card upcoming">
        <div className="stat-number">{stats?.upcomingToday || 0}</div>
        <div className="stat-label">Upcoming Today's Schedule</div>
      </div>
      <div className="stat-card completed">
        <div className="stat-number">{stats?.completedToday || 0}</div>
        <div className="stat-label">Today's Completed Schedule</div>
      </div>
    </div>
  );
};

export default StatsCards;