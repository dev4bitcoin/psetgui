import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Clipboard from '@react-native-clipboard/clipboard';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import ToastManager, {Toast} from 'toastify-react-native';

import TopBar from '../components/TopBar';
import Colors from '../config/Colors';

function ReceiveScreen(props) {
  const {address} = props.route.params;

  const onCopy = () => {
    ReactNativeHapticFeedback.trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    Clipboard.setString(address);
    Toast.info('Copied to clipboard!', 'bottom');
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: address,
        url: '',
        title: 'address',
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
    <View style={styles.container}>
      <TopBar title="Receive" showBackButton={true} />
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
        <QRCode size={250} color={Colors.black} value={address} />
      </View>
      <View style={styles.address}>
        <Text style={styles.addressHeader}>Address:</Text>
        <Text
          style={styles.addressText}
          numberOfLines={1}
          ellipsizeMode="middle">
          {address}
        </Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  address: {
    padding: 20,
    borderRadius: 20,
    marginTop: 20,
    alignContent: 'center',
    alignItems: 'center',
  },
  addressHeader: {
    color: Colors.textGray,
    fontSize: 20,
    paddingBottom: 20,
  },
  addressText: {
    padding: 10,
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
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

export default ReceiveScreen;
