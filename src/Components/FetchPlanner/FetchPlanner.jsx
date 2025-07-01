import { useContext, useCallback } from 'react';
import { PlannerContext } from '@/Context/PlannerContext';
import { UserContext } from '@/Context/UserContext';
import { useDialog } from '@/Context/DialogContext';
import { downloadPlannerFromCloud } from '@/service';
import { formatSelectedDateToUTC } from '@/helpers';

function useFetchPlanner() {
  const { user, setCurrentPage, pages } = useContext(UserContext);
  const { setPlanner, setDownloadedPlanner } = useContext(PlannerContext);
  const { showDialog } = useDialog();

  const fetchPlanner = useCallback(async () => {
    const plannerFromCloud = await downloadPlannerFromCloud(user.token);

    if (!plannerFromCloud) {
      showDialog({
        title: 'Ocorreu um erro ao baixar o cronograma.',
        message: 'Por favor, tente novamente mais tarde.',
      });
      return false;
    }

    if (plannerFromCloud.length === 0) {
      showDialog({
        title: 'Nenhum cronograma foi encontrado.',
        message: 'Por favor, tente novamente mais tarde.',
      });
      return false;
    }

    plannerFromCloud.selectedDate = formatSelectedDateToUTC(plannerFromCloud.selectedDate);
    setPlanner(plannerFromCloud);
    setDownloadedPlanner(plannerFromCloud);
    setCurrentPage(pages.Home);
    return true;
  }, [user, setPlanner, setDownloadedPlanner, setCurrentPage, pages, showDialog]);

  return [fetchPlanner];
}

export default useFetchPlanner;
