import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../config/Colors';
import Screen from './Screen';
import Wallet from './Wallet';
import TopBar from '../components/TopBar';
import BottomTabs from '../components/BottomTabs';

function Home(props) {
  return (
    <Screen style={styles.container}>
      <TopBar />
      <BottomTabs />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    // Add any additional styles for your main content here
  },

  textStyle: {
    color: colors.white,
  },
});

export default Home;
