import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Screen from './Screen';
import TopBar from '../components/TopBar';

function SendTransactionReview(props) {
  const [balance, setBalance] = useState(0);
  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        <TopBar title="Review Transaction" showBackButton={true} />

        <View style={styles.pageContainer}>
          <View style={styles.available}>
            <Text style={styles.availableText}>{`Available: ${balance}`}</Text>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    //flex: 1,
  },
  pageContainer: {
    padding: 20,
  },
  available: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  availableText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
  availableAmount: {
    fontSize: 16,
  },
});

export default SendTransactionReview;
