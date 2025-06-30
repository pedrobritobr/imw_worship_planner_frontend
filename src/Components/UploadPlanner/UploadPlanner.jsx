import React, { useState, useContext, useEffect } from 'react';

import { PlannerContext } from '@/Context/PlannerContext';
import { UserContext } from '@/Context/UserContext';
import { useDialog } from '@/Context/DialogContext';

import { uploadPlannerToCloud } from '@/service';
import { validatePlanner } from '@/helpers';

function UploadPlanner() {
  const { setCurrentPage, pages } = useContext(UserContext);
  const {
    planner,
    downloadedPlanner,
    setDownloadedPlanner,
  } = useContext(PlannerContext);
  const { showDialog } = useDialog();

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const uploadPlanner = async () => {
      const isValidPlanner = validatePlanner(planner, downloadedPlanner);
      if (isValidPlanner) {
        showDialog({
          title: 'Atenção',
          message: isValidPlanner,
          autoClose: true,
          onCancel: () => setCurrentPage(pages.Home),
        });
        return null;
      }

      setIsUploading(true);

      const { creator, ...plannerWithoutCreator } = planner;

      const response = await uploadPlannerToCloud(plannerWithoutCreator);

      setIsUploading(false);

      const sucessMsg = 'Cronograma salvo com sucesso!';
      const errorMsg = 'Por favor, tente novamente mais tarde.';
      showDialog({
        title: response ? 'Sucesso!' : 'Erro ao salvar o cronograma.',
        message: response ? sucessMsg : errorMsg,
        autoClose: true,
        onCancel: () => setCurrentPage(pages.Home),
      });

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
