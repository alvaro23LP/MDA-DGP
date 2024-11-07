import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// PANTALLAS
import TeachersMainScreen from './teachersMainScreen';
import HomeScreen from './HomeScreen';
import LoginPage from './LoginPageTeachers';
import LoadingScreen from './LoadingScreen';
import PasswordUser from './PasswordUser';
import TaskManagement from './taskManagement';
import UsersManagement from './UsersManagement';
import EditUser from './EditUser';
import AddUser from './AddUser';
import UserScreen from './UserMainScreen';


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
          //options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LoginUser"
          component={PasswordUser}
          //options={{ title: 'Selecciona la Contraseña' }}
        />
        <Stack.Screen
            name="UserScreen"
            component={UserScreen}
        />
        
        <Stack.Screen 
         name="TeachersMainScreen" 
         component={TeachersMainScreen}
         options={{ headerLeft: () => null }}
        />

        <Stack.Screen
          name="TaskManagement"
          component={TaskManagement}
        />

        <Stack.Screen
          name="UsersManagement"
          component={UsersManagement}
        />

        <Stack.Screen
          name="EditUser"
          component={EditUser}
        />

        <Stack.Screen
          name="AddUser"
          component={AddUser}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
