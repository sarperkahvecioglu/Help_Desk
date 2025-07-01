import React, { useState } from 'react';
import { 
  getRequestTypeLabel,
  getRequestStatusLabel,
  getRequestPriorityLabel
} from '../../utils/constants';

const RequestCard = ({ request, onUpdate, userType, onRequestClick }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleCardClick = () => {
    if (onRequestClick) {
      onRequestClick(request.id);
    }
  };

  return (
    <div 
      style={{
        ...styles.card,
        cursor: onRequestClick ? 'pointer' : 'default',
      }}
      onClick={handleCardClick}
    >
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.requestId}>#{request.id}</span>
          <span 
            style={{
              ...styles.priority,
              backgroundColor: getPriorityColor(request.priority),
            }}
          >
            {getRequestPriorityLabel(request.priority)}
          </span>
        </div>
        <div style={styles.headerRight}>
          {!request.viewed && (
            <span style={styles.unviewedBadge}>New</span>
          )}
        </div>
      </div>

      {/* Type and Status */}
      <div style={styles.metadata}>
        <span style={styles.type}>
          {getRequestTypeLabel(request.type)}
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

      {/* Description */}
      <div style={styles.description}>
        <p style={styles.descriptionText}>
          {showFullDescription 
            ? request.request 
            : truncateText(request.request)
          }
        </p>
        {request.request.length > 150 && (
          <button 
            onClick={() => setShowFullDescription(!showFullDescription)}
            style={styles.toggleButton}
          >
            {showFullDescription ? 'Show Less' : 'Show More'}
          </button>
        )}
      </div>

      {/* Date */}
      {request.created_at && (
        <div style={styles.date}>
          Created: {formatDate(request.created_at)}
        </div>
      )}


    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    padding: '1.5rem',
    border: '1px solid #e5e7eb',
    transition: 'box-shadow 0.2s',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
  },
  requestId: {
    fontSize: '0.875rem',
    fontWeight: 'bold',
    color: '#6b7280',
  },
  priority: {
    color: 'white',
    fontSize: '0.75rem',
    fontWeight: '500',
    padding: '0.25rem 0.5rem',
    borderRadius: '12px',
  },
  unviewedBadge: {
    backgroundColor: '#ef4444',
    color: 'white',
    fontSize: '0.75rem',
    fontWeight: '500',
    padding: '0.25rem 0.5rem',
    borderRadius: '12px',
  },
  metadata: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  type: {
    backgroundColor: '#f3f4f6',
    color: '#374151',
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
  description: {
    marginBottom: '1rem',
  },
  descriptionText: {
    color: '#374151',
    lineHeight: '1.5',
    margin: '0 0 0.5rem 0',
  },
  toggleButton: {
    backgroundColor: 'transparent',
    color: '#3b82f6',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    padding: 0,
  },
  date: {
    fontSize: '0.75rem',
    color: '#9ca3af',
    marginBottom: '1rem',
  },
};

export default RequestCard; 