import React, {useState, useEffect, useContext} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import colors from '../config/Colors';

import Screen from './Screen';
import Numpad from '../components/Numpad';
import TopBar from '../components/TopBar';
import {AppContext} from '../context/AppContext';

function SendScreen(props) {
  const {preferredBitcoinUnit} = useContext(AppContext);

  const {balance} = props.route.params;
  const [amount, setAmount] = useState('0');
  const [fontSize, setFontSize] = useState(32);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  useEffect(() => {
    // Adjust font size based on the length of the amount
    if (amount.length > 10) {
      setFontSize(30);
    } else if (amount.length > 8) {
      setFontSize(36);
    } else {
      setFontSize(50);
    }
  }, [amount]);

  const onPressNumber = number => {
    ReactNativeHapticFeedback.trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });

    setAmount(prevAmount => {
      if (number === '.' && prevAmount.includes('.')) {
        return prevAmount;
      }
      // Handle leading zero
      else if (prevAmount === '0' && number !== '.') {
        return number;
      }
      // Handle period at the beginning
      else if (prevAmount === '0' && number === '.') {
        return '0.';
      }
      // Prevent leading zeros
      else if (prevAmount === '' && number === '0') {
        return '0';
      }
      // Prevent multiple leading zeros
      else if (prevAmount === '0' && number === '0') {
        return '0';
      }

      // Restrict to 15 digits
      else if (prevAmount.replace('.', '').length >= 15) {
        return prevAmount;
      }

      const newAmount = prevAmount + number;
      console.log('newAmount', newAmount);
      // Check if the new amount exceeds the balance
      if (newAmount > balance) {
        setShowErrorMessage(true);
      } else {
        setShowErrorMessage(false);
      }

      return newAmount;
    });
  };

  const onBackspace = () => {
    ReactNativeHapticFeedback.trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });

    setAmount(prevAmount => {
      if (prevAmount === '' || prevAmount === '0') {
        return '0';
      }
      const newAmount = prevAmount?.slice(0, -1);

      // Check if the new amount exceeds the balance
      if (newAmount < balance) {
        setShowErrorMessage(false);
      } else {
        setShowErrorMessage(false);
      }

      return newAmount === '' ? '0' : newAmount;
    });
  };

  const onChooseRecipient = () => {
    props.navigation.navigate('SelectRecipient', {
      amount: amount,
    });
  };

  const isAmountGreaterThanZero = parseFloat(amount) > 0;

  return (
    <Screen style={[styles.screen]}>
      <View style={styles.container}>
        <TopBar title="Send" showBackButton={true} />

        <View style={styles.available}>
          <Text style={styles.availableText}>{`Available: ${balance}`}</Text>
        </View>
        <View
          style={[
            styles.balanceContainer,
            {
              borderColor: showErrorMessage ? colors.error : colors.black,
            },
          ]}>
          <Text style={[styles.balance, {fontSize}]} numberOfLines={1}>
            {amount ? amount : '0'}
          </Text>
          <Text style={styles.denomination}>{preferredBitcoinUnit}</Text>
        </View>
        {showErrorMessage && (
          <View style={styles.errorPanel}>
            <Text style={styles.errorText}>Insufficient funds</Text>
          </View>
        )}
        <View style={[styles.numpad, {marginTop: showErrorMessage ? 0 : 20}]}>
          <Numpad onDelete={onBackspace} onPressNumber={onPressNumber} />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={onChooseRecipient}
            style={[
              styles.button,
              (showErrorMessage || !isAmountGreaterThanZero || balance === 0) &&
                styles.buttonDisabled,
            ]}
            disabled={showErrorMessage || !isAmountGreaterThanZero}>
            <Text style={styles.buttonText}>Choose Recipient</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  numpad: {
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  button: {
    borderRadius: 50,
    backgroundColor: colors.white,
    padding: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: colors.black,
    padding: 10,
  },
  buttonDisabled: {
    backgroundColor: colors.lightGray,
    borderRadius: 50,
    padding: 10,
    width: '100%',
  },
  balanceContainer: {
    alignItems: 'center',
    marginTop: 20,
    height: 120, // Ensure the container has a fixed height
    borderWidth: 0.5,
    marginHorizontal: 20,
    marginBottom: 0,
  },
  balance: {
    fontSize: 50,
    color: colors.white,

    textAlignVertical: 'center',
    textAlign: 'center',
    flex: 1,
    padding: 10,
  },
  denomination: {
    fontSize: 15,
    color: colors.white,
    marginTop: 20,
    marginBottom: 20,
  },
  available: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  availableText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
  errorPanel: {
    margin: 20,
    marginTop: 0,
    marginBottom: 0,
    borderWidth: 0.5,
    borderColor: colors.error,
    backgroundColor: colors.error,
    padding: 15,
  },
  errorText: {
    fontSize: 18,
    color: colors.white,
    textAlign: 'center',
  },
});

export default SendScreen;
