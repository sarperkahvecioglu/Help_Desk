import React, { useState, useEffect } from 'react';
import { supportAPI } from '../../utils/api';
import { 
  RequestTypes, 
  RequestPriorityTypes,
  getRequestTypeLabel,
  getRequestStatusLabel,
  getRequestPriorityLabel 
} from '../../utils/constants';
import RequestCard from '../Requests/RequestCard';
import SupportRequestDetailModal from '../Requests/SupportRequestDetailModal';

const SupportDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('requests');
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    priority: '',
    viewed: '',
  });

  useEffect(() => {
    if (activeTab === 'requests') {
      fetchRequests();
    } else {
      fetchClients();
    }
  }, [activeTab, filters]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = {};
      
      // Add filters to params if they have values, convert to integers
      if (filters.type) params.type = Number(filters.type);
      if (filters.status) params.status = Number(filters.status);
      if (filters.priority) params.priority = Number(filters.priority);
      if (filters.viewed) params.viewed = filters.viewed === 'true';

      const response = await supportAPI.getAllRequests(params);
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await supportAPI.getClients();
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
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

  const handleRequestClick = (requestId) => {
    setSelectedRequestId(requestId);
  };

  const handleCloseDetailModal = () => {
    setSelectedRequestId(null);
  };

  const getStatusCounts = () => {
    const counts = {
      pending: requests.filter(r => r.status === 0).length,
      inProcess: requests.filter(r => r.status === 1).length,
      done: requests.filter(r => r.status === 2).length,
      unviewed: requests.filter(r => !r.viewed).length,
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Support Dashboard</h1>
        
        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{statusCounts.pending}</div>
            <div style={styles.statLabel}>Pending</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{statusCounts.inProcess}</div>
            <div style={styles.statLabel}>In Process</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{statusCounts.done}</div>
            <div style={styles.statLabel}>Completed</div>
          </div>
          <div style={{...styles.statCard, borderColor: '#f59e0b'}}>
            <div style={{...styles.statNumber, color: '#f59e0b'}}>{statusCounts.unviewed}</div>
            <div style={styles.statLabel}>Unviewed</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={styles.tabContainer}>
        <button
          onClick={() => setActiveTab('requests')}
          style={{
            ...styles.tab,
            ...(activeTab === 'requests' ? styles.activeTab : {}),
          }}
        >
          All Requests
        </button>
        <button
          onClick={() => setActiveTab('clients')}
          style={{
            ...styles.tab,
            ...(activeTab === 'clients' ? styles.activeTab : {}),
          }}
        >
          Clients
        </button>
      </div>

      {activeTab === 'requests' && (
        <>
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
          <div style={styles.contentContainer}>
            {loading ? (
              <div style={styles.loading}>Loading requests...</div>
            ) : requests.length === 0 ? (
              <div style={styles.emptyState}>
                <p>No requests found.</p>
              </div>
            ) : (
              <div style={styles.requestsGrid}>
                {requests.map(request => (
                  <RequestCard 
                    key={request.id} 
                    request={request} 
                    onUpdate={fetchRequests}
                    userType="support"
                    onRequestClick={handleRequestClick}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'clients' && (
        <div style={styles.contentContainer}>
          {loading ? (
            <div style={styles.loading}>Loading clients...</div>
          ) : (
            <div style={styles.clientsContainer}>
              <div style={styles.clientsGrid}>
                {clients.map(client => (
                  <div key={client.id} style={styles.clientCard}>
                    <h3 style={styles.clientName}>{client.name}</h3>
                    <p style={styles.clientEmail}>{client.email}</p>
                    <p style={styles.clientType}>
                      {client.userType === 0 ? 'Client' : 'Support User'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {selectedRequestId && (
        <SupportRequestDetailModal 
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
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '1.5rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    border: '2px solid transparent',
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  statLabel: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginTop: '0.5rem',
  },
  tabContainer: {
    display: 'flex',
    borderBottom: '1px solid #e5e7eb',
    marginBottom: '2rem',
  },
  tab: {
    padding: '1rem 1.5rem',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    color: '#6b7280',
    borderBottom: '2px solid transparent',
  },
  activeTab: {
    color: '#3b82f6',
    borderBottomColor: '#3b82f6',
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
  contentContainer: {
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
  clientsContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    padding: '1.5rem',
  },
  clientsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1rem',
  },
  clientCard: {
    backgroundColor: '#f9fafb',
    padding: '1rem',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
  },
  clientName: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#1f2937',
  },
  clientEmail: {
    margin: '0 0 0.5rem 0',
    color: '#6b7280',
    fontSize: '0.875rem',
  },
  clientType: {
    margin: 0,
    fontSize: '0.75rem',
    color: '#9ca3af',
    fontWeight: '500',
  },
};

export default SupportDashboard; 