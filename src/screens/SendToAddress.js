import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {useNavigation} from '@react-navigation/native';

import colors from '../config/Colors';

function SendToAddress({}) {
  const navigation = useNavigation();
  const [address, setAddress] = useState('');
  const textInputRef = useRef(null);

  useEffect(() => {
    textInputRef.current.focus();
  }, []);

  const onPasteFromClipboard = async () => {
    const text = await Clipboard.getString();
    setAddress(text);
  };

  const onSend = () => {
    navigation.navigate('SendTransactionReview', {address: address});
  };

  const onCancel = () => {
    navigation.goBack();
  };

  return (
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
          <TouchableOpacity onPress={onSend}>
            <View style={styles.bottomButton}>
              <View style={styles.buttonWrapper}>
                <Text style={styles.sendButtonText}>Send</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onCancel}>
          <View style={styles.bottomButton}>
            <View style={styles.buttonWrapper}>
              <Text style={styles.sendButtonText}>Cancel</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
    //marginTop: 3,
    //marginRight: 10,
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
  buttonWrapper: {
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
  },
});

export default SendToAddress;
