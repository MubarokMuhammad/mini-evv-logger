import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Schedule } from '../hooks/types';
import { scheduleAPI } from '../services/api';

const ScheduleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState<Schedule | null>(null);

  useEffect(() => {
    if (id) {
      loadSchedule(id);
    }
  }, [id]);

  const loadSchedule = async (scheduleId: string) => {
    try {
      const response = await scheduleAPI.getById(scheduleId);
      setSchedule(response.data);
    } catch (error) {
      console.error('Error loading schedule:', error);
    }
  };

  const handleClockIn = async () => {
    if (!schedule || !id) return;

    try {
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by this browser.');
        return;
      }

      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          await scheduleAPI.startVisit(id, { latitude, longitude });
          navigate('/'); // Go back to home
        } catch (error) {
          console.error('Error starting visit:', error);
          alert('Error starting visit. Please try again.');
        }
      }, (error) => {
        console.error('Geolocation error:', error);
        alert('Unable to get your location. Please enable location services.');
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!schedule) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <div className="schedule-details">
        <div className="details-header">
          <button className="back-btn" onClick={() => navigate('/')}>
          ←
        </button>
        <h2>Visit Details</h2>
      </div>
      
      <div className="caregiver-info">
        <img 
          src="/default-profile.jpg" 
          alt="Caregiver Profile" 
          className="profile-photo"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiMyYzc4NzMiLz4KPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxMiIgeT0iMTIiPgo8cGF0aCBkPSJNOCA1LjMzMzMzQzguNzMzMzMgNS4zMzMzMyA5LjMzMzMzIDUuOTMzMzMgOS4zMzMzMyA2LjY2NjY3QzkuMzMzMzMgNy40IDguNzMzMzMgOCA4IDhDNy4yNjY2NyA4IDYuNjY2NjcgNy40IDYuNjY2NjcgNi42NjY2N0M2LjY2NjY3IDUuOTMzMzMgNy4yNjY2NyA1LjMzMzMzIDggNS4zMzMzM1pNOCA5QzkuMTY2NjcgOSAxMS4xNjY3IDkuNTgzMzMgMTEuMTY2NyAxMC43NVYxMS4xNjY3SDQuODMzMzNWMTAuNzVDNC44MzMzMyA5LjU4MzMzIDYuODMzMzMgOSA4IDlaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+Cg==';
          }}
        />
        <div>
          <div className="caregiver-name">Sarah Johnson</div>
          <div className="caregiver-role">Visiting {schedule?.clientName}</div>
        </div>
      </div>

        <div className="client-section">
          <h3 style={{ color: '#2c7873', marginBottom: '15px' }}>{schedule.serviceName}</h3>
          <div className="client-info-card">
            <div className="client-avatar"></div>
            <div className="client-details">
              <h3>{schedule.clientName}</h3>
            </div>
          </div>

          <div className="schedule-time" style={{ marginBottom: '15px' }}>
            <span>📅</span>
            <span>{schedule.date}</span>
            <span style={{ margin: '0 10px' }}>|</span>
            <span>🕐</span>
            <span>{schedule.startTime} - {schedule.endTime}</span>
          </div>

          <div className="contact-info">
            <h4>Client Contact:</h4>
            <div className="contact-item">
              <span>✉️</span>
              <span>{schedule.clientEmail}</span>
            </div>
            <div className="contact-item">
              <span>📞</span>
              <span>{schedule.clientPhone}</span>
            </div>
          </div>

          <div className="address-section">
            <h4>Address:</h4>
            <p style={{ fontSize: '14px', color: '#666' }}>{schedule.location.address}</p>
          </div>
        </div>

        <div className="tasks-list">
          <h3>Tasks:</h3>
          {schedule.tasks?.map((task, index) => (
            <div key={task.id} className="task-item">
              <div className="task-content">
                <h4>{task.name}</h4>
                <p>{task.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="service-notes">
          <h3>Service Notes:</h3>
          <p>{schedule.serviceNotes}</p>
        </div>

        {schedule.status === 'scheduled' && (
          <button 
            className="action-btn btn-primary"
            onClick={handleClockIn}
            style={{ position: 'fixed', bottom: '20px', left: '20px', right: '20px', maxWidth: '335px', margin: '0 auto' }}
          >
            Clock-In Now
          </button>
        )}

        {schedule.status === 'in-progress' && (
          <Link to={`/schedules/clock-out/${schedule.id}`}>
            <button 
              className="action-btn btn-primary"
              style={{ position: 'fixed', bottom: '20px', left: '20px', right: '20px', maxWidth: '335px', margin: '0 auto' }}
            >
              Clock-Out Now
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ScheduleDetails;
