import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Screen from './Screen';
import TopBar from '../components/TopBar';
import Colors from '../config/Colors';

function AboutScreen(props) {
  return (
    <Screen style={styles.container}>
      <TopBar title="About" showBackButton={true} />
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            The PSET Signer GUI is a user-friendly application designed for
            analyzing and signing Partially Signed Bitcoin Transactions (PSETs)
            with a focus on software signing.
          </Text>
        </View>
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 0.1</Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  textContainer: {
    marginTop: 20,
  },
  text: {
    fontSize: 20,
    color: Colors.white,
    padding: 20,
    paddingHorizontal: 30,
  },
  versionContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  versionText: {
    fontSize: 20,
    color: Colors.white,
    padding: 20,
    paddingHorizontal: 30,
    textAlign: 'center',
  },
});

export default AboutScreen;
