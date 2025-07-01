import React, { useState, useContext, useEffect } from 'react';

import { UserContext } from '@/Context/UserContext';
import { PlannerContext } from '@/Context/PlannerContext';
import { useDialog } from '@/Context/DialogContext';

import { downloadPlannerFromCloud } from '@/service';
import { formatSelectedDateToUTC } from '@/helpers';

function FetchPlanner() {
  const { user, setCurrentPage, pages } = useContext(UserContext);
  const { setPlanner, setDownloadedPlanner } = useContext(PlannerContext);
  const [isDownloading, setIsDownloading] = useState(false);

  const { showDialog } = useDialog();

  useEffect(() => {
    const getPlanner = async () => {
      setIsDownloading(true);

      const plannerFromCloud = await downloadPlannerFromCloud(user.token);
      setIsDownloading(false);

      if (!plannerFromCloud) {
        showDialog({
          title: 'Ocorreu um erro ao baixar o cronograma.',
          message: 'Por favor, tente novamente mais tarde.',
        });

        return;
      }

      if (plannerFromCloud.length === 0) {
        showDialog({
          title: 'Nenhum cronograma foi encontrado.',
          message: 'Por favor, tente novamente mais tarde.',
        });
        return;
      }

      plannerFromCloud.selectedDate = formatSelectedDateToUTC(plannerFromCloud.selectedDate);

      setPlanner(plannerFromCloud);
      setDownloadedPlanner(plannerFromCloud);
    };
    getPlanner();
    setCurrentPage(pages.Home);
  }, []);

  if (isDownloading) return <span className="loader" />;

  return (<div />);
}

export default FetchPlanner;
