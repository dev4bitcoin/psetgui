import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../config/Colors';
import Screen from './Screen';
import TopBar from '../components/TopBar';

function SelectRecipient(props) {
  const {amount} = props.route.params;

  const onScan = () => {
    props.navigation.navigate('ScanScreen', {amount: amount});
  };

  const onEnterAddress = () => {
    props.navigation.navigate('SendToAddress', {amount: amount});
  };

  return (
    <Screen style={styles.screen}>
      <TopBar title={amount} showBackButton={true} />

      <View style={styles.container}>
        <View style={styles.transactionButtons}>
          <TouchableOpacity onPress={onScan}>
            <View style={styles.iconContainer}>
              <View style={styles.iconWrapper}>
                <Icon name="qrcode" color={colors.white} size={35} />
              </View>
              <Text style={styles.iconText}>Scan Code</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={onEnterAddress}>
            <View style={styles.iconContainer}>
              <View style={styles.iconWrapper}>
                <Icon name="arrow-up" color={colors.white} size={35} />
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
});

export default SelectRecipient;
