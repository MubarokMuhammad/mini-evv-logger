import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SuccessModalProps {
  duration: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ duration }) => {
  const navigate = useNavigate();

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
};

export default SuccessModal;