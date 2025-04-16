import React, {useEffect} from 'react';
import {RealmProvider} from '@realm/react';

import AppContextProvider from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';
import {NavigationContainer} from '@react-navigation/native';
import dbInstance from './src/services/DbInstance';

function App(): React.JSX.Element {
  useEffect(() => {
    const initializeDB = async () => {
      try {
        await dbInstance.init();
        console.log('Realm initialized');
      } catch (error) {
        console.error('Error initializing Realm:', error);
      }
    };

    initializeDB();

    return () => {
      dbInstance.close();
    };
  }, []);
  return (
    <RealmProvider>
      <AppContextProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AppContextProvider>
    </RealmProvider>
  );
}

export default App;
