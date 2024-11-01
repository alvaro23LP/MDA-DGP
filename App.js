import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// PANTALLAS
import HomeScreen from './HomeScreen';
import LoginPage from './LoginPageTeachers';
import LoadingScreen from './LoadingScreen';

const Stack = createStackNavigator();

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

  if (isLoading) {
    return <LoadingScreen />; 
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginPage}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
