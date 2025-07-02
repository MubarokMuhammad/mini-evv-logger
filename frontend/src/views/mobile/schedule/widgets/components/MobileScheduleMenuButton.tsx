import React from 'react';
import { useNavigate } from 'react-router-dom';

interface MobileScheduleMenuButtonProps {
  scheduleId: string;
}

const MobileScheduleMenuButton: React.FC<MobileScheduleMenuButtonProps> = ({ scheduleId }) => {
  const navigate = useNavigate();

  return (
    <span style={{
      fontSize: '16px',
      color: '#212121',
      cursor: 'pointer',
      padding: '4px',
      borderRadius: '50%',
    }} onClick={(e) => {
      e.stopPropagation();
      navigate(`/schedules/${scheduleId}`);
    }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
      ⋯
    </span>
  );
};

export default MobileScheduleMenuButton;