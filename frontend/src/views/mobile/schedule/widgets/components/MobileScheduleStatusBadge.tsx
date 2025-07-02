import React from 'react';

interface MobileScheduleStatusBadgeProps {
  status: string;
}

const MobileScheduleStatusBadge: React.FC<MobileScheduleStatusBadgeProps> = ({ status }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return '#3b82f6';
      case 'in-progress': return '#f59e0b';
      case 'completed': return '#10b981';
      case 'missed': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <span style={{
      backgroundColor: getStatusColor(status),
      color: 'white',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    }}>
      {status.replace('-', ' ')}
    </span>
  );
};

export default MobileScheduleStatusBadge;