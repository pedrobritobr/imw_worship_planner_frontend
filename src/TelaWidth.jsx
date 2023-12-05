/* eslint-disable */
import React, { useState, useEffect } from 'react';

const TelaWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Remover o listener quando o componente for desmontado
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // O segundo argumento vazio garante que o useEffect só é chamado uma vez durante a montagem do componente

  return (
    <div>
      <p>Width atual da tela: {width}px</p>
    </div>
  );
};

export default TelaWidth;
