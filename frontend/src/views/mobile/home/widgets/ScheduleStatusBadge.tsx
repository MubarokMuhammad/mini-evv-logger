import React from 'react';

interface ScheduleStatusBadgeProps {
  status: string;
}

const ScheduleStatusBadge: React.FC<ScheduleStatusBadgeProps> = ({ status }) => {
  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Scheduled';
      case 'in-progress': return 'In progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return '#616161';
      case 'in-progress': return '#ED6C02';
      case 'completed': return '#2E7D32';
      case 'cancelled': return '#D32F2F';
      case 'missed': return '#616161';
      default: return '#eee';
    }
  };

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