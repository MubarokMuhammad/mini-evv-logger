import React from 'react';

interface AllSchedulesFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
}

const AllSchedulesFilters: React.FC<AllSchedulesFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange
}) => {
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '16px',
      borderBottom: '1px solid #e0e0e0',
      maxWidth: '400px',
      margin: '0 auto'
    }}>
      {/* Search Input */}
      <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="Search schedules..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Status Filter */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '16px',
        flexWrap: 'wrap'
      }}>
        {['all', 'scheduled', 'in-progress', 'completed', 'missed'].map((status) => (
          <button
            key={status}
            onClick={() => onStatusFilterChange(status)}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              borderRadius: '20px',
              backgroundColor: statusFilter === status ? '#295C59' : 'white',
              color: statusFilter === status ? 'white' : '#666',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
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
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{
          fontSize: '14px',
          color: '#666',
          fontWeight: '500'
        }}>
          Sort by:
        </span>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          style={{
            padding: '6px 12px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white',
            cursor: 'pointer'
          }}
        >
          <option value="date">Date</option>
          <option value="client">Client Name</option>
          <option value="status">Status</option>
        </select>
      </div>
    </div>
  );
};

export default AllSchedulesFilters;