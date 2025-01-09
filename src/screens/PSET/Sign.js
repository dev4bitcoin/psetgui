import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Screen from '../Screen';
import TopBar from '../../components/TopBar';

function Sign(props) {
  return (
    <Screen style={styles.container}>
      <TopBar title="Sign" showBackButton={true} />
      <View style={styles.content}>
        <Text>PSET Detail</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Sign;
