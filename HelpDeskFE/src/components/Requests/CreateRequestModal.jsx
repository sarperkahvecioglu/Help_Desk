import React, { useState } from 'react';
import { clientAPI } from '../../utils/api';
import { RequestTypes, RequestPriorityTypes } from '../../utils/constants';

const CreateRequestModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    type: RequestTypes.REVIEW,
    request: '',
    priority: RequestPriorityTypes.MIDDLE,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Convert string values to integers for backend
    const requestData = {
      ...formData,
      type: Number(formData.type),
      priority: Number(formData.priority),
    };

    console.log('Creating request with data:', requestData);

    try {
      const response = await clientAPI.createRequest(requestData);
      console.log('Request created successfully:', response.data);
      onSuccess();
    } catch (error) {
      console.error('Error creating request:', error);
      console.error('Error response:', error.response);
      setError(error.response?.data?.detail || 'Failed to create request');
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

  return (
    <div style={styles.backdrop} onClick={handleBackdropClick}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>Create New Request</h2>
          <button onClick={onClose} style={styles.closeButton}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

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
              rows="5"
              required
            />
          </div>

          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={onClose}
              style={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{...styles.submitButton, opacity: loading ? 0.7 : 1}}
            >
              {loading ? 'Creating...' : 'Create Request'}
            </button>
          </div>
        </form>
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
    maxWidth: '500px',
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
  closeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#6b7280',
    padding: '0.25rem',
    lineHeight: 1,
  },
  form: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '0.75rem',
    borderRadius: '4px',
    fontSize: '0.875rem',
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
    minHeight: '100px',
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

export default CreateRequestModal; 