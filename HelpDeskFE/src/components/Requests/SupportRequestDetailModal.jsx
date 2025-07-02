import React, { useState, useEffect } from 'react';
import { supportAPI } from '../../utils/api';
import { 
  RequestStatus,
  getRequestTypeLabel,
  getRequestStatusLabel,
  getRequestPriorityLabel 
} from '../../utils/constants';

const SupportRequestDetailModal = ({ requestId, onClose, onUpdate }) => {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchRequestDetail();
  }, [requestId]);

  const fetchRequestDetail = async () => {
    try {
      setLoading(true);
      // This endpoint automatically marks request as viewed=true
      const response = await supportAPI.getSingleRequest(requestId);
      setRequest(response.data);
    } catch (error) {
      setError('Failed to fetch request details');
      console.error('Error fetching request:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      await supportAPI.updateRequestStatus(requestId, { status: newStatus });
      await fetchRequestDetail(); // Refresh data
      onUpdate(); // Refresh parent list
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update request status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 0: return '#10b981'; // green for CAN_WAIT
      case 1: return '#f59e0b'; // yellow for MIDDLE
      case 2: return '#ef4444'; // red for IMPORTANT
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 0: return '#f59e0b'; // yellow for PENDING
      case 1: return '#3b82f6'; // blue for IN_PROCESS
      case 2: return '#10b981'; // green for DONE
      default: return '#6b7280';
    }
  };

  if (loading && !request) {
    return (
      <div style={styles.backdrop} onClick={handleBackdropClick}>
        <div style={styles.modal}>
          <div style={styles.loading}>Loading request details...</div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div style={styles.backdrop} onClick={handleBackdropClick}>
        <div style={styles.modal}>
          <div style={styles.error}>Request not found</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.backdrop} onClick={handleBackdropClick}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>Request Details #{request.id}</h2>
          <div style={styles.headerActions}>
            <span style={styles.viewedIndicator}>
              ✓ Viewed
            </span>
            <button onClick={onClose} style={styles.closeButton}>
              ×
            </button>
          </div>
        </div>

        {error && (
          <div style={styles.errorBanner}>
            {error}
          </div>
        )}

        <div style={styles.content}>
          {/* Metadata Badges */}
          <div style={styles.metadata}>
            <div style={styles.badgeContainer}>
              <span style={styles.type}>
                {getRequestTypeLabel(request.type)}
              </span>
              <span 
                style={{
                  ...styles.priority,
                  backgroundColor: getPriorityColor(request.priority),
                }}
              >
                {getRequestPriorityLabel(request.priority)}
              </span>
              <span 
                style={{
                  ...styles.status,
                  backgroundColor: getStatusColor(request.status),
                }}
              >
                {getRequestStatusLabel(request.status)}
              </span>
            </div>
          </div>

          {/* Request Description */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Description</h3>
            <p style={styles.description}>{request.request}</p>
          </div>

          {/* Created Date */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Created</h3>
            <p style={styles.date}>{formatDate(request.created_at)}</p>
          </div>

          {/* Status Management */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Update Status</h3>
            <div style={styles.statusButtons}>
              <button
                onClick={() => handleStatusUpdate(RequestStatus.PENDING)}
                disabled={updatingStatus || request.status === RequestStatus.PENDING}
                style={{
                  ...styles.statusButton,
                  backgroundColor: request.status === RequestStatus.PENDING ? '#f59e0b' : '#e5e7eb',
                  color: request.status === RequestStatus.PENDING ? 'white' : '#6b7280',
                }}
              >
                {updatingStatus && request.status === RequestStatus.PENDING ? 'Updating...' : 'Pending'}
              </button>
              <button
                onClick={() => handleStatusUpdate(RequestStatus.IN_PROCESS)}
                disabled={updatingStatus || request.status === RequestStatus.IN_PROCESS}
                style={{
                  ...styles.statusButton,
                  backgroundColor: request.status === RequestStatus.IN_PROCESS ? '#3b82f6' : '#e5e7eb',
                  color: request.status === RequestStatus.IN_PROCESS ? 'white' : '#6b7280',
                }}
              >
                {updatingStatus && request.status === RequestStatus.IN_PROCESS ? 'Updating...' : 'In Process'}
              </button>
              <button
                onClick={() => handleStatusUpdate(RequestStatus.DONE)}
                disabled={updatingStatus || request.status === RequestStatus.DONE}
                style={{
                  ...styles.statusButton,
                  backgroundColor: request.status === RequestStatus.DONE ? '#10b981' : '#e5e7eb',
                  color: request.status === RequestStatus.DONE ? 'white' : '#6b7280',
                }}
              >
                {updatingStatus && request.status === RequestStatus.DONE ? 'Updating...' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 1.5rem 0 1.5rem',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '1rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0,
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  viewedIndicator: {
    backgroundColor: '#10b981',
    color: 'white',
    fontSize: '0.875rem',
    fontWeight: '500',
    padding: '0.5rem 0.75rem',
    borderRadius: '4px',
  },
  closeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#6b7280',
    padding: '0.25rem',
    lineHeight: 1,
  },
  content: {
    padding: '1.5rem',
  },
  metadata: {
    marginBottom: '1.5rem',
  },
  badgeContainer: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  type: {
    backgroundColor: '#f3f4f6',
    color: '#374151',
    fontSize: '0.875rem',
    fontWeight: '500',
    padding: '0.5rem 0.75rem',
    borderRadius: '4px',
  },
  priority: {
    color: 'white',
    fontSize: '0.875rem',
    fontWeight: '500',
    padding: '0.5rem 0.75rem',
    borderRadius: '4px',
  },
  status: {
    color: 'white',
    fontSize: '0.875rem',
    fontWeight: '500',
    padding: '0.5rem 0.75rem',
    borderRadius: '4px',
  },
  section: {
    marginBottom: '1.5rem',
  },
  sectionTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '0.5rem',
  },
  description: {
    color: '#6b7280',
    lineHeight: '1.6',
    fontSize: '1rem',
  },
  date: {
    color: '#6b7280',
    fontSize: '0.875rem',
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
    color: '#6b7280',
    fontSize: '1.125rem',
  },
  error: {
    textAlign: 'center',
    padding: '2rem',
    color: '#dc2626',
    fontSize: '1rem',
  },
  errorBanner: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '0.75rem 1.5rem',
    fontSize: '0.875rem',
  },
  statusButtons: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  statusButton: {
    border: 'none',
    padding: '0.75rem 1rem',
    borderRadius: '4px',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    minWidth: '100px',
  },
};

export default SupportRequestDetailModal; 