import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Erro capturado no ErrorBoundary:', error, errorInfo);
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    if (hasError) {
      return <h2>Algo deu errado no React!</h2>;
    }
    return children;
  }
}

function ErrorWrapper({ children }) {
  const [globalError, setGlobalError] = useState(null);

  useEffect(() => {
    const errorHandler = (event) => {
      console.error('Erro global detectado:', event.error);
      setGlobalError(true);
    };

    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', errorHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', errorHandler);
    };
  }, []);

  if (globalError) {
    return <h2>Algo deu errado globalmente!</h2>;
  }

  return <ErrorBoundary>{children}</ErrorBoundary>;
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

ErrorWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorWrapper;
