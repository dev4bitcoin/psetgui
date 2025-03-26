import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  RefreshControl,
  StatusBar,
  Platform,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native'; // Import the hook

import colors from '../config/Colors';
import TransactionButtons from '../components/TransactionButtons';
import TopBar from '../components/TopBar';
import Transactions from './Transactions';

import Transaction from '../models/Transaction';
import UnitConverter from '../helpers/UnitConverter';
import Constants from '../config/Constants';
import {AppContext} from '../context/AppContext';
import WalletFactory from '../wallet/WalletFactory';
import LoadingScreen from './LoadingScreen';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function WalletScreen({route, navigation}) {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const {preferredBitcoinUnit} = useContext(AppContext);
  const isFocused = useIsFocused(); // Check if the screen is focused

  const getTransactions = async () => {
    try {
      const transactionsData = await WalletFactory.GetTransactions();
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
      const walletBalances = await WalletFactory.GetBalance();
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
      const storedTransactions = await WalletFactory.GetSavedTransactions();
      const storedBalance = await WalletFactory.GetSavedBalance();
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
    const description = await WalletFactory.GetNewAddress();
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
      {loading && <LoadingScreen />}
      <StatusBar
        backgroundColor={
          isFocused ? colors.cardBackground : colors.appBackground
        } // Android: Sets the background color
      />
      <View
        style={[
          styles.balanceRow,
          {paddingTop: Platform.OS == 'android' ? 0 : 50},
        ]}>
        <TopBar title="Balance" isHomeScreen={true} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            tintColor={colors.white}
          />
        }>
        <View style={[styles.headerRow]}>
          <View style={[styles.balanceContainer]}>
            <Text style={styles.balance}>
              {displayBalanceInPreferredUnit() || '0'}
            </Text>
            <Text style={styles.denomination}>{preferredBitcoinUnit}</Text>
          </View>
        </View>
        <View style={styles.placeholder}>
          <View style={[styles.transactionButtonsContainer]}>
            <TransactionButtons
              onSendPress={onSend}
              onReceivePress={onReceive}
            />
          </View>
        </View>
        <Transactions
          transactions={transactions}
          onTransactionDetail={onTransactionDetails}
          onRefresh={onRefresh}
          denomination={preferredBitcoinUnit}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  balanceRow: {
    width: '100%',
    backgroundColor: colors.cardBackground,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.cardBackground,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  headerRow: {
    paddingTop: 20,
    paddingHorizontal: 20,
    height: 160,
    width: '100%',
    backgroundColor: colors.cardBackground,
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
  placeholder: {
    //height: 50,
    backgroundColor: colors.appBackground,
  },
  transactionButtonsContainer: {
    alignItems: 'center',
    marginTop: -55,
    //backgroundColor: colors.appBackground,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 5,
    //borderColor: colors.textGray,
    //borderWidth: 0.5,
  },
});

export default WalletScreen;
