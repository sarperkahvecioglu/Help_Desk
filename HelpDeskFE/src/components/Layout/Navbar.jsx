import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserTypeLabel } from '../../utils/constants';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <div style={styles.brand}>
          <h1 style={styles.title}>HelpDesk</h1>
        </div>
        
        <div style={styles.userSection}>
          <div style={styles.userInfo}>
            <span style={styles.userName}>{user?.name}</span>
            <span style={styles.userType}>
              {getUserTypeLabel(user?.userType)}
            </span>
          </div>
          
          <button 
            onClick={handleLogout}
            style={styles.logoutButton}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#1f2937',
    borderBottom: '1px solid #374151',
    padding: '0',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1rem 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: 0,
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  userName: {
    color: 'white',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  userType: {
    color: '#9ca3af',
    fontSize: '0.75rem',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};

export default Navbar; 