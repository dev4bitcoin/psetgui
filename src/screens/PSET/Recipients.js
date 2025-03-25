import React, {useContext} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Screen from '../Screen';
import TopBar from '../../components/TopBar';
import Colors from '../../config/Colors';
import {AppContext} from '../../context/AppContext';
import UnitConverter from '../../helpers/UnitConverter';

function Recipients(props) {
  const {recipients} = props.route.params;
  const {preferredBitcoinUnit} = useContext(AppContext);

  const displayBalanceInPreferredUnit = amount => {
    const convertedDenominationAmount =
      UnitConverter.convertToPreferredBTCDenominator(
        amount,
        preferredBitcoinUnit,
      );
    return convertedDenominationAmount;
  };

  const formatAddress = address => {
    if (!address) return '';
    return address.match(/.{1,4}/g).join(' '); // Split into groups of 4 and join with a space
  };

  return (
    <Screen style={styles.container}>
      <TopBar title="Recipients" showBackButton={true} />
      <View style={styles.content}>
        {recipients.map((recipient, index) => (
          <View key={index} style={styles.recipientItem}>
            <Text style={styles.recipientAmount}>
              {`Amount : ${displayBalanceInPreferredUnit(
                recipient?.amount,
              )}  ${preferredBitcoinUnit}`}
            </Text>
            <Text style={styles.recipientAddress}>
              {`Address:  ${formatAddress(recipient?.address)}`}
            </Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingHorizontal: 40,
  },
  recipientItem: {
    justifyContent: 'space-between',
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: Colors.textGray,
    padding: 10,
    borderRadius: 5,
  },
  recipientAddress: {
    fontSize: 16,
    color: Colors.textGray,
  },
  recipientAmount: {
    fontSize: 16,
    color: Colors.textGray,
    paddingBottom: 25,
  },
});

export default Recipients;
