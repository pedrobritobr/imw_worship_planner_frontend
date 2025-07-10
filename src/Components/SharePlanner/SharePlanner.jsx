/* eslint-disable */
import { useContext, useCallback } from 'react';
import { PlannerContext } from '@/Context/PlannerContext';
import { UserContext } from '@/Context/UserContext';
import { uploadPlannerToCloud } from '@/service';
import { validatePlanner, share } from '@/helpers';
import { useDialog } from '@/Context/DialogContext';

function useSharePlanner() {
  const { setCurrentPage, pages } = useContext(UserContext);
  const { planner } = useContext(PlannerContext);
  const { showDialog } = useDialog();

  const showErrorDialog = useCallback((message, title = 'Não é possível compartilhar o cronograma.') => {
    showDialog({
      title,
      message,
      onCancel: () => setCurrentPage(pages.Home),
    });
  }, [showDialog, setCurrentPage, pages]);

  const shouldShare = useCallback(async () => {
    const { creator, ...plannerWithoutCreator } = planner;
    const errorMsg = 'Erro ao salvar o cronograma. Tente novamente mais tarde.';

    try {
      const isInvalidPlanner = validatePlanner(plannerWithoutCreator);
      if (isInvalidPlanner) {
        showErrorDialog(isInvalidPlanner);
        return false;
      }

      const response = await uploadPlannerToCloud(plannerWithoutCreator);
      if (!response) {
        showErrorDialog(errorMsg, 'Atenção!');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      showErrorDialog(errorMsg);
      return false;
    }
  }, [planner, showErrorDialog]);

  const shareImage = useCallback(async (image) => {
    try {
      const errorMsg = await share({files: [image]});
      if (errorMsg) {
        showErrorDialog(errorMsg);
      }
    } catch (error) {
      console.error('Erro ao gerar imagem para compartilhar:', error);
      showErrorDialog('Não foi possível gerar a imagem do cronograma para compartilhar.');
    }
  }, [showErrorDialog, share]);

  const shareLink = useCallback(async () => {
    try {
      const errorMsg = await share({url: `${window.location.href}?shared=true`,});
      if (errorMsg) {
        showErrorDialog(errorMsg);
      }
    } catch (error) {
      console.error('Erro ao compartilhar link:', error);
      showErrorDialog('Não foi possível compartilhar o link do cronograma.');
    }
  }, [showErrorDialog, share]);

  return [shouldShare, shareLink, shareImage];
}

export default useSharePlanner;
