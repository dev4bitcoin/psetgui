import React, {useContext} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../config/Colors';
import Screen from './Screen';
import TopBar from '../components/TopBar';
import {AppContext} from '../context/AppContext';

function SelectRecipient(props) {
  const {amount} = props.route.params;
  const {preferredBitcoinUnit} = useContext(AppContext);

  const onScan = () => {
    props.navigation.navigate('ScanScreen', {amount: amount});
  };

  const onEnterAddress = () => {
    props.navigation.navigate('SendToAddress', {amount: amount});
  };

  return (
    <Screen style={styles.screen}>
      <TopBar
        title={`${amount}   ${preferredBitcoinUnit}`}
        showBackButton={true}
      />

      <View style={styles.container}>
        <Text style={styles.text}>Select recipient address option</Text>
        <View style={styles.transactionButtons}>
          <TouchableOpacity onPress={onScan}>
            <View style={styles.iconContainer}>
              <View style={styles.iconWrapper}>
                <Icon name="qrcode" color={colors.white} size={60} />
              </View>
              <Text style={styles.iconText}>Scan Code</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={onEnterAddress}>
            <View style={styles.iconContainer}>
              <View style={styles.iconWrapper}>
                <Icon name="login" color={colors.white} size={60} />
              </View>
              <Text style={styles.iconText}>Enter Address</Text>
            </View>
          </TouchableOpacity>
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
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
    padding: 10,
  },
  iconWrapper: {
    backgroundColor: colors.lightGray,
    borderRadius: 50,
    padding: 20,
  },
  iconText: {
    color: colors.white,
    marginTop: 10,
  },
  text: {
    fontSize: 30,
    color: colors.textGray,
    marginBottom: 80,
    textAlign: 'center',
  },
});

export default SelectRecipient;
