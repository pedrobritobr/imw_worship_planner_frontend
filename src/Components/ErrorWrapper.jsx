import React, {
  Component,
  useState,
  useEffect,
  useContext,
} from 'react';

import PropTypes from 'prop-types';

import Main from './Main';

import { PlannerContext } from '../Context/PlannerContext';
import { UserContext } from '../Context/UserContext';

function MinimalApp() {
  const { logOut } = useContext(UserContext);
  const { setPlanner } = useContext(PlannerContext);
  const { alert } = window;

  useEffect(() => {
    logOut();
    setPlanner([]);
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
  const { logOut } = useContext(UserContext);
  const { setPlanner } = useContext(PlannerContext);

  const [globalError, setGlobalError] = useState(null);

  useEffect(() => {
    const errorHandler = (event) => {
      console.error('Erro global detectado:', event.error);
      setGlobalError(true);
      logOut();
      setPlanner([]);
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
