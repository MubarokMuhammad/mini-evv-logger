import React from 'react';

interface Task {
  id: string;
  name: string;
  description: string;
  completed: boolean;
}

interface ScheduleTaskListProps {
  tasks: Task[];
}

const ScheduleTaskList: React.FC<ScheduleTaskListProps> = ({ tasks }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '12px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      border: '1px solid #f5f5f5'
    }}>
      <h3 style={{
        margin: '0 0 16px 0',
        fontSize: '16px',
        fontWeight: '600',
        color: '#333'
      }}>
        Tasks to Complete
      </h3>
      
      {tasks.map((task) => (
        <div key={task.id} style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          marginBottom: '16px',
          padding: '12px',
          backgroundColor: task.completed ? '#f8f9fa' : '#fff',
          borderRadius: '8px',
          border: task.completed ? '1px solid #e9ecef' : '1px solid #f0f0f0'
        }}>          
          {/* Task Status Icon */}
          <div style={{
            marginTop: '2px',
            fontSize: '16px'
          }}>
            {task.completed ? (
              <span style={{ color: '#4caf50' }}>✅</span>
            ) : (
              <span style={{ color: '#ddd' }}>⭕</span>
            )}
          </div>
          
          {/* Task Content */}
          <div style={{ flex: 1 }}>
            <h4 style={{
              margin: '0 0 8px 0',
              fontSize: '14px',
              fontWeight: '600',
              color: task.completed ? '#4caf50' : '#295C59',
              textDecoration: task.completed ? 'line-through' : 'none'
            }}>
              {task.name}
            </h4>
            <p style={{
              margin: 0,
              fontSize: '13px',
              color: task.completed ? '#999' : '#666',
              lineHeight: '1.4'
            }}>
              {task.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScheduleTaskList;