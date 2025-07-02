import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileViewModel } from '../viewmodels/ProfileViewModel.ts';
import '../index.css';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    userProfile,
    isLoggingOut,
    handleLogout
  } = useProfileViewModel();

  return (
    <div className="app" style={{ paddingBottom: '80px' }}>
      <div className="header">
        <h1 className="welcome-text">Profile</h1>
      </div>

      <div style={{ padding: '20px' }}>
      {/* Profile Header Card */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '32px 24px',
        marginBottom: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #2c7873 0%, #295C59 100%)'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '32px',
          fontWeight: 'bold',
          margin: '0 auto 16px auto',
          border: '3px solid rgba(255,255,255,0.3)'
        }}>
          {userProfile.name.split(' ').map(n => n[0]).join('')}
        </div>
        <h2 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '24px', 
          color: 'white',
          fontWeight: '600'
        }}>
          {userProfile.name}
        </h2>
        <p style={{ 
          margin: '0 0 4px 0', 
          color: 'rgba(255,255,255,0.9)', 
          fontSize: '16px',
          fontWeight: '500'
        }}>
          {userProfile.role}
        </p>
        <p style={{ 
          margin: 0, 
          color: 'rgba(255,255,255,0.7)', 
          fontSize: '14px'
        }}>
          Member since {userProfile.joinDate}
        </p>
      </div>

      {/* Profile Information */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#1a1a1a',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <span style={{
            width: '4px',
            height: '20px',
            backgroundColor: '#2c7873',
            marginRight: '12px',
            borderRadius: '2px'
          }}></span>
          Contact Information
        </h3>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          marginBottom: '16px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: '#2c7873',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '16px'
          }}>
            <span style={{ color: 'white', fontSize: '18px' }}>✉</span>
          </div>
          <div>
            <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666', fontWeight: '500' }}>
              Email Address
            </p>
            <p style={{ margin: 0, fontSize: '16px', color: '#333', fontWeight: '500' }}>
              {userProfile.email}
            </p>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: '#2c7873',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '16px'
          }}>
            <span style={{ color: 'white', fontSize: '18px' }}>👤</span>
          </div>
          <div>
            <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666', fontWeight: '500' }}>
              Role & Department
            </p>
            <p style={{ margin: 0, fontSize: '16px', color: '#333', fontWeight: '500' }}>
              Healthcare Care Provider
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '32px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#1a1a1a',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <span style={{
            width: '4px',
            height: '20px',
            backgroundColor: '#2c7873',
            marginRight: '12px',
            borderRadius: '2px'
          }}></span>
          Your Activity
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px'
        }}>
          <div style={{
            textAlign: 'center',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px'
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#2c7873',
              marginBottom: '4px'
            }}>
              127
            </div>
            <div style={{
              fontSize: '12px',
              color: '#666',
              fontWeight: '500'
            }}>
              Total Visits
            </div>
          </div>
          <div style={{
            textAlign: 'center',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px'
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#2c7873',
              marginBottom: '4px'
            }}>
              98%
            </div>
            <div style={{
              fontSize: '12px',
              color: '#666',
              fontWeight: '500'
            }}>
              Completion Rate
            </div>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div style={{ textAlign: 'center' }}>
        <button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          style={{
            backgroundColor: isLoggingOut ? '#6c757d' : '#dc3545',
            color: 'white',
            border: 'none',
            padding: '16px 32px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: isLoggingOut ? 'not-allowed' : 'pointer',
            width: '100%',
            transition: 'all 0.3s ease',
            opacity: isLoggingOut ? 0.7 : 1,
            boxShadow: '0 4px 12px rgba(220, 53, 69, 0.2)'
          }}
          onMouseOver={(e) => {
            if (!isLoggingOut) {
              e.currentTarget.style.backgroundColor = '#c82333';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(220, 53, 69, 0.3)';
            }
          }}
          onMouseOut={(e) => {
            if (!isLoggingOut) {
              e.currentTarget.style.backgroundColor = '#dc3545';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.2)';
            }
          }}
        >
          {isLoggingOut ? 'Logging Out...' : 'Log Out'}
        </button>
      </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <button 
          onClick={() => navigate('/')}
          className="nav-item"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <img 
            src="/homeIcon.png" 
            alt="Home" 
            style={{
              width: '24px',
              height: '24px'
            }}
          />
          <span>Home</span>
        </button>
        <button 
          onClick={() => navigate('/profile')}
          className="nav-item"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#2c7873'
          }}
        >
          <img 
            src="/profileIcon.png" 
            alt="Profile" 
            style={{
              width: '24px',
              height: '24px'
            }}
          />
          <span>Profile</span>
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;