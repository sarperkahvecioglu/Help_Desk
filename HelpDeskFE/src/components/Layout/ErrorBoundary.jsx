import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <h2 style={styles.title}>Something went wrong!</h2>
          <div style={styles.errorBox}>
            <p><strong>Error:</strong> {this.state.error && this.state.error.toString()}</p>
            <details style={styles.details}>
              <summary>Click for error details</summary>
              <pre style={styles.pre}>
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          </div>
          <button 
            onClick={() => window.location.reload()}
            style={styles.reloadButton}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    padding: '2rem',
    textAlign: 'center',
    backgroundColor: '#fee2e2',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#dc2626',
    marginBottom: '1rem',
  },
  errorBox: {
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '8px',
    margin: '1rem 0',
    textAlign: 'left',
    maxWidth: '600px',
    width: '100%',
  },
  details: {
    marginTop: '1rem',
  },
  pre: {
    backgroundColor: '#f3f4f6',
    padding: '1rem',
    borderRadius: '4px',
    overflow: 'auto',
    fontSize: '0.875rem',
  },
  reloadButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
};

export default ErrorBoundary; 