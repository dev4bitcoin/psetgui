import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';

import Screen from '../Screen';
import TopBar from '../../components/TopBar';
import Colors from '../../config/Colors';
import {GetMnemonic} from '../../wallet/WalletFactory';

function RecoveryPhrase(props) {
  const [seed, setSeed] = useState([]);

  getSeed = async () => {
    const mnemonic = await GetMnemonic();
    setSeed(mnemonic.split(' '));
  };

  useEffect(() => {
    getSeed();
  }, []);

  return (
    <Screen>
      <TopBar title="Recovery Phrase" showBackButton={true} />
      <View style={styles.container}>
        <Text style={styles.warning}>KEEP THIS SEED SAFE.</Text>
        <Text style={styles.warning1}> DO NOT SHARE.</Text>
        <View style={styles.seedContainer}>
          <View style={styles.column}>
            {seed.slice(0, 6).map((word, index) => (
              <View key={index + 1} style={styles.wordContainer}>
                <Text style={styles.index}>#{index + 1}</Text>
                <Text style={styles.word}>{word}</Text>
              </View>
            ))}
          </View>
          <View style={[styles.column, {paddingLeft: 20}]}>
            {seed.slice(6, 12).map((word, index) => (
              <View key={index + 7} style={styles.wordContainer}>
                <Text style={styles.index}>#{index + 7}</Text>
                <Text style={styles.word}>{word}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warning: {
    color: Colors.white,
    fontSize: 23,
    textAlign: 'center',
    padding: 20,
    paddingBottom: 0,
    paddingTop: 30,
  },
  warning1: {
    color: Colors.white,
    fontSize: 23,
    textAlign: 'center',
    padding: 20,
    paddingTop: 5,
  },
  seedContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  wordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
  },
  column: {
    paddingRight: 10,
  },
  word: {
    color: Colors.white,
    fontSize: 18,
  },
  index: {
    color: Colors.textGray,
    fontSize: 18,
    width: 35,
  },
});

export default RecoveryPhrase;
