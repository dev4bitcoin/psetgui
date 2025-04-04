import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  Alert,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

import colors from '../config/Colors';
import Screen from './Screen';
import WalletFactory from '../wallet/WalletFactory';
import TopBar from '../components/TopBar';

function SendToAddress({navigation, route}) {
  const {amount, ticker} = route.params;
  const [address, setAddress] = useState('');
  const textInputRef = useRef(null);

  useEffect(() => {
    textInputRef.current.focus();
  }, []);

  const onPasteFromClipboard = async () => {
    const text = await Clipboard.getString();
    const isValid = WalletFactory.ValidateAddress(text?.trim());
    if (!isValid) {
      console.log('Invalid address');
      Alert.alert('Invalid address', 'The invoice contains an invalid address');
      return;
    }

    setAddress(text);
  };

  const onConfirm = async () => {
    const isValid = WalletFactory.ValidateAddress(address?.trim());
    if (!isValid) {
      console.log('Invalid address');
      Alert.alert('Invalid address', 'The invoice contains an invalid address');
      return;
    }
    navigation.navigate('SendTransactionReview', {
      address: address,
      amount: amount,
      ticker: ticker,
    });
  };

  const onCancel = () => {
    navigation.goBack();
  };

  const onSecondaryButtonPress = () => {
    navigation.navigate('ScanScreen', {
      amount: amount,
      ticker: ticker,
    });
  };

  return (
    <Screen style={styles.screen}>
      <TopBar
        showBackButton={true}
        showSecondaryButton={true}
        onSecondaryButtonPress={onSecondaryButtonPress}
        secondaryIcon="qrcode"
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}>
        <View style={styles.addressText}>
          <Text style={styles.text}>Enter recipient's address</Text>
        </View>
        <View style={styles.inputAndIconContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              ref={textInputRef}
              style={styles.textInput}
              value={address}
              onChangeText={setAddress}
            />
          </View>
        </View>
        <View style={styles.button}>
          <TouchableOpacity onPress={onPasteFromClipboard}>
            <Text style={styles.buttonText}>Paste</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.flexSpacer} />
        <View style={styles.bottomButtonContainer}>
          {address.length > 0 && (
            <TouchableOpacity onPress={onConfirm}>
              <View
                style={[styles.bottomButton, {backgroundColor: colors.white}]}>
                <Text style={[styles.sendButtonText, {color: colors.black}]}>
                  Confirm
                </Text>
              </View>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={onCancel}>
            <View style={styles.bottomButton}>
              <Text style={styles.sendButtonText}>Cancel</Text>
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  addressText: {
    marginTop: 20,
    alignItems: 'center',
  },
  keyboardAvoidingContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputAndIconContainer: {
    marginTop: 50,
    marginLeft: 30,
    marginRight: 30,
    flexDirection: 'row',
  },
  inputContainer: {
    borderRadius: 5,
    width: '100%',
    height: 50,
  },
  textInput: {
    fontSize: 30,
    color: colors.white,
    textAlign: 'center',
    height: 50,
  },
  icon: {
    backgroundColor: colors.lightGray,
    borderRadius: 50,
  },
  text: {
    fontSize: 25,
    width: 250,
    textAlign: 'center',
    color: colors.white,
  },
  sendButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.lightGray,
    padding: 15,
    width: 150,
    borderRadius: 20,
    marginTop: 30,
    marginBottom: 10,
    alignSelf: 'center',
  },
  flexSpacer: {
    flex: 1,
  },
  bottomButtonContainer: {
    paddingHorizontal: 30,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  bottomButton: {
    backgroundColor: colors.lightGray,
    borderColor: colors.white,
    borderWidth: 2,
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
    marginTop: 10,
  },

  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
  },
});

export default SendToAddress;
