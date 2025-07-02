import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { scheduleAPI, statsAPI } from '../api.ts';
import { Schedule, Stats } from '../types.ts';
import { getCurrentLocation } from '../utils/geolocation.ts';

const DesktopDashboard: React.FC = () => {
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
      
      const schedules = schedulesRes.data.data || [];
      const sortedSchedules = schedules.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA.getTime() - dateB.getTime();
        }
        return a.startTime.localeCompare(b.startTime);
      });
      
      setSchedules(sortedSchedules);
      setStats(statsRes.data.data || {});
      
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

  if (loading) {
    return <div className="desktop-loading">Loading...</div>;
  }

  if (error) {
    return <div className="desktop-error">Error: {error}</div>;
  }

  const todaySchedules = schedules.filter(schedule => {
    const today = new Date().toISOString().split('T')[0];
    return schedule.date === today;
  }).slice(0, 4);

  return (
    <div className="desktop-dashboard">
      {/* Active Visit Card */}
      {activeVisit && (
        <div className="desktop-active-visit">
          <div className="active-visit-content">
            <div className="timer-section">
              <div className="timer-display">{timer}</div>
            </div>
            <div className="visit-details">
              <div className="client-info">
                <img 
                  src="/default-profile.png" 
                  alt={activeVisit.clientName} 
                  className="client-avatar"
                />
                <span className="client-name">{activeVisit.clientName}</span>
              </div>
              <div className="visit-location">
                <span className="location-icon">📍</span>
                <span className="location-text">{activeVisit.address}</span>
              </div>
              <div className="visit-time">
                <span className="time-icon">🕐</span>
                <span className="time-text">{activeVisit.startTime} - {activeVisit.endTime} SGT</span>
              </div>
            </div>
            <div className="visit-actions">
              <button 
                className="clock-out-btn"
                onClick={() => handleClockOut(activeVisit)}
              >
                Clock Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="desktop-stats">
        <div className="stat-card missed">
          <div className="stat-number">{stats?.missedScheduled || 7}</div>
          <div className="stat-label">Missed Scheduled</div>
        </div>
        <div className="stat-card upcoming">
          <div className="stat-number">{stats?.upcomingTodaySchedule || 12}</div>
          <div className="stat-label">Upcoming Today's Schedule</div>
        </div>
        <div className="stat-card completed">
          <div className="stat-number">{stats?.todayCompletedSchedule || 5}</div>
          <div className="stat-label">Today's Completed Schedule</div>
        </div>
      </div>

      {/* Schedule Section */}
      <div className="desktop-schedule-section">
        <div className="section-header">
          <h2 className="section-title">Schedule</h2>
          <span className="schedule-count">{schedules.length}</span>
        </div>
        
        <div className="schedule-list">
          {todaySchedules.map((schedule) => (
            <div key={schedule.id} className="desktop-schedule-card">
              <div className="schedule-status">
                <span className={`status-badge ${schedule.status}`}>
                  {schedule.status === 'scheduled' && 'Scheduled'}
                  {schedule.status === 'in-progress' && 'In Progress'}
                  {schedule.status === 'completed' && 'Completed'}
                  {schedule.status === 'cancelled' && 'Cancelled'}
                </span>
              </div>
              
              <div className="schedule-content">
                <div className="client-section">
                  <img 
                    src="/default-profile.png" 
                    alt={schedule.clientName} 
                    className="client-avatar"
                  />
                  <div className="client-details">
                    <div className="client-name">{schedule.clientName}</div>
                    <div className="service-name">{schedule.serviceName}</div>
                  </div>
                </div>
                
                <div className="schedule-info">
                  <div className="location-info">
                    <span className="location-icon">📍</span>
                    <span className="location-text">{schedule.address}</span>
                  </div>
                  
                  <div className="time-info">
                    <div className="date-info">
                      <span className="date-icon">📅</span>
                      <span className="date-text">{new Date(schedule.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div className="time-range">
                      <span className="time-icon">🕐</span>
                      <span className="time-text">{schedule.startTime} - {schedule.endTime}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="schedule-actions">
                {schedule.status === 'scheduled' && (
                  <button 
                    className="clock-in-btn"
                    onClick={() => handleClockIn(schedule.id)}
                  >
                    Clock In Now
                  </button>
                )}
                {schedule.status === 'in-progress' && (
                  <button 
                    className="view-progress-btn"
                    onClick={() => navigate(`/schedules/clock-out/${schedule.id}`)}
                  >
                    View Progress
                  </button>
                )}
                {schedule.status === 'completed' && (
                  <button 
                    className="view-report-btn"
                    onClick={() => navigate(`/schedules/${schedule.id}`)}
                  >
                    View Report
                  </button>
                )}
                <div className="more-actions">⋯</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DesktopDashboard;