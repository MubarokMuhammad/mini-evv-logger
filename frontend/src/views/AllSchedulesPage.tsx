import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useScheduleListViewModel } from '../viewmodels/ScheduleListViewModel.ts';
import '../index.css';

const AllSchedulesPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    schedules,
    loading,
    error,
    filters,
    sort,
    searchQuery,
    handleClockIn,
    handleClockOut,
    updateFilters,
    updateSort,
    updateSearchQuery,
    getStatusColor,
    getStatusText
  } = useScheduleListViewModel();

  const getLocationText = (schedule: any) => {
    if (schedule.status === 'completed' && schedule.endLocation?.address) {
      return schedule.endLocation.address;
    }
    if (schedule.status === 'in-progress' && schedule.startLocation?.address) {
      return schedule.startLocation.address;
    }
    return schedule.location?.address || 'Location not specified';
  };

  if (loading && !schedules.length) {
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
            Loading...
          </h1>
        </div>
      </div>
    );
  }

  if (error) {
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
            Error: {error}
          </h1>
        </div>
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
          All Schedules
        </h1>
      </div>

      <div style={{ 
        padding: '0 16px 20px 16px',
        maxWidth: '400px',
        margin: '0 auto'
      }}>
        {/* Search and Filter Section */}
        <div style={{ padding: '16px 0' }}>
        <div style={{ marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="Search schedules..."
            value={searchQuery}
            onChange={(e) => updateSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid #e0e0e0',
              fontSize: '14px',
              backgroundColor: 'white',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Filter Buttons */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '16px',
          flexWrap: 'wrap'
        }}>
          {['all', 'pending', 'in-progress', 'completed', 'missed'].map((status) => (
            <button
              key={status}
              onClick={() => updateFilters({ status: status === 'all' ? undefined : status })}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                backgroundColor: filters.status === status || (status === 'all' && !filters.status) 
                  ? '#2c7873' 
                  : '#f5f5f5',
                color: filters.status === status || (status === 'all' && !filters.status) 
                  ? 'white' 
                  : '#666',
                textTransform: 'capitalize'
              }}
            >
              {status === 'all' ? 'All' : status.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Sort Options */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '16px'
        }}>
          <select
            value={sort.field}
            onChange={(e) => updateSort({ field: e.target.value as 'date' | 'clientName' | 'status' })}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              fontSize: '12px',
              backgroundColor: 'white',
              flex: 1
            }}
          >
            <option value="date">Sort by Date & Time</option>
            <option value="clientName">Sort by Client</option>
            <option value="status">Sort by Status</option>
          </select>
          <button
            onClick={() => updateSort({ direction: sort.direction === 'asc' ? 'desc' : 'asc' })}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              backgroundColor: 'white',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            {sort.direction === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

        {/* Schedules List */}
        <div>
        {schedules.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#666'
          }}>
            <p>No schedules found</p>
          </div>
        ) : (
          <div className="schedules-list">
            {schedules.map((schedule: any) => (
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
                  {getLocationText(schedule)}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClockIn(schedule.id);
                      }}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/schedules/${schedule.id}`);
                        }}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClockOut(schedule);
                        }}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/schedules/${schedule.id}`);
                      }}
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
                  {schedule.status === 'missed' && (
                    <button 
                      className="btn btn-secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/schedules/${schedule.id}`);
                      }}
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
                      View Details
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <Link to="/" className="nav-item">
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

export default AllSchedulesPage;