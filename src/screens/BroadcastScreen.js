import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Screen from './Screen';

function BroadcastScreen(props) {
  return (
    <Screen style={styles.container}>
      <Text style={styles.text}>Broadcast</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    color: 'white',
  },
});

export default BroadcastScreen;
