import React from 'react';
import { ActiveVisitCard, StatsCards, ScheduleList, Footer } from './widgets';
import { useDashboardData, useActiveVisitTimer, useScheduleActions } from './hooks';
import { getStatusColor, getStatusText } from './utils/scheduleUtils';
import '../../../styles/desktop.css';

const DesktopDashboard: React.FC = () => {
  const { schedules, stats, activeVisit, loading, error, loadData } = useDashboardData();
  const timer = useActiveVisitTimer(activeVisit);
  const { handleClockIn, handleClockOut } = useScheduleActions(loadData);

  if (loading) {
    return <div className="desktop-loading">Loading...</div>;
  }

  if (error) {
    return <div className="desktop-error">Error: {error}</div>;
  }

  return (
    <div className="desktop-dashboard">
      <h1 className="page-title" style={{
        fontSize: '28px',
        fontWeight: '700',
        color: '#1a1a1a',
        margin: '0 0 24px 0'
      }}>Dashboard</h1>

      <ActiveVisitCard 
        activeVisit={activeVisit}
        timer={timer}
        onClockOut={handleClockOut}
      />

      <StatsCards stats={stats} />

      <ScheduleList 
        schedules={schedules}
        onClockIn={handleClockIn}
        onClockOut={handleClockOut}
        getStatusColor={getStatusColor}
        getStatusText={getStatusText}
      />
      
      <Footer />
    </div>
  );
};

export default DesktopDashboard;
