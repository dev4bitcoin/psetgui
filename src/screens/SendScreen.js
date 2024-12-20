import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, SafeAreaView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../config/Colors';
import ScanScreen from './ScanScreen';
import SendToAddress from './SendToAddress';
import TopBar from '../components/TopBar';
import Screen from './Screen';

function SendScreen(props) {
  console.log(props.route.params);
  const {showScannerScreen} = props.route.params;
  const [showScanner, setShowScanner] = useState(showScannerScreen);

  const onScan = () => {
    setShowScanner(true);
  };

  const onSendToAddress = () => {
    setShowScanner(false);
  };

  return (
    <SafeAreaView style={[styles.screen]}>
      <View style={styles.container}>
        <TopBar title={showScanner ? 'Scan' : 'Send'} showBackButton={true} />
        <View style={styles.pageContainer}>
          {showScanner ? <ScanScreen /> : <SendToAddress />}
        </View>
        <View style={[styles.buttons, {borderTopWidth: showScanner ? 0 : 0.5}]}>
          <TouchableOpacity onPress={onScan}>
            <View style={styles.iconContainer}>
              <View style={styles.iconWrapper}>
                <Icon name="qrcode" color={colors.white} size={35} />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSendToAddress}>
            <View style={styles.iconContainer}>
              <View style={styles.iconWrapper}>
                <Icon name="keyboard" color={colors.white} size={35} />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
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
