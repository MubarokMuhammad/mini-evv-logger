import React, { useState } from 'react';
import { Schedule } from '../../../../hooks/types';
import { taskAPI } from '../../../../services/api';

interface TasksSectionProps {
  schedule: Schedule;
  userInteractedTasks: { [taskId: string]: boolean };
  setUserInteractedTasks: React.Dispatch<React.SetStateAction<{ [taskId: string]: boolean }>>;
  reasonInputs: { [taskId: string]: string };
  setReasonInputs: React.Dispatch<React.SetStateAction<{ [taskId: string]: string }>>;
  onTaskUpdate: (taskId: string, completed: boolean, reason?: string) => Promise<void>;
  onScheduleUpdate: (updatedSchedule: Schedule) => void;
  scheduleId: string;
}

const TasksSection: React.FC<TasksSectionProps> = ({
  schedule,
  userInteractedTasks,
  setUserInteractedTasks,
  reasonInputs,
  setReasonInputs,
  onTaskUpdate,
  onScheduleUpdate,
  scheduleId
}) => {
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');

  const handleAddTask = async () => {
    const name = newTaskName.trim();
    const desc = newTaskDesc.trim();
    if (!name || !desc) {
      alert('Please fill in both activity name and description.');
      return;
    }
    
    try {
      console.log('Creating task with:', { name, description: desc });
      const response = await taskAPI.create(scheduleId, { name, description: desc });
      console.log('Full response:', response);
      console.log('Response data:', response.data);
      
      // Update local state with the new task from backend
      // Backend returns { success: true, message: "...", data: task }
      const newTask = response.data.data;
      console.log('New task to add:', newTask);
      const updatedSchedule = { ...schedule, tasks: [...(schedule.tasks || []), newTask] };
      console.log('Updated schedule:', updatedSchedule);
      onScheduleUpdate(updatedSchedule);
      
      setNewTaskName('');
      setNewTaskDesc('');
      setShowAddTaskForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Error creating task. Please try again.');
    }
  };

  return (
    <div className="tasks-section">
      <div className="tasks-header">
        <h3>Tasks:</h3>
        <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
          Please tick the tasks that you have done
        </p>
      </div>

      {(schedule.tasks || []).map((task) => (
        <div key={task.id}>
          <div className="task-item">
            <div className="task-item-row">
              <div className="task-content">
                <h4>{task.name}</h4>
                <p>{task.description}</p>
              </div>
              <div className="task-actions">
                <button 
                  onClick={() => onTaskUpdate(task.id, true)}
                  className={`task-btn ${userInteractedTasks[task.id] && task.completed === true ? 'completed' : ''}`}
                >
                  Yes
                </button>
                <button 
                  onClick={() => {
                    // Mark task as user-interacted and not completed
                    setUserInteractedTasks(prev => ({
                      ...prev,
                      [task.id]: true
                    }));
                    // Mark as not completed when clicking No
                    onTaskUpdate(task.id, false);
                    // Start reason input mode
                    setReasonInputs(prev => ({
                      ...prev,
                      [task.id]: task.reason || ''
                    }));
                  }}
                  className={`task-btn ${(userInteractedTasks[task.id] && task.completed === false) || reasonInputs[task.id] !== undefined ? 'not-completed' : ''}`}
                >
                  No
                </button>
              </div>
            </div>
            {task.completed === false && task.reason && !reasonInputs[task.id] && (
              <div className="task-reason-label">
                <strong>Reason: </strong>{task.reason}
              </div>
            )}
          </div>
          {reasonInputs[task.id] !== undefined && (
            <div className="task-reason">
              <input
                type="text"
                placeholder="Add reason..."
                value={reasonInputs[task.id] || ''}
                onChange={(e) => {
                  // Update only local reason input state, don't save to schedule
                  setReasonInputs(prev => ({
                    ...prev,
                    [task.id]: e.target.value
                  }));
                }}
              />
              <div className="reason-actions">
                <button 
                  className="cancel-btn"
                  onClick={() => {
                    // Clear local reason input without changing task status
                    setReasonInputs(prev => {
                      const newInputs = { ...prev };
                      delete newInputs[task.id];
                      return newInputs;
                    });
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="save-btn"
                  onClick={() => {
                    const reason = reasonInputs[task.id] || '';
                    onTaskUpdate(task.id, false, reason);
                    // Clear local input after saving
                    setReasonInputs(prev => {
                      const newInputs = { ...prev };
                      delete newInputs[task.id];
                      return newInputs;
                    });
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
      
      {/* Add new task form */}
      {showAddTaskForm ? (
        <div style={{
          marginTop: '16px',
          marginBottom: '16px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          border: '1px solid #e9ecef',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h4 style={{
            margin: '0 0 16px 0',
            fontSize: '16px',
            fontWeight: '600',
            color: '#333'
          }}>Add New Task</h4>
          
          {/* Activity Name - First Row */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#555'
            }}>Activity Name</label>
            <input
              type="text"
              placeholder="Enter activity name..."
              value={newTaskName}
              onChange={e => setNewTaskName(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '14px',
                fontFamily: 'inherit',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={e => e.target.style.borderColor = '#2c7873'}
              onBlur={e => e.target.style.borderColor = '#ddd'}
            />
          </div>
          
          {/* Description - Second Row */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#555'
            }}>Description</label>
            <textarea
              placeholder="Enter task description..."
              value={newTaskDesc}
              onChange={e => setNewTaskDesc(e.target.value)}
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s ease'
              }}
              rows={3}
              onFocus={e => e.target.style.borderColor = '#2c7873'}
              onBlur={e => e.target.style.borderColor = '#ddd'}
            />
          </div>
          
          {/* Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px'
          }}>
            <button
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                background: '#f5f5f5',
                color: '#666',
                border: '1px solid #ddd',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => {
                setNewTaskName('');
                setNewTaskDesc('');
                setShowAddTaskForm(false);
              }}
              onMouseEnter={e => {
                (e.target as HTMLElement).style.backgroundColor = '#e9ecef';
                (e.target as HTMLElement).style.borderColor = '#adb5bd';
              }}
              onMouseLeave={e => {
                (e.target as HTMLElement).style.backgroundColor = '#f5f5f5';
                (e.target as HTMLElement).style.borderColor = '#ddd';
              }}
            >
              Cancel
            </button>
            <button
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                background: '#2c7873',
                color: 'white',
                border: 'none',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={handleAddTask}
              onMouseEnter={e => (e.target as HTMLElement).style.backgroundColor = '#1e5f5a'}
              onMouseLeave={e => (e.target as HTMLElement).style.backgroundColor = '#2c7873'}
            >
              Add Task
            </button>
          </div>
        </div>
      ) : (
        <button className="add-task-btn" onClick={() => setShowAddTaskForm(true)}>+ Add new task</button>
      )}
    </div>
  );
};

export default TasksSection;