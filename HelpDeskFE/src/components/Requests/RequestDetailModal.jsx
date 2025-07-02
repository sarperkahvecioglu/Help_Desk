import React, { useState, useEffect } from 'react';
import { clientAPI } from '../../utils/api';
import { 
  RequestTypes, 
  RequestPriorityTypes,
  getRequestTypeLabel,
  getRequestStatusLabel,
  getRequestPriorityLabel 
} from '../../utils/constants';

const RequestDetailModal = ({ requestId, onClose, onUpdate }) => {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    type: '',
    request: '',
    priority: '',
  });

  useEffect(() => {
    fetchRequestDetail();
  }, [requestId]);

  const fetchRequestDetail = async () => {
    try {
      setLoading(true);
      const response = await clientAPI.getSingleRequest(requestId);
      setRequest(response.data);
      setFormData({
        type: response.data.type,
        request: response.data.request,
        priority: response.data.priority,
      });
    } catch (error) {
      setError('Failed to fetch request details');
      console.error('Error fetching request:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Convert string values to integers for backend
    const updateData = {
      ...formData,
      type: Number(formData.type),
      priority: Number(formData.priority),
    };

    try {
      await clientAPI.updateRequest(requestId, updateData);
      await fetchRequestDetail(); // Refresh data
      setEditing(false);
      onUpdate(); // Refresh parent list
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to update request');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
            {!editing && (
              <button 
                onClick={() => setEditing(true)}
                style={styles.editButton}
              >
                Edit
              </button>
            )}
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

        {!editing ? (
          // View Mode
          <div style={styles.content}>
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
                {!request.viewed && (
                  <span style={styles.unviewedBadge}>Not Viewed</span>
                )}
              </div>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Description</h3>
              <p style={styles.description}>{request.request}</p>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Created</h3>
              <p style={styles.date}>{formatDate(request.created_at)}</p>
            </div>
          </div>
        ) : (
          // Edit Mode
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Request Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                style={styles.select}
                required
              >
                <option value={RequestTypes.REVIEW}>Review</option>
                <option value={RequestTypes.DEVELOPMENT}>Development</option>
                <option value={RequestTypes.DISCUSS}>Discuss</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                style={styles.select}
                required
              >
                <option value={RequestPriorityTypes.CAN_WAIT}>Can Wait</option>
                <option value={RequestPriorityTypes.MIDDLE}>Middle</option>
                <option value={RequestPriorityTypes.IMPORTANT}>Important</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Request Description</label>
              <textarea
                name="request"
                value={formData.request}
                onChange={handleChange}
                placeholder="Describe your request in detail..."
                style={styles.textarea}
                rows="6"
                required
              />
            </div>

            <div style={styles.buttonGroup}>
              <button
                type="button"
                onClick={() => setEditing(false)}
                style={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{...styles.submitButton, opacity: loading ? 0.7 : 1}}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
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
    gap: '0.5rem',
  },
  editButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
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
  unviewedBadge: {
    backgroundColor: '#ef4444',
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
  form: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
  },
  select: {
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '1rem',
    backgroundColor: 'white',
  },
  textarea: {
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '1rem',
    resize: 'vertical',
    minHeight: '120px',
    fontFamily: 'inherit',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    marginTop: '1rem',
  },
  cancelButton: {
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
  },
};

export default RequestDetailModal; 