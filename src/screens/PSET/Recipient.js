import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Share} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Clipboard from '@react-native-clipboard/clipboard';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import ToastManager, {Toast} from 'toastify-react-native';

import Screen from '../Screen';
import TopBar from '../../components/TopBar';
import Colors from '../../config/Colors';

function Recipient(props) {
  const {recipient} = props.route.params;

  const onCopy = () => {
    ReactNativeHapticFeedback.trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    Clipboard.setString(recipient?.address);
    Toast.info('Copied to clipboard!', 'bottom');
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: recipient?.address,
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
    <Screen style={styles.container}>
      <TopBar title="Recipient" showBackButton={true} />
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
      <View style={styles.content}>
        <View style={styles.recipientItem}>
          <Text style={styles.recipientAmount}>Amount</Text>
          <Text style={styles.recipientAmount}>{recipient?.amount}</Text>
        </View>
        <View style={styles.splitter}></View>

        <View style={styles.qrcode}>
          <QRCode
            size={250}
            color={Colors.white}
            backgroundColor={Colors.black}
            value={recipient?.address}
          />
        </View>
        <View style={styles.addressContainer}>
          {recipient?.address && (
            <>
              <Text style={styles.recipientAddress}>
                {recipient?.address
                  .slice(0, 16)
                  .match(/.{1,4}/g)
                  .join('     ')}
                {/* First 4 characters */}
              </Text>
              <Text
                style={[
                  styles.recipientAddress,
                  {textAlign: 'center', paddingBottom: 10},
                ]}>
                ...
              </Text>
              <Text style={styles.recipientAddress}>
                {recipient?.address
                  .slice(-16)
                  .match(/.{1,4}/g)
                  .join('     ')}
              </Text>
            </>
          )}
        </View>
        <View style={styles.splitter}></View>

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
    padding: 20,
    //paddingHorizontal: 40,
  },
  splitter: {
    marginHorizontal: 20,
    height: 0.3,
    backgroundColor: Colors.textGray,
  },
  recipientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  addressContainer: {
    padding: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  recipientAddress: {
    fontSize: 18,
    paddingHorizontal: 10,
    color: Colors.white,
  },
  recipientAmount: {
    fontSize: 16,
    color: Colors.white,
  },
  qrcode: {
    alignSelf: 'center',
    padding: 20,
    backgroundColor: Colors.black,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: Colors.textGray,
    marginTop: 30,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 50,
  },
  button: {
    backgroundColor: Colors.lightGray,
    padding: 15,
    marginHorizontal: 10,
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

export default Recipient;
