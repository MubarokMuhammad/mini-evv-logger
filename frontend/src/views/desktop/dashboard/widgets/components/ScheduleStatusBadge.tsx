import React from 'react';

interface ScheduleStatusBadgeProps {
  status: string;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

const ScheduleStatusBadge: React.FC<ScheduleStatusBadgeProps> = ({
  status,
  getStatusColor,
  getStatusText
}) => {
  return (
    <span style={{
      backgroundColor: getStatusColor(status),
      color: 'white',
      padding: '4px 12px',
      borderRadius: '16px',
      fontSize: '11px',
      fontWeight: '600',
      textTransform: 'capitalize',
      letterSpacing: '0.3px'
    }}>
      {getStatusText(status)}
    </span>
  );
};

export default ScheduleStatusBadge;