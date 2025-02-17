import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import ToastManager, {Toast} from 'toastify-react-native';
import Clipboard from '@react-native-clipboard/clipboard';

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

  const onCopy = () => {
    ReactNativeHapticFeedback.trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    const seedString = seed.join(' ');
    console.log(seedString);
    Clipboard.setString(seedString);
    Toast.info('Copied to clipboard!', 'bottom');
  };

  return (
    <Screen>
      <TopBar title="Recovery Phrase" showBackButton={true} />
      <ToastManager
        showCloseIcon={false}
        showProgressBar={false}
        style={styles.toastStyle}
        height={60}
        animationStyle={'rightInOut'}
        textStyle={styles.toastTextStyle}
        duration={1000}
        positionValue={100}
      />
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
        <View style={styles.copySection}>
          <TouchableOpacity onPress={onCopy}>
            <Text style={styles.copyButton}>COPY</Text>
          </TouchableOpacity>
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
  copySection: {
    marginTop: 100,
    alignItems: 'center',
  },
  copyButton: {
    color: Colors.white,
    fontSize: 20,
    padding: 10,
    borderWidth: 1,
    width: 160,
    borderColor: Colors.white,
    borderRadius: 20,
    textAlign: 'center',
    backgroundColor: Colors.lightGray,
  },
  toastStyle: {
    borderRadius: 20,
  },
  toastTextStyle: {
    fontSize: 26,
  },
});

export default RecoveryPhrase;
