import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './Screens/WelcomeScreen';
import PlayerScreen from './Screens/PlayerScreen';
import LocalPlayerScreen from './Screens/LocalPlayerScreen';
import { SelectedFileProvider } from './components/SelectedFileContext';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <SelectedFileProvider>
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          animation: 'none', // Disable transition animations
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Player" component={PlayerScreen} options={{headerShown: false}} />
        <Stack.Screen name="LocalPlayer" component={LocalPlayerScreen} options={{ headerShown: false }}/> 
      </Stack.Navigator>
    </NavigationContainer>
    </SelectedFileProvider>
  );
};

export default App;
