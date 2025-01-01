import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

import colors from '../config/Colors';

function Transactions({transactions, onScroll, refreshing, onRefresh}) {
  const navigation = useNavigation();

  // Step 1: Sort transactions by timestamp
  const sortedTransactions = transactions.sort(
    (a, b) => b.timestamp - a.timestamp,
  );

  // Step 2: Group transactions by date
  const groupedTransactions = sortedTransactions.reduce(
    (groups, transaction) => {
      const date = new Date(transaction.timestamp * 1000).toLocaleDateString(
        'en-US',
      );
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    },
    {},
  );

  // Convert groupedTransactions to an array of sections
  const sections = Object.keys(groupedTransactions).map(date => ({
    title: date,
    data: groupedTransactions[date],
  }));

  // Helper function to format date
  const formatDate = dateString => {
    const [month, day, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  };

  const onTransactionDetail = transaction => {
    navigation.navigate('TransactionDetail', {transaction: transaction});
  };

  const renderTransaction = ({item}) => {
    const balance = Object.values(item.balance)[0];

    return (
      <View style={styles.transaction}>
        <TouchableOpacity onPress={() => onTransactionDetail(item)}>
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
      </View>
    );
  };

  const renderSectionHeader = ({section: {title}}) => (
    <View style={styles.dateContainer}>
      <Text style={styles.date}>{formatDate(title)}</Text>
    </View>
  );

  return (
    <Animated.SectionList
      style={styles.transactions}
      sections={sections}
      keyExtractor={item => item.txid}
      renderItem={renderTransaction}
      renderSectionHeader={renderSectionHeader}
      stickySectionHeadersEnabled={true}
      onScroll={onScroll}
      contentContainerStyle={styles.contentContainerStyle} // Add padding to the bottom
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  transactions: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  dateContainer: {
    alignItems: 'center',
    backgroundColor: colors.black,
    padding: 10,
    borderBottomWidth: 0.3,
    borderColor: colors.textGray,
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
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  transactionId: {
    color: colors.white,
  },
  balance: {
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
  contentContainerStyle: {
    paddingBottom: 100,
  },
});

export default Transactions;
