import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';

import colors from '../config/Colors';

import Screen from './Screen';
import Numpad from '../components/Numpad';
import TopBar from '../components/TopBar';

function SendScreen(props) {
  const {showScannerScreen} = props.route.params;
  const [showScanner, setShowScanner] = useState(showScannerScreen);
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(0);

  const onPressNumber = number => {
    console.log('number', number);

    setAmount(prevAmount => {
      // Prevent adding another period if one already exists
      if (number === '.' && prevAmount.includes('.')) {
        return prevAmount;
      }
      // Handle leading zero
      if (prevAmount === '0' && number !== '.') {
        return number;
      }
      // Handle period at the beginning
      if (prevAmount === '' && number === '.') {
        return '0.';
      }
      // Prevent leading zeros
      if (prevAmount === '' && number === '0') {
        return '0';
      }
      // Prevent multiple leading zeros
      if (prevAmount === '0' && number === '0') {
        return '0';
      }

      return prevAmount + number;
    });
  };

  const onBackspace = () => {
    setAmount(prevAmount => {
      console.log('prevAmount', prevAmount);
      if (prevAmount === '' || prevAmount == undefined || prevAmount === 0) {
        return;
      }
      return prevAmount.slice(0, -1);
    });
  };

  const onChooseRecipient = () => {
    props.navigation.navigate('SelectRecipient', {amount: amount});
  };

  const isAmountGreaterThanZero = parseFloat(amount) > 0;

  return (
    <Screen style={[styles.screen]}>
      <View style={styles.container}>
        <TopBar title="Send" showBackButton={true} />

        <View style={styles.available}>
          <Text style={styles.availableText}>{`Available: ${balance}`}</Text>
        </View>
        <View style={styles.balanceContainer}>
          <Text style={styles.balance}> {amount ? amount : '0'}</Text>
          <Text style={styles.denomination}>tL-BTC</Text>
        </View>
        <View style={styles.numpad}>
          <Numpad onDelete={onBackspace} onPressNumber={onPressNumber} />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={onChooseRecipient}
            style={[
              styles.button,
              !isAmountGreaterThanZero && styles.buttonDisabled,
            ]}
            disabled={!isAmountGreaterThanZero}>
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
    marginTop: 40,
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
  },
  balance: {
    fontSize: 50,
    color: colors.white,
  },
  denomination: {
    fontSize: 15,
    color: colors.white,
    marginTop: 20,
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
});

export default SendScreen;
