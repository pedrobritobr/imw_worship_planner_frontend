import React, { useState, useContext } from 'react';

import { PlannerContext } from '@/Context/PlannerContext';

import { uploadPlannerToCloud } from '@/service';
import { validatePlanner } from '@/helpers';

import UploadSVG from '@/assets/cloud-upload-svgrepo-com.svg';
import UploadBackgroundSVG from '@/assets/cloud-upload-background-svgrepo-com.svg';

function UploadPlanner() {
  const {
    planner,
    downloadedPlanner,
    setDownloadedPlanner,
  } = useContext(PlannerContext);
  const [isUploading, setIsUploading] = useState(false);

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

  return (
    <button type="button" className="UploadPlanner cloud-button" onClick={uploadPlanner} disabled={isUploading}>
      {
        isUploading
          ? <span className="loader" />
          : <img className="cloud-image" src={UploadSVG} alt="Enviar os dados para nuvem" />
      }
      <img src={UploadBackgroundSVG} alt="Enviar os dados para nuvem" className="loader-bg" />
    </button>
  );
}

export default UploadPlanner;
