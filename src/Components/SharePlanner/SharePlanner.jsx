import React, { useState, useContext, useEffect } from 'react';

import { PlannerContext } from '@/Context/PlannerContext';
import { UserContext } from '@/Context/UserContext';
import { uploadPlannerToCloud } from '@/service';
import { validatePlanner } from '@/helpers';

function SharePlanner() {
  const { setCurrentPage, pages } = useContext(UserContext);
  const { planner } = useContext(PlannerContext);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    const sharePlanner = async () => {
      const { creator, ...plannerWithoutCreator } = planner;

      const errorMsg = 'Erro ao salvar o cronograma. Tente novamente mais tarde.';
      const { alert } = window;
      try {
        const isValidPlanner = validatePlanner(plannerWithoutCreator);

        if (isValidPlanner) {
          alert(`Não é possivel compartilhar o cronograma.\n${isValidPlanner}`);
          return;
        }

        setIsSharing(true);
        const response = await uploadPlannerToCloud(plannerWithoutCreator);

        if (!response) {
          alert(errorMsg);
          return;
        }
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
        alert(errorMsg);
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

    sharePlanner();
    setCurrentPage(pages.Home);
  }, []);

  if (isSharing) return (<span className="loader" />);

  return (<div />);
}

export default SharePlanner;
