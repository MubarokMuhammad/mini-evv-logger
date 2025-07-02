import React from 'react';
import { Schedule } from '../../../../hooks/types';
import {
  ClockOutHeader,
  ServiceClientCard,
  TasksSection,
  LocationSection,
  ServiceNotesSection,
  ActionButtons
} from '../widgets';

interface MainContentProps {
  timer: string;
  schedule: Schedule;
  taskState: {
    userInteractedTasks: { [taskId: string]: boolean };
    setUserInteractedTasks: React.Dispatch<React.SetStateAction<{ [taskId: string]: boolean }>>;
    reasonInputs: { [taskId: string]: string };
    setReasonInputs: React.Dispatch<React.SetStateAction<{ [taskId: string]: string }>>;
    showAddTaskForm: boolean;
    setShowAddTaskForm: React.Dispatch<React.SetStateAction<boolean>>;
    newTaskName: string;
    setNewTaskName: React.Dispatch<React.SetStateAction<string>>;
    newTaskDesc: string;
    setNewTaskDesc: React.Dispatch<React.SetStateAction<string>>;
  };
  setSchedule: React.Dispatch<React.SetStateAction<Schedule | null>>;
  handleTaskUpdate: (taskId: string, completed: boolean, reason?: string) => Promise<void>;
  handleClockOut: () => Promise<void>;
  handleCancelClockIn: () => Promise<void>;
  id: string;
}

const MainContent: React.FC<MainContentProps> = ({
  timer,
  schedule,
  taskState,
  setSchedule,
  handleTaskUpdate,
  handleClockOut,
  handleCancelClockIn,
  id
}) => {
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <ClockOutHeader timer={timer} />

      <div style={{
        padding: '5px 40px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <ServiceClientCard schedule={schedule} />

        <TasksSection
          schedule={schedule}
          userInteractedTasks={taskState.userInteractedTasks}
          setUserInteractedTasks={taskState.setUserInteractedTasks}
          reasonInputs={taskState.reasonInputs}
          setReasonInputs={taskState.setReasonInputs}
          showAddTaskForm={taskState.showAddTaskForm}
          setShowAddTaskForm={taskState.setShowAddTaskForm}
          newTaskName={taskState.newTaskName}
          setNewTaskName={taskState.setNewTaskName}
          newTaskDesc={taskState.newTaskDesc}
          setNewTaskDesc={taskState.setNewTaskDesc}
          setSchedule={setSchedule}
          handleTaskUpdate={handleTaskUpdate}
          id={id}
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

export default MainContent;