import React, {useEffect, useState, useRef, useContext} from 'react';
import {View, StyleSheet, Text, Animated} from 'react-native';

import colors from '../config/Colors';
import TransactionButtons from '../components/TransactionButtons';
import TopBar from '../components/TopBar';
import Transactions from './Transactions';
import {
  GetTransactions,
  GetNewAddress,
  GetBalance,
  GetSavedBalance,
  GetSavedTransactions,
} from '../wallet/WalletFactory';
import Transaction from '../models/Transaction';
import UnitConverter from '../helpers/UnitConverter';
import Constants from '../config/Constants';
import {AppContext} from '../context/AppContext';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function WalletScreen({navigation}) {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const {preferredBitcoinUnit} = useContext(AppContext);

  const getTransactions = async () => {
    try {
      const transactionsData = await GetTransactions();
      const mappedTransactions = transactionsData.map(
        tx => new Transaction(tx),
      );

      setTransactions(mappedTransactions);
    } catch (error) {
      console.error(error);
    }
  };

  const getBalance = async () => {
    try {
      const walletBalances = await GetBalance();
      const totalBalance = Object.values(walletBalances).reduce(
        (sum, balance) => sum + balance,
        0,
      );

      setBalance(totalBalance);
    } catch (error) {
      console.error(error);
    }
  };

  const onRefresh = async () => {
    setLoading(true);
    await sleep(2000);

    try {
      await getBalance();
      await getTransactions();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadStoredData = async () => {
    try {
      const storedTransactions = await GetSavedTransactions();
      const storedBalance = await GetSavedBalance();
      setTransactions(storedTransactions);
      setBalance(storedBalance);
    } catch (error) {
      console.error('Failed to load stored data', error);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      await loadStoredData();
      await getBalance();
      await getTransactions();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onSend = async () => {
    navigation.navigate('SendScreen', {
      balance: displayBalanceInPreferredUnit(),
    });
  };

  const onReceive = async () => {
    const {description, qr_code_text, is_blinded} = await GetNewAddress();
    navigation.navigate('Receive', {address: description});
  };

  const onTransactionDetails = transaction => {
    navigation.navigate('TransactionDetails', {transaction});
  };

  const displayBalanceInPreferredUnit = () => {
    const convertedDenominationAmount =
      UnitConverter.convertToPreferredBTCDenominator(
        balance,
        preferredBitcoinUnit,
      );
    return convertedDenominationAmount;
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TopBar title="Balance" />
        <View style={[styles.headerRow]}>
          <View style={[styles.balanceContainer]}>
            <Text style={styles.balance}>
              {displayBalanceInPreferredUnit() || '0'}
            </Text>
            <Text style={styles.denomination}>{preferredBitcoinUnit}</Text>
          </View>
        </View>
      </View>
      <View style={[styles.transactionButtonsContainer]}>
        <TransactionButtons onSendPress={onSend} onReceivePress={onReceive} />
      </View>
      <Transactions
        transactions={transactions}
        onTransactionDetail={onTransactionDetails}
        refreshing={loading}
        onRefresh={onRefresh}
        denomination={preferredBitcoinUnit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  topRow: {
    width: '100%',
    backgroundColor: colors.cardBackground,
    paddingTop: 50,
  },
  headerRow: {
    paddingTop: 20,
    paddingHorizontal: 20,
    height: 180,
  },
  balanceContainer: {
    alignItems: 'center',
  },
  balance: {
    fontSize: 35,
    color: colors.white,
  },
  denomination: {
    fontSize: 15,
    color: colors.textGray,
    marginTop: 5,
  },
  transactionButtonsContainer: {
    alignItems: 'center',
    marginTop: -65,
    backgroundColor: colors.appBackground,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 5,
    borderColor: colors.textGray,
    borderWidth: 0.5,
  },
});

export default WalletScreen;
