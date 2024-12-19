import React, {useEffect, useState, useRef} from 'react';
import {View, StyleSheet, Text, Animated} from 'react-native';

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

function WalletScreen({navigation}) {
  const [balance, setBalance] = useState(0);
  const [wollet, setWollet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isScrolledUp, setIsScrolledUp] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;

  const getTransactions = async wallet => {
    try {
      const transactionsData = await GetTransactions(wallet);
      const mappedTransactions = transactionsData.map(
        tx => new Transaction(tx),
      );

      setTransactions(mappedTransactions);
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

  const balanceContainerTranslateX = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 10],
    extrapolate: 'clamp',
  });

  const transactionButtonsTranslateX = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 10],
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
    console.log('transaction', transaction);
    navigation.navigate('TransactionDetails', {transaction});
  };

  return (
    <View style={styles.container}>
      <TopBar title="Wallet" />
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
              marginBottom: isScrolledUp ? 10 : 40,
            },
          ]}>
          <Text style={styles.balance}>{balance}</Text>
          <Text style={styles.denomination}>tL-BTC</Text>
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
    marginLeft: 10,
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
