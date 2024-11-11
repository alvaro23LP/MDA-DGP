import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import UserMainScreen from '../screens/students/UserMainScreen';

const Stack = createStackNavigator();

export default function StudentNavigator() {
  return (
    <Stack.Navigator initialRouteName="UserMainScreen">
        <Stack.Screen name="UserMainScreen" component={UserMainScreen} />
    </Stack.Navigator>
  );
}