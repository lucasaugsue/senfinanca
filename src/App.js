import { Notifications } from '@mantine/notifications';
import React from 'react';
import FiancaContext from '../src/context/FiancaContext';
import './App.css';
import Render from './Render';


function App() {
  const [currentFianca] = React.useState(JSON.parse(localStorage.getItem("sen-fianca")))

  const changeList = (data) => {
    localStorage.setItem("sen-fianca", JSON.stringify(data))
  }
  
  const fiancaContext = React.useMemo(() => ({
    currentFianca,
    changeList,
  }), [currentFianca])

  return (
    <FiancaContext.Provider value={fiancaContext}>
      <Render />
      <Notifications />
    </FiancaContext.Provider>
  );
}

export default App;
