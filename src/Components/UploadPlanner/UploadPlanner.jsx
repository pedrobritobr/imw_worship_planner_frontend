import React, { useState, useContext } from 'react';
import _ from 'lodash';

import { PlannerContext, getDefaultPlanner } from '@/Context/PlannerContext';

import { uploadPlannerToCloud } from '@/service';

import UploadSVG from '@/assets/cloud-upload-svgrepo-com.svg';
import UploadBackgroundSVG from '@/assets/cloud-upload-background-svgrepo-com.svg';

function UploadPlanner() {
  const {
    planner,
    downloadedPlanner,
    setDownloadedPlanner,
  } = useContext(PlannerContext);
  const [isUploading, setIsUploading] = useState(false);

  const validatePlanner = () => {
    const translatedFields = {
      activities: 'Atividades',
      ministerSelected: 'Ministro',
      worshipTitle: 'Título do Culto',
      churchName: 'Nome da Igreja',
    };

    const missingFields = Object.entries(translatedFields)
      .filter(([field]) => _.isEqual(planner[field], getDefaultPlanner()[field]))
      .map(([, label]) => label);

    if (missingFields.length) {
      return `Os seguintes campos não foram preenchidos:\n- ${missingFields.join('\n- ')}`;
    }

    if (_.isEqual(planner, downloadedPlanner)) {
      return 'Não houve mudanças entre o cronograma baixado/salvo e o cronograma atual';
    }

    return null;
  };

  const uploadPlanner = async () => {
    const { alert } = window;
    const isValidPlanner = validatePlanner();
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
