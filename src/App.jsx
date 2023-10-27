import React, { useCallback, useRef } from 'react';
import { toPng } from 'html-to-image';
import Planner from './Components/Planner';

import './App.css';

function App() {
  const ref = useRef(null);
  const onButtonClick = useCallback(() => {
    if (ref.current === null) {
      return;
    }
    const myFilter = (node) => {
      const exclusionClasses = ['ignore-on-print'];
      return !exclusionClasses.some((classname) => node.classList?.contains(classname));
    };

    toPng(ref.current, { cacheBust: true, filter: myFilter })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'my-image-name.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [ref]);

  return (
    <div className="App" ref={ref}>
      <h2>Cronograma do Culto</h2>
      <Planner />
      <button type="button" className="ignore-on-print" onClick={onButtonClick}>Click me</button>
    </div>
  );
}

export default App;
