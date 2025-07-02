import React from 'react';

interface ScheduleHeaderProps {
  scheduleCount: number;
}

const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({ scheduleCount }) => {
  return (
    <h2 className="page-title" style={{
      fontSize: '20px',
      fontWeight: '700',
      color: '#1a1a1a',
      margin: '0 0 24px 0',
      display: 'flex',
      alignItems: 'center'
    }}>
      Schedule
      <span style={{
        background: '#02CAD1',
        color: 'white',
        borderRadius: 12,
        fontSize: 14,
        fontWeight: 600,
        padding: '2px 5px',
        marginLeft: 6,
        display: 'inline-flex',
        alignItems: 'center'
      }}>
        {scheduleCount}
      </span>
    </h2>
  );
};

export default ScheduleHeader;