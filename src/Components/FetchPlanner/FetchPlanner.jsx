import React, { useState, useContext, useEffect } from 'react';

import { UserContext } from '@/Context/UserContext';
import { PlannerContext } from '@/Context/PlannerContext';

import { downloadPlannerFromCloud } from '@/service';
import { formatSelectedDateToUTC } from '@/helpers';

function FetchPlanner() {
  const { user, setCurrentPage, pages } = useContext(UserContext);
  const { setPlanner, setDownloadedPlanner } = useContext(PlannerContext);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const getPlanner = async () => {
      setIsDownloading(true);

      const plannerFromCloud = await downloadPlannerFromCloud(user.token);
      setIsDownloading(false);

      if (!plannerFromCloud) {
        const { alert } = window;
        alert('Erro ao baixar o cronograma. Tente novamente mais tarde.');
        return;
      }

      if (plannerFromCloud.length === 0) {
        const { alert } = window;
        alert('Nenhum cronograma foi encontrado.');
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
