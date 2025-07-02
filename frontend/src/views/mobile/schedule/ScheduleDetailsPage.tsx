import React from 'react';
import { useParams } from 'react-router-dom';
import {
  ScheduleHeader,
  ScheduleServiceInfo,
  ScheduleContactInfo,
  ScheduleTaskList,
  ScheduleCompletedInfo,
  ScheduleServiceNotes,
  ScheduleActionButton,
  ScheduleLoadingState,
  ScheduleNotFound
} from './widgets';
import { useScheduleDetails } from './hooks/useScheduleDetails';

const ScheduleDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { schedule, loading, error, clockingIn, handleClockIn } = useScheduleDetails(id);

  if (loading) {
    return <ScheduleLoadingState />;
  }

  if (!schedule) {
    return <ScheduleNotFound />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      <ScheduleHeader />
      
      <div style={{
        maxWidth: '400px',
        margin: '0 auto',
        padding: '0 16px 16px'
      }}>
        <ScheduleServiceInfo schedule={schedule} />
        <ScheduleContactInfo schedule={schedule} />
        <ScheduleTaskList tasks={schedule.tasks} />
        <ScheduleCompletedInfo schedule={schedule} />
        <ScheduleServiceNotes serviceNotes={schedule.serviceNotes} />
        <ScheduleActionButton 
          status={schedule.status}
          clockingIn={clockingIn}
          onClockIn={handleClockIn}
        />
      </div>
    </div>
  );
};

export default ScheduleDetailsPage;