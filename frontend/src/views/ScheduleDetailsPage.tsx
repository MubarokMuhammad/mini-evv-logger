import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { scheduleAPI } from '../api.ts';
import { getCurrentLocation } from '../utils/geolocation.ts';

interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

interface Task {
  id: string;
  name: string;
  description: string;
  completed: boolean;
}

interface Schedule {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceName: string;
  date: string;
  startTime: string;
  endTime: string;
  location: Location;
  status: string;
  tasks: Task[];
  serviceNotes: string;
  actualStartTime?: string;
  actualEndTime?: string;
  startLocation?: Location;
  endLocation?: Location;
}

const ScheduleDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [clockingIn, setClockingIn] = useState(false);

  // Extract fetchSchedule function so it can be reused
  const fetchSchedule = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/schedules/${id}`);
      if (response.ok) {
        const data = await response.json();
        setSchedule(data.data);
      }
    } catch (error) {
      console.error('Error fetching schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSchedule();
    }
  }, [id]);

  // Redirect to Clock-Out page if status is in-progress
  useEffect(() => {
    if (schedule && schedule.status === 'in-progress') {
      navigate(`/schedules/clock-out/${id}`);
    }
  }, [schedule, id, navigate]);

  const handleClockIn = async () => {
    if (!schedule || clockingIn) return;
    
    setClockingIn(true);
    
    try {
      const clickTimestamp = new Date().toISOString();
      console.log('[DEBUG] Clock-in timestamp captured at button click:', clickTimestamp);
      const locationData = await getCurrentLocation(clickTimestamp);
      await scheduleAPI.startVisit(schedule.id, { ...locationData, timestamp: clickTimestamp });
      
      // Direct redirect to home page
      navigate('/');
      
    } catch (error: any) {
      console.error('[ERROR] Clock-in failed:', error);
      
      // Log detailed error information
      if (error.response) {
        console.error('[ERROR] Response status:', error.response.status);
        console.error('[ERROR] Response data:', error.response.data);
        console.error('[ERROR] Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('[ERROR] Request made but no response:', error.request);
      } else {
        console.error('[ERROR] Error setting up request:', error.message);
      }
      
      // Check if the error is actually a success (data was updated despite error)
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data?.error || '';
        
        // Handle specific error cases
        if (errorMessage.includes('not in scheduled status')) {
          console.log('[INFO] Detected "not in scheduled status" error, checking current status...');
          
          // Check current schedule status
          try {
            const checkResponse = await fetch(`http://localhost:8080/api/schedules/${schedule.id}`);
            if (checkResponse.ok) {
              const currentSchedule = await checkResponse.json();
              const currentStatus = currentSchedule.data.status;
              
              console.log(`[INFO] Current schedule status: ${currentStatus}`);
              
              // If status is in-progress or completed, redirect to home
              if (currentStatus === 'in-progress' || currentStatus === 'completed') {
                navigate('/');
                return;
              }
            }
          } catch (checkError) {
            console.error('[ERROR] Failed to check current schedule status:', checkError);
            // Still redirect to home on error
            navigate('/');
            return;
          }
        } else {
          // Wait a moment and check if the schedule was actually updated (for other 400 errors)
          setTimeout(async () => {
            try {
              const checkResponse = await fetch(`http://localhost:8080/api/schedules/${schedule.id}`);
              if (checkResponse.ok) {
                const updatedSchedule = await checkResponse.json();
                if (updatedSchedule.data.status === 'in-progress') {
                  console.log('[INFO] Schedule was actually updated successfully despite error');
                  navigate('/');
                  return;
                }
              }
            } catch (checkError) {
              console.error('[ERROR] Failed to verify schedule status:', checkError);
            }
            // Redirect to home even if verification fails
            navigate('/');
          }, 1000);
        }
      } else {
        // For non-400 errors, still redirect to home
        navigate('/');
      }
    } finally {
      setClockingIn(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div>Schedule not found</div>
      </div>
    );
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
          Schedule Details
        </h1>
      </div>

      <div style={{ 
        padding: '0 16px 20px 16px',
        maxWidth: '400px',
        margin: '0 auto'
      }}>
        {/* Service and Client Info */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '16px',
          marginTop: '16px',
          marginBottom: '12px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          border: '1px solid #f5f5f5'
        }}>
          <h2 style={{
            margin: '0 0 10px 0',
            fontSize: '16px',
            fontWeight: '600',
            color: '#333',
            textAlign: 'center'
          }}>
            {schedule.serviceName}
          </h2>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#e0e0e0',
              backgroundImage: 'url(/default-profile.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}></div>
            <span style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#333'
            }}>
              {schedule.clientName}
            </span>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: '#e3f2fd',
              padding: '8px 16px',
              borderRadius: '8px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <img src="/dateCardIcon.png" alt="Date" style={{ width: '16px', height: '16px' }} />
                <span style={{ fontSize: '14px', color: '#1976d2' }}>{schedule.date}</span>
              </div>
              <span style={{ fontSize: '14px', color: '#1976d2', opacity: 0.7 }}>|</span>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <img src="/timeCardIcon.png" alt="Time" style={{ width: '16px', height: '16px' }} />
                <span style={{ fontSize: '14px', color: '#1976d2' }}>
                  {schedule.startTime} - {schedule.endTime}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Client Contact */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '12px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          border: '1px solid #f5f5f5'
        }}>
          <h3 style={{
            margin: '0 0 12px 0',
            fontSize: '14px',
            fontWeight: '600',
            color: '#333'
          }}>
            Client Contact:
          </h3>
          
          <div style={{ marginBottom: '12px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '16px' }}>✉️</span>
              <span style={{ fontSize: '14px', color: '#666' }}>{schedule.clientEmail}</span>
            </div>
          </div>
          
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '16px' }}>📞</span>
              <span style={{ fontSize: '14px', color: '#666' }}>{schedule.clientPhone}</span>
            </div>
          </div>
        </div>

        {/* Address */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '12px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          border: '1px solid #f5f5f5'
        }}>
          <h3 style={{
            margin: '0 0 12px 0',
            fontSize: '16px',
            fontWeight: '600',
            color: '#333'
          }}>
            Address:
          </h3>
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: '#666',
            lineHeight: '1.4'
          }}>
            {schedule.location.address}
          </p>
        </div>

        {/* Tasks */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '12px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          border: '1px solid #f5f5f5'
        }}>
          <h3 style={{
            margin: '0 0 12px 0',
            fontSize: '14px',
            fontWeight: '600',
            color: '#333'
          }}>
            Tasks:
          </h3>
          
          {schedule.tasks.map((task, index) => (
            <div key={task.id} style={{ 
              marginBottom: index < schedule.tasks.length - 1 ? '20px' : '0',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              {/* Checkmark Status */}
              <div style={{
                marginTop: '2px',
                fontSize: '16px',
                minWidth: '20px'
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

        {/* Completed Status Information */}
        {schedule.status === 'completed' && schedule.endLocation && (
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
              color: '#2e7d32',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span>✅</span>
              <span>Visit Completed</span>
            </h3>
            
            {/* Clock-out Location Map */}
            <div style={{
              marginBottom: '16px',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid #e0e0e0'
            }}>
              <iframe
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${schedule.endLocation.longitude-0.01},${schedule.endLocation.latitude-0.01},${schedule.endLocation.longitude+0.01},${schedule.endLocation.latitude+0.01}&layer=mapnik&marker=${schedule.endLocation.latitude},${schedule.endLocation.longitude}`}
                width="100%"
                height="200"
                style={{ border: 'none' }}
                title="Clock-out Location"
              />
            </div>
            
            {/* Clock-out Address */}
            <div style={{
              marginBottom: '12px',
              padding: '12px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '4px'
              }}>
                <span style={{ fontSize: '16px' }}>📍</span>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333'
                }}>
                  Clock-out Location:
                </span>
              </div>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: '#666',
                lineHeight: '1.4',
                paddingLeft: '24px'
              }}>
                {schedule.endLocation.address || `${schedule.endLocation.latitude.toFixed(6)}, ${schedule.endLocation.longitude.toFixed(6)}`}
              </p>
            </div>
            
            {/* Clock-out Timestamp */}
            <div style={{
              padding: '12px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ fontSize: '16px' }}>🕐</span>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333'
                }}>
                  Clocked out at:
                </span>
                <span style={{
                  fontSize: '14px',
                  color: '#666'
                }}>
                  {schedule.actualEndTime ? new Date(schedule.actualEndTime).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  }) : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Service Notes */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          border: '1px solid #f5f5f5'
        }}>
          <h3 style={{
            margin: '0 0 12px 0',
            fontSize: '16px',
            fontWeight: '600',
            color: '#333'
          }}>
            Service Notes
          </h3>
          <p style={{
            margin: 0,
            fontSize: '13px',
            color: '#666',
            lineHeight: '1.4'
          }}>
            {schedule.serviceNotes}
          </p>
        </div>

        {/* Action Buttons Based on Status */}
        {schedule.status === 'scheduled' && (
          <button
            onClick={handleClockIn}
            disabled={clockingIn}
            style={{
              width: '100%',
              backgroundColor: clockingIn ? '#ccc' : '#295C59',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: clockingIn ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!clockingIn) e.currentTarget.style.backgroundColor = '#1e4340';
            }}
            onMouseLeave={(e) => {
              if (!clockingIn) e.currentTarget.style.backgroundColor = '#295C59';
            }}
          >
            {clockingIn ? 'Getting Location...' : 'Clock-In Now'}
          </button>
        )}

        {/* No buttons for completed and cancelled status */}
      </div>
    </div>
  );
};

export default ScheduleDetailsPage;