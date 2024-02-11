import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './Screens/WelcomeScreen';
import PlayerScreen from './Screens/PlayerScreen';
import LocalPlayerScreen from './Screens/LocalPlayerScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Player" component={PlayerScreen} />
        <Stack.Screen name="LocalPlayer" component={LocalPlayerScreen} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
