import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Main from './Main';

function MinimalApp() {
  const { alert } = window;

  useEffect(() => {
    alert('Ocorreu um erro!\n\nVocê pode continuar editando o cronograma e capturar a tela.');
  }, []);

  return (
    <div className="MinimalApp">
      <Main />
    </div>
  );
}

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

    if (hasError) return <MinimalApp />;
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

  if (globalError) return <MinimalApp />;
  return <ErrorBoundary>{children}</ErrorBoundary>;
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

ErrorWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorWrapper;
