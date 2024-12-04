import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import BottomTabs from './src/components/BottomTabs';
import TopBar from './src/components/TopBar';
import Screen from './src/screens/Screen';

function App(): React.JSX.Element {
  return (
    <Screen style={styles.container}>
      <NavigationContainer>
        <TopBar />
        <View style={styles.bottomTabsContainer}>
          <BottomTabs />
        </View>
      </NavigationContainer>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomTabsContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});

export default App;
