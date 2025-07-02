import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ClockOutHeader,
  ServiceClientInfo,
  TasksSection,
  LocationSection,
  ServiceNotesSection,
  ActionButtons,
  SuccessModal
} from './widgets';
import { useScheduleData, useTimer, useTaskInteractions } from './hooks';
import { performClockOut, performCancelClockIn } from './utils/clockOutOperations';

const ClockOutPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [duration, setDuration] = useState<string>('');
  
  // Custom hooks
  const { schedule, setSchedule } = useScheduleData(id);
  const timer = useTimer(schedule);
  const {
    reasonInputs,
    setReasonInputs,
    userInteractedTasks,
    setUserInteractedTasks,
    handleTaskUpdate
  } = useTaskInteractions();

  // Handler functions using utility operations
  const handleTaskUpdateWrapper = async (taskId: string, completed: boolean, reason?: string) => {
    if (schedule) {
      await handleTaskUpdate(taskId, completed, reason, schedule, setSchedule);
    }
  };

  const handleClockOut = async () => {
    await performClockOut(id!, schedule, setDuration, setShowSuccess);
  };

  const handleCancelClockIn = async () => {
    await performCancelClockIn(id!, navigate);
  };

  if (showSuccess) {
    return <SuccessModal duration={duration} />;
  }

  if (!schedule) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      paddingBottom: '100px'
    }}>
      <ClockOutHeader timer={timer} />

      <div style={{ 
        padding: '0 16px 20px 16px',
        maxWidth: '400px',
        margin: '0 auto'
      }}>
        <ServiceClientInfo schedule={schedule} />

        <TasksSection
          schedule={schedule}
          userInteractedTasks={userInteractedTasks}
          setUserInteractedTasks={setUserInteractedTasks}
          reasonInputs={reasonInputs}
          setReasonInputs={setReasonInputs}
          onTaskUpdate={handleTaskUpdateWrapper}
          onScheduleUpdate={setSchedule}
          scheduleId={id!}
        />

        <LocationSection schedule={schedule} />

        <ServiceNotesSection schedule={schedule} />

        <ActionButtons
          onCancelClockIn={handleCancelClockIn}
          onClockOut={handleClockOut}
        />
      </div>
    </div>
  );
};

export default ClockOutPage;