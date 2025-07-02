import React from 'react';
import ScheduleCard from './ScheduleCard';
import { Schedule } from '../../../../models/Schedule';

interface AllSchedulesListProps {
  schedules: Schedule[];
  onClockIn: (scheduleId: string) => void;
  onClockOut: (schedule: Schedule) => void;
  getLocationText: (schedule: Schedule) => string;
}

const AllSchedulesList: React.FC<AllSchedulesListProps> = ({
  schedules,
  onClockIn,
  onClockOut,
  getLocationText
}) => {
  if (schedules.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px 20px',
        color: '#666'
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '16px'
        }}>📅</div>
        <h3 style={{
          margin: '0 0 8px 0',
          fontSize: '18px',
          fontWeight: '600',
          color: '#333'
        }}>No schedules found</h3>
        <p style={{
          margin: 0,
          fontSize: '14px',
          color: '#666'
        }}>Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div style={{
      padding: '16px',
      maxWidth: '400px',
      margin: '0 auto',
      paddingBottom: '80px'
    }}>
      {schedules.map((schedule) => (
        <ScheduleCard
          key={schedule.id}
          schedule={schedule}
          onClockIn={onClockIn}
          onClockOut={onClockOut}
          getLocationText={getLocationText}
        />
      ))}
    </div>
  );
};

export default AllSchedulesList;