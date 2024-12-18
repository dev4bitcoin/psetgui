import React from 'react';
import {View, StyleSheet, FlatList, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../config/Colors';

function Transactions({transactions}) {
  const renderTransaction = ({item}) => {
    const balance = Object.values(item.balance)[0];
    const transactionDate = new Date(item.timestamp * 1000);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    let formattedDate;
    if (transactionDate.toDateString() === today.toDateString()) {
      formattedDate = 'Today';
    } else if (transactionDate.toDateString() === tomorrow.toDateString()) {
      formattedDate = 'Tomorrow';
    } else {
      formattedDate = transactionDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    }

    return (
      <View style={styles.transaction}>
        <View style={styles.dateContainer}>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
        <TouchableOpacity>
          <View style={styles.transactionDetails}>
            <View style={styles.transactionIdContainer}>
              <Text
                numberOfLines={1}
                ellipsizeMode="end"
                style={styles.transactionId}>
                {item.txid}
              </Text>
            </View>
            <View style={styles.balanceContainer}>
              <Text
                style={[
                  styles.balance,
                  item.type === 'incoming' ? styles.green : styles.red,
                ]}>
                {balance}
              </Text>
              <Icon
                name={item.type == 'incoming' ? 'arrow-up' : 'arrow-down'}
                color={
                  item.type == 'incoming' ? colors.priceGreen : colors.priceRed
                }
                size={20}
              />
            </View>
          </View>
        </TouchableOpacity>
        {/* <Text>Type: {item.type}</Text>
        <Text>Fee: {item.fee}</Text>
        <Text>Height: {item.height}</Text> */}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.transactions}
        data={transactions || []}
        renderItem={renderTransaction}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  transactions: {
    padding: 10,
  },
  dateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderBottomWidth: 0.3,
    borderColor: '#ccc',
    position: 'relative',
  },
  date: {
    color: colors.textGray,
    backgroundColor: colors.black,
    paddingHorizontal: 5,
    position: 'absolute',
    top: 10,
  },
  transactionDetails: {
    width: '100%',
    padding: 5,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionIdContainer: {
    width: '70%',
  },
  balanceContainer: {
    width: '30%',
    //alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  transactionId: {
    color: colors.white,
  },
  balance: {
    //color: colors.white,
    fontWeight: 'bold',
    paddingRight: 5,
    fontSize: 16,
  },
  transaction: {
    padding: 10,
    borderRadius: 20,
  },
  green: {
    color: colors.priceGreen,
  },
  red: {
    color: colors.priceRed,
  },
});

export default Transactions;
