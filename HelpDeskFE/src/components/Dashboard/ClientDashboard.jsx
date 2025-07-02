import React, { useState, useEffect } from 'react';
import { clientAPI } from '../../utils/api';
import { 
  RequestTypes, 
  RequestPriorityTypes,
  getRequestTypeLabel,
  getRequestStatusLabel,
  getRequestPriorityLabel 
} from '../../utils/constants';
import CreateRequestModal from '../Requests/CreateRequestModal';
import RequestCard from '../Requests/RequestCard';
import RequestDetailModal from '../Requests/RequestDetailModal';

const ClientDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    priority: '',
    viewed: '',
  });

  useEffect(() => {
    fetchRequests();
  }, [filters]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = {};
      
      // Add filters to params if they have values, convert to integers
      if (filters.type) params.type = Number(filters.type);
      if (filters.status) params.status = Number(filters.status);
      if (filters.priority) params.priority = Number(filters.priority);
      if (filters.viewed) params.viewed = filters.viewed === 'true';

      const response = await clientAPI.getMyRequests(params);
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestCreated = () => {
    setShowCreateModal(false);
    fetchRequests(); // Refresh the list
  };

  const handleRequestClick = (requestId) => {
    setSelectedRequestId(requestId);
  };

  const handleCloseDetailModal = () => {
    setSelectedRequestId(null);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      status: '',
      priority: '',
      viewed: '',
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Requests</h1>
        <button 
          onClick={() => setShowCreateModal(true)}
          style={styles.createButton}
        >
          + Create Request
        </button>
      </div>

      {/* Filters */}
      <div style={styles.filtersContainer}>
        <h3 style={styles.filtersTitle}>Filters</h3>
        <div style={styles.filters}>
          <select 
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            style={styles.select}
          >
            <option value="">All Types</option>
            <option value={RequestTypes.REVIEW}>Review</option>
            <option value={RequestTypes.DEVELOPMENT}>Development</option>
            <option value={RequestTypes.DISCUSS}>Discuss</option>
          </select>

          <select 
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            style={styles.select}
          >
            <option value="">All Status</option>
            <option value="0">Pending</option>
            <option value="1">In Process</option>
            <option value="2">Done</option>
          </select>

          <select 
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            style={styles.select}
          >
            <option value="">All Priorities</option>
            <option value={RequestPriorityTypes.CAN_WAIT}>Can Wait</option>
            <option value={RequestPriorityTypes.MIDDLE}>Middle</option>
            <option value={RequestPriorityTypes.IMPORTANT}>Important</option>
          </select>

          <select 
            value={filters.viewed}
            onChange={(e) => handleFilterChange('viewed', e.target.value)}
            style={styles.select}
          >
            <option value="">All</option>
            <option value="true">Viewed</option>
            <option value="false">Not Viewed</option>
          </select>

          <button onClick={clearFilters} style={styles.clearButton}>
            Clear Filters
          </button>
        </div>
      </div>

      {/* Requests List */}
      <div style={styles.requestsContainer}>
        {loading ? (
          <div style={styles.loading}>Loading requests...</div>
        ) : requests.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No requests found. Create your first request!</p>
          </div>
        ) : (
          <div style={styles.requestsGrid}>
            {requests.map(request => (
              <RequestCard 
                key={request.id} 
                request={request} 
                onUpdate={fetchRequests}
                userType="client"
                onRequestClick={handleRequestClick}
              />
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateRequestModal 
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleRequestCreated}
        />
      )}

      {selectedRequestId && (
        <RequestDetailModal 
          requestId={selectedRequestId}
          onClose={handleCloseDetailModal}
          onUpdate={fetchRequests}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0,
  },
  createButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  filtersContainer: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    marginBottom: '2rem',
  },
  filtersTitle: {
    margin: '0 0 1rem 0',
    color: '#374151',
    fontSize: '1.125rem',
  },
  filters: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  select: {
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '0.875rem',
    backgroundColor: 'white',
    minWidth: '120px',
  },
  clearButton: {
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    fontSize: '0.875rem',
    cursor: 'pointer',
  },
  requestsContainer: {
    minHeight: '200px',
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
    color: '#6b7280',
    fontSize: '1.125rem',
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    color: '#6b7280',
  },
  requestsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '1.5rem',
  },
};

export default ClientDashboard; 