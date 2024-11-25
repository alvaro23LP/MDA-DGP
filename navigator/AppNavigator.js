// navigator/AppNavigator.js
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Pantallas comunes
import HomeScreen from '../screens/HomeScreen';
import PasswordUser from '../screens/PasswordUser';
import LoadingScreen from '../screens/LoadingScreen';

//Pantallas de estudiantes
import UserScreen from '../screens/students/UserMainScreen';
import ShowFotocopia from '../screens/students/ShowFotocopia';

// Pantallas de profesores
import LoginPage from '../screens/teachers/LoginPageTeachers';
import TeachersMainScreen from '../screens/teachers/teachersMainScreen';
import TaskManagement from '../screens/teachers/taskManagement/taskManagement';
import UsersManagement from '../screens/teachers/userManagement/UsersManagement';
import EditUser from '../screens/teachers/userManagement/EditUser';
import AddUser from '../screens/teachers/userManagement/AddUser';
import TaskFotocopias from '../screens/teachers/taskManagement/taskFotocopias';


const Stack = createStackNavigator();




export default function AppNavigator({ isLoading}) {

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


        {/* Pantallas de profesores */}
        <Stack.Screen
          name="LoginPage"
          component={LoginPage}
          options={{ headerShown: false }}
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

        <Stack.Screen
          name="TaskFotocopias"
          component={TaskFotocopias}
        />



       {/* Pantallas de estudiantes */}
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
          name= "ShowFotocopia"
          component={ShowFotocopia}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
