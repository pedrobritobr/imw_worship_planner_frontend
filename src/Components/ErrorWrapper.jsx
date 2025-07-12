import React, {
  Component,
  useState,
  useEffect,
  useContext,
} from 'react';

import PropTypes from 'prop-types';

import { PlannerContext } from '@/Context/PlannerContext';
import { UserContext } from '@/Context/UserContext';
import { useDialog } from '@/Context/DialogContext';

import Main from './Main';

// RESTAURAR MSGS
function MinimalApp(errorMsg) {
  const { logOut } = useContext(UserContext);
  const { setPlanner } = useContext(PlannerContext);
  const { showDialog } = useDialog();

  useEffect(() => {
    localStorage.clear();
    logOut();
    setPlanner([]);
    showDialog({
      title: 'Erro',
      message: errorMsg,
    });
  }, []);

  return (
    <div className="MinimalApp">
      <p>{errorMsg}</p>
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
    this.setState({ errorInfo });
    console.error('Erro capturado no ErrorBoundary:', error, errorInfo);
  }

  render() {
    const { hasError, errorInfo } = this.state;
    const { children } = this.props;

    if (hasError) return <MinimalApp errorMsg={errorInfo} />;
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
      setGlobalError(event.error);
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

  if (globalError) return <MinimalApp errorMsg={globalError} />;
  return <ErrorBoundary>{children}</ErrorBoundary>;
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

ErrorWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorWrapper;
