import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import BottomTabs from './src/components/BottomTabs';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <BottomTabs />
    </SafeAreaProvider>
  );
}

export default App;
