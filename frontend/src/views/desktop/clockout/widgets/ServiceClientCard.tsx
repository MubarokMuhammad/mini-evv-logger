import React from 'react';
import { Schedule } from '../../../../hooks/types';

interface ServiceClientCardProps {
  schedule: Schedule;
}

const ServiceClientCard: React.FC<ServiceClientCardProps> = ({ schedule }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '32px',
      marginBottom: '32px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
      textAlign: 'center'
    }}>
      {/* Service Name */}
      <div style={{
        fontSize: '24px',
        fontWeight: '600',
        color: '#2c7873',
        marginBottom: '24px'
      }}>
        {schedule.serviceName}
      </div>

      {/* Client Info */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px'
      }}>
        <img 
          src="/default-profile.png" 
          alt="Client Profile" 
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            objectFit: 'cover'
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiNkZGQiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxOCIgeT0iMTgiPgo8cGF0aCBkPSJNMTIgOEMxMyAxIDEzIDEwIDEzIDEwQzEzIDExIDEzIDEyIDEyIDEyQzExIDEyIDEwIDExIDEwIDEwQzEwIDEwIDEwIDkgMTIgOFpNMTIgMTNDMTQgMTMgMTYgMTQgMTYgMTZWMThIOFYxNkM4IDE0IDEwIDEzIDEyIDEzWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==';
          }}
        />
        <div style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#333'
        }}>
          {schedule.clientName}
        </div>
      </div>
    </div>
  );
};

export default ServiceClientCard;