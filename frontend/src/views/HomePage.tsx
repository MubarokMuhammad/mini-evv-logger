import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { scheduleAPI, statsAPI } from '../api.ts';
import { Schedule, Stats } from '../types.ts';
import { getCurrentLocation } from '../utils/geolocation.ts';
import '../index.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [activeVisit, setActiveVisit] = useState<Schedule | null>(null);
  const [timer, setTimer] = useState<string>('00:00:00');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [schedulesRes, statsRes] = await Promise.all([
        scheduleAPI.getAll(),
        statsAPI.get()
      ]);
      
      // Backend returns {success: true, message: "...", data: schedules}
      const schedules = schedulesRes.data.data || [];
      
      // Sort schedules consistently by date and time to prevent order changes
      const sortedSchedules = schedules.sort((a, b) => {
        // First sort by date
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA.getTime() - dateB.getTime();
        }
        
        // If dates are the same, sort by start time
        const timeA = a.startTime;
        const timeB = b.startTime;
        return timeA.localeCompare(timeB);
      });
      
      setSchedules(sortedSchedules);
      setStats(statsRes.data.data || {});
      
      // Find active visit
      const inProgress = schedules.find(s => s.status === 'in-progress');
      setActiveVisit(inProgress || null);
    } catch (error) {
      console.error('Error loading data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleClockIn = async (scheduleId: string) => {
    try {
      const clickTimestamp = new Date().toISOString();
      console.log('[DEBUG] Clock-in timestamp captured at button click:', clickTimestamp);
      const { latitude, longitude, address } = await getCurrentLocation(clickTimestamp);
      const locationData = { latitude, longitude, address, timestamp: clickTimestamp };
      await scheduleAPI.startVisit(scheduleId, locationData);
      loadData();
    } catch (error) {
      console.error('Error starting visit:', error);
      alert(error instanceof Error ? error.message : 'Error starting visit. Please try again.');
    }
  };

  const handleClockOut = async (schedule: Schedule) => {
    try {
      const clickTimestamp = new Date().toISOString();
      console.log('[DEBUG] Clock-out timestamp captured at button click:', clickTimestamp);
      const { latitude, longitude, address } = await getCurrentLocation(clickTimestamp);
      const locationData = { latitude, longitude, address, timestamp: clickTimestamp };
      await scheduleAPI.endVisit(schedule.id, locationData);
      loadData();
      navigate(`/schedules/clock-out/${schedule.id}`);
    } catch (error) {
      console.error('Error ending visit:', error);
      alert(error instanceof Error ? error.message : 'Error ending visit. Please try again.');
    }
  };

  useEffect(() => {
    loadData();
    
    const refreshInterval = setInterval(() => {
      loadData();
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    if (activeVisit && activeVisit.actualStartTime) {
      const interval = setInterval(() => {
        const start = new Date(activeVisit.actualStartTime!);
        const now = new Date();
        const diff = now.getTime() - start.getTime();
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setTimer(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [activeVisit]);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Scheduled';
      case 'in-progress': return 'In progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return '#616161';
      case 'in-progress': return '#ED6C02';
      case 'completed': return '#2E7D32';
      case 'cancelled': return '#D32F2F';
      case 'missed': return '#616161';
      default: return '#eee';
    }
  };

  if (loading) {
    return (
      <div className="app" style={{ paddingBottom: '80px' }}>
        <div className="header">
          <h1 className="welcome-text">Welcome Louis!</h1>
        </div>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app" style={{ paddingBottom: '80px' }}>
        <div className="header">
          <h1 className="welcome-text">Welcome Louis!</h1>
        </div>
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'red' }}>
          <div>Error: {error}</div>
          <button onClick={loadData} style={{ marginTop: '10px', padding: '8px 16px' }}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app" style={{ paddingBottom: '80px' }}>
      <div className="header">
        <h1 className="welcome-text">Welcome Louis!</h1>
      </div>

      {activeVisit && (
        <div style={{
          backgroundColor: '#295C59',
          borderRadius: '16px',
          padding: '16px',
          margin: '12px 0',
          color: 'white',
          position: 'relative'
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '12px',
            letterSpacing: '1px'
          }}>
            {timer}
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px'
          }}>
            <img 
              src="/default-profile.png" 
              alt="Profile" 
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                marginRight: '12px',
                border: '2px solid rgba(255,255,255,0.3)',
                objectFit: 'cover'
              }}
            />
            <div>
              <div style={{
                fontSize: '16px',
                fontWeight: '700',
                marginBottom: '2px'
              }}>
                {activeVisit.clientName}
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '8px',
            fontSize: '12px',
            opacity: 0.9
          }}>
            <img 
              src="/pinMapsIcon.png" 
              alt="Location" 
              style={{
                width: '14px',
                height: '14px',
                marginRight: '6px',
                filter: 'brightness(0) invert(1)'
              }}
            />
            {activeVisit?.startLocation?.address || activeVisit?.location?.address || 'Current location'}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '12px',
            fontSize: '12px',
            opacity: 0.9
          }}>
            <img 
              src="/timeIcon.png" 
              alt="Time" 
              style={{
                width: '14px',
                height: '14px',
                marginRight: '6px',
                filter: 'brightness(0) invert(1)'
              }}
            />
            {activeVisit.startTime} - {activeVisit.endTime} SGT
          </div>

          <button 
            onClick={() => navigate(`/schedules/clock-out/${activeVisit.id}`)}
            style={{
              backgroundColor: 'white',
              color: '#295C59',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              width: '100%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <img 
              src="/stopWatchIcon.png" 
              alt="Clock Out" 
              style={{
                width: '16px',
                height: '16px'
              }}
            />
            Clock-Out
          </button>
        </div>
      )}

      {stats && (
        <div style={{ margin: '12px 0' }}>
          {/* Top row - Missed Scheduled */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '8px',
            textAlign: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
            border: '1px solid #f5f5f5'
          }}>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#ff4757',
              marginBottom: '4px',
              lineHeight: '1'
            }}>
              {stats.missedSchedules}
            </div>
            <div style={{
              fontSize: '14px',
              color: '#666',
              fontWeight: '500'
            }}>
              Missed Scheduled
            </div>
          </div>
          
          {/* Bottom row - 2 cards */}
          <div style={{
            display: 'flex',
            gap: '8px'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center',
              flex: 1,
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              border: '1px solid #f5f5f5'
            }}>
              <div style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#ff7f50',
                marginBottom: '4px',
                lineHeight: '1'
              }}>
                {stats.upcomingToday}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#666',
                fontWeight: '500',
                lineHeight: '1.2'
              }}>
                Upcoming Today's Schedule
              </div>
            </div>
            
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center',
              flex: 1,
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              border: '1px solid #f5f5f5'
            }}>
              <div style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#2E7D32',
                marginBottom: '4px',
                lineHeight: '1'
              }}>
                {stats.completedToday}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#666',
                fontWeight: '500',
                lineHeight: '1.2'
              }}>
                Today's Completed Schedule
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="schedule-section">
        <div className="schedule-header">
          <h2 className="schedule-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            Schedule
            <span style={{ background: '#02CAD1', color: 'white', borderRadius: 12, fontSize: 14, fontWeight: 600, padding: '2px 10px', marginLeft: 6 }}>
              {schedules?.length || 0}
            </span>
          </h2>
          <Link to="/schedules" className="see-all">See All</Link>
        </div>

        {schedules && schedules.length > 0 ? (
          schedules.map((schedule) => (
            <div key={schedule.id} style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '12px',
              marginBottom: '8px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              border: '1px solid #f5f5f5',
              cursor: 'pointer'
            }} onClick={() => navigate(`/schedules/${schedule.id}`)}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <span style={{
                backgroundColor: getStatusColor(schedule.status),
                color: 'white',
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '11px',
                fontWeight: '600',
                textTransform: 'capitalize',
                letterSpacing: '0.3px'
              }}>
                {getStatusText(schedule.status)}
              </span>
              <span style={{
                fontSize: '16px',
                color: '#212121',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '50%',
                transition: 'background-color 0.2s'
              }} onClick={(e) => {
                e.stopPropagation();
                navigate(`/schedules/${schedule.id}`);
              }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>⋯</span>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <img 
                src="/default-profile.png" 
                alt="Profile" 
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  marginRight: '10px',
                  border: '2px solid #f8f8f8',
                  objectFit: 'cover'
                }}
              />
              <div>
                <div style={{
                  fontWeight: '700',
                  fontSize: '14px',
                  color: '#1a1a1a',
                  marginBottom: '2px',
                  lineHeight: '1.2'
                }}>
                  {schedule.clientName}
                </div>
                <div style={{
                  color: '#666',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {schedule.serviceName}
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              color: '#666',
              fontSize: '12px',
              marginBottom: '6px',
              fontWeight: '500'
            }}>
              <img 
                src="/pinMapCardIcon.png" 
                alt="Location" 
                style={{
                  width: '14px',
                  height: '14px',
                  marginRight: '6px'
                }}
              />
              {schedule.status === 'completed' && schedule.endLocation?.address 
                ? schedule.endLocation.address 
                : schedule.status === 'in-progress' && schedule.startLocation?.address 
                ? schedule.startLocation.address 
                : schedule.location?.address || 'Location not specified'}
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#f0f9ff',
              padding: '8px 12px',
              borderRadius: '8px',
              marginBottom: '10px',
              gap: '16px'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                color: '#0891b2',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                <img 
                  src="/dateCardIcon.png" 
                  alt="Date" 
                  style={{
                    width: '14px',
                    height: '14px',
                    marginRight: '6px'
                  }}
                />
                {schedule.date}
              </div>
              <div style={{
                width: '1px',
                height: '16px',
                backgroundColor: '#cbd5e1'
              }}></div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                color: '#0891b2',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                <img 
                  src="/timeCardIcon.png" 
                  alt="Time" 
                  style={{
                    width: '14px',
                    height: '14px',
                    marginRight: '6px'
                  }}
                />
                {schedule.startTime} - {schedule.endTime}
              </div>
            </div>

            <div className="schedule-actions">
              {schedule.status === 'scheduled' && (
                <button 
                  className="btn btn-primary"
                  onClick={() => handleClockIn(schedule.id)}
                  style={{
                    backgroundColor: '#295C59',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    width: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 4px rgba(41, 92, 89, 0.2)'
                  }}
                >
                  Clock-In Now
                </button>
              )}
              {schedule.status === 'in-progress' && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => navigate(`/schedules/${schedule.id}`)}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#295C59',
                      border: '1px solid #295C59',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      flex: 1,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    View Progress
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleClockOut(schedule)}
                    style={{
                      backgroundColor: '#295C59',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      flex: 1,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 1px 4px rgba(41, 92, 89, 0.2)'
                    }}
                  >
                    Clock-Out Now
                  </button>
                </div>
              )}
              {schedule.status === 'completed' && (
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate(`/schedules/${schedule.id}`)}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#295C59',
                    border: '1px solid #295C59',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    width: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  View Report
                </button>
              )}
            </div>
            </div>
          ))
        ) : (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
            color: '#666',
            marginBottom: '8px'
          }}>
            No schedules found
          </div>
        )}
      </div>

      <div className="bottom-nav">
        <Link to="/schedules" className="nav-item active">
          <img 
            src="/homeIcon.png" 
            alt="Home" 
            style={{
              width: '24px',
              height: '24px'
            }}
          />
          <span>Home</span>
        </Link>
        <Link to="/profile" className="nav-item">
          <img 
            src="/profileIcon.png" 
            alt="Profile" 
            style={{
              width: '24px',
              height: '24px'
            }}
          />
          <span>Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;