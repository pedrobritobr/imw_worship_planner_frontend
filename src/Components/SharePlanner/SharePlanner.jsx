import React, { useState, useContext, useEffect } from 'react';

import { PlannerContext } from '@/Context/PlannerContext';
import { UserContext } from '@/Context/UserContext';
import { uploadPlannerToCloud } from '@/service';
import { validatePlanner } from '@/helpers';
import { useDialog } from '@/Context/DialogContext';

function SharePlanner() {
  const { setCurrentPage, pages } = useContext(UserContext);
  const { planner } = useContext(PlannerContext);
  const { showDialog } = useDialog();
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    const sharePlanner = async () => {
      const { creator, ...plannerWithoutCreator } = planner;
      const errorMsg = 'Erro ao salvar o cronograma. Tente novamente mais tarde.';
      try {
        const isValidPlanner = validatePlanner(plannerWithoutCreator);

        if (isValidPlanner) {
          showDialog({
            type: 'alert',
            title: 'Não é possivel compartilhar o cronograma.',
            message: `${isValidPlanner}`,
            autoClose: true,
            autoCloseTimeout: 30,
            onCancel: () => setCurrentPage(pages.Home),
          });
          return;
        }

        setIsSharing(true);
        const response = await uploadPlannerToCloud(plannerWithoutCreator);

        if (!response) {
          showDialog({
            type: 'alert',
            title: 'Atenção',
            message: errorMsg,
            autoClose: true,
            onCancel: () => setCurrentPage(pages.Home),
          });
          return;
        }
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
        showDialog({
          type: 'alert',
          title: 'Não é possivel compartilhar o cronograma.',
          message: errorMsg,
          autoClose: true,
          onCancel: () => setCurrentPage(pages.Home),
        });
        return;
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
        showDialog({
          type: 'alert',
          title: 'Não é possivel compartilhar o cronograma.',
          message: 'Compartilhamento não suportado neste dispositivo.',
          autoClose: true,
          onCancel: () => setCurrentPage(pages.Home),
        });
      }
    };

    sharePlanner();
    setCurrentPage(pages.Home);
  }, []);

  if (isSharing) return (<span className="loader" />);

  return (<div />);
}

export default SharePlanner;
