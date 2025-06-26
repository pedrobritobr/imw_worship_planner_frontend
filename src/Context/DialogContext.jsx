import React, {
  createContext,
  useState,
  useContext,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import Dialog from '@/Components/Dialog';

const DialogContext = createContext();

export function DialogProvider({ children }) {
  const [dialogProps, setDialogProps] = useState(null);

  const showDialog = useCallback((props) => {
    setDialogProps({ ...props, open: true });
  }, []);

  const closeDialog = useCallback(() => {
    setDialogProps((prev) => (prev ? { ...prev, open: false } : null));
  }, []);

  const handleCancel = () => {
    if (dialogProps?.onCancel) dialogProps.onCancel();
    closeDialog();
  };

  const handleConfirm = () => {
    if (dialogProps?.onConfirm) dialogProps.onConfirm();
    closeDialog();
  };

  const contextValue = React.useMemo(
    () => ({ showDialog, closeDialog }),
    [showDialog, closeDialog],
  );

  return (
    <DialogContext.Provider value={contextValue}>
      {children}
      <Dialog
        show={!!dialogProps?.open}
        type={dialogProps?.type}
        title={dialogProps?.title}
        message={dialogProps?.message}
        onCancel={handleCancel}
        onConfirm={dialogProps?.onConfirm ? handleConfirm : undefined}
        confirmText={dialogProps?.confirmText}
        cancelText={dialogProps?.cancelText}
        autoCloseTimeout={dialogProps?.autoCloseTimeout}
      />
    </DialogContext.Provider>
  );
}

DialogProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useDialog() {
  return useContext(DialogContext);
}
