import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

import Screen from './Screen';
import TopBar from '../components/TopBar';
import Colors from '../config/Colors';
import {IsValidPSET} from '../wallet/WalletFactory';

function PSETScreen(props) {
  const textInputRef = useRef(null);
  const [pset, setPset] = useState('');

  useEffect(() => {
    textInputRef.current.focus();
  }, []);

  const onPasteFromClipboard = async () => {
    const text = await Clipboard.getString();
    setPset(text);
  };

  const onAnalyze = async () => {
    try {
      const isValid = await IsValidPSET(pset);
      console.log(isValid);
    } catch (error) {
      console.error(error);
    }
    //const isValid = await IsValidPSET(pset);
    //console.log(isValid);
    //props.navigation.navigate('Sign', {pset: pset});
  };

  return (
    <Screen style={styles.container}>
      <TopBar title="PSET" showBackButton={false} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={200}>
          <View style={styles.textContainer}>
            <TextInput
              ref={textInputRef}
              style={styles.text}
              value={pset}
              onChangeText={setPset}
              multiline={true}
              placeholder="Paste your PSET here"
              placeholderTextColor={Colors.textGray}
            />
          </View>
          <View style={styles.button}>
            <TouchableOpacity onPress={onPasteFromClipboard}>
              <Text style={styles.buttonText}>Paste</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.flexSpacer} />
          <View style={styles.bottomButtonContainer}>
            <TouchableOpacity
              onPress={onAnalyze}
              style={[
                styles.buttonWrapper,
                pset.length == 0 ? styles.buttonDisabled : null,
              ]}
              disabled={pset.length == 0}>
              <Text
                style={[
                  styles.bottomButtonText,
                  {color: pset.length == 0 ? Colors.black : Colors.black},
                ]}>
                Analyze
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textContainer: {
    padding: 16,
    paddingHorizontal: 25,
  },
  text: {
    color: Colors.white,
    fontSize: 18,
    borderWidth: 1, // Add border width
    borderColor: Colors.textGray, // Add border color
    borderRadius: 8, // Optional: Add border radius for rounded corners
    height: 150, // Set height
    width: '100%', // Set width
    textAlign: 'center',
    textAlignVertical: 'center',
  },

  button: {
    backgroundColor: Colors.lightGray,
    padding: 15,
    width: 150,
    borderRadius: 20,
    marginTop: 15,
    marginBottom: 10,
    alignSelf: 'center',
  },

  flexSpacer: {
    flex: 1,
  },
  bottomButton: {
    alignItems: 'center',
  },
  bottomButtonContainer: {
    padding: 20,
    alignItems: 'center',
  },
  buttonWrapper: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderColor: Colors.white,
    borderWidth: 2,
    padding: 20,
    borderRadius: 50,
    width: '100%',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
  },
  bottomButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    textAlign: 'center',
  },
  buttonDisabled: {
    backgroundColor: Colors.lightGray,
    borderColor: Colors.lightGray,
    borderWidth: 0.5,
  },
});

export default PSETScreen;
