import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import LoginPage from '../screens/teachers/LoginPageTeachers';
import TeachersMainScreen from '../screens/teachers/teachersMainScreen';
import TaskManagement from '../screens/teachers/taskManagement/taskManagement';
import TaskAssignment from '../screens/teachers/taskManagement/taskAssignment'; 
import UsersManagement from '../screens/teachers/userManagement/UsersManagement';
import EditUser from '../screens/teachers/userManagement/EditUser';
import AddUser from '../screens/teachers/userManagement/AddUser';

const Stack = createStackNavigator();

export default function TeacherNavigator() {
  return (
    <Stack.Navigator initialRouteName="TeachersMainScreen">
      <Stack.Screen name="LoginPage" component={LoginPage} />
      <Stack.Screen name="TeachersMainScreen" component={TeachersMainScreen} />
      <Stack.Screen name="TaskManagement" component={TaskManagement} />
      <Stack.Screen name="TaskAssignment" component={TaskAssignment}/>
      <Stack.Screen name="UsersManagement" component={UsersManagement} />
      <Stack.Screen name="EditUser" component={EditUser} />
      <Stack.Screen name="AddUser" component={AddUser} />
    </Stack.Navigator>
  );
}
