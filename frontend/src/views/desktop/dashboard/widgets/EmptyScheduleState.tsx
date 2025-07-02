import React from 'react';

const EmptyScheduleState: React.FC = () => {
  return (
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
  );
};

export default EmptyScheduleState;