import React from 'react';
import { Schedule } from '../../../../hooks/types';

interface ServiceClientInfoProps {
  schedule: Schedule;
}

const ServiceClientInfo: React.FC<ServiceClientInfoProps> = ({ schedule }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      textAlign: 'center'
    }}>
      {/* Service Name */}
      <div style={{
        fontSize: '18px',
        fontWeight: '600',
        color: '#2c7873',
        marginBottom: '16px'
      }}>
        {schedule.serviceName}
      </div>

      {/* Client Info */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px'
      }}>
        <img 
          src="/default-profile.png" 
          alt="Client Profile" 
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            objectFit: 'cover'
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IiNkZGQiLz4KPHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxNSIgeT0iMTUiPgo8cGF0aCBkPSJNMTAgNi42NjY2N0MxMC45MTY3IDYuNjY2NjcgMTEuNjY2NyA3LjQxNjY3IDExLjY2NjcgOC4zMzMzM0MxMS42NjY3IDkuMjUgMTAuOTE2NyAxMCAxMCAxMEM5LjA4MzMzIDEwIDguMzMzMzMgOS4yNSA4LjMzMzMzIDguMzMzMzNDOC4zMzMzMyA3LjQxNjY3IDkuMDgzMzMgNi42NjY2NyAxMCA2LjY2NjY3Wk0xMCAxMS4yNUMxMS40NTgzIDExLjI1IDEzLjk1ODMgMTEuOTc5MiAxMy45NTgzIDEzLjQzNzVWMTQuNTgzM0g2LjA0MTY3VjEzLjQzNzVDNi4wNDE2NyAxMS45NzkyIDguNTQxNjcgMTEuMjUgMTAgMTEuMjVaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+Cg==';
          }}
        />
        <div style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#333'
        }}>
          {schedule.clientName}
        </div>
      </div>
    </div>
  );
};

export default ServiceClientInfo;