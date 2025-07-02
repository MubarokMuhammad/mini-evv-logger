import React from 'react';
import { useParams } from 'react-router-dom';
import { useScheduleData, useClockIn } from './hooks';
import { LoadingState, NotFoundState, ScheduleContent } from './components';
import '../../../styles/desktop.css';

const DesktopScheduleDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { schedule, loading } = useScheduleData(id);
  const { clockingIn, handleClockIn } = useClockIn();

  if (loading) {
    return <LoadingState />;
  }

  if (!schedule) {
    return <NotFoundState />;
  }

  return (
    <ScheduleContent 
      schedule={schedule}
      onClockIn={handleClockIn}
      clockingIn={clockingIn}
    />
  );
};

export default DesktopScheduleDetailsPage;