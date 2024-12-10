import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

import colors from '../config/Colors1';
import TransactionButtons from '../components/TransactionButtons1';
//import Screen from './screen';
import TopBar from '../components/TopBar1';
import Transactions from './Transactions';
import {CreateNewWallet} from '../wallet/WalletFactory';

function WalletScreen(props) {
  const balance = '0';

  const onSend = () => {
    console.log('Send');
    try {
      //const mnemonic = bip39.generateMnemonic();
      //console.log(mnemonic);

      CreateNewWallet();
    } catch (error) {
      console.error(error);
    }
    //const wallet = new Wallet();
  };

  return (
    <View style={styles.container}>
      <TopBar title="Wallet" />
      <View style={styles.wallet}>
        <View style={styles.balanceContainer}>
          <Text style={styles.balance}>{balance}</Text>
          <Text style={styles.denomination}>tL-BTC</Text>
        </View>
        <TransactionButtons onSendPress={onSend} />
        <Transactions />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.appBackground,
    paddingTop: 50,
  },
  wallet: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  balanceContainer: {
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

export default WalletScreen;
