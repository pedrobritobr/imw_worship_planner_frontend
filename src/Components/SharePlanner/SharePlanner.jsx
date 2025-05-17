import React, { useState, useContext } from 'react';

import { PlannerContext } from '@/Context/PlannerContext';

import { uploadPlannerToCloud } from '@/service';

import DownloadBackgroundSVG from '@/assets/cloud-download-background-svgrepo-com.svg';
import ShareBtnSVG from '@/assets/share-svgrepo-com.svg';

function SharePlanner() {
  const { planner } = useContext(PlannerContext);
  const [isSharing, setIsSharing] = useState(false);

  const sharePlanner = async () => {
    const { creator, ...plannerWithoutCreator } = planner;

    const { alert } = window;
    try {
      setIsSharing(true);
      const response = await uploadPlannerToCloud(plannerWithoutCreator);

      const errorMsg = 'Erro ao salvar o cronograma. Tente novamente mais tarde.';
      if (!response) {
        alert(errorMsg);
        return;
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      alert('Erro ao salvar o cronograma. Tente novamente mais tarde.');
    } finally {
      setIsSharing(false);
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'IMW Cronograma de culto',
          text: 'Confira o cronograma de culto!',
          url: `${window.location.href}?shared=true`,
        });
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
      }
    } else {
      alert('Compartilhamento não suportado neste dispositivo.');
    }
  };

  return (
    <button type="button" className="SharePlanner cloud-button" onClick={sharePlanner} disabled={isSharing}>
      {
        isSharing
          ? <span className="loader" />
          : <img className="cloud-image" src={ShareBtnSVG} alt="Compartilhar Cronograma" />
      }
      <img src={DownloadBackgroundSVG} alt="Enviar os dados para nuvem" className="loader-bg" />
    </button>
  );
}

export default SharePlanner;
