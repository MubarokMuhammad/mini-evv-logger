import { useState } from 'react';
import { taskAPI } from '../../../../services/api';
import { Schedule } from '../../../../hooks/types';

export const useTaskInteractions = () => {
  const [reasonInputs, setReasonInputs] = useState<{ [taskId: string]: string }>({});
  const [userInteractedTasks, setUserInteractedTasks] = useState<{ [taskId: string]: boolean }>({});

  const handleTaskUpdate = async (
    taskId: string, 
    completed: boolean, 
    reason: string | undefined,
    schedule: Schedule,
    setSchedule: (schedule: Schedule) => void
  ) => {
    try {
      console.log('handleTaskUpdate called with:', { taskId, completed, reason });
      await taskAPI.update(taskId, { completed, reason });
      console.log('API call successful');
      
      // Mark task as user-interacted
      setUserInteractedTasks(prev => ({
        ...prev,
        [taskId]: true
      }));
      
      const updatedSchedule = {
        ...schedule,
        tasks: schedule.tasks || []
      };
      const taskIndex = updatedSchedule.tasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        updatedSchedule.tasks[taskIndex] = {
          ...updatedSchedule.tasks[taskIndex],
          completed,
          reason: reason || ''
        };
        console.log('Updated task:', updatedSchedule.tasks[taskIndex]);
        setSchedule(updatedSchedule);
        console.log('Schedule updated successfully');
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return {
    reasonInputs,
    setReasonInputs,
    userInteractedTasks,
    setUserInteractedTasks,
    handleTaskUpdate
  };
};