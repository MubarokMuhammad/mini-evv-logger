import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageHeader,
  ServiceInfoCard,
  ClientContactCard,
  AddressCard,
  TasksCard,
  ServiceNotesCard,
  CompletedStatusCard,
  ClockInButton,
  Footer
} from '../widgets';
import { Schedule } from '../hooks/useScheduleData';

interface ScheduleContentProps {
  schedule: Schedule;
  onClockIn: (schedule: Schedule) => void;
  clockingIn: boolean;
}

const ScheduleContent: React.FC<ScheduleContentProps> = ({
  schedule,
  onClockIn,
  clockingIn
}) => {
  const navigate = useNavigate();

  return (
    <div className="desktop-content" style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      padding: '40px'
    }}>
      <PageHeader onBack={() => navigate('/')} title="Schedule Details" />

      <div style={{ 
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '32px',
          marginBottom: '32px'
        }}>
          <div>
            <ServiceInfoCard schedule={schedule} />

            <ClientContactCard 
              clientEmail={schedule.clientEmail} 
              clientPhone={schedule.clientPhone} 
            />

            <AddressCard location={schedule.location} />
          </div>

          <div>
            <TasksCard tasks={schedule.tasks} />

            <ServiceNotesCard serviceNotes={schedule.serviceNotes} />
          </div>
        </div>

         {schedule.status === 'completed' && schedule.endLocation && (
           <CompletedStatusCard 
             endLocation={schedule.endLocation}
             actualEndTime={schedule.actualEndTime}
           />
         )}

         {schedule.status === 'scheduled' && (
           <ClockInButton 
             onClockIn={() => onClockIn(schedule)}
             clockingIn={clockingIn}
           />
         )}

         <Footer />
      </div>
    </div>
  );
};

export default ScheduleContent;