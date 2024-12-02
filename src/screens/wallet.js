import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

import colors from '../config/colors';
import TransactionButtons from '../components/transactionbuttons';

function Wallet(props) {
  const balance = '0';

  return (
    <View style={styles.container}>
      <View style={styles.wallet}>
        <View style={styles.balanceContainer}>
          <Text style={styles.balance}>{balance}</Text>
          <Text style={styles.denomination}>tL-BTC</Text>
        </View>
        <TransactionButtons />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  wallet: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  balanceContainer: {
    //flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balance: {
    fontSize: 45,
    color: colors.white,
  },
  denomination: {
    fontSize: 15,
    color: colors.textGray,
    marginTop: 5,
    marginLeft: 10,
  },
});

export default Wallet;
