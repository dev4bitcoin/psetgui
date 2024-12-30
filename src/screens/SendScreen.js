import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import colors from '../config/Colors';
import ScanScreen from './ScanScreen';
import SendToAddress from './SendToAddress';
import Screen from './Screen';

function SendScreen(props) {
  console.log(props.route.params);
  const {showScannerScreen} = props.route.params;
  const [showScanner, setShowScanner] = useState(showScannerScreen);

  return (
    <Screen style={[styles.screen]}>
      <View style={styles.container}>
        <View style={styles.pageContainer}>
          {showScanner ? <ScanScreen /> : <SendToAddress />}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  container: {
    flex: 1,
  },
  pageContainer: {
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    padding: 10,
    bottom: 5, // Ensure the buttons are at the bottom
    justifyContent: 'space-around',
    borderColor: colors.textGray,
  },
  iconContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  iconWrapper: {
    backgroundColor: colors.lightGray,
    borderRadius: 50,
    padding: 10,
  },
});

export default SendScreen;
