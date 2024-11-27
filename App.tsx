import React from 'react';
import {StyleSheet} from 'react-native';

import Home from './src/screens/home';
import Screen from './src/screens/screen';

function App(): React.JSX.Element {
  return (
    <Screen style={styles.container}>
      <Home />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
