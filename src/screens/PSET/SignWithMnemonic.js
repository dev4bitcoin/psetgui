import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
} from 'react-native';
import TopBar from '../../components/TopBar';
import Colors from '../../config/Colors';
import wordList from '../../config/WordList';
import {SignPSETWithMnemonic} from '../../wallet/WalletFactory';

function SignWithMnemonic(props) {
  const {pset, psetDetails} = props.route.params;

  const [lengthSelection, setLengthSelection] = useState('12');
  const [inputValues, setInputValues] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [activeInputIndex, setActiveInputIndex] = useState(null);

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
    const selectedLength = parseInt(lengthSelection, 10); // Convert lengthSelection to a number
    const enteredWords = Object.values(inputValues).filter(
      word => word.trim() !== '',
    ); // Get non-empty words

    if (enteredWords.length === selectedLength) {
      const mnemonic = enteredWords.join(' ');
      const signedPset = await SignPSETWithMnemonic(mnemonic, pset);
      if (signedPset) {
        props.navigation.navigate('Detail', {
          pset: pset,
          signedPset: signedPset,
        });
      } else {
        Alert.alert('Failed to sign PSET');
      }
    } else {
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
        <Text style={styles.index}>{textIndex}</Text>
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
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TopBar showBackButton={true} showBackButtonText={true} />
      <ScrollView style={styles.content}>
        <Text style={styles.header}>Enter your recovery phrase</Text>
        <View style={styles.passphraseLengthSelection}>
          {renderlengthSelectionButtons('12')}
          <View style={styles.splitter} />
          {renderlengthSelectionButtons('24')}
        </View>
        <View style={styles.textInputContainer}>
          {Array.from({length: lengthSelection}, (_, index) =>
            renderTextInput(index + 1),
          )}
        </View>
        <TouchableOpacity onPress={OnSign} style={styles.bottomButtonContainer}>
          <Text style={styles.bottomButtonText}>Sign</Text>
        </TouchableOpacity>
      </ScrollView>
      {suggestions.length > 0 && (
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
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.appBackground,
    paddingTop: 50,
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
    margin: 10,
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
    width: 120,
    height: 40,
    color: Colors.white,
    fontSize: 18,
    paddingLeft: 10,
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
  },
  bottomButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    textAlign: 'center',
  },
});

export default SignWithMnemonic;
