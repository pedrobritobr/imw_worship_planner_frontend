import React, { useState, useContext } from 'react';

import { UserContext } from '@/Context/UserContext';
import { PlannerContext } from '@/Context/PlannerContext';

import { downloadPlannerFromCloud } from '@/service';
import { formatSelectedDateToUTC } from '@/helpers';

import DownloadSVG from '@/assets/cloud-download-svgrepo-com.svg';
import DownloadBackgroundSVG from '@/assets/cloud-download-background-svgrepo-com.svg';

function FetchPlanner() {
  const { user } = useContext(UserContext);
  const { setPlanner, setDownloadedPlanner } = useContext(PlannerContext);
  const [isDownloading, setIsDownloading] = useState(false);

  const getPlanner = async () => {
    setIsDownloading(true);

    const plannerFromCloud = await downloadPlannerFromCloud(user.token);

    setIsDownloading(false);

    if (!plannerFromCloud) {
      setIsDownloading(false);
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

  return (
    <button type="button" className="FetchPlanner cloud-button" onClick={getPlanner} disabled={isDownloading}>
      {
        isDownloading
          ? <span className="loader" />
          : <img className="cloud-image" src={DownloadSVG} alt="Baixar os dados da nuvem" />
      }
      <img src={DownloadBackgroundSVG} alt="Baixar os dados para nuvem" className="loader-bg" />
    </button>
  );
}

export default FetchPlanner;
