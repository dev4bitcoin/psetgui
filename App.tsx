import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import AppContextProvider from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';
import {NavigationContainer} from '@react-navigation/native';

function App(): React.JSX.Element {
  return (
    <AppContextProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AppContextProvider>
  );
}

export default App;
