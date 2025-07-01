// User Types
export const UserTypes = {
  CLIENT: 0,
  SUPPORT: 1,
};

// Request Types
export const RequestTypes = {
  REVIEW: 0,
  DEVELOPMENT: 1,
  DISCUSS: 2,
};

// Request Status
export const RequestStatus = {
  PENDING: 0,
  IN_PROCESS: 1,
  DONE: 2,
};

// Request Priority Types
export const RequestPriorityTypes = {
  CAN_WAIT: 0,
  MIDDLE: 1,
  IMPORTANT: 2,
};

// Helper functions to get label names
export const getRequestTypeLabel = (type) => {
  const labels = {
    [RequestTypes.REVIEW]: 'Review',
    [RequestTypes.DEVELOPMENT]: 'Development',
    [RequestTypes.DISCUSS]: 'Discuss',
  };
  return labels[type] || 'Unknown';
};

export const getRequestStatusLabel = (status) => {
  const labels = {
    [RequestStatus.PENDING]: 'Pending',
    [RequestStatus.IN_PROCESS]: 'In Process',
    [RequestStatus.DONE]: 'Done',
  };
  return labels[status] || 'Unknown';
};

export const getRequestPriorityLabel = (priority) => {
  const labels = {
    [RequestPriorityTypes.CAN_WAIT]: 'Can Wait',
    [RequestPriorityTypes.MIDDLE]: 'Middle',
    [RequestPriorityTypes.IMPORTANT]: 'Important',
  };
  return labels[priority] || 'Unknown';
};

export const getUserTypeLabel = (userType) => {
  const labels = {
    [UserTypes.CLIENT]: 'Client',
    [UserTypes.SUPPORT]: 'Support',
  };
  return labels[userType] || 'Unknown';
}; 