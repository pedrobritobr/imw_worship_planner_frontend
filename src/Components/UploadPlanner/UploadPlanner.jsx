import { useContext, useCallback } from 'react';

import { PlannerContext } from '@/Context/PlannerContext';
import { UserContext } from '@/Context/UserContext';
import { useDialog } from '@/Context/DialogContext';

import { uploadPlannerToCloud } from '@/service';

import { validatePlanner } from '@/helpers';

function useUploadPlanner() {
  const { setCurrentPage, pages } = useContext(UserContext);
  const {
    planner,
    downloadedPlanner,
    setDownloadedPlanner,
  } = useContext(PlannerContext);
  const { showDialog } = useDialog();

  const upload = useCallback(async () => {
    const isValidPlanner = validatePlanner(planner, downloadedPlanner);
    if (isValidPlanner) {
      showDialog({
        title: 'Atenção!',
        message: isValidPlanner,
        onCancel: () => setCurrentPage(pages.Home),
      });
      return false;
    }

    const { creator, ...plannerWithoutCreator } = planner;
    const response = await uploadPlannerToCloud(plannerWithoutCreator);

    const sucessMsg = 'Cronograma salvo com sucesso!';
    const errorMsg = 'Por favor, tente novamente mais tarde.';
    showDialog({
      title: response ? 'Sucesso!' : 'Erro ao salvar o cronograma.',
      message: response ? sucessMsg : errorMsg,
      onCancel: () => setCurrentPage(pages.Home),
      autoCloseSeconds: 3,
    });

    setDownloadedPlanner(planner);
    return !!response;
  }, [planner, downloadedPlanner, showDialog, setCurrentPage, pages, setDownloadedPlanner]);

  return [upload];
}

export default useUploadPlanner;
