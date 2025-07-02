import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../Layout/Navbar';
import ClientDashboard from './ClientDashboard';
import SupportDashboard from './SupportDashboard';

const Dashboard = () => {
  const { isClient, isSupport } = useAuth();

  return (
    <div style={styles.container}>
      <Navbar />
      <main style={styles.main}>
        {isClient() && <ClientDashboard />}
        {isSupport() && <SupportDashboard />}
      </main>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1.5rem',
  },
};

export default Dashboard; 