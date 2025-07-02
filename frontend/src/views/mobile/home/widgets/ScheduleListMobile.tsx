import React from 'react';
import { Link } from 'react-router-dom';
import { Schedule } from '../../../../hooks/types';
import ScheduleCardMobile from './ScheduleCardMobile';

interface ScheduleListMobileProps {
  schedules: Schedule[];
  onClockIn: (scheduleId: string) => void;
  onClockOut: (schedule: Schedule) => void;
}

const ScheduleListMobile: React.FC<ScheduleListMobileProps> = ({ schedules, onClockIn, onClockOut }) => {
  return (
    <div className="schedule-section">
      <div className="schedule-header">
        <h2 className="schedule-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          Schedule
          <span style={{ background: '#02CAD1', color: 'white', borderRadius: 12, fontSize: 14, fontWeight: 600, padding: '2px 10px', marginLeft: 6 }}>
            {schedules?.length || 0}
          </span>
        </h2>
        <Link to="/schedules" className="see-all">See All</Link>
      </div>

      {schedules && schedules.length > 0 ? (
        schedules.map((schedule) => (
          <ScheduleCardMobile
            key={schedule.id}
            schedule={schedule}
            onClockIn={onClockIn}
            onClockOut={onClockOut}
          />
        ))
      ) : (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center',
          color: '#666',
          marginBottom: '8px'
        }}>
          No schedules found
        </div>
      )}
    </div>
  );
};

export default ScheduleListMobile;