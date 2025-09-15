import React, { useEffect } from 'react';
   import { NavigationContainer } from '@react-navigation/native';
   import { createStackNavigator } from '@react-navigation/stack';
   import { RPTChat } from './src/services/RPTChatService';

   import AuthScreen from './src/components/AuthScreen';
   import MainScreen from './src/components/MainScreen';
   import SettingsScreen from './src/components/SettingsScreen';

   const Stack = createStackNavigator();

   const App = () => {
     useEffect(() => {
       RPTChat.initialize();
     }, []);

     return (
       <NavigationContainer>
         <Stack.Navigator 
           screenOptions={{ headerShown: false }}
           initialRouteName="Auth"
         >
           <Stack.Screen name="Auth" component={AuthScreen} />
           <Stack.Screen name="Main" component={MainScreen} />
           <Stack.Screen name="Settings" component={SettingsScreen} />
         </Stack.Navigator>
       </NavigationContainer>
     );
   };

   export default App;
