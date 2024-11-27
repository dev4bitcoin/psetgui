import React from 'react';
import {StyleSheet, Text} from 'react-native';
import colors from '../../config/colors';
import Screen from './screen';

function home(props) {
  return (
    <Screen style={styles.container}>
      <Text style={styles.textStyle}>Home</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    color: colors.white,
  },
});

export default home;
