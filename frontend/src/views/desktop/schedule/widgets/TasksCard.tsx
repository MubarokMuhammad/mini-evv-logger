import React from 'react';

interface Task {
  id: string;
  name: string;
  description: string;
  completed: boolean;
}

interface TasksCardProps {
  tasks: Task[];
}

export const TasksCard: React.FC<TasksCardProps> = ({ tasks }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      border: '1px solid #f0f0f0'
    }}>
      <h3 style={{
        margin: '0 0 20px 0',
        fontSize: '18px',
        fontWeight: '700',
        color: '#1a1a1a'
      }}>
        Tasks
      </h3>
      
      {tasks.map((task, index) => (
        <div key={task.id} style={{ 
          marginBottom: index < tasks.length - 1 ? '24px' : '0',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '16px'
        }}>
          {/* Checkmark Status */}
          <div style={{
            marginTop: '2px',
            fontSize: '20px',
            minWidth: '24px'
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
              fontSize: '16px',
              fontWeight: '600',
              color: task.completed ? '#4caf50' : '#295C59',
              textDecoration: task.completed ? 'line-through' : 'none'
            }}>
              {task.name}
            </h4>
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: task.completed ? '#999' : '#666',
              lineHeight: '1.5'
            }}>
              {task.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};