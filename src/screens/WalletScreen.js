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
import LoadingScreen from './LoadingScreen';
import UnitConverter from '../helpers/UnitConverter';
import Constants from '../config/Constants';
import {AppContext} from '../context/AppContext';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function WalletScreen({navigation}) {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
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

      const convertedDenominationAmount =
        UnitConverter.convertToPreferredBTCDenominator(
          totalBalance,
          preferredBitcoinUnit,
        );
      setBalance(convertedDenominationAmount);
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
    navigation.navigate('SendScreen', {balance: balance});
  };

  const onReceive = async () => {
    const {description, qr_code_text, is_blinded} = await GetNewAddress();
    navigation.navigate('Receive', {address: description});
  };

  const balanceContainerTranslateX = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 10],
    extrapolate: 'clamp',
  });

  const transactionButtonsTranslateX = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -20],
    extrapolate: 'clamp',
  });

  const headerRowTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -20],
    extrapolate: 'clamp',
  });

  const balanceContainerScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.7],
    extrapolate: 'clamp',
  });

  const transactionButtonsScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.7],
    extrapolate: 'clamp',
  });

  const handleScroll = Animated.event(
    [{nativeEvent: {contentOffset: {y: scrollY}}}],
    {
      useNativeDriver: true,
      listener: event => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setIsScrolledUp(offsetY > 50);
      },
    },
  );

  const onTransactionDetails = transaction => {
    navigation.navigate('TransactionDetails', {transaction});
  };

  return (
    <View style={styles.container}>
      <TopBar title="Wallet" showRefreshButton={false} />
      {loading && <LoadingScreen />}

      <Animated.View
        style={[
          styles.headerRow,
          {
            flexDirection: isScrolledUp === true ? 'row' : 'column',
            transform: [{translateY: headerRowTranslateY}],
          },
        ]}>
        <Animated.View
          style={[
            styles.balanceContainer,
            {
              transform: [
                {translateX: balanceContainerTranslateX},
                {scale: balanceContainerScale},
              ],
              marginTop: isScrolledUp ? 20 : 0,
              marginBottom: isScrolledUp ? 10 : 25,
              marginLeft: isScrolledUp ? 40 : 0,
            },
          ]}>
          <Text style={styles.balance}>{balance}</Text>
          <Text style={styles.denomination}>{preferredBitcoinUnit}</Text>
        </Animated.View>
        <Animated.View
          style={[
            styles.transactionButtonsContainer,
            {
              transform: [
                {translateX: transactionButtonsTranslateX},
                {scale: transactionButtonsScale},
              ],
            },
          ]}>
          <TransactionButtons
            onSendPress={onSend}
            onReceivePress={onReceive}
            hideLabel={isScrolledUp}
          />
        </Animated.View>
      </Animated.View>
      <Transactions
        transactions={transactions}
        onScroll={handleScroll}
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
    alignItems: 'center',
    backgroundColor: colors.appBackground,
    paddingTop: 50,
  },
  headerRow: {
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  balanceContainer: {
    alignItems: 'center',
  },
  balance: {
    fontSize: 45,
    color: colors.white,
  },
  denomination: {
    fontSize: 15,
    color: colors.textGray,
    marginTop: 5,
  },
  transactionButtonsContainer: {
    //marginTop: 20,
  },
  scrollView: {
    // flex: 1,
    // width: '100%',
  },
});

export default WalletScreen;
