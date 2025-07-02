import React from 'react';
import { useParams } from 'react-router-dom';
import { SuccessState } from './widgets';
import {
  useScheduleData,
  useTimer,
  useTaskState,
  useTaskOperations,
  useClockOutOperations
} from './hooks';
import {
  LoadingState,
  ErrorState,
  MainContent
} from './components';

const DesktopClockOutPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Custom hooks
  const { schedule, setSchedule, loading, error } = useScheduleData(id);
  const timer = useTimer(schedule);
  const taskState = useTaskState();
  const { handleTaskUpdate } = useTaskOperations(schedule, setSchedule, taskState.setUserInteractedTasks);
  const { showSuccess, duration, handleClockOut, handleCancelClockIn } = useClockOutOperations(schedule, id);

  // Loading and error handling
  if (loading) {
    return <LoadingState message="Loading schedule..." />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (showSuccess && schedule) {
    return <SuccessState schedule={schedule} duration={duration} />;
  }

  if (!schedule) {
    return <ErrorState error="Schedule not found" />;
  }

  return (
    <MainContent
      timer={timer}
      schedule={schedule}
      taskState={taskState}
      setSchedule={setSchedule}
      handleTaskUpdate={handleTaskUpdate}
      handleClockOut={handleClockOut}
      handleCancelClockIn={handleCancelClockIn}
      id={id!}
    />
  );
};

export default DesktopClockOutPage;