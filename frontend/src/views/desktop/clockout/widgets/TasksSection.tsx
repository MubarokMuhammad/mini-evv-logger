import React from 'react';
import { Schedule } from '../../../../hooks/types';
import { taskAPI } from '../../../../services/api';

interface TasksSectionProps {
  schedule: Schedule;
  userInteractedTasks: { [key: string]: boolean };
  setUserInteractedTasks: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  reasonInputs: { [key: string]: string };
  setReasonInputs: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  showAddTaskForm: boolean;
  setShowAddTaskForm: React.Dispatch<React.SetStateAction<boolean>>;
  newTaskName: string;
  setNewTaskName: React.Dispatch<React.SetStateAction<string>>;
  newTaskDesc: string;
  setNewTaskDesc: React.Dispatch<React.SetStateAction<string>>;
  setSchedule: React.Dispatch<React.SetStateAction<Schedule | null>>;
  handleTaskUpdate: (taskId: string, completed: boolean, reason?: string) => void;
  id: string;
}

const TasksSection: React.FC<TasksSectionProps> = ({
  schedule,
  userInteractedTasks,
  setUserInteractedTasks,
  reasonInputs,
  setReasonInputs,
  showAddTaskForm,
  setShowAddTaskForm,
  newTaskName,
  setNewTaskName,
  newTaskDesc,
  setNewTaskDesc,
  setSchedule,
  handleTaskUpdate,
  id
}) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '32px',
      marginBottom: '32px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        marginBottom: '24px'
      }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#333',
          margin: '0 0 8px 0'
        }}>Tasks:</h3>
        <p style={{
          fontSize: '14px',
          color: '#666',
          margin: 0
        }}>
          Please tick the tasks that you have done
        </p>
      </div>

      {(schedule.tasks || []).map((task) => (
        <div key={task.id} style={{ marginBottom: '16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            padding: '16px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: '#fafafa'
          }}>
            <div style={{ flex: 1 }}>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#333',
                margin: '0 0 8px 0'
              }}>{task.name}</h4>
              <p style={{
                fontSize: '14px',
                color: '#666',
                margin: 0,
                lineHeight: '1.4'
              }}>{task.description}</p>
            </div>
            <div style={{
              display: 'flex',
              gap: '8px',
              marginLeft: '16px'
            }}>
              <button 
                onClick={() => handleTaskUpdate(task.id, true)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #2c7873',
                  backgroundColor: (userInteractedTasks[task.id] && task.completed === true) ? '#2c7873' : 'white',
                  color: (userInteractedTasks[task.id] && task.completed === true) ? 'white' : '#2c7873',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
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
                  handleTaskUpdate(task.id, false);
                  // Start reason input mode
                  setReasonInputs(prev => ({
                    ...prev,
                    [task.id]: task.reason || ''
                  }));
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #dc3545',
                  backgroundColor: ((userInteractedTasks[task.id] && task.completed === false) || reasonInputs[task.id] !== undefined) ? '#dc3545' : 'white',
                  color: ((userInteractedTasks[task.id] && task.completed === false) || reasonInputs[task.id] !== undefined) ? 'white' : '#dc3545',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                No
              </button>
            </div>
          </div>
          {task.completed === false && task.reason && !reasonInputs[task.id] && (
            <div style={{
              marginTop: '8px',
              padding: '12px',
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '6px',
              fontSize: '14px',
              color: '#856404'
            }}>
              <strong>Reason: </strong>{task.reason}
            </div>
          )}
          {reasonInputs[task.id] !== undefined && (
            <div style={{
              marginTop: '8px',
              padding: '16px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '6px'
            }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#333',
                marginBottom: '8px'
              }}>Please provide a reason:</label>
              <textarea
                value={reasonInputs[task.id]}
                onChange={(e) => setReasonInputs(prev => ({ ...prev, [task.id]: e.target.value }))}
                placeholder="Enter reason for not completing this task..."
                style={{
                  width: '100%',
                  minHeight: '80px',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  resize: 'vertical',
                  marginBottom: '12px'
                }}
              />
              <div style={{
                display: 'flex',
                gap: '8px',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={() => {
                    setReasonInputs(prev => {
                      const newInputs = { ...prev };
                      delete newInputs[task.id];
                      return newInputs;
                    });
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    backgroundColor: '#f5f5f5',
                    color: '#666',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const reason = reasonInputs[task.id].trim();
                    if (!reason) {
                      alert('Please provide a reason.');
                      return;
                    }
                    handleTaskUpdate(task.id, false, reason);
                    setReasonInputs(prev => {
                      const newInputs = { ...prev };
                      delete newInputs[task.id];
                      return newInputs;
                    });
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add Task Section */}
      {showAddTaskForm ? (
        <div style={{
          marginTop: '24px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '8px'
        }}>
          <h4 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '16px'
          }}>Add New Task</h4>
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#333',
              marginBottom: '6px'
            }}>Activity Name:</label>
            <input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="Enter activity name"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#333',
              marginBottom: '6px'
            }}>Description:</label>
            <textarea
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
              placeholder="Enter activity description"
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </div>
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
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
              onClick={async () => {
                const name = newTaskName.trim();
                const desc = newTaskDesc.trim();
                if (!name || !desc) {
                  alert('Please fill in both activity name and description.');
                  return;
                }
                
                try {
                  console.log('Creating task with:', { name, description: desc });
                  const response = await taskAPI.create(id!, { name, description: desc });
                  console.log('Full response:', response);
                  console.log('Response data:', response.data);
                  
                  // Update local state with the new task from backend
                  // Backend returns { success: true, message: "...", data: task }
                  const newTask = response.data.data;
                  console.log('New task to add:', newTask);
                  setSchedule(sch => {
                    if (sch) {
                      const updatedSchedule = { ...sch, tasks: [...(sch.tasks || []), newTask] };
                      console.log('Updated schedule:', updatedSchedule);
                      return updatedSchedule;
                    }
                    return sch;
                  });
                  
                  setNewTaskName('');
                  setNewTaskDesc('');
                  setShowAddTaskForm(false);
                } catch (error) {
                  console.error('Error creating task:', error);
                  alert('Error creating task. Please try again.');
                }
              }}
              onMouseEnter={e => (e.target as HTMLElement).style.backgroundColor = '#1e5f5a'}
              onMouseLeave={e => (e.target as HTMLElement).style.backgroundColor = '#2c7873'}
            >
              Add Task
            </button>
          </div>
        </div>
      ) : (
        <button 
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '2px dashed #2c7873',
            backgroundColor: 'transparent',
            color: '#2c7873',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginTop: '16px'
          }}
          onClick={() => setShowAddTaskForm(true)}
          onMouseEnter={e => {
            (e.target as HTMLElement).style.backgroundColor = '#f0f8f7';
            (e.target as HTMLElement).style.borderColor = '#1e5f5a';
          }}
          onMouseLeave={e => {
            (e.target as HTMLElement).style.backgroundColor = 'transparent';
            (e.target as HTMLElement).style.borderColor = '#2c7873';
          }}
        >
          + Add new task
        </button>
      )}
    </div>
  );
};

export default TasksSection;