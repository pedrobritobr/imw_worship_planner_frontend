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

function MinimalApp() {
  const { logOut } = useContext(UserContext);
  const { setPlanner } = useContext(PlannerContext);
  const { showDialog } = useDialog();

  const clearData = () => {
    localStorage.clear();
    logOut();
    setPlanner([]);
  };

  useEffect(() => {
    showDialog({
      type: 'error',
      title: 'Ocorreu um erro!',
      message: `
      Você pode continuar editando o cronograma e capturar a tela.
      <br>
      <br>
      Caso o erro persista, limpe os dados ou entre em contato na área de feedback.`,
      onConfirm: clearData,
      confirmText: 'Limpar dados',
      autoCloseSeconds: 10,
    });
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
      console.error('Erro global detectado:', event);
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
