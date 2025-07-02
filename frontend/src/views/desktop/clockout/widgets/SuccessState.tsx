import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Schedule } from '../../../../hooks/types';

interface SuccessStateProps {
  schedule: Schedule;
  duration: string | null;
}

const SuccessState: React.FC<SuccessStateProps> = ({ schedule, duration }) => {
  const navigate = useNavigate();

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '48px',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        maxWidth: '500px',
        width: '90%'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: '#2c7873',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px auto'
        }}>
          <span style={{
            fontSize: '40px',
            color: 'white'
          }}>✓</span>
        </div>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '600',
          color: '#333',
          marginBottom: '16px'
        }}>
          Successfully Clocked Out!
        </h2>
        <p style={{
          fontSize: '16px',
          color: '#666',
          marginBottom: '20px'
        }}>
          Your visit has been completed.
        </p>
        {duration && (
          <>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <img 
                src="/dateCardIcon.png" 
                alt="Date" 
                style={{
                  width: '16px',
                  height: '16px',
                  marginRight: '8px'
                }}
              />
              <span style={{
                fontSize: '14px',
                color: '#333',
                fontWeight: '500'
              }}>
                {new Date(schedule.actualEndTime || '').toLocaleDateString('en-US', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>

            <div style={{
               display: 'flex',
               alignItems: 'flex-start',
               marginBottom: '20px'
             }}>
               <img 
                 src="/timeCardIcon.png" 
                 alt="Time" 
                 style={{
                   width: '16px',
                   height: '16px',
                   marginRight: '8px',
                   marginTop: '1px'
                 }}
               />
               <div>
                 <div style={{
                   fontSize: '14px',
                   color: '#333',
                   fontWeight: '500',
                   marginBottom: '2px'
                 }}>
                   {schedule.startTime && !isNaN(new Date(schedule.startTime).getTime()) 
                      ? new Date(schedule.startTime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false
                        })
                      : '10:30'
                    } - {schedule.actualEndTime && !isNaN(new Date(schedule.actualEndTime).getTime())
                      ? new Date(schedule.actualEndTime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false
                        })
                      : '12:00'
                    } SGT
                 </div>
                 <div style={{
                   fontSize: '14px',
                   color: '#333',
                   fontWeight: '500'
                 }}>
                   ({duration})
                 </div>
               </div>
             </div>
          </>
        )}
        <button
          onClick={() => navigate('/')}
          style={{
            backgroundColor: '#2c7873',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={e => (e.target as HTMLElement).style.backgroundColor = '#1e5f5a'}
          onMouseLeave={e => (e.target as HTMLElement).style.backgroundColor = '#2c7873'}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default SuccessState;