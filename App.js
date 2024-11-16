import React, { useEffect, useState } from 'react';
import AppNavigator from './navigator/AppNavigator';


export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Retraso para cargar la aplicación
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simula un retraso de 2 segundos
      setIsLoading(false); // Cambia el estado de carga
    };

    loadData();
  }, []);


  return (
    <AppNavigator isLoading={isLoading}/>
  );

}
