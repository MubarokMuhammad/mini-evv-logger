export const getStatusColor = (status: string) => {
  switch (status) {
    case 'scheduled': return '#3b82f6';
    case 'in-progress': return '#f59e0b';
    case 'completed': return '#10b981';
    case 'cancelled': return '#ef4444';
    default: return '#6b7280';
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case 'scheduled': return 'Scheduled';
    case 'in-progress': return 'In Progress';
    case 'completed': return 'Completed';
    case 'cancelled': return 'Cancelled';
    default: return status;
  }
};