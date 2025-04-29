import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
  Switch,
  Platform,
} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {useRealm} from '@realm/react';

import TopBar from '../../components/TopBar';
import Colors from '../../config/Colors';
import wordList from '../../config/WordList';
import LoadingScreen from '../LoadingScreen';
import WalletFactory from '../../wallet/WalletFactory';
import {AppContext} from '../../context/AppContext';
import Constants from '../../config/Constants';

function SignWithMnemonic(props) {
  const {useTestnet, setAppSettingByKey} = useContext(AppContext);

  const [lengthSelection, setLengthSelection] = useState('12');
  const [inputValues, setInputValues] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [activeInputIndex, setActiveInputIndex] = useState(null);
  const [mnemonicSaved, setMnemonicSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Setting up the wallet...');
  const realm = useRealm();

  useEffect(() => {
    const keyboardListeners = [
      Keyboard.addListener('keyboardWillHide', () => {
        setSuggestions([]);
      }),
    ];

    return () => {
      keyboardListeners.forEach(listener => listener.remove());
    };
  }, []);

  const onPressLengthSelection = length => {
    setLengthSelection(length);
  };

  const OnSign = async () => {
    setLoading(true);
    const selectedLength = parseInt(lengthSelection, 10); // Convert lengthSelection to a number
    const enteredWords = Object.values(inputValues).filter(
      word => word.trim() !== '',
    ); // Get non-empty words

    if (enteredWords.length === selectedLength) {
      const mnemonic = enteredWords.join(' ');
      setAppSettingByKey(
        useTestnet ? Constants.SAVE_MNEMONIC_TESTNET : Constants.SAVE_MNEMONIC,
        mnemonicSaved?.toString(),
      );
      await WalletFactory.init(realm, mnemonic, useTestnet);
      await WalletFactory.CreateWallet(realm, mnemonicSaved);
      setLoading(false);
      props.navigation.navigate('BottomTabs');
    } else {
      setLoading(false);
      Alert.alert(`Please enter all ${selectedLength} words.`);
    }
  };

  const handleInputChange = (text, index) => {
    setInputValues(prev => ({...prev, [index]: text}));
    // Show suggestions only if text is entered
    if (text.trim() !== '') {
      const filteredSuggestions = wordList.filter(item =>
        item.toLowerCase().startsWith(text.toLowerCase()),
      );
      setSuggestions(filteredSuggestions);
      setActiveInputIndex(index); // Track which input is active
    } else {
      setSuggestions([]); // Clear suggestions if input is empty
      setActiveInputIndex(null);
    }
  };

  const handleSuggestionSelect = suggestion => {
    if (activeInputIndex !== null) {
      setInputValues(prev => ({...prev, [activeInputIndex]: suggestion}));
      setSuggestions([]); // Clear suggestions after selection
      setActiveInputIndex(null); // Clear active input index (optional)
    }
    Keyboard.dismiss(); // Explicitly dismiss the keyboard after handling
  };

  const onToggleSaveMnemonicSwitch = async () => {
    ReactNativeHapticFeedback.trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    const status = !mnemonicSaved;
    setMnemonicSaved(status);
  };

  const renderlengthSelectionButtons = text => {
    return (
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor:
              lengthSelection == text ? Colors.white : Colors.appBackground,
          },
        ]}
        onPress={() => onPressLengthSelection(text)}>
        <Text
          style={[
            styles.text,
            {
              color: lengthSelection == text ? Colors.black : Colors.white,
            },
          ]}>
          {text}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderTextInput = textIndex => {
    return (
      <View key={textIndex} style={styles.inputContent}>
        <Text style={styles.index}>{textIndex + 1}</Text>
        <TextInput
          style={styles.textInputStyle}
          autoCorrect={false}
          value={inputValues[textIndex]}
          keyboardType="visible-password"
          onChangeText={text => handleInputChange(text, textIndex)}
          autoCapitalize="none" // Disable auto-capitalization
          autoCompleteType="off" // Disable autocomplete suggestions (iOS)
          textContentType="none" // Prevents suggestions (iOS)
          onFocus={() => {
            setActiveInputIndex(textIndex); // Only update if the index changes
          }}
        />
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, {paddingTop: Platform.OS === 'ios' ? 50 : 0}]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TopBar showBackButton={true} showBackButtonText={true} />
      {loading && <LoadingScreen text={loadingText} />}

      <ScrollView style={styles.content}>
        <Text style={styles.header}>Enter your recovery phrase</Text>
        <View style={styles.passphraseLengthSelection}>
          {renderlengthSelectionButtons('12')}
          <View style={styles.splitter} />
          {renderlengthSelectionButtons('24')}
        </View>
        <View style={styles.textInputContainer}>
          {Array.from({length: lengthSelection}, (_, index) =>
            renderTextInput(index),
          )}
        </View>
      </ScrollView>
      <View>
        <View style={styles.saveMnemonicContainer}>
          <Text style={styles.itemText}>Save Mnemonic</Text>
          <TouchableOpacity onPress={onToggleSaveMnemonicSwitch}>
            <Switch
              trackColor={{false: Colors.textGray, true: Colors.priceGreen}}
              thumbColor={mnemonicSaved ? Colors.white : Colors.lightGray}
              ios_backgroundColor={Colors.textGray}
              onValueChange={onToggleSaveMnemonicSwitch}
              value={mnemonicSaved}
              //disabled={true}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={OnSign} style={styles.bottomButtonContainer}>
          <Text style={styles.bottomButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
      {/* {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            keyboardShouldPersistTaps="handled" // Ensures taps on suggestions don't dismiss the keyboard
            renderItem={({item}) => (
              <View key={item} style={styles.suggestionItemContainer}>
                <TouchableOpacity
                  onPress={() => handleSuggestionSelect(item)}
                  style={styles.suggestionItem}>
                  <Text style={styles.suggestionText}>{item}</Text>
                </TouchableOpacity>
                <View style={styles.splitter1} />
              </View>
            )}
          />
        </View>
      )} */}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.appBackground,
  },
  content: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textGray,
    margin: 20,
    alignSelf: 'center',
  },
  passphraseLengthSelection: {
    flexDirection: 'row',
    borderColor: Colors.textGray,
    borderRadius: 5,
    borderWidth: 1,
    width: 75,
    alignSelf: 'flex-end',
    marginRight: 50,
  },
  splitter: {
    width: 1,
    marginVertical: 5,
    backgroundColor: Colors.textGray,
  },
  splitter1: {
    width: 0.5,
    height: 25,
    backgroundColor: Colors.textGray,
  },
  button: {
    padding: 5,
    margin: 3,
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
    color: Colors.white,
    textAlign: 'center',
  },
  textInputContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    margin: 10,
  },
  inputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
  },
  index: {
    fontSize: 18,
    color: Colors.textGray,
    alignSelf: 'center',
    width: 22,
  },
  textInputStyle: {
    margin: 5,
    maerginLeft: 0,
    borderColor: Colors.textGray,
    borderWidth: 1,
    borderRadius: 5,
    width: 75,
    height: 35,
    color: Colors.white,
    fontSize: 13,
    paddingLeft: 5,
  },
  suggestionsContainer: {
    backgroundColor: Colors.darkGray,
    borderColor: Colors.textGray,
    paddingVertical: 5,
    width: '100%',
  },
  suggestionItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestionItem: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    paddingRight: 15,
  },
  suggestionText: {
    fontSize: 16,
    color: Colors.white,
  },
  bottomButtonContainer: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderColor: Colors.white,
    borderWidth: 2,
    padding: 20,
    borderRadius: 50,
    margin: 40,
    marginTop: 30,
  },
  bottomButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    textAlign: 'center',
  },
  saveMnemonicContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    paddingTop: 25,
    marginBottom: 0,
    borderTopWidth: 0.3,
    borderTopColor: Colors.textGray,
  },
  itemText: {
    fontSize: 18,
    color: Colors.white,
    paddingRight: 20,
  },
});

export default SignWithMnemonic;
