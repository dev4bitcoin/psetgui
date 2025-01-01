import React, {useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';

import Screen from './Screen';
import TopBar from '../components/TopBar';
import Colors from '../config/Colors';

function SendTransactionReview({navigation, route}) {
  const {amount, address} = route.params;

  const [balance, setBalance] = useState(0);

  const onSend = () => {
    navigation.navigate('Success', {address: address, amount: amount});
  };

  const renderAddress = () => {
    const firstPart = address.slice(0, 5);
    const middlePart = address.slice(5, -5);
    const lastPart = address.slice(-5);

    return (
      <Text style={styles.address}>
        <Text style={styles.addressHighlight}>{firstPart}</Text>
        <Text>{middlePart}</Text>
        <Text style={styles.addressHighlight}>{lastPart}</Text>
      </Text>
    );
  };

  return (
    <Screen style={styles.screen}>
      <TopBar title="Review Send" showBackButton={true} />

      <View style={styles.pageContainer}>
        <View style={[styles.borderContainer, {borderBottomWidth: 0}]}>
          <Text style={styles.amount}>{amount} </Text>
          <Text style={styles.denomination}>tl-BTC</Text>
          <Text style={styles.label}>AMOUNT</Text>
        </View>
        <View style={[styles.borderContainer, {borderBottomWidth: 0}]}>
          {renderAddress()}
          <Text style={styles.label}>DESTINATION</Text>
        </View>
        <View style={styles.borderContainer}>
          <Text style={styles.fee}>{address}</Text>
          <Text style={styles.label}>TRANSACTION SPEED</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={onSend}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Send</Text>
            </View>
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
  pageContainer: {
    padding: 20,
    flex: 1,
    marginTop: 20,
  },
  borderContainer: {
    alignItems: 'center',
    borderColor: Colors.textGray,
    borderTopWidth: 0.2,
    borderBottomWidth: 0.2,
    paddingVertical: 20,
  },
  amount: {
    fontSize: 40,
    color: Colors.white,
  },
  label: {
    fontSize: 16,
    color: Colors.textGray,
    marginTop: 20,
  },
  denomination: {
    fontSize: 16,
    color: Colors.white,
    marginTop: 15,
  },
  address: {
    fontSize: 25,
    color: Colors.white,
    marginTop: 15,
  },
  addressHighlight: {
    color: Colors.primary,
  },
  fee: {
    fontSize: 25,
    color: Colors.white,
    marginTop: 15,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    left: 20,
  },
  button: {
    borderRadius: 50,
    backgroundColor: Colors.white,
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: Colors.black,
    padding: 10,
  },
});

export default SendTransactionReview;
