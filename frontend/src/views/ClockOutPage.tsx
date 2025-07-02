import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Schedule, Task } from '../types.ts';
import { taskAPI } from '../api.ts';
import { getCurrentLocation } from '../utils/geolocation.ts';

const initialSchedule: Schedule = {
  id: '',
  clientName: '',
  serviceName: '',
  date: '',
  startTime: '',
  endTime: '',
  status: 'scheduled',
  location: {
    latitude: 0,
    longitude: 0,
    address: ''
  },
  startLocation: undefined,
  endLocation: undefined,
  actualStartTime: undefined,
  actualEndTime: undefined,
  clientEmail: undefined,
  clientPhone: undefined,
  serviceNotes: undefined,
  tasks: []
};

const ClockOutPage: React.FC = () => {
  // --- Inline Reason State ---
  const [showReasonForTask, setShowReasonForTask] = useState<{ [taskId: string]: boolean }>({});
  const [reasonInputs, setReasonInputs] = useState<{ [taskId: string]: string }>({});
  // --- Task Interaction State ---
  const [userInteractedTasks, setUserInteractedTasks] = useState<{ [taskId: string]: boolean }>({});
  // --- Add Task State ---
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState<Schedule>(initialSchedule);
  const [timer, setTimer] = useState<string>('00:00:00');
  const [showSuccess, setShowSuccess] = useState(false);
  const [duration, setDuration] = useState<string>('');

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/schedules/${id}`);
        if (response.ok) {
          const data = await response.json();
          setSchedule({
            ...data.data,
            tasks: data.data.tasks || []
          });
        }
      } catch (error) {
        console.error('Error loading schedule:', error);
      }
    };
    loadSchedule();
  }, [id]);

  useEffect(() => {
    if (schedule && schedule.actualStartTime) {
      const interval = setInterval(() => {
        const start = new Date(schedule.actualStartTime!);
        const now = new Date();
        const diff = now.getTime() - start.getTime();
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setTimer(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [schedule]);

  const handleTaskUpdate = async (taskId: string, completed: boolean, reason?: string) => {
    try {
      console.log('handleTaskUpdate called with:', { taskId, completed, reason });
      await taskAPI.update(taskId, { completed, reason });
      console.log('API call successful');
      
      // Mark task as user-interacted
      setUserInteractedTasks(prev => ({
        ...prev,
        [taskId]: true
      }));
      
      if (schedule) {
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
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleClockOut = async () => {
    if (!schedule || !id) return;

    try {
      console.log('[DEBUG] Getting location for clock-out...');
      const clickTimestamp = new Date().toISOString();
      console.log('[DEBUG] Clock-out timestamp captured at button click:', clickTimestamp);
      const locationData = await getCurrentLocation(clickTimestamp);
      console.log('[DEBUG] Clock-out location captured:', locationData);
      
      console.log('[DEBUG] Sending clock-out request for schedule:', id);
      const endResponse = await fetch(`http://localhost:8080/api/schedules/${id}/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          address: locationData.address,
          timestamp: locationData.timestamp
        }),
      });
      
      if (!endResponse.ok) {
        const errorData = await endResponse.json().catch(() => ({}));
        console.error('[ERROR] Clock-out failed:', {
          status: endResponse.status,
          statusText: endResponse.statusText,
          error: errorData
        });
        
        // Check if the error is because schedule is already completed
        if (endResponse.status === 400 && (errorData.error === 'Schedule is not in progress' || 
            errorData.error === 'cannot end visit for schedule with status: completed')) {
          console.log('[INFO] Schedule is already completed, checking current status...');
          
          // Wait a moment and check if the schedule is actually completed
          setTimeout(async () => {
            try {
              const checkResponse = await fetch(`http://localhost:8080/api/schedules/${id}`);
              if (checkResponse.ok) {
                const updatedSchedule = await checkResponse.json();
                if (updatedSchedule.data.status === 'completed') {
                  console.log('[INFO] Schedule is already completed successfully');
                  
                  // Calculate duration if possible
                  if (schedule.actualStartTime) {
                    const start = new Date(schedule.actualStartTime);
                    const end = new Date(locationData.timestamp);
                    const diff = end.getTime() - start.getTime();
                    const hours = Math.floor(diff / (1000 * 60 * 60));
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    setDuration(`${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`);
                  }
                  
                  setShowSuccess(true);
                  return;
                }
              }
            } catch (checkError) {
              console.error('[ERROR] Failed to verify schedule status:', checkError);
            }
          }, 500);
          
          return; // Don't show error alert yet, wait for verification
        }
        
        throw new Error(`Failed to end visit: ${errorData.error || endResponse.statusText}`);
      }
      
      console.log('[SUCCESS] Clock-out successful');
      
      // Calculate duration
      if (schedule.actualStartTime) {
        const start = new Date(schedule.actualStartTime);
        const end = new Date(locationData.timestamp);
        const diff = end.getTime() - start.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setDuration(`${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`);
      }
      
      setShowSuccess(true);
    } catch (error: any) {
      console.error('[ERROR] Clock-out error:', error);
      alert(`Error ending visit: ${error.message}. Please try again.`);
    }
  };

  const handleCancelClockIn = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/schedules/${id}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cancelledAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        // Navigate back to home after successful cancellation
        navigate('/');
      } else {
        console.error('Failed to cancel schedule');
        // Still navigate back even if API fails
        navigate('/');
      }
    } catch (error) {
      console.error('Error cancelling schedule:', error);
      // Still navigate back even if there's an error
      navigate('/');
    }
  };

  if (showSuccess) {
    return (
      <div className="success-modal">
        {/* Close button */}
        <button 
          className="close-btn"
          onClick={() => navigate('/')}
        >
          ×
        </button>
        
        {/* Celebration animation */}
        <div className="celebration">
          <div className="confetti"></div>
          <div className="confetti"></div>
          <div className="confetti"></div>
          <div className="confetti"></div>
          <div className="confetti"></div>
          <div className="confetti"></div>
        </div>
        
        <div className="success-icon">
          <img 
            src="/scheduleCompleteIcon.png" 
            alt="Schedule Complete" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        </div>
        <h2 className="success-title">Schedule Completed</h2>
        
        {/* Compact info card */}
        <div className="success-details">
          <div className="detail-row">
            <span className="detail-icon">📅</span>
            <span>Mon, 15 January 2025</span>
          </div>
          <div className="detail-row">
            <span className="detail-icon">🕐</span>
            <span>10:30 - 11:30 SGT</span>
          </div>
          <div className="detail-row duration">
            <span>({duration || '1 hour'})</span>
          </div>
        </div>
        
        <button className="home-btn" onClick={() => navigate('/')}>
          Go to Home
        </button>
      </div>
    );
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
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        padding: '16px',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        maxWidth: '400px',
        margin: '0 auto'
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '4px',
            position: 'absolute',
            left: '16px'
          }}
        >
          ←
        </button>
        <h1 style={{
          margin: 0,
          fontSize: '18px',
          fontWeight: '600',
          color: '#333'
        }}>
          Clock-Out
        </h1>
      </div>

      <div style={{ 
        padding: '0 16px 20px 16px',
        maxWidth: '400px',
        margin: '0 auto'
      }}>
      
      {/* Timer */}
      <div style={{
        textAlign: 'center',
        fontSize: '32px',
        fontWeight: '700',
        color: '#333',
        margin: '30px 0',
        letterSpacing: '1px'
      }}>
        {timer}
      </div>

      {/* Service and Client Info Card */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        {/* Service Name */}
        <div style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#2c7873',
          marginBottom: '16px'
        }}>
          {schedule.serviceName}
        </div>

        {/* Client Info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}>
          <img 
            src="/default-profile.png" 
            alt="Client Profile" 
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IiNkZGQiLz4KPHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxNSIgeT0iMTUiPgo8cGF0aCBkPSJNMTAgNi42NjY2N0MxMC45MTY3IDYuNjY2NjcgMTEuNjY2NyA3LjQxNjY3IDExLjY2NjcgOC4zMzMzM0MxMS42NjY3IDkuMjUgMTAuOTE2NyAxMCAxMCAxMEM5LjA4MzMzIDEwIDguMzMzMzMgOS4yNSA4LjMzMzMzIDguMzMzMzNDOC4zMzMzMyA3LjQxNjY3IDkuMDgzMzMgNi42NjY2NyAxMCA2LjY2NjY3Wk0xMCAxMS4yNUMxMS40NTgzIDExLjI1IDEzLjk1ODMgMTEuOTc5MiAxMy45NTgzIDEzLjQzNzVWMTQuNTgzM0g2LjA0MTY3VjEzLjQzNzVDNi4wNDE2NyAxMS45NzkyIDguNTQxNjcgMTEuMjUgMTAgMTEuMjVaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+Cg==';
            }}
          />
          <div style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#333'
          }}>
            {schedule.clientName}
          </div>
        </div>
      </div>

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
                    onClick={() => handleTaskUpdate(task.id, true)}
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
                      handleTaskUpdate(task.id, false);
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
                      handleTaskUpdate(task.id, false, reason);
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
          <button className="add-task-btn" onClick={() => setShowAddTaskForm(true)}>+ Add new task</button>
        )}
      </div>

      <div className="location-section">
        <h3>Clock-In Location</h3>
        {schedule.startLocation && schedule.startLocation.latitude && schedule.startLocation.longitude ? (
          <>
            <div className="location-map" style={{
              width: '100%',
              height: '200px',
              borderRadius: '8px',
              overflow: 'hidden',
              marginBottom: '10px'
            }}>
              <iframe
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${schedule.startLocation.longitude - 0.01},${schedule.startLocation.latitude - 0.01},${schedule.startLocation.longitude + 0.01},${schedule.startLocation.latitude + 0.01}&layer=mapnik&marker=${schedule.startLocation.latitude},${schedule.startLocation.longitude}`}
                width="100%"
                height="200"
                style={{ border: 'none' }}
                title="Clock-in Location Map"
              />
            </div>
            <p style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>
              {schedule.startLocation.address || `${schedule.startLocation.latitude.toFixed(6)}, ${schedule.startLocation.longitude.toFixed(6)}`}
            </p>
            {schedule.startLocation.timestamp && (
              <p style={{ fontSize: '11px', color: '#999', textAlign: 'center', marginTop: '5px' }}>
                Clocked in at: {new Date(schedule.startLocation.timestamp).toLocaleString()}
              </p>
            )}
          </>
        ) : (
          <>
            <div className="location-map" style={{
              width: '100%',
              height: '200px',
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              marginBottom: '10px'
            }}>
              <span style={{ color: '#666' }}>Location not available</span>
            </div>
            <p style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>
              Location data not captured
            </p>
          </>
        )}
      </div>

      <div className="location-section">
        <h3>Service Notes:</h3>
        <p style={{ fontSize: '14px', lineHeight: '1.5', marginTop: '10px' }}>
          {schedule.serviceNotes}
        </p>
      </div>

      <div className="action-buttons">
        <button className="action-btn btn-cancel" onClick={handleCancelClockIn}>
          Cancel Clock-In
        </button>
        <button className="action-btn btn-complete" onClick={handleClockOut}>
          Clock-Out
        </button>
      </div>
      </div>
    </div>
  );
};

export default ClockOutPage;