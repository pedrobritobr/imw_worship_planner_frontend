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

  const shouldShare = useCallback(async () => {
    const { creator, ...plannerWithoutCreator } = planner;
    const errorMsg = 'Erro ao salvar o cronograma. Tente novamente mais tarde.';

    try {
      const isValidPlanner = validatePlanner(plannerWithoutCreator);
      if (isValidPlanner) {
        showDialog({
          type: 'alert',
          title: 'Não é possivel compartilhar o cronograma.',
          message: `${isValidPlanner}`,
          autoClose: true,
          onCancel: () => setCurrentPage(pages.Home),
        });
        return false;
      }

      const response = await uploadPlannerToCloud(plannerWithoutCreator);
      if (!response) {
        showDialog({
          type: 'alert',
          title: 'Atenção',
          message: errorMsg,
          autoClose: true,
          onCancel: () => setCurrentPage(pages.Home),
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      showDialog({
        type: 'alert',
        title: 'Não é possivel compartilhar o cronograma.',
        message: errorMsg,
        autoClose: true,
        onCancel: () => setCurrentPage(pages.Home),
      });
      return false;
    }
  }, [planner, showDialog, setCurrentPage, pages]);

  const share = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: 'IMW Cronograma de culto',
        text: 'Confira o cronograma de culto!',
        url: `${window.location.href}?shared=true`,
      }).catch((error) => {
        console.error('Erro ao compartilhar:', error);
        showDialog({
          type: 'alert',
          title: 'Não é possivel compartilhar o cronograma.',
          message: 'Use a página de Feedback para relatar o erro aos desenvolvedores.',
          autoClose: true,
          onCancel: () => setCurrentPage(pages.Home),
        });
      });
    } else {
      showDialog({
        type: 'alert',
        title: 'Não é possivel compartilhar o cronograma.',
        message: 'Compartilhamento não suportado neste dispositivo.',
        autoClose: true,
        onCancel: () => setCurrentPage(pages.Home),
      });
    }
  }, [showDialog, setCurrentPage, pages]);

  return [shouldShare, share];
}

export default useSharePlanner;
