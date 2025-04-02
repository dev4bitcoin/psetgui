import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import ToastManager from 'toastify-react-native';
import QRCode from 'react-native-qrcode-svg';

import Screen from '../Screen';
import TopBar from '../../components/TopBar';
import Colors from '../../config/Colors';

function ExportPSET(props) {
  const {psetString} = props.route.params;

  const onCopy = () => {
    ReactNativeHapticFeedback.trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    Clipboard.setString(psetString);
    Toast.info('Copied to clipboard!', 'bottom');
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: psetString,
        url: '',
        title: 'PSET',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <Screen style={styles.container}>
      <TopBar title="Export PSET" isHomeScreen={false} showBackButton={true} />
      <View style={styles.content}>
        <ToastManager
          showCloseIcon={false}
          showProgressBar={false}
          style={styles.toastStyle}
          height={60}
          animationStyle={'rightInOut'}
          textStyle={styles.toastTextStyle}
          duration={1000}
        />
        <View style={styles.placeholder}></View>
        <View style={styles.qrcode}>
          {/* <QRCode ecl="L" size={250} color={Colors.black} value={psetString} /> */}
        </View>

        <View style={styles.buttons}>
          <View style={styles.button}>
            <TouchableOpacity onPress={onCopy}>
              <Text style={styles.buttonText}>COPY</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.placeholder}></View>
          <View style={styles.button}>
            <TouchableOpacity onPress={onShare}>
              <Text style={styles.buttonText}>SHARE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    backgroundColor: Colors.appBackground,
    paddingTop: 70,
  },
  placeholder: {
    height: 50,
    width: 30,
  },
  qrcode: {
    padding: 30,
    backgroundColor: Colors.white,
    borderRadius: 20,
  },

  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    backgroundColor: Colors.lightGray,
    padding: 15,
    width: 120,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
  },
  toastStyle: {
    borderRadius: 20,
  },
  toastTextStyle: {
    fontSize: 20,
  },
});

export default ExportPSET;
