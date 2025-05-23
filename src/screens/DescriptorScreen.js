import React, {useContext, useEffect, useRef, useState} from 'react';

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
import WalletFactory from '../wallet/WalletFactory';
import LoadingScreen from './LoadingScreen';
import {AppContext} from '../context/AppContext';

function DescriptorScreen(props) {
  const {useTestnet, setAppSettingByKey} = useContext(AppContext);

  const textInputRef = useRef(null);
  const [descriptor, setDescriptor] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      textInputRef.current?.focus();
    }, 100); // Delay the focus slightly

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  const onPasteFromClipboard = async () => {
    const text = await Clipboard.getString();
    setDescriptor(text);
  };

  const onNext = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));

      const isValid = WalletFactory.ValidateDescriptor(descriptor);
      setShowErrorMessage(!isValid);
      if (isValid) {
        await WalletFactory.initWithDescriptor(descriptor, useTestnet);
        setLoading(false);
        props.navigation.navigate('BottomTabs', {screen: 'Home'});
      }
    } catch (error) {
      setLoading(false);
      setShowErrorMessage(true);
      console.error(error);
    }
  };

  return (
    <Screen style={styles.container}>
      <TopBar title="Descriptor" showBackButton={true} />
      {loading && <LoadingScreen text="Loading wallet" />}

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={150}>
          <View style={styles.textContainer}>
            <TextInput
              ref={textInputRef}
              style={[
                styles.text,
                {
                  borderColor: showErrorMessage
                    ? Colors.error
                    : Colors.textGray,
                },
              ]}
              value={descriptor}
              onChangeText={setDescriptor}
              multiline={true}
              placeholder="Paste your desctiptor here"
              placeholderTextColor={Colors.textGray}
            />
          </View>
          {showErrorMessage && (
            <View style={styles.errorPanel}>
              <Text style={styles.errorText}>Invalid Descriptor</Text>
            </View>
          )}
          <View style={styles.button}>
            <TouchableOpacity onPress={onPasteFromClipboard}>
              <Text style={styles.buttonText}>Paste</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.flexSpacer} />
          <View style={styles.bottomButtonContainer}>
            <TouchableOpacity
              onPress={onNext}
              style={[
                styles.buttonWrapper,
                descriptor.length == 0 ? styles.buttonDisabled : null,
              ]}
              disabled={descriptor.length == 0}>
              <Text
                style={[
                  styles.bottomButtonText,
                  {color: descriptor.length == 0 ? Colors.black : Colors.black},
                ]}>
                Next
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
    paddingBottom: 0,
    paddingHorizontal: 25,
  },
  text: {
    color: Colors.white,
    fontSize: 18,
    borderWidth: 1, // Add border width
    borderColor: Colors.textGray, // Add border color
    height: 140, // Set height
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
    marginBottom: 0,
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
  errorPanel: {
    margin: 25,
    marginTop: 0,
    marginBottom: 0,
    borderWidth: 0.5,
    borderColor: Colors.error,
    backgroundColor: Colors.error,
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    color: Colors.white,
    textAlign: 'center',
  },
});

export default DescriptorScreen;
