import { useState } from 'react';

export const useTaskState = () => {
  // --- Inline Reason State ---
  const [showReasonForTask, setShowReasonForTask] = useState<{ [taskId: string]: boolean }>({});
  const [reasonInputs, setReasonInputs] = useState<{ [taskId: string]: string }>({});
  
  // --- Task Interaction State ---
  const [userInteractedTasks, setUserInteractedTasks] = useState<{ [taskId: string]: boolean }>({});
  
  // --- Add Task State ---
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');

  return {
    showReasonForTask,
    setShowReasonForTask,
    reasonInputs,
    setReasonInputs,
    userInteractedTasks,
    setUserInteractedTasks,
    showAddTaskForm,
    setShowAddTaskForm,
    newTaskName,
    setNewTaskName,
    newTaskDesc,
    setNewTaskDesc
  };
};