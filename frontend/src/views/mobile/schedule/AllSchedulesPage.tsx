import React from 'react';
import { useScheduleListViewModel } from '../../../viewmodels/ScheduleListViewModel';
import {
  AllSchedulesHeader,
  AllSchedulesFilters,
  AllSchedulesList,
  BottomNavigation
} from './widgets';
import '../../../index.css';

const AllSchedulesPage: React.FC = () => {
  const {
    schedules,
    loading,
    error,
    searchQuery,
    updateSearchQuery,
    filters,
    updateFilters,
    sort,
    updateSort,
    handleClockIn,
    handleClockOut
  } = useScheduleListViewModel();

  const getLocationText = (schedule: any) => {
    if (schedule.location?.address) {
      return schedule.location.address;
    }
    return schedule.status === 'in-progress' ? 'On-site' : 'Remote';
  };

  const handleStatusFilterChange = (status: string) => {
    updateFilters({ status: status === 'all' ? undefined : status });
  };

  const handleSortChange = (field: string) => {
    updateSort({ field: field as 'date' | 'clientName' | 'status' });
  };

  const handleClockOutWrapper = (schedule: any) => {
    handleClockOut(schedule.id);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      paddingBottom: '100px'
    }}>
      <AllSchedulesHeader 
         loading={loading}
         error={error}
       />
      <AllSchedulesFilters 
        searchTerm={searchQuery}
        onSearchChange={updateSearchQuery}
        statusFilter={filters.status || 'all'}
        onStatusFilterChange={handleStatusFilterChange}
        sortBy={sort.field}
        onSortChange={handleSortChange}
      />
      <AllSchedulesList 
         schedules={schedules}
         onClockIn={handleClockIn}
         onClockOut={handleClockOutWrapper}
         getLocationText={getLocationText}
       />
      <BottomNavigation />
    </div>
  );
};

export default AllSchedulesPage;