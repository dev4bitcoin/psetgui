import React from 'react';
import {StyleSheet, Text} from 'react-native';
import colors from '../config/colors';
import Screen from './screen';
import Wallet from './wallet';
import TopBar from '../components/topbar';

function Home(props) {
  return (
    <Screen style={styles.container}>
      <TopBar />
      <Wallet />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textStyle: {
    color: colors.white,
  },
});

export default Home;
