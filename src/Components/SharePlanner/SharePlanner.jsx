import { useContext, useCallback } from 'react';
import { PlannerContext } from '@/Context/PlannerContext';
import { UserContext } from '@/Context/UserContext';
import { uploadPlannerToCloud } from '@/service';
import { validatePlanner } from '@/helpers';
import { useDialog } from '@/Context/DialogContext';

function useSharePlanner() {
  const { setCurrentPage, pages } = useContext(UserContext);
  const { planner } = useContext(PlannerContext);
  const { showDialog } = useDialog();

  const showErrorDialog = useCallback((message, title = 'Não é possivel compartilhar o cronograma.') => {
    showDialog({
      title,
      message,
      autoClose: true,
      onCancel: () => setCurrentPage(pages.Home),
    });
  }, [showDialog, setCurrentPage, pages]);

  const shouldShare = useCallback(async () => {
    const { creator, ...plannerWithoutCreator } = planner;
    const errorMsg = 'Erro ao salvar o cronograma. Tente novamente mais tarde.';

    try {
      const isValidPlanner = validatePlanner(plannerWithoutCreator);
      if (isValidPlanner) {
        showErrorDialog(isValidPlanner);
        return false;
      }

      const response = await uploadPlannerToCloud(plannerWithoutCreator);
      if (!response) {
        showErrorDialog(errorMsg, 'Atenção');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      showErrorDialog(errorMsg);
      return false;
    }
  }, [planner, showErrorDialog]);

  const share = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: 'IMW Cronograma de culto',
        text: 'Confira o cronograma de culto!',
        url: `${window.location.href}?shared=true`,
      }).catch((error) => {
        console.error('Erro ao compartilhar:', error);
        showErrorDialog('Use a página de Feedback para relatar o erro aos desenvolvedores.');
      });
    } else {
      showErrorDialog('Compartilhamento não suportado neste dispositivo.');
    }
  }, [showErrorDialog, setCurrentPage, pages]);

  return [shouldShare, share];
}

export default useSharePlanner;
