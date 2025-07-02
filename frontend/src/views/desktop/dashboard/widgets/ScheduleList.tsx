import React from 'react';
import { Schedule } from '../../../../hooks/types';
import ScheduleHeader from './ScheduleHeader';
import ScheduleCard from './ScheduleCard';
import EmptyScheduleState from './EmptyScheduleState';

interface ScheduleListProps {
  schedules: Schedule[];
  onClockIn: (scheduleId: string) => void;
  onClockOut: (schedule: Schedule) => void;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

const ScheduleList: React.FC<ScheduleListProps> = ({
  schedules,
  onClockIn,
  onClockOut,
  getStatusColor,
  getStatusText
}) => {
  return (
    <>
      <ScheduleHeader scheduleCount={schedules?.length || 0} />

      <div className="desktop-schedule-section" style={{ backgroundColor: 'transparent' }}>
        <div className="schedule-list">
          {schedules.length > 0 ? (
            schedules.map((schedule) => (
              <ScheduleCard
                key={schedule.id}
                schedule={schedule}
                onClockIn={onClockIn}
                onClockOut={onClockOut}
                getStatusColor={getStatusColor}
                getStatusText={getStatusText}
              />
            ))
          ) : (
            <EmptyScheduleState />
          )}
        </div>
      </div>
    </>
  );
};

export default ScheduleList;