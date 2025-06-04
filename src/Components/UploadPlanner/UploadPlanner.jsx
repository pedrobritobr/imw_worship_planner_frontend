import React, { useState, useContext, useEffect } from 'react';

import { PlannerContext } from '@/Context/PlannerContext';
import { UserContext } from '@/Context/UserContext';

import { uploadPlannerToCloud } from '@/service';
import { validatePlanner } from '@/helpers';

function UploadPlanner() {
  const { setCurrentPage, pages } = useContext(UserContext);
  const {
    planner,
    downloadedPlanner,
    setDownloadedPlanner,
  } = useContext(PlannerContext);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const uploadPlanner = async () => {
      const { alert } = window;

      const isValidPlanner = validatePlanner(planner, downloadedPlanner);
      if (isValidPlanner) return alert(isValidPlanner);

      setIsUploading(true);

      const { creator, ...plannerWithoutCreator } = planner;

      const response = await uploadPlannerToCloud(plannerWithoutCreator);

      setIsUploading(false);

      const sucessMsg = 'Cronograma salvo com sucesso!';
      const errorMsg = 'Erro ao salvar o cronograma. Tente novamente mais tarde.';
      alert(response ? sucessMsg : errorMsg);

      setDownloadedPlanner(planner);
      return null;
    };

    uploadPlanner();
    setCurrentPage(pages.Home);
  }, []);

  if (isUploading) return <span className="loader" />;

  return (<div />);
}

export default UploadPlanner;
