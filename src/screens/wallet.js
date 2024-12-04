import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Wollet, Client, Signer, Network} from 'lwk-rn';

import colors from '../config/Colors';
import TransactionButtons from '../components/TransactionButtons';

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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
