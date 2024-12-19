import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Linking} from 'react-native';
import colors from '../config/Colors';
import TopBar from '../components/TopBar';
import Screen from './Screen';

function TransactionDetail(props) {
  const {transaction} = props.route.params;
  const balance = Object.values(transaction.balance)[0];
  const isIncoming = transaction.type === 'incoming';

  const onViewDetail = () => {
    const url = `https://blockstream.info/liquidtestnet/tx/${transaction.txid}`;
    Linking.openURL(url);
  };

  return (
    <Screen>
      <TopBar title="Transaction" showBackButton={true} />

      <View style={styles.container}>
        <Text style={[styles.balance, isIncoming ? styles.green : styles.red]}>
          {balance}
        </Text>
        <Text style={styles.denomiantion}>tL-BTC</Text>

        <View style={styles.detailRow}>
          <Text style={styles.title}>Transaction ID</Text>
          <Text style={styles.value} numberOfLines={1} ellipsizeMode="middle">
            {transaction.txid}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.title}>Fee</Text>
          <Text style={styles.value}>{transaction.fee}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.title}>Height</Text>
          <Text style={styles.value}>{transaction.height}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.title}>Timestamp</Text>
          <Text style={styles.value}>
            {new Date(transaction.timestamp * 1000).toLocaleString()}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.title}>Type</Text>
          <Text style={styles.value}>{transaction.type}</Text>
        </View>
        <View style={styles.button}>
          <TouchableOpacity onPress={onViewDetail}>
            <Text style={styles.buttonText}>View in Block Explorer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  balance: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    paddingBottom: 10,
    textAlign: 'center',
  },
  denomiantion: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.textGray,
    marginBottom: 20,
  },
  green: {
    color: colors.priceGreen,
  },
  red: {
    color: colors.priceRed,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 15,
    borderTopWidth: 0.3,
    borderColor: colors.textGray,
    paddingTop: 10,
    paddingBottom: 0,
  },
  title: {
    fontWeight: 'bold',
    color: colors.textGray,
    fontSize: 16,
    paddingTop: 5,
    paddingRight: 10,
  },
  value: {
    flex: 1,
    textAlign: 'right',
    color: colors.white,
    fontSize: 16,
    paddingTop: 5,
  },
  button: {
    backgroundColor: colors.lightGray,
    padding: 20,
    borderRadius: 20,
    marginTop: 70,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
  },
});

export default TransactionDetail;
