import React from 'react';
import { Stats } from '../../../../hooks/types';

interface StatsMobileProps {
  stats: Stats;
}

const StatsMobile: React.FC<StatsMobileProps> = ({ stats }) => {
  return (
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
  );
};

export default StatsMobile;