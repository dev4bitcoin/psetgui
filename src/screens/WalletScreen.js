import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';

import colors from '../config/Colors';
import TransactionButtons from '../components/TransactionButtons';
import TopBar from '../components/TopBar';
import Transactions from './Transactions';
import {
  GetWollet,
  GetTransactions,
  GetNewAddress,
  GetBalance,
} from '../wallet/WalletFactory';
import Transaction from '../models/Transaction';

function WalletScreen(props) {
  const [balance, setBalance] = useState(0);
  const [wollet, setWollet] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const getTransactions = async wallet => {
    try {
      const transactionsData = await GetTransactions(wallet);
      const mappedTransactions = transactionsData.map(
        tx => new Transaction(tx),
      );

      setTransactions(mappedTransactions);
      console.log('transactions', transactions);
    } catch (error) {
      console.error(error);
    }
  };

  const getBalance = async wallet => {
    try {
      const walletBalances = await GetBalance(wallet);
      const totalBalance = Object.values(walletBalances).reduce(
        (sum, balance) => sum + balance,
        0,
      );
      setBalance(totalBalance.toLocaleString());
    } catch (error) {
      console.error(error);
    }
  };

  const loadData = async () => {
    try {
      const wallet = await GetWollet();
      setWollet(wallet);
      getBalance(wallet);
      getTransactions(wallet);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onSend = async () => {
    try {
      const transactions = await GetTransactions(wollet);
      setTransactions(transactions);
      console.log('transactions', transactions);
    } catch (error) {
      console.error(error);
    }
  };

  const onReceive = async () => {
    const {description, qr_code_text, is_blinded} = await GetNewAddress(wollet);
    console.log('description', description);
    console.log('qr_code_text', qr_code_text);
    props.navigation.navigate('Receive', {address: description});
  };

  return (
    <View style={styles.container}>
      <TopBar title="Wallet" />
      <View style={styles.wallet}>
        <View style={styles.balanceContainer}>
          <Text style={styles.balance}>{balance}</Text>
          <Text style={styles.denomination}>tL-BTC</Text>
        </View>
        <TransactionButtons onSendPress={onSend} onReceivePress={onReceive} />
        <Transactions transactions={transactions} />
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
