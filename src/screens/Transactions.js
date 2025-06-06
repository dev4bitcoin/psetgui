import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SectionList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

import colors from '../config/Colors';

function Transactions({transactions, denomination}) {
  const navigation = useNavigation();

  // Step 1: Sort transactions by timestamp
  const sortedTransactions = transactions.sort((a, b) => {
    if (a.timestamp === null && b.timestamp !== null) {
      return -1; // Place `a` before `b`
    }
    if (a.timestamp !== null && b.timestamp === null) {
      return 1; // Place `b` before `a`
    }
    // If both have timestamps, sort by descending timestamp
    return b.timestamp - a.timestamp;
  });

  // Step 2: Group transactions by date
  const groupedTransactions = sortedTransactions.reduce(
    (groups, transaction) => {
      const date =
        transaction.timestamp === null
          ? new Date().toLocaleDateString('en-US') // Use system timezone for null timestamps
          : new Date(transaction.timestamp * 1000).toLocaleDateString('en-US'); // Use system timezone for valid timestamps

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

  const onTransactionDetail = (transaction, balanceInPreferredDenomination) => {
    navigation.navigate('TransactionDetail', {
      transaction: transaction,
      balance: balanceInPreferredDenomination,
      unit: denomination,
    });
  };

  const formatTimestamp = timestamp => {
    if (timestamp === null) {
      return 'now'; // Handle null timestamp
    }

    const now = new Date();
    const date = new Date(timestamp * 1000); // Convert to milliseconds

    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    const diffInYears = now.getFullYear() - date.getFullYear();
    const diffInMonths =
      (now.getFullYear() - date.getFullYear()) * 12 +
      (now.getMonth() - date.getMonth());

    if (diffInYears >= 1) {
      if (diffInMonths < 12) {
        return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
      } else {
        return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
      }
    } else if (diffInMonths >= 1) {
      return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
    } else if (diffInDays >= 1) {
      if (diffInDays === 1) {
        return 'yesterday';
      } else {
        return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
      }
    } else if (diffInHours >= 1) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInMinutes >= 1) {
      return `${diffInMinutes} ${
        diffInMinutes === 1 ? 'minute' : 'minutes'
      } ago`;
    } else {
      return 'now';
    }
  };

  const renderTransaction = ({item}) => {
    return (
      <View style={styles.transaction}>
        <TouchableOpacity
          onPress={() => onTransactionDetail(item, item?.balance)}>
          <View style={styles.transactionDetails}>
            <View style={styles.transactionIdContainer}>
              <View style={styles.incomingTextContainer}>
                <Icon
                  name={item.type == 'incoming' ? 'arrow-down' : 'arrow-up'}
                  color={
                    item.type == 'incoming'
                      ? colors.priceGreen
                      : colors.priceRed
                  }
                  size={20}
                />

                <Text
                  numberOfLines={1}
                  ellipsizeMode="end"
                  style={styles.transactionId}>
                  {item.type === 'incoming' ? 'Received' : 'Sent'}
                </Text>
              </View>
              <Text style={styles.numberOfDays}>
                {formatTimestamp(item.timestamp)}
                {item?.timestamp === null && (
                  <Text style={[styles.numberOfDays, {color: colors.orange}]}>
                    {' '}
                    (Pending Confirmation)
                  </Text>
                )}
              </Text>
            </View>
            <View style={styles.balanceContainer}>
              <Text
                style={[
                  styles.balance,
                  item.type === 'incoming' ? styles.green : styles.red,
                ]}>
                {item?.balance}
              </Text>
              <Text style={styles.denomination}>{denomination}</Text>
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
    <SectionList
      style={styles.transactions}
      sections={sections}
      keyExtractor={item => item.txid}
      renderItem={renderTransaction}
      renderSectionHeader={renderSectionHeader}
      stickySectionHeadersEnabled={true}
      contentContainerStyle={styles.contentContainerStyle} // Add padding to the bottom
      scrollEnabled={false}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            You don't have any transactions yet.
          </Text>
        </View>
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
    backgroundColor: colors.appBackground,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionIdContainer: {
    width: '65%',
  },
  incomingTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceContainer: {
    width: '35%',
  },
  transactionId: {
    fontSize: 16,
    paddingLeft: 5,
    color: colors.white,
  },
  numberOfDays: {
    fontSize: 16,
    color: colors.textGray,
    paddingLeft: 5,
    paddingTop: 5,
  },
  balance: {
    fontWeight: 'bold',
    paddingRight: 5,
    fontSize: 16,
    textAlign: 'right',
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
  denomination: {
    fontSize: 14,
    color: colors.textGray,
    paddingTop: 5,
    textAlign: 'right',
    paddingRight: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: colors.textGray,
  },
});

export default Transactions;
